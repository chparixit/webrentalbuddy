// === Express Request Type Augmentation ===
// Extends Express Request to include the authenticated user object

import { Document } from "mongoose";
import { Request } from "express";

// Reflects the User model structure returned from MongoDB (with ObjectId)
export interface IAuthUser {
  _id: unknown; // ObjectId from MongoDB - typed loosely to avoid conflicts
  id: string;
  name: string;
  email: string;
  profileImage: string;
  preferredBHK?: string;
  preferredLocation?: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

// Augment Express Request to include the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}