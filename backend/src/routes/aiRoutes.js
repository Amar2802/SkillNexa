import express from "express";
import { evaluateInterviewAnswer, generateInterviewQuestions, getRecommendations, finishInterviewSession } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/questions", protect, generateInterviewQuestions);
router.post("/evaluate", protect, evaluateInterviewAnswer);
router.post("/recommendations", protect, getRecommendations);
router.post("/finish", protect, finishInterviewSession);

export default router;
