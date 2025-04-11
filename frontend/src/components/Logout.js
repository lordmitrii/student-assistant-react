import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
    navigate("/login");
    });
  }, [logout, navigate]);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
