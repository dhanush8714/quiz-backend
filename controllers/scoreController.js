import Score from "../models/Score.js";

// 🟢 Add score (SECURE)
export const addScore = async (req, res) => {
  try {
    const { category, score, total } = req.body;

    if (!category || score == null || total == null) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const newScore = await Score.create({
      user: req.user._id, // ✅ from token (secure)
      category,
      score,
      total,
    });

    res.status(201).json(newScore);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🏆 Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate("user", "name email") // ✅ show user info
      .sort({ score: -1 })
      .limit(10);

    res.json(scores);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};