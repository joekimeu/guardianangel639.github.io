import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './missing.css';

const Missing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-redirect countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate('/');
        }
    }, [countdown, navigate]);

    // Suggested pages based on the current path
    const getSuggestedPages = () => {
        const path = location.pathname.toLowerCase();
        const suggestions = [];

        if (path.includes('employee') || path.includes('user')) {
            suggestions.push(
                { title: 'All Employees', path: '/employees' },
                { title: 'Search Employees', path: '/search' }
            );
        }
        else if (path.includes('time') || path.includes('clock')) {
            suggestions.push(
                { title: 'Clock In/Out', path: '/clockinout' },
                { title: 'Punch History', path: '/punchhistory' }
            );
        }
        else if (path.includes('train')) {
            suggestions.push(
                { title: 'Training Resources', path: '/trainings' },
                { title: 'Documents', path: '/documents' }
            );
        }
        else if (path.includes('contact') || path.includes('support')) {
            suggestions.push(
                { title: 'Contact Us', path: '/contact' },
                { title: 'About Us', path: '/about' }
            );
        }

        // Always include these common pages
        suggestions.push(
            { title: 'Home', path: '/' },
            { title: 'Contact Support', path: '/contact' }
        );

        return suggestions;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="missing">
            <div className="missing-content">
                <div className="error-code">404</div>
                
                <h1>Page Not Found</h1>
                
                <p className="error-message">
                    We couldn't find the page you're looking for:
                    <br />
                    <code>{location.pathname}</code>
                </p>

                <div className="search-section">
                    <h2>Looking for something specific?</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search our website..."
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>
                </div>

                <div className="suggestions-section">
                    <h2>You might be looking for:</h2>
                    <div className="suggested-pages">
                        {getSuggestedPages().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(page.path)}
                                className="suggestion-link"
                            >
                                {page.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="actions">
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go to Home Page
                    </button>
                </div>

                <div className="help-section">
                    <h3>Need Help?</h3>
                    <p>
                        If you can't find what you're looking for, our support team is here to help:
                    </p>
                    <ul>
                        <li>Call us at (614) 868-3225</li>
                        <li>Email us at support@guardianangelha.com</li>
                        <li>Visit our <button onClick={() => navigate('/contact')} className="link-button">Contact Page</button></li>
                    </ul>
                </div>

                <div className="redirect-notice">
                    Redirecting to home page in {countdown} seconds...
                </div>
            </div>
        </div>
    );
};

export default Missing;
