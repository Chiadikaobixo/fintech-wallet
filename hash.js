// Used to prevent duplicate transaction
const crypto = require('crypto')
const dotenv = require('dotenv')

dotenv.config();

const key = process.env.HASH_KEY

function hashArguements(...parameters) {
    const concatenatedRequest = parameters.join('')
    
    // Create hash
    const hash = crypto.createHmac('sha512', key)
    hash.update(concatenatedRequest)

    return hash.digest('hex')

}

module.exports = { hashArguements }