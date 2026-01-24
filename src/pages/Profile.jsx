import React, { useEffect, useState } from 'react';
import { 
  FaUser, 
  FaAward, 
  FaCertificate, 
  FaGift, 
  FaTrophy, 
  FaStar,
  FaDownload,
  FaCrown,
  FaHeart,
  FaShoppingCart,
  FaPercent,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaEdit,
  FaShare,
  FaPrint,
  FaStore,
  FaCoffee,
  FaUtensils,
  FaCar,
  FaFilm,
  FaShieldAlt,
  FaMedal,
  FaRibbon
} from 'react-icons/fa';
import '../styles/Profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(() => localStorage.getItem('profilePhoto') || "https://i.pravatar.cc/150?img=12");
  const [activeTab, setActiveTab] = useState('profile');
  const [donationHistory, setDonationHistory] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Sample data - In real app, this would come from API
  const sampleDonationHistory = [
    { id: 1, date: '2024-08-15', hospital: 'AIIMS Delhi', bloodGroup: 'O+', status: 'Completed' },
    { id: 2, date: '2024-06-20', hospital: 'Apollo Mumbai', bloodGroup: 'O+', status: 'Completed' },
    { id: 3, date: '2024-04-10', hospital: 'Fortis Bangalore', bloodGroup: 'O+', status: 'Completed' },
    { id: 4, date: '2024-02-05', hospital: 'SGPGI Lucknow', bloodGroup: 'O+', status: 'Completed' },
    { id: 5, date: '2023-12-12', hospital: 'CMC Vellore', bloodGroup: 'O+', status: 'Completed' }
  ];

  const sampleCertificates = [
    {
      id: 1,
      title: 'Life Saver Certificate',
      description: 'For saving 5 lives through blood donation',
      issueDate: '2024-08-15',
      level: 'Bronze',
      icon: FaMedal,
      color: '#cd7f32'
    },
    {
      id: 2,
      title: 'Hero Donor Badge',
      description: 'For consistent blood donations',
      issueDate: '2024-06-20',
      level: 'Silver',
      icon: FaShieldAlt,
      color: '#c0c0c0'
    },
    {
      id: 3,
      title: 'Community Champion',
      description: 'For exceptional contribution to blood banking',
      issueDate: '2024-04-10',
      level: 'Gold',
      icon: FaTrophy,
      color: '#ffd700'
    }
  ];

  const sampleRewards = [
    {
      id: 1,
      title: 'Donation Points',
      value: '2,500 Points',
      description: 'Earned from 5 successful donations',
      icon: FaStar,
      color: '#e74c3c'
    },
    {
      id: 2,
      title: 'Life Saver Rank',
      value: 'Bronze Level',
      description: 'Next milestone: 3 more donations for Silver',
      icon: FaCrown,
      color: '#cd7f32'
    },
    {
      id: 3,
      title: 'Impact Score',
      value: '5 Lives Saved',
      description: 'Your donations have directly saved 5 lives',
      icon: FaHeart,
      color: '#e91e63'
    }
  ];

  const sampleCoupons = [
    {
      id: 1,
      company: 'Starbucks',
      title: '50% Off Coffee',
      description: 'Valid on any beverage',
      discount: '50%',
      validTill: '2024-12-31',
      code: 'HERO50',
      icon: FaCoffee,
      color: '#00704a',
      category: 'Food & Beverage'
    },
    {
      id: 2,
      company: 'Zomato',
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹300',
      discount: '₹50',
      validTill: '2024-11-30',
      code: 'LIFESAVER',
      icon: FaUtensils,
      color: '#e23744',
      category: 'Food Delivery'
    },
    {
      id: 3,
      company: 'Uber',
      title: '25% Off Rides',
      description: 'Valid for next 3 rides',
      discount: '25%',
      validTill: '2024-10-15',
      code: 'DONOR25',
      icon: FaCar,
      color: '#000000',
      category: 'Transportation'
    },
    {
      id: 4,
      company: 'BookMyShow',
      title: 'Movie Tickets',
      description: 'Buy 1 Get 1 Free',
      discount: 'BOGO',
      validTill: '2024-09-30',
      code: 'HERO2024',
      icon: FaFilm,
      color: '#c21c4c',
      category: 'Entertainment'
    },
    {
      id: 5,
      company: 'Amazon',
      title: 'Shopping Voucher',
      description: '₹500 off on orders above ₹2000',
      discount: '₹500',
      validTill: '2024-12-25',
      code: 'DONATE500',
      icon: FaShoppingCart,
      color: '#ff9900',
      category: 'Shopping'
    },
    {
      id: 6,
      company: 'Flipkart',
      title: 'Electronics Deal',
      description: '15% off on electronics',
      discount: '15%',
      validTill: '2024-11-20',
      code: 'TECH15',
      icon: FaStore,
      color: '#2874f0',
      category: 'Electronics'
    }
  ];

  // Handle photo change and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
        localStorage.setItem('profilePhoto', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCertificate = (certificate) => {
    // In a real app, this would generate and download a PDF certificate
    alert(`Downloading ${certificate.title} certificate...`);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code ${code} copied to clipboard!`);
  };

  const shareCertificate = (certificate) => {
    // In a real app, this would open share options
    alert(`Sharing ${certificate.title} on social media...`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Try to fetch user data from API
    fetch('http://localhost:4000/api/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
        // Fallback to sample data if API fails
        setUser({
          fullname: 'John Doe',
          username: 'johndoe',
          email: 'john.doe@example.com',
          bloodGroup: 'O+',
          address: 'Mumbai, Maharashtra, India',
          phone: '+91 9876543210',
          createdAt: '2023-01-15T00:00:00.000Z'
        });
      });

    // Load sample data
    setDonationHistory(sampleDonationHistory);
    setCertificates(sampleCertificates);
    setRewards(sampleRewards);
    setCoupons(sampleCoupons);
  }, []);

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <img
              src={photo}
              alt="Profile"
              className="profile-avatar"
            />
            <label htmlFor="profile-photo-input" className="profile-photo-edit-btn" title="Change photo">
              <FaEdit />
            </label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>
          <div className="profile-user-info">
            <h2 className="profile-name">{user.fullname}</h2>
            <p className="profile-username">@{user.username}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <FaHeart className="stat-icon" />
                <span>{donationHistory.length} Donations</span>
              </div>
              <div className="stat-item">
                <FaAward className="stat-icon" />
                <span>{certificates.length} Certificates</span>
              </div>
              <div className="stat-item">
                <FaGift className="stat-icon" />
                <span>{coupons.length} Rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <FaCertificate /> Certificates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <FaAward /> Rewards
        </button>
        <button 
          className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <FaGift /> Coupons & Offers
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-info-section">
            <div className="info-card">
              <h3><FaUser /> Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <label>Email</label>
                    <span>{user.email || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhoneAlt className="info-icon" />
                  <div>
                    <label>Phone</label>
                    <span>{user.phone || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <label>Location</label>
                    <span>{user.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaHeart className="info-icon" />
                  <div>
                    <label>Blood Group</label>
                    <span>{user.bloodGroup || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div>
                    <label>Member Since</label>
                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3><FaHeart /> Donation History</h3>
              <div className="donation-history">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="donation-item">
                    <div className="donation-date">
                      <FaCalendarAlt />
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                    <div className="donation-details">
                      <h4>{donation.hospital}</h4>
                      <p>Blood Group: {donation.bloodGroup}</p>
                    </div>
                    <div className="donation-status">
                      <span className={`status ${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="certificates-section">
            <h3><FaCertificate /> Your Certificates</h3>
            <div className="certificates-grid">
              {certificates.map((certificate) => {
                const IconComponent = certificate.icon;
                return (
                  <div key={certificate.id} className="certificate-card">
                    <div className="certificate-header" style={{ backgroundColor: certificate.color }}>
                      <IconComponent className="certificate-icon" />
                      <span className="certificate-level">{certificate.level}</span>
                    </div>
                    <div className="certificate-body">
                      <h4>{certificate.title}</h4>
                      <p>{certificate.description}</p>
                      <div className="certificate-date">
                        <FaCalendarAlt />
                        Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="certificate-actions">
                      <button 
                        className="action-btn primary"
                        onClick={() => downloadCertificate(certificate)}
                      >
                        <FaDownload /> Download
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => shareCertificate(certificate)}
                      >
                        <FaShare /> Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <h3><FaAward /> Your Achievements</h3>
            <div className="rewards-grid">
              {rewards.map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <div key={reward.id} className="reward-card">
                    <div className="reward-icon" style={{ color: reward.color }}>
                      <IconComponent />
                    </div>
                    <div className="reward-content">
                      <h4>{reward.title}</h4>
                      <div className="reward-value">{reward.value}</div>
                      <p>{reward.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="milestones-section">
              <h4><FaTrophy /> Upcoming Milestones</h4>
              <div className="milestone-progress">
                <div className="milestone-item">
                  <div className="milestone-info">
                    <FaRibbon className="milestone-icon" />
                    <div>
                      <h5>Silver Donor Badge</h5>
                      <p>3 more donations needed</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '62%' }}></div>
                  </div>
                  <span className="progress-text">5/8</span>
                </div>
                <div className="milestone-item">
                  <div className="milestone-info">
                    <FaCrown className="milestone-icon" />
                    <div>
                      <h5>Elite Donor Status</h5>
                      <p>5 more donations needed</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '50%' }}></div>
                  </div>
                  <span className="progress-text">5/10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="coupons-section">
            <h3><FaGift /> Partner Offers & Coupons</h3>
            <p className="section-description">
              Enjoy exclusive discounts and offers from our partner companies as a token of appreciation for your blood donations.
            </p>
            <div className="coupons-grid">
              {coupons.map((coupon) => {
                const IconComponent = coupon.icon;
                return (
                  <div key={coupon.id} className="coupon-card">
                    <div className="coupon-header">
                      <div className="company-info">
                        <IconComponent 
                          className="company-icon" 
                          style={{ color: coupon.color }}
                        />
                        <div>
                          <h4>{coupon.company}</h4>
                          <span className="category">{coupon.category}</span>
                        </div>
                      </div>
                      <div className="discount-badge">
                        {coupon.discount}
                      </div>
                    </div>
                    <div className="coupon-body">
                      <h5>{coupon.title}</h5>
                      <p>{coupon.description}</p>
                      <div className="coupon-code">
                        <span>Code: <strong>{coupon.code}</strong></span>
                        <button 
                          className="copy-btn"
                          onClick={() => copyCouponCode(coupon.code)}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="coupon-footer">
                      <div className="validity">
                        <FaCalendarAlt />
                        Valid till {new Date(coupon.validTill).toLocaleDateString()}
                      </div>
                      <button className="redeem-btn">
                        Redeem Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
