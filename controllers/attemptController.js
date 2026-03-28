import Attempt from "../models/Attempt.js";

// ➕ Save quiz attempt
export const addAttempt = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { category, score, total } = req.body;

    if (!category || score == null || total == null) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const attempt = await Attempt.create({
      user: req.user._id,
      category,
      score,
      total,
    });

    res.status(201).json(attempt);
  } catch (error) {
    console.error("🔥 ADD ATTEMPT ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 📥 Get logged-in user's attempts
export const getMyAttempts = async (req, res) => {
  try {
    console.log("USER:", req.user); // 🔍 debug

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user._id;

    const attempts = await Attempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(attempts);
  } catch (error) {
    console.error("🔥 GET ATTEMPTS ERROR:", error); // 🔥 IMPORTANT
    return res.status(500).json({
      message: error.message || "Server error",
    });
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
          from: "users",
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

    res.json(leaderboard || []);
  } catch (error) {
    console.error("🔥 LEADERBOARD ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};