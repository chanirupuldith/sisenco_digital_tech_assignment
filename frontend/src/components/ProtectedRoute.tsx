import { Navigate, Outlet } from 'react-router-dom';
import { getStoredUser } from '../services/authService';

const ProtectedRoute = () => {
    const auth = getStoredUser();

    return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;