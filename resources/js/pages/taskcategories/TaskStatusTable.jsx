import React from 'react';

export default function TaskStatusTable() {
  const statuses = ['Completed', 'In Progress', 'Not Started'];

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h6>Task Status</h6>
        <a href="#" className="text-danger small">+ Add Task Status</a>
      </div>
      <table className="table table-bordered rounded text-center">
        <thead>
          <tr>
            <th>SN</th>
            <th>Task Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{status}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2">✏️ Edit</button>
                <button className="btn btn-sm btn-danger">🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}