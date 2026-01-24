import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaHospital } from 'react-icons/fa';
import '../styles/HospitalLogin.css';

const HospitalSignin = () => {
  const [hospitalId, setHospitalId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!hospitalId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/hospitals/${encodeURIComponent(hospitalId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Not found');
      localStorage.setItem('hospitalData', JSON.stringify(data));
      navigate('/hospital-dashboard');
    } catch (e) {
      alert('Hospital not found. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-login-container white-bg">
      <div className="hospital-login-card">
        <div className="hospital-login-header">
          <div className="hospital-icon"><FaHospital /></div>
          <h2>Hospital Login</h2>
          <p>Login using your Hospital ID</p>
        </div>
        <form onSubmit={handleLogin} className="hospital-login-form">
          <div className="form-section">
            <div className="form-group">
              <label>Government Hospital ID</label>
              <input className="form-control" value={hospitalId} onChange={(e)=>setHospitalId(e.target.value)} placeholder="Enter your hospital ID" />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : (<><FaSignInAlt /> Login</>)}
          </button>
          <div style={{textAlign:'center',marginTop:12}}>
            <a href="#" onClick={(e)=>{e.preventDefault(); navigate('/hospital-login');}}>Need to register?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalSignin;


