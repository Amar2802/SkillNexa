import rateLimit from "express-rate-limit";

const baseLimiter = (windowMs, max, message, code) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ message, code });
    }
  });

export const loginRateLimiter = baseLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please try again later.",
  "AUTH_RATE_LIMIT_LOGIN"
);

export const forgotPasswordRateLimiter = baseLimiter(
  15 * 60 * 1000,
  5,
  "Too many password reset requests. Please try again later.",
  "AUTH_RATE_LIMIT_FORGOT_PASSWORD"
);

export const resetPasswordRateLimiter = baseLimiter(
  15 * 60 * 1000,
  10,
  "Too many password reset attempts. Please try again later.",
  "AUTH_RATE_LIMIT_RESET_PASSWORD"
);
