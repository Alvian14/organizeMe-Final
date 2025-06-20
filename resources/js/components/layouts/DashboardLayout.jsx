import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "250px", background: "#0E2148", color: "#fff"}}>
        <Sidebar />
      </div>

      <div className="d-flex flex-column flex-grow-1">
        <div style={{ height: "60px", color: "#fff", position: "sticky", top: 0, zIndex: 1000 }}>
          <Topbar />
        </div>
        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>

  );
}
