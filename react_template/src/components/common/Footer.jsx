import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 mt-auto" style={{ backgroundColor: '#1a56db', color: 'white' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>BloodBank Management</h5>
            <p>Connecting donors and patients for a healthier world. Your blood can save lives.</p>
          </div>
          
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/donor/donorsignup" className="text-light">Become a Donor</Link></li>
              <li><Link to="/patient/patientsignup" className="text-light">Register as Patient</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <address>
              
              <p><i className="fas fa-phone mr-2"></i> +237 640666575</p>
              <p><i className="fas fa-envelope mr-2"></i> Samir@bloodbankmgmt.com</p>
            </address>
          </div>
        </div>
        
        <hr className="bg-light" />
        
        <div className="text-center">
          <p>&copy; {currentYear} BloodBank Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;