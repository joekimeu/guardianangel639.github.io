import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications, NOTIFICATION_TYPES } from './NotificationSystem';
import { auth } from '../services/api';

const RequireAuth = ({ allowedRoles = [] }) => {
    const { auth: authContext, setAuth } = useAuth();
    const location = useLocation();
    const { addNotification } = useNotifications();

    // Verify token on mount and periodically
    useEffect(() => {
        const verifyToken = async () => {
            if (!authContext?.token) return;

            try {
                await auth.verifyToken();
            } catch (error) {
                // Token is invalid or expired
                setAuth({});
                addNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    title: 'Authentication Error',
                    message: 'Your session has expired. Please sign in again.',
                    duration: 5000
                });
            }
        };

        verifyToken();
        const interval = setInterval(verifyToken, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, [authContext?.token]);

    // Check for authentication
    if (!authContext?.token) {
        addNotification({
            type: NOTIFICATION_TYPES.WARNING,
            title: 'Authentication Required',
            message: 'Please sign in to access this page.',
            duration: 5000
        });

        return <Navigate 
            to="/signin" 
            state={{ from: location, message: 'Please sign in to continue.' }} 
            replace 
        />;
    }

    // Check for 2FA if required
    if (authContext.requires2FA && !authContext.is2FAVerified) {
        addNotification({
            type: NOTIFICATION_TYPES.SECURITY,
            title: 'Two-Factor Authentication Required',
            message: 'Please set up two-factor authentication to continue.',
            duration: 5000
        });

        return <Navigate 
            to="/2fa-setup" 
            state={{ from: location }} 
            replace 
        />;
    }

    // Check for required roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(authContext.user?.position)) {
        addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title: 'Access Denied',
            message: 'You do not have permission to access this page.',
            duration: 5000
        });

        return <Navigate 
            to="/unauthorized" 
            state={{ 
                from: location,
                errorType: 'INSUFFICIENT_PERMISSIONS',
                message: 'You do not have the required permissions to access this resource.'
            }} 
            replace 
        />;
    }

    // Check for account status
    if (authContext.user?.status === 'inactive') {
        addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title: 'Account Inactive',
            message: 'Your account is currently inactive. Please contact your administrator.',
            duration: 5000
        });

        return <Navigate 
            to="/unauthorized" 
            state={{ 
                from: location,
                errorType: 'ACCOUNT_INACTIVE',
                message: 'Your account is currently inactive.'
            }} 
            replace 
        />;
    }

    // Check for suspended account
    if (authContext.user?.status === 'suspended') {
        addNotification({
            type: NOTIFICATION_TYPES.SECURITY,
            title: 'Account Suspended',
            message: 'Your account has been suspended. Please contact your administrator.',
            duration: 5000
        });

        return <Navigate 
            to="/unauthorized" 
            state={{ 
                from: location,
                errorType: 'ACCOUNT_SUSPENDED',
                message: 'Your account has been suspended.'
            }} 
            replace 
        />;
    }

    // Log access attempts for sensitive routes
    useEffect(() => {
        const sensitiveRoutes = ['/employees', '/operating-committee', '/prospective'];
        if (sensitiveRoutes.some(route => location.pathname.startsWith(route))) {
            console.log(`Sensitive route access: ${location.pathname} by ${authContext.user?.username}`);
            // You could also send this to your security monitoring system
        }
    }, [location.pathname]);

    // All checks passed, render the protected route
    return <Outlet />;
};

export default RequireAuth;
