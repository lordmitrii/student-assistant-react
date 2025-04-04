import { useEffect } from 'react';
import { logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      setUser(null);
      navigate('/login');
    });
  }, [navigate, setUser]);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
