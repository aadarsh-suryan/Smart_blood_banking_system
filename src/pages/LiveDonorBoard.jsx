import React, { useState, useEffect } from "react";
import { 
  FaHospital, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaWhatsapp, 
  FaUserPlus, 
  FaSearch, 
  FaSync,
  FaHeartbeat, 
  FaCalendarAlt,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaUserCheck,
  FaUserClock,
  FaBell,
  FaFire,
  FaStar,
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaCopy,
  FaFilter,
  FaSort,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import "../styles/LiveDonorBoard.css";

const LiveDonorBoard = () => {
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [donationJourneys, setDonationJourneys] = useState({});

  const [sortBy, setSortBy] = useState('recent');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const defaultHospitals = [
    { name: "AIIMS Hospital", city: "Delhi", state: "Delhi", emergency: true },
    { name: "SGPGI Hospital", city: "Lucknow", state: "Uttar Pradesh", emergency: true },
    { name: "Kokilaben Hospital", city: "Mumbai", state: "Maharashtra", emergency: true },
    { name: "Apollo Hospital", city: "Chennai", state: "Tamil Nadu", emergency: true },
    { name: "Fortis Hospital", city: "Bangalore", state: "Karnataka", emergency: true }
  ];

  useEffect(() => {
    loadData();
    loadEmergencyRequests();
    loadDonationJourneys();
    setLoading(false);
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, selectedHospital, selectedBloodGroup, searchTerm, showEmergencyOnly, sortBy]);

  const loadData = () => {
    const localDonors = JSON.parse(localStorage.getItem('liveDonors') || '[]');
    
    if (localDonors.length === 0) {
      const sampleDonors = [
        {
          id: 1,
          name: "Ajay Singh",
          bloodGroup: "O+",
          location: "Mumbai, Maharashtra",
          contact: "9876543210",
          availability: "Immediate",
          notes: "Available for emergency donations",
          status: "Available",
          addedAt: new Date().toISOString(),
          isEmergency: true,
          lastDonation: "2024-01-15",
          totalDonations: 5,
          rating: 4.8,
          verified: true,
          socialShare: true,
          journeyStage: "completed"
        },
        {
          id: 2,
          name: "Dipanshu Sahu",
          bloodGroup: "A+",
          location: "Delhi, Delhi",
          contact: "9876543211",
          availability: "Within 24 hours",
          notes: "Prefer morning appointments",
          status: "Available",
          addedAt: new Date().toISOString(),
          isEmergency: false,
          lastDonation: "2024-02-01",
          totalDonations: 3,
          rating: 4.5,
          verified: true,
          socialShare: false,
          journeyStage: "scheduled"
        },
        {
          id: 3,
          name: "Aniket Pandey",
          bloodGroup: "B+",
          location: "Bangalore, Karnataka",
          contact: "9876543212",
          availability: "Weekends only",
          notes: "Available on Saturdays and Sundays",
          status: "Available",
          addedAt: new Date().toISOString(),
          isEmergency: false,
          lastDonation: "2024-01-20",
          totalDonations: 2,
          rating: 4.2,
          verified: false,
          socialShare: true,
          journeyStage: "registered"
        }
      ];
      localStorage.setItem('liveDonors', JSON.stringify(sampleDonors));
      setDonors(sampleDonors);
      setFilteredDonors(sampleDonors);
    } else {
      setDonors(localDonors);
      setFilteredDonors(localDonors);
    }

    const localHospitals = JSON.parse(localStorage.getItem('hospitalData') || '[]');
    let baseHospitals = [];
    if (Array.isArray(localHospitals)) {
      baseHospitals = localHospitals;
    } else if (localHospitals && localHospitals.name) {
      baseHospitals = [localHospitals];
    }
    
    const merged = [...defaultHospitals, ...baseHospitals];
    const uniqueByName = Array.from(new Map(merged.map(h => [h.name, h])).values());
    uniqueByName.sort((a,b) => (a.city||'').localeCompare(b.city||'') || a.name.localeCompare(b.name));
    setHospitals(uniqueByName);
  };

  const loadEmergencyRequests = () => {
    const requests = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
    if (requests.length === 0) {
      const sampleRequests = [
        {
          id: 1,
          bloodGroup: "O+",
          hospital: "AIIMS Hospital",
          urgency: "Critical",
          units: 3,
          contact: "9876543200",
          description: "Emergency surgery patient",
          createdAt: new Date().toISOString(),
          status: "Active"
        },
        {
          id: 2,
          bloodGroup: "A-",
          hospital: "Apollo Hospital",
          urgency: "High",
          units: 2,
          contact: "9876543201",
          description: "Accident victim",
          createdAt: new Date().toISOString(),
          status: "Active"
        }
      ];
      localStorage.setItem('emergencyRequests', JSON.stringify(sampleRequests));
      setEmergencyRequests(sampleRequests);
    } else {
      setEmergencyRequests(requests);
    }
  };

  const loadDonationJourneys = () => {
    const journeys = JSON.parse(localStorage.getItem('donationJourneys') || '{}');
    setDonationJourneys(journeys);
  };

  const filterDonors = () => {
    let filtered = [...donors];

    if (showEmergencyOnly) {
      filtered = filtered.filter(donor => donor.isEmergency);
    }

    if (selectedHospital !== "all") {
      const hospital = hospitals.find(h => h.name === selectedHospital);
      if (hospital) {
        filtered = filtered.filter(donor => 
          donor.location.toLowerCase().includes(hospital.city.toLowerCase()) ||
          donor.location.toLowerCase().includes(hospital.state.toLowerCase())
        );
      }
    }

    if (selectedBloodGroup !== "all") {
      filtered = filtered.filter(donor => donor.bloodGroup === selectedBloodGroup);
    }

    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.contact.includes(searchTerm)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'distance':
          return a.location.localeCompare(b.location);
        case 'availability':
          const availabilityOrder = { 'Immediate': 1, 'Within 24 hours': 2, 'Weekends only': 3, 'Weekdays': 4, 'Evening hours': 5 };
          return (availabilityOrder[a.availability] || 6) - (availabilityOrder[b.availability] || 6);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredDonors(filtered);
  };

  const generateSocialShareBadge = (donor) => {
    const messages = [
      `I donated blood today! 🩸 #LifeSaver #BloodDonation #${donor.bloodGroup}`,
      `Just saved a life with blood donation! 💪 #Hero #BloodDonor #${donor.bloodGroup}`,
      `Proud to be a blood donor! 🩸 #GiveLife #BloodDonation #${donor.bloodGroup}`,
      `Another successful blood donation! 🎉 #Lifesaver #BloodDonor #${donor.bloodGroup}`,
      `Blood donation = Life donation! 🩸 #SaveLives #BloodDonor #${donor.bloodGroup}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const shareToSocialMedia = (platform, donor) => {
    const message = generateSocialShareBadge(donor);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied to clipboard!');
    });
  };

  const getJourneyStageIcon = (stage) => {
    switch (stage) {
      case 'registered':
        return <FaUserPlus className="journey-icon registered" />;
      case 'eligible':
        return <FaUserCheck className="journey-icon eligible" />;
      case 'scheduled':
        return <FaCalendarAlt className="journey-icon scheduled" />;
      case 'completed':
        return <FaCheckCircle className="journey-icon completed" />;
      case 'delivered':
        return <FaTruck className="journey-icon delivered" />;
      default:
        return <FaUserClock className="journey-icon" />;
    }
  };

  const getJourneyStageText = (stage) => {
    switch (stage) {
      case 'registered':
        return 'Registered';
      case 'eligible':
        return 'Eligible';
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'delivered':
        return 'Delivered to Hospital';
      default:
        return 'Unknown';
    }
  };

  const getJourneyProgress = (stage) => {
    const stages = ['registered', 'eligible', 'scheduled', 'completed', 'delivered'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const bookDonor = (id) => {
    const donor = filteredDonors.find((d) => d.id === id);
    if (!donor) return;

    const hospital = hospitals.find(h => 
      h.city.toLowerCase().includes(donor.location.toLowerCase()) ||
      h.state.toLowerCase().includes(donor.location.toLowerCase())
    ) || hospitals[0];

    const hours = Math.floor(Math.random() * 4) + 9;
    const minutes = Math.floor(Math.random() * 60);
    const timeSlot = `${hours}:${minutes.toString().padStart(2, "0")} AM`;

    const booking = {
      id: Date.now(),
      donorId: donor.id,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      donorNumber: `+91${donor.contact}`,
      Acceptor: hospital.name,
      status: "Booked",
      timeSlot,
      createdAt: new Date().toISOString()
    };
    const hospitalBookingsKey = `hospitalBookings_${hospital.name}`;
    const existingBookings = JSON.parse(localStorage.getItem(hospitalBookingsKey) || '[]');
    localStorage.setItem(hospitalBookingsKey, JSON.stringify([booking, ...existingBookings]));

    const updatedJourneys = {
      ...donationJourneys,
      [donor.id]: {
        stage: 'scheduled',
        hospital: hospital.name,
        timeSlot: timeSlot,
        updatedAt: new Date().toISOString()
      }
    };
    setDonationJourneys(updatedJourneys);
    localStorage.setItem('donationJourneys', JSON.stringify(updatedJourneys));

    const whatsappMsg =
      `🩸 *Blood Donation Request* 🩸%0A%0A` +
      `Hello ${donor.name},%0A` +
      `You are requested to donate blood. Please find your details below and confirm your availability:%0A` +
      `----------------------------%0A` +
      `👤 Name: ${donor.name}%0A` +
      `🩸 Blood Group: ${donor.bloodGroup}%0A` +
      `📍 Your Address: ${donor.location}%0A` +
      `📞 Your Contact: ${donor.contact}%0A` +
      `🏥 Where to Come: ${hospital.name}%0A` +
      `⏰ When: ${timeSlot} (Please arrive 10 minutes early)%0A` +
      `----------------------------%0A%0A` +
      `*Instructions:*%0A- Please bring a valid ID proof.%0A- Eat a light meal before coming.%0A- Stay hydrated.%0A- For any queries, reply to this message or call the hospital.%0A%0A` +
      `Thank you for being a lifesaver!`;

    const whatsappURL = `https://wa.me/91${donor.contact}?text=${whatsappMsg}`;

    const confirmed = window.confirm(
      `✅ Booking confirmed!\n` +
      `Donor: ${donor.name}\n` +
      `Blood Group: ${donor.bloodGroup}\n` +
      `Location: ${donor.location}\n` +
      `Contact: ${donor.contact}\n` +
      `🏥 Hospital Assigned: ${hospital.name}\n` +
      `⏰ Time Slot: ${timeSlot}\n\n` +
      `Open WhatsApp to send the message?`
    );

    if (confirmed) {
      window.open(whatsappURL, "_blank");

      const updatedDonors = donors.filter((d) => d.id !== id);
      setDonors(updatedDonors);
      localStorage.setItem('liveDonors', JSON.stringify(updatedDonors));
    }
  };

  const removeDonor = (id) => {
    if (window.confirm("Are you sure you want to remove this donor?")) {
      const updatedDonors = donors.filter((d) => d.id !== id);
      setDonors(updatedDonors);
      localStorage.setItem('liveDonors', JSON.stringify(updatedDonors));
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  if (loading) {
    return (
      <div className="donor-board-container">
        <div className="loading-container">
          <div className="loading-animation">
            <FaHeartbeat className="pulse" />
            <FaHeartbeat className="pulse delay-1" />
            <FaHeartbeat className="pulse delay-2" />
          </div>
          <h2>Loading Blood Alerts...</h2>
          <p>Please wait while we load the latest donor information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donor-board-container">
        <div className="error-container">
          <h2>Error Loading Blood Alerts</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-board-container">
      {/* Modern Header */}
      <div className="modern-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-title">
              <FaHeartbeat className="header-icon" />
              <div>
                <h1>Live Blood Donors</h1>
                <p>Connect with available blood donors in your area</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <div>
                  <span className="stat-number">{filteredDonors.length}</span>
                  <span className="stat-label">Available</span>
                </div>
              </div>
              <div className="stat-item emergency">
                <FaExclamationTriangle className="stat-icon" />
                <div>
                  <span className="stat-number">{emergencyRequests.length}</span>
                  <span className="stat-label">Emergency</span>
                </div>
              </div>
              <div className="stat-item">
                <FaHospital className="stat-icon" />
                <div>
                  <span className="stat-number">{hospitals.length}</span>
                  <span className="stat-label">Hospitals</span>
                </div>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={loadData} className="action-btn secondary">
              <FaSync /> Refresh
            </button>
            <button onClick={() => window.location.assign('/donate')} className="action-btn primary">
              <FaUserPlus /> Become a Donor
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergencyRequests.length > 0 && (
        <div className="emergency-alerts">
          <div className="alert-header">
            <FaExclamationTriangle className="alert-icon" />
            <h3>🚨 Emergency Blood Requests</h3>
            <span className="alert-count">{emergencyRequests.length}</span>
          </div>
          <div className="alert-grid">
            {emergencyRequests.map((request) => (
              <div key={request.id} className="alert-card">
                <div className="alert-badge">
                  <FaFire /> {request.urgency}
                </div>
                <div className="alert-content">
                  <h4>{request.bloodGroup} - {request.units} units</h4>
                  <p><FaHospital /> {request.hospital}</p>
                  <p><FaPhone /> {request.contact}</p>
                  <p className="alert-description">{request.description}</p>
                </div>
                <button className="alert-action">
                  <FaBell /> Respond Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search donors by name, location, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-actions">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        <div className={`filters-panel ${showFilters ? 'expanded' : ''}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Hospital</label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Hospitals</option>
                {hospitals.map((hospital, index) => (
                  <option key={index} value={hospital.name}>
                    {hospital.name} - {hospital.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Blood Group</label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Most Recent</option>
                <option value="distance">Nearest</option>
                <option value="availability">Availability</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showEmergencyOnly}
                  onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                <FaExclamationTriangle /> Emergency Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="donors-section">
        {filteredDonors.length === 0 ? (
          <div className="empty-state">
            <FaHeartbeat className="empty-icon" />
            <h3>No donors available</h3>
            <p>
              {searchTerm || selectedHospital !== "all" || selectedBloodGroup !== "all" || showEmergencyOnly
                ? "Try adjusting your filters or search terms"
                : "Be the first to add a donor to help save lives!"}
            </p>
            {!searchTerm && selectedHospital === "all" && selectedBloodGroup === "all" && !showEmergencyOnly && (
              <button onClick={() => window.location.assign('/donate')} className="add-first-donor-btn">
                <FaUserPlus /> Become the First Donor
              </button>
            )}
          </div>
        ) : (
          <div className="donors-grid">
            {filteredDonors.map((donor) => (
              <div key={donor.id} className={`donor-card ${donor.isEmergency ? 'emergency' : ''}`}>
                <div className="card-header">
                  <div className="donor-avatar">
                    {donor.name.charAt(0).toUpperCase()}
                    {donor.verified && <FaShieldAlt className="verified-badge" />}
                  </div>
                  <div className="donor-meta">
                    <h3 className="donor-name">{donor.name}</h3>
                    <div className="blood-group">
                      <FaHeartbeat /> {donor.bloodGroup}
                    </div>
                    {donor.isEmergency && <FaExclamationTriangle className="emergency-indicator" />}
                  </div>
                  <div className="card-actions">
                    <button className="action-icon" title="View Details">
                      <FaEye />
                    </button>
                    <button className="action-icon" title="Edit">
                      <FaEdit />
                    </button>
                    <button 
                      className="action-icon danger" 
                      title="Remove"
                      onClick={() => removeDonor(donor.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="donor-info-section">
                    <div className="donor-stats">
                      <div className="stat-item">
                        <FaStar className="stat-icon" />
                        <span>{donor.rating || 4.5}</span>
                      </div>
                      <div className="stat-item">
                        <FaTrophy className="stat-icon" />
                        <span>{donor.totalDonations || 0} donations</span>
                      </div>
                      <div className="stat-item">
                        <FaCalendarAlt className="stat-icon" />
                        <span>{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="donor-details">
                      <div className="detail-item">
                        <FaMapMarkerAlt />
                        <span>{donor.location}</span>
                      </div>
                      <div className="detail-item">
                        <FaPhone />
                        <span>{donor.contact}</span>
                      </div>
                      <div className="detail-item">
                        <FaClock />
                        <span>{donor.availability}</span>
                      </div>
                      {donor.notes && (
                        <div className="detail-item notes">
                          <span>{donor.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="action-buttons-section">
                    <button
                      onClick={() => window.open(`tel:${donor.contact}`)}
                      className="action-btn call"
                      title="Call donor"
                    >
                      <FaPhone /> Call
                    </button>
                    
                    <button
                      onClick={() => window.open(`https://wa.me/91${donor.contact}`)}
                      className="action-btn whatsapp"
                      title="Send WhatsApp message"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                    
                    <button
                      onClick={() => bookDonor(donor.id)}
                      className="action-btn book"
                      title="Book this donor"
                    >
                      <FaCalendarAlt /> Book Now
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedDonor(donor);
                        setShowShareModal(true);
                      }}
                      className="action-btn share"
                      title="Share donation badge"
                    >
                      <FaShare /> Share
                    </button>
                  </div>

                  {/* Journey Tracker */}
                  {donationJourneys[donor.id] && (
                    <div className="journey-tracker">
                      <h4>Donation Journey</h4>
                      <div className="journey-progress">
                        <div 
                          className="journey-progress-bar"
                          style={{ width: `${getJourneyProgress(donationJourneys[donor.id].stage)}%` }}
                        ></div>
                      </div>
                      <div className="journey-stages">
                        {['registered', 'eligible', 'scheduled', 'completed', 'delivered'].map((stage) => (
                          <div key={stage} className={`journey-stage ${donationJourneys[donor.id].stage === stage ? 'active' : ''}`}>
                            {getJourneyStageIcon(stage)}
                            <span>{getJourneyStageText(stage)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Share Modal */}
      {showShareModal && selectedDonor && (
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
                  <p>#LifeSaver #BloodDonation #{selectedDonor.bloodGroup}</p>
                </div>
              </div>
              
              <div className="share-options">
                <h4>Share on:</h4>
                <div className="social-buttons">
                  <button 
                    onClick={() => shareToSocialMedia('facebook', selectedDonor)}
                    className="social-btn facebook"
                  >
                    <FaFacebook /> Facebook
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('twitter', selectedDonor)}
                    className="social-btn twitter"
                  >
                    <FaTwitter /> Twitter
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('whatsapp', selectedDonor)}
                    className="social-btn whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button 
                    onClick={() => shareToSocialMedia('linkedin', selectedDonor)}
                    className="social-btn linkedin"
                  >
                    <FaLinkedin /> LinkedIn
                  </button>
                </div>
                
                <div className="copy-section">
                  <button 
                    onClick={() => copyToClipboard(generateSocialShareBadge(selectedDonor))}
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

export default LiveDonorBoard;
