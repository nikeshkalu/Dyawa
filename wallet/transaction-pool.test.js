const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const BlockChain = require('../blockchain/blockchain')

describe('TransactionPool',()=>{
    let transactionPool,transaction,senderWallet

    beforeEach(()=>{
        transactionPool = new TransactionPool()
        senderWallet = new Wallet()
        transaction = new Transaction({
            senderWallet,
            recepient: 'test-recepient',
            amount: 50
        })
    })

    describe('SetTransaction()',()=>{
        it('Adds the transaction',()=>{
            transactionPool.setTransaction(transaction)

            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction)

        })
    })

    describe('existingTransaction()',()=>{
        it('returns an existing transaction for given input address',()=>{
            transactionPool.setTransaction(transaction)
            expect(transactionPool.existingTransaction({ inputAddress : senderWallet.publicKey })).toBe(transaction)
        })
    })

    describe('validTransactions()',()=>{
        let validTransactions,errorMock

        beforeEach(()=>{
            validTransactions = []
            errorMock = jest.fn()
            global.console.error = errorMock

            for(let i=0;i<10;i++){
                transaction = new Transaction({
                    senderWallet,
                    recepient:'test-recepient',
                    amount:50
                })

                if(i%3===0){
                    transaction.input.amount = 999999
                }
                else if(i%3===1){
                    transaction.input.signature = new Wallet().sign('foo')
                }
                else{
                    validTransactions.push(transaction)
                }

                transactionPool.setTransaction(transaction)
            }

            
        })

        it('returns valid transactions',()=>{
            expect(transactionPool.validTransaction()).toEqual(validTransactions)
        })

        it('Logs for an invalid transaction',()=>{
            transactionPool.validTransaction()
            expect(errorMock).toHaveBeenCalled()
        })
    })

    describe('clear()',()=>{
        it('clears the transactions',()=>{
            transactionPool.clear()
            expect(transactionPool.transactionMap).toEqual({})
        })
    })

    describe('clearBlockchainTransactions()',()=>{
        it('clear the pool of any existing blockchain transactions',()=>{
            const blockChain = new BlockChain()
            const expectedTransactionMap = {}

            for(let i =0;i<6;i++){
                const transaction = new Wallet().createTransaction({
                    recepient : 'test',
                    amount:10
                })

                transactionPool.setTransaction(transaction)

                if(i%2===0){
                    blockChain.addBlock({data:[transaction]})
                }
                else{
                    expectedTransactionMap[transaction.id] = transaction
                }
            }

            transactionPool.clearBlockChainTransaction({chain:blockChain.chain})
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap)
        })
    })
})