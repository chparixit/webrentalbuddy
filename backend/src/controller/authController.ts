import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, preferredBHK, preferredLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      preferredBHK: preferredBHK || "",
      preferredLocation: preferredLocation || "",
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const whoami = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
        preferredBHK: user.preferredBHK || "",
        preferredLocation: user.preferredLocation || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, preferredBHK, preferredLocation } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (preferredBHK !== undefined) updateData.preferredBHK = preferredBHK;
    if (preferredLocation !== undefined) updateData.preferredLocation = preferredLocation;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
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
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const userFromDb = await User.findById(user._id);
    if (!userFromDb) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, userFromDb.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userFromDb.password = hashedPassword;
    await userFromDb.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/auth/login", req.body?.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
        preferredBHK: user.preferredBHK || "",
        preferredLocation: user.preferredLocation || "",
      },
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    console.log("LOGIN BODY:", req.body);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};