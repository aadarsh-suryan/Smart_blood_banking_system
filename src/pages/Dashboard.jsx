import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../styles/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [bloodGroupData, setBloodGroupData] = useState({});
  const [bloodPieData, setBloodPieData] = useState({});
  const [nextDonationDate, setNextDonationDate] = useState(null);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        const sortedByDate = [...data].sort(
          (a, b) => new Date(b.donation_date) - new Date(a.donation_date)
        );

        const recent = sortedByDate.slice(0, 5).map((d) => ({
          name: d.donor?.fullname || "Anonymous",
          blood: d.blood_type,
          date: new Date(d.donation_date).toLocaleDateString(),
        }));

        const bloodCount = {};
        let unitSum = 0;
        data.forEach((d) => {
          bloodCount[d.blood_type] = (bloodCount[d.blood_type] || 0) + d.units;
          unitSum += d.units;
        });

        const chartData = {
          labels: Object.keys(bloodCount),
          datasets: [
            {
              label: "Units",
              data: Object.values(bloodCount),
              backgroundColor: "#dc3545",
            },
          ],
        };

        const pieData = {
          labels: Object.keys(bloodCount),
          datasets: [
            {
              label: "Blood % Share",
              data: Object.values(bloodCount),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8BC34A",
                "#9C27B0",
                "#FF9800",
                "#00BCD4",
                "#795548",
              ],
            },
          ],
        };

        const userId = localStorage.getItem("userId");
        const userDonations = sortedByDate.filter((d) => d.donor?._id === userId);

        if (userDonations.length > 0) {
          const lastDonation = new Date(userDonations[0].donation_date);
          const today = new Date();
          const diffTime = today - lastDonation;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const daysLeft = 90 - diffDays;

          if (daysLeft > 0) {
            setNextDonationDate(`You can donate again in ${daysLeft} day(s).`);
          } else {
            setNextDonationDate("You are eligible to donate now.");
          }
        } else {
          setNextDonationDate("No recent donations found.");
        }

        setTotalUnits(unitSum);
        setRecentDonations(recent);
        setBloodGroupData(chartData);
        setBloodPieData(pieData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDonations();
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Blood Group Availability", color: "#dc3545" },
    },
    scales: {
      y: { ticks: { stepSize: 1 } },
    },
  };

  if (loading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh",
      fontSize: "1.5rem"
    }}>
      Loading...
    </div>
  );

  return (
    <div className="dashboard-main">
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        {/* Left Section */}
        <div className="left-section">
          <div className="card">
            <h3>Recent Donations</h3>
            <ul>
              {recentDonations.length === 0 ? (
                <li>No donations found.</li>
              ) : (
                recentDonations.map((d, i) => (
                  <li key={i}>
                    <strong>{d.name}</strong> donated <b>{d.blood}</b> on {d.date}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="card">
            <h3>Next Eligible Donation Date</h3>
            <p>{nextDonationDate}</p>
          </div>

          <div className="card">
            <h3>Total Units Donated</h3>
            <p>{totalUnits}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="chart-container card">
            {bloodGroupData.labels && bloodGroupData.labels.length > 0 ? (
              <Bar data={bloodGroupData} options={barOptions} />
            ) : (
              <div>No blood group data available.</div>
            )}
          </div>
          <div className="chart-container card">
            {bloodPieData.labels && bloodPieData.labels.length > 0 ? (
              <Pie data={bloodPieData} />
            ) : (
              <div>No pie chart data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
