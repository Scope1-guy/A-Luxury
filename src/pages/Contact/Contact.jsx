import React, { useState } from "react";
import { WHATSAPP_NUMBER } from "../../config";
import { openWhatsApp } from "../../lib/whatsapp";
import "./Contact.css";

const initialForm = { name: "", message: "" };

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.message.trim()) nextErrors.message = "Please enter a message.";
    return nextErrors;
  }

  // There's no email backend: the message is sent through WhatsApp instead.
  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    openWhatsApp(
      `Hello A-LUXURY, my name is ${form.name.trim()}.\n\n${form.message.trim()}`
    );
    setForm(initialForm);
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

          <button type="submit" className="btn btn-whatsapp">
            Send on WhatsApp
          </button>
          <p className="form-note">
            This opens WhatsApp with your message ready to send.
          </p>
        </form>

        <div className="contact-details">
          {WHATSAPP_NUMBER && (
            <>
              <h3>WhatsApp</h3>
              <p>+{WHATSAPP_NUMBER}</p>
            </>
          )}
          <h3>Studio</h3>
          <p>Canada</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
