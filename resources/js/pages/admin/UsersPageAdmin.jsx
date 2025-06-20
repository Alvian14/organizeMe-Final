import { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form } from "react-bootstrap";
import { deleteUser, getUser, updateUserRole } from "../../_services/auth";

export default function UsersPageAdmin() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    // Ambil data user saat pertama kali
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await getUser();
                setUsers(usersData);
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            }
        };
        fetchData();
    }, []);

    // Hapus user
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus data?"
        );
        if (confirmDelete) {
            await deleteUser(id);
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    // Tampilkan modal edit role
    const handleEdit = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowModal(true);
    };

    // Submit perubahan role
    const handleSave = async () => {
        try {
            await updateUserRole(selectedUser.id, { role: newRole });

            // Perbarui data user di frontend
            const updatedUsers = users.map((user) =>
                user.id === selectedUser.id ? { ...user, role: newRole } : user
            );
            setUsers(updatedUsers);

            setShowModal(false);
        } catch (error) {
            console.error("Gagal mengupdate role:", error);
        }
    };

    return (
        <div className="p-4">
            <Card className="shadow border-0">
                <Card.Body>
                    <h4 className="fw-bold border-bottom pb-3 mb-4">
                        👥 User List
                    </h4>

                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th className="text-dark">#</th>
                                <th className="text-dark">Username</th>
                                <th className="text-dark">Email</th>
                                <th className="text-dark">Image</th>
                                <th className="text-dark">Role</th>
                                <th className="text-dark">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...users]
                                .sort((a, b) => {
                                    if (
                                        a.role === "admin" &&
                                        b.role !== "admin"
                                    )
                                        return -1;
                                    if (
                                        a.role !== "admin" &&
                                        b.role === "admin"
                                    )
                                        return 1;
                                    return 0;
                                })
                                .map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.image}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit Role
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Edit Role */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Batal
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Simpan Perubahan
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
