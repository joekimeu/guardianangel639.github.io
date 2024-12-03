import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { Container } from 'react-bootstrap';
import heroImage from './docs/cover.jpeg';
import backgroundImage1 from './docs/Images/n25.jpg';
import backgroundImage2 from './docs/Images/n0.jpg';
import backgroundImage3 from './docs/Images/n2.jpeg';
import './global.css';
import './about.css'; // Custom CSS for this page

export default function AboutPage() {
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '10px',
    marginTop: '20px',
  };

  const center = {
    lat: 39.96277, // Latitude for 639 S. Hamilton Road
    lng: -82.87669, // Longitude for 639 S. Hamilton Road
  };

  const apiKey = "AIzaSyB29WpUY7XhwndWi-X7__oBG5VsrHkWk8o"; // Replace with your API key

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
        }}
      >
        <Container className="text-center hero-content">
          <h1 className="display-3 fw-bold">Welcome to Guardian Angel Health Agency LLC.</h1>
          <p className="lead" style={{ fontSize: '1.5rem' }}>Close to Heart, Close to Home</p>
        </Container>
      </section>

      {/* Section 1 - Contact Information */}
      <section
        className="full-screen-section"
        style={{
          backgroundImage: `url("${backgroundImage1}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container className="text-center section-content overlay">
          <h2 className="display-4 text-white">Contact Information</h2>
          <p className="section-text text-white">
            639 S. Hamilton Road, Whitehall, Ohio 43213 <br />
            Phone: (614) 868-3225 / (614) 717-8151 <br />
            Fax: (614) 868-3437 <br />
            Email: <a href="mailto:office.manager@guardianangelha.com" className="text-white">office.manager@guardianangelha.com</a>
          </p>

          {/* Interactive Map */}
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={17}
            >
              {/* Marker indicating the agency location */}
              <MarkerF
                position={center}
                title="Guardian Angel Health Agency LLC"
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />

            </GoogleMap>
          </LoadScript>
        </Container>
      </section>

      {/* Section 2 - About Us */}
      <section
        className="full-screen-section"
        style={{
          backgroundImage: `url("${backgroundImage2}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-overlay">
          <Container className="text-center section-content overlay">
            <h2 className="display-4 text-white">About Us</h2>
            <p className="section-text text-white">
              Our mission is to nurture health to promote the welfare of individuals and families by providing compassionate and comprehensive patient-centered quality home health care that is safe and dependable.
            </p>
            <br />
            <h2 className="display-4 text-white">Our Trained Staff Consists of:</h2>
            <p className="section-text text-white">
              Registered Nurses (RN), Licensed Practical Nurses (LPN), State Tested Nursing Assistants (STNA), Home Health Aides, Physical Therapists, Occupational Therapists, Speech Therapists
            </p>
          </Container>
        </div>
      </section>

      {/* Section 3 - Now Offering */}
      <section
        className="full-screen-section"
        style={{
          backgroundImage: `url("${backgroundImage3}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-overlay">
          <Container className="text-center section-content overlay">
            <h2 className="display-4 text-white">Now Offering</h2>
            <p className="section-text text-white">
              TB Tests, FBI and BCI Background Checks
            </p>
            <h2 className="display-4 text-white">We Accept These Insurances</h2>
            <p className="section-text text-white">
              Medicare, Medicaid, DODD, Aetna, Molina, Buckeye, Passport, and more.
            </p>
          </Container>
        </div>
      </section>
    </div>
  );
}

