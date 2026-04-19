require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const ratelimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const redisStore = require('rate-limit-redis').default
const redis = require('../config/redis')
const authMiddleware = require('../middleware/authMiddleware')
const authHandler = require('../middleware/authMiddleware')


const app = express()
const router = express.Router()
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

app.use(express.json())

const limiter = ratelimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    statusCode: 429,
    message: "429 Too many requests.",

    store: new redisStore({
        sendCommand: (...args) => redis.call(...args),
    })
})

// POST - Register endpoint

router.post('/register', limiter, async (req, res) => {
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

// POST - Login endpoint

router.post('/login', limiter, async (req, res) => {
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

// DELETE - delete user endpint

router.delete('/delete', authMiddleware, async (req, res) => {

    try {
        const successDelete = await prisma.user.delete({
            where: {
                email: req.user.email
            }
        })
        res.status(200).json({
            message: "User deleted successfully."
        })
    }
    catch (err) {
        res.status(404).json({
            error: "User not found."
        })
    }
})

app.use(limiter)

module.exports = router