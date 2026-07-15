import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static Files ──────────────────────────────────────────────────────────

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ─── API Documentation ─────────────────────────────────────────────────────

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Rental Buddy API Docs",
}));

// ─── Routes ────────────────────────────────────────────────────────────────

// Version 1 routes (existing)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Direct coursework routes (non-versioned)
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Rental Buddy API is running", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("⚠️ MongoDB connection failed, starting server without database:", error);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Handle server errors
  server.on("error", (err: any) => {
    console.error("Server error:", err);
    process.exit(1);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
