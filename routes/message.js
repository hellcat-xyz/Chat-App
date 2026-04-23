require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const app = express()
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, async (req, res) => {
    const { chatId, content } = req.body

    if (!chatId || !content) {
        return res.status(400).json({
            error: "Both chatId and content is required."
        })
    }

    try {
        const message = await prisma.message.create({
            data: {
                chatId: chatId,
                content:content,
                userId: req.user.userId
            }
        })
        res.status(200).json({
            message: "Message sent successfully.",
            data:message
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            error:"Server error."
        })
    }
})

module.exports = router