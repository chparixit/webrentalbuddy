// === User Types ===

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profileImage?: string;
  preferredBHK?: string;
  preferredLocation?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export type UserData = User;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersResponse {
  data: UserData[];
  meta: PaginationMeta;
  message?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  preferredBHK?: string;
  preferredLocation?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
  preferredBHK?: string;
  preferredLocation?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
}

export interface ProfileStats {
  totalBookings: number;
  completedBookings: number;
  wishlistItems: number;
  savedProperties: number;
  reviews: number;
  profileCompletion: number;
}

export interface ActivityItem {
  id: string;
  type: "profile_update" | "booking" | "wishlist" | "cancellation" | "password_change";
  description: string;
  timestamp: string;
  icon?: string;
}