const Redis = require('ioredis')

const redis = new Redis({
    host: "127.0.0.1",
    port: "6379",
    password: undefined,
    db: 0,
    connectionTimeout: 10000,
    maxRetriesPerRequest:5,
    
    retryLogic(times) {
        const timer = Math.min(times * 50, 2000)
        return timer
    }
}) 

redis.on('connect', () => {
    console.log("Redis connected.")
})
redis.on('ready', () => {
    console.log("Redis is ready")
})
redis.on('end', () => {
    console.log("Redis connection terminated successfully.")
})
redis.on('reconnecting', () => {
    console.log("Redis is reconnecting.")
})
redis.on('error', (err) => {
    console.log(err)
})

module.exports = redis