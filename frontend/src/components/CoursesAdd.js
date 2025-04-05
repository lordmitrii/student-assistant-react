import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CoursesAdd = () => {
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/courses/", {
        course_name: courseName,
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/courses");
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Add Course</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="courseName" className="form-label">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Course
        </button>
      </form>
    </div>
  );
};

export default CoursesAdd;
