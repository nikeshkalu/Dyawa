const cryptoHash = require('./crypto-hash')

describe('cryptoHash()',()=>{
    it('Generates SHA-256 hash value',()=>{
        expect(cryptoHash('hello')).toEqual('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    })

    it('Produce same hash with same input argument in any order',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'))
    })
})