import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { 
  FaHospital, 
  FaBed, 
  FaUserInjured, 
  FaCalendarCheck, 
  FaChartLine, 
  FaBell, 
  FaSignOutAlt,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaEye,
  FaSearch,
  FaFilter,
  FaSync,
  FaCog,
  FaUserMd,
  FaTint,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaChartBar,
  FaExclamationTriangle,
  FaCheck,
  FaArrowRight
} from "react-icons/fa";
import "../styles/HospitalDashboard.css";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const hospital = JSON.parse(localStorage.getItem("hospitalData")) || {
    name: "AIIMS",
    id: "HSP001",
    location: "New Delhi",
    contact: "+91-9876543210",
    email: "aiims@hospital.com"
  };

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [donors, setDonors] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    activeCases: 0,
    availableBeds: Number(hospital?.beds || 10),
    totalDonations: 0,
    pendingRequests: 0,
    freeRooms: Array.from({length: Number(hospital?.rooms || 10)}, (_,i)=>`R-${i+1}`),
    monthlyDonations: 45,
    criticalStock: 2
  });
  const [predictionInput, setPredictionInput] = useState({
    city: hospital?.location || "",
    bloodGroup: "A+",
    daysAhead: 7,
  });
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load initial data
  useEffect(() => {
    loadHospitalData();
    loadNotifications();
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadHospitalData();
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadHospitalData = () => {
    const hospitalName = hospital?.name || "Hospital";
    const hospitalBookingsKey = `hospitalBookings_${hospitalName}`;
    const bookings = JSON.parse(localStorage.getItem(hospitalBookingsKey) || '[]');
    setDonors(bookings);
    setStats(prev => ({
      ...prev,
      activeCases: bookings.length,
      totalDonations: bookings.filter(b => b.status === 'completed').length,
      pendingRequests: bookings.filter(b => b.status === 'scheduled').length
    }));
  };

  const loadNotifications = () => {
    // Simulate notifications
    const mockNotifications = [
      { id: 1, type: 'donation', message: 'New blood donation request received', time: '2 min ago', read: false },
      { id: 2, type: 'bed', message: 'Bed capacity updated', time: '5 min ago', read: true },
      { id: 3, type: 'prediction', message: 'Blood demand prediction available', time: '10 min ago', read: false },
      { id: 4, type: 'critical', message: 'Critical blood stock alert: O- blood group', time: '15 min ago', read: false }
    ];
    setNotifications(mockNotifications);
  };

  const handleLogout = () => {
    localStorage.removeItem("hospitalData");
    navigate("/hospital-login");
  };

  const saveCapacity = async () => {
    try {
      const current = JSON.parse(localStorage.getItem('hospitalData')||'{}');
      const payload = { 
        ...current, 
        beds: Number(stats.availableBeds), 
        rooms: Number((stats.freeRooms||[]).length) 
      };
      const res = await fetch('http://localhost:4000/api/hospitals/register', {
        method: 'POST', 
        headers: { 'Content-Type':'application/json' }, 
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('hospitalData', JSON.stringify(data.hospital));
        addNotification('success', 'Hospital capacity updated successfully');
      }
    } catch (e) {
      addNotification('error', 'Failed to update capacity');
    }
  };

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // PDF Generation functions
  const generateCertificate = (donor) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Blood Donation Certificate", 60, 30);
    doc.setFontSize(16);
    doc.text(`This is to certify that`, 20, 50);
    doc.setFontSize(20);
    doc.text(`${donor.name}`, 20, 65);
    doc.setFontSize(16);
    doc.text(
      `has donated blood (${donor.bloodGroup}) on behalf of ${hospital.name}.`,
      20,
      80
    );
    doc.text("We appreciate your valuable contribution!", 20, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 120);
    return doc.output("blob");
  };

  const generateDonationCard = (donor) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Blood Donation Card", 70, 30);
    doc.setFontSize(14);
    doc.text(`Name: ${donor.name}`, 20, 50);
    doc.text(`Blood Group: ${donor.bloodGroup}`, 20, 65);
    doc.text(`Acceptor Name: ${donor.Acceptor}`, 20, 80);
    doc.text(`Contact: ${donor.donorNumber}`, 20, 95);
    doc.text(`Hospital: ${hospital.name}`, 20, 110);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 20, 125);
    return doc.output("blob");
  };

  const generateCheckupPass = (donor) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Free Body Checkup Pass", 65, 30);
    doc.setFontSize(14);
    doc.text(`Issued To: ${donor.name}`, 20, 55);
    doc.text(`Blood Group: ${donor.bloodGroup}`, 20, 70);
    doc.text(`Hospital: ${hospital.name}`, 20, 85);
    doc.text(`Valid Till: ${new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString()}`, 20, 100);
    doc.text("Includes: CBC, BP, Sugar, BMI", 20, 120);
    doc.text("Carry a valid ID proof during visit.", 20, 140);
    return doc.output("blob");
  };

  const markCompleted = (donor) => {
    // Generate PDFs
    const certBlob = generateCertificate(donor);
    const cardBlob = generateDonationCard(donor);
    const passBlob = generateCheckupPass(donor);

    // Create download links
    const certUrl = URL.createObjectURL(certBlob);
    const cardUrl = URL.createObjectURL(cardBlob);
    const passUrl = URL.createObjectURL(passBlob);

    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(
      `Hello ${donor.name},\n\nThank you for donating blood!\n\nYour documents are ready for download.\n\nRegards,\n${hospital.name}`
    );
    window.open(`https://wa.me/${donor.donorNumber}?text=${message}`, "_blank");

    // Update stats & remove donor from active list
    setDonors((prev) => prev.filter((d) => d.id !== donor.id));
    setStats((prev) => ({
      ...prev,
      activeCases: prev.activeCases - 1,
      availableBeds: prev.availableBeds + 1,
      totalDonations: prev.totalDonations + 1
    }));

    // Remove from localStorage bookings
    const hospitalName = hospital?.name || "Hospital";
    const hospitalBookingsKey = `hospitalBookings_${hospitalName}`;
    const bookings = JSON.parse(localStorage.getItem(hospitalBookingsKey) || '[]');
    const updated = bookings.filter((b) => b.id !== donor.id);
    localStorage.setItem(hospitalBookingsKey, JSON.stringify(updated));

    addNotification('success', `Donation completed for ${donor.name}`);
    setShowModal(false);
  };

  const requestPrediction = async () => {
    setPredicting(true);
    setPrediction(null);
    try {
      const response = await fetch("http://localhost:4000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: predictionInput.city,
          blood_group: predictionInput.bloodGroup,
          days_ahead: Number(predictionInput.daysAhead),
        }),
      });
      if (!response.ok) throw new Error("Prediction request failed");
      const data = await response.json();
      setPrediction(data?.PredictedBloodDemand ?? data);
      addNotification('success', 'Blood demand prediction generated');
    } catch (e) {
      addNotification('error', 'Unable to fetch prediction. Please ensure the backend is running.');
    } finally {
      setPredicting(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.Acceptor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || donor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': '#dc3545', 'A-': '#dc3545',
      'B+': '#28a745', 'B-': '#28a745',
      'O+': '#ffc107', 'O-': '#ffc107',
      'AB+': '#6f42c1', 'AB-': '#6f42c1'
    };
    return colors[bloodGroup] || '#6c757d';
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': '#ffc107',
      'completed': '#28a745',
      'cancelled': '#dc3545',
      'pending': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'donation': return <FaTint />;
      case 'bed': return <FaBed />;
      case 'prediction': return <FaChartLine />;
      case 'critical': return <FaExclamationTriangle />;
      default: return <FaBell />;
    }
  };

  return (
    <div className="hospital-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="hospital-info">
          <div className="hospital-logo">
            <FaHospital />
          </div>
          <div>
            <h1>{hospital.name}</h1>
            {/* Removed location and phone as requested */}
          </div>
        </div>
        <div className="header-actions">
          <div className="notifications-container">
            <div className="notifications" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button onClick={() => setShowNotifications(false)}>
                    <FaTimes />
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FaHospital /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === "donors" ? "active" : ""}`}
          onClick={() => setActiveTab("donors")}
        >
          <FaUserMd /> Donors ({donors.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <FaCalendarCheck /> Events
        </button>
        <button 
          className={`tab-btn ${activeTab === "prediction" ? "active" : ""}`}
          onClick={() => setActiveTab("prediction")}
        >
          <FaChartLine /> Predictions
        </button>
        <button 
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog /> Settings
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUserInjured />
                </div>
                <div className="stat-content">
                  <h3>{stats.activeCases}</h3>
                  <p>Current Cases</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBed />
                </div>
                <div className="stat-content">
                  <h3>
                    <input 
                      type="number" 
                      min="0" 
                      value={stats.availableBeds}
                      onChange={(e) => setStats(s => ({...s, availableBeds: Number(e.target.value)}))}
                      className="bed-input"
                    />
                  </h3>
                  <p>Available Beds</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaTint />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalDonations}</h3>
                  <p>Total Donations</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-content">
                  <h3>{stats.pendingRequests}</h3>
                  <p>Pending Requests</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3>{stats.monthlyDonations}</h3>
                  <p>Monthly Donations</p>
                </div>
              </div>
              <div className="stat-card critical">
                <div className="stat-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="stat-content">
                  <h3>{stats.criticalStock}</h3>
                  <p>Critical Stock</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => setActiveTab("donors")}>
                  <FaPlus /> Add Donor
                </button>
                <button className="action-btn" onClick={() => setActiveTab("prediction")}>
                  <FaChartLine /> Predict Demand
                </button>
                <button className="action-btn" onClick={saveCapacity}>
                  <FaCog /> Save Capacity
                </button>
              </div>
            </div>

            <div className="rooms-section">
              <h3>Available Rooms</h3>
              <div className="rooms-grid">
                {stats.freeRooms.map((room, index) => (
                  <div key={index} className="room-card">
                    <FaBed />
                    <span>{room}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {donors.slice(0, 3).map((donor, index) => (
                  <div key={donor.id || index} className="activity-item">
                    <div className="activity-icon">
                      <FaUserMd />
                    </div>
                    <div className="activity-content">
                      <p><strong>{donor.name}</strong> scheduled for blood donation</p>
                      <span>{donor.bloodGroup} • {donor.status}</span>
                    </div>
                    <div className="activity-time">
                      {index === 0 ? '2 min ago' : index === 1 ? '5 min ago' : '10 min ago'}
                    </div>
                  </div>
                ))}
                {donors.length === 0 && (
                  <div className="empty-activity">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === "donors" && (
          <div className="donors-tab">
            <div className="tab-header">
              <h3>Live Donor Bookings</h3>
              <div className="header-controls">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search donors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="refresh-btn" onClick={loadHospitalData}>
                  <FaSync />
                </button>
              </div>
            </div>

            <div className="donors-list">
              {filteredDonors.length === 0 ? (
                <div className="empty-state">
                  <FaUserMd />
                  <p>No active bookings found.</p>
                </div>
              ) : (
                filteredDonors.map((donor) => (
                  <div key={donor.id} className="donor-card">
                    <div className="donor-info">
                      <div className="donor-header">
                        <h4>{donor.name}</h4>
                        <span 
                          className="blood-group"
                          style={{ backgroundColor: getBloodGroupColor(donor.bloodGroup) + '20', color: getBloodGroupColor(donor.bloodGroup) }}
                        >
                          {donor.bloodGroup}
                        </span>
                      </div>
                      <p><strong>Acceptor:</strong> {donor.Acceptor}</p>
                      <p><strong>Contact:</strong> {donor.donorNumber}</p>
                      <p><strong>Status:</strong> 
                        <span 
                          className="status"
                          style={{ backgroundColor: getStatusColor(donor.status) + '20', color: getStatusColor(donor.status) }}
                        >
                          {donor.status}
                        </span>
                      </p>
                    </div>
                    <div className="donor-actions">
                      <button 
                        className="action-btn call"
                        onClick={() => window.open(`tel:${donor.donorNumber}`)}
                        title="Call donor"
                      >
                        <FaPhone />
                      </button>
                      <button 
                        className="action-btn whatsapp"
                        onClick={() => window.open(`https://wa.me/${donor.donorNumber}`)}
                        title="WhatsApp"
                      >
                        <FaWhatsapp />
                      </button>
                      <button 
                        className="action-btn complete"
                        onClick={() => {
                          setSelectedDonor(donor);
                          setModalType("complete");
                          setShowModal(true);
                        }}
                        title="Complete donation"
                      >
                        <FaCheckCircle />
                      </button>
                      <button 
                        className="action-btn view"
                        onClick={() => {
                          setSelectedDonor(donor);
                          setModalType("view");
                          setShowModal(true);
                        }}
                        title="View details"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="events-tab">
            <div className="tab-header">
              <h3>Blood Donation Events</h3>
              <button className="add-btn" onClick={() => {
                setModalType("event");
                setShowModal(true);
              }}>
                <FaPlus /> Add Event
              </button>
            </div>
            <div className="events-list">
              <div className="empty-state">
                <FaCalendarCheck />
                <p>No events scheduled. Create your first blood donation event!</p>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Tab */}
        {activeTab === "prediction" && (
          <div className="prediction-tab">
            <div className="prediction-header">
              <h3>Blood Demand Prediction</h3>
              <button 
                className="refresh-btn" 
                onClick={requestPrediction} 
                disabled={predicting}
              >
                <FaSync /> {predicting ? 'Predicting...' : 'Predict'}
              </button>
            </div>
            
            <div className="prediction-content">
              <div className="prediction-card">
                <h4>Prediction Parameters</h4>
                <div className="prediction-form">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={predictionInput.city}
                      onChange={(e) => setPredictionInput({ ...predictionInput, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      value={predictionInput.bloodGroup}
                      onChange={(e) => setPredictionInput({ ...predictionInput, bloodGroup: e.target.value })}
                    >
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Days Ahead</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={predictionInput.daysAhead}
                      onChange={(e) => setPredictionInput({ ...predictionInput, daysAhead: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {prediction !== null && (
                <div className="prediction-card">
                  <h4>Prediction Result</h4>
                  <div className="prediction-result">
                    <div className="prediction-stat">
                      <span className="stat-label">Predicted Demand</span>
                      <span className="stat-value">{String(prediction)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="settings-tab">
            <h3>Hospital Settings</h3>
            <div className="settings-content">
              <div className="setting-group">
                <h4>Hospital Information</h4>
                <div className="setting-item">
                  <label>Hospital Name</label>
                  <input type="text" value={hospital.name} readOnly />
                </div>
                <div className="setting-item">
                  <label>Location</label>
                  <input type="text" value={hospital.location} readOnly />
                </div>
                <div className="setting-item">
                  <label>Contact</label>
                  <input type="text" value={hospital.contact} readOnly />
                </div>
              </div>
              
              <div className="setting-group">
                <h4>Capacity Management</h4>
                <div className="setting-item">
                  <label>Available Beds</label>
                  <input 
                    type="number" 
                    value={stats.availableBeds}
                    onChange={(e) => setStats(s => ({...s, availableBeds: Number(e.target.value)}))}
                  />
                </div>
                <button className="save-btn" onClick={saveCapacity}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "complete" && "Complete Donation"}
                {modalType === "view" && "Donor Details"}
                {modalType === "event" && "Add Event"}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            {modalType === "complete" && selectedDonor && (
              <div className="modal-body">
                <p>Are you sure you want to mark the donation from <strong>{selectedDonor.name}</strong> as completed?</p>
                <p>This will:</p>
                <ul>
                  <li>Generate donation certificates</li>
                  <li>Send WhatsApp notification</li>
                  <li>Update hospital capacity</li>
                  <li>Remove from active cases</li>
                </ul>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={() => markCompleted(selectedDonor)}>
                    Complete Donation
                  </button>
                </div>
              </div>
            )}

            {modalType === "view" && selectedDonor && (
              <div className="modal-body">
                <div className="donor-details">
                  <h4>{selectedDonor.name}</h4>
                  <p><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
                  <p><strong>Acceptor:</strong> {selectedDonor.Acceptor}</p>
                  <p><strong>Contact:</strong> {selectedDonor.donorNumber}</p>
                  <p><strong>Status:</strong> {selectedDonor.status}</p>
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button className="btn-primary" onClick={() => {
                    setModalType("complete");
                  }}>
                    Complete Donation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Support */}
      <div className="chat-support">
        <FaBell />
      </div>
    </div>
  );
};

export default HospitalDashboard;
