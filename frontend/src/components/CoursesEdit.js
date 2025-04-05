import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const CoursesEdit = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/courses/${courseSlug}/modify`)
      .then((res) => {
        setCourseName(res.data.course_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load course.");
        setLoading(false);
      });
  }, [courseSlug]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.patch(`/courses/${courseSlug}/modify`, {
        course_name: courseName,
      });
      if (res.status === 200) {
        navigate("/courses");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update course.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Edit Course</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="courseName" className="form-label">Course Name</label>
          <input
            type="text"
            id="courseName"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CoursesEdit;
