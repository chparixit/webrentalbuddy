// === Centralized Axios API Client ===
// Single axios instance with automatic token injection and 401 handling.
// All API modules should import from this file.

import axios, { AxiosError } from "axios";

// Use relative URL so Vite proxy forwards to backend
const BASE_URL = "";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Inject Authorization token ──────────────────────
// Automatically attaches the JWT token from localStorage to every request.
// This ensures ALL authenticated endpoints get the token without manual work.

apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from the stored user object first (new pattern),
    // fall back to legacy standalone token (old pattern)
    let token: string | null = null;

    try {
      const stored = localStorage.getItem("rentalBuddyUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.token || null;
      }
    } catch {
      // Ignore parse errors
    }

    // Fallback to legacy token key
    if (!token) {
      token = localStorage.getItem("token");
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 globally ────────────────────────────
// When any API returns 401, clear auth state and redirect to login.
// This replaces the duplicated error handling in every API module.

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem("rentalBuddyUser");
      localStorage.removeItem("token");
      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;