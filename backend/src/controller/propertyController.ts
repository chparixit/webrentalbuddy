// === Property Controller ===
// Handles HTTP requests for property CRUD operations
import { Request, Response } from "express";
import mongoose from "mongoose";
import * as propertyService from "../services/property.service";

type AuthenticatedRequest = Request & { user?: any };

/**
 * GET /api/v1/properties
 * Get all properties with pagination, search, filter, and sorting
 */
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));
    const search = (req.query.search as string) || "";
    const city = (req.query.city as string) || "";
    const propertyType = (req.query.propertyType as string) || "";
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const bedrooms = req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined;
    const bathrooms = req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined;
    const status = (req.query.status as string) || "";
    const category = (req.query.category as string) || "";
    const availability = (req.query.availability as string) || "";
    const sort = (req.query.sort as string) || "";

    const result = await propertyService.getProperties({
      page,
      limit,
      search,
      city,
      propertyType,
      category,
      availability,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status,
      sort,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * GET /api/v1/properties/featured
 * Get featured properties
 */
export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.getFeaturedProperties();
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * GET /api/v1/properties/:id
 * Get a single property by ID
 */
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const property = await propertyService.getPropertyById(id);
    return res.status(200).json({ success: true, data: property });
  } catch (error: any) {
    if (error.message === "Property not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Error fetching property:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * POST /api/v1/properties
 * Create a new property (admin/landlord only)
 * Supports multipart/form-data with image uploads
 */
export const createProperty = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const landlordId = authReq.user._id;

    // For FormData uploads, multer parses body fields and files separately
    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const {
      title,
      description,
      propertyType,
      category,
      location,
      city,
      district,
      price,
      bedrooms,
      bathrooms,
      area,
      amenities,
      featured,
      status,
      availability,
    } = body;

    // Validate required fields
    if (!title || !description || !propertyType || !location || !city || price === undefined || bedrooms === undefined || bathrooms === undefined || area === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields: title, description, propertyType, location, city, price, bedrooms, bathrooms, area",
      });
    }

    // Parse amenities from JSON string if coming from FormData
    let parsedAmenities = amenities;
    if (typeof amenities === "string") {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch {
        parsedAmenities = amenities.split(",").map((a: string) => a.trim()).filter(Boolean);
      }
    }

    // Build image paths from uploaded files
    let imagePaths: string[] = [];
    if (files && files.length > 0) {
      imagePaths = files.map((file) => `/uploads/${file.filename}`);
    }
    // Also support direct image URLs from JSON body
    if (req.body.images) {
      try {
        const parsedImages = typeof req.body.images === "string" ? JSON.parse(req.body.images) : req.body.images;
        if (Array.isArray(parsedImages)) {
          imagePaths = [...imagePaths, ...parsedImages];
        }
      } catch {
        // ignore parse errors
      }
    }

    const property = await propertyService.createProperty(
      {
        title,
        description,
        propertyType,
        category: category || "rent",
        location,
        city,
        district: district || "",
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
        images: imagePaths,
        featured: featured === true || featured === "true",
        status: status || "available",
        availability: availability || "available",
      },
      landlordId
    );

    return res.status(201).json({ success: true, data: property, message: "Property created successfully" });
  } catch (error) {
    console.error("Error creating property:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * PUT /api/v1/properties/:id
 * Update a property (admin/owner only)
 * Supports multipart/form-data with image uploads
 */
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    // Check ownership
    const authReq = req as AuthenticatedRequest;
    const existingProperty = await propertyService.getPropertyById(id);

    const isAdmin = authReq.user?.role === "admin";
    const isOwner = existingProperty.landlord?._id?.toString() === authReq.user?._id?.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to update this property" });
    }

    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    // Build update data
    const updateData: Record<string, any> = {};

    const stringFields = ["title", "description", "propertyType", "category", "location", "city", "district", "status", "availability"];
    for (const field of stringFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const numberFields = ["price", "bedrooms", "bathrooms", "area"];
    for (const field of numberFields) {
      if (body[field] !== undefined) updateData[field] = Number(body[field]);
    }

    if (body.featured !== undefined) {
      updateData.featured = body.featured === true || body.featured === "true";
    }

    // Handle amenities
    if (body.amenities !== undefined) {
      if (typeof body.amenities === "string") {
        try {
          updateData.amenities = JSON.parse(body.amenities);
        } catch {
          updateData.amenities = body.amenities.split(",").map((a: string) => a.trim()).filter(Boolean);
        }
      } else {
        updateData.amenities = body.amenities;
      }
    }

    // Handle images — append uploaded files to existing images if not a full replacement
    if (files && files.length > 0) {
      const newImages = files.map((file) => `/uploads/${file.filename}`);
      // If body.keepExistingImages is true, append, otherwise replace
      if (body.keepExistingImages === "true" || body.keepExistingImages === true) {
        const existingImages = existingProperty.images || [];
        updateData.images = [...existingImages, ...newImages];
      } else {
        updateData.images = newImages;
      }
    }
    // Support direct image URLs from JSON body
    if (body.images && typeof body.images === "string" && !files?.length) {
      try {
        updateData.images = JSON.parse(body.images);
      } catch {
        updateData.images = body.images;
      }
    }

    const property = await propertyService.updateProperty(id, updateData);
    return res.status(200).json({ success: true, data: property, message: "Property updated successfully" });
  } catch (error: any) {
    if (error.message === "Property not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Error updating property:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * DELETE /api/v1/properties/:id
 * Delete a property (admin/owner only)
 */
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    // Check ownership
    const authReq = req as AuthenticatedRequest;
    const existingProperty = await propertyService.getPropertyById(id);

    const isAdmin = authReq.user?.role === "admin";
    const isOwner = existingProperty.landlord?._id?.toString() === authReq.user?._id?.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this property" });
    }

    const result = await propertyService.deleteProperty(id);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    if (error.message === "Property not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Error deleting property:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};