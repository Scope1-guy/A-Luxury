import React, { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // There's no backend, so this just simulates a successful signup.
  // Swap this handler for a real API/email-provider call later.
  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  }

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <span className="eyebrow">Stay in the loop</span>
          <h2>Get new arrivals before anyone else.</h2>
        </div>

        {submitted ? (
          <p className="newsletter-success">You're on the list — thank you.</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
