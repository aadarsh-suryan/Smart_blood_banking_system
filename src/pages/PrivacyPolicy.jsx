import React from "react";
import "../styles/Legal.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-card">
        <h1>Privacy Policy</h1>
        <p>Effective Date: August 6, 2025</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information such as name, email, phone number, and location
            to facilitate blood donations and improve your experience.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            Your data is used solely for connecting donors and recipients, sending notifications,
            and enhancing our services. We do not sell or share your personal information with third parties.
          </p>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard encryption and security measures to protect your data.
            Your information is stored securely on our servers.
          </p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>
            You can access, update, or delete your information anytime by logging into your account.
          </p>
        </section>

        <section>
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy, reach us at <strong>privacy@donordirect.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;