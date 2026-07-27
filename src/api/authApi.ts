// === Authentication API Service ===
// Uses centralized axios client for automatic token injection and 401 handling.

import apiClient from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  profileImage: string;
  preferredBHK?: string;
  preferredLocation?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  preferredBHK?: string;
  preferredLocation?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface WhoamiResponse {
  user: AuthUser;
}

/**
 * Login user - POST /api/v1/auth/login
 * Backend returns { message, token, user }
 */
export const loginApi = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
};

/**
 * Register user - POST /api/v1/auth/register
 * Backend returns { message, token, user }
 */
export const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/v1/auth/register", data);
  return response.data;
};

/**
 * Get current user profile - GET /api/v1/auth/whoami
 * Backend returns { user }
 */
export const getProfileApi = async (): Promise<WhoamiResponse> => {
  const response = await apiClient.get<WhoamiResponse>("/api/v1/auth/whoami");
  return response.data;
};

/**
 * Update user profile - PUT /api/v1/auth/update
 * Accepts FormData for multipart upload (profile image)
 */
export const updateProfileApi = async (formData: FormData): Promise<{ message: string; user: AuthUser }> => {
  const response = await apiClient.put<{ message: string; user: AuthUser }>(
    "/api/v1/auth/update",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

/**
 * Update user password - PUT /api/v1/auth/update-password
 */
export const updatePasswordApi = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>("/api/v1/auth/update-password", data);
  return response.data;
};