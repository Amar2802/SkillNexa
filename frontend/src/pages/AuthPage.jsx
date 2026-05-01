import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/client";
import { useToast } from "../components/ui/ToastProvider";

const featureCards = [
  { title: "AI mock interviews", copy: "Generate realistic, role-based interview rounds with smart follow-up prompts." },
  { title: "Progress analytics", copy: "Track scores, consistency, and topic readiness in one placement-ready dashboard." },
  { title: "Question workflow", copy: "Move from discovery to practice to review without losing momentum." }
];

const ForgotPasswordPanel = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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
      showToast("Password reset successful. You can sign in now.", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to reset password.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="snx-panel-strong mt-6 p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className="snx-badge">Password Recovery</span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Recover your account securely</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use email OTP verification to set a new password and get back into your workspace.</p>
        </div>
        <button type="button" className="snx-button-secondary px-4 py-2 text-xs" onClick={onBack}>Back</button>
      </div>

      {step === 1 ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Registered email</label>
            <input type="email" className="snx-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {status ? <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">{status}</div> : null}
          <button className="snx-button-primary w-full" disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</button>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={resetPassword} className="space-y-4">
          <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {status || "OTP sent to your email address."}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">OTP</label>
            <input type="text" className="snx-input" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
            <input type="password" className="snx-input" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="snx-button-primary flex-1" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</button>
            <button type="button" className="snx-button-secondary flex-1" disabled={loading} onClick={sendOtpRequest}>Resend OTP</button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div>
          <button type="button" className="snx-button-primary w-full" onClick={onBack}>Return to login</button>
        </div>
      ) : null}
    </motion.div>
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

  const stats = useMemo(() => [
    { label: "Interview paths", value: "12+" },
    { label: "AI evaluations", value: "Instant" },
    { label: "Practice loops", value: "Unlimited" }
  ], []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
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
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="snx-panel-strong relative overflow-hidden p-8 md:p-10"
        >
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col">
            <span className="snx-badge mb-6 w-fit">AI Interview Preparation Platform</span>
            <h1 className="snx-title max-w-2xl">
              Turn interview preparation into a guided, AI-powered workflow employers will notice.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              SkillNexa helps you generate interview rounds, practice company-style questions, review mistakes, and build confidence with fast feedback and a clean placement-ready experience.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="snx-stat-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featureCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  whileHover={{ y: -4 }}
                  className="snx-panel p-5"
                >
                  <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{card.copy}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="snx-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Built for portfolio, placement, and interview confidence</p>
                  <p className="mt-1 text-sm text-slate-500">A modern practice environment that feels like a real AI product, not just a form screen.</p>
                </div>
                <span className="snx-badge">Modern SaaS UX</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className="flex flex-col justify-center"
        >
          <div className="snx-panel-strong p-6 md:p-8">
            <div className="mb-6">
              <span className="snx-badge">{isLogin ? "Welcome Back" : "Create Account"}</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {isLogin ? "Sign in to continue your interview prep" : "Start your AI-powered prep journey"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Access your dashboard, mock tests, saved questions, and AI interviewer."
                  : "Create your workspace and unlock guided practice, analytics, and interview generation."}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {!isLogin ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input className="snx-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              ) : null}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input type="email" className="snx-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  {isLogin ? (
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
                      onClick={() => {
                        setShowForgotPassword((current) => !current);
                        setError("");
                      }}
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
                <input type="password" className="snx-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
              <button className="snx-button-primary w-full" disabled={loading}>
                {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign in" : "Create account")}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-500">
              {isLogin ? "New to SkillNexa?" : "Already have an account?"}{" "}
              <Link to={isLogin ? "/signup" : "/login"} className="font-semibold text-brand-600 no-underline hover:text-brand-700">
                {isLogin ? "Create an account" : "Sign in"}
              </Link>
            </p>

            <AnimatePresence>
              {isLogin && showForgotPassword ? (
                <ForgotPasswordPanel onBack={() => setShowForgotPassword(false)} />
              ) : null}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthPage;
