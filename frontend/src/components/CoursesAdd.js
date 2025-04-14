import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const CoursesAdd = ({ edit }) => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!edit) {
      setLoading(false);
      return;
    }
    api
      .get(`/courses/${courseSlug}/modify`)
      .then((res) => {
        setCourseName(res.data.course_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load course.");
        setLoading(false);
      });
  }, [courseSlug, edit]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (edit) {
        const res = await api.patch(`/courses/${courseSlug}/modify`, {
          course_name: courseName,
        });

        if (res.status === 200 || res.status === 201) {
          navigate("/courses");
        }
      } else {
        const res = await api.post(`/courses/${courseSlug}/modify`, {
          course_name: courseName,
        });

        if (res.status === 200 || res.status === 201) {
          navigate("/courses");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error occured. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">{edit ? "Edit" : "Add"} Course</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="courseName" className="form-label">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            className="form-control"
            value={courseName}
            placeholder="Enter course name"
            onChange={(e) => setCourseName(e.target.value)}
            required
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

export default CoursesAdd;
