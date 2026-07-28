import { useState, useEffect, useCallback, useRef } from "react";
import type { Property } from "../types/property";
import { getMediaUrl } from "../utils/media";
import { colors, borderRadius, typography, transitions, spacing } from "../styles/designTokens";

interface QuickViewModalProps {
  property: Property | null;
  onClose: () => void;
}

export const QuickViewModal = ({ property, onClose }: QuickViewModalProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!property) return;
    setActiveImage(0);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [property, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!property) return null;

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/placeholder-property.jpg"];

  const amenityLabels: Record<string, string> = {
    wifi: "Wi-Fi",
    parking: "Parking",
    furnished: "Furnished",
    petFriendly: "Pet Friendly",
    balcony: "Balcony",
    security: "Security",
    swimmingPool: "Swimming Pool",
    gym: "Gym",
    backupPower: "Backup Power",
    elevator: "Elevator",
    internet: "Internet",
    airConditioning: "Air Conditioning",
    waterSupply: "Water Supply",
    gasSupply: "Gas Supply",
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 32,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: borderRadius["3xl"],
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${spacing.lg}px ${spacing["2xl"]}px`,
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          <h2 style={{ ...typography.h3, color: colors.textPrimary, margin: 0 }}>
            {property.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close quick view"
            style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.full,
              border: `1px solid ${colors.border}`,
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", gap: 0 }}>
          {/* Image gallery */}
          <div style={{ flex: "1 1 55%", padding: spacing["2xl"], display: "flex", flexDirection: "column", gap: spacing.md }}>
            <div
              style={{
                borderRadius: borderRadius.xl,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: colors.bgTertiary,
              }}
            >
              <img
                src={getMediaUrl(images[activeImage])}
                alt={property.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 64,
                      height: 48,
                      borderRadius: borderRadius.md,
                      border: i === activeImage ? `2px solid ${colors.primary}` : `2px solid transparent`,
                      overflow: "hidden",
                      cursor: "pointer",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <img
                      src={getMediaUrl(img)}
                      alt={`Thumbnail ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: "1 1 45%", padding: spacing["2xl"], borderLeft: `1px solid ${colors.borderLight}`, display: "flex", flexDirection: "column", gap: spacing.lg }}>
            <div style={{ display: "flex", gap: spacing.sm, flexWrap: "wrap" }}>
              <span style={{ padding: "4px 12px", borderRadius: borderRadius.lg, background: colors.primaryBg, color: colors.primary, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                {property.category}
              </span>
              <span style={{ padding: "4px 12px", borderRadius: borderRadius.lg, background: colors.bgTertiary, color: colors.textSecondary, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                {property.propertyType}
              </span>
              {property.featured && (
                <span style={{ padding: "4px 12px", borderRadius: borderRadius.lg, background: "#FEF3C7", color: "#B45309", fontSize: 12, fontWeight: 600 }}>
                  Featured
                </span>
              )}
            </div>

            <div style={{ ...typography.h2, color: colors.primary }}>
              Rs. {property.price.toLocaleString()}
              <span style={{ ...typography.bodySm, color: colors.textMuted, fontWeight: 400 }}>
                {property.category === "rent" ? "/month" : ""}
              </span>
            </div>

            <div style={{ display: "flex", gap: spacing["2xl"] }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: colors.textSecondary, fontSize: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg>
                {property.bedrooms} Beds
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: colors.textSecondary, fontSize: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>
                {property.bathrooms} Baths
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: colors.textSecondary, fontSize: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
                {property.area} sq ft
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, color: colors.textTertiary, fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {property.location}, {property.city}
            </div>

            <p style={{ ...typography.bodySm, color: colors.textTertiary, margin: 0, lineHeight: 1.6 }}>
              {property.description.length > 200
                ? property.description.slice(0, 200) + "..."
                : property.description}
            </p>

            {property.amenities.length > 0 && (
              <div>
                <h4 style={{ ...typography.caption, color: colors.textPrimary, margin: "0 0 8px" }}>Amenities</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {property.amenities.slice(0, 8).map((a) => (
                    <span
                      key={a}
                      style={{
                        padding: "4px 10px",
                        borderRadius: borderRadius.md,
                        background: colors.bgTertiary,
                        color: colors.textSecondary,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {amenityLabels[a] || a}
                    </span>
                  ))}
                  {property.amenities.length > 8 && (
                    <span style={{ padding: "4px 10px", borderRadius: borderRadius.md, background: colors.bgTertiary, color: colors.textMuted, fontSize: 12 }}>
                      +{property.amenities.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: spacing.sm, marginTop: "auto", paddingTop: spacing.lg }}>
              <a
                href={`/properties/${property._id}`}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 20px",
                  borderRadius: borderRadius.xl,
                  background: colors.primary,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: transitions.normal,
                }}
              >
                View Full Details
              </a>
              <a
                href={`tel:${property.landlord?.phone || ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 16px",
                  borderRadius: borderRadius.xl,
                  border: `1.5px solid ${colors.border}`,
                  background: "white",
                  color: colors.textSecondary,
                  textDecoration: "none",
                  transition: transitions.normal,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};
