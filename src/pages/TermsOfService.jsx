import React from "react";
import "../styles/Legal.css";

const TermsOfService = () => {
  return (
    <div className="legal-page">
  <div className="legal-card terms-wide">
        <h1>Terms of Service</h1>
        <p>Effective Date: August 6, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using DonorDirect, you agree to comply with and be bound by these terms.
            If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to register as a blood donor or request blood through our platform.
          </p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>
            Users must provide accurate information, follow donation guidelines, and not misuse the platform
            for fraudulent activities.
          </p>
        </section>

        <section>
          <h2>4. Modifications</h2>
          <p>
            We may update these Terms from time to time. Continued use of the platform signifies acceptance
            of the revised terms.
          </p>
        </section>

        <section>
          <h2>5. Contact Us</h2>
          <p>
            For questions or concerns, email us at <strong>support@donordirect.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
