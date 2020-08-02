const {GENESIS_DATA,MINE_RATE}= require('./config')
const cryptoHash = require('./crypto-hash')
const HexToBinary = require('hex-to-binary')
const hexToBinary = require('hex-to-binary')

class Block{
    constructor({timeStamp,lastHash,hash,data,nonce,difficulty}){
        this.timeStamp = timeStamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis(){
        return new this(GENESIS_DATA)
    }

    static mineBlock({lastBlock,data}){
        let hash,timeStamp
        const lastHash = lastBlock.hash
        let {difficulty} = lastBlock
        let nonce = 0

        do{
            nonce++
            timeStamp = Date.now()
            difficulty = Block.adjustDifficulty({originalBlock:lastBlock,timeStamp})
            hash = cryptoHash(timeStamp,lastHash,data,difficulty,nonce)
        }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty))

        return new this({
            timeStamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }

    static adjustDifficulty({originalBlock,timeStamp}){
        const {difficulty} = originalBlock
        const difference = timeStamp - originalBlock.timeStamp

        if(difficulty<1){
            return 1
        }

        if(difference>MINE_RATE){
            return difficulty - 1
        }
        else{
        return difficulty+1

        }

    }
}


module.exports = Block;