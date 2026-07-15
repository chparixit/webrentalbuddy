// === Wishlist Controller ===
// Handles HTTP requests for wishlist CRUD operations
import { Request, Response } from "express";
import mongoose from "mongoose";
import * as wishlistService from "../services/wishlist.service";

type AuthenticatedRequest = Request & { user?: any };

/**
 * GET /api/v1/wishlist
 * Get all wishlist items for the logged-in user
 */
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;

    const result = await wishlistService.getWishlist(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * POST /api/v1/wishlist
 * Add a property to the user's wishlist
 */
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const { property } = req.body;

    if (!property) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const result = await wishlistService.addToWishlist(userId, property);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Property already in wishlist") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE /api/v1/wishlist/:propertyId
 * Remove a property from the user's wishlist
 */
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const propertyId = String(req.params.propertyId);

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const result = await wishlistService.removeFromWishlist(userId, propertyId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Wishlist item not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};