import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserMd, faHospitalUser, faTint } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section text-white py-5" style={{ backgroundColor: '#1a56db' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 font-weight-bold mb-4">Give Blood, Give Life</h1>
              <p className="lead mb-4">Your donation can save up to 3 lives. Be a hero today by donating blood and making a difference in someone's life.</p>
              <div className="d-flex flex-wrap">
                <Link to="/donor/donorsignup" className="btn btn-light mr-3 mb-2" style={{ color: '#1a56db' }}>
                  <FontAwesomeIcon icon={faHeart} className="mr-2" /> Become a Donor
                </Link>
                <Link to="/patient/patientsignup" className="btn btn-outline-light mb-2">
                  <FontAwesomeIcon icon={faHospitalUser} className="mr-2" /> Register as Patient
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img src="/images/BloodDonation.jpg" className="img-fluid rounded shadow" alt="Blood Donation" />
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="circle-icon mb-4" style={{ backgroundColor: '#f97316' }}>
                    <FontAwesomeIcon icon={faTint} size="2x" className="text-white" />
                  </div>
                  <h4 className="card-title">Blood Donation</h4>
                  <p className="card-text">
                    Your blood donation can help save lives. Learn about the process and requirements.
                  </p>
                  <Link to="/donor/donorlogin" className="btn" style={{ borderColor: '#1a56db', color: '#1a56db' }}>Donor Login</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="circle-icon mb-4" style={{ backgroundColor: '#1a56db' }}>
                    <FontAwesomeIcon icon={faHospitalUser} size="2x" className="text-white" />
                  </div>
                  <h4 className="card-title">Patient Services</h4>
                  <p className="card-text">
                    Need blood? Register as a patient and submit your blood request.
                  </p>
                  <Link to="/patient/patientlogin" className="btn" style={{ borderColor: '#f97316', color: '#f97316' }}>Patient Login</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="circle-icon mb-4" style={{ backgroundColor: '#f97316' }}>
                    <FontAwesomeIcon icon={faUserMd} size="2x" className="text-white" />
                  </div>
                  <h4 className="card-title">Administration</h4>
                  <p className="card-text">
                    Blood bank administrators can manage donors, patients, and blood inventory.
                  </p>
                  <Link to="/admin/adminlogin" className="btn" style={{ borderColor: '#1a56db', color: '#1a56db' }}>Admin Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">Blood Groups & Compatibility</h2>
              <p className="lead text-muted">Understanding blood types is crucial for successful transfusions</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h4 className="mb-4" style={{ color: '#1a56db' }}>Blood Group Types</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-white" style={{ backgroundColor: '#1a56db' }}>
                    <tr>
                      <th>Blood Type</th>
                      <th>Can Donate To</th>
                      <th>Can Receive From</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>A+</strong></td>
                      <td>A+, AB+</td>
                      <td>A+, A-, O+, O-</td>
                    </tr>
                    <tr>
                      <td><strong>A-</strong></td>
                      <td>A+, A-, AB+, AB-</td>
                      <td>A-, O-</td>
                    </tr>
                    <tr>
                      <td><strong>B+</strong></td>
                      <td>B+, AB+</td>
                      <td>B+, B-, O+, O-</td>
                    </tr>
                    <tr>
                      <td><strong>B-</strong></td>
                      <td>B+, B-, AB+, AB-</td>
                      <td>B-, O-</td>
                    </tr>
                    <tr>
                      <td><strong>AB+</strong></td>
                      <td>AB+</td>
                      <td>All Types</td>
                    </tr>
                    <tr>
                      <td><strong>AB-</strong></td>
                      <td>AB+, AB-</td>
                      <td>A-, B-, AB-, O-</td>
                    </tr>
                    <tr>
                      <td><strong>O+</strong></td>
                      <td>A+, B+, AB+, O+</td>
                      <td>O+, O-</td>
                    </tr>
                    <tr>
                      <td><strong>O-</strong></td>
                      <td>All Types</td>
                      <td>O-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="mb-4" style={{ color: '#f97316' }}>Why Donate Blood?</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent">
                  <i className="fas fa-check mr-2" style={{ color: '#f97316' }}></i>
                  Blood cannot be manufactured – it can only come from donors
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="fas fa-check mr-2" style={{ color: '#f97316' }}></i>
                  A single car accident victim can require up to 100 units of blood
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="fas fa-check mr-2" style={{ color: '#f97316' }}></i>
                  Every 2 seconds someone needs blood or blood products
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="fas fa-check mr-2" style={{ color: '#f97316' }}></i>
                  Donating blood can help cancer patients, accident victims, and many more
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="fas fa-check mr-2" style={{ color: '#f97316' }}></i>
                  The donation process takes less than an hour of your time
                </li>
              </ul>
              <div className="mt-4">
                <Link to="/donor/donorsignup" className="btn text-white" style={{ backgroundColor: '#1a56db' }}>
                  Register to Donate Blood
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 text-white" style={{ backgroundColor: '#f97316' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 font-weight-bold">15+</h2>
              <p className="lead">Donors</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 font-weight-bold">25+</h2>
              <p className="lead">Patients</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 font-weight-bold">50+</h2>
              <p className="lead">Blood Units</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 font-weight-bold">30+</h2>
              <p className="lead">Successful Donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto text-center">
              <h2 className="mb-4">Ready to Make a Difference?</h2>
              <p className="lead mb-4">
                Join our community of donors and help save lives through blood donation.
              </p>
              <Link to="/donor/donorsignup" className="btn btn-lg text-white px-4 mr-3" style={{ backgroundColor: '#1a56db' }}>
                Become a Donor
              </Link>
              <Link to="/patient/patientlogin" className="btn btn-lg px-4" style={{ borderColor: '#f97316', color: '#f97316' }}>
                Need Blood?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for this component */}
      <style jsx="true">{`
        .hero-section {
          position: relative;
          background-color: #1a56db;
          background-image: linear-gradient(135deg, #1a56db 0%, #1e40af 100%);
        }
        
        .circle-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .section-title {
          position: relative;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          display: block;
          width: 80px;
          height: 3px;
          background: #f97316;
          bottom: 0;
          left: calc(50% - 40px);
        }
      `}</style>
    </div>
  );
}

export default Home;