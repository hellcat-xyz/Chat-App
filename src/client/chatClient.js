import { io } from "socket.io-client";

class ChatClient {
  constructor(url) {
    this.socket = io(url);
  }

  connect(user) {
    this.user = user;

    this.socket.emit("join", user.id);
  }

  onMessage(callback) {
    this.socket.on("receive_message", callback);
  }

  sendMessage(message) {
    this.socket.emit("send_message", message);
  }
}

export default ChatClient;