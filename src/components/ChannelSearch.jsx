import React, { useState } from "react";
import { SearchIcon } from "../assets/SearchIcon.jsx";
import { useChatContext } from "../context/chatContext.js";

const ChannelSearch = () => {
  const [query, setQuery] = useState("");
  const { createChat } = useChatContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createChat(query);
    setQuery("");
  };

  return (
    <form className="channel-search__container" onSubmit={handleSubmit}>
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <div className="channel-search__input__text">
          <input
            className="channel-search__input__text"
            placeholder="Start chat by user ID"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default ChannelSearch;
