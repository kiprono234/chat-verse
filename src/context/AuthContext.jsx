// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { signup as apiSignup, login as apiLogin } from "../api/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("chatverse_user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    console.log("Signup attempt with data:", formData);
    try {
      const result = await apiSignup({ name: formData.username, email: formData.email, password: formData.password });
      console.log("Signup result:", result);
      setUser(result.user);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await apiLogin({ email, password });
      console.log("Login result:", result);
      setUser(result.user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("chatverse_user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("chatverse_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
