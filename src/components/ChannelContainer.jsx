import React, { useState } from "react";
import { useChatContext } from "../context/chatContext.js";

const ChannelContainer = ({ onLogout }) => {
  const [message, setMessage] = useState("");
  const { activeChat, error, messages, sendMessage, user } = useChatContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(message);
    setMessage("");
  };

  return (
    <main className="channel__container">
      <header className="team-channel-header__container">
        <div>
          <p className="team-channel-header__name">
            {activeChat ? activeChat.otherUser?.username || "Chat" : "Select a chat"}
          </p>
          <span className="team-channel-header__right-text">{user?.email}</span>
        </div>
        <button className="logout-button" onClick={onLogout} type="button">
          Sign Out
        </button>
      </header>

      {error && <div className="chat-error">{error}</div>}

      <section className="message-list">
        {!activeChat && <p className="channel-empty__second">Choose a chat or start one with a user ID.</p>}
        {activeChat &&
          messages.map((item) => (
            <article className={item.userId === user?.userId ? "message-bubble own" : "message-bubble"} key={item.id}>
              <p>{item.content}</p>
              <time>{item.datentime ? new Date(item.datentime).toLocaleString() : ""}</time>
            </article>
          ))}
      </section>

      <form className="team-message-input__wrapper" onSubmit={handleSubmit}>
        <input
          className="message-input"
          disabled={!activeChat}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={activeChat ? "Type a message" : "Select a chat first"}
          type="text"
          value={message}
        />
        <button disabled={!activeChat || !message.trim()} type="submit">
          Send
        </button>
      </form>
    </main>
  );
};

export default ChannelContainer;
