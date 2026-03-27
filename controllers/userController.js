import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 🟢 Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ❗ DO NOT hash here (handled in model)
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 👑 Make Admin
export const makeAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isAdmin = true;
  await user.save();

  res.json({ message: "User promoted to admin" });
};

// 👥 Get users
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// 🖼️ Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const user = await User.findById(req.user._id);

  user.profileImage = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    profileImage: user.profileImage,
  });
};

// ✏️ Update Profile
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// ❌ Delete Profile Image
export const deleteProfileImage = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.profileImage = "";
  await user.save();

  res.json({ message: "Profile image removed" });
};

// 🔻 Remove Admin
export const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot remove your own admin role" });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ message: "Admin role removed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};