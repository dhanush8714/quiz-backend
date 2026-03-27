import express from "express";
import {
  getQuestions,
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats,
} from "../controllers/questionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📋 Admin – get ALL questions
router.get("/admin/all", protect, adminOnly, getAllQuestions);

// 📊 Admin – stats
router.get("/admin/stats", protect, adminOnly, getQuestionStats);

// ➕ Admin – add question
router.post("/", protect, adminOnly, addQuestion);

// ✏️ Admin – update question
router.put("/:id", protect, adminOnly, updateQuestion);

// ❌ Admin – delete question
router.delete("/:id", protect, adminOnly, deleteQuestion);

// 🌍 Public – get questions by category
// ⚠️ Keep this LAST to avoid conflicts
router.get("/:category", getQuestions);

export default router;