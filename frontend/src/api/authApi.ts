// === Authentication API Service ===
// Centralized API calls for authentication

const BASE_URL = "/api/v1/auth";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  profileImage: string;
  preferredBHK?: string;
  preferredLocation?: string;
  role?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  preferredBHK?: string;
  preferredLocation?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token?: string;
  user?: AuthUser;
}

interface WhoamiResponse {
  user: AuthUser;
}

/**
 * Get auth headers from stored user
 */
const getAuthHeaders = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem("rentalBuddyUser");
    if (!stored) return {};
    const user: { token?: string } = JSON.parse(stored);
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  } catch {
    localStorage.removeItem("rentalBuddyUser");
    return {};
  }
};

/**
 * Handle API response errors
 */
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

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(res);
};

/**
 * Login user
 */
export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(res);
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<WhoamiResponse> => {
  const res = await fetch(`${BASE_URL}/whoami`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<WhoamiResponse>(res);
};

/**
 * Update user profile
 */
export const updateProfile = async (
  formData: FormData
): Promise<{ message: string; user: AuthUser }> => {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });
  return handleResponse<{ message: string; user: AuthUser }>(res);
};

/**
 * Update user password
 */
export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/update-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse<{ message: string }>(res);
};