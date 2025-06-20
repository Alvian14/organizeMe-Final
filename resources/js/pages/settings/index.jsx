import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";
import { updateUser, updateUserPassword } from "../../_services/auth";

export default function AccountInfoPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [users, setUsers] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [previewImage, setPreviewImage] = useState(null);

    // Form data untuk profile
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        _method: "PUT",
    });

    // Form data untuk password
    const [passwordData, setPasswordData] = useState({
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (userInfo) {
            setUsers(userInfo);
            setFormData({
                username: userInfo.username || "",
                email: userInfo.email || "",
                _method: "PUT",
            });
        } else {
            setMessage("User tidak ditemukan. Silakan login kembali.");
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prev => ({
                ...prev,
                image: files[0]
            }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await updateUser(userInfo.id, formData);
            setMessage("Profile berhasil diperbarui!");
            setUsers(prev => ({
                ...prev,
                username: formData.username,
                email: formData.email,
                image: formData.image ? formData.image.name : prev.image
            }));
            const updatedUserInfo = {
                ...userInfo,
                username: formData.username,
                email: formData.email,
                image: formData.image ? formData.image.name : userInfo.image
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        } catch (error) {
            setMessage("Gagal memperbarui profile: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        if (passwordData.password !== passwordData.password_confirmation) {
            setMessage("Password dan konfirmasi password tidak cocok!");
            setLoading(false);
            return;
        }
        if (passwordData.password.length < 6) {
            setMessage("Password minimal 6 karakter!");
            setLoading(false);
            return;
        }
        try {
            await updateUserPassword(userInfo.id, passwordData);
            setMessage("Password berhasil diperbarui!");
            setPasswordData({
                password: "",
                password_confirmation: "",
            });
        } catch (error) {
            setMessage("Gagal memperbarui password: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light p-4" style={{ minHeight: "100vh" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <input
                    type="text"
                    className="form-control w-50 me-3"
                    placeholder="Search your task here..."
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
                        <strong className="d-block">Tuesday</strong>
                        <small className="text-muted">20/06/2023</small>
                    </div>
                </div>
            </div>

            <Card className="shadow border-0 p-4">
                <Card.Body>
                    <h4 className="fw-bold mb-4">⚙️ Account Settings</h4>
                    {message && (
                        <Alert
                            variant={message.includes("berhasil") ? "success" : "danger"}
                            className="mb-3"
                        >
                            {message}
                        </Alert>
                    )}
                    <div className="mb-3 d-flex gap-2">
                        <Button
                            variant={activeTab === "profile" ? "secondary" : "outline-secondary"}
                            onClick={() => {
                                setActiveTab("profile");
                                setMessage("");
                            }}
                        >
                            Profil
                        </Button>
                        <Button
                            variant={activeTab === "password" ? "secondary" : "outline-secondary"}
                            onClick={() => {
                                setActiveTab("password");
                                setMessage("");
                            }}
                        >
                            Ganti Password
                        </Button>
                    </div>
                    {/* === FORM PROFIL === */}
                    {activeTab === "profile" && (
                        <Form onSubmit={handleProfileSubmit}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="image">
                                <Form.Label>Profile Image (optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                            {(previewImage || users.image) && (
                                <div className="mb-3">
                                    <img
                                        src={previewImage ? previewImage : (users.image ? `/storage/users/${users.image}` : "")}
                                        alt="Preview"
                                        className="rounded"
                                        style={{ width: 80, height: 80, objectFit: "cover", border: "2px solid #eee" }}
                                    />
                                </div>
                            )}
                            <Button
                                variant="secondary"
                                type="submit"
                                className="rounded-pill px-4"
                                disabled={loading}
                            >
                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </Form>
                    )}
                    {/* === FORM GANTI PASSWORD === */}
                    {activeTab === "password" && (
                        <Form onSubmit={handlePasswordSubmit}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="password">
                                        <Form.Label>Password Baru</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password baru (minimal 6 karakter)"
                                            name="password"
                                            value={passwordData.password}
                                            onChange={handlePasswordChange}
                                            required
                                            disabled={loading}
                                            minLength={6}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="password_confirmation">
                                        <Form.Label>
                                            Konfirmasi Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Ulangi password"
                                            name="password_confirmation"
                                            value={passwordData.password_confirmation}
                                            onChange={handlePasswordChange}
                                            required
                                            disabled={loading}
                                            minLength={6}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button
                                variant="secondary"
                                type="submit"
                                className="rounded-pill px-4"
                                disabled={loading}
                            >
                                {loading ? "Menyimpan..." : "Simpan Password"}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}
