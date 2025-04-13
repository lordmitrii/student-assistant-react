import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const BACKEND_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const GOOGLE_LOGIN_URL = `${BACKEND_BASE_URL}/google/login/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await login(username, password);
    navigate("/");
  };

  return (
    <AuthForm
      title="Log In"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      googleAuthHandler={() => (window.location.href = GOOGLE_LOGIN_URL)}
      googleAuthText="Sign in with Google"
      bottomText={
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      }
    />
  );
};

export default Login;
