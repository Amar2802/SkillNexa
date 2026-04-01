import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

const ForgotPasswordPanel = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtpRequest = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/forgot-password", { email });
      setStatus(data.message || "OTP sent to your email address.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP right now.");
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (event) => {
    event.preventDefault();
    await sendOtpRequest();
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/reset-password", { email, otp, password });
      setStatus(data.message || "Password reset successful.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass-card mt-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <span className="eyebrow">Password Recovery</span>
            <h2 className="h4 fw-bold mt-2 mb-1">Forgot your password?</h2>
            <p className="text-secondary mb-0">Receive a 6-digit OTP on your email and set a new password securely.</p>
          </div>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={onBack}>Back</button>
        </div>

        {step === 1 && (
          <form onSubmit={requestOtp} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {status && <div className="alert alert-info py-2">{status}</div>}
            <button className="btn btn-info w-100" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="mt-4">
            <div className="alert alert-info py-2">{status || "OTP sent to your email address."}</div>
            <div className="mb-3">
              <label className="form-label">OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-info flex-grow-1" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button type="button" className="btn btn-outline-light" disabled={loading} onClick={sendOtpRequest}>
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="mt-4">
            <div className="alert alert-success py-2">{status}</div>
            <button type="button" className="btn btn-info w-100" onClick={onBack}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPage = ({ mode, onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isLogin = mode === "login";

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(
        isLogin ? "/auth/login" : "/auth/signup",
        isLogin
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password
            }
      );
      onAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card glass-card">
              <div className="card-body p-4 p-lg-5">
                <span className="eyebrow">Career Ready Stack</span>
                <h1 className="h2 fw-bold mt-3">{isLogin ? "Welcome back" : "Create your account"}</h1>
                <p className="text-secondary">
                  Sign in to access your preparation dashboard, mock tests, question bank, and interview tools.
                </p>
                <form onSubmit={submit} className="mt-4">
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <label className="form-label mb-0">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          className="btn btn-link auth-link-button p-0"
                          onClick={() => {
                            setShowForgotPassword((current) => !current);
                            setError("");
                          }}
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  <button className="btn btn-info w-100">{isLogin ? "Login" : "Sign Up"}</button>
                </form>
                <p className="mt-4 mb-0 text-secondary">
                  {isLogin ? "New here?" : "Already registered?"} <Link to={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Login"}</Link>
                </p>
              </div>
            </div>

            {isLogin && showForgotPassword && (
              <ForgotPasswordPanel onBack={() => setShowForgotPassword(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

