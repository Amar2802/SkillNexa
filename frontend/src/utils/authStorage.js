const USER_KEY = "skillnexa_user";
const AUTH_NOTICE_KEY = "skillnexa_auth_notice";
const REMEMBER_ME_KEY = "skillnexa_remember_me";

let inMemoryAccessToken = "";

export const getAccessToken = () => inMemoryAccessToken;

export const setAccessToken = (token = "") => {
  inMemoryAccessToken = String(token || "").trim();
};

export const clearAccessToken = () => {
  inMemoryAccessToken = "";
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

export const setAuthSession = ({ accessToken, user, rememberMe } = {}) => {
  if (typeof rememberMe === "boolean" && typeof window !== "undefined") {
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? "true" : "false");
  }

  if (typeof accessToken === "string") {
    setAccessToken(accessToken);
  }

  if (user !== undefined) {
    setStoredUser(user);
  }
};

export const clearAuthSession = () => {
  clearAccessToken();
  clearStoredUser();
};

export const setAuthNotice = (message) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_NOTICE_KEY, String(message || ""));
};

export const consumeAuthNotice = () => {
  if (typeof window === "undefined") return "";
  const message = sessionStorage.getItem(AUTH_NOTICE_KEY) || "";
  if (message) {
    sessionStorage.removeItem(AUTH_NOTICE_KEY);
  }
  return message;
};

export const getRememberMePreference = () => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(REMEMBER_ME_KEY) !== "false";
};
