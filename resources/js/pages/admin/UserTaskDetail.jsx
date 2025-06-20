import React, { useState, useEffect } from "react";
import { Card, Badge, Modal, Button, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { BsCardChecklist, BsInfoCircle, BsArrowLeft } from "react-icons/bs";
import { getTasksByUserId } from "../../_services/tasks";

export default function UserTaskDetail() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasksByUserId(id);
                setTasks(data);
            } catch (error) {
                console.error("Gagal mengambil data task:", error);
            }
        };
        fetchTasks();
    }, [id]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const getStatusLabel = (id) => {
        switch (id) {
            case 1:
                return "Not Started";
            case 2:
                return "In Progress";
            case 3:
                return "Completed";
            default:
                return "Unknown";
        }
    };

    const getStatusColor = (id) => {
        switch (id) {
            case 1:
                return "#6c757d"; // abu-abu
            case 2:
                return "#ffc107"; // kuning
            case 3:
                return "#198754"; // hijau
            default:
                return "#dee2e6"; // abu muda
        }
    };

    const getCardBgColor = (status_id) => {
        switch (status_id) {
            case 1:
                return "#f8f9fa"; // Not Started - soft gray
            case 2:
                return "#fff3cd"; // In Progress - soft yellow
            case 3:
                return "#d1e7dd"; // Completed - soft green
            default:
                return "#f8f9fa";
        }
    };

    const renderStatus = (id) => {
        const label = getStatusLabel(id);
        switch (id) {
            case 1:
                return (
                    <Badge bg="secondary" className="px-3 py-1 rounded-pill">
                        {label}
                    </Badge>
                );
            case 2:
                return (
                    <Badge
                        bg="warning"
                        text="dark"
                        className="px-3 py-1 rounded-pill"
                    >
                        {label}
                    </Badge>
                );
            case 3:
                return (
                    <Badge bg="success" className="px-3 py-1 rounded-pill">
                        {label}
                    </Badge>
                );
            default:
                return (
                    <Badge bg="light" className="px-3 py-1 rounded-pill">
                        {label}
                    </Badge>
                );
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <div className="p-3 p-md-4">
            <Card className="shadow-lg border-0 rounded-4">
                <Card.Body>
                    {/* Link kembali ke Task Admin (bukan tombol) */}
                    <div className="mb-2">
                        <Link
                            to="/admin/task-admin"
                            className="text-primary text-decoration-underline"
                        >
                            Task Admin
                        </Link>
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <BsCardChecklist size={24} className="text-primary" />
                        <h4 className="fw-bold mb-0">Task Detail</h4>
                    </div>

                    <Row className="g-3">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Col md={6} lg={4} key={task.id}>
                                    <Card
                                        onClick={() => handleTaskClick(task)}
                                        className="shadow rounded-4 h-100 border-0"
                                        style={{
                                            cursor: "pointer",
                                            transition: "all 0.3s ease-in-out",
                                            borderLeft: `5px solid ${getStatusColor(
                                                task.status_id
                                            )}`,
                                            backgroundColor: getCardBgColor(
                                                task.status_id
                                            ),
                                        }}
                                    >
                                        <Card.Body>
                                            <h6 className="fw-bold text-dark">
                                                {task.title}
                                            </h6>
                                            <p className="text-secondary small mb-2">
                                                {task.description.length > 60
                                                    ? task.description.slice(
                                                          0,
                                                          60
                                                      ) + "..."
                                                    : task.description}
                                            </p>
                                            <p className="text-muted small mb-2">
                                                Deadline:{" "}
                                                {formatDate(task.deadline)}
                                            </p>
                                            {renderStatus(task.status_id)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-muted">
                                Tidak ada task ditemukan.
                            </p>
                        )}
                    </Row>
                </Card.Body>
            </Card>

            {/* Modal Detail Tugas */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <BsInfoCircle /> Detail Tugas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <>
                            <h5 className="fw-bold">{selectedTask.title}</h5>
                            <p className="text-muted">
                                Description: {selectedTask.description}
                            </p>
                            <p className="text-muted mb-2">
                                Deadline: {formatDate(selectedTask.deadline)}
                            </p>
                            <div>
                                Status: {renderStatus(selectedTask.status_id)}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
