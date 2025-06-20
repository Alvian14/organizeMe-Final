import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./admin/Navbar"

export default function DashboardAdmin() {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "250px", background: "#0E2148", color: "#fff"}}>
        <Navbar />
      </div>

      <div className="d-flex flex-column flex-grow-1">

        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>

  );
}
