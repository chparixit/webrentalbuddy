// === Property Type Definitions ===

export interface Landlord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: "apartment" | "house" | "studio" | "penthouse";
  category: "rent" | "sale" | "lease";
  location: string;
  city: "Kathmandu" | "Lalitpur" | "Bhaktapur";
  district?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  availability: "available" | "booked" | "unavailable";
  landlord: Landlord;
  featured: boolean;
  status: "available" | "rented" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  search: string;
  city: string;
  propertyType: string;
  category: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  furnished: string;
  parking: string;
  petFriendly: string;
  balcony: string;
  security: string;
  swimmingPool: string;
  gym: string;
  backupPower: string;
  elevator: string;
  internet: string;
  airConditioning: string;
  sort: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPropertiesResponse {
  data: Property[];
  meta: PaginationMeta;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  propertyType: string;
  category?: string;
  location: string;
  city: string;
  district?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities?: string[];
  images?: string[];
  featured?: boolean;
  status?: string;
  availability?: string;
}