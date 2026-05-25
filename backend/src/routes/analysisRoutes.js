import express from "express";
import { analyzeAnswer } from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/answer", protect, analyzeAnswer);

export default router;
