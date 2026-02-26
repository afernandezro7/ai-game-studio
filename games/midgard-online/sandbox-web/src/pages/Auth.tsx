import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import "./Auth.css";

type Tab = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(regUsername, regEmail, regPassword);
      navigate("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Midgard Online</h1>
        <p className="auth-subtitle">The realm awaits your command</p>

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "login"}
            className={`auth-tab${tab === "login" ? " auth-tab--active" : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Login
          </button>
          <button
            role="tab"
            aria-selected={tab === "register"}
            className={`auth-tab${tab === "register" ? " auth-tab--active" : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {/* Login form */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="warrior@midgard.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Entering realm…" : "Enter Midgard"}
            </button>
          </form>
        )}

        {/* Register form */}
        {tab === "register" && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <div className="auth-field">
              <label htmlFor="reg-username" className="auth-label">
                Username <span className="auth-hint">(3–20 alphanumeric)</span>
              </label>
              <input
                id="reg-username"
                type="text"
                className="auth-input"
                placeholder="Ragnar123"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-email" className="auth-label">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                className="auth-input"
                placeholder="warrior@midgard.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-password" className="auth-label">
                Password <span className="auth-hint">(min 8 characters)</span>
              </label>
              <input
                id="reg-password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-confirm" className="auth-label">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account…" : "Join the Realm"}
            </button>
            <p className="auth-bonus">
              🪙 You start with <strong>50 Runes</strong> — the premium currency
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
