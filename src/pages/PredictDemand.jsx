import React, { useState } from 'react';
import axios from 'axios';

const PredictDemand = () => {
  const [date, setDate] = useState('');
  const [population, setPopulation] = useState('');
  const [events, setEvents] = useState('');
  const [historicalUsage, setHistoricalUsage] = useState('');
  const [admissions, setAdmissions] = useState('');
  const [donorsAvailable, setDonorsAvailable] = useState('');
  const [temperature, setTemperature] = useState('');
  const [predictedDemand, setPredictedDemand] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setError('');
    setPredictedDemand(null);

    if (!date || !population || !events || !historicalUsage || !admissions || !donorsAvailable || !temperature) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        Date: date,
        Population: Number(population),
        Events: Number(events),
        HistoricalBloodUsage: Number(historicalUsage),
        HospitalAdmissions: Number(admissions),
        BloodDonorsAvailable: Number(donorsAvailable),
        Temperature: Number(temperature)
      });
      setPredictedDemand(response.data.PredictedBloodDemand);
    } catch (err) {
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Predict Blood Demand</h2>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" />
      <input type="number" value={population} onChange={e => setPopulation(e.target.value)} placeholder="Population" />
      <input type="number" value={events} onChange={e => setEvents(e.target.value)} placeholder="Events" />
      <input type="number" value={historicalUsage} onChange={e => setHistoricalUsage(e.target.value)} placeholder="Historical Blood Usage" />
      <input type="number" value={admissions} onChange={e => setAdmissions(e.target.value)} placeholder="Hospital Admissions" />
      <input type="number" value={donorsAvailable} onChange={e => setDonorsAvailable(e.target.value)} placeholder="Blood Donors Available" />
      <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="Temperature (°C)" />
      <button onClick={handlePredict} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Predicting...' : 'Predict'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {predictedDemand !== null && (
        <div style={{ marginTop: 20, fontWeight: 'bold' }}>
          Predicted Blood Demand: {Number(predictedDemand).toFixed(2)} units
        </div>
      )}
    </div>
  );
};

export default PredictDemand;
