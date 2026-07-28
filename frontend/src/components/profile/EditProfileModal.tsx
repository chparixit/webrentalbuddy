import { useState, useEffect, memo } from "react";
import { colors, borderRadius, spacing, typography, transitions, zIndex } from "../../styles/designTokens";
import { Button } from "../Button";
import { AvatarUploader } from "./AvatarUploader";
import type { UpdateUserPayload } from "../../types/user";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: UpdateUserPayload, imageFile?: File | null) => Promise<boolean>;
  initialData: {
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
  };
  loading: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  bio?: string;
}

const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const EditProfileModal = memo(({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({ ...initialData });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialData });
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UpdateUserPayload = {
      name: formData.name.trim(),
    };

    if (formData.phone !== initialData.phone) payload.phone = formData.phone.trim();
    if (formData.gender !== initialData.gender) payload.gender = formData.gender;
    if (formData.dateOfBirth !== initialData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;
    if (formData.address !== initialData.address) payload.address = formData.address.trim();
    if (formData.bio !== initialData.bio) payload.bio = formData.bio.trim();
    if (formData.preferredBHK !== initialData.preferredBHK) payload.preferredBHK = formData.preferredBHK;
    if (formData.preferredLocation !== initialData.preferredLocation) payload.preferredLocation = formData.preferredLocation.trim();

    const success = await onSave(imageFile ? { ...payload } : payload, imageFile);
    if (success) {
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    border: `1.5px solid ${hasError ? colors.error : colors.border}`,
    borderRadius: borderRadius.xl,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: transitions.fast,
    background: colors.bgPrimary,
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: colors.textTertiary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: zIndex.modal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: colors.bgPrimary,
          borderRadius: borderRadius["3xl"],
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          animation: "editModalSlideUp 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${spacing.xl}px ${spacing["3xl"]}px`,
            borderBottom: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: borderRadius.lg,
                background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryBg})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  ...typography.h4,
                  color: colors.textPrimary,
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                Edit Profile
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: colors.textMuted }}>
                Update your personal information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.bgTertiary,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textTertiary,
              transition: transitions.fast,
            }}
            aria-label="Close modal"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflow: "auto",
            padding: spacing["3xl"],
          }}
        >
          {/* Avatar */}
          <div style={{ marginBottom: spacing["2xl"] }}>
            <AvatarUploader
              currentImage={formData.profileImage}
              userName={formData.name}
              onFileSelect={(file) => setImageFile(file)}
              onRemove={() => {
                setImageFile(null);
                setFormData((prev) => ({ ...prev, profileImage: "" }));
              }}
              disabled={loading}
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: spacing.xl }}>
            <label style={labelStyle}>Full Name</label>
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={inputStyle(errors.name)}
              placeholder="Your full name"
              disabled={loading}
              aria-label="Full Name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: colors.error }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div style={{ marginBottom: spacing.xl }}>
            <label style={labelStyle}>Email</label>
            <input
              value={formData.email}
              style={{ ...inputStyle(), background: colors.bgTertiary, cursor: "not-allowed", color: colors.textMuted }}
              disabled
              aria-label="Email"
            />
            <p style={{ margin: "4px 0 0", fontSize: 11, color: colors.textMuted }}>
              Email cannot be changed
            </p>
          </div>

          {/* Phone + Gender */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
            className="profile-modal-grid"
          >
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle(errors.phone)}
                placeholder="+977-XXXXXXXXX"
                disabled={loading}
                aria-label="Phone number"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: colors.error }}>
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                style={inputStyle()}
                disabled={loading}
                aria-label="Gender"
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Date of Birth + Preferred BHK */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
            className="profile-modal-grid"
          >
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                style={inputStyle()}
                disabled={loading}
                aria-label="Date of birth"
              />
            </div>
            <div>
              <label style={labelStyle}>Preferred BHK</label>
              <select
                value={formData.preferredBHK}
                onChange={(e) => handleChange("preferredBHK", e.target.value)}
                style={inputStyle()}
                disabled={loading}
                aria-label="Preferred BHK"
              >
                <option value="">Select BHK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>
          </div>

          {/* Preferred Location */}
          <div style={{ marginBottom: spacing.xl }}>
            <label style={labelStyle}>Preferred Location</label>
            <input
              value={formData.preferredLocation}
              onChange={(e) => handleChange("preferredLocation", e.target.value)}
              style={inputStyle()}
              placeholder="e.g. Kathmandu, Lalitpur"
              disabled={loading}
              aria-label="Preferred location"
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: spacing.xl }}>
            <label style={labelStyle}>Address</label>
            <input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              style={inputStyle()}
              placeholder="Your current address"
              disabled={loading}
              aria-label="Address"
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: spacing.xl }}>
            <label style={labelStyle}>Bio / About Me</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              style={{
                ...inputStyle(errors.bio),
                minHeight: 80,
                resize: "vertical",
                lineHeight: 1.5,
              }}
              placeholder="Tell us about yourself..."
              disabled={loading}
              maxLength={500}
              aria-label="Bio"
              aria-invalid={!!errors.bio}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              {errors.bio && (
                <p style={{ margin: 0, fontSize: 12, color: colors.error }}>
                  {errors.bio}
                </p>
              )}
              <p
                style={{
                  margin: "0 0 0 auto",
                  fontSize: 11,
                  color: colors.textMuted,
                }}
              >
                {formData.bio.length}/500
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: spacing.sm,
            padding: `${spacing.lg}px ${spacing["3xl"]}px`,
            borderTop: `1px solid ${colors.border}`,
            flexShrink: 0,
            background: colors.bgSecondary,
          }}
        >
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={(e) => {
              const form = e.currentTarget.closest("form");
              if (form) form.requestSubmit();
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes editModalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 600px) {
          .profile-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
});

EditProfileModal.displayName = "EditProfileModal";