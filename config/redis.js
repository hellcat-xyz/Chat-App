const Redis = require('ioredis')

const redis = new Redis({
    host: "127.0.0.1",
    port: "6379",
    password: undefined,
    db: 0,
    connectionTimeout: 20000,
    maxRetriesPerRequest:10,
    
    retryLogic(times) {
        const timer = Math.min(times * 50, 2000)
        return timer
    }
}) 

redis.on('connect', () => {
    console.log("Redis server connected, checking if it's ready...")
})
redis.on('ready', () => {
    console.log("Redis server is ready to accept incoming connections and requests.")
})
redis.on('end', () => {
    console.log("Redis connection terminated successfully.")
})
redis.on('reconnecting', () => {
    console.log("Redis server is reconnecting.")
})
redis.on('error', (err) => {
    console.log(err)
})

module.exports = redis