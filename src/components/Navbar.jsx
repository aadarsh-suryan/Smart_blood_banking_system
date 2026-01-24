import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          DonorDirect
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Services Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="servicesDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{fontSize: "1.1rem"}}
              >
                Services
              </button>
              <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                <li>
                  <Link className="dropdown-item" to="/donate" style={{color: "#a10000", fontSize: "1rem"}}>Donate Blood</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/request" style={{color: "#a10000", fontSize: "1rem"}}>Request Blood</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/LiveDonorBoard" style={{color: "#a10000", fontSize: "1rem"}}>Blood Alerts</Link>
                </li>
              </ul>
            </li>

            {/* Blood Management Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="managementDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{fontSize: "1.1rem"}}
              >
                Management
              </button>
              <ul className="dropdown-menu" aria-labelledby="managementDropdown">
                <li>
                  <Link className="dropdown-item" to="/Hospital" style={{color: "#a10000", fontSize: "1rem"}}>Hospital Portal</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/analytics" style={{color: "#a10000", fontSize: "1rem"}}>Blood Analytics</Link>
                </li>
              </ul>
            </li>

            {/* Information Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="infoDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{fontSize: "1.1rem"}}
              >
                Information
              </button>
              <ul className="dropdown-menu" aria-labelledby="infoDropdown">
                <li>
                  <Link className="dropdown-item" to="/about" style={{color: "#a10000", fontSize: "1rem"}}>About Us</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/contact" style={{color: "#a10000", fontSize: "1rem"}}>Contact</Link>
                </li>
              </ul>
            </li>

            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-light text-danger px-3 ms-2"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{fontSize: "1.1rem"}}
                >
                  My Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile" style={{color: "#a10000", fontSize: "1rem"}}>View Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard" style={{color: "#a10000", fontSize: "1rem"}}>Dashboard</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout} style={{color: "#a10000", fontSize: "1rem"}}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link btn btn-light text-danger px-3 ms-2"
                  to="/login"
                  style={{fontSize: "1.1rem"}}
                >
                  Login/Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
