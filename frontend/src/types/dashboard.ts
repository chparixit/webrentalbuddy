// === Dashboard Type Definitions ===

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  token: string;
  profileImage: string;
  preferredBHK?: string;
  preferredLocation?: string;
  role?: string;
  phone?: string;
}

export interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description?: string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  bgColor: string;
}

export interface BookingTableItem {
  id: string;
  propertyName: string;
  propertyImage: string;
  location: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  onView?: () => void;
}

export interface RecommendedProperty {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  rating: number;
  isFavorite: boolean;
  onFavorite?: () => void;
  onViewDetails?: () => void;
  onBookNow?: () => void;
}

export interface ActivityItem {
  id: string;
  type: "booked" | "updated" | "saved" | "cancelled" | "viewed" | "reviewed";
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

export interface ProfileSummary {
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLocation: string;
  memberSince: string;
  profileImage: string;
}

export interface DashboardState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  user: DashboardUser | null;
  stats: StatCardData[];
  recentBookings: BookingTableItem[];
  recommendedProperties: RecommendedProperty[];
  recentActivity: ActivityItem[];
}