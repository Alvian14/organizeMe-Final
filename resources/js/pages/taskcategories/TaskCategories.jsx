
import React from 'react';
import TaskStatusTable from './TaskStatusTable';
import TaskPriorityTable from './TaskPriorityTable';
import Sidebar from '../../components/layouts/Sidebar';

export default function TaskCategoryPage() {
  return (
    <div className="d-flex">     
      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Task Categories</h4>
            <button className="btn btn-danger">Add Category</button>
          </div>

          <TaskStatusTable />
          <hr />
          <TaskPriorityTable />
        </div>
      </div>
    </div>
  );
}
