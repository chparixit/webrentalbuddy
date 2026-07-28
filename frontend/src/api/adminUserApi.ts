// === Admin User API client ===
// Handles all HTTP requests to the admin users endpoints

import type {
  GetUsersResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user";

const BASE_URL = "/api/v1/admin/users";

// Get auth token from localStorage
const getToken = (): string | null => {
  try {
    const stored = localStorage.getItem("rentalBuddyUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    }
  } catch {
    return null;
  }
  return null;
};

// Helper to create headers with auth token
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// GET /api/v1/admin/users?page=1&limit=10&search=term
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<GetUsersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return {
    ...data,
    data: data.data.map((user: any) => ({
      ...user,
      id: user._id, // ✅ normalize MongoDB _id -> id
    })),
  };
};

// POST /api/v1/admin/users
export const createUser = async (
  payload: CreateUserPayload
): Promise<{ data: any; message: string }> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
};

// PUT /api/v1/admin/users/:id
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<{ data: any; message: string }> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update user");
  }

  return data;
};

// DELETE /api/v1/admin/users/:id
export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
};