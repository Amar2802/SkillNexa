import express from "express";
import { getRoadmaps, toggleTopicComplete } from "../controllers/roadmapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getRoadmaps);
router.post("/toggle-complete", protect, toggleTopicComplete);

export default router;
