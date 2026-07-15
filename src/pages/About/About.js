import React from "react";
import "./About.css";

function About() {
  return (
    <div>
      <section className="section about-hero">
        <div className="container">
          <span className="eyebrow">Our Story</span>
          <h1>Clothes are meant to be lived in.</h1>
          <p className="about-lede">
            A-LUXURY started with a simple frustration: most clothing is
            designed to look good on a hanger and fall apart after a year of
            wear. We build the opposite — pieces cut from natural fibers,
            finished by hand, and tested for the long haul before they ever
            reach a shelf.
          </p>
        </div>
      </section>

      <section className="section section-alt about-values">
        <div className="container about-values-grid">
          <div>
            <h3>Materials first</h3>
            <p>
              We source wool, cotton, and leather from mills we've worked with
              for years, not the lowest bidder each season.
            </p>
          </div>
          <div>
            <h3>Made to repair</h3>
            <p>
              Every A-LUXURY garment is built with reinforced seams and spare
              buttons, because repair should always beat replacement.
            </p>
          </div>
          <div>
            <h3>Small runs</h3>
            <p>
              We produce in limited batches. It costs more, but it means less
              waste and better quality control at every step.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-image">
        <div className="container">
          <img
            src="https://picsum.photos/seed/fold-about/1400/700"
            alt="FOLD workshop"
          />
        </div>
      </section>
    </div>
  );
}

export default About;
