import mongoose from "mongoose";

let isConnected = false;

export const isDatabaseReady = () => isConnected;

const connectDB = async () => {
  try {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    isConnected = false;
    console.log("❌ MongoDB error:", error);
    throw error;
  }
};

export default connectDB;