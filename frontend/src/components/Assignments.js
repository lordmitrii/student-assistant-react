import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState({});
  const [dueCount, setDueCount] = useState(null);
  const [allAssignmentsView, setAllAssignmentsView] = useState(true); 
  const { courseSlug } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (courseSlug) {
      setAllAssignmentsView(false);
      api.get(`/courses/${courseSlug}/assignments/`).then((res) => {
        setAssignments(res.data.assignments || []);
        setDueCount(res.data.dueCount || null);
      });
    } else {
      setAllAssignmentsView(true);
      api.get(`/courses/assignments/`).then((res) => {
        setAssignments(res.data.assignments || {});
        setDueCount(res.data.dueCount || null);
      });
    }
  }, [courseSlug]);

  const handleAddAssignment = () => {
    if (courseSlug) {
      navigate(`/courses/${courseSlug}/assignments/add/`);
    } else {
      navigate("/courses/assignments/add");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
  
    try {
      await api.delete(`/courses/assignments/${assignmentId}/`);
  
      if (courseSlug) {
        const res = await api.get(`/courses/${courseSlug}/assignments/`);
        setAssignments(res.data.assignments || []);
        setDueCount(res.data.dueCount || null);
      } else {
        const res = await api.get(`/courses/assignments/`);
        setAssignments(res.data.assignments || {});
        setDueCount(res.data.dueCount || null);
      }
  
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert("Something went wrong while deleting the assignment.");
    }
  };
  
  

  return (
    <div className="container mt-4">
      {/* Header buttons and dueCount */}
      <div className="row mb-3">
        <div className="col-md-5 text-start">
          <button className="btn btn-secondary" onClick={handleAddAssignment}>
            Add Assignment
          </button>
        </div>
        <div className="col-md-2 text-center custom-outline mt-1 mb-1">
          {allAssignmentsView && dueCount !== null && (
            <>Due assignment: {dueCount}</>
          )}
          {!allAssignmentsView && dueCount !== null && (
            <>Due assignment: {dueCount}</>
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

      {/* Assignment display */}
      {allAssignmentsView ? (
        Object.keys(assignments).length ? (
          Object.entries(assignments).map(([courseName, assignments], i) =>
            assignments.length ? (
              <div className="card mb-3" key={i}>
                <div className="card-header">
                  <h5 className="mb-0">{courseName}</h5>
                </div>
                <div className="card-body">
                <div className="accordion" id={`acc-${i}`}>
                  <Accordion
                    assignments={assignments}
                    parentId={`acc-${i}`}
                    courseSlug={null}
                    handleDelete={handleDelete}
                  />

                  </div>
                </div>
              </div>
            ) : null
          )
        ) : (
          <p className="text-muted">No assignments available.</p>
        )
      ) : assignments.length ? (
        <div className="accordion" id="assignmentsAccordion">
          <Accordion
            assignments={assignments}
            parentId="assignmentsAccordion"
            courseSlug={courseSlug}
            handleDelete={handleDelete}
          />

        </div>
      ) : (
        <p className="text-muted">No assignments available for this course.</p>
      )}
    </div>
  );
};

const Accordion = ({ assignments, parentId, courseSlug, handleDelete }) => {
  return assignments.map((assignment, index) => {
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
            <div className="col-md-6">Assignment: {assignment.name}</div>
            <div className="col-md-5">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</div>
          </button>
        </h2>
        <div
          id={collapseId}
          className="accordion-collapse collapse"
          aria-labelledby={headingId}
          data-bs-parent={`#${parentId}`}
        >
          <div className="accordion-body">
            <p>Mark as Done:</p>
            <p>
            {console.log(assignment)}
              Grade:{" "}
              {assignment.grade_val? assignment.grade_val.toFixed(2) : <span className="text-muted">No grade available</span>}
            </p>
            <p>Note: {assignment.note}</p>
            <div className="mt-3 d-flex gap-2">
              <Link
                className="btn btn-sm btn-warning"
                to={`/courses/assignments/${assignment.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(assignment.id)}
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

export default Assignments;
