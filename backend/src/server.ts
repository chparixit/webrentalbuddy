import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";

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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("⚠️ MongoDB connection failed, starting server without database:", error);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();