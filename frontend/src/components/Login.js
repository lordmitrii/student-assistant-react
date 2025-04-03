import React, { useState } from 'react';
import {getCSRF, login} from '../services/api';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await getCSRF();

      const response = await login(username, password);

      if (response.data.status === 'ok') {
        setUser(response.data.user);
      }

      window.location.href = '/';
    } catch (err) {
        console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4">Log In</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
