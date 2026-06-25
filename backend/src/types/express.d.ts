import "express";

// Minimal user interface for Express Request augmentation
// Does not extend Document to avoid _id type conflicts with Mongoose
export interface IUser {
  _id: any;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  profileImage?: string;
  preferredBHK?: string;
  preferredLocation?: string;
  createdAt: string;
  updatedAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
