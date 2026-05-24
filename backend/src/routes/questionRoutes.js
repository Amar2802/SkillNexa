import express from "express";
import { evaluateQuestion, getQuestions } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/:id/evaluate", protect, evaluateQuestion);

export default router;
