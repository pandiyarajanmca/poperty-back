const asyncRedis = require('async-redis');
const {
    redisHost,
    redisPassword,
    redisPort,
} = require('../../config/vars');

const client = asyncRedis.createClient({
    host: redisHost,
    port: redisPort,
});

client.auth(redisPassword, (err, reply) => {
    console.log(reply);
});

client.on('error', (err) => {
    console.log('Something went wrong ', err);
});

client.on('ready', () => {
    console.log('Redis is ready');
});

client.on('error', (err) => {
    console.log('Something went wrong ', err);
});


class CustomRedis {
    constructor() { }

    async set(module, key, value) {
        try {
            if (typeof value !== 'string') {
                client.set(module + key, JSON.stringify(value));
            } else {
                client.set(module + key, value);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async get(module, key) {
        try {
            return await client.get(module + key);
        } catch (error) {
            return false;
        }
    }

    async del(module, key) {
        try {
            return JSON.parse(await client.del(module + key));
        } catch (error) {
            return false;
        }
    }

    async flushAll(module, key) {
        try {
            return JSON.parse(await client.flushdb());
        } catch (error) {
            return false;
        }
    }
}

module.exports = new CustomRedis();
