import React from 'react';

export default function TaskPriorityTable() {
  const priorities = ['Extreme', 'Moderate', 'Low'];

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h6>Task Priority</h6>
        <a href="#" className="text-danger small">+ Add New Priority</a>
      </div>
      <table className="table table-bordered rounded text-center">
        <thead>
          <tr>
            <th>SN</th>
            <th>Task Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {priorities.map((priority, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{priority}</td>
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