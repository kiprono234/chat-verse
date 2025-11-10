import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "", // will store Base64 or file URL
  });

  const navigate = useNavigate();

  // handle text input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, avatar } = formData;

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Save user data (for demo: using localStorage)
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/chat");
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join the conversation — upload your photo!</p>

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

          {/* 🖼️ Image upload field */}
          <div className="fileUploadSection">
            <p>Upload Profile Photo</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {formData.avatar && (
              <div className="imagePreview">
                <img
                  src={formData.avatar}
                  alt="Profile preview"
                  className="previewImage"
                />
              </div>
            )}
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
