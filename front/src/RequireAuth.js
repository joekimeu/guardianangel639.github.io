import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';

/**
 * Protect routes by **username**.
 *
 * @param {string[]} allowedUsers – array of usernames allowed to see the child routes.
 *                                  Empty array ⇒ any signed-in user is allowed.
 */
const RequireAuth = ({ allowedUsers = [] }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // 1) Not signed in → redirect to sign-in
  if (!auth?.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2) Signed in but username not on the whitelist → unauthorized
  if (allowedUsers.length && !allowedUsers.includes(auth.user.username)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location, attemptedUser: auth.user.username }}
        replace
      />
    );
  }

  // 3) Authorized → render the nested routes
  return <Outlet />;
};

export default RequireAuth;
