import type { WishlistItem } from "../types/Booking";

const BASE_URL = "/api/v1/wishlist";

interface AuthUser {
  token?: string;
  [key: string]: unknown;
}

const getAuthHeaders = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem("rentalBuddyUser");
    if (!stored) return {};
    const user: AuthUser = JSON.parse(stored);
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  } catch {
    localStorage.removeItem("rentalBuddyUser");
    return {};
  }
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody.message || errBody.error || message;
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }
  return res.json();
};

const normalizeWishlistResponse = (payload: any): { data: WishlistItem[] } => {
  if (payload && Array.isArray(payload.data)) {
    return { data: payload.data as WishlistItem[] };
  }
  if (Array.isArray(payload)) {
    return { data: payload as WishlistItem[] };
  }
  return { data: [] };
};

export const getWishlist = async (): Promise<{ data: WishlistItem[] }> => {
  const res = await fetch(BASE_URL, { headers: getAuthHeaders() });
  const payload = await handleResponse<any>(res);
  return normalizeWishlistResponse(payload);
};

export const addToWishlist = async (
  propertyId: string
): Promise<{ data: WishlistItem }> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ property: propertyId }),
  });
  return handleResponse<{ data: WishlistItem }>(res);
};

export const removeFromWishlist = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<{ message?: string }>(res);
};

export const checkWishlistStatus = async (
  propertyId: string
): Promise<{ isFavourite: boolean }> => {
  const res = await fetch(`${BASE_URL}/check/${propertyId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{ isFavourite: boolean }>(res);
};