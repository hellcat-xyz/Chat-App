import React from 'react'
import './App.css';
import Cookies from 'universal-cookie';
import ChannelListContainer from './components/ChannelListContainer.jsx'
import ChannelContainer from './components/ChannelContainer.jsx'
import ChatClient from "./client/chatClient.js";
import { Chat } from "./context/Chat.jsx";

const client = new ChatClient("http://localhost:5000");

const App = () => {
  return (
    <div className='app__wrapper'>
      <Chat client={client}>
        <ChannelListContainer />
        <ChannelContainer />
      </Chat>
    </div>
  )
}

export default App
