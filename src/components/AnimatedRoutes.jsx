// src/components/AnimatedRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import all pages/components as default exports
import ChatPage from "./ChatPage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import NotFoundPage from "./NotFoundPage";

export default function AnimatedRoutes() {
  return (
    <Routes>
      {/* Landing/Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Chat page */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirect unknown routes to 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
