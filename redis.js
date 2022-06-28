const redis = require('redis')
const { promisify } = require('util');

const client = redis.createClient()

client.on('error', (err) => console.log('Redis Client Error', err));

const addElement = promisify(client.sadd).bind(client);
const expireElement = promisify(client.expire).bind(client);
const zadd = promisify(client.zadd).bind(client);
const zrevrange = promisify(client.zrevrange).bind(client);
const exists = promisify(client.exists).bind(client);
const zincrby = promisify(client.zincrby).bind(client);


async function checkRedisHash(accountId, hash) {
    const response = await addElement(accountId, hash)
    if (!response) {
        return {
            success: false,
            error: 'Duplicate transaction',
        };
    }
    await expireElement(accountId, 30);
    return { success: true };

}

// zadd('myset', 1, 'first').then(console.log).catch(console.log)
// zadd('myset', 2, 'second').then(console.log).catch(console.log)
// zadd('myset', 3, 'third').then(console.log).catch(console.log)

// zrevrange('myset', 0, '-1').then(console.log).catch(console.log)

module.exports = { checkRedisHash, zadd, zrevrange, exists, zincrby, expireElement}