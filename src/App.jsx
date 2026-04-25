import React from 'react'
import './App.css';
import Cookies from 'universal-cookie';
import ChannelListContainer from './components/ChannelListContainer.jsx'
import ChannelContainer from './components/ChannelContainer.jsx'
import Auth from './components/Auth.jsx';
import ChatClient from "./client/chatClient.js";
import { Chat } from "./context/Chat.jsx";

const client = new ChatClient("http://localhost:3000");
const cookies = new Cookies();
const authToken = cookies.get('token');

const App = () => {
  if(!authToken) return <Auth />
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
