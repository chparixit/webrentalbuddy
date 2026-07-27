import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import * as authService from "../services/auth.service";

/**
 * POST /api/v1/auth/register
 * Register a new user
 * Returns: { message, token, user }
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const result = await authService.registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "User already exists") {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 * Returns: { message, token, user }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const result = await authService.loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "Invalid email or password") {
      return res.status(401).json({ success: false, message: err.message });
    }
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/v1/auth/whoami
 * Get current user profile (requires auth middleware)
 * Returns: { user }
 */
export const whoami = async (req: Request, res: Response) => {
  try {
    // req.user is attached by authMiddleware
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        profileImage: currentUser.profileImage || "",
        preferredBHK: currentUser.preferredBHK || "",
        preferredLocation: currentUser.preferredLocation || "",
        role: currentUser.role || "user",
      },
    });
  } catch (error) {
    console.error("whoami error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * PUT /api/v1/auth/update
 * Update user profile (requires auth middleware)
 * Returns: { message, user }
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, preferredBHK, preferredLocation } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: Record<string, string | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (preferredBHK !== undefined) updateData.preferredBHK = preferredBHK;
    if (preferredLocation !== undefined) updateData.preferredLocation = preferredLocation;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      (currentUser as any)._id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage || "",
        preferredBHK: updatedUser.preferredBHK || "",
        preferredLocation: updatedUser.preferredLocation || "",
        role: updatedUser.role || "user",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * PUT /api/v1/auth/update-password
 * Update user password (requires auth middleware)
 * Returns: { message }
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const userFromDb = await User.findById((currentUser as any)._id);
    if (!userFromDb) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, userFromDb.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userFromDb.password = hashedPassword;
    await userFromDb.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};