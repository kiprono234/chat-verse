import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
  ];

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarSelect = (avatar) =>
    setFormData({ ...formData, avatar });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.avatar) {
      alert("Please fill in all fields and select an avatar");
      return;
    }
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/chat");
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join the conversation — pick your look!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="avatarSelection">
            <p>Select an Avatar</p>
            <div className="avatarList">
              {avatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`avatar-${i}`}
                  className={`avatarOption ${
                    formData.avatar === avatar ? "selected" : ""
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="authButton">Sign Up</button>

          <p className="redirectText">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
}
