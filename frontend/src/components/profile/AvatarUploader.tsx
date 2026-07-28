import { useRef, useState, memo } from "react";
import { colors, borderRadius, transitions } from "../../styles/designTokens";
import { getMediaUrl } from "../../utils/media";

interface AvatarUploaderProps {
  currentImage?: string;
  userName: string;
  onFileSelect: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const AvatarUploader = memo(({
  currentImage,
  userName,
  onFileSelect,
  onRemove,
  disabled,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>("");

  const displayUrl = preview || (currentImage ? getMediaUrl(currentImage) : null);
  const initial = userName?.charAt(0)?.toUpperCase() || "?";

  const validateFile = (file: File): boolean => {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError("");
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          background: colors.bgTertiary,
          border: `3px solid ${colors.border}`,
          transition: transitions.normal,
          cursor: disabled ? "default" : "pointer",
          outline: dragOver ? `3px solid ${colors.primary}` : "none",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload profile picture"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !disabled && fileInputRef.current?.click();
          }
        }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={`${userName}'s profile`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
              color: colors.textMuted,
            }}
          >
            {initial}
          </div>
        )}

        {!disabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: transitions.fast,
            }}
            className="avatar-hover-overlay"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {error && (
        <p style={{ margin: 0, fontSize: 12, color: colors.error, fontWeight: 500 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          style={{
            padding: "8px 16px",
            background: colors.primaryLight,
            color: colors.primary,
            border: "none",
            borderRadius: borderRadius.md,
            fontSize: 12,
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: transitions.fast,
            opacity: disabled ? 0.6 : 1,
          }}
          aria-label="Change photo"
        >
          Change Photo
        </button>
        {displayUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            style={{
              padding: "8px 16px",
              background: colors.errorBg,
              color: colors.error,
              border: "none",
              borderRadius: borderRadius.md,
              fontSize: 12,
              fontWeight: 600,
              cursor: disabled ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: transitions.fast,
              opacity: disabled ? 0.6 : 1,
            }}
            aria-label="Remove photo"
          >
            Remove
          </button>
        )}
      </div>

      <style>{`
        .avatar-hover-overlay:hover {
          opacity: 1 !important;
        }
        div[role="button"]:focus-visible {
          outline: 2px solid ${colors.primary};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
});

AvatarUploader.displayName = "AvatarUploader";