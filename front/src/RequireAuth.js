import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';

/**
 * Protect routes by username whitelist OR permission.
 *
 * allowedUsers: string[]  -> whitelist of usernames
 * requiredPermission: string -> uses useAuth().can(permission)
 */
const RequireAuth = ({ allowedUsers = [], requiredPermission = null }) => {
  const { auth, can } = useAuth();
  const location = useLocation();

  // Not signed in
  if (!auth?.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Permission-gated
  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Username-gated (legacy)
  if (allowedUsers.length && !allowedUsers.includes(auth.user.username)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
