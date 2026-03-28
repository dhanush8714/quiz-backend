import express from "express";
import {
  addAttempt,
  getMyAttempts,
  getGlobalLeaderboard,
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Add attempt
router.post("/", protect, addAttempt);

// 📊 My attempts (support BOTH routes)
router.get("/", protect, getMyAttempts);     // ✅ important
router.get("/me", protect, getMyAttempts);   // optional

// 🌍 Leaderboard
router.get("/leaderboard", getGlobalLeaderboard);

export default router;