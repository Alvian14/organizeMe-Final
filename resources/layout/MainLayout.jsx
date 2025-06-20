import React from "react";
import Sidebar from "../components/layouts/Sidebar";
import Topbar from "../components/layouts/Topbar";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100">
        <Topbar />
        <div className="container py-4">
          <div className="bg-white p-4 rounded shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
