import React from "react";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About Donor Direct</h1>
        <p>
          <span className="highlight">Donor Direct</span> is an advanced emergency blood donation platform designed to save lives by providing real-time blood availability and rapid response during critical shortages.
        </p>
        <p>
          Our platform empowers hospitals and blood banks to instantly raise alerts when a specific blood type is in urgent need. When an emergency request is triggered, Donor Direct automatically identifies eligible past donors nearby—matching by blood group, geolocation, and donation history—and notifies them via SMS, email, or web push notifications.
        </p>
        <p>
          Hospitals benefit from a powerful dashboard to:
          <ul>
            <li>View and manage current emergency blood requests in real time</li>
            <li>Track donor responses and monitor blood inventory levels</li>
            <li>Coordinate with other hospitals for unit sharing and resource optimization</li>
          </ul>
        </p>
        <p>
          Donor Direct is built with security and privacy in mind. Our system features robust donor eligibility logic, role-based access control, and secure data handling to protect all users. We are committed to making blood donation more accessible, transparent, and efficient for everyone involved.
        </p>
        <p className="quote">
          "In every emergency, every second counts. Donor Direct connects those in need with heroes who can help—instantly."
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
