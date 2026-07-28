// === Booking Type Definition ===
import type { Property } from "./property";
import type { User } from "./user";

export interface Booking {
  _id: string;
  property: Property;
  user: User;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  guests: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  _id: string;
  property: Property;
  user: string;
  createdAt: string;
}
