const initialDifficulty = 3
const MINE_RATE = 1000 //1000ms = 1s
const GENESIS_DATA = {
    timeStamp:'1',
    lastHash : '--------',
    hash : 'hash-one',
    difficulty:initialDifficulty,
    nonce : 0,
    data: []
}

module.exports = {GENESIS_DATA,MINE_RATE}