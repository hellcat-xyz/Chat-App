require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())

const authHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({
            error: "Missing Token"
        })
    }

    const token = authHeader.split(" ")[1]
    try {

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decode
        next()

    } catch (err) {
        return res.status(401).json({
            error: "Invalid token"
        })
    }
}

module.exports = authHandler