const BlockChain = require('./blockchain')
const Block = require('./block')
const cryptoHash  = require('../util/crypto-hash');
const { isValidChain } = require('./blockchain');

describe('BlockChain()',()=>{
    let blockChain,newChain,originalChain;

    
    beforeEach(()=>{
        blockChain = new BlockChain()
        newChain = new BlockChain()
        originalChain = blockChain.chain
    })

    it('contains a `chain` array itself',()=>{
        expect(blockChain.chain instanceof Array).toBe(true)
    })

    it('Start with Genesis Block',()=>{
        expect(blockChain.chain[0]).toEqual(Block.genesis())
    })

    it('adds the new block to the chain',()=>{
        const newdata = 'test data'
        blockChain.addBlock({data:newdata})
        expect(blockChain.chain[blockChain.chain.length-1].data).toEqual(newdata)
    })

    describe('isValidChain()',()=>{

        beforeEach(()=>{
            blockChain.addBlock({data:'Block1'})
            blockChain.addBlock({data:'Block2'})
            blockChain.addBlock({data:'Block3'})
        })

        describe('when chain does not start with genesis block',()=>{
            it('return false',()=>{
                blockChain.chain[0] = {data : 'fake-genesis block'}

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe('when chain start with genesis block and has multiple block',()=>{
            describe('last hash reference value changed',()=>{
                it('returns false',()=>{
                
                    blockChain.chain[2].lastHash = 'wrong last Hash'

                    expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
                    
                })
            })

        describe('Chain contains the block with the invalid field',()=>{
            it('returns false',()=>{
                
                blockChain.chain[2].data = 'Invalid data'

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
                
            })
        })

        describe('Contains the block with the jumped difficulty',()=>{
            it('returns false',()=>{
                const lastBlock = blockChain.chain[blockChain.chain.length-1]
                const lastHash = lastBlock.hash
                const timeStamp = Date.now()
                const nonce = 0
                const data = []
                const difficulty = lastBlock.difficulty - 3

                const hash = cryptoHash(timeStamp,lastHash,nonce,data,difficulty)

                const wrongBlock = new Block({timeStamp,lastHash,hash,nonce,data,difficulty})
                blockChain.chain.push(wrongBlock)
                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe('Chain doesnot contain block with an invalid filed',()=>{
            it('returns ture',()=>{

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(true)
            })
        })
    })

    })

    describe('replaceChain()',()=>{
        let errorMock,logMock;
        beforeEach(()=>{
            errorMock = jest.fn()
            logMock = jest.fn()

            global.console.error = errorMock
            global.console.log = logMock
        })

        describe('New Change is not longer',()=>{
            beforeEach(()=>{
                newChain.chain[0] = {new:'chain'}
                blockChain.replaceChain(newChain.chain)
            })
            it('Does not replace the chain',()=>{
               
                expect(blockChain.chain).toEqual(originalChain)
            })

            it('Logs an error',()=>{
                expect(errorMock).toHaveBeenCalled()
            })
        })

        describe('New Change is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data:'Block1'})
                newChain.addBlock({data:'Block2'})
                newChain.addBlock({data:'Block3'})
            })

            describe('WHen the chain is valid',()=>{
                
                beforeEach(()=>{
                    blockChain.replaceChain(newChain.chain)
                })
                
                it('Replace the chain',()=>{
                    expect(blockChain.chain).toEqual(newChain.chain)
                })

                it('Logs about chain replacement',()=>{
                    expect(logMock).toHaveBeenCalled()
                })
            })

            describe('When the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'fake hash'
                    blockChain.replaceChain(newChain.chain)
                })
                it('Does not replace the chain',()=>{
                    expect(blockChain.chain).toEqual(originalChain)
                })
                it('Logs an error',()=>{
                    expect(errorMock).toHaveBeenCalled()
                })
            })
        })
    })
})
