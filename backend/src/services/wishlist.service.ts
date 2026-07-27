// === Wishlist Service ===
// Handles business logic for wishlist CRUD operations
import Wishlist from "../models/Wishlist";

/**
 * Get all wishlist items for a user
 */
export const getWishlist = async (userId: string) => {
  const items = await Wishlist.find({ user: userId })
    .populate({
      path: "property",
      populate: { path: "landlord", select: "name email profileImage" },
    })
    .sort({ createdAt: -1 });

  return { data: items };
};

/**
 * Add a property to the user's wishlist
 */
export const addToWishlist = async (userId: string, propertyId: string) => {
  // Check if already exists (unique index will catch this too, but we want a friendly message)
  const existing = await Wishlist.findOne({ user: userId, property: propertyId });
  if (existing) {
    throw new Error("Property already in wishlist");
  }

  const item = await Wishlist.create({ user: userId, property: propertyId });

  // Populate property info before returning
  const populated = await Wishlist.findById(item._id).populate({
    path: "property",
    populate: { path: "landlord", select: "name email profileImage" },
  });

  return { data: populated };
};

/**
 * Remove a property from the user's wishlist
 * paramId can be either a wishlist item _id or a property _id
 */
export const removeFromWishlist = async (userId: string, paramId: string) => {
  // Try to find by wishlist _id first (primary method)
  let item = await Wishlist.findOneAndDelete({ _id: paramId, user: userId });

  // If not found, try by property id (fallback)
  if (!item) {
    item = await Wishlist.findOneAndDelete({ user: userId, property: paramId });
  }

  if (!item) {
    throw new Error("Wishlist item not found");
  }

  return { message: "Removed from wishlist" };
};
