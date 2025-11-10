// src/components/ChatPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.scss";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { text: input, sender: user.username, avatar: user.avatar },
    ]);
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="chatContainer">
      {/* 🧭 Header with username + avatar */}
      <header className="chatHeader">
        <div className="userInfo">
          {user?.avatar && (
            <img src={user.avatar} alt="User Avatar" className="userAvatar" />
          )}
          <span className="username">{user?.username}</span>
        </div>
        <button onClick={handleLogout} className="logoutButton">
          Logout
        </button>
      </header>

      {/* 💬 Message area */}
      <div className="messageArea">
        {messages.map((msg, index) => (
          <div key={index} className="messageItem">
            <img src={msg.avatar} alt="Sender Avatar" className="msgAvatar" />
            <div className="messageBubble">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* ✏️ Message input */}
      <form className="messageForm" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
