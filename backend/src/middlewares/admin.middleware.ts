// === Admin authorization middleware ===
// Only checks that req.user exists and has role === "admin"
// authMiddleware must be applied separately in the route chain
import { Request, Response, NextFunction } from "express";

type AuthenticatedRequest = Request & { user?: any };

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required",
    });
  }
  next();
};
