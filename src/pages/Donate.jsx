import React, { useState, useEffect } from "react";
import { 
  FaHeartbeat, 
  FaUserPlus, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaHospital, 
  FaThermometerHalf, 
  FaWeight, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaCopy,
  FaStar,
  FaTrophy,
  FaUsers,
  FaClock,
  FaUserCheck,
  FaTruck,
  FaUserClock
} from "react-icons/fa";
import "../styles/Donate.css";

const Donate = () => {
  const [formData, setFormData] = useState({
    blood_type: "",
    units: "",
    donation_date: "",
    address: "",
    age: "",
    hemoglobin: "",
    weight: "",
    healthy: false,
    hospital: ""
  });
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [locDenied, setLocDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [donationCompleted, setDonationCompleted] = useState(false);
  const [socialShare, setSocialShare] = useState(true);
  const [donationJourney, setDonationJourney] = useState({
    stage: 'registered',
    steps: [
      { id: 'registered', label: 'Registered', completed: true, icon: FaUserPlus },
      { id: 'eligible', label: 'Eligible', completed: false, icon: FaUserCheck },
      { id: 'scheduled', label: 'Scheduled', completed: false, icon: FaCalendarAlt },
      { id: 'completed', label: 'Completed', completed: false, icon: FaCheckCircle },
      { id: 'delivered', label: 'Delivered to Hospital', completed: false, icon: FaTruck }
    ]
  });

  const defaultHospitals = [
    'AIIMS Hospital, Delhi',
    'SGPGI Hospital, Lucknow',
    'Kokilaben Hospital, Mumbai',
    'Apollo Hospital, Chennai',
    'Fortis Hospital, Bangalore',
    'Max Super Specialty Hospital, Delhi',
    'Narayana Health, Bengaluru',
    'Medanta - The Medicity, Gurgaon',
    'Tata Memorial Hospital, Mumbai',
    'Safdarjung Hospital, Delhi',
    'Ram Manohar Lohia Hospital, Delhi',
    'Lady Hardinge Medical College, Delhi',
    'KEM Hospital, Mumbai',
    'JJ Hospital, Mumbai',
    'Christian Medical College, Vellore',
    'Post Graduate Institute, Chandigarh',
    'All India Institute of Medical Sciences, Jodhpur',
    'King George Medical University, Lucknow',
    'Banaras Hindu University Medical College, Varanasi',
    'Institute of Medical Sciences, BHU, Varanasi'
  ];

  useEffect(() => {
    // Fetch current user for name
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setUser(data);
        if (data && data.preferredHospital) {
          setFormData(prev => ({ ...prev, hospital: data.preferredHospital }));
        }
      })
      .catch(() => setUser(null));
  }, []);
  
  useEffect(() => {
    // Geolocate and fetch nearby hospitals from OpenStreetMap Nominatim
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&amenity=hospital&limit=10&addressdetails=1&lat=${latitude}&lon=${longitude}&countrycodes=in`);
        const data = await resp.json();
        const mapped = data.map(h => ({
          id: h.place_id,
          name: h.display_name,
          lat: h.lat,
          lon: h.lon
        }));
        setNearbyHospitals(mapped);
      } catch (e) {
        // silently ignore
      }
    }, () => setLocDenied(true), { enableHighAccuracy: true, timeout: 8000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const updateJourneyStage = (stage) => {
    setDonationJourney(prev => ({
      ...prev,
      stage,
      steps: prev.steps.map(step => ({
        ...step,
        completed: step.id === stage || prev.steps.find(s => s.id === step.id)?.completed
      }))
    }));
  };

  const generateSocialShareBadge = () => {
    const messages = [
      `I donated blood today! 🩸 #LifeSaver #BloodDonation #${formData.blood_type}`,
      `Just saved a life with blood donation! 💪 #Hero #BloodDonor #${formData.blood_type}`,
      `Proud to be a blood donor! 🩸 #GiveLife #BloodDonation #${formData.blood_type}`,
      `Another successful blood donation! 🎉 #Lifesaver #BloodDonor #${formData.blood_type}`,
      `Blood donation = Life donation! 🩸 #SaveLives #BloodDonor #${formData.blood_type}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const shareToSocialMedia = (platform) => {
    const message = generateSocialShareBadge();
    const encodedMessage = encodeURIComponent(message);
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}%20${encodeURIComponent(window.location.href)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    const text = generateSocialShareBadge();
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied to clipboard!');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validation
    const age = parseInt(formData.age, 10);
    const hemo = parseFloat(formData.hemoglobin);
    const weight = parseFloat(formData.weight);
    
    if (isNaN(age) || age < 18 || age > 65) {
      setFormError("Age must be between 18 and 65 years old.");
      return;
    }
    
    if (formData.hemoglobin !== "") {
      if (isNaN(hemo) || hemo < 12.5) {
        setFormError("Hemoglobin count must be at least 12.5 g/dl if provided.");
        return;
      }
    }
    
    if (isNaN(weight) || weight < 45) {
      setFormError("Weight must be at least 45 kg.");
      return;
    }
    
    if (!formData.healthy) {
      setFormError("You must confirm you are healthy and fit to donate today.");
      return;
    }

    if (!formData.hospital) {
      setFormError("Please select a preferred hospital.");
      return;
    }

    try {
      setLoading(true);
      
      // Update journey to eligible stage
      updateJourneyStage('eligible');
      
      const token = localStorage.getItem("token");
      
      // Submit to backend
      const res = await fetch("http://localhost:4000/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }
      
      const result = await res.json();
      
      // Submit to real-time analytics system
      try {
        const realtimeData = {
          type: 'donation',
          blood_type: formData.blood_type,
          units: parseInt(formData.units) || 1,
          city: formData.address.split(',').pop().trim() || 'Delhi', // Extract city from address
          date: formData.donation_date || new Date().toISOString().split('T')[0],
          urgency: 'normal',
          source: 'donation_form',
          donor_info: {
            age: parseInt(formData.age),
            hemoglobin: parseFloat(formData.hemoglobin),
            weight: parseFloat(formData.weight),
            hospital: formData.hospital
          }
        };
        
        await fetch("http://localhost:4000/api/realtime/donation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(realtimeData),
        });
        
        console.log("Real-time data submitted successfully");
      } catch (realtimeError) {
        console.warn("Real-time data submission failed:", realtimeError);
        // Don't fail the main donation process if real-time fails
      }
      
      // Update journey to completed stage
      updateJourneyStage('completed');
      
      // Add donor to live donor board (localStorage)
      if (user) {
        const liveDonors = JSON.parse(localStorage.getItem('liveDonors') || '[]');
        const newDonor = {
          id: Date.now(),
          name: user.fullname,
          bloodGroup: formData.blood_type,
          location: formData.address,
          contact: user.phone || "",
          hospital: formData.hospital,
          availability: "Immediate",
          notes: `Donor registered on ${new Date().toLocaleDateString()}`,
          status: "Available",
          addedAt: new Date().toISOString(),
          isEmergency: false,
          lastDonation: new Date().toISOString(),
          totalDonations: 1,
          rating: 5.0,
          verified: true,
          socialShare: socialShare,
          journeyStage: "completed"
        };
        
        liveDonors.push(newDonor);
        localStorage.setItem('liveDonors', JSON.stringify(liveDonors));
        
        // Save donation journey
        const journeys = JSON.parse(localStorage.getItem('donationJourneys') || '{}');
        journeys[newDonor.id] = {
          stage: 'completed',
          hospital: formData.hospital,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('donationJourneys', JSON.stringify(journeys));
        
        setDonationCompleted(true);
        
        // Show success message with option to share
        if (socialShare) {
          setShowShareModal(true);
        } else {
          const viewDonors = window.confirm(
            `✅ Donation submitted successfully!\n\n` +
            `You are now registered as a blood donor.\n` +
            `Would you like to view the Live Donor Board?`
          );
          
          if (viewDonors) {
            window.location.href = '/LiveDonorBoard';
          }
        }
      }
      
      // Reset form
      setFormData({
        blood_type: "",
        units: "",
        donation_date: "",
        address: "",
        age: "",
        hemoglobin: "",
        weight: "",
        healthy: false,
        hospital: ""
      });
      
    } catch (err) {
      console.error(err);
      if (err.message.includes('Backend error')) {
        alert("Backend service unavailable. Your donation has been saved locally and will appear in the Live Donor Board.");
        // Still save locally even if backend fails
        if (user) {
          const liveDonors = JSON.parse(localStorage.getItem('liveDonors') || '[]');
          const newDonor = {
            id: Date.now(),
            name: user.fullname,
            bloodGroup: formData.blood_type,
            location: formData.address,
            contact: user.phone || "",
            hospital: formData.hospital,
            availability: "Immediate",
            notes: `Donor registered on ${new Date().toLocaleDateString()} (Local save)`,
            status: "Available",
            addedAt: new Date().toISOString(),
            isEmergency: false,
            lastDonation: new Date().toISOString(),
            totalDonations: 1,
            rating: 5.0,
            verified: true,
            socialShare: socialShare,
            journeyStage: "completed"
          };
          
          liveDonors.push(newDonor);
          localStorage.setItem('liveDonors', JSON.stringify(liveDonors));
          
          updateJourneyStage('completed');
          setDonationCompleted(true);
          
          if (socialShare) {
            setShowShareModal(true);
          } else {
            const viewDonors = window.confirm(
              `✅ Donation saved locally!\n\n` +
              `Backend service was unavailable, but your donation has been saved.\n` +
              `Would you like to view the Live Donor Board?`
            );
            
            if (viewDonors) {
              window.location.href = '/LiveDonorBoard';
            }
          }
        }
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getJourneyProgress = () => {
    const completedSteps = donationJourney.steps.filter(step => step.completed).length;
    return (completedSteps / donationJourney.steps.length) * 100;
  };

  return (
    <div className="donate-container">
      <div className="donate-header">
        <h2><FaHeartbeat /> Donate Blood</h2>
        <p>Join the lifesaving community and make a difference</p>
      </div>

      {/* Donation Journey Tracker */}
      {donationCompleted && (
        <div className="journey-tracker-section">
          <h3>Your Donation Journey</h3>
          <div className="journey-progress">
            <div 
              className="journey-progress-bar"
              style={{ width: `${getJourneyProgress()}%` }}
            ></div>
          </div>
          <div className="journey-steps">
            {donationJourney.steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className={`journey-step ${step.completed ? 'completed' : ''}`}>
                  <div className="step-icon">
                    <IconComponent />
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="donate-requirements">
        <div className="requirements-header">
          <FaExclamationTriangle />
          <h4>Eligibility & Health Requirements</h4>
        </div>
        <div className="requirements-content">
          <div className="requirement-item">
            <FaUserPlus />
            <span><strong>Age:</strong> 18-65 years</span>
          </div>
          <div className="requirement-item">
            <FaThermometerHalf />
            <span><strong>Hemoglobin Count:</strong> at least 12.5 g/dl</span>
          </div>
          <div className="requirement-item">
            <FaWeight />
            <span><strong>Weight:</strong> minimum 45 kg</span>
          </div>
          <div className="requirement-item">
            <FaCheckCircle />
            <span><strong>Health Status:</strong> Normal body temperature, feeling healthy</span>
          </div>
        </div>
        <div className="requirements-tips">
          <strong>Tips:</strong> Drink lots of water before donating. Eat a well-balanced meal before and after donation to stay healthy and fit.
        </div>
      </div>

      {formError && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="donate-form">
        <div className="form-grid">
          <div className="form-group">
            <label>
              <FaUserPlus /> Age
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="65"
              value={formData.age}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <FaHospital /> Preferred Hospital
            </label>
            <select 
              name="hospital" 
              value={formData.hospital} 
              onChange={handleChange} 
              required
              className="form-input"
            >
              <option value="">Select hospital</option>
              {defaultHospitals.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
              {nearbyHospitals.length > 0 && (
                <optgroup label="Nearby Hospitals">
                  {nearbyHospitals.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaThermometerHalf /> Hemoglobin Count (g/dl)
            </label>
            <input
              type="number"
              name="hemoglobin"
              min="0"
              step="0.1"
              value={formData.hemoglobin}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <FaWeight /> Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              min="0"
              value={formData.weight}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <FaHeartbeat /> Blood Type
            </label>
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaUsers /> Units
            </label>
            <input
              type="number"
              name="units"
              min="1"
              value={formData.units}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt /> Donation Date
            </label>
            <input
              type="date"
              name="donation_date"
              value={formData.donation_date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>
              <FaMapMarkerAlt /> Address
            </label>
            <textarea
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="health-confirmation">
          <label className="health-checkbox">
            <input
              type="checkbox"
              name="healthy"
              checked={formData.healthy}
              onChange={handleChange}
              required
            />
            {/* <span className="checkmark"></span> */}
            <span className="label-text">
              I confirm I have a normal body temperature and feel healthy today.
            </span>
          </label>
        </div>

        <div className="social-share-toggle">
          <label className="share-checkbox">
            <input
              type="checkbox"
              checked={socialShare}
              onChange={(e) => setSocialShare(e.target.checked)}
            />
            {/* <span className="checkmark"></span> */}
            <span className="label-text">
              <FaShare /> Share my donation on social media
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Submitting...
            </>
          ) : (
            <>
              <FaHeartbeat />
              Submit Donation
            </>
          )}
        </button>
      </form>

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Your Donation Badge</h3>
              <button 
                className="close-btn"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="share-badge">
                <div className="badge-content">
                  <FaHeartbeat className="badge-icon" />
                  <h4>I donated blood today! 🩸</h4>
                  <p>#LifeSaver #BloodDonation #{formData.blood_type}</p>
                </div>
              </div>
              
              <div className="share-options">
                <h4>Share on:</h4>
                <div className="social-buttons">
                  <button 
                    onClick={() => shareToSocialMedia('facebook')}
                    className="social-btn facebook"
                  >
                    <FaFacebook /> Facebook
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('twitter')}
                    className="social-btn twitter"
                  >
                    <FaTwitter /> Twitter
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('whatsapp')}
                    className="social-btn whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('linkedin')}
                    className="social-btn linkedin"
                  >
                    <FaLinkedin /> LinkedIn
                  </button>
                </div>
                
                <div className="copy-section">
                  <button 
                    onClick={copyToClipboard}
                    className="copy-btn"
                  >
                    <FaCopy /> Copy Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;
