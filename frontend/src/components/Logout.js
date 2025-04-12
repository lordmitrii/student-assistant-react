import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
