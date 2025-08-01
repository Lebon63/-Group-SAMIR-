import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import Home from './pages/Home';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Donor pages
import DonorLogin from './pages/donor/DonorLogin';
import DonorSignup from './pages/donor/DonorSignup';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonateBlood from './pages/donor/DonateBlood';

// Patient pages
import PatientLogin from './pages/patient/PatientLogin';
import PatientSignup from './pages/patient/PatientSignup';
import PatientDashboard from './pages/patient/PatientDashboard';
import MakeBloodRequest from './pages/patient/MakeBloodRequest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1 py-3">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />

              {/* Authentication routes */}
              <Route path="/admin/adminlogin" element={<AdminLogin />} />
              <Route path="/donor/donorlogin" element={<DonorLogin />} />
              <Route path="/donor/donorsignup" element={<DonorSignup />} />
              <Route path="/patient/patientlogin" element={<PatientLogin />} />
              <Route path="/patient/patientsignup" element={<PatientSignup />} />

              {/* Admin protected routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
                {/* Add more admin routes here */}
              </Route>

              {/* Donor protected routes */}
              <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
                <Route path="/donor/donor-dashboard" element={<DonorDashboard />} />
                <Route path="/donor/donate" element={<DonateBlood />} />
                {/* Add more donor routes here */}
              </Route>

              {/* Patient protected routes */}
              <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                <Route path="/patient/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/patient/make-request" element={<MakeBloodRequest />} />
                {/* Add more patient routes here */}
              </Route>

              {/* Fallback route - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;