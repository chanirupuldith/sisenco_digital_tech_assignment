import { Navigate, Outlet } from 'react-router-dom';
import { getStoredUser } from '../services/authService';

const ProtectedRoute = () => {
    const auth = getStoredUser();

    // If there's no user/token in localStorage, redirect to login
    return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;