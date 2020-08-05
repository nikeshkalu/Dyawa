const Transaction  = require('./transaction')
const Wallet = require('./index')
const { verifySignature } = require('../util')

describe('Transaction Class',()=>{
    let transaction,senderWallet,recepient,amount

    beforeEach(()=>{
        senderWallet = new Wallet()
        recepient = 'recepient-public-key'
        amount = 50
        transaction = new Transaction({senderWallet,recepient,amount})
    })

    it('has an `id`',()=>{
        expect(transaction).toHaveProperty('id')

    })

    describe('outputMap',()=>{
        it('It has an `an output map`',()=>{
            expect(transaction).toHaveProperty('outputMap')
        })

        it('outputs the amount to the recepient',()=>{
            expect(transaction.outputMap[recepient]).toEqual(amount)
        })

        it('Output the remaining balance for `senderWallet`',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance-amount)
        })
    })

    describe('input',()=>{
        it('It has an `input`',()=>{
            expect(transaction).toHaveProperty('input')
        })

        it('has a timeStamp',()=>{
            expect(transaction.input).toHaveProperty('timeStamp')
        })

        it('Sets the `amount` to `senderWallet`',()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it('sets the `address` to the `senderWallet` publicKey',()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })

        it('signs the input',()=>{
            expect(verifySignature({
                publicKey : senderWallet.publicKey,
                data: transaction.outputMap,
                signature : transaction.input.signature 
            }
            )).toBe(true)
        })
    })

    describe('Valid Transaction',()=>{
        let errorMock

        beforeEach(()=>{
            errorMock = jest.fn()
            global.console.error = errorMock
        })
        describe('When the transaction is valid',()=>{
            it('return true',()=>{
                expect(Transaction.validTransaction(transaction)).toBe(true)
            })
        })

        describe('When the transaction is not valid',()=>{
            describe('Transaction output map value is invalid',()=>{
                it('return false and logs error',()=>{
                    transaction.outputMap[senderWallet.publicKey] = 99999
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe('Transaction input signature is invalid',()=>{
                it('return false and logs error',()=>{
                    transaction.input.signature = new Wallet().sign('data') 
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })
                

            })
        })


    })

    describe('Update',()=>{
        let originalSignature,originalSenderOutput,nextRecepient,nextAmount

        describe('Amount is invalid',()=>{
            it('Throws an error',()=>{
                expect(()=>{
                    transaction.update({
                        senderWallet,
                        recepient : 'test',
                        amount : 999999
                    }).toThrow('Amount exceeds the balance')
                })
               
            })
        })

        describe('And the amount is valid',()=>{ 
            
            beforeEach(()=>{
            originalSignature = transaction.input.signature
            originalSenderOutput = transaction.outputMap[senderWallet.publicKey]
            nextRecepient = 'next'
            nextAmount = 50

            transaction.update({senderWallet,recepient : nextRecepient,amount:nextAmount})
        })

        it('Output the amount to next recepient',()=>{
            expect(transaction.outputMap[nextRecepient]).toEqual(nextAmount)
        })

        it('Subtract the amount from the senderWallet',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput-nextAmount)
        })

        it('maintains total amount that matches the input amount',()=>{
            expect(Object.values((transaction.outputMap)).reduce((total,outputAmount)=>total+outputAmount)).toEqual(transaction.input.amount)
        })

        it('re-signs the transaction',()=>{
            expect(transaction.input.signature).not.toEqual(originalSignature)
        })

        describe('an another update for the same receipt',()=>{
            let addedAmount

            beforeEach(()=>{
                addedAmount = 80
                transaction.update({senderWallet,recepient:nextRecepient,amount:addedAmount})

            })

            it('adds the recepient amount',()=>{
                expect(transaction.outputMap[nextRecepient]).toEqual(nextAmount + addedAmount)
            })

            it('subtract the amount from original sender amount',()=>{
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount - addedAmount)
            })

        })

        })

       
    })

})