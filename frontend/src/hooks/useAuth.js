import { useState, useEffect } from 'react';
import { getCSRF, fetchUser, logout as apiLogout, login as apiLogin } from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthUser = async () => {
    try {
      await getCSRF();
      const res = await fetchUser();
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username, password) => {
    try {
      await getCSRF(); // just in case
      const res = await apiLogin(username, password);
      if (res.data.status === "ok") {
        setUser(res.data.user);
        return { success: true };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Login error" };
    }
  };

  const logoutUser = async () => {
    await apiLogout();
    setUser(null);
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  return { user, loading, error, loginUser, logoutUser };
};

export default useAuth;
