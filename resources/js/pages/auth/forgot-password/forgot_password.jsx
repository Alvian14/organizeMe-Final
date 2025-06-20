import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [showReset, setShowReset] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/forgot-password", { email });
            setMessage(res.data.message);
            setShowReset(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Terjadi kesalahan");
            setShowReset(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/reset-password", {
                email,
                password,
                password_confirmation: passwordConfirm,
            });
            setMessage(res.data.message);
            setShowReset(false);
            setResetSuccess(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Gagal reset password");
            setResetSuccess(false);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white px-3">
            {/* Judul OrganizeMe */}
            <div className="mb-4 text-center user-select-none">
                <h1
                    className="fw-bold"
                    style={{
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        fontSize: "1.8rem",
                        color: "#0E2148",
                    }}
                >
                    <span style={{ color: "#0E2148" }}>Or</span>ganize
                    <span style={{ color: "#4ECDC4" }}>Me</span>
                </h1>
            </div>

            <div
                className="rounded-4 shadow p-5 text-white"
                style={{
                    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                    position: "relative",
                }}
            >
                {/* Tombol kembali ke login */}
                {!resetSuccess && (
                    <Link
                        to="/"
                        className="position-absolute top-0 start-0 m-3 text-white"
                        style={{ fontSize: "1.5rem" }}
                        title="Kembali ke Login"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                )}

                <h3 className="text-center mb-4" style={{ color: "#ff9800" }}>
                    Lupa Password
                </h3>

                {!showReset && !resetSuccess && (
                    <form onSubmit={handleCheckEmail}>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label fw-semibold" style={{ fontSize: "0.95rem" }}>
                                Masukkan Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control form-control-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ fontSize: "0.95rem" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-sm w-100 text-white"
                            style={{
                                fontSize: "1rem",
                                backgroundColor: "#ff9800",
                                border: "none",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EBB563")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff9800")}
                        >
                            Cek Email
                        </button>
                    </form>
                )}

                {showReset && !resetSuccess && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-semibold" style={{ fontSize: "0.95rem" }}>
                                Password Baru
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control form-control-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ fontSize: "0.95rem" }}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="passwordConfirm"
                                className="form-label fw-semibold"
                                style={{ fontSize: "0.95rem" }}
                            >
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                id="passwordConfirm"
                                className="form-control form-control-sm"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                                style={{ fontSize: "0.95rem" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-sm w-100 text-white"
                            style={{
                                fontSize: "1rem",
                                backgroundColor: "#ff9800",
                                border: "none",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EBB563")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff9800")}
                        >
                            Ubah Password
                        </button>
                    </form>
                )}

                {message && !resetSuccess && (
                    <div
                        className="alert alert-info mt-4 mb-0 text-center"
                        style={{ fontSize: "0.9rem", backgroundColor: "rgba(255,255,255,0.3)", color: "#fff" }}
                    >
                        {message}
                    </div>
                )}

                {resetSuccess && (
                    <div className="text-center" style={{ borderRadius: "12px", padding: "20px" }}>
                        <h5>Password berhasil diubah!</h5>
                        <p>Silakan login dengan password baru Anda.</p>
                        <Link
                            to="/"
                            className="btn btn-sm text-white"
                            style={{
                                backgroundColor: "#ff9800",
                                fontWeight: "600",
                                padding: "10px 30px",
                                borderRadius: "6px",
                                textDecoration: "none",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EBB563")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff9800")}
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
