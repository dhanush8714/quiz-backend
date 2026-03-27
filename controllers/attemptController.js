import Attempt from "../models/Attempt.js";

// ➕ Save quiz attempt
export const addAttempt = async (req, res) => {
  try {
    const { category, score, total } = req.body;

    if (!category || score == null || total == null) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const attempt = await Attempt.create({
      user: req.user._id,
      category,
      score,
      total,
    });

    res.status(201).json(attempt);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📥 Get logged-in user's attempts
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🌍 Global Leaderboard
export const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Attempt.aggregate([
      {
        $group: {
          _id: "$user",
          bestScore: { $max: "$score" },
          total: { $max: "$total" },
        },
      },
      { $sort: { bestScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users", // collection name (correct ✅)
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          bestScore: 1,
          total: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};