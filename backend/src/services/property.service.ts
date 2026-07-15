// === Property Service ===
// Handles all business logic for property CRUD and search/filter operations
import Property from "../models/Property";

interface GetPropertiesOptions {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  sort?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Get properties with pagination, search, filtering, and sorting
 */
export const getProperties = async (options: GetPropertiesOptions) => {
  const { page, limit, search, city, propertyType, minPrice, maxPrice, bedrooms, bathrooms, status, sort } = options;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {};

  if (search && search.trim()) {
    // Use text search if provided
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (city) {
    filter.city = city;
  }

  if (propertyType) {
    filter.propertyType = propertyType;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (bedrooms) {
    filter.bedrooms = Number(bedrooms);
  }

  if (bathrooms) {
    filter.bathrooms = Number(bathrooms);
  }

  if (status) {
    filter.status = status;
  }

  // Build sort
  let sortOption: any = { createdAt: -1 }; // default: newest first
  if (sort) {
    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate("landlord", "name email profileImage")
      .skip(skip)
      .limit(limit)
      .sort(sortOption),
    Property.countDocuments(filter),
  ]);

  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

  return { data: properties, meta };
};

/**
 * Get featured properties
 */
export const getFeaturedProperties = async () => {
  const properties = await Property.find({ featured: true })
    .populate("landlord", "name email profileImage")
    .sort({ createdAt: -1 })
    .limit(10);

  return { data: properties };
};

/**
 * Get a single property by ID
 */
export const getPropertyById = async (id: string) => {
  const property = await Property.findById(id).populate(
    "landlord",
    "name email profileImage"
  );

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

/**
 * Create a new property (admin only)
 */
export const createProperty = async (data: any, landlordId: string) => {
  const property = await Property.create({
    ...data,
    landlord: landlordId,
  });

  return property;
};

/**
 * Update a property (admin only)
 */
export const updateProperty = async (id: string, data: any) => {
  const property = await Property.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("landlord", "name email profileImage");

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

/**
 * Delete a property (admin only)
 */
export const deleteProperty = async (id: string) => {
  const property = await Property.findByIdAndDelete(id);

  if (!property) {
    throw new Error("Property not found");
  }

  return { message: "Property deleted successfully" };
};