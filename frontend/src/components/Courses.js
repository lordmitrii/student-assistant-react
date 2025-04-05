import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      {/* Buttons */}
      <div className="row mb-3">
        <div className="col-md-4 text-start">
          <Link to="/courses/add" className="btn btn-secondary">
            Add Course
          </Link>
        </div>
        <div className="col-md-4 text-center">
          <Link to="/courses/grades" className="btn btn-light custom-outline me-4">
            View All Grades
          </Link>
          <Link to="/courses/assignments" className="btn btn-light custom-outline">
            View All Assignments
          </Link>
        </div>
        <div className="col-md-4" />
      </div>

      {/* Course Cards */}
      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <p className="text-muted">Loading courses...</p>
          </div>
        ) : courses.length ? (
          courses.map((course) => (
            <div key={course.id} className="col-md-12 mb-3">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{course.course_name}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="card-text">
                        Details about {course.course_name}
                      </p>
                      <p className="card-text">
                        Due Assignments: {course.due_assignments}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Average Grade:{" "}
                          {course.average_grade?.toFixed(2) || "0.00"}%
                        </small>
                      </p>
                    </div>
                    <div className="col-md-6 text-end">
                      <Link
                        to={`/courses/${course.slug}/grades`}
                        className="btn btn-info btn-sm me-2"
                      >
                        View Grades
                      </Link>
                      <Link
                        to={`/courses/${course.slug}/assignments`}
                        className="btn btn-info btn-sm me-2"
                      >
                        View Assignments
                      </Link>
                      <Link
                        to={`/courses/${course.slug}/edit`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/courses/${course.slug}/delete`}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted">No courses available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
