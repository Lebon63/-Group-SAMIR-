import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faCalendarCheck, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/AuthContext';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function PatientDashboard() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [bloodStock, setBloodStock] = useState([]);
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
            totalRequests: 3,
            pendingRequests: 1,
            approvedRequests: 1,
            rejectedRequests: 1
          });
          
          setBloodStock([
            { group: 'A+', units: 12 },
            { group: 'A-', units: 5 },
            { group: 'B+', units: 8 },
            { group: 'B-', units: 4 },
            { group: 'AB+', units: 3 },
            { group: 'AB-', units: 2 },
            { group: 'O+', units: 15 },
            { group: 'O-', units: 7 }
          ]);
          
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
      <h2 className="mb-4">Patient Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Welcome, {auth.user?.first_name || 'Patient'}</h5>
              <p className="card-text">
                View available blood stocks and manage your blood requests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faTint} size="3x" className="text-danger" />
              </div>
              <div>
                <h5>Total Requests</h5>
                <h2 className="text-danger">{stats.totalRequests}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faSpinner} size="3x" className="text-warning" />
              </div>
              <div>
                <h5>Pending Requests</h5>
                <h2 className="text-warning">{stats.pendingRequests}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faCalendarCheck} size="3x" className="text-success" />
              </div>
              <div>
                <h5>Approved Requests</h5>
                <h2 className="text-success">{stats.approvedRequests}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faTimesCircle} size="3x" className="text-danger" />
              </div>
              <div>
                <h5>Rejected Requests</h5>
                <h2 className="text-danger">{stats.rejectedRequests}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Available Blood Stock</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Blood Group</th>
                      <th>Available Units</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodStock.map((stock, index) => (
                      <tr key={index}>
                        <td>
                          <span className="font-weight-bold">{stock.group}</span>
                        </td>
                        <td>{stock.units} units</td>
                        <td>
                          {stock.units > 0 ? (
                            <span className="badge badge-success">Available</span>
                          ) : (
                            <span className="badge badge-danger">Not Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
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

export default PatientDashboard;