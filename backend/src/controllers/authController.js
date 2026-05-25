import bcrypt from "bcryptjs";
import passport from "passport";
import { isGoogleOAuthConfigured } from "../config/passport.js";
import User from "../models/User.js";
import { hashOtp, toSafeUser } from "../utils/auth.js";
import {
  generateSessionId,
  getRefreshTokenExpiryDate,
  hashToken,
  parseCookies,
  REFRESH_COOKIE_NAME,
  resolveRefreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/generateToken.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";
import { OTP_TTL_MINUTES, sendPasswordResetOtp } from "../utils/mailer.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");
const createOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;
const looksHashedPassword = (value) => /^\$2[aby]\$/.test(String(value || ""));
const getClientUrl = () => String(process.env.CLIENT_URL || "http://localhost:5173").trim().replace(/^['"]|['"]$/g, "");

const sanitizeInterests = (interests) => {
  if (!Array.isArray(interests)) return [];
  return interests.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
};

const clearPasswordResetState = (user) => {
  user.passwordResetOtp = undefined;
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpiresAt = undefined;
};

const clearRefreshSessionState = (user) => {
  user.refreshTokenHash = undefined;
  user.refreshTokenExpiresAt = undefined;
  user.refreshSessionId = undefined;
};

const verifyPassword = async (user, password) => {
  if (!user?.password) {
    console.warn("[Auth] User is missing a local password hash", { email: user?.email });
    return false;
  }

  if (looksHashedPassword(user.password)) {
    return bcrypt.compare(password, user.password);
  }

  if (String(user.password) === String(password)) {
    console.warn("[Auth] Migrating legacy plaintext password to bcrypt hash", { email: user.email });
    user.password = password;
    await user.save();
    return true;
  }

  return false;
};

const issueAuthSession = async ({ res, user, rememberMe = true }) => {
  const sessionId = generateSessionId();
  const refreshToken = signRefreshToken({ user, sessionId, rememberMe });
  const accessToken = signAccessToken(user);

  user.refreshSessionId = sessionId;
  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = getRefreshTokenExpiryDate();
  await user.save();

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, resolveRefreshCookieOptions(rememberMe));

  return {
    accessToken,
    user: toSafeUser(user)
  };
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, resolveRefreshCookieOptions(true));
};

const findUserFromRefreshCookie = async (req) => {
  const cookies = parseCookies(req.headers.cookie);
  const refreshToken = cookies[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return { refreshToken: "", user: null, decoded: null };
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    return { refreshToken, user, decoded };
  } catch {
    return { refreshToken, user: null, decoded: null };
  }
};

const buildOauthFailureRedirect = (message) =>
  `${getClientUrl()}/login?oauthError=${encodeURIComponent(message)}`;

export const signup = async (req, res) => {
  try {
    const { name, email, password, targetField, interests, rememberMe = true } = req.body;
    const safeName = String(name || "").trim();
    const safeEmail = String(email || "").trim().toLowerCase();
    const safePassword = String(password || "");

    if (!safeName || !safeEmail || !safePassword) {
      return res.status(400).json({ message: "All fields are required", code: "AUTH_FIELDS_REQUIRED" });
    }

    if (await User.findOne({ email: safeEmail })) {
      return res.status(409).json({ message: "User already exists", code: "AUTH_DUPLICATE_EMAIL" });
    }

    const safeField = normalizeTargetField(targetField);
    const safeInterests = sanitizeInterests(interests);

    const user = await User.create({
      name: safeName,
      email: safeEmail,
      password: safePassword,
      targetField: safeField,
      interests: safeInterests,
      progress: {
        testsTaken: 0,
        accuracy: 0,
        weakTopics: [],
        recommendedTopics: FIELD_DEFAULT_TOPICS[safeField] || FIELD_DEFAULT_TOPICS.Software
      }
    });

    const session = await issueAuthSession({ res, user, rememberMe: Boolean(rememberMe) });
    console.info("[Auth] Signup successful", { email: user.email, userId: String(user._id) });
    return res.status(201).json(session);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "User already exists", code: "AUTH_DUPLICATE_EMAIL" });
    }

    console.error("[Auth] Signup failed", { message: error?.message, name: error?.name });
    return res.status(500).json({ message: error?.message || "Unable to create account right now", code: "AUTH_SIGNUP_FAILED" });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const rememberMe = req.body.rememberMe !== false;
    const user = await User.findOne({ email });

    if (!user) {
      console.warn("[Auth] Login failed: user not found", { email });
      return res.status(401).json({ message: "Invalid credentials", code: "AUTH_INVALID_CREDENTIALS" });
    }

    const passwordMatches = await verifyPassword(user, password);
    if (!passwordMatches) {
      console.warn("[Auth] Login failed: password mismatch", { email });
      return res.status(401).json({ message: "Invalid credentials", code: "AUTH_INVALID_CREDENTIALS" });
    }

    const safeField = normalizeTargetField(user.targetField);
    if (user.targetField !== safeField) {
      user.targetField = safeField;
      user.progress = {
        ...(user.progress || {}),
        recommendedTopics: FIELD_DEFAULT_TOPICS[safeField] || FIELD_DEFAULT_TOPICS.Software
      };
    }

    const session = await issueAuthSession({ res, user, rememberMe: Boolean(rememberMe) });
    console.info("[Auth] Login successful", { email, userId: String(user._id) });
    return res.json(session);
  } catch (error) {
    console.error("[Auth] Login failed unexpectedly", { message: error?.message, name: error?.name });
    return res.status(500).json({ message: error?.message || "Unable to log in right now", code: "AUTH_LOGIN_FAILED" });
  }
};

