import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHospital, FaIdCard, FaBed, FaDoorOpen, FaSignInAlt } from "react-icons/fa";
import "../styles/HospitalLogin.css";

const HospitalLogin = () => {
  const [formData, setFormData] = useState({
    hospitalId: "",
    name: "",
    beds: 20,
    rooms: 10,
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hospitalId.trim()) {
      newErrors.hospitalId = "Hospital ID is required";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Hospital name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    
    if (formData.beds < 1) {
      newErrors.beds = "Number of beds must be at least 1";
    }
    
    if (formData.rooms < 1) {
      newErrors.rooms = "Number of rooms must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/hospitals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem("hospitalData", JSON.stringify(data.hospital));
      alert("Hospital registered successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/hospital-dashboard"), 500);
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hospital-login-container white-bg">
      <div className="hospital-login-card">
        <div className="hospital-login-header">
          <div className="hospital-icon">
            <FaHospital />
          </div>
          <h2>Hospital Registration</h2>
          <p>Create your hospital profile</p>
        </div>

        <form onSubmit={handleSubmit} className="hospital-login-form">
          <div className="form-section">
            <h4><FaIdCard /> Basic Information</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hospitalId">Government Hospital ID *</label>
                <input
                  type="text"
                  id="hospitalId"
                  name="hospitalId"
                  className={`form-control ${errors.hospitalId ? 'error' : ''}`}
                  placeholder="Enter your official hospital ID"
                  value={formData.hospitalId}
                  onChange={handleChange}
                />
                {errors.hospitalId && <span className="error-text">{errors.hospitalId}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Hospital Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="Enter hospital name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4><FaBed /> Hospital Capacity</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="beds">Total Beds Available *</label>
                <input
                  type="number"
                  id="beds"
                  name="beds"
                  className={`form-control ${errors.beds ? 'error' : ''}`}
                  placeholder="Enter total number of beds"
                  min="1"
                  value={formData.beds}
                  onChange={handleChange}
                />
                {errors.beds && <span className="error-text">{errors.beds}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="rooms">Total Rooms *</label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  className={`form-control ${errors.rooms ? 'error' : ''}`}
                  placeholder="Enter total number of rooms"
                  min="1"
                  value={formData.rooms}
                  onChange={handleChange}
                />
                {errors.rooms && <span className="error-text">{errors.rooms}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4><FaDoorOpen /> Location Details</h4>
            
            <div className="form-group">
              <label htmlFor="address">Complete Address *</label>
              <textarea
                id="address"
                name="address"
                className={`form-control ${errors.address ? 'error' : ''}`}
                placeholder="Enter complete hospital address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`form-control ${errors.city ? 'error' : ''}`}
                  placeholder="Enter city name"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className={`form-control ${errors.state ? 'error' : ''}`}
                  placeholder="Enter state name"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className={`form-control ${errors.pincode ? 'error' : ''}`}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Registering...</span>
            ) : (
              <>
                <FaSignInAlt /> Register & Login
              </>
            )}
          </button>
        </form>

        <div className="hospital-login-footer">
          <p>Already registered? Contact support for login assistance.</p>
          <p className="terms">
            By registering, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;
