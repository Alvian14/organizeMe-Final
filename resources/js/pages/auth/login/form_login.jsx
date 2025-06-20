import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, useDecodeToken } from "../../../_services/auth";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });

    const token = localStorage.getItem("accessToken");
    const decodedData = useDecodeToken(token);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });

        // Reset error untuk field yang sedang diubah
        setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
        setErrorMessage("");
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username harus diisi";
        if (!formData.password.trim()) newErrors.password = "Password harus diisi";

        setErrors(newErrors);
        // Return true jika tidak ada error
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!validate()) return;

        try {
            const response = await loginUser(formData);
            localStorage.setItem("accessToken", response.token);
            localStorage.setItem("userInfo", JSON.stringify(response.user));

            navigate(response.user.role === "admin" ? "/admin/user-page-admin" : "/dashboard");
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Username atau password salah");
        }
    };

    useEffect(() => {
        if (token && decodedData && decodedData.success) {
            const userRole = decodedData.role;
            navigate(userRole === "admin" ? "/admin/user-page-admin" : "/");
        }
    }, [token, decodedData, navigate]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white px-3">
            <div className="mb-3 text-center">
                <h1
                    className="fw-bold"
                    style={{
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        fontSize: "1.8rem",
                        color: "#0E2148",
                        userSelect: "none",
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
                }}
            >
                <div className="text-center mb-3">
                    <h2 style={{ color: "#ff9800" }}>Log In</h2>
                    <p style={{ fontSize: "0.95rem" }}>
                        Log in to manage your habits efficiently
                    </p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger py-2 px-3" role="alert" style={{ fontSize: "0.9rem" }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            className={`form-control form-control-sm ${errors.username ? "is-invalid" : ""}`}
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ fontSize: "0.95rem" }}
                        />
                        {errors.username && (
                            <div className="invalid-feedback" style={{ fontSize: "0.85rem" }}>
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ fontSize: "0.95rem" }}
                        />
                        {errors.password && (
                            <div className="invalid-feedback" style={{ fontSize: "0.85rem" }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="text-right mb-3">
                        <Link
                            to="/forgot-password"
                            style={{
                                fontSize: "0.9rem",
                                color: "#ffd580",
                                textDecoration: "underline",
                                cursor: "pointer",
                                userSelect: "none",
                                transition: "color 0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#fff")}
                            onMouseLeave={(e) => (e.target.style.color = "#ffd580")}
                        >
                            Lupa Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-sm w-100 text-white mb-3"
                        style={{
                            fontSize: "1rem",
                            backgroundColor: "#ff9800",
                            border: "none",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#EBB563")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff9800")}
                    >
                        Login
                    </button>
                </form>

                <div className="text-center" style={{ fontSize: "0.9rem", color: "#fff", userSelect: "none" }}>
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#ffd580",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#fff")}
                        onMouseLeave={(e) => (e.target.style.color = "#ffd580")}
                    >
                        Daftar sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
