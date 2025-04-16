import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const AssignmentsAdd = ({ edit }) => {
  const { courseSlug, assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignmentName, setAssignmentName] = useState("");
  const [graded, setGraded] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");
  const [course, setCourse] = useState(courseSlug || "");

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseSlug) {
      api.get("/courses/").then((res) => setCourses(res.data));
    }

    if (edit) {
      api
        .get(`/courses/assignments/${assignmentId}/modify`)
        .then((res) => {
          const data = res.data;
          setAssignmentName(data.name);
          setGraded(data.graded);
          setDeadline(data.deadline.slice(0, 10));
          setNote(data.note);
          setCourse(data.course_slug || courseSlug || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load grade.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [assignmentId, courseSlug, edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: assignmentName,
      graded,
      deadline,
      note,
      course_slug: course,
    };

    try {
      const url = edit
        ? `/courses/assignments/${assignmentId}/modify/`
        : `/courses/assignments/${assignmentId}/modify/`;
      const method = edit ? api.patch : api.post;
      const res = await method(url, payload);
      if (res.status === 201 || res.status === 200) {
        navigate("/courses");
      }
    } catch (err) {
      console.error(err);
      setError("Error occurred. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">{edit ? "Edit" : "Add"} Assignment</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!courseSlug && (
          <div className="mb-3">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.course_slug} value={c.course_slug}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter assignment name"
            required
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
          >
          </input>
        </div>

        <div className="mb-3">
          <label className="form-label">Graded</label>
          {" "}
          <input
            type="checkbox"
            className="form-check-input"
            checked={graded}
            placeholder="Enter grade in percentage"
            onChange={(e) => setGraded(e.target.checked)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            className="form-control"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Note</label>
          <textarea
            className="form-control"
            value={note}
            placeholder="Add any relevant notes here"
            rows={1}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary me-2">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentsAdd;
