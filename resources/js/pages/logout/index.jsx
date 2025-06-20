// src/components/LogoutModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../../_services/auth";


export default function LogoutModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleLogoutConfirm = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        await logout({ token });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    onHide(); // untuk menutup modal setelah logout
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah Anda yakin ingin keluar?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="danger" onClick={handleLogoutConfirm}>
          Keluar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
