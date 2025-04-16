// components/AuthForm.jsx
import React from "react";

const AuthForm = ({
  title,
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  password2,
  setPassword2,
  showPassword2 = false,
  error,
  googleAuthText,
  googleAuthHandler,
  bottomText,
}) => {
  return (
    <div className="container-fluid custom-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">{title}</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    placeholder="Enter username"
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
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {showPassword2 && (
                  <div className="mb-3">
                    <label className="form-label">Enter password again</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password2}
                      placeholder="Confirm password"
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit">
                    {title}
                  </button>
                </div>
              </form>

              <hr />
              <div className="d-grid gap-2 mt-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={googleAuthHandler}
                >
                  <img
                    className="google-icon"
                    src="/google-icon.png"
                    alt="Google"
                  />
                  {googleAuthText}
                </button>
              </div>

              {bottomText && (
                <div className="mt-3 text-center">{bottomText}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
