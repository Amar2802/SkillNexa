
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiEye, FiEyeOff, FiMail, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import { consumeAuthNotice, getRememberMePreference } from "../utils/authStorage";
import SkillNexaLogo from "../components/SkillNexaLogo";
import SurfaceCard from "../components/ui/SurfaceCard";

const trustMetrics = [
  { label: "Interview prompts", value: "1000+" },
  { label: "Company patterns", value: "Top-tier" },
  { label: "Preparation loops", value: "Guided" }
];

const featureBullets = [
  "Generate professional AI mock interviews tailored to your role and skills",
  "Practice coding, aptitude, HR, and core subjects in one premium workflow",
  "Track improvement through mock tests, bookmarks, and AI feedback summaries"
];

const showcaseCards = [
  {
    title: "AI Mock Interviews",
    body: "Simulate interviewer-quality conversations with progressive difficulty and targeted follow-ups."
  },
  {
    title: "Resume-Ready Preparation",
    body: "Turn your current skills into a clear revision roadmap with company-aware practice suggestions."
  },
  {
    title: "Startup-grade UX",
    body: "Clean dashboards, responsive practice screens, and modern flows built for real product teams."
  }
];

const getPasswordStrength = (value) => {
  const password = String(value || "");
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { label: "Weak", width: "25%", tone: "bg-rose-500" };
  }

  if (score === 2) {
    return { label: "Fair", width: "50%", tone: "bg-amber-500" };
  }

  if (score === 3) {
    return { label: "Good", width: "75%", tone: "bg-sky-500" };
  }

  return { label: "Strong", width: "100%", tone: "bg-emerald-500" };
};

