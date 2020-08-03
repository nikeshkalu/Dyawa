const Block = require("./block")
const { GENESIS_DATA,MINE_RATE } = require("../config")
const cryptoHash = require("../util/crypto-hash")
const hexToBinary = require('hex-to-binary')

describe('Block',()=>{
    const timeStamp = 3000
    const lastHash = 'foo-hash'
    const hash = 'bar-hash'
    const data = ['blockchain','data']
    const nonce = 1
    const difficulty = 1
    const block = new Block({
        timeStamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty
    })

    it('has a timestamp,lasthash,hash,data,nonce,difficulty property',()=>{
        expect(block.timeStamp).toEqual(timeStamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)


    })

    describe('genesisBlock()',()=>{
        const genesisBlock = Block.genesis()

        it('returns a instance',()=>{
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('returns a genesisData',()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA)
        })
    })

    describe('mineBlock()',()=>{
        const lastBlock = Block.genesis()
        const data = 'mined Data'
        const minedBlock = Block.mineBlock({lastBlock,data})

        it('returns a instance',()=>{
            expect(minedBlock instanceof Block).toBe(true)
        })

        it('checks the `last hash` to be `hash` of last block',()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        })

        it('sets the `data` for block',()=>{
            expect(minedBlock.data).toEqual(data)
        })

        it('sets the `timeStamp`',()=>{
            expect(minedBlock.timeStamp).not.toEqual(undefined)
        })

        it('creates SHA-256 Hash',()=>{
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timeStamp,minedBlock.nonce,minedBlock.difficulty,lastBlock.hash,minedBlock.data))
        })

        it('sets hash that matches the difficulty criteria',()=>{
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })

        it('Adjust the difficulty',()=>{
            const possibleResult = [lastBlock.difficulty + 1,lastBlock.difficulty-1]
            expect(possibleResult.includes(minedBlock.difficulty)).toBe(true)
        })
    })

    describe('Difficulty Adjustment',()=>{
        it('Increase difficulty for quickly mined block',()=>{
            expect(Block.adjustDifficulty({
                originalBlock : block,
                timeStamp : block.timeStamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1)
        })

        it('Decrease difficulty for slowly mined block',()=>{
            expect(Block.adjustDifficulty({
                originalBlock : block,
                timeStamp : block.timeStamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1)
        })

        it('when it has lower limit of 1',()=>{
            block.difficulty = -1
            expect(Block.adjustDifficulty({originalBlock:block})).toEqual(1)
        })
    })
})