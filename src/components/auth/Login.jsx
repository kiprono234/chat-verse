// src/components/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.scss";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === form.email &&
      storedUser.password === form.password
    ) {
      localStorage.setItem("user", JSON.stringify(storedUser));
      navigate("/chat");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Sign in to continue chatting</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="authButton">
            Login
          </button>
        </form>

        <div className="authFooter">
          <p>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/reset-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
