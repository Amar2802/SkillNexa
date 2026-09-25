
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiEye, FiEyeOff, FiMail, FiX, FiPlay } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import { consumeAuthNotice, getRememberMePreference } from "../utils/authStorage";
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
              type="submit"
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
  const { login, signup, loginAsDemo, authLoading } = useAuth();

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

  if (mode === "none") {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {authPanelOpen || isForgot ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
          >
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            />

            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-2xl dark:border-slate-800 text-slate-900 dark:text-white">
              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-1 dark:border-slate-800">
                    <button
                      type="button"
                      className={`inline-flex min-w-[100px] items-center justify-center rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
                        isLogin
                          ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className={`inline-flex min-w-[100px] items-center justify-center rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
                        isSignup
                          ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
                    onClick={closeModal}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 uppercase tracking-wider">
                        {isForgot
                          ? "Recover access"
                          : "Secure sign in"}
                      </span>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {isForgot
                          ? "Reset password"
                          : isLogin
                          ? "Sign in to continue"
                          : "Create your account"}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {isForgot
                        ? "Restore access and return to your training dashboard with a secure OTP flow."
                        : isLogin
                        ? "Access your private dashboard, mock interviews, analytics, and guided practice flows."
                        : "Get a premium AI-powered preparation workspace for interviews, revision, and performance tracking."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-6 dark:border-slate-800 shadow-subtle">
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
                          <label className="block space-y-1.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Full name
                            </span>

                            <input
                              className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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

                        <label className="block space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Email
                          </span>

                          <div className="relative">
                            <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                              type="email"
                              className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] pl-10 pr-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Password
                            </span>

                            {isLogin ? (
                              <button
                                type="button"
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
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
                              className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] pl-3 pr-10 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Strength
                              </span>

                              <span className="font-semibold text-slate-600 dark:text-slate-400">
                                {passwordStrength.label}
                              </span>
                            </div>

                            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
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

                        {!isLogin ? (
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</span>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    confirmPassword: e.target.value
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                              id="rememberMe"
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
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
                            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
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
                          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                            {error}
                          </div>
                        ) : null}

                        <div className="space-y-2 pt-1">
                          <button
                            type="submit"
                            className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-subtle disabled:opacity-50"
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
                            className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

                          <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-[var(--snx-border)] dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                              <span className="bg-[var(--snx-surface-subtle)] px-2 text-slate-400">or explore platform</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="w-full h-10 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 dark:text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                            onClick={() => {
                              loginAsDemo();
                              navigate("/dashboard");
                            }}
                          >
                            <FiPlay className="h-3.5 w-3.5" />
                            <span>Launch Instant Demo (Zero Setup)</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {!isForgot ? (
                      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                        {isLogin
                          ? "Don't have an account?"
                          : "Already have an account?"}

                        <button
                          type="button"
                          className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
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
    </>
  );
};

export default AuthPage;

