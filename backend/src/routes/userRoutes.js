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
  updateTargetField,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
  getLeaderboard,
  getPublicProfile,
  getRevisionData
} from "../controllers/userController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup/seed", seedQuestionsIfNeeded);
router.get("/users/profile", protect, getProfile);
router.put("/users/profile", protect, updateProfile);
router.put("/users/preferences", protect, updatePreferences);
router.put("/users/password", protect, changePassword);
router.delete("/users/account", protect, deleteAccount);
router.get("/leaderboard", optionalProtect, getLeaderboard);
router.get("/users/leaderboard", optionalProtect, getLeaderboard);
router.get("/users/public/:id", getPublicProfile);
router.post("/users/roadmap", protect, getRoadmap);
router.put("/users/profile/avatar", protect, updateAvatar);
router.put("/users/profile/interests", protect, updateInterests);
router.put("/users/profile/field", protect, updateTargetField);
router.get("/users/bookmarks", protect, getBookmarks);
router.post("/users/bookmarks/:questionId", protect, toggleBookmark);
router.get("/users/history", protect, getHistory);
router.get("/users/revision", protect, getRevisionData);

export default router;
