import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { logout } from '../../services/authService';

function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuth({
      isAuthenticated: false,
      user: null,
      role: '',
      loading: false
    });
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1a56db' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-tint mr-2"></i>
          BloodBank Management
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {!auth.isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="donorDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Donor
                  </a>
                  <div className="dropdown-menu" aria-labelledby="donorDropdown">
                    <Link className="dropdown-item" to="/donor/donorlogin">Login</Link>
                    <Link className="dropdown-item" to="/donor/donorsignup">Register</Link>
                  </div>
                </li>
                
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="patientDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Patient
                  </a>
                  <div className="dropdown-menu" aria-labelledby="patientDropdown">
                    <Link className="dropdown-item" to="/patient/patientlogin">Login</Link>
                    <Link className="dropdown-item" to="/patient/patientsignup">Register</Link>
                  </div>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/adminlogin">Admin</Link>
                </li>
              </>
            ) : (
              <>
                {auth.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/admin-dashboard">Dashboard</Link>
                  </li>
                )}
                
                {auth.role === 'DONOR' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/donor/donor-dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/donor/donate">Donate Blood</Link>
                    </li>
                  </>
                )}
                
                {auth.role === 'PATIENT' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/patient/patient-dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/patient/make-request">Request Blood</Link>
                    </li>
                  </>
                )}
                
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {auth.user?.first_name || auth.user?.username || 'User'}
                  </a>
                  <div className="dropdown-menu" aria-labelledby="userDropdown">
                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                      Logout
                    </a>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;