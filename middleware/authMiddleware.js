import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect routes (logged-in users only)
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error("🔥 AUTH ERROR:", error.message);

    // Better error messages
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Not authorized" });
  }
};

// 🔒 Admin-only access
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    return next();
  } catch (error) {
    console.error("🔥 ADMIN CHECK ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};