import React, { useState, useEffect } from "react";
import "../styles/EventsPage.css";

const EventsPage = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Blood Donation Camp - AIIMS",
      date: "2025-08-15",
      location: "AIIMS Hospital, Delhi",
      description: "Organized by Red Cross Society. Join us in saving lives."
    },
    {
      id: 2,
      title: "Blood Donation Awareness Seminar",
      date: "2025-08-20",
      location: "Town Hall, Lucknow",
      description: "Learn about the importance of regular blood donation."
    },
    {
      id: 3,
      title: "Mega Blood Donation Drive",
      date: "2025-08-25",
      location: "City Convention Center, Mumbai",
      description: "An initiative by Rotary Club to collect 500+ units of blood."
    },
    {
      id: 4,
      title: "Youth Blood Donors Meet",
      date: "2025-08-28",
      location: "NIT Delhi Campus",
      description: "Awareness and motivation for youth to donate blood regularly."
    },
    {
      id: 5,
      title: "Blood Donation Marathon",
      date: "2025-09-01",
      location: "Bangalore Palace Grounds",
      description: "Run for a cause and donate blood after the marathon."
    },
    {
      id: 6,
      title: "Corporate Blood Camp - Infosys",
      date: "2025-09-05",
      location: "Infosys Campus, Pune",
      description: "Employees and public welcome to donate blood."
    },
    {
      id: 7,
      title: "Medical Camp & Blood Drive",
      date: "2025-09-08",
      location: "Govt. Medical College, Chennai",
      description: "Free health checkup along with blood donation opportunity."
    },
    {
      id: 8,
      title: "World Blood Donor Day Celebration",
      date: "2025-09-12",
      location: "Jawaharlal Nehru Stadium, Delhi",
      description: "Celebrate the heroes who donate blood and save lives."
    },
    {
      id: 9,
      title: "Rural Blood Awareness Camp",
      date: "2025-09-15",
      location: "Block Development Office, Jaipur",
      description: "Educating rural communities about voluntary blood donation."
    },
    {
      id: 10,
      title: "Blood Donation & Wellness Fair",
      date: "2025-09-20",
      location: "Science City, Kolkata",
      description: "Blood donation along with wellness workshops and yoga sessions."
    }
  ]);

  const [requestForm, setRequestForm] = useState({
    hospitalName: "",
    hospitalAddress: "",
    preferredDate: "",
    contactName: "",
    contactPhone: "",
    additionalDetails: ""
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch requests from backend on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
  const res = await fetch("http://localhost:4000/api/auth/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      alert("Failed to fetch requests");
    }
    setLoading(false);
  };

  const handleRequestChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (
      !requestForm.hospitalName ||
      !requestForm.hospitalAddress ||
      !requestForm.preferredDate ||
      !requestForm.contactName ||
      !requestForm.contactPhone
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
  const res = await fetch("http://localhost:4000/api/auth/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm)
      });
      if (res.ok) {
        alert("Your request for a blood donation camp has been submitted!");
        setRequestForm({
          hospitalName: "",
          hospitalAddress: "",
          preferredDate: "",
          contactName: "",
          contactPhone: "",
          additionalDetails: ""
        });
        fetchRequests(); // Refresh requests list
      } else {
        alert("Failed to submit request");
      }
    } catch (err) {
      alert("Error submitting request");
    }
  };

  return (
    <div className="events-container">
      <h2>Upcoming Blood Donation Camps & Seminars</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card improved-event-card">
            <div className="event-card-header">
              <div className="event-icon">🩸</div>
              <div>
                <h4 className="event-title">{event.title}</h4>
                <div className="event-date-location">
                  <span className="event-date"><i className="fa fa-calendar"></i> {event.date}</span>
                  <span className="event-location"><i className="fa fa-map-marker"></i> {event.location}</span>
                </div>
              </div>
            </div>
            <div className="event-description">
              {event.description}
            </div>
          </div>
        ))}
      </div>

      <div className="add-event">
        <h3>Request a Blood Donation Camp Near Me</h3>
        <form onSubmit={submitRequest}>
          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={requestForm.hospitalName}
            onChange={handleRequestChange}
            required
          />
          <input
            type="text"
            name="hospitalAddress"
            placeholder="Hospital Address"
            value={requestForm.hospitalAddress}
            onChange={handleRequestChange}
            required
          />
          <input
            type="date"
            name="preferredDate"
            value={requestForm.preferredDate}
            onChange={handleRequestChange}
            required
          />
          <input
            type="text"
            name="contactName"
            placeholder="Your Name"
            value={requestForm.contactName}
            onChange={handleRequestChange}
            required
          />
          <input
            type="tel"
            name="contactPhone"
            placeholder="Contact Phone"
            value={requestForm.contactPhone}
            onChange={handleRequestChange}
            required
          />
          <textarea
            name="additionalDetails"
            placeholder="Additional Details (optional)"
            value={requestForm.additionalDetails}
            onChange={handleRequestChange}
          />
          <button type="submit">Request Camp</button>
        </form>
      </div>

      <div className="current-requests">
        <h3>Current Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Hospital Name</th>
                <th>Address</th>
                <th>Preferred Date</th>
                <th>Contact Name</th>
                <th>Contact Phone</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={idx}>
                  <td>{req.hospitalName}</td>
                  <td>{req.hospitalAddress}</td>
                  <td>{req.preferredDate}</td>
                  <td>{req.contactName}</td>
                  <td>{req.contactPhone}</td>
                  <td>{req.additionalDetails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

