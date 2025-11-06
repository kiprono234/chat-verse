import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./ChatPage.scss";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.emit("newUser", { username: user.username, avatar: user.avatar });
    }

    socket.on("activeUsers", (users) => setActiveUsers(users));
    socket.on("receiveMessage", (msgData) => {
      setMessages((prev) => [...prev, msgData]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msgData = {
      sender: user.username,
      avatar: user.avatar,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="chatContainer">
      {/* Left Panel */}
      <div className="sidebar">
        <h3>Active Users</h3>
        <ul>
          {activeUsers.map((u, i) => (
            <li key={i}>
              <img src={u.avatar} alt="user-avatar" />
              <span>{u.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Chat Panel */}
      <div className="chatMain">
        <div className="chatHeader">
          <img src={user.avatar} alt="avatar" />
          <h2>{user.username}</h2>
        </div>

        <div className="chatMessages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.sender === user.username ? "own" : "other"
              }`}
            >
              {msg.sender !== user.username && (
                <img src={msg.avatar} alt="avatar" className="msgAvatar" />
              )}
              <div className="msgContent">
                <div className="msgText">{msg.text}</div>
                <div className="msgMeta">
                  {msg.sender !== user.username && (
                    <span className="sender">{msg.sender}</span>
                  )}
                  <span className="time">{msg.time}</span>
                </div>
              </div>
              {msg.sender === user.username && (
                <img src={msg.avatar} alt="avatar" className="msgAvatar" />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chatInput">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>

      {/* Right User Info */}
      <div className="userInfo">
        <h3>Profile</h3>
        <img src={user.avatar} alt="profile-avatar" className="profileAvatar" />
        <h4>{user.username}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
