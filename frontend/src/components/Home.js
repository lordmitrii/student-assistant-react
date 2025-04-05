import { useEffect, useState } from "react";
import api from "../services/api";

const Home = ({ user }) => {
  const [deadlines, setDeadlines] = useState([]);
  const [grades, setGrades] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/news/latest/").then((res) => setNews(res.data));
    if (user) {
      api.get("/assignments/upcoming/").then((res) => setDeadlines(res.data));
      api.get("/grades/recent/").then((res) => setGrades(res.data));
    }}, [user]);

  return (
    <div className="row">
      <div className="col-12 mb-3"></div>
      {/* Deadlines */}
      <div className="col-md-6 mb-3">
        <div className="card shadow-lg h-100">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Upcoming Deadlines</h5>
          </div>
          <div className="card-body">
            {deadlines.length ? (
              <ul className="list-group">
                {deadlines.map((d) => (
                  <li
                    key={d.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{d.name}</strong>
                      <div className="text-muted">Course: {d.course_name}</div>
                      <div className="text-muted">
                        Graded: {d.graded ? "✅ Yes" : "❌ No"}
                      </div>
                    </div>
                    <span
                      className={`badge ${getDeadlineBadge(d.remaining_days)}`}
                    >
                      {new Date(d.deadline).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No upcoming deadlines.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Grades */}
      <div className="col-md-6 mb-3">
        <div className="card shadow-lg h-100">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Recent Grades</h5>
          </div>
          <div className="card-body">
            {grades.length ? (
              <ul className="list-group">
                {grades.map((g) => (
                  <li
                    key={g.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{g.course_name}</strong>
                      <div className="text-muted">
                        Assignment:{" "}
                        {g.assignment_name || "No linked assignment"}
                      </div>
                      <div className="text-muted">
                        Date: {new Date(g.date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge ${getGradeBadge(g.grade)}`}>
                      {g.grade.toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No recent grades.</p>
            )}
          </div>
        </div>
      </div>

      {/* News */}
      <div className="col-12 mt-3">
        <div className="card shadow-lg">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Latest News</h5>
          </div>
          <div className="card-body">
            {news.length ? (
              <ul className="list-group">
                {news.map((n) => (
                  <li key={n.id} className="list-group-item">
                    <h6>{n.title}</h6>
                    <p className="text-muted">
                      {new Date(n.date_posted).toLocaleDateString()}
                    </p>
                    <p>{n.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No news at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDeadlineBadge = (days) => {
  if (days < 1) return "bg-danger";
  if (days < 7) return "bg-warning";
  return "bg-success";
};

const getGradeBadge = (grade) => {
  if (grade >= 70) return "bg-success";
  if (grade >= 50) return "bg-warning";
  return "bg-danger";
};

export default Home;
