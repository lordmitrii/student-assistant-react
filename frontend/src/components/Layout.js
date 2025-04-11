import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  
  return ( 
  <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Student Assistant
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">
                My Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calculator">
                Grade Calculator
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={user ? "/account" : "/login"}>
                {user ? "Account" : "Log In"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main className="container mt-4">
      <Outlet />
    </main>
  </>
)};

export default Layout;
