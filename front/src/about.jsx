import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './about.css';

const About = () => {
    const { darkMode } = useDarkMode();
    useRevealAnimations();

    return (
        <RouteTransition>
            <div className={`about ${darkMode ? 'dark-theme' : 'light-theme'}`}>
                <section className="hero">
                    <div className="hero-image">
                        {/* <img 
                            src={require('./docs/Images/n10.jpg')} 
                            alt="Healthcare team providing care"
                            className="hero-bg-image"
                        /> */}
                    </div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content reveal">
                        <h1>About Guardian Angel Health Agency</h1>
                        <p className="subtitle">Dedicated to Providing Exceptional Healthcare Services</p>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="mission-vision reveal">
                            <div className="mission-content">
                                <h2>Our Mission & Vision</h2>
                                <br />
                                <div className="mission">
                                    <h3>Mission</h3>
                                    <p>
                                        To provide compassionate, high-quality healthcare services that enhance 
                                        the lives of our clients while maintaining their independence and dignity 
                                        in the comfort of their own homes.
                                    </p>
                                </div>
                                <br />
                                <div className="vision">
                                    <h3>Vision</h3>
                                    <p>
                                        To be the leading healthcare agency in Ohio, recognized for excellence 
                                        in home healthcare services and dedicated to improving the quality of 
                                        life for our clients and their families.
                                    </p>
                                </div>
                            </div>
                            <div className="mission-image">
                                <img 
                                    src={require('./docs/Images/n11.jpeg')} 
                                    alt="Healthcare professional with patient"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section surface-2">
                    <div className="container">
                        <div className="values-grid reveal">
                            <h2>Our Core Values</h2>
                            <div className="values">
                                <div className="value-card">
                                    <h3>Compassion</h3>
                                    <p>We provide care with kindness, empathy, and respect for all.</p>
                                </div>
                                <div className="value-card">
                                    <h3>Excellence</h3>
                                    <p>We strive for the highest standards in healthcare service delivery.</p>
                                </div>
                                <div className="value-card">
                                    <h3>Integrity</h3>
                                    <p>We conduct ourselves with honesty, transparency, and ethical behavior.</p>
                                </div>
                                <div className="value-card">
                                    <h3>Dedication</h3>
                                    <p>We are committed to the well-being and satisfaction of our clients.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section className="section">
                    <div className="container">
                    <div className="team-section reveal">
                        <h2>Meet Our Leadership</h2>
                        <p className="section-intro">
                            Our dedicated team of professionals brings decades of experience<br />
                            to ensure the highest quality of care for our clients.
                        </p>

                        <div className="team-member">
                            <div className="team-info">
                            <h3>Thomas Kamau, PhD, MPH, MBA</h3>
                            <p>
                                Thomas Kamau is the Founder and a current Board Member of Guardian Angel Health Agency. 
                                He also serves as an Associate Professor of Health Sciences at Ohio University in 
                                Athens, Ohio, where he coordinates the Health Services Administration Program, teaches 
                                courses in Health Service Administration. and has published research papers in 
                                epidemiology.
                            </p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="team-info">
                            <h3>Anne Mulama, MSN, RN</h3>
                            <p>
                                Anne Mulama brings 20 years of diverse nursing experience across
                                leading institutions including The Ohio State University,
                                Cleveland Clinic, OhioHealth, Mount Carmel Health Systems, and
                                Alta Bates Summit Medical in San Francisco. With a Master's in
                                Nursing, Anne’s clinical expertise ensures every patient receives
                                the highest standard of care.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </section> 
                */}

                <section className="cta-section reveal">
                    <div className="cta-background">
                        <img 
                            src={require('./docs/Images/n-old-bcouple-2.jpeg')} 
                            alt="Join our team"
                            loading="lazy"
                        />
                    </div>
                    <div className="container">
                        <h2>Join Our Team</h2>
                        <p>
                            We're always looking for dedicated healthcare professionals who share our 
                            commitment to providing exceptional care.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/prospective" className="btn btn-primary">View Opportunities</Link>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </section>
            </div>
        </RouteTransition>
    );
};

export default About;
