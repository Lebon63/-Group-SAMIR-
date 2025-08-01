import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faSync, faCheckCircle, faTimesCircle, faTrophy, faGamepad } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import GameDashboard from '../../components/game/GameDashboard';
import AchievementsGallery from '../../components/game/AchievementsGallery';
import gameAPI from '../../services/gameAPI';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function DonorDashboard() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    requestmade: 0,
    requestpending: 0,
    requestapproved: 0,
    requestrejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState(null);
  const [gameLoading, setGameLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In production, use actual API call
        // For now, we'll simulate the response with localStorage data
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // In a real implementation, we would call an endpoint like:
        // const response = await axios.get(`${API_URL}/donor/donor-dashboard-api/`, {
        //   headers: { 'Authorization': `Token ${token}` }
        // });
        // setStats(response.data);

        // For demo purposes, we use static data
        setTimeout(() => {
          setStats({
            requestmade: 5,
            requestpending: 2,
            requestapproved: 2,
            requestrejected: 1
          });
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    // Fetch game state data
    const fetchGameState = async () => {
      setGameLoading(true);
      try {
        const response = await gameAPI.getGameState();
        setGameState(response.data);
      } catch (error) {
        console.error('Failed to fetch game state:', error);
        // Set gameState to null to indicate it failed but we've handled it
        setGameState(null);
      } finally {
        setGameLoading(false);
      }
    };

    fetchDashboardData();
    fetchGameState();
  }, []);

  const renderDashboardContent = () => {
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
      <>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Welcome, {auth.user?.first_name || 'Donor'}</h5>
                <p className="card-text">
                  Thank you for being a blood donor. Your contributions help save lives.
                </p>
                {!gameLoading && gameState && gameState.profile && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <div className="mr-3" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dc3545', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                        Lvl {gameState.profile.level}
                      </div>
                      <div className="ml-3">
                        <p className="mb-1"><strong>Blood Hero</strong></p>
                        <p className="mb-0">Points: {gameState.profile.points}</p>
                        <button 
                          onClick={() => setActiveTab('game')} 
                          className="btn btn-sm btn-danger mt-2"
                        >
                          <FontAwesomeIcon icon={faGamepad} className="mr-1" /> Open Game
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faSyncAlt} size="3x" className="text-danger" />
                </div>
                <div>
                  <h5>Request Made</h5>
                  <h2 className="text-danger">{stats.requestmade}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faSync} size="3x" className="text-warning" />
                </div>
                <div>
                  <h5>Pending Request</h5>
                  <h2 className="text-warning">{stats.requestpending}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success" />
                </div>
                <div>
                  <h5>Approved Request</h5>
                  <h2 className="text-success">{stats.requestapproved}</h2>
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
                  <h5>Rejected Request</h5>
                  <h2 className="text-danger">{stats.requestrejected}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">Recent Activities</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">No recent activities to display.</p>
                {/* In a real app, we would display recent donations or requests here */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'game' ? 'active' : ''}`} 
            onClick={() => setActiveTab('game')}
          >
            <FontAwesomeIcon icon={faTrophy} className="mr-1" /> Blood Hero Game
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'achievements' ? 'active' : ''}`} 
            onClick={() => setActiveTab('achievements')}
          >
            <FontAwesomeIcon icon={faGamepad} className="mr-1" /> Achievements
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && (
        <>
          <h2 className="mb-4">Donor Dashboard</h2>
          {renderDashboardContent()}
        </>
      )}

      {activeTab === 'game' && (
        <div className="row">
          <div className="col-12">
            <GameDashboard />
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Your Achievements</h2>
            <AchievementsGallery />
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;