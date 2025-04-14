import React, { useState } from "react";

const Calculator = () => {
  const [rows, setRows] = useState([{name:"", grade: "", credits: "" }]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, {name:"", grade: "", credits: "" }]);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => `${row.name}${row.grade},${row.credits}`).join("\n")
      + "\n" +
      "Weighted Average," + calculateAverage();
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grades.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };


  const calculateAverage = () => {
    let totalWeightedGrades = 0;
    let totalCredits = 0;

    rows.forEach((row) => {
      const grade = parseFloat(row.grade);
      const credits = parseFloat(row.credits);

      if (!isNaN(grade) && !isNaN(credits)) {
        totalWeightedGrades += grade * credits;
        totalCredits += credits;
      }
    });

    return totalCredits > 0
      ? (totalWeightedGrades / totalCredits).toFixed(2)
      : "0.00";
  };

  return (
    <div className="container mt-5">
      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h2 class="mb-0">Grade Calculator</h2>
        </div>
        <div class="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade (%)</th>
                <th>Credits (Weight)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={row.name || ""}
                      placeholder="Enter assignment name"
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={row.grade}
                      placeholder="Enter grade"
                      onChange={(e) =>
                        handleInputChange(index, "grade", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={row.credits}
                      placeholder="Enter credits"
                      onChange={(e) =>
                        handleInputChange(index, "credits", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteRow(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary mb-3" onClick={addRow}>
              Add Row
            </button>
            <button
              className="btn btn-secondary mb-3 ms-2"
              onClick={handleExport}
            >
              Export
            </button>
          </div>
          <div>
            <h3>Weighted Average: {calculateAverage()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
