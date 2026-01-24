import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HomePage.css";

function HomePage() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="home-container">
      {/* Slider Section */}
      <div className="slider-container">
        <button className="slider-arrow left-arrow" onClick={() => sliderRef.current.slickPrev()}>
          ❮
        </button>
        <Slider ref={sliderRef} {...settings}>
          <div>
            <img src="/images/slide5.png" alt="1" className="slider-image" />
          </div>
          <div>
            <img src="/images/slide5.png" alt="1" className="slider-image" />
          </div><div>
            <img src="/images/slide5.png" alt="1" className="slider-image" />
          </div>
        </Slider>
        <button className="slider-arrow right-arrow" onClick={() => sliderRef.current.slickNext()}>
          ❯
        </button>
      </div>

      {/* Three Enlarged Cards */}
      <div className="container sections-container">
        <div className="row">
          <div className="col-md-4">
            <div className="custom-card">
              <h5 className="card-title">Real-Time Blood Alerts</h5>
              <p className="card-text">
                Get instant notifications when your blood type is needed nearby. Respond quickly and help save lives in emergencies.
              </p>
              <button className="card-btn" onClick={() => navigate('/LiveDonorBoard')}>View Alerts</button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="custom-card">
              <h5 className="card-title">Nearby Camps & Awareness Programs</h5>
              <p className="card-text">
                Find upcoming blood donation camps and awareness seminars near you.  
                Join and make a difference!
              </p>
              <button
                className="card-btn"
                onClick={() => navigate('/EventsPage')}
              >
                View & Add Events
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="custom-card">
              <h5 className="card-title">Hospital Dashboard</h5>
              <p className="card-text">
                Hospitals can monitor blood inventory, manage emergency requests, and coordinate with other centers—all in one place.
              </p>
              <button className="card-btn" onClick={() => navigate('/Hospital')}>Hospital Login</button>
            </div>
          </div>
        </div>
      </div>

      {/* Donate CTA */}
      <div className="container" style={{marginTop:20, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <div className="row" style={{width:'100%', display:'flex', justifyContent:'center'}}>
          <div className="col-12" style={{display:'flex', justifyContent:'center'}}>
            <div className="custom-card cta-horizontal-card">
              <h5 className="card-title" style={{color:'#d62828', width: '100%'}}>Ready to Make a Difference?</h5>
              <div className="cta-horizontal-content">
                <div className="cta-horizontal-text">
                  <p className="card-text" style={{color:'#333', fontWeight: 500}}>
                    Whether you want to <span style={{color:'#e74c3c', fontWeight:'bold'}}>donate blood</span> or <span style={{color:'#1976d2', fontWeight:'bold'}}>request blood</span>, you can help save lives or get the help you need—quickly and easily.
                  </p>
                </div>
                <div className="cta-horizontal-buttons">
                  <button className="card-btn" style={{background:'#e74c3c', minWidth: '140px', fontWeight:'bold'}} onClick={() => navigate('/donate')}>
                    Donate Now
                  </button>
                  <button className="card-btn" style={{background:'#1976d2', minWidth: '140px', fontWeight:'bold'}} onClick={() => navigate('/request')}>
                    Request Blood
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Blood Donation Information Section (Two Columns - 65% and 35%) */}
      <div className="donation-info-section">
        <div className="container">
          <div className="row">
            {/* Left Column (65% - Information) */}
            <div className="col-md-8 donation-text-section">
              <h2 className="donation-heading">Why Donate Blood?</h2>
              <p className="donation-text">
                Every 2 seconds, someone in the world needs blood. Whether it's for an accident victim, a cancer patient, or a life-saving surgery, blood donation is a crucial need in healthcare.
              </p>
      
              <h3 className="donation-subheading">Benefits of Blood Donation</h3>
              <p className="donation-text">
                Blood donation is not just about helping others—it benefits the donor too! Regular donation helps maintain heart health, stimulates blood cell production, and reduces the risk of certain diseases.
              </p>
              <h3 className="donation-subheading">How You Can Help</h3>
              <p className="donation-text">
                By donating just one pint of blood, you can save up to 3 lives. It only takes 15 minutes to donate, but the impact lasts a lifetime.
              </p>
              <p className="donation-text">
                Join us in making a difference—become a donor today!
              </p>
            </div>

            {/* Right Column (35% - Empty for Future Table/Image) */}
            <div className="col-md-4 donation-image-section">
              {/* You can add an image or table here later */}
              <img src="/images/donation.png" alt="donation.png" />
            </div>
          </div>
        </div>
      </div>

      {/* Blood Donation Statistics Section */}
<div className="blood-donation-stats-section">
  <div className="container">
    <h2 className="stats-heading">Blood Donation: Key Facts & Figures</h2>
    <p className="stats-description">
      Blood donation saves lives every day. Here are some up-to-date and important statistics about blood donation in India and around the world.
    </p>
    <div className="row">
      {/* Card 1 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">Global Blood Needs</h5>
          <ul className="stats-list">
            <li>Every 2 seconds, someone in the world needs blood.</li>
            <li>More than 118 million blood donations are collected globally each year.</li>
            <li>Low- and middle-income countries collect only 40% of the world’s blood donations.</li>
          </ul>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">India's Blood Challenge</h5>
          <ul className="stats-list">
            <li>India needs 15 million blood units annually, but collects only about 12 million.</li>
            <li>Blood shortages are most severe in rural and remote areas.</li>
            <li>Voluntary donors provide over 80% of India’s blood supply.</li>
          </ul>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">Donor Facts</h5>
          <ul className="stats-list">
            <li>Only 1% of eligible people donate blood regularly.</li>
            <li>Healthy adults can donate blood every 3 months.</li>
            <li>Blood donation is safe and takes about 15 minutes.</li>
          </ul>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">Impact of One Donation</h5>
          <ul className="stats-list">
            <li>One donation can save up to 3 lives.</li>
            <li>Each donation provides red cells, plasma, and platelets.</li>
            <li>Regular donors help maintain a stable blood supply.</li>
          </ul>
        </div>
      </div>

      {/* Card 5 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">Blood Shelf Life</h5>
          <ul className="stats-list">
            <li>Red blood cells last up to 42 days after donation.</li>
            <li>Platelets expire in just 5–7 days.</li>
            <li>Continuous donations are needed to meet ongoing demand.</li>
          </ul>
        </div>
      </div>

      {/* Card 6 */}
      <div className="col-md-4 mb-4">
        <div className="stats-card">
          <h5 className="stats-card-title">Rare Blood Types</h5>
          <ul className="stats-list">
            <li>O-negative is the universal donor for red cells.</li>
            <li>AB-positive is the universal plasma donor.</li>
            <li>Less than 1% of people have AB-negative blood.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

  </div>



      

  );
}

export default HomePage;
