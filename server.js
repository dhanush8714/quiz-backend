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

// Load env
dotenv.config();

const app = express();

// Fix __dirname (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS FIX (FINAL)
const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-frontend-rouge.vercel.app", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// 🌍 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🖼 Static uploads
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

// 🔥 Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({
    message: err.message || "Server error",
  });
});

// 🗄 MongoDB connection
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
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});