// === Test Setup Helpers ===
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";

dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || "RentalBuddySecret2026N";

// Note: We use a real MongoDB connection from the test .env
// This file provides helper functions for test setup

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connect to a mock MongoDB instance for testing
 */
export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * Disconnect and stop the mock MongoDB
 */
export const disconnectTestDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Clear all collections in test database
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};