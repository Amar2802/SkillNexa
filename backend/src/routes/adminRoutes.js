import express from "express";
import {
  getUsers,
  toggleUserAdmin,
  deleteUser,
  getPrompts,
  updatePrompt,
  getAdminAnalytics,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User management
router.get("/users", protect, isAdmin, getUsers);
router.put("/users/:id/role", protect, isAdmin, toggleUserAdmin);
router.delete("/users/:id", protect, isAdmin, deleteUser);

// Prompts management
router.get("/prompts", protect, isAdmin, getPrompts);
router.put("/prompts/:key", protect, isAdmin, updatePrompt);

// Analytics
router.get("/analytics", protect, isAdmin, getAdminAnalytics);

// Question management CRUD
router.post("/questions", protect, isAdmin, createQuestion);
router.put("/questions/:id", protect, isAdmin, updateQuestion);
router.delete("/questions/:id", protect, isAdmin, deleteQuestion);

export default router;
