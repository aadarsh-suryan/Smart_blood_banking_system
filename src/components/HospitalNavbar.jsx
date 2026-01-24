import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHospital, 
  FaHome, 
  FaUserMd, 
  FaCalendarCheck, 
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import '../styles/HospitalNavbar.css';

const HospitalNavbar = ({ hospital }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/hospital-dashboard', label: 'Dashboard', icon: <FaHospital /> },
    { path: '/EventsPage', label: 'Events', icon: <FaCalendarCheck /> },
    { path: '/contact', label: 'Contact', icon: <FaUserMd /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("hospitalData");
    navigate("/hospital-login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="hospital-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <FaHospital className="brand-icon" />
          <span className="brand-text">DonorDirect</span>
          <span className="hospital-name">{hospital?.name || 'Hospital'}</span>
        </div>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="settings-btn" onClick={() => navigate('/hospital-dashboard?tab=settings')}>
            <FaCog />
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default HospitalNavbar;
