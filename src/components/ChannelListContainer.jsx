import React from "react";
import ChannelSearch from "./ChannelSearch.jsx";
import { useChatContext } from "../context/chatContext.js";

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">Chats</p>
  </div>
);

const ChannelListContainer = () => {
  const { chats, activeChat, selectChat, loading } = useChatContext();

  return (
    <aside className="channel-list__list__wrapper">
      <CompanyHeader />
      <ChannelSearch />
      <div className="team-channel-list">
        {loading && <p className="team-channel-list__message">Loading chats...</p>}
        {!loading && chats.length === 0 && (
          <p className="team-channel-list__message">No chats yet. Paste a user ID above to start one.</p>
        )}
        {chats.map((chat) => (
          <button
            className={activeChat?.chatId === chat.chatId ? "channel-preview__wrapper__selected" : "channel-preview__wrapper"}
            key={chat.chatId}
            onClick={() => selectChat(chat)}
            type="button"
          >
            <span className="channel-preview__item single">
              {chat.otherUser?.username || chat.otherUser?.id || "Unknown user"}
              {chat.lastMessage && <small>{chat.lastMessage}</small>}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ChannelListContainer;
