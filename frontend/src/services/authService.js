import api, { performTokenRefresh } from "./api";

const resolveServerUrl = () => {
  const envServerUrl = String(import.meta.env.VITE_SERVER_URL || "").trim();
  if (envServerUrl) return envServerUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }

  return "https://skillnexa-backend.onrender.com";
};

export const authService = {
  login(payload) {
    return api.post("/auth/login", payload).then((response) => response.data);
  },
  signup(payload) {
    return api.post("/auth/signup", payload).then((response) => response.data);
  },
  requestPasswordReset(payload) {
    return api.post("/auth/forgot-password", payload).then((response) => response.data);
  },
  resetPassword(payload) {
    return api.post("/auth/reset-password", payload).then((response) => response.data);
  },
  restoreSession() {
    return performTokenRefresh();
  },
  logout() {
    return api.post("/auth/logout").then((response) => response.data);
  },
  fetchProfile() {
    return api.get("/users/profile", { timeout: 25000 }).then((response) => response.data);
  },
  beginGoogleSignIn(targetField = "Software") {
    const serverUrl = resolveServerUrl();
    window.location.assign(`${serverUrl}/api/auth/google?targetField=${encodeURIComponent(targetField)}`);
  }
};
