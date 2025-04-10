import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const GradesAdd = () => {
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const { courseSlug } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/courses/grades/modify/", {
        grade: grade,
        course_slug: courseSlug, 
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/courses");
      }
    } catch (err) {
      console.error("Error creating grade:", err);
      setError("Failed to create grade. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Add Grade</h3>

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
          Save Grade
        </button>
      </form>
    </div>
  );
};

export default GradesAdd;
