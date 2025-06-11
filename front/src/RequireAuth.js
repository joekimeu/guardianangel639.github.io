import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // Check if user is authenticated
    if (!auth?.user) {
        // Not logged in, redirect to login page with return url
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Check if user has required role
    const hasRequiredRole = auth?.roles?.find(role => allowedRoles?.includes(role));
    
    if (!hasRequiredRole) {
        // Logged in but role not authorized, redirect to unauthorized page
        // Keep the attempted URL in state for potential future use
        return <Navigate to="/unauthorized" state={{ from: location, attemptedRole: allowedRoles[0] }} replace />;
    }

    // Authorized, render child components
    return <Outlet />;
};

export default RequireAuth;
