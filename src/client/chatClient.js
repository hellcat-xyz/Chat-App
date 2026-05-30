import { io } from "socket.io-client";


class ChatClient {
  constructor(url) {
    this.socket = io(url, {
  transports: ["websocket"],
});
  }

  connect(user) {
    this.user = user;

    this.socket.emit("join", user.id);
  }

  onMessage(callback) {
    this.socket.off("new_message");
    this.socket.on("new_message", callback);

    return () => {
      this.socket.off("new_message", callback);
    };
  }
  joinChat(chatId) {
    this.socket.emit("join_chat", chatId);
  }

  sendMessage(message) {
    this.socket.emit("send_message", message);
  }
}


export default ChatClient;