import React, { useState } from "react";
import "../styles/Contact.css";

const faqs = [
  {
    question: "How can I become a blood donor?",
    answer: "You can register on our platform and schedule a donation at a nearby hospital or camp.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, we prioritize privacy and your data is encrypted and secured.",
  },
  {
    question: "Can I cancel a blood request after submission?",
    answer: "Yes, you can cancel any request from your dashboard within 24 hours.",
  },
];

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.error || "Failed to send message.");
      }
    } catch {
      setStatus("Server error. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <p>Have questions or need assistance? Reach out below — we're here to help!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send Message</button>
          {status && <div className="contact-status">{status}</div>}
        </form>

        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> contact@donordirect.com</p>
          <p><strong>Phone:</strong> +91 7042017583</p>
          <p><strong>Address:</strong> Donor Direct Avenue, Delhi, India</p>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className={`faq-question ${openIndex === i ? "open" : ""}`}
                onClick={() => toggleFAQ(i)}
              >
                {faq.question}
              </button>
              {openIndex === i && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
