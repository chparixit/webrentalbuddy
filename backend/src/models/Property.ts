import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "studio", "penthouse"],
      required: [true, "Property type is required"],
    },
    category: {
      type: String,
      enum: ["rent", "sale", "lease"],
      default: "rent",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      enum: ["Kathmandu", "Lalitpur", "Bhaktapur"],
      required: [true, "City is required"],
    },
    district: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Bedrooms is required"],
      min: [0, "Bedrooms must be non-negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Bathrooms is required"],
      min: [0, "Bathrooms must be non-negative"],
    },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [0, "Area must be positive"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["available", "booked", "unavailable"],
      default: "available",
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
propertySchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.model("Property", propertySchema);