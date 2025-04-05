import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Grades = () => {
  const [gradesByCourse, setGradesByCourse] = useState({});
  const [courseGrades, setCourseGrades] = useState([]);
  const [overallAverage, setOverallAverage] = useState(null);
  const [courseAverage, setCourseAverage] = useState(null);
  const [allGradesView, setAllGradesView] = useState(true); 
  const { courseSlug } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (courseSlug) {
      setAllGradesView(false);
      api.get(`/courses/${courseSlug}/grades/`).then((res) => {
        setCourseGrades(res.data.grades || []);
        setCourseAverage(res.data.average || null);
      });
    } else {
      setAllGradesView(true);
      api.get(`/courses/grades/`).then((res) => {
        setGradesByCourse(res.data.grades_by_course || {});
        setOverallAverage(res.data.overall_average || null);
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

  return (
    <div className="container mt-4">
      {/* Header buttons and average */}
      <div className="row mb-3">
        <div className="col-md-5 text-start">
          <button className="btn btn-secondary" onClick={handleAddGrade}>
            Add Grade
          </button>
        </div>
        <div className="col-md-2 text-center custom-outline mt-1 mb-1">
          {allGradesView && overallAverage !== null && (
            <>Average grade: {overallAverage.toFixed(2)}</>
          )}
          {!allGradesView && courseAverage !== null && (
            <>Average grade: {courseAverage.toFixed(2)}</>
          )}
        </div>
        <div className="col-md-5 text-end">
          <button
            className="btn btn-secondary custom-outline me-4"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </button>
        </div>
      </div>

      {/* Grade display */}
      {allGradesView ? (
        Object.keys(gradesByCourse).length ? (
          Object.entries(gradesByCourse).map(([courseName, grades], i) =>
            grades.length ? (
              <div className="card mb-3" key={i}>
                <div className="card-header">
                  <h5 className="mb-0">{courseName}</h5>
                </div>
                <div className="card-body">
                  <Accordion grades={grades} parentId={`acc-${i}`} courseSlug={null} />
                </div>
              </div>
            ) : null
          )
        ) : (
          <p className="text-muted">No grades available.</p>
        )
      ) : courseGrades.length ? (
        <div className="accordion" id="gradesAccordion">
          <Accordion grades={courseGrades} parentId="gradesAccordion" courseSlug={courseSlug} />
        </div>
      ) : (
        <p className="text-muted">No grades available for this course.</p>
      )}
    </div>
  );
};

const Accordion = ({ grades, parentId, courseSlug }) => {
  return grades.map((grade, index) => {
    const collapseId = `${parentId}-collapse-${index}`;
    const headingId = `${parentId}-heading-${index}`;

    return (
      <div className="accordion-item" key={index}>
        <h2 className="accordion-header" id={headingId}>
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${collapseId}`}
            aria-expanded="false"
            aria-controls={collapseId}
          >
            <div className="col-md-6">Grade: {grade.grade}</div>
            <div className="col-md-5">Date: {new Date(grade.date).toLocaleDateString()}</div>
          </button>
        </h2>
        <div
          id={collapseId}
          className="accordion-collapse collapse"
          aria-labelledby={headingId}
          data-bs-parent={`#${parentId}`}
        >
          <div className="accordion-body">
            <p>Credits: {grade.credits}</p>
            <p>
              Assignment:{" "}
              {grade.assignment?.name || <span className="text-muted">No assignment linked</span>}
            </p>
            <p>Note: {grade.note}</p>
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  const path = courseSlug
                    ? `/courses/${courseSlug}/grades/${grade.id}/edit/`
                    : `/courses/${courseSlug}/grades/edit/`;
                  window.location.href = path;
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  const path = courseSlug
                    ? `/grades/delete/${courseSlug}/${grade.id}`
                    : `/grades/delete/${grade.id}`;
                  window.location.href = path;
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default Grades;