const ForgotPasswordPanel = ({ onBack, standalone = false }) => {
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      const data = await authService.requestPasswordReset({
        email: safeEmail
      });

      setStatus(data.message || "OTP sent to your email address.");
      setStep(2);

      showToast("Password reset OTP sent successfully.", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to send OTP right now.";

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

      const data = await authService.resetPassword({
        email: safeEmail,
        otp: otp.trim(),
        password
      });

      setStatus(data.message || "Password reset successful.");
      setStep(3);

      showToast("Password updated successfully.", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to reset password.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SurfaceCard
      strong
      className={`${standalone ? "" : "mt-6"} space-y-5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="snx-kicker">Password recovery</span>

          <h2 className="snx-heading text-2xl">
            Reset your access securely
          </h2>

          <p className="snx-subcopy">
            We will email a one-time code and help you recover
            your workspace without affecting existing backend flows.
          </p>
        </div>

        <button
          type="button"
          className="snx-btn-secondary shrink-0"
          onClick={onBack}
        >
          Back
        </button>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Registered email
            </span>

            <input
              type="email"
              className="snx-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            className="snx-btn-accent w-full"
            onClick={sendOtpRequest}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <form onSubmit={resetPassword} className="space-y-4">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
            {status}
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              OTP
            </span>

            <input
              type="text"
              className="snx-input"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              New password
            </span>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="snx-input pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="snx-btn-accent flex-1"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="snx-btn-secondary"
              onClick={sendOtpRequest}
              disabled={loading}
            >
              Resend
            </button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {status}
          </div>

          <button
            type="button"
            className="snx-btn-accent w-full"
            onClick={onBack}
          >
            Return to Login
          </button>
        </div>
      ) : null}
    </SurfaceCard>
  );
};

const AuthPage = ({ mode = "none" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();
  const { login, signup, authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(
    getRememberMePreference
  );

  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(mode === "forgot");

  const [authPanelOpen, setAuthPanelOpen] = useState(
    mode === "login" ||
      mode === "signup" ||
      mode === "forgot"
  );

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  useEffect(() => {
    const pendingNotice = consumeAuthNotice();

    if (pendingNotice) {
      showToast(pendingNotice, "info");
    }

    const oauthError = new URLSearchParams(
      window.location.search
    ).get("oauthError");

    if (oauthError) {
      setError(oauthError);
      showToast(oauthError, "error");

      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, navigate, showToast]);

  useEffect(() => {
    setAuthPanelOpen(
      mode === "login" ||
        mode === "signup" ||
        mode === "forgot"
    );

    setShowForgotPassword(mode === "forgot");
  }, [mode]);

  const resolveAuthErrorMessage = (err) => {
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }

    if (err?.code === "ECONNABORTED") {
      return "The server took too long to respond. If the backend was waking up, please try again in a few seconds.";
    }

    if (err?.request) {
      return "Unable to reach the authentication service right now. Please check your connection and try again.";
    }

    return "Authentication failed";
  };

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

    if (
      !isLogin &&
      form.password !== form.confirmPassword
    ) {
      return "Password and confirm password must match.";
    }

    if (!isLogin && !form.agreeToTerms) {
      return "Please accept the terms to create your account.";
    }

    return "";
  };

  const closeModal = () => {
    navigate("/");
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
      ? {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rememberMe
        }
      : {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rememberMe
        };

    try {
      setError("");

      if (isLogin) {
        await login(safePayload);
      } else {
        await signup(safePayload);
      }

      showToast(
        isLogin
          ? "Welcome back to SkillNexa."
          : "Account created successfully.",
        "success"
      );

      const redirectPath =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message = resolveAuthErrorMessage(err);

      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <section
        id="hero"
        className="space-y-8 px-4 py-12 sm:px-6 md:py-20"
      >
        <div className="snx-gradient-border overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg-soft backdrop-blur-xl">
          <div className="snx-panel relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-100/40 to-transparent" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(320px,380px)]">
              <div className="space-y-6 py-8 lg:py-12">
                <div className="space-y-4">
                  <span className="snx-kicker">
                    Premium AI Interview Platform
                  </span>

                  <h1 className="snx-display-lg text-5xl">
                    Crack interviews with AI-powered preparation.
                  </h1>

                  <p className="snx-body max-w-2xl text-slate-custom-600">
                    Generate company-quality mock interviews,
                    practice coding and communication, track your
                    performance, and stay ready for top product
                    companies.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {trustMetrics.map((item) => (
                    <div key={item.label} className="snx-card">
                      <div className="text-3xl font-bold text-indigo-600">
                        {item.value}
                      </div>

                      <div className="mt-2 text-sm text-slate-custom-600">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex flex-col py-8 lg:py-12">
                <div className="snx-glass-dark rounded-xl p-6 flex-1">
                  <div className="mb-5 flex items-center justify-between">
                    <SkillNexaLogo showTagline={false} />

                    <span className="snx-badge-primary text-xs">
                      AI SaaS
                    </span>
                  </div>

                  <div className="space-y-4">
                    {featureBullets.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <FiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-accent-400" />

                        <p className="text-sm leading-6 text-white/80">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {showcaseCards.map((card) => (
                    <div key={card.title} className="snx-card">
                      <span className="snx-badge-primary text-xs mb-2">
                        Feature
                      </span>

                      <h3 className="text-base font-semibold text-slate-custom-900">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-custom-600">
                        {card.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {authPanelOpen || isForgot ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
          >
            <div
              className="absolute inset-0 bg-slate-custom-950/50 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            />

            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-elevation-3 backdrop-blur-xl">
              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-custom-100 p-1 shadow-sm">
                    <button
                      type="button"
                      className={`inline-flex min-w-[100px] items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isLogin
                          ? "bg-white text-slate-custom-900 shadow-sm"
                          : "text-slate-custom-600 hover:text-slate-custom-900"
                      }`}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className={`inline-flex min-w-[100px] items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isSignup
                          ? "bg-white text-slate-custom-900 shadow-sm"
                          : "text-slate-custom-600 hover:text-slate-custom-900"
                      }`}
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </button>
                  </div>

                  <button
                    type="button"
                    className="snx-btn-secondary snx-btn-sm"
                    onClick={closeModal}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-4">
                    <div>
                      <span className="snx-kicker">
                        {isForgot
                          ? "Recover access"
                          : "Secure sign in"}
                      </span>

                      <h2 className="snx-heading-2 mt-2">
                        {isForgot
                          ? "Reset password"
                          : isLogin
                          ? "Sign in to continue"
                          : "Create your account"}
                      </h2>
                    </div>

                    <p className="snx-body max-w-2xl">
                      {isForgot
                        ? "Restore access and return to your training dashboard with a secure OTP flow."
                        : isLogin
                        ? "Access your private dashboard, mock interviews, analytics, and guided practice flows."
                        : "Get a premium AI-powered preparation workspace for interviews, revision, and performance tracking."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-custom-200/60 bg-slate-custom-50 p-6 shadow-sm-soft">
                    {isForgot ? (
                      <ForgotPasswordPanel
                        onBack={() => navigate("/login")}
                        standalone
                      />
                    ) : (
                      <form
                        onSubmit={submit}
                        className="space-y-4"
                      >
                        {!isLogin ? (
                          <label className="block space-y-2">
                            <span className="snx-label">
                              Full name
                            </span>

                            <input
                              className="snx-input"
                              value={form.name}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  name: e.target.value
                                })
                              }
                              required
                            />
                          </label>
                        ) : null}

                        <label className="block space-y-2">
                          <span className="snx-label">
                            Email
                          </span>

                          <div className="relative">
                            <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-400" />

                            <input
                              type="email"
                              className="snx-input pl-10"
                              value={form.email}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  email: e.target.value
                                })
                              }
                              required
                            />
                          </div>
                        </label>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="snx-label">
                              Password
                            </span>

                            {isLogin ? (
                              <button
                                type="button"
                                className="snx-link text-xs"
                                onClick={() =>
                                  navigate("/forgot-password")
                                }
                              >
                                Forgot?
                              </button>
                            ) : null}
                          </div>

                          <div className="relative">
                            <input
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              className="snx-input pr-10"
                              value={form.password}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  password: e.target.value
                                })
                              }
                              required
                            />

                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-custom-400 hover:text-slate-custom-600"
                              onClick={() =>
                                setShowPassword(
                                  (current) => !current
                                )
                              }
                            >
                              {showPassword ? (
                                <FiEyeOff className="h-4 w-4" />
                              ) : (
                                <FiEye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {!isLogin ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="snx-label">
                                Strength
                              </span>

                              <span className="font-semibold text-slate-custom-600">
                                {passwordStrength.label}
                              </span>
                            </div>

                            <div className="h-1.5 rounded-full bg-slate-custom-200">
                              <div
                                className={`h-1.5 rounded-full transition-all ${passwordStrength.tone}`}
                                style={{
                                  width:
                                    passwordStrength.width
                                }}
                              />
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <label className="flex items-center gap-2 text-slate-custom-600">
                            <input
                              id="rememberMe"
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-custom-300 text-indigo-600"
                              checked={rememberMe}
                              onChange={(event) =>
                                setRememberMe(
                                  event.target.checked
                                )
                              }
                            />

                            <span>Remember me</span>
                          </label>

                          {!isLogin ? (
                            <label className="flex items-center gap-2 text-slate-custom-600">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-custom-300 text-indigo-600"
                                checked={
                                  form.agreeToTerms
                                }
                                onChange={(event) =>
                                  setForm((current) => ({
                                    ...current,
                                    agreeToTerms:
                                      event.target.checked
                                  }))
                                }
                              />

                              <span>
                                I agree to terms
                              </span>
                            </label>
                          ) : null}
                        </div>

                        {error ? (
                          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                            {error}
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <button
                            className="snx-btn-primary w-full"
                            disabled={authLoading}
                          >
                            {authLoading
                              ? isLogin
                                ? "Signing in..."
                                : "Creating..."
                              : isLogin
                              ? "Sign In"
                              : "Create Account"}

                            <FiArrowRight className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            className="snx-btn-secondary w-full"
                            onClick={() =>
                              authService.beginGoogleSignIn(
                                "Software"
                              )
                            }
                            disabled={authLoading}
                          >
                            <FcGoogle className="h-5 w-5" />
                            Continue with Google
                          </button>
                        </div>
                      </form>
                    )}

                    {!isForgot ? (
                      <p className="mt-4 text-xs text-slate-custom-600 text-center">
                        {isLogin
                          ? "Don't have an account?"
                          : "Already have an account?"}

                        <button
                          type="button"
                          className="ml-1 font-semibold text-indigo-600 transition hover:text-indigo-700"
                          onClick={() =>
                            navigate(
                              isLogin
                                ? "/signup"
                                : "/login"
                            )
                          }
                        >
                          {isLogin ? "Sign Up" : "Login"}
                        </button>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;

