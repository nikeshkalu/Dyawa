const Wallet = require('./index')
const {verifySignature} = require('../util/index')
const Transaction = require('./transaction')
const BlockChain = require('../blockchain/blockchain')
const { STARTING_BALANCE } = require('../config')

describe('Wallet',()=>{
    let wallet

    beforeEach(()=>{
        wallet = new Wallet()
    })

    it('has a `balance`',()=>{
        expect(wallet).toHaveProperty('balance')
    })

    it('has a `publicKey`',()=>{
        expect(wallet).toHaveProperty('publicKey')
    })

    describe('Signing Data for a message',()=>{
        const data = 'Test Data'
        it('verifies the signature',()=>{
            expect(  
                verifySignature({
                publicKey : wallet.publicKey,
                data,
                signature : wallet.sign(data)
            })
            ).toBe(true)
           
        })

        it('Does not verfies the invalid signature',()=>{
            expect(  
                verifySignature({
                publicKey : wallet.publicKey,
                data,
                signature : new Wallet().sign(data)
            })
            ).toBe(false)
        })

    })

    describe('createTransaction()',()=>{
        describe('amount exceeds the balance in wallet',()=>{
            it('throws an error',()=>{
                expect(()=>wallet.createTransaction({amount:9999999999,recepient:'Test'}))
                    .toThrow('Amount excceds wallet ballance')
            })
        })

        describe('Chain is Passed',()=>{
            it('calls wallet.calcualteBalance()',()=>{
                const calcualteBalanceMock = jest.fn()
                const originalCalculateBalance = Wallet.calculateBalance

                Wallet.calculateBalance = calcualteBalanceMock
                wallet.createTransaction({
                    recepient: 'test',
                    amount : 50,
                    chain : new BlockChain().chain
                })

                expect(calcualteBalanceMock).toHaveBeenCalled()

                Wallet.calculateBalance = originalCalculateBalance
            })
        })

        describe('amount is valid',()=>{
            let transaction, amount,recepient
            beforeEach(()=>{
                amount = 50
                recepient = 'Test'
                transaction = wallet.createTransaction({amount,recepient})
            })
            it('Creates an `Transaction`',()=>{
                expect(transaction instanceof Transaction).toBe(true)
            })

            it('Matches the transaction input with wallet',()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey)
            })

            it('Outputs the amount to the recepient',()=>{
                expect(transaction.outputMap[recepient]).toEqual(amount)
            })
        })
    })

    describe('calculateBalance()',()=>{
        let blockchain

        beforeEach(()=>{
            blockchain = new BlockChain({})
        })

        describe('there are no output to the wallet',()=>{
            it('returns the starting balance',()=>{
                expect( 
                    Wallet.calculateBalance({
                        chain : blockchain.chain,
                        address : wallet.publicKey
                })).toEqual(STARTING_BALANCE)
               
            })
        })

        describe('there are output for the wallet',()=>{
            let transactionOne,transactionTwo

            beforeEach(()=>{
                transactionOne = new Wallet().createTransaction({
                    recepient : wallet.publicKey,
                    amount : 50
                })

                transactionTwo = new Wallet().createTransaction({
                    recepient : wallet.publicKey,
                    amount : 100
                })

                blockchain.addBlock({
                    data : [transactionOne,transactionTwo]
                })

            })
            it('returns the updated balance by updating  the entire transaction in the blockchain',()=>{
                expect(
                Wallet.calculateBalance({
                    chain : blockchain.chain,
                    address : wallet.publicKey
                })).toEqual(STARTING_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey])
            })
        })

        describe('and the wallet has made the transaction',()=>{
            let recentTransaction 
            
            beforeEach(()=>{
                recentTransaction = wallet.createTransaction({
                    recepient : 'test',
                    amount : 20,
                })

                blockchain.addBlock({
                    data : [recentTransaction]
                })

            })

            it('returns the amount after the recent transactuion',()=>{
                expect(
                    Wallet.calculateBalance({
                        address : wallet.publicKey,
                        chain : blockchain.chain
                    })
                ).toEqual(recentTransaction.outputMap[wallet.publicKey])
            })
        })

        describe('and there are output next to and after the recent transaction',()=>{
            let sameBlockTransaction,nextBlockTransaction

            beforeEach(()=>{
                recentTransaction = wallet.createTransaction({
                    recepient : 'test2',
                    amount : 70
                })

                sameBlockTransaction = Transaction.rewardTransaction({minerWallet:wallet})

                blockchain.addBlock({
                    data : [recentTransaction,sameBlockTransaction]
                })

                nextBlockTransaction = new Wallet().createTransaction({
                    recepient : wallet.publicKey,
                    amount : 50
                })

                blockchain.addBlock({data:[nextBlockTransaction]})
            })

            it('includes the output amount and returns balance',()=>{
                expect(
                    Wallet.calculateBalance({
                        chain : blockchain.chain,
                        address :wallet.publicKey
                    })
                ).toEqual(recentTransaction.outputMap[wallet.publicKey] +
                          sameBlockTransaction.outputMap[wallet.publicKey] +
                          nextBlockTransaction.outputMap[wallet.publicKey])
            })
        })
    })
})