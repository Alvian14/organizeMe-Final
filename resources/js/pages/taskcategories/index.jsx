import React from 'react';

export default function TaskCategories() {
  return (
    <div className="card">
      <h2>Task Categories</h2>

      <div className="section">
        <button className="button add">+ Add Task Status</button>
        <table className="table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Task Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Completed</td>
              <td>
                <button className="button edit">Edit</button>
                <button className="button delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="section">
        <button className="button add">+ Add New Priority</button>
        <table className="table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Task Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Extreme</td>
              <td>
                <button className="button edit">Edit</button>
                <button className="button delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}