import React from 'react';
import logo from './logo.svg';
import { io, Socket } from 'socket.io-client'
import { useState } from 'react'; 
import './App.css';
import Chat from './Chat';

const socket: Socket = io("http://localhost:3001"); 

const App: React.FC = () => {

  const [username, setUsername] = useState(""); 
  const [room, setRoom] = useState(""); 
  const [showChat, setShowChat] = useState(false); 

  const joinRoom = () => {

    if (username !== "" && room !== "") {
      socket.emit("join_room", room); 
      setShowChat(true); 
    }

  }

  return (
    <div className="App">

      {!showChat ? (

      <div className='joinChatContainer'>
        <h3>Join Chat</h3>
        <input type="text" 
        placeholder='Name...' 
        onChange={(event) => {
          setUsername(event.target.value); 
        }}/>

        <input 
        type="text" 
        placeholder='ID...'
        onChange={(event) => {
          setRoom(event.target.value); 
        }}/>

        <button onClick={joinRoom}>Join a room</button>

      </div>
      )
  : (
      <Chat socket={socket} username={username} room={room} />
  )}
    </div>
  );
}

export default App;
