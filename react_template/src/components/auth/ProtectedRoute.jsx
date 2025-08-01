import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { auth } = useContext(AuthContext);
  
  // If authentication is still loading, show loading spinner
  if (auth.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has required role
  if (auth.isAuthenticated && (!allowedRoles || allowedRoles.includes(auth.role))) {
    return <Outlet />;
  }
  
  // Redirect to login page based on role
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // User doesn't have required role, redirect to their dashboard
  switch (auth.role) {
    case 'ADMIN':
      return <Navigate to="/admin/admin-dashboard" replace />;
    case 'DONOR':
      return <Navigate to="/donor/donor-dashboard" replace />;
    case 'PATIENT':
      return <Navigate to="/patient/patient-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;