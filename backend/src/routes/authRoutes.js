import express from "express";
import {
  googleAuth,
  googleCallback,
  login,
  logout,
  requestPasswordResetOtp,
  refreshSession,
  resetPasswordWithOtp,
  signup
} from "../controllers/authController.js";
import {
  forgotPasswordRateLimiter,
  loginRateLimiter,
  resetPasswordRateLimiter
} from "../middleware/authRateLimitMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  signupValidator
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);
router.post("/login", loginRateLimiter, loginValidator, validateRequest, login);
router.post("/refresh", refreshSession);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordRateLimiter, forgotPasswordValidator, validateRequest, requestPasswordResetOtp);
router.post("/reset-password", resetPasswordRateLimiter, resetPasswordValidator, validateRequest, resetPasswordWithOtp);
router.get("/google", googleAuth);
router.get("/google/callback", ...googleCallback);

export default router;
