require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const app = express()
app.use(express.json())
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:chatId', authMiddleware, async (req, res) => {
    const { chatId } = req.params
    try {
        const getMessage = await prisma.message.findMany({
            where: { chatId: chatId },
            orderBy: {
                datentime: "asc"
            }
        })
        res.status(200).json({
            message: getMessage
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Server error."
        })
    }
})

module.exports = router