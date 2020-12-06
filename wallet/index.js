const {STARTING_BALANCE} = require('../config')
const {ec,cryptoHash} = require('../util/index')
const Transaction = require('./transaction')

class Wallet{
    
    constructor(){
        this.balance = STARTING_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex')      
    }

    sign(data){
     return this.keyPair.sign(cryptoHash(data))   
    }

    createTransaction({amount,recepient,chain}){
        if(chain){
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }
        if(amount>this.balance){
            throw new Error('Amount excceds wallet ballance')
        }

        return new Transaction({senderWallet:this,amount,recepient})
    }

    static calculateBalance({chain,address}){
        let hasConductedTransaction = false
        let outputTotal = 0

        for(let i = chain.length - 1;i>0;i--){
            const block = chain[i]

            for(let transaction of block.data){
                if(transaction.input.address === address){
                    hasConductedTransaction = true
                }
                const addressOutput = transaction.outputMap[address]
                
                if(addressOutput){
                    outputTotal = parseFloat(outputTotal) + parseFloat(addressOutput)
                }
            }
            if(hasConductedTransaction){
                break;
            }
        }
        
        return hasConductedTransaction ? outputTotal :STARTING_BALANCE + parseFloat(outputTotal)
    }

}

module.exports = Wallet