// === JWT Authentication Middleware ===
// Verifies the Bearer token from Authorization header and attaches user to request.
// Uses the global Express.Request augmentation for types.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { IAuthUser } from "../types/express";

interface JwtPayload {
  id: string;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
      return;
    }

    // Attach user document to request (select() excludes password)
    // req.user is typed as IAuthUser via the global Express augmentation
    req.user = user as unknown as IAuthUser;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
    return;
  }
};