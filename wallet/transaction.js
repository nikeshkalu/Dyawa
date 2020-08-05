const {v1: uuidv1 } = require('uuid')
const {verifySignature} = require('../util/index')

class Transaction{
    constructor({senderWallet,recepient,amount}){
        this.id = uuidv1()
        this.outputMap = this.createOutputMap({
            senderWallet,recepient,amount
        })
        this.input = this.createInput({senderWallet,outputMap : this.outputMap})
        
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
        const outputTotal = Object.values(outputMap).reduce((total,outputAmount)=>total + outputAmount)
        if(amount!=outputTotal){
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
}

module.exports = Transaction