import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© 2025 DonorDirect. All rights reserved.</p>
        <div className="footer-links">
          <a href="/PrivacyPolicy">Privacy Policy</a>
          <span>|</span>
          <a href="/TermsOfService">Terms of Service</a>
          <span>|</span>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
