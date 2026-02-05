import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // ✅ first save
    generateToken(newUser._id, res); // ✅ then token

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    // 1️⃣ auth middleware se user milna chahiye
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { profilePic } = req.body;

    // 2️⃣ validation
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required" });
    }

    // 3️⃣ upload to cloudinary (base64 supported)
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chatify/profile",
      resource_type: "image",
    });

    if (!uploadResponse?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // 4️⃣ update DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    // 5️⃣ safety check
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 6️⃣ send updated user
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("❌ Update Profile Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
