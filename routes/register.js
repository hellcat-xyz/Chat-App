require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const helmet = require('helmet')
const ratelimit = require('express-rate-limit')

app.use(helmet())
const app = express()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

app.use(express.json())

const limiter = ratelimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    statusCode: 429,
    message: "429 Too many requests."
})

app.post('/register', limiter, async (req, res) => {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
        return res.status(400).send("All fields are mandatory.")
    }

    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be 8+ chars with uppercase, lowercase, number, and special character"
            })
        }

        if (password.length > 16) {
            return res.status(400).json({
                error: "Password should not be greater than 16 digits"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email."
            })
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return res.status(400).json({
                message: "Error creating user",
                error: "Email already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                datentime: new Date()
            }
        })
        res.json({
            message: "User created",
            id: user.id,
            email: email,
            username: user.username,
            datentime: user.datentime
        })
    }

    catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        console.log(err)
        res.status(500).send("An error has occurred.")
    }
})

app.use(limiter)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})