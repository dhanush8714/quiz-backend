import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";

// Load env variables
dotenv.config();

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌍 Middleware
app.use(cors({
  origin: "*",   // allow all (you can restrict later)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🖼 Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🚏 Routes
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("Quiz App API is running 🚀");
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔥 Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Server error",
  });
});

// 🗄 MongoDB connection (IMPROVED)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB(); // connect DB before running
  console.log(`🚀 Server running on port ${PORT}`);
});