import React, { useState } from 'react';
import '../styles/TopDonors.css';
import axios from "axios";

const TopDonors = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setBloodGroup(e.target.value);
    setError('');
    setDonors([]);
  };

  const fetchDonors = async () => {
    if (!bloodGroup) {
      setError('Please enter a blood group.');
      return;
    }

    setLoading(true);
    setError('');
    setDonors([]);

    // 1. Check local live donor board
    const localDonors = JSON.parse(localStorage.getItem('liveDonors') || '[]');
    const matchedLocal = localDonors.filter(d => d.bloodGroup && d.bloodGroup.toLowerCase() === bloodGroup.toLowerCase());
    if (matchedLocal.length > 0) {
      setDonors(matchedLocal);
      setLoading(false);
      return;
    }

    // 2. Fallback to backend
    try {
      const response = await axios.post('http://localhost:4000/api/top-donors', {
        bloodGroup: bloodGroup,
      });
      if (response.data && response.data.length > 0) {
        setDonors(response.data);
      } else {
        setError('Blood group not available now.');
      }
    } catch (err) {
      // If error is 404 or similar, treat as not available, else show generic error
      if (err.response && err.response.status === 404) {
        setError('Blood group not available now.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="top-donors-container">
      <h2>Find Top 5 Donors</h2>
      <input
        type="text"
        placeholder="Enter Blood Group (e.g., O positive)"
        value={bloodGroup}
        onChange={handleInputChange}
      />
      <button onClick={fetchDonors}>Get Top Donors</button>

      {loading && (
        <div className="falling-drops-container">
          <div className="blood-drop">🩸</div>
          <div className="blood-drop">🩸</div>
          <div className="blood-drop">🩸</div>
        </div>
      )}


      {/* Show error for missing input or backend error */}
      {error && (
        <div style={{
          color: '#e74c3c',
          fontWeight: 700,
          background: '#fff6f6',
          border: '1.5px solid #e74c3c',
          borderRadius: 8,
          padding: '12px 18px',
          margin: '18px 0',
          textAlign: 'center',
          fontSize: '1.1em'
  }}>{error === 'Please enter a blood group.' ? 'Please enter a blood group.' : (error === 'Blood group not available' ? 'Blood group not available now.' : error)}</div>
      )}

      {/* Show message if no donors found and no error, but blood group entered */}
      {donors.length === 0 && !loading && !error && bloodGroup && (
        <div style={{
          color: '#e74c3c',
          fontWeight: 700,
          background: '#fff6f6',
          border: '1.5px solid #e74c3c',
          borderRadius: 8,
          padding: '12px 18px',
          margin: '18px 0',
          textAlign: 'center',
          fontSize: '1.1em'
        }}>
          Blood group not available now.
        </div>
      )}

      {donors.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Location</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor, index) => (
              <tr key={donor.id || donor.ID || index}>
                <td>{donor.name || donor['Name'] || donor.ID || '-'}</td>
                <td>{donor.bloodGroup || donor['Blood Group'] || '-'}</td>
                <td>{donor.location || donor['Location'] || '-'}</td>
                <td>{donor.contact || donor['Contact'] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopDonors;
