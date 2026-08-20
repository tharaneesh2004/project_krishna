import React from 'react';
import './Hero.css';
import heroBg from '../assets/hero_bg.jpg';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img src={heroBg} alt="Elegant woman in silk saree" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-ornament">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
              <path d="M0 10 Q15 0 30 10 Q45 20 60 10" stroke="#b8935a" strokeWidth="1.5" fill="none"/>
              <circle cx="30" cy="10" r="3" fill="#b8935a"/>
            </svg>
          </div>
          <h2 className="hero-title">
            Timeless Drapes.
            <br />
            <em>Modern Grace.</em>
          </h2>
          <p className="hero-subtitle">
            Exquisite sarees crafted for every
            <br />
            moment, every memory.
          </p>
          <div className="hero-buttons">
            <a href="#collections" className="btn btn-primary">Explore Collection</a>
            <a href="#new" className="btn btn-outline">View New Arrivals</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
