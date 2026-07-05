import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Autumn / Winter</span>
          <h1>Clothes built around the A LUXURY, not the trend.</h1>
          <p className="hero-sub">
            Natural fabrics, considered cuts, and construction meant to outlast
            the season it was bought in.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">
              Shop the Collection
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <img
            src="https://picsum.photos/seed/fold-hero/1000/1200"
            alt="Model wearing the A LUXURY wool overcoat"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
