// src/components/LandingPage.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "./PageWrapper";
import "./LandingPage.scss";

export default function LandingPage() {
  const navigate = useNavigate();
  const { loading } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (loading) return;
    navigate("/signup");
  };

  return (
    <PageWrapper>
      <div className="landingContainer">
        <section className="card">
          <div className="textSection">
            <div className="logo">
              <span className="logoIcon">💬</span>
              <span className="logoText">ChatVerse</span>
            </div>

            <h1 className="headline">
              Real-time <br /> messaging <br /> web app
            </h1>

            <div className="vertical-marquee">
              <div className="marquee-content">
                <span className="marquee-item">Welcome to ChatVerse!</span>
                <span className="marquee-item">Connect with your friends in real-time!</span>
                <span className="marquee-item">Experience seamless communication!</span>
              </div>
            </div>

            <p className="subheadline">
              Connect with your friends and colleagues in real-time.
            </p>

            <button
              className="getStarted"
              onClick={handleGetStarted}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Started"}
            </button>
          </div>

          <div className="imageSection">
            <img
              src="https://plus.unsplash.com/premium_photo-1683133755831-f868acb68202?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNvbW11bmljYXRpb258ZW58MHx8MHx8fDA%3D"
              alt="Chat illustration"
            />
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
