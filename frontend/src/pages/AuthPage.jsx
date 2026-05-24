import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import { consumeAuthNotice, getRememberMePreference } from "../utils/authStorage";

const getPasswordStrength = (value) => {
  const password = String(value || "");
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", className: "danger", percent: 25 };
  if (score === 2) return { label: "Fair", className: "warning", percent: 50 };
  if (score === 3) return { label: "Good", className: "info", percent: 75 };
  return { label: "Strong", className: "success", percent: 100 };
};

const ForgotPasswordPanel = ({ onBack, standalone = false }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtpRequest = async () => {
    const safeEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      const message = "Enter a valid registered email address.";
      setError(message);
      showToast(message, "error");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await authService.requestPasswordReset({ email: safeEmail });
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
    const safeEmail = email.trim().toLowerCase();
    if (!/^\d{6}$/.test(otp.trim())) {
      const message = "OTP must be a 6-digit code.";
      setError(message);
      showToast(message, "error");
      return;
    }

    if (password.trim().length < 6) {
      const message = "Password must be at least 6 characters long.";
      setError(message);
      showToast(message, "error");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await authService.resetPassword({ email: safeEmail, otp: otp.trim(), password });
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
    <div className={`snx-surface-card ${standalone ? "" : "mt-4"}`}>
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

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login, signup, authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(mode === "forgot");
  const [rememberMe, setRememberMe] = useState(getRememberMePreference);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);
  const resolveAuthErrorMessage = (err) => {
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }

    if (err?.code === "ECONNABORTED") {
      return "The server took too long to respond. If the backend was sleeping, please try again in a few seconds.";
    }

    if (err?.request) {
      return "Unable to reach the login service right now. This is usually a backend wake-up, network, or CORS issue.";
    }

    return "Authentication failed";
  };

  useEffect(() => {
    const pendingNotice = consumeAuthNotice();
    if (pendingNotice) {
      showToast(pendingNotice, "info");
    }

    const oauthError = new URLSearchParams(window.location.search).get("oauthError");
    if (oauthError) {
      setError(oauthError);
      showToast(oauthError, "error");
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, navigate, showToast]);

  const validateAuthForm = () => {
    const safeEmail = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return "Enter a valid email address.";
    }

    if (!isLogin && form.name.trim().length < 2) {
      return "Full name must be at least 2 characters long.";
    }

    if (form.password.trim().length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validateAuthForm();
    if (validationError) {
      setError(validationError);
      showToast(validationError, "error");
      return;
    }

    const safePayload = isLogin
      ? { email: form.email.trim().toLowerCase(), password: form.password }
      : { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password };

    try {
      setError("");
      if (isLogin) {
        await login({ ...safePayload, rememberMe });
      } else {
        await signup({ ...safePayload, rememberMe });
      }
      showToast(isLogin ? "Welcome back to SkillNexa." : "Account created successfully.", "success");
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message = resolveAuthErrorMessage(err);
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <div className="container-fluid py-4 snx-page-shell">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">SkillNexa</span>
                <h1 className="snx-page-title mt-3">
                  {isForgot ? "Reset your password securely" : isLogin ? "Sign in to continue your prep" : "Create your account to enter SkillNexa"}
                </h1>
                <p className="snx-page-subtitle">
                  {isForgot
                    ? "Recover access to your account and return to your interview workspace."
                    : isLogin
                      ? "Login to access your private dashboard, practice history, mock tests, and analytics."
                      : "Sign up first. Your dashboard, mock tests, analytics, and practice pages open only after authentication."}
                </p>
                <span className="snx-kicker">{isForgot ? "Password Recovery" : isLogin ? "Welcome Back" : "Create Account"}</span>
                <h2>{isForgot ? "Reset your password securely" : isLogin ? "Sign in to continue your prep" : "Start your interview practice journey"}</h2>
              </div>
            </div>

            {isForgot ? <ForgotPasswordPanel standalone onBack={() => navigate("/login")} /> : (
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
              <div className="position-relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control pe-5"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="btn btn-link snx-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isLogin ? (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-secondary">Password strength</small>
                    <small className={`text-${passwordStrength.className}`}>{passwordStrength.label}</small>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className={`progress-bar bg-${passwordStrength.className}`} style={{ width: `${passwordStrength.percent}%` }} />
                  </div>
                </div>
              ) : null}

              <div className="form-check mb-3">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <label htmlFor="rememberMe" className="form-check-label">
                  Remember me
                </label>
              </div>

              {error ? <div className="alert alert-danger py-2">{error}</div> : null}

              <button className="btn snx-btn-primary w-100" disabled={authLoading}>
                {authLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
              </button>

              <button
                type="button"
                className="btn snx-btn-secondary w-100 mt-3"
                onClick={() => authService.beginGoogleSignIn("Software")}
                disabled={authLoading}
              >
                Continue with Google
              </button>
            </form>
            )}

            {!isForgot ? (
              <p className="mt-4 mb-0 text-secondary">
                {isLogin ? "New to SkillNexa?" : "Already have an account?"}{" "}
                <Link to={isLogin ? "/signup" : "/login"} className="snx-inline-link text-decoration-none">
                  {isLogin ? "Create an account" : "Sign in"}
                </Link>
              </p>
            ) : null}

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
