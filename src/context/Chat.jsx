import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const Chat = ({ client, children }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!client) return;

    client.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [client]);

  const sendMessage = (text) => {
    const msg = { text, user };
    client.sendMessage(msg);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <ChatContext.Provider
      value={{
        client,
        user,
        setUser,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);