import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthContext from '../../contexts/AuthContext';
import { login } from '../../services/authService';

function DonorLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await login('donor', data);
      
      if (response.error) {
        setError(response.message || 'Login failed. Please check your credentials.');
      } else {
        setAuth({
          isAuthenticated: true,
          user: response.user,
          role: 'DONOR',
          loading: false
        });
        navigate('/donor/donor-dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Donor Login</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Enter username"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">
                      {errors.username.message}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-danger btn-block"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account? <Link to="/donor/donorsignup" className="text-danger">Register here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorLogin;