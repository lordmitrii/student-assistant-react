import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const GradesAdd = ({ edit }) => {
  const { courseSlug, gradeId } = useParams();
  const navigate = useNavigate();

  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!edit) {
      setLoading(false);
      return;
    }
    api
      .get(`/courses/grades/${gradeId}/modify`)
      .then((res) => {
        setGrade(res.data.grade);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load grade.");
        setLoading(false);
      });
  }, [gradeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (edit) {
        const res = await api.patch(`/courses/grades/${gradeId}/modify/`, {
          grade: grade,
        });

        if (res.status === 201 || res.status === 200) {
          navigate("/courses");
        }
      } else {
        const res = await api.post(`/courses/grades/${gradeId}/modify/`, {
          grade: grade,
          course_slug: courseSlug,
          date: new Date().toISOString(),
        });

        if (res.status === 201 || res.status === 200) {
          navigate("/courses");
        }
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
        <div className="mb-3">
          <label htmlFor="grade" className="form-label">
            Grade
          </label>
          <input
            type="text"
            id="grade"
            className="form-control"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default GradesAdd;
