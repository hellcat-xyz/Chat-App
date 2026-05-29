import { createContext, useContext } from "react";

export const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used inside Chat.");
  }

  return context;
};
