const cryptoHash = require('./crypto-hash')

describe('cryptoHash()',()=>{
    it('Generates SHA-256 hash value',()=>{
        expect(cryptoHash('hello')).toEqual('5aa762ae383fbb727af3c7a36d4940a5b8c40a989452d2304fc958ff3f354e7a')
    })

    it('Produce same hash with same input argument in any order',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'))
    })

    it('produces an unique hash when the properties have changed an input',()=>{
        const foo = {}
        const originalHash = cryptoHash(foo)
        foo['a'] = 'a'
        expect(cryptoHash(foo)).not.toEqual(originalHash)
    })
})