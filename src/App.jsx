import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// ProtectedRoute component to guard routes

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();
  return isLoggedIn ? children : (
    <Navigate to="/login" replace state={{ from: location.pathname, message: "Please login or signup first to donate or request blood." }} />
  );
}

function HospitalProtectedRoute({ children }) {
  const hospitalData = localStorage.getItem("hospitalData");
  const location = useLocation();
  return hospitalData ? children : (
    <Navigate to="/hospital-login" replace state={{ from: location.pathname, message: "Please login to access hospital dashboard." }} />
  );
}

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import HospitalNavbar from "./components/HospitalNavbar";
import Footer from "./components/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/responsive.css";

import Login from './pages/Login';
import Signup from './pages/Signup';
import TopDonors from './pages/TopDonors';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import Contact from './pages/ContactUs';
import ProfilePage from './pages/Profile';
import PredictDemand from './pages/PredictDemand';
import Donate from './pages/Donate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LiveDonorBoard from './pages/LiveDonorBoard';
import Hospital from './pages/Hospital';
import HospitalDashboardPage from './pages/HospitalDashboard';
import BloodAnalytics from './pages/BloodAnalytics';
import HospitalLoginPage from './pages/HospitalLogin';
import EventsPage from "./pages/EventsPage";

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup', '/hospital-login', '/hospital-dashboard'];
  const isHospitalRoute = location.pathname.startsWith('/hospital-dashboard') || 
                         location.pathname === '/hospital' ||
                         location.pathname === '/EventsPage';
  
  const hospitalData = JSON.parse(localStorage.getItem("hospitalData") || 'null');

  return (
    <div className="app-container">
      {isHospitalRoute && hospitalData ? (
        <HospitalNavbar hospital={hospitalData} />
      ) : (
        <Navbar />
      )}
      
      <div className="routes-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request" element={
            <ProtectedRoute>
              <TopDonors />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/donate" element={
            <ProtectedRoute>
              <Donate />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/predict-demand" element={<PredictDemand />} />
          <Route path="/analytics" element={<BloodAnalytics />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/LiveDonorBoard" element={<LiveDonorBoard />} />
          <Route path="/Hospital" element={<Hospital />} />
          <Route path="/hospital-dashboard" element={
            <HospitalProtectedRoute>
              <HospitalDashboardPage />
            </HospitalProtectedRoute>
          } />
          <Route path="/hospital-login" element={<HospitalLoginPage />} />
          <Route path="/EventsPage" element={<EventsPage />} />
        </Routes>
      </div>

      {!hideFooterRoutes.includes(location.pathname) && !isHospitalRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

