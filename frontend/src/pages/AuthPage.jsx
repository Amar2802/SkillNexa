import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

const AuthPage = ({ mode, onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(
        isLogin ? "/auth/login" : "/auth/signup",
        isLogin ? { email: form.email, password: form.password } : form
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
                  Practice interviews, solve coding rounds, and track your progress with AI feedback.
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
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  <button className="btn btn-info w-100">{isLogin ? "Login" : "Sign Up"}</button>
                </form>
                <a className="btn btn-outline-light w-100 mt-3" href={`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/auth/google`}>
                  Continue with Google
                </a>
                <p className="mt-4 mb-0 text-secondary">
                  {isLogin ? "New here?" : "Already registered?"} <Link to={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Login"}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
