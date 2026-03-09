import { Navigate, Outlet } from 'react-router-dom';
import { getStoredUser } from '../services/authService';

/**
 * Route guard component that protects private pages.
 *
 * Checks for a valid stored authentication token.
 * If authenticated, renders the child routes via `<Outlet />`.
 * Otherwise, redirects the user to the login page.
 */
const ProtectedRoute = () => {
  const auth = getStoredUser();

  return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
