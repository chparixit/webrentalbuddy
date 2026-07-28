import type { Booking } from "../types/Booking";

const BASE_URL = "/api/v1/bookings";

// ─── In-flight request deduplication ──────────────────────────────────────────
// Tracks pending requests by URL so duplicate fetches are automatically
// deduplicated. When a duplicate request is made, it reuses the in-flight promise
// instead of creating a new network request.
const inflightRequests = new Map<string, Promise<any>>();

const deduplicate = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)! as Promise<T>;
  }
  const promise = fetcher().finally(() => {
    inflightRequests.delete(key);
  });
  inflightRequests.set(key, promise);
  return promise;
};

// ─── Auth helpers ─────────────────────────────────────────────────────────────

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

// ─── Response handling ────────────────────────────────────────────────────────

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

const normalizeBookingResponse = (payload: any): { data: Booking[] } => {
  if (payload && Array.isArray(payload.data)) {
    return { data: payload.data as Booking[] };
  }
  if (Array.isArray(payload)) {
    return { data: payload as Booking[] };
  }
  return { data: [] };
};

// ─── API functions ────────────────────────────────────────────────────────────

export const getBookings = async (): Promise<{ data: Booking[] }> => {
  return deduplicate("getBookings", async () => {
    const res = await fetch(BASE_URL, { headers: getAuthHeaders() });
    const payload = await handleResponse<any>(res);
    return normalizeBookingResponse(payload);
  });
};

export const getBooking = async (id: string): Promise<{ data: Booking }> => {
  return deduplicate(`getBooking-${id}`, async () => {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return handleResponse<{ data: Booking }>(res);
  });
};

export const createBooking = async (data: {
  property: string;
  startDate: string;
  endDate: string;
  message?: string;
}): Promise<{ data: Booking }> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse<{ data: Booking }>(res);
};

export const updateBookingStatus = async (
  id: string,
  status: string
): Promise<{ data: Booking }> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
  return handleResponse<{ data: Booking }>(res);
};

export const deleteBooking = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<{ message?: string }>(res);
};