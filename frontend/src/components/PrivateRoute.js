import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ user }) => {
  

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
