const BlockChain = require('./blockchain')
const Block = require('./block')
const {cryptoHash} = require('../util/');
const { isValidChain } = require('./blockchain');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

describe('BlockChain()',()=>{
    let blockChain,newChain,originalChain,errorMock;

    
    beforeEach(()=>{
        blockChain = new BlockChain()
        newChain = new BlockChain()
        errorMock = jest.fn()

        originalChain = blockChain.chain
        global.console.error = errorMock

    })

    it('contains a `chain` array itself',()=>{
        expect(blockChain.chain instanceof Array).toBe(true)
    })

    it('Start with Genesis Block',()=>{
        expect(blockChain.chain[0]).toEqual(Block.genesis())
    })

    it('adds the new block to the chain',()=>{
        const newdata = 'test data'
        blockChain.addBlock({data:newdata})
        expect(blockChain.chain[blockChain.chain.length-1].data).toEqual(newdata)
    })

    describe('isValidChain()',()=>{

        beforeEach(()=>{
            blockChain.addBlock({data:'Block1'})
            blockChain.addBlock({data:'Block2'})
            blockChain.addBlock({data:'Block3'})
        })

        describe('when chain does not start with genesis block',()=>{
            it('return false',()=>{
                blockChain.chain[0] = {data : 'fake-genesis block'}

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe('when chain start with genesis block and has multiple block',()=>{
            describe('last hash reference value changed',()=>{
                it('returns false',()=>{
                
                    blockChain.chain[2].lastHash = 'wrong last Hash'

                    expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
                    
                })
            })

        describe('Chain contains the block with the invalid field',()=>{
            it('returns false',()=>{
                
                blockChain.chain[2].data = 'Invalid data'

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
                
            })
        })

        describe('Contains the block with the jumped difficulty',()=>{
            it('returns false',()=>{
                const lastBlock = blockChain.chain[blockChain.chain.length-1]
                const lastHash = lastBlock.hash
                const timeStamp = Date.now()
                const nonce = 0
                const data = []
                const difficulty = lastBlock.difficulty - 3

                const hash = cryptoHash(timeStamp,lastHash,nonce,data,difficulty)

                const wrongBlock = new Block({timeStamp,lastHash,hash,nonce,data,difficulty})
                blockChain.chain.push(wrongBlock)
                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe('Chain doesnot contain block with an invalid filed',()=>{
            it('returns ture',()=>{

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(true)
            })
        })
    })

    })

    describe('replaceChain()',()=>{
        let logMock;
        beforeEach(()=>{
            logMock = jest.fn()

            global.console.log = logMock
        })

        describe('New Change is not longer',()=>{
            beforeEach(()=>{
                newChain.chain[0] = {new:'chain'}
                blockChain.replaceChain(newChain.chain)
            })
            it('Does not replace the chain',()=>{
               
                expect(blockChain.chain).toEqual(originalChain)
            })

            it('Logs an error',()=>{
                expect(errorMock).toHaveBeenCalled()
            })
        })

        describe('New Change is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data:'Block1'})
                newChain.addBlock({data:'Block2'})
                newChain.addBlock({data:'Block3'})
            })

            describe('WHen the chain is valid',()=>{
                
                beforeEach(()=>{
                    blockChain.replaceChain(newChain.chain)
                })
                
                it('Replace the chain',()=>{
                    expect(blockChain.chain).toEqual(newChain.chain)
                })

                it('Logs about chain replacement',()=>{
                    expect(logMock).toHaveBeenCalled()
                })
            })

            describe('When the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'fake hash'
                    blockChain.replaceChain(newChain.chain)
                })
                it('Does not replace the chain',()=>{
                    expect(blockChain.chain).toEqual(originalChain)
                })
                it('Logs an error',()=>{
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe('when the validateTransactions flag is true',()=>{
                it('calls validTransactionData()',()=>{
                    const validTransactionDataMock = jest.fn()
                    blockChain.validTransactionData = validTransactionDataMock

                    newChain.addBlock({data:'testData'})
                    blockChain.replaceChain(newChain.chain,true)
                    expect(validTransactionDataMock).toHaveBeenCalled()
                })
            })
        })
    })

    describe('validTransactionData()',()=>{
        let transaction,rewardTransaction,wallet

        beforeEach(()=>{
            wallet = new Wallet()
            transaction = wallet.createTransaction({
                recepient : 'test',
                amount : 60
            })  
            rewardTransaction = Transaction.rewardTransaction({minerWallet : wallet})

        })

        describe('transaction data is valid',()=>{
            it('returns true',()=>{
                newChain.addBlock({
                    data : [transaction,rewardTransaction]
                })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(true)
                expect(errorMock).not.toHaveBeenCalled()

            })

        })

        describe('Transaction Data has multiple rewards',()=>{
            it('return false and logs error',()=>{
                newChain.addBlock({
                    data : [transaction,rewardTransaction,rewardTransaction]
                })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(false)
                expect(errorMock).toHaveBeenCalled()

            })
        })

        describe('the transaction data has at least one malformed outputMap',()=>{
            describe('Transaction is not the reward transaction',()=>{
                it('return false and logs error',()=>{
                    transaction.outputMap[wallet.publicKey] = 999999
                    newChain.addBlock({
                        data : [transaction,rewardTransaction]
                    })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(false)
                expect(errorMock).toHaveBeenCalled()

                })
            })

            describe('Transaction is the reward transaction',()=>{
                it('return false and logs error',()=>{
                    rewardTransaction.outputMap[wallet.publicKey] = 999999

                    newChain.addBlock({
                        data : [transaction,rewardTransaction]
                    })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(false)
                expect(errorMock).toHaveBeenCalled()

                })
            })
        })

        describe('Transaction data has at least one malformed input',()=>{
            it('return false and logs error',()=>{
                wallet.balance = 9000

                const evilOutputMap = {
                    [wallet.publicKey] : 8900,
                    fooRecepient : 100
                }

                const evilTransaction = {
                    input:{
                        timeStamp : Date.now(),
                        amount : wallet.balance,
                        address : wallet.publicKey,
                        signature : wallet.sign(evilOutputMap)
                    },
                    outputMap : evilOutputMap
                }

                newChain.addBlock({
                    data : [evilTransaction,rewardTransaction]
                })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(false)
                expect(errorMock).toHaveBeenCalled()
            })
        })

        describe('Block contains multiple identical transaction',()=>{
            it('return false and logs error',()=>{
                newChain.addBlock({
                    data : [transaction,transaction,transaction,transaction,rewardTransaction]
                })

                expect(blockChain.validTransactionData({chain : newChain.chain})).toBe(false)
                expect(errorMock).toHaveBeenCalled()
            })
        })
    })
})
