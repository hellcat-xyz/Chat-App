const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

require('dotenv').config()
const app = express()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })


app.use(express.json())

app.post('/register', async(req, res) => {
    const {username, password} = req.body

    if(!username || !password) {
        res.status(400).send("Both Username and Password fields are mandatory.")
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                datentime: new Date()
            }
        })
        res.json({
            message: "User created",
            id: user.id,
            username: user.username,
            datentime:user.datentime
        })
    }

    catch(err) {
        res.status(500).send("An error has occured.")
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...")
})