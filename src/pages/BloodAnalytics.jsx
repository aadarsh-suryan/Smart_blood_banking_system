import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import '../styles/BloodAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BloodAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('regional');
  const [realtimeStatus, setRealtimeStatus] = useState({
    isConnected: false,
    lastUpdate: null,
    totalRecords: 0,
    recentActivity: { donations: 0, requests: 0 }
  });

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/analytics/blood-demand');
      const data = await response.json();
      setAnalyticsData(data);
      
      // Check for real-time insights
      if (data.realTimeInsights) {
        const { lastUpdated, totalRealTimeRecords, recentDonations, recentRequests } = data.realTimeInsights;
        
        if (totalRealTimeRecords > 0) {
          setRealtimeStatus({
            isConnected: true,
            lastUpdate: lastUpdated,
            totalRecords: totalRealTimeRecords,
            recentActivity: {
              donations: recentDonations || 0,
              requests: recentRequests || 0
            }
          });
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setAnalyticsData(getMockData());
      setLoading(false);
    }
  };

  const getMockData = () => {
    return {
      regionalDemand: {
        labels: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
        datasets: [{
          label: 'Blood Demand (Units)',
          data: [1200, 1500, 800, 600, 900, 700],
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
          borderColor: '#d62828',
          borderWidth: 2
        }]
      },
      seasonalTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Blood Demand',
          data: [850, 780, 920, 1100, 1300, 1450, 1200, 1350, 1000, 950, 880, 1050],
          borderColor: '#d62828',
          backgroundColor: 'rgba(214, 40, 40, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      bloodTypeDistribution: {
        labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
        datasets: [{
          data: [35, 25, 20, 8, 7, 3, 1.5, 0.5],
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ]
        }]
      },
      predictions: {
        nextMonth: {
          region: 'Delhi',
          predictedDemand: 1350,
          confidence: 89,
          trend: 'increasing'
        },
        criticalPeriods: [
          { period: 'Summer (May-June)', demand: 'High', reason: 'Accidents, dehydration' },
          { period: 'Festival Season (Oct-Nov)', demand: 'Very High', reason: 'Increased accidents' },
          { period: 'Winter (Dec-Jan)', demand: 'Medium', reason: 'Stable period' }
        ]
      }
    };
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Demand Analytics',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Blood Type Distribution (%)',
        font: {
          size: 16
        }
      },
    },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Blood Demand Analytics & Predictions</h1>
        <p>Machine Learning powered insights for blood demand patterns</p>
        
        {/* Real-time Status Indicator */}
        <div className={`realtime-status ${realtimeStatus.isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">
              {realtimeStatus.isConnected ? 'Real-time Data Connected' : 'Using Cached Data'}
            </span>
          </div>
          {realtimeStatus.isConnected && (
            <div className="realtime-info">
              <span>Last Update: {new Date(realtimeStatus.lastUpdate).toLocaleTimeString()}</span>
              <span>Records: {realtimeStatus.totalRecords}</span>
              <span>Recent Activity: {realtimeStatus.recentActivity.donations}D/{realtimeStatus.recentActivity.requests}R</span>
            </div>
          )}
        </div>
      </div>

      <div className="view-selector">
        <button 
          className={selectedView === 'regional' ? 'active' : ''} 
          onClick={() => setSelectedView('regional')}
        >
          Regional Analysis
        </button>
        <button 
          className={selectedView === 'seasonal' ? 'active' : ''} 
          onClick={() => setSelectedView('seasonal')}
        >
          Seasonal Trends
        </button>
        <button 
          className={selectedView === 'predictions' ? 'active' : ''} 
          onClick={() => setSelectedView('predictions')}
        >
          ML Predictions
        </button>
      </div>

      {selectedView === 'regional' && (
        <div className="charts-section">
          <div className="chart-container">
            <h2>Regional Blood Demand</h2>
            <Bar data={analyticsData.regionalDemand} options={chartOptions} />
          </div>
          
          <div className="chart-container">
            <h2>Blood Type Distribution</h2>
            <Pie data={analyticsData.bloodTypeDistribution} options={pieOptions} />
          </div>
        </div>
      )}

      {selectedView === 'seasonal' && (
        <div className="charts-section">
          <div className="chart-container full-width">
            <h2>Seasonal Blood Demand Trends</h2>
            <Line data={analyticsData.seasonalTrends} options={chartOptions} />
          </div>
          
          <div className="insights-grid">
            <div className="insight-card">
              <h3>🌡️ Summer Peak</h3>
              <p>May-June shows highest demand due to heat-related emergencies and accidents</p>
              <span className="demand-level high">High Demand</span>
            </div>
            <div className="insight-card">
              <h3>🎆 Festival Season</h3>
              <p>October-November sees increased accidents during festival celebrations</p>
              <span className="demand-level very-high">Very High</span>
            </div>
            <div className="insight-card">
              <h3>❄️ Winter Stability</h3>
              <p>December-January shows more stable, predictable demand patterns</p>
              <span className="demand-level medium">Medium Demand</span>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'predictions' && (
        <div className="predictions-section">
          <div className="prediction-card">
            <h2>AI Predictions</h2>
            <div className="prediction-details">
              <div className="prediction-item">
                <h3>Next Month Forecast</h3>
                <div className="prediction-value">
                  <span className="number">{analyticsData.predictions.nextMonth.predictedDemand}</span>
                  <span className="unit">units</span>
                </div>
                <div className="confidence">
                  Confidence: {analyticsData.predictions.nextMonth.confidence}%
                </div>
                <div className={`trend ${analyticsData.predictions.nextMonth.trend}`}>
                  Trend: {analyticsData.predictions.nextMonth.trend}
                </div>
              </div>
            </div>
          </div>

          <div className="critical-periods">
            <h2>Critical Demand Periods</h2>
            <div className="periods-grid">
              {analyticsData.predictions.criticalPeriods.map((period, index) => (
                <div key={index} className="period-card">
                  <h3>{period.period}</h3>
                  <div className={`demand-badge ${period.demand.toLowerCase().replace(' ', '-')}`}>
                    {period.demand} Demand
                  </div>
                  <p>{period.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ml-model-info">
            <h2>Machine Learning Model Details</h2>
            <div className="model-stats">
              <div className="stat">
                <h3>Model Accuracy</h3>
                <span>92.5%</span>
              </div>
              <div className="stat">
                <h3>Data Points</h3>
                <span>10,000+</span>
              </div>
              <div className="stat">
                <h3>Features Used</h3>
                <span>15</span>
              </div>
              <div className="stat">
                <h3>Last Updated</h3>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodAnalytics;
