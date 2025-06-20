import { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import LogoutModal from "../../pages/logout";
import { userImageStorage } from "../../_api";



export default function Sidebar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));



    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    return (
        <>
            <div
                className="text-white p-3"
                style={{
                    width: "250px",
                    backgroundColor: "#0E2148",
                    overflowY: "hidden",
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src={
                            userInfo.image
                                ? `${userImageStorage}${userInfo.image}`
                                : "https://via.placeholder.com/80?text=No+Image"
                        }
                        className="rounded-circle"
                        alt="avatar"
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            border: "2px solid #fff"
                        }}
                    />
                    <h5 className="mt-2 mb-0">{userInfo.username ?? ""}</h5>
                    <small>{userInfo.email}</small>
                </div>

                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${
                                    isActive
                                        ? "bg-white text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-grid-fill me-2" /> Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item mb-2">
                        <NavLink
                            to="/mytask"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${
                                    isActive
                                        ? "bg-white text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-list-task me-2" /> My Task
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/dashboard/settings"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${
                                    isActive
                                        ? "bg-white text-dark rounded p-2"
                                        : "text-white"
                                }`
                            }
                        >
                            <i className="bi bi-gear me-2" /> Settings
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link d-flex align-items-center text-white"
                            onClick={handleLogoutClick}
                        >
                            <i className="bi bi-box-arrow-right me-2" /> Logout
                        </button>
                    </li>
                    <LogoutModal
                        show={showLogoutModal}
                        onHide={() => setShowLogoutModal(false)}
                    />
                </ul>
            </div>
        </>
    );
}
