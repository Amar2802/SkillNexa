import express from "express";
import {
  googleAuth,
  googleCallback,
  login,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  signup
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", requestPasswordResetOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.get("/google", googleAuth);
router.get("/google/callback", ...googleCallback);

export default router;
