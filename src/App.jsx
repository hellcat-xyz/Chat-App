import React, { useMemo, useState } from "react";
import "./App.css";
import Cookies from "universal-cookie";
import ChannelListContainer from "./components/ChannelListContainer.jsx";
import ChannelContainer from "./components/ChannelContainer.jsx";
import Auth from "./components/Auth.jsx";
import ChatClient from "./client/chatClient.js";
import { Chat } from "./context/Chat.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const cookies = new Cookies();

const App = () => {
  const [authToken, setAuthToken] = useState(() => cookies.get("token"));
  const client = useMemo(() => new ChatClient(API_URL), []);

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("email");
    setAuthToken(null);
  };

  if (!authToken) return <Auth onAuth={setAuthToken} />;

  return (
    <div className="app__wrapper">
      <Chat client={client} token={authToken}>
        <ChannelListContainer />
        <ChannelContainer onLogout={handleLogout} />
      </Chat>
    </div>
  );
};

export default App;
