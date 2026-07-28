import { useMemo } from "react";
import { getMediaUrl } from "../utils/media";

interface ImageUploadProps {
  label?: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
  files: File[];
  existingUrls?: string[];
  onFilesChange: (files: File[]) => void;
  onExistingUrlsChange?: (urls: string[]) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  label = "Images",
  hint = "PNG, JPG, or WEBP up to 5MB each",
  multiple = true,
  accept = "image/*",
  maxSizeMb = 5,
  files,
  existingUrls = [],
  onFilesChange,
  onExistingUrlsChange,
  disabled = false,
}: ImageUploadProps) => {
  const previews = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        src: URL.createObjectURL(file),
        name: file.name,
      })),
    [files]
  );

  const removeExisting = (index: number) => {
    if (!onExistingUrlsChange) {
      return;
    }

    onExistingUrlsChange(existingUrls.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeNew = (index: number) => {
    onFilesChange(files.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= maxSizeMb * 1024 * 1024
    );

    onFilesChange(multiple ? [...files, ...validFiles] : validFiles.slice(0, 1));
    event.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </label>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{hint}</p>
      </div>

      {existingUrls.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {existingUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              style={{
                position: "relative",
                width: 112,
                height: 84,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                background: "#F3F4F6",
              }}
            >
              <img
                src={getMediaUrl(url)}
                alt={`Existing upload ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {onExistingUrlsChange && (
                <button
                  type="button"
                  onClick={() => removeExisting(index)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(17, 24, 39, 0.78)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {previews.map((preview, index) => (
            <div
              key={preview.key}
              style={{
                position: "relative",
                width: 112,
                height: 84,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #DBEAFE",
                background: "#EFF6FF",
              }}
            >
              <img
                src={preview.src}
                alt={preview.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => removeNew(index)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(17, 24, 39, 0.78)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 112,
          padding: "18px 20px",
          border: "1.5px dashed #BFDBFE",
          borderRadius: 18,
          cursor: disabled ? "not-allowed" : "pointer",
          background: "#F8FAFC",
          color: "#2563EB",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <span>Upload image{multiple ? "s" : ""}</span>
      </label>
    </div>
  );
};
