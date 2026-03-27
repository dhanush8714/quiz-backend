import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  registerUser,
  loginUser,
  makeAdmin,
  removeAdmin,
  getUsers,
  uploadProfileImage,
  updateProfile,
  deleteProfileImage,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Admin-only routes
router.get("/", protect, adminOnly, getUsers);
router.put("/make-admin/:id", protect, adminOnly, makeAdmin);
router.put("/remove-admin/:id", protect, adminOnly, removeAdmin);

// 🖼️ Profile image upload
router.put(
  "/profile-image",
  protect,
  upload.single("image"), // field name must match frontend
  uploadProfileImage
);

// 🧾 Profile update
router.put("/profile", protect, updateProfile);

// ❌ Delete profile image
router.delete("/profile-image", protect, deleteProfileImage);

export default router;