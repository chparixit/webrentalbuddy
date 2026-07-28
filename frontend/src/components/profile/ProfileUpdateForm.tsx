import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMediaUrl } from "../../utils/media";

interface ProfileUpdateFormProps {
  user: any;
  onBack?: () => void;
}

const ProfileUpdateForm = ({ user, onBack: _onBack }: ProfileUpdateFormProps) => {
  const { setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [preferredBHK, setPreferredBHK] = useState(user?.preferredBHK || "");
  const [preferredLocation, setPreferredLocation] = useState(
    user?.preferredLocation || ""
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.profileImage ? getMediaUrl(user.profileImage) : ""
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = user?.token || "";
        if (!token) return;
        const res = await fetch("/api/v1/auth/whoami", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const u = data?.user;
        if (u) {
          setName(u.name || "");
          setPreferredBHK(u.preferredBHK || "");
          setPreferredLocation(u.preferredLocation || "");
          if (u.profileImage) {
            setPreviewUrl(getMediaUrl(u.profileImage));
          }
        }
      } catch (err) {
        // silently fail
      }
    };
    fetchProfile();
  }, [user?.token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be less than 5MB");
      return;
    }
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("preferredBHK", preferredBHK);
      formData.append("preferredLocation", preferredLocation);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch("/api/v1/auth/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + (user?.token || ""),
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      // Safely extract the updated user from the response.
      // Backend can return: { user: {...} }, { data: { user: {...} } }, or the user object directly.
      const u = data?.user ?? data?.data?.user ?? data;
      if (!u || !(u.name || u.email)) {
        console.error(
          "Profile update failed: Invalid API response shape. Expected { user: {...} } but got:",
          data
        );
        throw new Error("Invalid response from server. Please try again.");
      }

      if (user) {
        setUser({
          ...user,
          name: u.name || user.name || "",
          profileImage: u.profileImage || user.profileImage || "",
          preferredBHK: u.preferredBHK || user.preferredBHK || "",
          preferredLocation: u.preferredLocation || user.preferredLocation || "",
        });
      }

      setMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setMessage(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Profile update form"
      style={{
        background: "white",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#E5E7EB",
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: 40,
                color: "#9CA3AF",
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
        <label
          htmlFor="profile-image-input"
          style={{
            cursor: "pointer",
            color: "#2563EB",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Change Photo
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            aria-label="Upload profile photo"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="profile-name"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Name
        </label>
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Your name"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="profile-bhk"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Preferred BHK
        </label>
        <select
          id="profile-bhk"
          value={preferredBHK}
          onChange={(e) => setPreferredBHK(e.target.value)}
          aria-label="Preferred BHK"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            background: "white",
          }}
        >
          <option value="">Select BHK</option>
          <option value="1 BHK">1 BHK</option>
          <option value="2 BHK">2 BHK</option>
          <option value="3 BHK">3 BHK</option>
          <option value="4+ BHK">4+ BHK</option>
        </select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="profile-location"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Preferred Location
        </label>
        <input
          id="profile-location"
          value={preferredLocation}
          onChange={(e) => setPreferredLocation(e.target.value)}
          placeholder="e.g. Kathmandu, Lalitpur"
          aria-label="Preferred location"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      {message && (
        <p
          role="alert"
          style={{
            color: message.includes("success") ? "#059669" : "#DC2626",
            fontSize: 13,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? "Saving profile changes" : "Save profile changes"}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#9CA3AF" : "#2563EB",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export { ProfileUpdateForm };
export default ProfileUpdateForm;