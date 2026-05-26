function ioConnection(io) {
    io.on('connection', (socket) => {
        console.log("New user joined the chat.")
        console.log(socket.id)


        socket.on("ping", (data) => {
            socket.emit("pong", {
                message: "Pong"
            })
        })
    }
)}
module.exports = ioConnection