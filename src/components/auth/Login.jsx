// src/components/auth/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PageWrapper from "../PageWrapper";
import "./Auth.scss";
import "./Login.scss";


export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);

    if (success) {
      navigate("/chat"); // go to chat after successful login
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <PageWrapper>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Sign in to continue chatting</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
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

            <button type="submit" className="btn-primary">
              Log In
            </button>

            <p className="redirectText">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
