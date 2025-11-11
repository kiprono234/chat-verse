import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPaperclip, FaPaperPlane, FaUserEdit, FaCircle, FaHome } from "react-icons/fa";
import PageWrapper from "./PageWrapper";
import "./ChatPage.scss";
export default function ChatPage() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ← Add this
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const fileInputRef = useRef();

  const handleSend = () => {
    if (!input.trim() && !file) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      file: file ? URL.createObjectURL(file) : null,
      sender: user.username,
      avatar: user.photo,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setFile(null);
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
            {/* New Back to Landing Button */}
            <button
              className="home btn"
              onClick={() => navigate("/")}
              title="Back to Landing Page"
            >
              <FaHome /> Landing
            </button>

            <FaUserEdit className="edit-icon" onClick={() => setShowProfileEditor(true)} />
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === user.username ? "my-message" : "other-message"}`}
            >
              <img src={msg.avatar} alt="avatar" className="message-avatar" />
              <div className="message-content">
                {msg.text && <p>{msg.text}</p>}
                {msg.file && (
                  <a href={msg.file} target="_blank" rel="noopener noreferrer">
                    📎 File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <footer className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
                  <button type="button" onClick={() => setShowProfileEditor(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
