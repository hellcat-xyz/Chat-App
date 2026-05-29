import { io } from "socket.io-client";

class ChatClient {
  constructor(url) {
    this.socket = io(url, { autoConnect: true });
  }

  joinChat(chatId) {
    if (!chatId) return;
    this.socket.emit("join_chat", chatId);
  }

  onMessage(callback) {
    this.socket.on("new_message", callback);

    return () => {
      this.socket.off("new_message", callback);
    };
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default ChatClient;
