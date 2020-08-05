const Block = require("./block")
const {cryptoHash} = require('../util/')

class BlockChain {

    constructor(){
        this.chain = [Block.genesis()]
        
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock : this.chain[this.chain.length-1],
            data
        })
      this.chain.push(newBlock)
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false
        }
       

        for(let i = 1;i<chain.length;i++){
            const block = chain[i]
            const {timeStamp,lastHash,hash,data,difficulty,nonce} = block

            const actualLastHash = chain[i-1].hash
            const lastDifficulty = chain[i-1].difficulty

            if(lastHash!==actualLastHash){
                return false
            }

            const validatedHash = cryptoHash(timeStamp,lastHash,data,difficulty,nonce)
            if(hash!== validatedHash){
                return false
            }

            if(Math.abs(lastDifficulty - difficulty) > 1){
                return false
            }

            
        }


        return true

    }

    replaceChain(chain){
        if(chain.length<= this.chain.length){
            console.error('Incoming Chain must be longer than existing Chain');
            return;
        }

        if(!BlockChain.isValidChain(chain)){
            console.error('Incoming Chain must be valid Chain');
            return;
        }
        
        console.log('Replacing Chain with',chain)
        this.chain = chain
    }

}

module.exports = BlockChain