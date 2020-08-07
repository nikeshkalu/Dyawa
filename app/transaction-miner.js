class TranactionMiner{

    constructor(blockchain,tranactionPool,wallet,pubsub){
        this.blockchain = blockchain
        this.tranactionPool = tranactionPool
        this.wallet = wallet
        this.pubsub = pubsub
    }


    mineTransactions(){
        // get transaction pool valid trasactions

        //generate miner reward

        //add a block consisting these transaction to the blockchain

        //brodcast the updated blockchain

        //clear the transaction pool
    }
}

module.exports = TranactionMiner