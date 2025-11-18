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
} from "react-icons/fa";
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
  const [preview, setPreview] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef();
  const socketRef = useRef();
  const chatContainerRef = useRef();
  const resizeObserverRef = useRef();
  const scrollTimeoutRef = useRef();


  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("newUser", user);

    socket.on("activeUsers", (users) => setActiveUsers(users));

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

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      console.log("ResizeObserver triggered", entries.length, "entries");
      entries.forEach((entry) => {
        console.log("Resize:", entry.contentRect);
      });
    });
    observer.observe(chatContainerRef.current);
    resizeObserverRef.current = observer;

    return () => observer.disconnect();
  }, []);

    const scrollToBottomSafe = () => {
    try {
      const container = chatContainerRef.current;
      if (!container) return;
      console.log("Setting scrollTop to", container.scrollHeight);
      // Debounce with requestAnimationFrame to prevent ResizeObserver loops
      requestAnimationFrame(() => {
        if (container) container.scrollTop = container.scrollHeight;
      });
    } catch (err) {
      console.log("Error in scrollToBottomSafe:", err);
      // ignore ResizeObserver warnings
    }
  };

  // Scroll after new messages, images, or files are added
  useEffect(() => {
    console.log("useEffect triggered for scrolling, messages length:", messages.length);
    if (!chatContainerRef.current) return;

    // Clear any pending scroll
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const container = chatContainerRef.current;
    const imgs = container.querySelectorAll("img");
    let loaded = 0;

    const triggerScroll = () => {
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToBottomSafe();
        scrollTimeoutRef.current = null;
      }, 100); // Debounce delay
    };

    if (imgs.length === 0) {
      console.log("No images, scrolling immediately");
      triggerScroll();
      return;
    }

    console.log("Waiting for", imgs.length, "images to load");
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) {
          console.log("All images already loaded, scrolling");
          triggerScroll();
        }
      } else {
        img.onload = () => {
          loaded++;
          console.log("Image loaded, loaded count:", loaded);
          if (loaded === imgs.length) {
            console.log("All images loaded, scrolling");
            triggerScroll();
          }
        };
      }
    });
  }, [messages]);

  
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
    };

    socketRef.current.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);

    setInput("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current.emit("typing", {
      username: user.username,
      isTyping: e.target.value.length > 0,
    });
  };

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

  const insertEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
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
          {messages.map((msg, idx) => (
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
                    <img src={msg.file} className="chat-image" alt="upload" />
                    <a
                      href={msg.file}
                      download={msg.file.split("/").pop()}
                      className="download-btn"
                      title="Download image"
                    >
                      <FaDownload />
                    </a>
                  </div>
                )}

                {msg.file && !isImage(msg.fileType) && (
                  <a
                    href={msg.file}
                    className="file-download"
                    download={msg.file.split("/").pop()}
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
              </div>
            </div>
          ))}
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
                {["😀", "😂", "😊", "😍", "🥰", "😘", "😉", "😎", "🤔", "😢", "😭", "😤", "😡", "👍", "👎", "👌", "✌️", "🤞", "👏", "🙌", "🤝", "🙏", "💪", "❤️", "💔", "💯", "🔥", "⭐", "✨", "🎉", "🎊"].map((emoji) => (
                  <span
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="emoji-item"
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
