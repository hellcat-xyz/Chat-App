require('dotenv').config()
const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const router = express.Router()

app.use(express.json())

router.post('/', authMiddleware, async (req, res) => {
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

        res.json({
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