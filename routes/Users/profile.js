const express = require('express')
const authMiddleware = require('../../middleware/authMiddleware')
const app = express()
const router = express.Router()

app.use(express.json())

router.get('/profile',authMiddleware, (req, res) => {
    res.json({
        message: "User has been authenticated",
        user: req.user
    })
})

module.exports = router