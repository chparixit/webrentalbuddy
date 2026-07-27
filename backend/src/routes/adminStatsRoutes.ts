import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { getStats } from "../controller/adminStatsController";

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, getStats);

export default router;
