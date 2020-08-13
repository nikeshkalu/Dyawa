const {v1: uuidv1 } = require('uuid')
const {verifySignature} = require('../util/index')
const {REWARD_INPUT,MINING_REWARD} = require('../config')

class Transaction{
    constructor({senderWallet,recepient,amount,outputMap,input}){
        this.id = uuidv1()
        this.outputMap = outputMap || this.createOutputMap({
            senderWallet,recepient,amount
        })
        this.input = input || this.createInput({senderWallet,outputMap : this.outputMap})
        
    }

    createOutputMap({senderWallet,recepient,amount}){
        const outputMap = {}
        outputMap[recepient] = amount
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount
        return outputMap
    }

    createInput({senderWallet,outputMap}){
        return{
            timeStamp : Date.now(),
            address : senderWallet.publicKey,
            amount : senderWallet.balance,
            signature : senderWallet.sign(outputMap)
        }
    }

    static validTransaction(transaction){
        const {input,outputMap} = transaction
        const {address,amount,signature} = input
       
        const outputTotal = Object.values(outputMap).reduce((total,outputAmount)=> parseInt(total) + parseInt(outputAmount))
       
        if(amount!==outputTotal){
            console.error(`Invalid Transaction from ${address}`)
            return false
        }

        if(!verifySignature({publicKey:address,data:outputMap,signature})){
            console.error(`Invalid Signature from ${address}`)
            return false
        }
        return true
    }

    update({senderWallet,recepient,amount}){

        if(amount>this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceeds the balance')
        }

        if(!this.outputMap[recepient]){
            this.outputMap[recepient]  = amount
        }
        else{
            this.outputMap[recepient] =  this.outputMap[recepient] + amount
        }

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount
        this.input = this.createInput({senderWallet,outputMap:this.outputMap})
    }

    static rewardTransaction({minerWallet}){
        return new this({
            input : REWARD_INPUT,
            outputMap : {[minerWallet.publicKey] : MINING_REWARD}
        })
    }
}

module.exports = Transaction