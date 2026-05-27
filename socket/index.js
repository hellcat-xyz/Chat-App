function ioConnection(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id)
        socket.on("join_chat", (chatId) => {
            socket.join(chatId)
            console.log(`Socket ${socket.id} joined ${chatId}`)
        })

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id)
        })
    })

}
module.exports = ioConnection