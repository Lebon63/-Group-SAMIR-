import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthContext from '../../contexts/AuthContext';
import gameAPI from '../../services/gameAPI';
import axios from 'axios';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function DonateBlood() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGameReward, setShowGameReward] = useState(false);
  const [gameReward, setGameReward] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const diseaseChoices = ['None', 'Diabetes', 'High Blood Pressure', 'Heart Disease', 'Other'];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, make an API call to FastAPI backend
      // const response = await axios.post(`${API_URL}/donor/blood-donations/`, data, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // For development, mock the donation
      setTimeout(async () => {
        // Simulate successful donation
        setSuccess('Your blood donation request has been submitted successfully. We will contact you shortly with further instructions.');
        
        try {
          // Call game API to process the completed donation
          const gameResponse = await gameAPI.processDonationComplete();
          setGameReward(gameResponse.data);
          setShowGameReward(true);
        } catch (gameError) {
          console.error('Failed to process game reward:', gameError);
          // Don't show error to user, as this is a bonus feature
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to submit donation request:', error);
      setError('Failed to submit your donation request. Please try again.');
      setLoading(false);
    }
  };

  const renderGameReward = () => {
    if (!gameReward) return null;
    
    return (
      <div className="bg-light p-4 rounded mt-4 border border-warning">
        <div className="text-center">
          <div className="mb-3">
            <span className="display-4">🏆</span>
          </div>
          <h4 className="text-warning">Blood Hero Rewards!</h4>
          <p>Thank you for your donation! You've earned:</p>
          <div className="bg-white p-3 rounded mb-3">
            <h5 className="text-danger">+100 Points</h5>
            {gameReward.profile && gameReward.profile.level > 1 && (
              <p className="mb-0">
                <strong>Level {gameReward.profile.level}!</strong> 
                {gameReward.profile.donation_streak > 1 && (
                  <span className="ml-2">
                    <span className="text-danger">{gameReward.profile.donation_streak} 🔥</span> donation streak!
                  </span>
                )}
              </p>
            )}
          </div>
          
          {gameReward.achievements && gameReward.achievements.length > 0 && (
            <div className="mt-3">
              <h5>Achievements Unlocked:</h5>
              <div className="row">
                {gameReward.achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="col-md-4 mb-2">
                    <div className="bg-warning bg-opacity-25 p-2 rounded">
                      <p className="font-weight-bold mb-1">{achievement.achievement.name}</p>
                      <p className="small mb-0">{achievement.achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <button 
              className="btn btn-success mr-2" 
              onClick={() => navigate('/donor/game')}
            >
              View Game Dashboard
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => setShowGameReward(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Donate Blood</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && !showGameReward && (
                <div className="alert alert-success" role="alert">
                  {success}
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary mr-2" 
                      onClick={() => navigate('/donor/donor-dashboard')}
                    >
                      Back to Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => {
                        setSuccess('');
                      }}
                    >
                      Make Another Donation
                    </button>
                  </div>
                </div>
              )}
              
              {showGameReward && renderGameReward()}
              
              {!success && !showGameReward && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Donor Name</label>
                        <input 
                          type="text"
                          className="form-control"
                          defaultValue={`${auth.user?.first_name || ''} ${auth.user?.last_name || ''}`}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Blood Group</label>
                        <select 
                          className="form-control"
                          defaultValue={auth.user?.bloodgroup || ''}
                          disabled
                        >
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                        <input 
                          type="hidden" 
                          {...register('bloodgroup')} 
                          defaultValue={auth.user?.bloodgroup || ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Units to Donate</label>
                        <input 
                          type="number"
                          className={`form-control ${errors.unit ? 'is-invalid' : ''}`}
                          min="1"
                          max="2"
                          defaultValue="1"
                          {...register('unit', { 
                            required: 'Number of units is required',
                            min: {
                              value: 1,
                              message: 'Minimum 1 unit is required'
                            },
                            max: {
                              value: 2,
                              message: 'Maximum 2 units can be donated at once'
                            }
                          })}
                        />
                        {errors.unit && <div className="invalid-feedback">{errors.unit.message}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Preferred Donation Date</label>
                        <input 
                          type="date"
                          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                          {...register('date', { 
                            required: 'Donation date is required',
                            validate: value => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const selectedDate = new Date(value);
                              return selectedDate >= today || 'Date cannot be in the past';
                            }
                          })}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Do you have any health conditions?</label>
                    <select 
                      className={`form-control ${errors.disease ? 'is-invalid' : ''}`}
                      {...register('disease', { required: 'This field is required' })}
                    >
                      <option value="">Select Option</option>
                      {diseaseChoices.map(disease => (
                        <option key={disease} value={disease}>{disease}</option>
                      ))}
                    </select>
                    {errors.disease && <div className="invalid-feedback">{errors.disease.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Last Donation Date (if applicable)</label>
                    <input 
                      type="date"
                      className="form-control"
                      {...register('lastDonation')}
                    />
                    <small className="text-muted">Leave empty if this is your first donation</small>
                  </div>

                  <div className="form-check mt-3 mb-3">
                    <input
                      className={`form-check-input ${errors.confirmation ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="confirmationCheck"
                      {...register('confirmation', { required: 'You must confirm this statement' })}
                    />
                    <label className="form-check-label" htmlFor="confirmationCheck">
                      I confirm that I am in good health, haven't consumed alcohol in the last 24 hours, and haven't donated blood in the last 3 months.
                    </label>
                    {errors.confirmation && <div className="invalid-feedback">{errors.confirmation.message}</div>}
                  </div>
                  
                  <div className="form-group mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-danger btn-block"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Donation Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonateBlood;