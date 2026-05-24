import express from "express";
import {
  getBookmarks,
  getHistory,
  getProfile,
  getRoadmap,
  seedQuestionsIfNeeded,
  toggleBookmark,
  updateAvatar,
  updateInterests,
  updateTargetField
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup/seed", seedQuestionsIfNeeded);
router.get("/users/profile", protect, getProfile);
router.post("/users/roadmap", protect, getRoadmap);
router.put("/users/profile/avatar", protect, updateAvatar);
router.put("/users/profile/interests", protect, updateInterests);
router.put("/users/profile/field", protect, updateTargetField);
router.get("/users/bookmarks", protect, getBookmarks);
router.post("/users/bookmarks/:questionId", protect, toggleBookmark);
router.get("/users/history", protect, getHistory);

export default router;
