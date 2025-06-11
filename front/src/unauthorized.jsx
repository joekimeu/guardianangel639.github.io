import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './unauthorized.css';

const Unauthorized = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useAuth();
    const [countdown, setCountdown] = useState(10);

    // Get error details from location state
    const errorType = location.state?.errorType || 'UNAUTHORIZED';
    const errorMessage = location.state?.message || 'You do not have permission to access this page.';

    useEffect(() => {
        // Auto-redirect countdown
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleRedirect();
        }
    }, [countdown]);

    const handleRedirect = () => {
        switch (errorType) {
            case 'SESSION_EXPIRED':
                // Clear auth and redirect to login
                setAuth({});
                navigate('/signin', { 
                    state: { 
                        from: location.state?.from,
                        message: 'Your session has expired. Please sign in again.' 
                    }
                });
                break;
            case 'INVALID_TOKEN':
                // Clear auth and redirect to login
                setAuth({});
                navigate('/signin', {
                    state: {
                        from: location.state?.from,
                        message: 'Your authentication token is invalid. Please sign in again.'
                    }
                });
                break;
            case 'REQUIRES_2FA':
                // Redirect to 2FA setup
                navigate('/2fa-setup', {
                    state: { from: location.state?.from }
                });
                break;
            case 'INSUFFICIENT_PERMISSIONS':
                // Redirect to home page
                navigate('/', {
                    state: { message: 'Access denied due to insufficient permissions.' }
                });
                break;
            default:
                // Default redirect to home
                navigate('/');
        }
    };

    const getErrorTitle = () => {
        switch (errorType) {
            case 'SESSION_EXPIRED':
                return 'Session Expired';
            case 'INVALID_TOKEN':
                return 'Invalid Authentication';
            case 'REQUIRES_2FA':
                return 'Two-Factor Authentication Required';
            case 'INSUFFICIENT_PERMISSIONS':
                return 'Access Denied';
            default:
                return 'Unauthorized Access';
        }
    };

    const getErrorDescription = () => {
        switch (errorType) {
            case 'SESSION_EXPIRED':
                return 'Your session has timed out due to inactivity.';
            case 'INVALID_TOKEN':
                return 'Your authentication token is no longer valid.';
            case 'REQUIRES_2FA':
                return 'This action requires two-factor authentication to be set up.';
            case 'INSUFFICIENT_PERMISSIONS':
                return 'You do not have the required permissions to access this resource.';
            default:
                return errorMessage;
        }
    };

    const getActionButton = () => {
        switch (errorType) {
            case 'SESSION_EXPIRED':
            case 'INVALID_TOKEN':
                return (
                    <button 
                        onClick={() => navigate('/signin')}
                        className="btn btn-primary"
                    >
                        Sign In Again
                    </button>
                );
            case 'REQUIRES_2FA':
                return (
                    <button 
                        onClick={() => navigate('/2fa-setup')}
                        className="btn btn-primary"
                    >
                        Set Up 2FA
                    </button>
                );
            default:
                return (
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go to Home Page
                    </button>
                );
        }
    };

    const getHelpText = () => {
        switch (errorType) {
            case 'SESSION_EXPIRED':
            case 'INVALID_TOKEN':
                return 'For security reasons, your session has ended. Please sign in again to continue.';
            case 'REQUIRES_2FA':
                return 'Two-factor authentication adds an extra layer of security to your account.';
            case 'INSUFFICIENT_PERMISSIONS':
                return 'If you believe you should have access to this page, please contact your administrator.';
            default:
                return 'If you believe this is an error, please contact support.';
        }
    };

    return (
        <div className="unauthorized">
            <div className="error-container">
                <div className="error-icon">
                    {errorType === 'SESSION_EXPIRED' ? '⏰' : '🔒'}
                </div>
                
                <h1>{getErrorTitle()}</h1>
                <p className="error-description">{getErrorDescription()}</p>
                
                <div className="error-actions">
                    {getActionButton()}
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                    >
                        Go Back
                    </button>
                </div>

                <div className="help-text">
                    <p>{getHelpText()}</p>
                    <p>Need assistance? Contact support at (614) 868-3225</p>
                </div>

                <div className="redirect-notice">
                    Redirecting in {countdown} seconds...
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
