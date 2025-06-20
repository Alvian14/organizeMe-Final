import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoutModal from "../../../pages/logout";


export default function Navbar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    return (
        <div
            className="bg-secondary text-white border-end p-3 d-flex flex-column"
            style={{
                width: "250px",
                minHeight: "100vh",
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
            }}
        >
            <div className="text-center mb-4">
                <h4 className="fw-bold text-white">OrganizME</h4>
                <p className="mt-2 mb-0">{userInfo.username}</p>
            </div>

            {/* === Menu Section: Tasks & Users === */}
            <div className="mb-4">
                <h6 className="text-light">Menu</h6>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink
                            to="/admin/user-page-admin"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center gap-2 ${
                                    isActive
                                        ? "bg-light text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-people-fill" />
                            Users
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            to="/admin/task-admin"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center gap-2 ${
                                    isActive
                                        ? "bg-light text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-check2-square" />
                            Tasks
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* === Settings === */}
            <div className="mb-4">
                <h6 className="text-light">Account</h6>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center gap-2 ${
                                    isActive
                                        ? "bg-light text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-gear-fill" />
                            Account Settings
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* === Logout Button === */}
            <div className="mt-auto">
                <button
                    className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleLogoutClick} // ✅ perbaikan letak atribut
                >
                    <i className="bi bi-box-arrow-right" />
                    Logout
                </button>

                <LogoutModal
                    show={showLogoutModal}
                    onHide={() => setShowLogoutModal(false)}
                />
            </div>
        </div>
    );
}
