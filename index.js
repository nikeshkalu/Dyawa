const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const BlockChain = require('./blockchain')
const PubSub = require('./pubsub')
const { json } = require('body-parser')


const app = express()
const blockchain = new BlockChain()
const pubsub = new PubSub({blockchain})
// setTimeout(()=>pubsub.brodcastChain(),1000)

app.use(bodyParser.json())

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

const synchChain = () =>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=>{
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body)
            console.log('replace Success with the chain',rootChain)
            blockchain.replaceChain(rootChain)
        }
    })
}


app.listen(PORT,()=>{
    console.log(`Running at port :${PORT}`)

    if(PORT !== DEFAULT_PORT){
        synchChain()

    }
})