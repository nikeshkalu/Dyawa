const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const BlockChain = require('./blockchain/blockchain')
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transaction-pool')
const Wallet = require('./wallet/index')
const { json } = require('body-parser')
const Transaction = require('./wallet/transaction')
const TransactionMiner = require('./app/transaction-miner')
const path = require('path')

const isDevelopment = process.env.ENV === 'development';
// const isDevelopment = true;


const app = express()
const blockchain = new BlockChain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const pubsub = new PubSub({blockchain,transactionPool})
const transactionMiner = new TransactionMiner({
    blockchain : blockchain,
    transactionPool:transactionPool,
    wallet : wallet,
    pubsub:pubsub
})

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'client/dist')))

const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

let PEER_PORT
if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000)
}
const PORT = PEER_PORT || DEFAULT_PORT

app.get('/api/blocks',(req,res)=>{
    res.json(blockchain.chain)
})

app.post('/api/mine',(req,res)=>{
    const {data} = req.body
    blockchain.addBlock({data})

    pubsub.brodcastChain()

    res.redirect('/api/blocks')
})

app.post('/api/transact',(req,res)=>{
    const {amount,recepient} = req.body
    transaction = transactionPool.existingTransaction({ inputAddress : wallet.publicKey })

    try{
        if(transaction){
            console.log('test')
            console.log(transaction)
            transaction.update({senderWallet : wallet,recepient,amount})
        }else{
            transaction = wallet.createTransaction({recepient,amount,chain:blockchain.chain})
        }
        transactionPool.calculateTotalFee({fee : (parseInt(amount)/100)})
    }
    catch(error){
        return res.status(400).json({
            type:'error',
            message: error.message
        })        
    }
    
    transactionPool.setTransaction(transaction)
    pubsub.brodcastTransaction(transaction)


    res.json({
        type:'success',
        transaction
    })
})

app.get('/api/transaction-pool-map',(req,res)=>{
    res.json(transactionPool.transactionMap)
})

app.get('/api/mine-transactions',(req,res)=>{
    transactionMiner.mineTransactions()
    res.redirect('/api/blocks')
})

app.get('/api/wallet-info',(req,res)=>{
    const address = wallet.publicKey
    res.json({
        address,
        balance : Wallet.calculateBalance({
            chain : blockchain.chain,
            address
        })
    })
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./client/dist/index.html'))
})

if (isDevelopment) {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();
  
    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
      const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
      });
  
      transactionPool.setTransaction(transaction);
    };
  
    const walletAction = () => generateWalletTransaction({
      wallet, recipient: walletFoo.publicKey, amount: 5
    });
  
    const walletFooAction = () => generateWalletTransaction({
      wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
    });
  
    const walletBarAction = () => generateWalletTransaction({
      wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });
  
    for (let i=0; i<20; i++) {
      if (i%3 === 0) {
        walletAction();
        walletFooAction();
      } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
      } else {
        walletFooAction();
        walletBarAction();
      }
  
      transactionMiner.mineTransactions();
    }
  }
  

const syncWithRootState = () =>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=>{
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body)
            console.log('replace Success with the chain',rootChain)
            blockchain.replaceChain(rootChain)
        }
    })

    request({url:`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`},(error,response,body)=>{
        if(!error && response.statusCode === 200){
            const rootTransactionPoolMap = JSON.parse(body)
            console.log('replace Transaction Pool map on a sync with ',rootTransactionPoolMap)
            transactionPool.setMap(rootTransactionPoolMap)
        }
    })


    
}


app.listen(PORT,()=>{
    console.log(`Running at port :${PORT}`)

    if(PORT !== DEFAULT_PORT){
        syncWithRootState()
    }
})