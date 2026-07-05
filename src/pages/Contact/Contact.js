import React, { useState } from "react";
import "./Contact.css";

const initialForm = { name: "", email: "", message: "" };

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Please enter a valid email.";
    if (!form.message.trim()) nextErrors.message = "Please enter a message.";
    return nextErrors;
  }

  // No backend exists yet, so this only validates and simulates a submission.
  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
    }
  }

  return (
    <div className="container section contact-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h1>Contact Us</h1>
        </div>
      </div>

      <div className="contact-layout">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
          {submitted && (
            <p className="form-note">
              Thanks — we'll get back to you within two business days.
            </p>
          )}
        </form>

        <div className="contact-details">
          <h3>Customer Care</h3>
          <p>hello@a-luxury.example</p>
          <h3>Studio</h3>
          <p>Canada</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
