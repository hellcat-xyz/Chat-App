require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ratelimit = require('express-rate-limit')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const app = express()
app.use(express.json())

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const limiter = ratelimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    statusCode: 429,
    message: "429 Too many requests"
})

app.post('/login', limiter, async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            error: "All fields are required."
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({
                error: "Invalid credentials."
            })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(400).json({
                error: "Invalid credentials."
            })
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },

            process.env.JWT_SECRET_KEY,

            {
                expiresIn: '1h'
            }
        )

        res.json({
            message: "User logged in successfully.",
            token
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "An error occured."
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`The server is running on http://localhost:${process.env.PORT}`)
})