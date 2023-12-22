import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const ENDPOINT = "http://localhost:8080";
const socket = io(ENDPOINT);

function Chat({ username }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('general');
  const [roomInput, setRoomInput] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
  
    socket.on('connect', () => {
      setSocketId(socket.id);
      if (room) {
        socket.emit('join room', room);
      }
    });

    socket.on('chat message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socket.on('available rooms', (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on('room created', (newRoom) => {
      if (newRoom) {
        setRoom(newRoom);
        setMessages([]);
      }
    });

  
    return () => {
    if (room) {
      socket.emit('leave room', room);
    }
    socket.off('connect');
    socket.off('chat message');
    socket.off('available rooms');
    socket.off('room created');
  };
}, [room]);


  const sendMessage = () => {
    if (input.trim()) {
      const messageData = {
        room,
        message: input,
        username,
        timestamp: new Date().toISOString(),
        socketId,
      };
      socket.emit('chat message', messageData);
      setInput('');
    }
  };

  const handleRoomCreate = () => {
    if (roomInput.trim()) {
      socket.emit('create room', roomInput);
      setRoom(roomInput);
      setRoomInput('');
    }
  };

  const handleRoomChange = (newRoom) => {
  
    if (room && room !== newRoom) {
      socket.emit('leave room', room);
    }
    setMessages([]);
    setRoom(newRoom);
    socket.emit('join room', newRoom);
  };

  const handleRoomLeave = () => {
    socket.emit('leave room', room);
    setRoom('');
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room: {room}</h2>
        <div>
          <select onChange={(e) => handleRoomChange(e.target.value)} value={room}>
            <option value="">Sélectionnez une room</option>
            {availableRooms.map((r, idx) => (
              <option key={idx} value={r}>{r}</option>
            ))}
          </select>
          <input 
            type="text" 
            value={roomInput} 
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="New Room Name" 
          />
          <button onClick={handleRoomCreate}>Create Room</button>
        </div>
        <button onClick={handleRoomLeave}>Quitter Room</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.socketId === socketId ? 'message-sent' : 'message-received'}`}>
            <span className="message-content">{msg.message}</span>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Write a message..."
          disabled={!room}
        />
        <button onClick={sendMessage} disabled={!room}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
