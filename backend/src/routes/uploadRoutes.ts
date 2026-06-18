import express from "express";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth.middleware";
import User from "../models/User";

const router = express.Router();

// Upload profile image (saves to user document)
router.post(
  "/upload-profile-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file received" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // Save image path to the authenticated user's document
      const userId = (req as any).user.id;
      await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

      res.json({
        message: "Profile image uploaded successfully",
        filename: req.file.filename,
        path: imageUrl,
        imageUrl: `http://192.168.1.66:5000${imageUrl}`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Server error during upload" });
    }
  }
);

// Get current user profile (with profileImage)
router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
