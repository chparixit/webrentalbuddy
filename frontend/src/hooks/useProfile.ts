import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import type { ProfileStats, ActivityItem, UpdateUserPayload } from "../types/user";
import { showToast } from "../components/Toast";

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  bio: string;
  preferredBHK: string;
  preferredLocation: string;
  profileImage: string;
}

export const useProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalBookings: 0,
    completedBookings: 0,
    wishlistItems: 0,
    savedProperties: 0,
    reviews: 0,
    profileCompletion: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    bio: "",
    preferredBHK: "",
    preferredLocation: "",
    profileImage: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const mountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  const clearProfileTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearProfileTimeout();
    };
  }, [clearProfileTimeout]);

  // Generate mock activities (placeholder until real API exists)
  const generateMockActivities = (data?: ProfileState): ActivityItem[] => {
    const items: ActivityItem[] = [
      {
        id: "1",
        type: "profile_update",
        description: "Updated profile information",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        icon: "👤",
      },
    ];

    if (data?.name) {
      items.push({
        id: "2",
        type: "booking",
        description: "Member since recently",
        timestamp: new Date().toISOString(),
        icon: "🎉",
      });
    }

    return items;
  };

  // Calculate profile completion
  const calculateCompletion = useCallback((data: ProfileState): number => {
    const fields = [
      data.name,
      data.email,
      data.phone,
      data.gender,
      data.dateOfBirth,
      data.address,
      data.bio,
      data.preferredBHK,
      data.preferredLocation,
      data.profileImage,
    ];
    const filled = fields.filter((f) => f && f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, []);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!user) {
      if (mountedRef.current) {
        setLoading(false);
        setError(null);
      }
      return;
    }

    if (!user.token) {
      if (mountedRef.current) {
        const fallbackProfileData: ProfileState = {
          name: user.name || "",
          email: user.email || "",
          phone: "",
          gender: "",
          dateOfBirth: "",
          address: "",
          bio: "",
          preferredBHK: user.preferredBHK || "",
          preferredLocation: user.preferredLocation || "",
          profileImage: user.profileImage || "",
        };
        setProfile(fallbackProfileData);
        setStats((prev) => ({
          ...prev,
          profileCompletion: calculateCompletion(fallbackProfileData),
        }));
        setActivities(generateMockActivities(fallbackProfileData));
        setLoading(false);
        setError(null);
      }
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    timeoutRef.current = timeoutId;

    try {
      const res = await fetch("/api/v1/auth/whoami", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      const u = data?.user ?? data;

      if (mountedRef.current) {
        const profileData: ProfileState = {
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          gender: u.gender || "",
          dateOfBirth: u.dateOfBirth || "",
          address: u.address || "",
          bio: u.bio || "",
          preferredBHK: u.preferredBHK || "",
          preferredLocation: u.preferredLocation || "",
          profileImage: u.profileImage || "",
        };

        setProfile(profileData);
        setStats((prev) => ({
          ...prev,
          profileCompletion: calculateCompletion(profileData),
        }));
        setActivities(generateMockActivities(profileData));
      }
    } catch (err) {
      if (mountedRef.current) {
        if (controller.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
          const fallbackProfileData: ProfileState = {
            name: user.name || "",
            email: user.email || "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            bio: "",
            preferredBHK: user.preferredBHK || "",
            preferredLocation: user.preferredLocation || "",
            profileImage: user.profileImage || "",
          };

          setProfile(fallbackProfileData);
          setStats((prev) => ({
            ...prev,
            profileCompletion: calculateCompletion(fallbackProfileData),
          }));
          setActivities(generateMockActivities(fallbackProfileData));
          setError("Profile request timed out. Showing your saved profile details.");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      }
    } finally {
      clearProfileTimeout();
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, calculateCompletion, clearProfileTimeout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const updateProfile = async (payload: UpdateUserPayload, imageFile?: File | null): Promise<boolean> => {
    if (!user?.token) return false;

    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await fetch("/api/v1/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      if (mountedRef.current) {
        // Safely extract the updated user from the response.
        // Backend can return: { user: {...} }, { data: { user: {...} } }, or just the user object directly.
        const u = data?.user ?? data?.data?.user ?? data;
        if (!u || !(u.name || u.email)) {
          console.error(
            "Profile update failed: Invalid API response shape. Expected { user: {...} } but got:",
            data
          );
          throw new Error("Invalid response from server. Please try again.");
        }

        const updatedUser = {
          ...user,
          name: u.name || user?.name || "",
          profileImage: u.profileImage || user?.profileImage || "",
          preferredBHK: u.preferredBHK || user?.preferredBHK || "",
          preferredLocation: u.preferredLocation || user?.preferredLocation || "",
        };
        setUser(updatedUser);

        const profileData: ProfileState = {
          name: u.name || user?.name || "",
          email: u.email || user?.email || "",
          phone: u.phone || "",
          gender: u.gender || "",
          dateOfBirth: u.dateOfBirth || "",
          address: u.address || "",
          bio: u.bio || "",
          preferredBHK: u.preferredBHK || "",
          preferredLocation: u.preferredLocation || "",
          profileImage: u.profileImage || "",
        };

        setProfile(profileData);
        setStats((prev) => ({
          ...prev,
          profileCompletion: calculateCompletion(profileData),
        }));

        showToast("Profile updated successfully!", "success");
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      console.error("Profile update failed:", err);
      showToast(message, "error");
      return false;
    } finally {
      if (mountedRef.current) {
        setEditLoading(false);
      }
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.token) return false;

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/v1/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password update failed");
      }

      showToast("Password updated successfully!", "success");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update password";
      showToast(message, "error");
      return false;
    } finally {
      if (mountedRef.current) {
        setPasswordLoading(false);
      }
    }
  };

  // Remove avatar
  const removeAvatar = async () => {
    return updateProfile({} as UpdateUserPayload, null);
  };

  return {
    user,
    profile,
    loading,
    error,
    stats,
    activities,
    editLoading,
    passwordLoading,
    fetchProfile,
    updateProfile,
    updatePassword,
    removeAvatar,
  };
};