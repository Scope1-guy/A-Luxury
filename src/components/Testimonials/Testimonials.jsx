import React from 'react';
import testimonials from '../../data/testimonials';
import './Testimonials.css';

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">In their words</span>
            <h2>What people are wearing</h2>
          </div>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="testimonial-card">
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-location">{t.location}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
