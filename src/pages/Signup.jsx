import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';

const Signup = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '',
        phone: '',
        address: '',
        preferredHospital: ''
    });

    const defaultHospitals = [
        'AIIMS Hospital, Delhi',
        'SGPGI, Lucknow',
        'Kokilaben Hospital, Mumbai',
        'Apollo Hospital, Chennai',
        'Fortis Hospital, Bangalore'
    ];

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/signup', formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="signup-container">
            {location.state?.message && (
                <div className="login-required-message">
                    <span className="login-required-icon">&#9888;</span>
                    {location.state.message}
                </div>
            )}
            <div className="quote-section">
                <h1>Be a Hero, Donate Blood</h1>
                <p>"Your one donation can save up to three lives. Join the cause today!"</p>
            </div>
            <div className="signup-form">
                <h2>Blood Donation Signup</h2>
                <input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                <textarea name="address" placeholder="Address" rows="4" value={formData.address} onChange={handleChange}></textarea>
                <select name="preferredHospital" value={formData.preferredHospital} onChange={handleChange}>
                    <option value="">Select Preferred Hospital</option>
                    {defaultHospitals.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <button onClick={handleSubmit}>Submit</button>
                {message && <p className="response-message">{message}</p>}
            </div>
        </div>
    );
};

export default Signup;
