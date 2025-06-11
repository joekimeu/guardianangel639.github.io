import React, { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './contact.css';

const Contact = () => {
    const { darkMode } = useDarkMode();
    useRevealAnimations();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        
        // Simulate form submission
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <RouteTransition>
            <div className={`contact-page ${darkMode ? 'dark-theme' : 'light-theme'}`}>
                <section className="hero">
                    {/* <div className="hero-image">
                        <img 
                            src={require('./docs/Images/n3.png')} 
                            alt="Healthcare professionals"
                            className="hero-bg-image"
                        />
                    </div> */}
                    <div className="hero-overlay"></div>
                    <div className="hero-content reveal">
                        <h1>Contact Us</h1>
                        <p className="subtitle">We're Here to Help</p>
                    </div>
                </section>

                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info-section reveal">
                            <h2>Get in Touch</h2>
                            <br />
                            <div className="contact-list">
                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="contact-text">
                                        <strong>Address:</strong><br />
                                        639 S. Hamilton Road<br />
                                        Whitehall, Ohio 43213
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div className="contact-text">
                                        <strong>Phone:</strong><br />
                                        <a href="tel:+16148683225" className="contact-link">(614) 868-3225</a><br /> 
                                        <a href="tel:+16147178151" className="contact-link">(614) 717-8151</a>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="contact-text">
                                        <strong>Fax:</strong><br />
                                        (614) 868-3437
                                    </div>
                                </div>
                                <div className="map-container">
                                    <iframe
                                        title="Office Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.5463474497454!2d-82.91744548429787!3d39.97559897941771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883862d86ecf05c7%3A0x4c6c8c37c3b937e8!2s639%20S%20Hamilton%20Rd%2C%20Whitehall%2C%20OH%2043213!5e0!3m2!1sen!2sus!4v1645564457889!5m2!1sen!2sus"
                                        className="map-frame"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section reveal">
                            {/* <div className="form-image">
                                <img 
                                    src={require('./docs/Images/n11.png')} 
                                    alt="Contact us"
                                    loading="lazy"
                                />
                            </div> */}
                            <h2>Send Us a Message</h2>
                            <br />
                            {status === 'success' && (
                                <div className="success-message">
                                    Thank you for your message! We'll get back to you soon.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="form-control"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`submit-button ${status === 'sending' ? 'loading' : ''}`}
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </RouteTransition>
    );
};

export default Contact;
