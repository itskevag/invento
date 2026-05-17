import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import { saveToken } from "../utils/auth";
import type { LoginResponse } from "../types";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      saveToken(response.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        <div className="login-brand">
          <div className="brand-icon">I</div>
          <div>
            <h1>Invento</h1>
            <p>Simple Inventory Management</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>Admin Login</h2>
          <p className="login-hint">
            Use the demo account to access the dashboard.
          </p>

          {error && <div className="error-box">{error}</div>}

          <label>
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="demo-box">
            <strong>Demo Account</strong>
            <span>Email: admin@invento.com</span>
            <span>Password: admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
}