import { memo } from "react";
import type { Property } from "../types/property";
import { PropertyCarousel } from "./PropertyCarousel";
import { WishlistButton } from "./WishlistButton";
import { colors, borderRadius, typography, spacing } from "../styles/designTokens";

interface PropertyCardProps {
  property: Property;
  wishlistItemId?: string;
  onNavigate?: (page: string, params?: any) => void;
  onWishlistToggle?: (propertyId: string, wishlisted: boolean, newWishlistItemId?: string) => void;
}

const PROPERTY_TYPE_ICONS: Record<string, string> = {
  apartment: "🏢",
  house: "🏠",
  studio: "🎨",
  penthouse: "🏙️",
};

export const PropertyCard = memo(({ property, wishlistItemId, onNavigate, onWishlistToggle }: PropertyCardProps) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate("property-details", { id: property._id });
    }
  };

  const isNew = (() => {
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  const availabilityColor =
    property.availability === "available"
      ? colors.success
      : property.availability === "booked"
      ? colors.warning
      : colors.error;

  const availabilityLabel =
    property.availability === "available"
      ? "Available"
      : property.availability === "booked"
      ? "Booked"
      : "Unavailable";

  return (
    <article
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
      style={{
        background: "white",
        borderRadius: borderRadius["2xl"],
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: colors.shadowSm,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = colors.shadowXl;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = colors.shadowSm;
      }}
    >
      {/* Image carousel */}
      <div style={{ position: "relative" }}>
        <PropertyCarousel
          images={property.images}
          title={property.title}
          aspectRatio="16/11"
        />

        {/* Wishlist button */}
        <WishlistButton
          propertyId={property._id}
          initialWishlisted={!!wishlistItemId}
          wishlistItemId={wishlistItemId}
          onToggle={(wishlisted, newId) => onWishlistToggle?.(property._id, wishlisted, newId)}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 52, display: "flex", gap: 6, zIndex: 2 }}>
          {property.featured && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: borderRadius.lg,
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                boxShadow: "0 2px 6px rgba(245,158,11,0.3)",
              }}
            >
              ★ Featured
            </span>
          )}
          {isNew && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: borderRadius.lg,
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              New
            </span>
          )}
        </div>

        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            padding: "4px 10px",
            borderRadius: borderRadius.lg,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "capitalize",
            zIndex: 2,
          }}
        >
          {PROPERTY_TYPE_ICONS[property.propertyType]} {property.propertyType}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: `${spacing.lg}px ${spacing.xl}px ${spacing.xl}px` }}>
        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <span style={{ ...typography.h3, color: colors.primary }}>
              Rs. {property.price.toLocaleString()}
            </span>
            {property.category === "rent" && (
              <span style={{ ...typography.bodySm, color: colors.textMuted, fontWeight: 400 }}>/month</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>
              {(4 + Math.random()).toFixed(1)}
            </span>
            <span style={{ fontSize: 12, color: colors.textMuted }}>
              ({Math.floor(Math.random() * 50 + 5)})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            ...typography.h4,
            color: colors.textPrimary,
            margin: "0 0 6px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: 13, color: colors.textTertiary }}>
            {property.location}, {property.city}
          </span>
        </div>

        {/* Features row */}
        <div
          style={{
            display: "flex",
            gap: spacing.lg,
            paddingTop: 10,
            borderTop: `1px solid ${colors.borderLight}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V8l9-6 9 6v14" />
              <path d="M9 22V12h6v10" />
            </svg>
            <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              {property.bedrooms}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1z" />
              <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
            </svg>
            <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              {property.bathrooms}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
            <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              {property.area} sqft
            </span>
          </div>

          {/* Availability dot */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: borderRadius.full,
                background: availabilityColor,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: availabilityColor, textTransform: "capitalize" }}>
              {availabilityLabel}
            </span>
          </div>
        </div>

        {/* Amenity preview */}
        {property.amenities.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
            {property.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                style={{
                  padding: "2px 8px",
                  borderRadius: borderRadius.md,
                  background: colors.bgSecondary,
                  color: colors.textTertiary,
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {a.replace(/([A-Z])/g, " $1").trim()}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span style={{ padding: "2px 8px", borderRadius: borderRadius.md, background: colors.bgSecondary, color: colors.textMuted, fontSize: 11 }}>
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
});

PropertyCard.displayName = "PropertyCard";
