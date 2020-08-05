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

    createTransaction({amount,recepient}){
        if(amount>this.balance){
            throw new Error('Amount excceds wallet ballance')
        }

        return new Transaction({senderWallet:this,amount,recepient})
    }

}

module.exports = Wallet