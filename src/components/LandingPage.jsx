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
              src="https://media.istockphoto.com/id/1200899068/photo/abstract-rating-star-like-positive-feedback.jpg?s=612x612&w=0&k=20&c=vzAutEE4Ioe_tr6UfT9uJ51ZAP3tF8Wejkn8Nzb6tKE="
              alt="Chat illustration"
            />
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
