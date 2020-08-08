const Transaction = require('../wallet/transaction')

class TransactionMiner{

    constructor({blockchain,transactionPool,wallet,pubsub}){
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.pubsub = pubsub
    }


    mineTransactions(){
        // get transaction pool valid trasactions
        const validTransactions = this.transactionPool.validTransaction()

        //generate miner reward
        validTransactions.push(Transaction.rewardTransaction({minerWallet:this.wallet}))
        

        //add a block consisting these transaction to the blockchain
        this.blockchain.addBlock({data:validTransactions})

        //brodcast the updated blockchain
        this.pubsub.brodcastChain()

        //clear the transaction pool
        this.transactionPool.clear()
    }
}

module.exports = TransactionMiner