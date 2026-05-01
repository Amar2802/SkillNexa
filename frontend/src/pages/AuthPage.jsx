import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useToast } from "../components/ui/ToastProvider";

const featureCards = [
  { title: "AI mock interviews", copy: "Generate realistic rounds tailored to the role and skill set you want to target." },
  { title: "Progress analytics", copy: "Track your scores, consistency, topic health, and readiness from one dashboard." },
  { title: "Practice workflows", copy: "Move from questions to practice to review without losing your flow." }
];

const ForgotPasswordPanel = ({ onBack }) => {
  const { showToast } = useToast();
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
      showToast("Password reset OTP sent successfully.", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to send OTP right now.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/reset-password", { email, otp, password });
      setStatus(data.message || "Password reset successful.");
      setStep(3);
      showToast("Password updated successfully.", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to reset password.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="snx-surface-card mt-4">
      <div className="snx-section-head">
        <div>
          <span className="snx-kicker">Password Recovery</span>
          <h2>Reset your password securely</h2>
        </div>
        <button type="button" className="btn snx-btn-secondary" onClick={onBack}>Back</button>
      </div>

      {step === 1 ? (
        <div>
          <label className="form-label">Registered Email</label>
          <input type="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error ? <div className="alert alert-danger py-2">{error}</div> : null}
          <button className="btn snx-btn-primary w-100" onClick={sendOtpRequest} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <form onSubmit={resetPassword}>
          <div className="alert alert-info py-2">{status}</div>
          <label className="form-label">OTP</label>
          <input type="text" className="form-control mb-3" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} required />
          <label className="form-label">New Password</label>
          <input type="password" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          {error ? <div className="alert alert-danger py-2">{error}</div> : null}
          <div className="d-flex flex-wrap gap-2">
            <button className="btn snx-btn-primary flex-grow-1" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
            <button type="button" className="btn snx-btn-secondary" onClick={sendOtpRequest} disabled={loading}>Resend</button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div>
          <div className="alert alert-success py-2">{status}</div>
          <button type="button" className="btn snx-btn-primary w-100" onClick={onBack}>Return to Login</button>
        </div>
      ) : null}
    </div>
  );
};

const AuthPage = ({ mode, onAuth }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isLogin = mode === "login";

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post(
        isLogin ? "/auth/login" : "/auth/signup",
        isLogin
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password }
      );
      onAuth(data);
      showToast(isLogin ? "Welcome back to SkillNexa." : "Account created successfully.", "success");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Authentication failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 snx-page-shell">
      <div className="row g-4 align-items-stretch">
        <div className="col-xl-7">
          <div className="snx-hero-card h-100">
            <span className="snx-kicker">AI Interview Preparation Platform</span>
            <h1 className="snx-page-title mt-3">Prepare for interviews with a cleaner, smarter workflow.</h1>
            <p className="snx-page-subtitle">
              SkillNexa helps you practice questions, run mock tests, and generate AI interview rounds from one product-style dashboard.
            </p>

            <div className="row g-3 mt-2">
              {featureCards.map((card) => (
                <div className="col-md-4" key={card.title}>
                  <div className="snx-feature-card h-100">
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3 mt-3">
              <div className="col-sm-4">
                <div className="snx-stat-card compact">
                  <span>Interview Paths</span>
                  <strong>12+</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="snx-stat-card compact">
                  <span>AI Feedback</span>
                  <strong>Instant</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="snx-stat-card compact">
                  <span>Practice Loops</span>
                  <strong>Unlimited</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">{isLogin ? "Welcome Back" : "Create Account"}</span>
                <h2>{isLogin ? "Sign in to continue your prep" : "Start your interview practice journey"}</h2>
              </div>
            </div>

            <form onSubmit={submit}>
              {!isLogin ? (
                <>
                  <label className="form-label">Full Name</label>
                  <input className="form-control mb-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </>
              ) : null}

              <label className="form-label">Email</label>
              <input type="email" className="form-control mb-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

              <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                <label className="form-label mb-0">Password</label>
                {isLogin ? (
                  <button type="button" className="btn btn-link p-0 snx-inline-link" onClick={() => setShowForgotPassword((current) => !current)}>
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <input type="password" className="form-control mb-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

              {error ? <div className="alert alert-danger py-2">{error}</div> : null}

              <button className="btn snx-btn-primary w-100" disabled={loading}>
                {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>

            <p className="mt-4 mb-0 text-secondary">
              {isLogin ? "New to SkillNexa?" : "Already have an account?"}{" "}
              <Link to={isLogin ? "/signup" : "/login"} className="snx-inline-link text-decoration-none">
                {isLogin ? "Create an account" : "Sign in"}
              </Link>
            </p>

            {isLogin && showForgotPassword ? (
              <ForgotPasswordPanel onBack={() => setShowForgotPassword(false)} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
