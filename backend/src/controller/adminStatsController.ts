import { Request, Response } from "express";
import * as adminStatsService from "../services/adminStats.service";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await adminStatsService.getAdminStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin statistics" });
  }
};
