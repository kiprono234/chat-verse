// src/components/ChatPage.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaPaperclip,
  FaPaperPlane,
  FaUserEdit,
  FaCircle,
  FaHome,
  FaDownload,
  FaSmile,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import PageWrapper from "./PageWrapper";
import io from "socket.io-client";
import "./ChatPage.scss";

// Backend endpoints
const SOCKET_URL = "http://localhost:5000";
const UPLOAD_URL = "http://localhost:5000/upload";
const MESSAGES_URL = "http://localhost:5000/messages";

export default function ChatPage() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- State ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // --- Refs ---
  const fileInputRef = useRef();
  const socketRef = useRef();
  const chatContainerRef = useRef();
  const scrollTimeoutRef = useRef();

  // ---------------- FETCH MESSAGES ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(MESSAGES_URL);
        const data = await res.json();
        setMessages(data);
        localStorage.setItem("messages", JSON.stringify(data)); // Save messages to localStorage
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages)); // Load messages from localStorage
    } else {
      fetchMessages();
    }
  }, []);

  // ---------------- SOCKET CONNECTION ----------------
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("newUser", user);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping && !prev.includes(username)) return [...prev, username];
        if (!isTyping) return prev.filter((u) => u !== username);
        return prev;
      });
    });

    return () => socket.disconnect();
  }, [user]);

  // ---------------- SAFE SCROLL ----------------
  const scrollToBottomSafe = () => {
    try {
      const container = chatContainerRef.current;
      if (!container) return;
      requestAnimationFrame(() => {
        if (container) container.scrollTop = container.scrollHeight;
      });
    } catch (err) {
      // ignore ResizeObserver warnings
    }
  };

  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const container = chatContainerRef.current;
    const imgs = container.querySelectorAll("img");
    let loaded = 0;

    const triggerScroll = () => {
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToBottomSafe();
        scrollTimeoutRef.current = null;
      }, 50);
    };

    if (imgs.length === 0) {
      triggerScroll();
      return;
    }

    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) triggerScroll();
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === imgs.length) triggerScroll();
        };
      }
    });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    let fileUrl = null;
    let fileType = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
        const data = await res.json();
        fileUrl = data.fileUrl;
        fileType = file.type;
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
      fileType,
      timestamp: new Date().toISOString(),
      archived: false,
    };

    // --- Save to backend ---
    try {
      await fetch(MESSAGES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (err) {
      console.error("Failed to save message to backend:", err);
    }

    // --- Emit to socket ---
    socketRef.current.emit("sendMessage", msgData);

    // --- Update local state ---
    setMessages((prev) => [...prev, msgData]);
    setInput("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------------- TYPING ----------------
  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current.emit("typing", {
      username: user.username,
      isTyping: e.target.value.length > 0,
    });
  };

  // ---------------- FILE SELECTION ----------------
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const isImage = (type) => type && type.startsWith("image/");
  const insertEmoji = (emoji) => setInput((prev) => prev + emoji);

  const handleDeleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArchiveMessage = (index) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, archived: true } : msg))
    );
  };

  // ---------------- RENDER ----------------
  return (
    <PageWrapper>
      <div className="chat-container">
        {/* HEADER */}
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
            <button onClick={() => navigate("/")} className="landing-btn">
              <FaHome /> Landing
            </button>
            <FaUserEdit
              className="edit-icon"
              onClick={() => setShowProfileEditor(true)}
            />
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.filter((msg) => !msg.archived).map((msg, idx) => (
            <div
              key={idx}
              className={`message ${
                msg.sender === user.username ? "my-message" : "other-message"
              } slide-in`}
            >
              <img src={msg.avatar} alt="avatar" className="message-avatar" />
              <div className="message-content">
                {msg.text && <p>{msg.text}</p>}

                {msg.file && isImage(msg.fileType) && (
                  <div className="image-container">
                    <img src={msg.file} alt="upload" className="chat-image" />
                    <a
                      href={msg.file}
                      download={msg.file.split("/").pop()}
                      className="download-btn"
                      title="Download file"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDownload />
                    </a>
                  </div>
                )}

                {msg.file && !isImage(msg.fileType) && (
                  <a
                    href={msg.file}
                    download={msg.file.split("/").pop()}
                    className="file-download"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 {msg.file.split("/").pop()}
                  </a>
                )}

                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <div className="message-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMessage(idx)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="archive-btn"
                    onClick={() => handleArchiveMessage(idx)}
                  >
                    <FaArchive />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* ARCHIVED MESSAGES */}
          {messages.some((msg) => msg.archived) && (
            <div className="archived-section">
              <h4>Archived Messages</h4>
              {messages
                .filter((msg) => msg.archived)
                .map((msg, idx) => (
                  <div key={idx} className="message archived">
                    {msg.text && <p>{msg.text}</p>}
                    {msg.file && (
                      <a href={msg.file} download>
                        {msg.file.split("/").pop()}
                      </a>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* TYPING INDICATOR */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(", ")}
            {typingUsers.length > 1 ? " are typing..." : " is typing..."}
          </div>
        )}

        {/* INPUT AREA */}
        <footer className="chat-input">
          {preview && (
            <div className="file-preview">
              <img src={preview} alt="preview" />
            </div>
          )}
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleTyping}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <FaSmile
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="icon emoji"
          />
          <FaPaperclip
            onClick={() => fileInputRef.current.click()}
            className="icon attach"
          />
          <FaPaperPlane onClick={handleSend} className="icon send" />

          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-grid">
                {[
                  "😀","😂","😊","😍","🥰","😘","😉","😎","🤔","😢","😭","😤","😡","👍","👎","👌","✌️","🤞","👏","🙌","🤝","🙏","💪","❤️","💔","💯","🔥","⭐","✨","🎉","🎊"
                ].map((emoji) => (
                  <span
                    key={emoji}
                    className="emoji-item"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}
        </footer>

        {/* PROFILE EDITOR */}
        {showProfileEditor && (
          <div className="profile-modal">
            <div className="modal-content">
              <h2>Edit Profile</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const updatedUser = {
                    ...user,
                    username: form.name.value || user.username,
                    bio: form.bio.value || user.bio,
                    photo: form.photo.files[0]
                      ? URL.createObjectURL(form.photo.files[0])
                      : user.photo,
                  };
                  updateUser(updatedUser);
                  setShowProfileEditor(false);
                }}
              >
                <label>Name</label>
                <input type="text" name="name" defaultValue={user.username} />
                <label>Bio</label>
                <textarea name="bio" defaultValue={user.bio || ""}></textarea>
                <label>Photo</label>
                <input type="file" name="photo" accept="image/*" />
                <div className="modal-buttons">
                  <button type="submit">Save</button>
                  <button onClick={() => setShowProfileEditor(false)}>
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
