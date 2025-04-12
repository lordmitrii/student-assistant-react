import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await login(username, password); 
    navigate("/");
  };

  const BACKEND_BASE_URL =  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const GOOGLE_LOGIN_URL = `${BACKEND_BASE_URL}/google/login/`;

  console.log(GOOGLE_LOGIN_URL)
  const handleGoogleAuth = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };


  return (
    <div className="container-fluid custom-container">
      <div className="row justify-content-center">
          <div className="col-md-6">
              <div className="card">
                  <div className="card-header">
                      <h2 className="text-center">Log In</h2>
                  </div>
                  <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
      
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="submit">
                          Log In
                        </button>
                      </div>
                    </form>
                    <hr />
                    <div className="d-grid gap-2 mt-3">
                        <button className="btn btn-outline-dark" onClick={handleGoogleAuth}>
                            <img className="google-icon" src="/google-icon.png" alt="Google" />
                            Sign in with Google
                        </button>
                    </div>
                    
                    <div className="mt-3 text-center">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};

export default Login;
