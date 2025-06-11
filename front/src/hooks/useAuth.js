import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const isAuthenticated = Boolean(context.auth?.token);
    
    const hasRole = (requiredRoles) => {
        if (!isAuthenticated || !context.auth?.user?.position) {
            return false;
        }

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        return requiredRoles.includes(context.auth.user.position);
    };

    const isAdmin = () => {
        return hasRole(['Administrator']);
    };

    const isDirector = () => {
        return hasRole(['Director, Clinical Services']);
    };

    const isManager = () => {
        return hasRole(['Administrator', 'Director, Clinical Services', 'Chief Secretary']);
    };

    const can = (action) => {
        const permissions = {
            'manage_employees': () => isManager(),
            'view_all_records': () => isManager(),
            'edit_records': () => isManager(),
            'approve_time': () => isManager(),
            'manage_system': () => isAdmin(),
            'view_reports': () => isManager(),
            'manage_trainings': () => isDirector() || isAdmin(),
            'clock_in_out': () => isAuthenticated,
            'view_own_records': () => isAuthenticated
        };

        return permissions[action] ? permissions[action]() : false;
    };

    const getFullName = () => {
        if (!context.auth?.user) return '';
        return `${context.auth.user.firstname} ${context.auth.user.lastname}`;
    };

    const getUserInfo = () => {
        return context.auth?.user || null;
    };

    const isTokenExpired = () => {
        const token = context.auth?.token;
        if (!token) return true;

        try {
            const [, payload] = token.split('.');
            const decodedPayload = JSON.parse(atob(payload));
            const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
            
            return Date.now() >= expirationTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const refreshToken = async () => {
        try {
            if (!context.auth?.token || !isTokenExpired()) return;

            const response = await fetch('/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${context.auth.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to refresh token');

            const data = await response.json();
            context.setAuth(prev => ({
                ...prev,
                token: data.token
            }));

            return data.token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            context.handleLogout('Session expired. Please sign in again.');
            throw error;
        }
    };

    const requiresPasswordChange = () => {
        return context.auth?.user?.requiresPasswordChange || false;
    };

    const is2FAEnabled = () => {
        return context.auth?.user?.is2FAEnabled || false;
    };

    const is2FAVerified = () => {
        return context.auth?.is2FAVerified || false;
    };

    const getLastLogin = () => {
        return context.auth?.user?.lastLogin || null;
    };

    const getAccountStatus = () => {
        return context.auth?.user?.status || 'inactive';
    };

    return {
        ...context,
        isAuthenticated,
        hasRole,
        isAdmin,
        isDirector,
        isManager,
        can,
        getFullName,
        getUserInfo,
        isTokenExpired,
        refreshToken,
        requiresPasswordChange,
        is2FAEnabled,
        is2FAVerified,
        getLastLogin,
        getAccountStatus
    };
};

// Export both named and default for backward compatibility
export default useAuth;
