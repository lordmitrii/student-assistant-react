import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Accordion from "../components/Accordion";

const Grades = () => {
  const [grades, setGrades] = useState({});
  const [average, setAverage] = useState(null);
  const [allGradesView, setAllGradesView] = useState(true);
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (courseSlug) {
      setAllGradesView(false);
      api.get(`/courses/${courseSlug}/grades/`).then((res) => {
        setGrades(res.data.grades || []);
        setAverage(res.data.average || null);
      });
    } else {
      setAllGradesView(true);
      api.get(`/courses/grades/`).then((res) => {
        setGrades(res.data.grades || {});
        setAverage(res.data.average || null);
      });
    }
  }, [courseSlug]);

  const handleAddGrade = () => {
    if (courseSlug) {
      navigate(`/courses/${courseSlug}/grades/add/`);
    } else {
      navigate("/courses/grades/add");
    }
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;

    try {
      await api.delete(`/courses/grades/${gradeId}/modify/`);

      if (courseSlug) {
        const res = await api.get(`/courses/${courseSlug}/grades/`);
        setGrades(res.data.grades || []);
        setAverage(res.data.average || null);
      } else {
        const res = await api.get(`/courses/grades/`);
        setGrades(res.data.grades || {});
        setAverage(res.data.average || null);
      }
    } catch (err) {
      console.error("Failed to delete grade:", err);
      alert("Something went wrong while deleting the grade.");
    }
  };

  const renderBody = (grade) => (
    <>
      <p>Credits: {grade.credits}</p>
      <p>
        Assignment:{" "}
        {grade.assignment_name || (
          <span className="text-muted">No assignment linked</span>
        )}
      </p>
      <p>Note: {grade.note}</p>
      <div className="mt-3 d-flex gap-2">
        <Link
          className="btn btn-sm btn-warning"
          to={`/courses/grades/${grade.id}/edit`}
        >
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(grade.id)}
        >
          Delete
        </button>
      </div>
    </>
  );

  const renderHeader = (grade) => (
    <>
      <div className="col-md-6">Grade: {grade.grade}</div>
      <div className="col-md-5">
        Date: {new Date(grade.date).toLocaleDateString()}
      </div>
    </>
  );

  return (
    <div className="container mt-4">
      {/* Header buttons and average */}
      <div className="row mb-3">
        <div className="col-md-5 text-start">
          <button className="btn btn-secondary" onClick={handleAddGrade}>
            Add Grade
          </button>
        </div>
        <div className="col-md-2 text-center mt-1 mb-1">
          {average !== null && <>Average grade: {average.toFixed(2)}</>}
        </div>
        <div className="col-md-5 text-end">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </button>
        </div>
      </div>
      {/* Grade display */}
      {allGradesView ? (
        Object.keys(grades).length ? (
          Object.entries(grades).map(([courseSlug, grades], i) =>
            !!grades.length && (
              <div className="card mb-3" key={i}>
                <div className="card-header">
                  <h5 className="mb-0">{grades[0].course_name}</h5>
                </div>
                <div className="card-body">
                  <div className="accordion" id={`acc-${i}`}>
                    <Accordion
                      items={grades}
                      parentId={`acc-${i}`}
                      renderHeader={renderHeader}
                      renderBody={renderBody}
                    />
                  </div>
                </div>
              </div>
            ),
          )
        ) : (
          <p className="text-muted">No grades available.</p>
        )
      ) : grades.length ? (
        <div className="accordion" id="gradesAccordion">
          <Accordion
            items={grades}
            parentId={`gradesAccordion`}
            renderHeader={renderHeader}
            renderBody={renderBody}
          />
        </div>
      ) : (
        <p className="text-muted">No grades available for this course.</p>
      )}
    </div>
  );
};

export default Grades;
