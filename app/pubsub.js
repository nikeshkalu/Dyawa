const PubNub = require('pubnub')
const credentials = {
    publishKey : 'pub-c-231fadd5-102d-4451-8829-a9ed0e8bfb86',
    subscribeKey : 'sub-c-08906f62-d54c-11ea-b0f5-2a188b98e439',
    secretKey : 'sec-c-YTljOWFkMDgtZjNlYS00ZDg1LWJkYWItZTY0YTE0MWZhMWVi'
}

const CHANNELS = {
    TEST : 'TEST',
    BLOCkCHAIN : 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub{
    constructor({blockchain,transactionPool}){
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.pubNub = new PubNub(credentials)
        this.pubNub.subscribe({ channels: [Object.values(CHANNELS)]})

        this.pubNub.addListener(this.listner())
    }

    listner(){
        return{
            message: messageObject =>{
                const {channel,message} = messageObject
                console.log(`Message Received---------- Channel:${channel}  ----------  Message:${message} `)

                const parseMessage = JSON.parse(message)

                switch(channel){
                    case CHANNELS.BLOCkCHAIN:
                        this.blockchain.replaceChain(parseMessage,()=>{
                            this.transactionPool.clearBlockChainTransaction({
                                chain : parseMessage
                            })
                        })
                        break

                    case CHANNELS.TRANSACTION:    
                        this.transactionPool.setTransaction(parseMessage)
                        break

                    default:
                        return
                }
               
            }
        }
    }

    publish({channel,message}){
        this.pubNub.publish({channel,message})
    }

    brodcastChain(){
        this.publish({
            channel : CHANNELS.BLOCkCHAIN,
            message: JSON.stringify(this.blockchain.chain)

        })
    }

    brodcastTransaction(transaction){
        this.publish({
            channel : CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        }) 

        setTimeout(()=>{
            console.log('test')  
            this.transactionPool.setTransaction(transaction)
        },3000)  

    }
}

// const test = new PubSub()
// test.publish({channel: CHANNELS.TEST,message:'Data'})

module.exports = PubSub

// const redis = require('redis')

// const CHANNELS = {
//     TEST : 'TEST'
// }

// class PubSub {
//     constructor(){
//         this.publisher = redis.createClient()
//         this.subscriber = redis.createClient()

//         this.subscriber.subscribe(CHANNELS.TEST)
//         this.subscriber.on('message',(channel,message)=>{
//             this.handleMessage(channel,message)
//         })
//     }

//     handleMessage(channel,message){
//         console.log(`Message Received. Channel${channel}.  Message${message} `)
//     }
// }

// const testPubSub = new PubSub()
// setTimeout(()=>testPubSub.publisher.publish(CHANNELS.TEST,'Data'),1000)
