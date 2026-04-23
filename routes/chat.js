require('dotenv').config()
const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const ratelimit = require('express-rate-limit')
const redis = require('../config/redis')
const { RedisStore } = require('rate-limit-redis')

const limiter = ratelimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    statusCode: 429,
    message: "429 Too many requests",

    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args)
    })
})

const router = express.Router()

app.use(express.json())

router.post('/', authMiddleware, limiter, async (req, res) => {
    const { userId } = req.body
    try {
        const chat = await prisma.chat.create({
            data: {
                users: {
                    connect: {
                        id: req.user.userId,
                        id: userId
                    }
                }
            }
        })

        res.status(200).json({
            message: "chat created",
            chat
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Chat creation failed"
        })
    }
})

module.exports = router