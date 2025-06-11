import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './home.css';

const Home = () => {
    const { darkMode } = useDarkMode();
    useRevealAnimations();

    return (
        <RouteTransition>
            <div className={`home ${darkMode ? 'dark-theme' : 'light-theme'}`}>
                <section className="hero">
                    <div className="hero-image">
                        {/* <img 
                            // src={require('./docs/Images/cover.jpeg')} 
                            src=""
                            alt="Healthcare professionals caring for patients"
                            className="hero-bg-image"
                        /> */}
                    </div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content reveal">
                        <h1>Welcome to Guardian Angel Health Agency</h1>
                        <p className="tagline">Close to Heart, Close to Home</p>
                        <div className="hero-buttons">
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                            <Link to="/about" className="btn btn-primary">Learn More</Link>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="services-grid">
                            <div className="service-card reveal">
                                <h3>Compassionate Care</h3>
                                <p>Providing personalized care with understanding and empathy.</p>
                            </div>

                            <div className="service-card reveal">
                                <h3>24/7 Support</h3>
                                <p>Round-the-clock assistance for your healthcare needs.</p>
                            </div>

                            <div className="service-card reveal">
                                <h3>Professional Staff</h3>
                                <p>Experienced and certified healthcare professionals.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section surface-2">
                    <div className="container">
                        <div className="info-grid">
                            <div className="info-content reveal">
                                <h2>Why Choose Us?</h2>
                                <ul className="feature-list">
                                    <li>Licensed and certified healthcare professionals</li>
                                    <li>Personalized care plans</li>
                                    <li>Regular training and skill development</li>
                                    <li>Comprehensive healthcare services</li>
                                    <li>Strong community relationships</li>
                                </ul>
                                <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
                            </div>
                            <div className="info-image reveal">
                                <img 
                                    src={require('./docs/Images/n-old-bcouple-2.jpeg')} 
                                    alt="Caring healthcare professional with patient"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="contact-info reveal">
                            <h2>Contact Information</h2>
                            <div className="contact-grid">
                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <h3>Address</h3>
                                        <p>639 S. Hamilton Road</p>
                                        <p>Whitehall, Ohio 43213</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <h3>Phone</h3>
                                        <p>(614) 868-3225</p>
                                        <p>Fax: (614) 868-3437</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3>Hours</h3>
                                        <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                                        <p>24/7 Emergency Support Available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section reveal">
                    <div className="cta-background">
                        <img 
                            src={require('./docs/Images/n12.jpg')} 
                            alt="Healthcare facility"
                            loading="lazy"
                        />
                    </div>
                    <div className="container">
                        <h2 className="cta-title">Ready to Get Started?</h2>
                        <p className="cta-description">Contact us today to learn more about our services and how we can help you.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                    </div>
                </section>
            </div>
        </RouteTransition>
    );
};

export default Home;
