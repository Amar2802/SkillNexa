import express from "express";
import {
  createEvaluation,
  getEvaluationAnalytics,
  getEvaluationById,
  getEvaluations
} from "../controllers/evaluationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvaluation);
router.get("/analytics", protect, getEvaluationAnalytics);
router.get("/", protect, getEvaluations);
router.get("/:id", protect, getEvaluationById);

export default router;
