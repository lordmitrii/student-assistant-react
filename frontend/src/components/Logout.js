import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Logout = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser().then(() => {
      navigate("/login");
    });
  }, [logoutUser, navigate]);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
