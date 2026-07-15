import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },
  },
  {
    timestamps: true,
  }
);

// A property cannot exist twice in one user's wishlist
wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);