const express = require('express');
const helmet = require('helmet')
const app = express();
app.use(helmet())
app.use(express.json());


const authRouter = require('./routes/auth')
const userRouter = require('./routes/profile')
const mainRouter = require('./routes/index')

app.use('/', mainRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(3000, () => {
  console.log("Server is running...")
})