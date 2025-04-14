import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Accordion from "../components/Accordion";

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
        setDueCount(res.data.due_count || null);
      });
    } else {
      setAllAssignmentsView(true);
      api.get(`/courses/assignments/`).then((res) => {
        setAssignments(res.data.assignments || {});
        setDueCount(res.data.due_count || null);
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
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    try {
      await api.delete(`/courses/assignments/${assignmentId}/modify/`);

      if (courseSlug) {
        const res = await api.get(`/courses/${courseSlug}/assignments/`);
        setAssignments(res.data.assignments || []);
        setDueCount(res.data.due_count || null);
      } else {
        const res = await api.get(`/courses/assignments/`);
        setAssignments(res.data.assignments || {});
        setDueCount(res.data.due_count || null);
      }
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert("Something went wrong while deleting the assignment.");
    }
  };

  const handleCheck = async (assignmentId) => {
    try {
      await api.patch(`/courses/assignments/${assignmentId}/complete/`);

      if (courseSlug) {
        const res = await api.get(`/courses/${courseSlug}/assignments/`);
        setAssignments(res.data.assignments || []);
        setDueCount(res.data.due_count || null);
      } else {
        const res = await api.get(`/courses/assignments/`);
        setAssignments(res.data.assignments || {});
        setDueCount(res.data.due_count || null);
      }
    } catch (err) {
      console.error("Failed to mark assignment as done:", err);
    }
  };

  const renderHeader = (assignment) => (
    <>
      <div className="col-md-6">Assignment: {assignment.name}</div>
      <div className="col-md-5">
        Deadline: {new Date(assignment.deadline).toLocaleDateString()}
      </div>
    </>
  );

  const renderBody = (assignment) => (
    <>
      <p>
        Mark as Done:{" "}
        <input
          type="checkbox"
          className="form-check-input"
          checked={assignment.is_done}
          onChange={() => handleCheck(assignment.id)}
        />
      </p>
      <p>
        Grade:{" "}
        {console.log(assignment.grade_val)}
        {assignment.grade_val || assignment.grade_val===0 ? (
          assignment.grade_val.toFixed(2)
        ) : (
          <span className="text-muted">No grade available</span>
        )}
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
    </>
  );

  return (
    <div className="container mt-4">
      {/* Header buttons and dueCount */}
      <div className="row mb-3">
        <div className="col-md-5 text-start">
          <button className="btn btn-secondary" onClick={handleAddAssignment}>
            Add Assignment
          </button>
        </div>
        <div className="col-md-2 text-center mt-1 mb-1">
          {dueCount !== null && <>Due assignments: {dueCount}</>}
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
      {/* Assignment display */}
      {allAssignmentsView ? (
        Object.keys(assignments).length ? (
          <>
            {/* Pending Assignments */}
            {Object.entries(assignments).map(([courseSlug, assignments], i) =>
              !!assignments.filter((assignment) => !assignment.is_done).length && (
                <div className="card mb-3" key={`pending-${i}`}>
                  <div className="card-header">
                    <h5 className="mb-0">{assignments[0].course_name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="accordion" id={`acc-pending-${i}`}>
                      <Accordion
                        items={assignments.filter(
                          (assignment) => !assignment.is_done,
                        )}
                        parentId={`acc-pending-${i}`}
                        renderHeader={renderHeader}
                        renderBody={renderBody}
                      />
                    </div>
                  </div>
                </div>
              ),
            )}

            {/* Completed Assignments */}
            {!!Object.values(assignments)
              .flat()
              .filter((assignment) => assignment.is_done).length && (
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">Completed Assignments</h5>
                </div>
                <div className="card-body">
                  <div className="accordion" id="acc-all-completed">
                    <Accordion
                      items={Object.values(assignments)
                        .flat()
                        .filter((assignment) => assignment.is_done)}
                      parentId="acc-all-completed"
                      renderHeader={renderHeader}
                      renderBody={renderBody}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted">No assignments available.</p>
        )
      ) : assignments.length ? (
        <>
          {!!assignments.filter((assignment) => !assignment.is_done).length && (
            <div className="accordion mb-3" id="assignmentsAccordion-pending">
              <h3>Pending Assignments</h3>
              <Accordion
                items={assignments.filter((assignment) => !assignment.is_done)}
                parentId="assignmentsAccordion-pending"
                renderHeader={renderHeader}
                renderBody={renderBody}
              />
            </div>
          )}
          {!!assignments.filter((assignment) => assignment.is_done).length && (
            <div className="accordion" id="assignmentsAccordion-completed">
              <h3>Completed Assignments</h3>
              <Accordion
                items={assignments.filter((assignment) => assignment.is_done)}
                parentId="assignmentsAccordion-completed"
                renderHeader={renderHeader}
                renderBody={renderBody}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-muted">No assignments available for this course.</p>
      )}
    </div>
  );
};

export default Assignments;
