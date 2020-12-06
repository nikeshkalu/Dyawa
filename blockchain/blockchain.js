const Block = require("./block")
const {cryptoHash} = require('../util/')
const {REWARD_INPUT, MINING_REWARD} = require('../config')
const Transaction = require("../wallet/transaction")
const Wallet = require("../wallet")


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

    replaceChain(chain,validateTransactions,onSuccess){
        if(chain.length<= this.chain.length){
            console.error('Incoming Chain must be longer than existing Chain');
            return;
        }

        if(!BlockChain.isValidChain(chain)){
            console.error('Incoming Chain must be valid Chain');
            return;
        }

        if(validateTransactions && !this.validTransactionData({chain})){
            console.error('Incoming Chain has invalid data')
            return
        }

        if(onSuccess){
            onSuccess()
        }
        
        console.log('Replacing Chain with',chain)
        this.chain = chain
    }

    validTransactionData({chain}){

        for(let i = 1;i<chain.length;i++){
            const block = chain[i]
            const transactionSet = new Set()

            let rewardTransactionCount = 0

            for(let transaction of block.data){
                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount += 1
                    if(rewardTransactionCount > 1){
                        console.error('Miner Reward exceeds the limit')
                        return false
                    }

                    // if(Object.values(transaction.outputMap)[0] !== MINING_REWARD + 1){
                    //     console.error('Miner Reward amount is invalid')
                    //     return false
                    // }
                }
                else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error('Invalid Transaction')
                        return false
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain : this.chain,
                        address : transaction.input.address
                    })

                    // console.log(transaction.input.amount)
                    // console.log(trueBalance)

                    // if(transaction.input.amount !== trueBalance)
                    // {
                        
                    //     console.error('Invalid Input Amount')
                    //     return false
                    // }

                    if(transactionSet.has(transaction)){
                        console.error('Identical transaction occurs more than once in the block')
                        return false
                    }
                    else{
                        transactionSet.add(transaction)
                    }
                }
            }
        }
        return true
    }

}

module.exports = BlockChain