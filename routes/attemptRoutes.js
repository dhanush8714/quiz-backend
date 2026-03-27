import express from "express";
import {
  addAttempt,
  getMyAttempts,
  getGlobalLeaderboard,
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Add attempt (logged-in users)
router.post("/", protect, addAttempt);

// 📊 My attempts
router.get("/me", protect, getMyAttempts);

// 🌍 Global leaderboard (PUBLIC)
router.get("/leaderboard", getGlobalLeaderboard);

export default router;