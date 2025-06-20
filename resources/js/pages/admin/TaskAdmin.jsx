import React, { useEffect, useState } from "react";
import { Table, Card, Button } from "react-bootstrap";
import { BsClipboardCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../_services/auth";

export default function TaskAdmin() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

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

    return (
        <div className="p-4">
            <Card className="shadow border-0 rounded-4">
                <Card.Body>
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h4 className="fw-bold d-flex align-items-center gap-2">
                                <BsClipboardCheck
                                    className="text-primary"
                                    size={24}
                                />
                                My Task
                            </h4>
                            <p className="text-muted mb-0">
                                View and manage all your task progress
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive rounded-3 overflow-hidden">
                        <Table hover bordered className="mb-0 align-middle">
                            <thead className="bg-primary text-white text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter((user) => user.role !== "admin")
                                    .map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="text-center fw-bold">
                                                {index + 1}
                                            </td>
                                            <td className="text-capitalize fw-semibold">
                                                {user.username}
                                            </td>
                                            <td>{user.email}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/task-admin/${user.id}`
                                                        )
                                                    }
                                                >
                                                    Preview
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
