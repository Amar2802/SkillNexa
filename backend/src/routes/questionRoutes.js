import express from "express";
import { evaluateQuestion, getQuestions, recordQuestionView } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/:id/evaluate", protect, evaluateQuestion);
router.post("/:id/view", protect, recordQuestionView);

export default router;
