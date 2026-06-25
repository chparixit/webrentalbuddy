// === Admin authorization middleware ===
// Reuses existing authMiddleware to verify JWT, then checks role === "admin"
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // First run the existing JWT auth middleware
  await authMiddleware(req, res, () => {
    // After auth, check if user is admin
    const user = (req as any).user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }
    next();
  });
};