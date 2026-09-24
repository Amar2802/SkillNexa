import express from "express";
import {
  getSubscriptionStatus,
  buySubscription,
  upgradeSubscription,
  cancelSubscription
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status", protect, getSubscriptionStatus);
router.post("/buy", protect, buySubscription);
router.post("/upgrade", protect, upgradeSubscription);
router.post("/cancel", protect, cancelSubscription);

export default router;
