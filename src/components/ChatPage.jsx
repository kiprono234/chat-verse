// src/components/ChatPage.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPaperclip, FaPaperPlane, FaUserEdit, FaCircle, FaHome } from "react-icons/fa";
import PageWrapper from "./PageWrapper";
import io from "socket.io-client";
import "./ChatPage.scss";

const SOCKET_URL = "http://localhost:5000";
const UPLOAD_URL = "http://localhost:5000/upload";

export default function ChatPage() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const fileInputRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    // Connect to socket
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit("newUser", user);

    socket.on("activeUsers", (users) => setActiveUsers(users));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("typing", (typingData) => {
      const { username, isTyping } = typingData;
      setTypingUsers((prev) => {
        if (isTyping && !prev.includes(username)) return [...prev, username];
        if (!isTyping) return prev.filter((u) => u !== username);
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatContainer = document.querySelector(".chat-messages");
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 50);
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
        const data = await res.json();
        fileUrl = data.fileUrl;
      } catch (err) {
        console.error("File upload error:", err);
        return;
      }
    }

    const msgData = {
      sender: user.username,
      avatar: user.photo,
      text: input,
      file: fileUrl,
    };

    socketRef.current.emit("sendMessage", msgData);

    setMessages((prev) => [...prev, { ...msgData, timestamp: new Date().toISOString() }]);
    setInput("");
    setFile(null);
    scrollToBottom();
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const bio = e.target.bio.value.trim();
    const newPhoto = e.target.photo.files[0];

    const updatedUser = {
      ...user,
      username: name || user.username,
      bio: bio || user.bio,
      photo: newPhoto ? URL.createObjectURL(newPhoto) : user.photo,
    };

    updateUser(updatedUser);
    setShowProfileEditor(false);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current.emit("typing", { username: user.username, isTyping: e.target.value.length > 0 });
  };

  return (
    <PageWrapper>
      <div className="chat-container">
        {/* Chat Header */}
        <header className="chat-header">
          <div className="user-info">
            <img src={user.photo} alt="Profile" className="chat-avatar" />
            <div>
              <h2>{user.username}</h2>
              <span className="status">
                <FaCircle className="online" /> Online
              </span>
            </div>
          </div>

          <div className="chat-actions">
            <button
              className="landing-btn"
              onClick={() => navigate("/")}
              title="Back to Landing Page"
            >
              <FaHome /> Landing
            </button>

            <FaUserEdit className="edit-icon" onClick={() => setShowProfileEditor(true)} />
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === user.username ? "my-message" : "other-message"} slide-in`}
            >
              <img src={msg.avatar} alt="avatar" className="message-avatar" />
              <div className="message-content">
                {msg.text && <p>{msg.text}</p>}
                {msg.file && (
                  <a href={msg.file} target="_blank" rel="noopener noreferrer">
                    📎 {msg.file.split("/").pop()}
                  </a>
                )}
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Typing Indicator */}
        <div className="typing-indicator">
          {typingUsers.length > 0 && (
            <p>{typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...</p>
          )}
        </div>

        {/* Chat Input */}
        <footer className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleTyping}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <FaPaperclip onClick={() => fileInputRef.current.click()} className="icon attach" />
          <FaPaperPlane onClick={handleSend} className="icon send" />
        </footer>

        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <div className="profile-modal">
            <div className="modal-content">
              <h2>Edit Profile</h2>
              <form onSubmit={handleProfileUpdate}>
                <label>Display Name</label>
                <input type="text" name="name" defaultValue={user.username} />
                <label>Bio</label>
                <textarea name="bio" defaultValue={user.bio || ""}></textarea>
                <label>Profile Photo</label>
                <input type="file" name="photo" accept="image/*" />
                <div className="modal-buttons">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setShowProfileEditor(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
