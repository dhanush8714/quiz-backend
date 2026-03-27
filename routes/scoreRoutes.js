import express from "express";
import {
  addScore,
  getLeaderboard,
} from "../controllers/scoreController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Add score (only logged-in users)
router.post("/", protect, addScore);

// 🏆 Get leaderboard (public)
router.get("/", getLeaderboard);

export default router;