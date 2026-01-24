import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send login credentials to the backend
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Parse the response from the backend
      const data = await response.json();

      // If login is successful, store token, userId, and login status
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT token
        localStorage.setItem('userId', data.userId); // Store userId
        localStorage.setItem('isLoggedIn', 'true'); // Set logged-in status

        navigate('/'); // Redirect to homepage or any other page
      } else {
        alert(data.message || 'Login failed'); // Show an error message if login fails
      }
    } catch (error) {
      alert('Error: ' + error.message); // Catch and alert any network error
    }
  };

  return (
    <div className="login-container">
      {location.state?.message && (
        <div className="login-required-message">
          <span className="login-required-icon">&#9888;</span>
          {location.state.message}
        </div>
      )}
      <div className="quote-section">
        <h1>Donate Blood, Save Lives</h1>
        <p>
          "A single pint can save three lives, a single gesture can create a
          million smiles."
        </p>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p className="signup-option">
          Not registered? <Link to="/signup" state={location.state}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
