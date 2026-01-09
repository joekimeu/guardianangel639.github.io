import React, { createContext, useState, useEffect } from 'react';
import { useNotifications, NOTIFICATION_TYPES } from '../components/NotificationSystem';
import { auth as authService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // Initialize auth state from localStorage
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token && user ? {
            token,
            user: JSON.parse(user),
            is2FAVerified: localStorage.getItem('is2FAVerified') === 'true'
        } : {};
    });
    
    const { addNotification } = useNotifications();

    // Persist auth state changes to localStorage
    useEffect(() => {
        if (auth?.token) {
            localStorage.setItem('token', auth.token);
            localStorage.setItem('user', JSON.stringify(auth.user));
            localStorage.setItem('is2FAVerified', auth.is2FAVerified || false);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('is2FAVerified');
        }
    }, [auth]);

    // Verify token periodically
    useEffect(() => {
        if (!auth?.token) return;

        const verifyToken = async () => {
            try {
                await authService.verifyToken();
            } catch (error) {
                // Token is invalid or expired
                handleLogout('Your session has expired. Please sign in again.');
            }
        };

        // Verify immediately and then every 5 minutes
        verifyToken();
        const interval = setInterval(verifyToken, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [auth?.token]);

    // Monitor for security events
    useEffect(() => {
        if (!auth?.token) return;

        const handleSecurityEvent = (event) => {
            switch (event.type) {
                case 'passwordChanged':
                    handleLogout('Your password was changed. Please sign in again.');
                    break;
                case 'accountLocked':
                    handleLogout('Your account has been locked. Please contact support.');
                    break;
                case 'multipleLogins':
                    addNotification({
                        type: NOTIFICATION_TYPES.SECURITY,
                        title: 'Security Alert',
                        message: 'Your account was accessed from another device.',
                        persistent: true,
                        action: {
                            label: 'Sign Out All Devices',
                            onClick: () => handleGlobalLogout()
                        }
                    });
                    break;
                default:
                    break;
            }
        };

        // Subscribe to security events (implementation depends on your event system)
        // securityEventEmitter.on('securityEvent', handleSecurityEvent);
        // return () => securityEventEmitter.off('securityEvent', handleSecurityEvent);
    }, [auth?.token]);

    const handleLogout = async (message) => {
        try {
            if (auth?.token) {
                await authService.signOut();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuth({});
            if (message) {
                addNotification({
                    type: NOTIFICATION_TYPES.INFO,
                    title: 'Signed Out',
                    message,
                    duration: 5000
                });
            }
        }
    };

    const handleGlobalLogout = async () => {
        try {
            await authService.signOutAll();
            setAuth({});
            addNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                title: 'Success',
                message: 'Signed out from all devices.',
                duration: 5000
            });
        } catch (error) {
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Error',
                message: 'Failed to sign out from all devices.',
                duration: 5000
            });
        }
    };

    const updateUser = (updates) => {
        setAuth(prev => ({
            ...prev,
            user: {
                ...prev.user,
                ...updates
            }
        }));
    };

    const verify2FA = () => {
        setAuth(prev => ({
            ...prev,
            is2FAVerified: true
        }));
    };

    const contextValue = {
        auth,
        setAuth,
        updateUser,
        verify2FA,
        handleLogout,
        handleGlobalLogout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
