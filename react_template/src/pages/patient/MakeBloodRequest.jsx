import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthContext from '../../contexts/AuthContext';
import axios from 'axios';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function MakeBloodRequest() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, make an API call to Django
      // const response = await axios.post(`${API_URL}/patient/make-request/`, data, {
      //   headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      // });
      
      // For development, mock the request
      setTimeout(() => {
        // Simulate successful request
        setSuccess('Your blood request has been submitted successfully. We will notify you once it is processed.');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to submit blood request:', error);
      setError('Failed to submit your request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Request Blood</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary mr-2" 
                      onClick={() => navigate('/patient/patient-dashboard')}
                    >
                      Back to Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => {
                        setSuccess('');
                      }}
                    >
                      Make Another Request
                    </button>
                  </div>
                </div>
              )}
              
              {!success && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Patient Name</label>
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
                        <label>Blood Group Required</label>
                        <select 
                          className={`form-control ${errors.bloodgroup ? 'is-invalid' : ''}`}
                          defaultValue={auth.user?.bloodgroup || ''}
                          {...register('bloodgroup', { required: 'Blood group is required' })}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                        {errors.bloodgroup && <div className="invalid-feedback">{errors.bloodgroup.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Units Required</label>
                        <input 
                          type="number"
                          className={`form-control ${errors.unit ? 'is-invalid' : ''}`}
                          min="1"
                          {...register('unit', { 
                            required: 'Number of units is required',
                            min: {
                              value: 1,
                              message: 'Minimum 1 unit is required'
                            },
                            max: {
                              value: 10,
                              message: 'Maximum 10 units can be requested at once'
                            }
                          })}
                        />
                        {errors.unit && <div className="invalid-feedback">{errors.unit.message}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Required Date</label>
                        <input 
                          type="date"
                          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                          {...register('date', { 
                            required: 'Required date is needed',
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
                    <label>Doctor's Name</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.doctorname ? 'is-invalid' : ''}`}
                      {...register('doctorname', { required: 'Doctor name is required' })}
                    />
                    {errors.doctorname && <div className="invalid-feedback">{errors.doctorname.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Hospital Name & Address</label>
                    <textarea 
                      className={`form-control ${errors.hospitaladdress ? 'is-invalid' : ''}`}
                      rows="3"
                      {...register('hospitaladdress', { required: 'Hospital address is required' })}
                    ></textarea>
                    {errors.hospitaladdress && <div className="invalid-feedback">{errors.hospitaladdress.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Reason for Blood Requirement</label>
                    <textarea 
                      className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                      rows="3"
                      {...register('reason', { required: 'Reason is required' })}
                    ></textarea>
                    {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
                  </div>
                  
                  <div className="form-group mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-danger btn-block"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
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

export default MakeBloodRequest;