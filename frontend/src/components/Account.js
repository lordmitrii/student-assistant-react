import React from "react";
import { Link } from "react-router-dom";

const Account = ({ user }) => {
  if (!user) {
    return (
      <p className="text-center mt-5 text-muted">
        You must be logged in to view this page.
      </p>
    );
  }

  const formatDate = (isoStr, withTime = false) => {
    const options = withTime
      ? {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }
      : { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow">
            <div className="card-body text-center">
              <div className="mb-4">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center profile-icon"
                  style={{ width: "80px", height: "80px", fontSize: "36px" }}
                >
                  {user.username.slice(0, 1).toUpperCase()}
                </div>
              </div>
              <h4 className="mb-0">{user.username}</h4>
              <p className="text-muted">{user.email}</p>
              <div className="d-grid gap-2 mt-4">
                <Link to="/logout" className="btn btn-danger">
                  <i className="bi bi-box-arrow-right me-2" />
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Account Details</h5>
            </div>
            <div className="card-body">
              <Detail label="Username" value={user.username} />
              <Detail label="Email" value={user.email} />
              <Detail
                label="Account Created"
                value={formatDate(user.date_joined)}
              />
              <Detail
                label="Last Login"
                value={formatDate(user.last_login, true)}
              />
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="row">
            <QuickCard
              icon="bi-book"
              title="My Courses"
              text="View and manage your courses"
              link="/courses"
            />
            <QuickCard
              icon="bi-clipboard-check"
              title="Assignments"
              text="Track your upcoming deadlines"
              link="/assignments"
            />
          </div>

          <div className="card shadow-lg mb-4">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-primary mx-auto mb-3 d-flex align-items-center justify-content-center account-icon"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-mortarboard text-white fs-4" />
              </div>
              <h5>Grades Overview</h5>
              <p className="text-muted">
                Check your academic performance and GPA
              </p>
              <div className="d-grid">
                <Link to="/grades" className="btn btn-primary">
                  View Grades <i className="bi bi-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <>
    <div className="row">
      <div className="col-sm-3">
        <p className="mb-0 fw-bold">{label}</p>
      </div>
      <div className="col-sm-9">
        <p className="text-muted mb-0">{value}</p>
      </div>
    </div>
    <hr />
  </>
);

const QuickCard = ({ icon, title, text, link }) => (
  <div className="col-md-6 mb-4">
    <div className="card shadow-lg h-100">
      <div className="card-body text-center">
        <div
          className="rounded-circle bg-primary mx-auto mb-3 d-flex align-items-center justify-content-center account-icon"
          style={{ width: "60px", height: "60px" }}
        >
          <i className={`bi ${icon} text-white fs-4`} />
        </div>
        <h5>{title}</h5>
        <p className="text-muted">{text}</p>
        <div className="d-grid">
          <Link to={link} className="btn btn-primary">
            Go to {title} <i className="bi bi-arrow-right ms-2" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Account;
