import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
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

          <button className="getStarted" onClick={() => navigate('/chat')}>
            Get Started
          </button>
        </div>

        <div className="imageSection">
          <img
            src="https://play-lh.googleusercontent.com/Aj8M9XabOBgWGibBodYraeLDCmQxpdJvreOCSAlBgxlSB0167Lv92hsps9BU1hnktcQvVZYecs1Eos36u71j"
            alt="Chat illustration"
            className="chatImage"
          />
        </div>
      </section>

      <div className="marquee">
        <div className="track">
          <span>🚀 Powering Conversations at Light Speed — Chat Smarter with ChatVerse 🚀</span>
          <span>🚀 Powering Conversations at Light Speed — Chat Smarter with ChatVerse 🚀</span>
        </div>
      </div>
    </div>
  );
}
