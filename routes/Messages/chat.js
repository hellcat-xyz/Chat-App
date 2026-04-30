require('dotenv').config()
const express = require('express')
const authMiddleware = require('../../middleware/authMiddleware')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const ratelimit = require('express-rate-limit')
const redis = require('../../config/redis')
const { RedisStore } = require('rate-limit-redis')

const limiter = ratelimit({
    windowMs: 1 * 60 * 1000,
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

        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            some: { id: req.user.id }
                        }
                    },
                    {
                        users: {
                            some: { id: userId }
                        }
                    }
                ]
            }
        })

        if(userId === req.user.id) {
            return res.json({
                error : "You can't message with yourself"
            })
        }

        if (existingChat) {
            return res.json({
                message: "Chat already exists.",
                chat: existingChat
            })
        } else {

            const chat = await prisma.chat.create({
                data: {
                    users: {
                        connect: {
                            id: req.user.id,
                            id: userId
                        }
                    }
                }
            })
            res.status(200).json({
                message: "chat created",
                chat
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Chat creation failed"
        })
    }
})

router.get('/', authMiddleware, async (req, res) => {
    try {
        const messageList = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: req.user.id
                    }
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { datentime: 'desc' }
                }
            }
        })

        const formattedOutput = messageList.map(chat => {
            const otherUser = chat.users.find(
                u => u.id !== req.user.id
            )

            return {
                chatId: chat.id,
                otherUser,
                lastMessage: chat.messages[0]?.content || null
            }
        })
        res.status(200).json({ formattedOutput })
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router