// src/components/auth/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Signup.scss";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    photo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setFormData({ ...formData, photo: upload.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.photo) {
      setError("Please fill all fields and upload a photo!");
      return;
    }

    setLoading(true);
    signup(formData);
    setLoading(false);
    navigate("/chat");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join the ChatVerse community 🎉</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="upload-label">
            Upload Profile Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </label>

          {formData.photo && (
            <div className="photo-preview">
              <img src={formData.photo} alt="preview" />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="redirect-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
}
