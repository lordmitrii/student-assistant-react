import { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const GradesAdd = ({ edit }) => {
  const { courseSlug, gradeId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState("");
  const [credits, setCredits] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [course, setCourse] = useState(courseSlug || "");
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseSlug) {
      api.get("/courses/").then((res) => setCourses(res.data));
    } else {
      api.get(`/courses/${courseSlug}/assignments/`).then((res) => setAssignments(res.data.assignments));
    }

    if (edit) {
      api
        .get(`/courses/grades/${gradeId}/modify`)
        .then((res) => {
          const data = res.data;
          setGrade(data.grade);
          setAssignment(data.assignment);
          setCredits(data.credits);
          setDate(data.date.slice(0, 10));
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
  }, [gradeId]);

  useEffect(() => {
    if (course) {
      api.get(`/courses/${course}/assignments/`).then((res) => {
        setAssignments(res.data.assignments);
      });
    } else {
      setAssignments([]);
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      grade,
      assignment,
      credits,
      date,
      note,
      course_slug: course,
    };

    try {
      const url = edit
        ? `/courses/grades/${gradeId}/modify/`
        : `/courses/grades/${gradeId}/modify/`;
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
      <h3 className="mb-4">{edit ? "Edit" : "Add"} Grade</h3>

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
          <label className="form-label">Assignment</label>
          <select
            className="form-select"
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Grade</label>
            <input
              type="number"
              className="form-control"
              min={0}
              max={100}
              value={grade}
              placeholder="Enter grade in percentage"
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Credits</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={credits || 10}
              onChange={(e) => setCredits(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            onClick={() => navigate(`/courses`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GradesAdd;
