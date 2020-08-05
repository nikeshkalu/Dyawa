const Wallet = require('./index')
const {verifySignature} = require('../util/index')
const Transaction = require('./transaction')

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
})