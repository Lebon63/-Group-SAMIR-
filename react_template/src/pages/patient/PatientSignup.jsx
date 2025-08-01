import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../../services/authService';

function PatientSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const diseaseOptions = ['Cancer', 'Diabetes', 'Heart Disease', 'Hypertension', 'Accident', 'Surgery', 'Other'];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Format the form data to match Django backend expectations
      const formData = {
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        bloodgroup: data.bloodgroup,
        disease: data.disease,
        age: data.age,
        doctorname: data.doctorname,
        address: data.address,
        mobile: data.mobile,
        profile_pic: data.profile_pic[0] // Handle file upload in a real implementation
      };

      const response = await registerUser('patient', formData);
      
      if (response.error) {
        setError(response.message || 'Registration failed.');
      } else {
        // Registration successful
        navigate('/patient/patientlogin');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">Patient Registration</h4>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || "Passwords do not match"
                    })}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select 
                    className={`form-control ${errors.bloodgroup ? 'is-invalid' : ''}`}
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
              
              <div className="col-md-6">
                <div className="form-group">
                  <label>Mobile</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                    {...register('mobile', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^\d{10}$/,
                        message: 'Please enter a valid 10-digit mobile number'
                      }
                    })}
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Disease</label>
                  <select 
                    className={`form-control ${errors.disease ? 'is-invalid' : ''}`}
                    {...register('disease', { required: 'Disease information is required' })}
                  >
                    <option value="">Select Disease</option>
                    {diseaseOptions.map(disease => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </select>
                  {errors.disease && <div className="invalid-feedback">{errors.disease.message}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label>Age</label>
                  <input 
                    type="number"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    {...register('age', { 
                      required: 'Age is required',
                      min: {
                        value: 1,
                        message: 'Age must be greater than 0'
                      },
                      max: {
                        value: 120,
                        message: 'Age must be less than 120'
                      }
                    })}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age.message}</div>}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Doctor Name</label>
              <input 
                type="text"
                className={`form-control ${errors.doctorname ? 'is-invalid' : ''}`}
                {...register('doctorname', { required: 'Doctor name is required' })}
              />
              {errors.doctorname && <div className="invalid-feedback">{errors.doctorname.message}</div>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea 
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                rows="3"
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>

            <div className="form-group">
              <label>Profile Picture</label>
              <input 
                type="file"
                className={`form-control-file ${errors.profile_pic ? 'is-invalid' : ''}`}
                {...register('profile_pic')}
              />
              {errors.profile_pic && <div className="invalid-feedback">{errors.profile_pic.message}</div>}
            </div>
            
            <div className="form-group mt-4">
              <button 
                type="submit" 
                className="btn btn-danger btn-block"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="text-center mt-3">
              <p>
                Already have an account? <Link to="/patient/patientlogin" className="text-danger">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientSignup;