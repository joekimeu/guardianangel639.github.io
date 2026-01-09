import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { auth, handleApiError } from './services/api';
import './signIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get the page user was trying to access
    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate input
            if (!formData.username.trim() || !formData.password.trim()) {
                throw new Error('Username and password are required');
            }

            // Attempt sign in
            const response = await auth.signIn(formData);
            
            // Update auth context
            setAuth({
                user: response.user,
                token: response.token
            });

            // Clear form
            setFormData({
                username: '',
                password: ''
            });

            // Navigate to original destination or home
            navigate(from, { replace: true });
        } catch (err) {
            const errorDetails = handleApiError(err);
            
            switch (errorDetails.type) {
                case 'AUTH_ERROR':
                    setError(errorDetails.message || 'Invalid username or password');
                    break;
                case 'RATE_LIMIT':
                    setError(errorDetails.message || 'Too many attempts. Please try again later.');
                    break;
                case 'NETWORK_ERROR':
                    setError(errorDetails.message || 'Unable to connect to server. Please check your internet connection.');
                    break;
                case 'CLIENT_ERROR':
                    setError(errorDetails.message || 'An unexpected error client occurred')
                default:
                    setError(errorDetails.message || 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sign-in">
            <div className="sign-in-content">
                <h1>Sign In</h1>
                <p className="welcome-text">Welcome back! Please sign in to continue.</p>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="sign-in-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                name="remember"
                            /> Remember me
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="help-text">
                    Having trouble signing in? Please contact your administrator or call our support team at (614) 868-3225.
                </div>
            </div>
        </div>
    );
};

export default SignIn;
