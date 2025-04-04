import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const { isAuth } = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/login" />;

};

export default PrivateRoute;