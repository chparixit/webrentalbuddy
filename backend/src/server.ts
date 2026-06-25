import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);

// Global error handler for Express 5
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

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

startServer();