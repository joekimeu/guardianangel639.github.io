import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { DarkModeContext } from './DarkModeContext';
import './footer.css';

export default function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer className={`footer-content ${darkMode ? 'footer-dark' : 'footer-light'}`}>
      <Container>
        <Row className="py-5">
          {/* Logo and Branding */}
          <Col md={4} className="mb-4 mb-md-0 text-center text-md-start">
            <h3 className="footer-brand">Guardian Angel Health Agency LLC</h3>
            <p className="footer-tagline">
              Close to Heart, Close to Home.
            </p>
          </Col>

          {/* Navigation Links */}
          <Col md={4} className="mb-4 mb-md-0 text-center">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#/about">About Us</a></li>
              <li><a href="#/contact">Contact Us</a></li>
              <li><a href="#/prospective">Careers</a></li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={4} className="text-center text-md-end">
            <h4 className="footer-title">Connect with Us</h4>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col className="text-center">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Guardian Angel Health Agency LLC. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
