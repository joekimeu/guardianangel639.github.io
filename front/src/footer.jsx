import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import './footer.css';

const Footer = () => {
    const { darkMode } = useDarkMode();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`footer ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-title">Guardian Angel Health Agency</h3>
                    <p className="footer-description">
                        Close to Heart, Close to Home. Providing exceptional healthcare services 
                        with compassion and dedication.
                    </p>
                    <div className="footer-contact">
                        <p>639 S. Hamilton Road</p>
                        <p>Whitehall, Ohio 43213</p>
                        <p>Phone: (614) 868-3225</p>
                        <p>Fax: (614) 868-3437</p>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Quick Links</h3>
                    <div className="footer-links">
                        <Link to="/" className="footer-link">Home</Link>
                        <Link to="/about" className="footer-link">About Us</Link>
                        <Link to="/contact" className="footer-link">Contact</Link>
                        <Link to="/trainings" className="footer-link">Trainings</Link>
                        <Link to="/prospective" className="footer-link">Prospective Employees</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Employee Resources</h3>
                    <div className="footer-links">
                        <Link to="/signin" className="footer-link">Sign In</Link>
                        <Link to="/clockinout" className="footer-link">Clock In/Out</Link>
                        <Link to="/punchhistory" className="footer-link">Punch History</Link>
                        <Link to="/qrcode" className="footer-link">QR Code</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Hours of Operation</h3>
                    <div className="hours-list">
                        <div className="hours-item">
                            <span>Monday - Friday:</span>
                            <span>8:00 AM - 5:00 PM</span>
                        </div>
                        <div className="hours-item">
                            <span>Saturday & Sunday:</span>
                            <span>Closed</span>
                        </div>
                    </div>
                    <p className="emergency-notice">
                        24/7 Emergency Support Available
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="copyright">
                        © {currentYear} Guardian Angel Health Agency LLC. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        <span className="separator">|</span>
                        <Link to="/terms" className="footer-link">Terms of Service</Link>
                        <span className="separator">|</span>
                        <Link to="/accessibility" className="footer-link">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
