import express from "express";
import { createTest, getTests, submitTest } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTests);
router.post("/", protect, createTest);
router.post("/:id/submit", protect, submitTest);

export default router;
