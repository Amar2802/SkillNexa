import User from "../models/User.js";
import { AUTH_ERROR_CODES } from "../utils/auth.js";
import { verifyAccessToken } from "../utils/generateToken.js";

const unauthorized = (res, message, code) =>
  res.status(401).json({ message, code });

export const protect = async (req, res, next) => {
  const authHeader = String(req.headers.authorization || "").trim();

  if (!authHeader) {
    console.warn("[Auth] Missing authorization header", { path: req.originalUrl });
    return unauthorized(res, "Unauthorized", AUTH_ERROR_CODES.MISSING);
  }

  const [scheme, token, extra] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token || extra) {
    console.warn("[Auth] Malformed authorization header", { path: req.originalUrl });
    return unauthorized(res, "Unauthorized", AUTH_ERROR_CODES.MALFORMED);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.warn("[Auth] Token resolved to missing user", { userId: decoded.id, path: req.originalUrl });
      return unauthorized(res, "Unauthorized", AUTH_ERROR_CODES.INVALID);
    }

    req.auth = { userId: String(req.user._id), email: req.user.email };
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      console.warn("[Auth] Token expired", { path: req.originalUrl });
      return unauthorized(res, "Session expired", AUTH_ERROR_CODES.EXPIRED);
    }

    console.warn("[Auth] Token verification failed", {
      path: req.originalUrl,
      name: error?.name,
      message: error?.message
    });
    return unauthorized(res, "Invalid token", AUTH_ERROR_CODES.INVALID);
  }
};
