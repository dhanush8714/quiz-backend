import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect routes (logged-in users only)
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next(); // ✅ VERY IMPORTANT
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);
    return res.status(401).json({ message: "Token failed" });
  }
};

// 🔒 Admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // ✅ IMPORTANT
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};