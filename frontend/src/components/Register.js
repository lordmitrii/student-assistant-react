import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (username, password, password2) => {
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const registerRes = await register(username, password);
      const loginRes = await login(username, password);
      if (registerRes.status === 201 && loginRes.status === 200) {
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message || "Registration failed");
    }
  };

  const BACKEND_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const GOOGLE_LOGIN_URL = `${BACKEND_BASE_URL}/google/login/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await handleRegister(username, password, password2);
  };

  return (
    <AuthForm
      title="Register"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      password2={password2}
      setPassword2={setPassword2}
      showPassword2={true}
      error={error}
      googleAuthHandler={() => (window.location.href = GOOGLE_LOGIN_URL)}
      googleAuthText="Sign up with Google"
      bottomText={
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      }
    />
  );
};

export default Register;
