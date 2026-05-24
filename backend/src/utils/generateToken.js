import crypto from "crypto";
import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_DAYS = 14;
export const REFRESH_COOKIE_NAME = "skillnexa_refresh";

const sanitizeEnvValue = (value) => String(value || "").trim().replace(/^['"]|['"]$/g, "");

export const requireJwtSecret = () => {
  const secret = sanitizeEnvValue(process.env.JWT_SECRET);
  if (!secret) {
    throw new Error("JWT_SECRET is missing. Set it in the environment before starting the backend.");
  }
  return secret;
};

export const requireRefreshJwtSecret = () => {
  const secret = sanitizeEnvValue(process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET or JWT_SECRET is missing. Set it in the environment before starting the backend.");
  }
  return secret;
};

export const signAccessToken = (user) => {
  const safeUser = user || {};
  return jwt.sign(
    {
      id: String(safeUser._id || safeUser.id || ""),
      email: String(safeUser.email || "").toLowerCase(),
      type: "access"
    },
    requireJwtSecret(),
    { expiresIn: ACCESS_TOKEN_TTL }
  );
};

export const signRefreshToken = ({ user, sessionId, rememberMe = true }) => {
  const safeUser = user || {};
  return jwt.sign(
    {
      id: String(safeUser._id || safeUser.id || ""),
      email: String(safeUser.email || "").toLowerCase(),
      sessionId: String(sessionId || ""),
      persistent: Boolean(rememberMe),
      type: "refresh"
    },
    requireRefreshJwtSecret(),
    { expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` }
  );
};

export const verifyAccessToken = (token) => jwt.verify(token, requireJwtSecret());
export const verifyRefreshToken = (token) => jwt.verify(token, requireRefreshJwtSecret());

export const hashToken = (value) =>
  crypto.createHash("sha256").update(String(value || "")).digest("hex");

export const generateSessionId = () => crypto.randomUUID();

export const getRefreshTokenExpiryDate = () =>
  new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

export const parseCookies = (cookieHeader) => String(cookieHeader || "")
  .split(";")
  .map((part) => part.trim())
  .filter(Boolean)
  .reduce((accumulator, entry) => {
    const separatorIndex = entry.indexOf("=");
    if (separatorIndex === -1) return accumulator;
    const key = entry.slice(0, separatorIndex).trim();
    const value = entry.slice(separatorIndex + 1).trim();
    accumulator[key] = decodeURIComponent(value);
    return accumulator;
  }, {});

export const resolveRefreshCookieOptions = (rememberMe = true) => {
  const clientUrl = sanitizeEnvValue(process.env.CLIENT_URL || "");
  const secure = /^https:\/\//i.test(clientUrl) || process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/api/auth",
    ...(rememberMe ? { maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000 } : {})
  };
};
