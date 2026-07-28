import type { Property, GetPropertiesResponse, PropertyFilters } from "../types/property";

const BASE_URL = "/api/v1/properties";

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
      // Response body is not JSON or empty
      message = res.statusText || message;
    }
    throw new Error(message);
  }
  return res.json();
};

export const getProperties = async (
  filters?: Partial<PropertyFilters>,
  page = 1,
  limit = 12
): Promise<GetPropertiesResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<GetPropertiesResponse>(res);
};

export const getProperty = async (id: string): Promise<{ data: Property }> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{ data: Property }>(res);
};

export const getFeaturedProperties = async (): Promise<{ data: Property[] }> => {
  const res = await fetch(`${BASE_URL}/featured`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{ data: Property[] }>(res);
};

export const createProperty = async (
  data: FormData
): Promise<{ data: Property }> => {
  const headers = getAuthHeaders();
  // Do NOT set Content-Type for FormData — browser sets it with boundary
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: data,
  });
  return handleResponse<{ data: Property }>(res);
};

export const updateProperty = async (
  id: string,
  data: FormData
): Promise<{ data: Property }> => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers,
    body: data,
  });
  return handleResponse<{ data: Property }>(res);
};

export const deleteProperty = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<{ message?: string }>(res);
};

export const uploadPropertyImage = async (
  file: File
): Promise<{ path: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/v1/upload/property", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  return handleResponse<{ path: string }>(res);
};