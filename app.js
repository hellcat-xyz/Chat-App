const http = require('http')
const express = require('express')
const helmet = require('helmet')
console.clear()
const app = express();
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})
app.use(helmet())
app.use(express.json());

const authRouter = require('./routes/Authentication/auth')
const userRouter = require('./routes/Users/profile')
const mainRouter = require('./routes/index')
const chatRouter = require('./routes/Messages/chat')
const messageRouter = require('./routes/Messages/message')

app.use('/', mainRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/message', messageRouter)

io.on("connection", (socket) => {
  console.log("New user connected : ", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected : ", socket.id)
  })
})


server.listen(3000, () => {
  console.log("Server is running...")
})