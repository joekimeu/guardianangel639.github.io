import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './prospective.css';

const Prospective = () => {
    const { darkMode } = useDarkMode();
    useRevealAnimations();

    return (
        <RouteTransition>
            <div className={`prospective ${darkMode ? 'dark-theme' : 'light-theme'}`}>
                <section className="hero">
                    <div className="hero-image">
                        <img 
                            src={require('./docs/Images/n20.jpg')} 
                            alt="Healthcare team collaboration"
                            className="hero-bg-image"
                        />
                    </div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content reveal">
                        <h1>Join Our Team</h1>
                        <p className="subtitle">Make a Difference in Healthcare</p>
                    </div>
                </section>

                <div className="container">
                    <section className="section">
                        <div className="card reveal">
                            <h2 className='career-opportunities'>Career Opportunities</h2>
                            <br />
                            <p className="section-text">
                                At Guardian Angel Health Agency, we're always looking for dedicated healthcare 
                                professionals who share our commitment to providing exceptional patient care.
                            </p>

                            <div className="requirements-grid">
                                <div className="requirements-list">
                                    <h3>Basic Requirements:</h3>
                                    <ul>
                                        <li>Valid State of Ohio License/Certification</li>
                                        <li>Current CPR Certification</li>
                                        <li>Valid Driver's License and Auto Insurance</li>
                                        <li>Reliable Transportation</li>
                                        <li>Ability to Pass Background Check</li>
                                        <li>Strong Communication Skills</li>
                                    </ul>
                                </div>

                                <div className="benefits-section">
                                    {/* <div className="benefits-image">
                                        <img 
                                            src={require('./docs/Images/n25.jpg')} 
                                            alt="Employee benefits"
                                            loading="lazy"
                                        />
                                    </div> */}
                                    <h3>We Offer:</h3>
                                    <ul>
                                        <li>Competitive Pay</li>
                                        <li>Flexible Scheduling</li>
                                        <li>Professional Development</li>
                                        <li>Supportive Work Environment</li>
                                        <li>Regular Training Opportunities</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section surface-2">
                        <div className="card reveal">
                            <div className="process-header">
                                <div className="header-content">
                                    <h2>Application Process</h2>
                                    <p>Join our team in four simple steps</p>
                                </div>
                                <div className="header-image">
                                    <img 
                                        src={require('./docs/Images/n25.jpg')} 
                                        alt="Application process"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="process-steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <h3>Submit Application</h3>
                                    <p>Complete our online application form or visit our office.</p>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <h3>Interview</h3>
                                    <p>Meet with our team to discuss your experience and goals.</p>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <h3>Background Check</h3>
                                    <p>Complete required background screening process.</p>
                                </div>
                                <div className="step">
                                    <div className="step-number">4</div>
                                    <h3>Onboarding</h3>
                                    <p>Complete orientation and required training.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <div className="card reveal">
                            <div className="contact-grid">
                                <div className="contact-info">
                                    <h2>Contact Information</h2>
                                    <p>For employment opportunities, please contact our HR department:</p>
                                    <div className="contact-details">
                                        <p>Phone: (614) 868-3225</p>
                                        <p>Fax: (614) 868-3437</p>
                                        <p>Address: 639 S. Hamilton Road, Whitehall, Ohio 43213</p>
                                    </div>
                                    <div className="cta-buttons">
                                        <Link to="/contact" className="btn btn-primary">
                                            Contact Us
                                        </Link>
                                        <a href={require('./docs/application.pdf')} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                            Download Application
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </RouteTransition>
    ); 
};

export default Prospective;
