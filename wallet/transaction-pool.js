const Transaction = require("./transaction")

class TransactionPool{
    constructor(){
        this.transactionMap = {}
        this.totalFee = 0
    }

    calculateTotalFee({fee}){
        this.totalFee = this.totalFee + fee 
    }

    getTotalfee(){
        return this.totalFee
    }

    clear(){
        this.transactionMap = {}
        this.totalFee = 0
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction
    }

    setMap(TransactionMap){
        this.transactionMap = TransactionMap
    }

    existingTransaction({inputAddress}){
        const transaction = Object.values(this.transactionMap)
        return transaction.find(transaction=>transaction.input.address === inputAddress)
    }

    validTransaction(){
        // this.totalFee = this.totalFee + 1
        // console.log(this.transactionMap)
        

        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)    
        )
    }

    clearBlockChainTransaction({chain}){
        for(let i = 1;i<chain.length;i++){
            const block = chain[i]
            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id]
                }
            }
        }
    }

}

module.exports = TransactionPool