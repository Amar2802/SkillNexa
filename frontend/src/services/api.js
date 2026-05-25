import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  setAuthNotice
} from "../utils/authStorage";

const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_API_URL = "https://skillnexa-backend.onrender.com/api";

const resolveBaseUrl = () => {
  const envUrl = String(import.meta.env.VITE_API_URL || "").trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "/api";
    }
  }

  return PROD_API_URL;
};

const baseURL = resolveBaseUrl();

const api = axios.create({
  baseURL,
  timeout: 40000,
  withCredentials: true
});

const refreshClient = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true
});

let refreshPromise = null;
let authFailureHandler = null;
let authRefreshHandler = null;

const isAuthFailure = (error) => {
  const status = error?.response?.status;
  const code = String(error?.response?.data?.code || "");
  return status === 401 && [
    "AUTH_MISSING",
    "AUTH_MALFORMED",
    "AUTH_INVALID",
    "AUTH_EXPIRED",
    "AUTH_REFRESH_MISSING",
    "AUTH_REFRESH_INVALID",
    "AUTH_REFRESH_EXPIRED"
  ].includes(code);
};

const shouldBypassRefresh = (config = {}) => {
  const url = String(config.url || "");
  return url.includes("/auth/login")
    || url.includes("/auth/signup")
    || url.includes("/auth/refresh")
    || url.includes("/auth/logout")
    || url.includes("/auth/google");
};

const performTokenRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        const session = response.data || {};
        setAccessToken(session.accessToken || "");
        if (authRefreshHandler) {
          authRefreshHandler(session);
        }
        return session;
      })
      .catch((error) => {
        clearAccessToken();
        if (error?.response?.status === 401 && authFailureHandler) {
          authFailureHandler(error);
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};

    if (!isAuthFailure(error) || originalRequest._retry || shouldBypassRefresh(originalRequest)) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const session = await performTokenRefresh();
      const nextToken = session?.accessToken || getAccessToken();
      if (nextToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      setAuthNotice(refreshError?.response?.data?.message || "Your session expired. Please sign in again.");
      return Promise.reject(refreshError);
    }
  }
);

export const registerAuthHandlers = ({ onAuthFailure, onAuthRefresh } = {}) => {
  authFailureHandler = onAuthFailure || null;
  authRefreshHandler = onAuthRefresh || null;
};

export const clearApiSession = () => {
  clearAccessToken();
};

export { performTokenRefresh };
export default api;
