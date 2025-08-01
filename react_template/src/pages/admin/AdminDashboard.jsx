import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faUsers, faProcedures, faUserShield } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/AuthContext';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function AdminDashboard() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalPatients: 0,
    totalBloodUnits: 0,
    pendingDonations: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In production, use actual API call
        // For now, we'll simulate the response
        
        // For demo purposes, we use static data
        setTimeout(() => {
          setStats({
            totalDonors: 15,
            totalPatients: 25,
            totalBloodUnits: 56,
            pendingDonations: 3,
            pendingRequests: 8
          });
          
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Administrator Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Welcome, Admin {auth.user?.username}</h5>
              <p className="card-text">
                Manage blood bank operations, donors, patients, and blood inventory from here.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faUsers} size="3x" className="text-primary" />
              </div>
              <h5 className="card-title">Total Donors</h5>
              <h2 className="text-primary">{stats.totalDonors}</h2>
              <Link to="/admin-donor" className="btn btn-sm btn-outline-primary mt-3">Manage Donors</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faProcedures} size="3x" className="text-info" />
              </div>
              <h5 className="card-title">Total Patients</h5>
              <h2 className="text-info">{stats.totalPatients}</h2>
              <Link to="/admin-patient" className="btn btn-sm btn-outline-info mt-3">Manage Patients</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faTint} size="3x" className="text-danger" />
              </div>
              <h5 className="card-title">Total Blood Units</h5>
              <h2 className="text-danger">{stats.totalBloodUnits}</h2>
              <Link to="/admin-blood" className="btn btn-sm btn-outline-danger mt-3">Manage Blood</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faUserShield} size="3x" className="text-success" />
              </div>
              <h5 className="card-title">Pending Requests</h5>
              <h2 className="text-success">{stats.pendingRequests}</h2>
              <Link to="/admin-request" className="btn btn-sm btn-outline-success mt-3">Manage Requests</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Recent Blood Donations</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <strong>Pending Approvals:</strong> {stats.pendingDonations} donations waiting for approval
              </div>
              <Link to="/admin-donation" className="btn btn-danger">Manage Donations</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Blood Inventory</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td><span className="badge badge-pill badge-danger">A+</span></td>
                      <td>12 units</td>
                      <td><span className="badge badge-pill badge-danger">A-</span></td>
                      <td>5 units</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-pill badge-danger">B+</span></td>
                      <td>8 units</td>
                      <td><span className="badge badge-pill badge-danger">B-</span></td>
                      <td>4 units</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-pill badge-danger">AB+</span></td>
                      <td>3 units</td>
                      <td><span className="badge badge-pill badge-danger">AB-</span></td>
                      <td>2 units</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-pill badge-danger">O+</span></td>
                      <td>15 units</td>
                      <td><span className="badge badge-pill badge-danger">O-</span></td>
                      <td>7 units</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;