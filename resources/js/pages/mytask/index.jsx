import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Modal,
    Form,
    Badge,
    Image,
    Alert,
} from "react-bootstrap";
import { Calendar, Trash, Pencil, ImageFill } from "react-bootstrap-icons";
import {
    getTasksByUserIdFull,
    updateTasks,
    deleteTask,
} from "../../_services/tasks";
import { bookImageStorage } from "../../_api";
import "bootstrap/dist/css/bootstrap.min.css";

const MyTaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // Tambah state untuk error validasi

    useEffect(() => {
        const fetchTasks = async () => {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (userInfo?.id) {
                try {
                    const data = await getTasksByUserIdFull(userInfo.id);
                    console.log(data);
                    setTasks(data);
                } catch (error) {
                    console.error("Gagal mengambil task:", error);
                }
            }
        };
        fetchTasks();
    }, []);

    const showAlert = (message, type = "info") => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: "", type: "" });
        }, 3000);
    };

    const handleShowModal = (task) => {
        // Konversi priority name ke priority_id
        let priorityId = 1; // Default Low
        if (task.priority_name === "Medium") priorityId = 2;
        if (task.priority_name === "Hight" || task.priority_name === "High")
            priorityId = 3;

        // Konversi status name ke status_id
        let statusId = 1;
        if (task.status_name === "In Progress") statusId = 2;
        if (task.status_name === "Completed") statusId = 3;

        setEditData({
            ...task,
            deadline: task.deadline ? task.deadline.split(" ")[0] : "",
            priority_id: priorityId,
            status_id: statusId,
        });
        setSelectedImage(task.image || null);
        setImageFile(null);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditData({});
        setSelectedImage(null);
        setImageFile(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const updateTask = async () => {
        // Validasi: semua field wajib diisi
        if (
            !editData.title ||
            !editData.description ||
            !editData.deadline ||
            !editData.priority_id ||
            !editData.status_id
        ) {
            showAlert(
                "Harap lengkapi semua field yang wajib diisi!",
                "warning"
            );
            return;
        }

        setIsLoading(true);
        setFormErrors({}); // Reset error validasi

        try {
            // Siapkan data yang akan dikirim ke server
            const taskData = {
                title: editData.title,
                description: editData.description,
                deadline: editData.deadline,
                priority_id: editData.priority_id,
                status_id: editData.status_id,
            };

            // Jika ada file gambar, buat FormData
            if (imageFile) {
                const formData = new FormData();
                Object.keys(taskData).forEach((key) => {
                    formData.append(key, taskData[key]);
                });
                formData.append("image", imageFile);

                const updatedTask = await updateTasks(editData.id, formData);

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === editData.id
                            ? { ...task, ...updatedTask }
                            : task
                    )
                );
            } else {
                // Panggil service dengan JSON data
                const updatedTask = await updateTasks(editData.id, taskData);

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === editData.id
                            ? { ...task, ...updatedTask }
                            : task
                    )
                );
            }

            // Update selectedTask jika sedang dipilih
            if (selectedTask && selectedTask.id === editData.id) {
                const refreshedTasks = await getTasksByUserIdFull(
                    JSON.parse(localStorage.getItem("userInfo")).id
                );
                setTasks(refreshedTasks);
                const updatedSelectedTask = refreshedTasks.find(
                    (task) => task.id === editData.id
                );
                setSelectedTask(updatedSelectedTask);
            }

            showAlert("Task berhasil diupdate!", "success");
            handleClose();
        } catch (error) {
            // Tangani error validasi 422
            if (error.response && error.response.status === 422) {
                setFormErrors(error.response.data.errors || {});
                showAlert(
                    error.response.data.message ||
                        "Validasi gagal. Periksa input Anda.",
                    "danger"
                );
            } else if (error.response) {
                showAlert(
                    `Error ${error.response.status}: ${
                        error.response.data.message || "Gagal mengupdate task"
                    }`,
                    "danger"
                );
            } else {
                showAlert(
                    "Gagal mengupdate task. Silakan coba lagi.",
                    "danger"
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTask) return;
        setIsLoading(true);
        try {
            await deleteTask(selectedTask.id);
            setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
            setSelectedTask(null);
            showAlert("Task berhasil dihapus!", "success");
        } catch (error) {
            showAlert("Gagal menghapus task.", "danger");
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
        }
    };

    const getPriorityBadge = (priority) => {
        if (priority === "Hight")
            return (
                <Badge bg="danger" className="fw-semibold">
                    Hight
                </Badge>
            );
        if (priority === "Medium")
            return (
                <Badge bg="warning" className="fw-semibold text-dark">
                    Medium
                </Badge>
            );
        return (
            <Badge bg="primary" className="fw-semibold">
                Low
            </Badge>
        );
    };

    const getStatusBadge = (status) => {
        if (status === "Not Started")
            return <Badge bg="secondary">Not Started</Badge>;
        if (status === "Completed")
            return <Badge bg="success">Completed</Badge>;
        return (
            <Badge bg="warning" className="text-dark">
                In Progress
            </Badge>
        );
    };

    // Header & Search
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredTasks =
        selectedStatus === "All"
            ? tasks
            : tasks.filter((task) => task.status_name === selectedStatus);

    const searchedTasks = debouncedSearchTerm
        ? filteredTasks.filter((task) =>
              task.title
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
          )
        : filteredTasks;

    const hasil = ( foto ) =>{
        console.log(foto);
    }

    /* Header */
    return (
        <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
            {/* Alert */}
            {alert.show && (
                <Alert
                    variant={alert.type}
                    className="position-fixed top-0 start-50 translate-middle-x mt-3"
                    style={{ zIndex: 9999, minWidth: "300px" }}
                >
                    {alert.message}
                </Alert>
            )}

            <div className="flex-grow-1 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <input
                        type="text"
                        className="form-control w-100 w-md-50"
                        placeholder="Search your task here..."
                        style={{ maxWidth: "400px" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="outline-secondary"
                            className="shadow-sm rounded-circle p-2 d-flex justify-content-center align-items-center"
                            style={{ width: 42, height: 42 }}
                            title="Calendar"
                        >
                            <Calendar size={20} />
                        </Button>
                        <div className="text-end">
                            <strong className="d-block">Sunday</strong>
                            <small className="text-muted">
                                {new Date().toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="d-flex gap-2 mb-4">
                    {["All", "Not Started", "In Progress", "Completed"].map(
                        (status) => (
                            <Button
                                key={status}
                                variant={
                                    selectedStatus === status
                                        ? "primary"
                                        : "outline-primary"
                                }
                                onClick={() => {
                                    setSelectedStatus(status);
                                    setSelectedTask(null);
                                }}
                            >
                                {status}
                            </Button>
                        )
                    )}
                </div>

                <div className="row g-4">
                    {/* Task List */}
                    <div className="col-md-6">
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h5 className="fw-bold mb-4 text-danger">
                                    My Tasks
                                </h5>

                                {searchedTasks.map((task) => {
                                    let bgClass = "bg-light";
                                    if (task.status_name === "In Progress")
                                        bgClass = "bg-warning-subtle";
                                    else if (task.status_name === "Completed")
                                        bgClass = "bg-success-subtle";

                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                            className={`border p-3 rounded mb-3 ${bgClass} shadow-sm`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <h6 className="mb-1">
                                                {task.title}
                                            </h6>
                                            <p
                                                className="mb-1 text-muted"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                {task.description.slice(0, 70)}
                                                ...
                                            </p>
                                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                                {getPriorityBadge(
                                                    task.priority_name
                                                )}
                                                {getStatusBadge(
                                                    task.status_name
                                                )}
                                                <small className="text-muted ms-auto">
                                                    {new Date(
                                                        task.deadline
                                                    ).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Task Details */}
                    <div className="col-md-6">
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h5 className="fw-bold text-danger">
                                    Task Details
                                </h5>

                                {selectedTask ? (
                                    <>
                                        <p className="mb-2">
                                            <strong>Title:</strong>{" "}
                                            {selectedTask.title}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Description:</strong>{" "}
                                            {selectedTask.description}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Priority:</strong>{" "}
                                            {getPriorityBadge(
                                                selectedTask.priority_name
                                            )}
                                        </p>
                                        {/* Tampilkan gambar jika ada */}
                                        {selectedTask.image && (
                                            <div className="mb-3">
                                                <Image
                                                    src={`${bookImageStorage}/${selectedTask.image}`}
                                                    alt="Task"
                                                    fluid
                                                    rounded
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "250px",
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "https://via.placeholder.com/250x150?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="d-flex gap-3 mt-3">
                                            <Button
                                                variant="danger"
                                                title="Delete Task"
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                }}
                                                onClick={handleDeleteClick}
                                                disabled={isLoading}
                                            >
                                                <Trash size={18} />
                                            </Button>
                                            <Button
                                                variant="warning"
                                                title="Edit Task"
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                }}
                                                onClick={() =>
                                                    handleShowModal(
                                                        selectedTask
                                                    )
                                                }
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted">
                                        Pilih salah satu task untuk melihat
                                        detail.
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Task Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <ImageFill className="me-2" />
                        Edit Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Tampilkan error validasi jika ada */}
                    {Object.keys(formErrors).length > 0 && (
                        <div
                            className="alert alert-danger py-2 px-3"
                            style={{ fontSize: "0.95rem" }}
                        >
                            <ul className="mb-0">
                                {Object.entries(formErrors).map(
                                    ([field, msgs]) =>
                                        msgs.map((msg, idx) => (
                                            <li key={field + idx}>{msg}</li>
                                        ))
                                )}
                            </ul>
                        </div>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Task Title{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.title || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Due Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={editData.deadline || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        deadline: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Low"
                                    name="priority"
                                    type="radio"
                                    id="priority-low"
                                    checked={editData.priority_id === 1}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            priority_id: 1,
                                        })
                                    }
                                />
                                <Form.Check
                                    inline
                                    label="Medium"
                                    name="priority"
                                    type="radio"
                                    id="priority-medium"
                                    checked={editData.priority_id === 2}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            priority_id: 2,
                                        })
                                    }
                                />
                                <Form.Check
                                    inline
                                    label="High"
                                    name="priority"
                                    type="radio"
                                    id="priority-high"
                                    checked={editData.priority_id === 3}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            priority_id: 3,
                                        })
                                    }
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Not Started"
                                    name="status"
                                    type="radio"
                                    id="status-notstarted"
                                    checked={editData.status_id === 1}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            status_id: 1,
                                        })
                                    }
                                />
                                <Form.Check
                                    inline
                                    label="In Progress"
                                    name="status"
                                    type="radio"
                                    id="status-inprogress"
                                    checked={editData.status_id === 2}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            status_id: 2,
                                        })
                                    }
                                />
                                <Form.Check
                                    inline
                                    label="Completed"
                                    name="status"
                                    type="radio"
                                    id="status-completed"
                                    checked={editData.status_id === 3}
                                    onChange={() =>
                                        setEditData({
                                            ...editData,
                                            status_id: 3,
                                        })
                                    }
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Description{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editData.description || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image (optional)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        {selectedImage && (
                            <div className="text-center mb-3">
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="img-fluid rounded shadow"
                                    style={{
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={updateTask}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Save Task"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Konfirmasi Delete */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Apakah Anda yakin ingin menghapus task ini?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Menghapus..." : "Ya, Hapus"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyTaskPage;
