export const AUTH_ERROR_CODES = {
  MISSING: "AUTH_MISSING",
  MALFORMED: "AUTH_MALFORMED",
  INVALID: "AUTH_INVALID",
  EXPIRED: "AUTH_EXPIRED"
};
export { hashToken as hashOtp } from "./generateToken.js";

export const toSafeUser = (user) => {
  const source = typeof user?.toObject === "function" ? user.toObject() : { ...(user || {}) };
  delete source.password;
  delete source.passwordResetOtp;
  delete source.passwordResetOtpHash;
  delete source.passwordResetOtpExpiresAt;
  delete source.refreshTokenHash;
  delete source.refreshTokenExpiresAt;
  delete source.refreshSessionId;
  return source;
};
