const Transaction = require("./transaction")

class TransactionPool{
    constructor(){
        this.transactionMap = {}
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
        
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
            
        )
    }
}

module.exports = TransactionPool