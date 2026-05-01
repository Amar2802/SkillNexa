import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_API_URL = "https://skillnexa-backend.onrender.com/api";

const resolveBaseUrl = () => {
  const envUrl = String(import.meta.env.VITE_API_URL || "").trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return LOCAL_API_URL;
    }
  }

  return PROD_API_URL;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 25000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
