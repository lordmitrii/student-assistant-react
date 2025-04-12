import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const AssignmentAdd = ({ edit }) => {
  const { courseSlug, assignmentId } = useParams(); 
  const navigate = useNavigate();

  const [assignmentName, setAssignmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!edit) {
      setLoading(false);
      return;
    }
    api.get(`/courses/assignments/${assignmentId}/modify`)
      .then((res) => {
        setAssignmentName(res.data.name);
        setLoading(false);
      })  
      .catch((err) => {
        console.error(err);
        setError("Failed to load assignment.");
        setLoading(false);
      });
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (edit) {
        const res = await api.patch(`/courses/assignments/${assignmentId}/modify/`, {
          name: assignmentName,
        });

        if (res.status === 201 || res.status === 200) {
          navigate("/courses");
        }
      }
      else {
        const res = await api.post(`/courses/assignments/${assignmentId}/modify/`, {
          name: assignmentName,
          course_slug: courseSlug, 
          deadline: new Date().toISOString(),
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
      <h3 className="mb-4">
        {edit ? "Edit" : "Add"} Assignment
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="assignment" className="form-label">
            Assignment
          </label>
          <input
            type="text"
            id="assignment"
            className="form-control"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
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

export default AssignmentAdd;
