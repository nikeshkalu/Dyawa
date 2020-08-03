const BlockChain = require('../blockchain/blockchain')

const blockchain = new BlockChain()

blockchain.addBlock({data:'initail-block'})

console.log(blockchain.chain[blockchain.chain.length-1])
let previousTimeStamp,nextTimeStamp,nextBlock,timeDiff,average
const times = []

for(let i=0;i<10000;i++){

    previousTimeStamp = blockchain.chain[blockchain.chain.length-1].timeStamp
    blockchain.addBlock({data:`block ${i}`})
    nextBlock = blockchain.chain[blockchain.chain.length-1]
    nextTimeStamp = nextBlock.timeStamp
    timeDiff = nextTimeStamp - previousTimeStamp
    times.push(timeDiff)
    average = times.reduce((total,num)=>(total+num))/times.length
    
    console.log(`Time to mine Block ${timeDiff/1000} seconds `)
    console.log(`Difficulty : ${nextBlock.difficulty}`)
    console.log(`Average Time: ${average/1000} seconds`) 
}