export const refreshSession = async (req, res) => {
  try {
    const { refreshToken, user, decoded } = await findUserFromRefreshCookie(req);

    if (!refreshToken || !user || !decoded) {
      return res.status(401).json({ message: "Unauthorized", code: "AUTH_REFRESH_MISSING" });
    }

    if (!user.refreshTokenHash || !user.refreshTokenExpiresAt || !user.refreshSessionId) {
      return res.status(401).json({ message: "Unauthorized", code: "AUTH_REFRESH_INVALID" });
    }

    if (user.refreshTokenExpiresAt.getTime() < Date.now()) {
      clearRefreshSessionState(user);
      await user.save();
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Session expired", code: "AUTH_REFRESH_EXPIRED" });
    }

    if (user.refreshSessionId !== decoded.sessionId || user.refreshTokenHash !== hashToken(refreshToken)) {
      clearRefreshSessionState(user);
      await user.save();
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Invalid refresh token", code: "AUTH_REFRESH_INVALID" });
    }

    const accessToken = signAccessToken(user);
    const rememberMe = decoded.persistent !== false;
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, resolveRefreshCookieOptions(rememberMe));

    return res.json({
      accessToken,
      user: toSafeUser(user)
    });
  } catch (error) {
    clearRefreshCookie(res);
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired", code: "AUTH_REFRESH_EXPIRED" });
    }

    console.warn("[Auth] Refresh failed", { name: error?.name, message: error?.message });
    return res.status(401).json({ message: "Invalid refresh token", code: "AUTH_REFRESH_INVALID" });
  }
};

export const logout = async (req, res) => {
  try {
    const { user } = await findUserFromRefreshCookie(req);
    if (user) {
      clearRefreshSessionState(user);
      await user.save();
    }
  } catch (error) {
    console.warn("[Auth] Logout cleanup skipped", { message: error?.message });
  }

  clearRefreshCookie(res);
  return res.json({ message: "Logged out successfully" });
};

export const requestPasswordResetOtp = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.info("[Auth] Password reset requested for unknown email", { email });
    return res.json({ message: "If an account with that email exists, an OTP has been sent." });
  }

  const otp = createOtp();
  clearPasswordResetState(user);
  user.passwordResetOtpHash = hashOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetOtp({ email: user.email, name: user.name, otp });
    res.json({ message: "OTP sent to your email address." });
  } catch (error) {
    clearPasswordResetState(user);
    await user.save();
    res.status(503).json({ message: error.message || "Unable to send OTP right now.", code: "AUTH_OTP_SEND_FAILED" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();
  const password = String(req.body.password || "");

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const user = await User.findOne({ email });
  if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP", code: "AUTH_OTP_INVALID" });
  }

  if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
    clearPasswordResetState(user);
    await user.save();
    return res.status(400).json({ message: "OTP expired. Please request a new code.", code: "AUTH_OTP_EXPIRED" });
  }

  if (user.passwordResetOtpHash !== hashOtp(otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP", code: "AUTH_OTP_INVALID" });
  }

  user.password = password;
  clearPasswordResetState(user);
  clearRefreshSessionState(user);
  await user.save();

  clearRefreshCookie(res);
  res.json({ message: "Password reset successful. You can log in now." });
};

export const googleAuth = (req, res, next) => {
  if (!isGoogleOAuthConfigured) {
    return res.redirect(buildOauthFailureRedirect("Google sign-in is not configured correctly on the server."));
  }

  const safeField = normalizeTargetField(req.query.targetField);
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: safeField
  })(req, res, next);
};

export const googleCallback = [
  passport.authenticate("google", {
    session: false,
    failureRedirect: buildOauthFailureRedirect("Google authentication failed. Check client credentials and callback URL.")
  }),
  async (req, res) => {
    const rememberMe = true;
    const session = await issueAuthSession({ res, user: req.user, rememberMe });
    res.redirect(`${getClientUrl()}/oauth-success?accessToken=${encodeURIComponent(session.accessToken)}`);
  }
];
