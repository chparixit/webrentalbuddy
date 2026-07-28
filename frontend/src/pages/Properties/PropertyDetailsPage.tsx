import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { PropertyGallery } from "../../components/PropertyGallery";
import { PropertyCard } from "../../components/PropertyCard";
import { SkeletonLoader } from "../../components/SkeletonLoader";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { showToast } from "../../components/Toast";
import { getProperty, getProperties } from "../../api/propertyApi";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../api/wishlistApi";
import { createBooking } from "../../api/bookingApi";
import { colors, borderRadius, spacing, transitions } from "../../styles/designTokens";
import type { Property } from "../../types/property";

interface PropertyDetailsPageProps {
  propertyId: string;
  onNavigate: (page: string, params?: any) => void;
}

const mockReviews = [
  {
    id: "r1",
    userName: "Sarah K.",
    rating: 5,
    text: "Absolutely loved staying here! The property is exactly as described, clean and well-maintained. The landlord was very responsive and helpful throughout.",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    userName: "Rajesh M.",
    rating: 4,
    text: "Great location and good value for money. The amenities are top-notch. Only minor issue was the water pressure sometimes, but overall a fantastic experience.",
    date: "1 month ago",
  },
  {
    id: "r3",
    userName: "Anita T.",
    rating: 5,
    text: "Perfect for families! The neighborhood is safe and quiet, and all the essentials are nearby. Would definitely recommend to anyone looking for a comfortable home.",
    date: "2 months ago",
  },
];

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? "#F59E0B" : "none"} stroke={star <= rating ? "#F59E0B" : colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const Breadcrumb = ({ title, onNavigate }: { title: string; onNavigate: (page: string, params?: any) => void }) => (
  <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 14 }}>
    <button
      onClick={() => onNavigate("home")}
      style={{
        background: "none",
        border: "none",
        color: colors.textTertiary,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: 0,
        fontSize: 14,
      }}
    >
      Home
    </button>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
    <button
      onClick={() => onNavigate("properties")}
      style={{
        background: "none",
        border: "none",
        color: colors.textTertiary,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: 0,
        fontSize: 14,
      }}
    >
      Properties
    </button>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
    <span
      style={{
        color: colors.textPrimary,
        fontWeight: 600,
        maxWidth: 300,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </span>
  </nav>
);

const SectionCard = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      background: colors.bgPrimary,
      borderRadius: borderRadius["2xl"],
      padding: 28,
      boxShadow: colors.shadowMd,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
    {children}
  </h2>
);

export const PropertyDetailsPage = ({ propertyId, onNavigate }: PropertyDetailsPageProps) => {
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavourite, setIsFavourite] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProperty(propertyId);
        setProperty(res.data);

        const similarRes = await getProperties(
          { city: res.data.city },
          1,
          4
        );
        setSimilarProperties(
          similarRes.data.filter((p) => p._id !== propertyId).slice(0, 4)
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load property";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyId]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const res = await getWishlist();
        const found = res.data.find(
          (w: any) => w.property?._id === propertyId || w.property === propertyId
        );
        if (found) {
          setIsFavourite(true);
          setWishlistItemId(found._id);
        }
      } catch {
        // silently fail
      }
    };
    checkWishlist();
  }, [propertyId, user]);

  const handleToggleWishlist = useCallback(async () => {
    if (!user) {
      showToast("Please login to save favourites", "warning");
      return;
    }
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isFavourite && wishlistItemId) {
        await removeFromWishlist(wishlistItemId);
        setIsFavourite(false);
        setWishlistItemId(null);
        showToast("Removed from wishlist", "info");
      } else {
        const res = await addToWishlist(propertyId);
        setIsFavourite(true);
        setWishlistItemId(res.data?._id || null);
        showToast("Added to wishlist", "success");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update wishlist";
      showToast(message, "error");
    } finally {
      setWishlistLoading(false);
    }
  }, [user, isFavourite, wishlistItemId, wishlistLoading, propertyId]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy link", "error");
    });
  }, []);

  const handleBooking = async () => {
    if (!user) {
      showToast("Please login to book", "warning");
      return;
    }
    if (!startDate || !endDate) {
      showToast("Please select dates", "error");
      return;
    }
    const checkIn = new Date(startDate);
    const checkOut = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      showToast("Check-in date cannot be in the past", "error");
      return;
    }
    if (checkOut <= checkIn) {
      showToast("Check-out date must be after check-in date", "error");
      return;
    }
    setBookingLoading(true);
    try {
      await createBooking({
        property: propertyId,
        startDate,
        endDate,
        message: bookingMsg || undefined,
      });
      showToast("Booking request sent successfully!", "success");
      setShowBookingForm(false);
      setStartDate("");
      setEndDate("");
      setBookingMsg("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed";
      showToast(message, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const openBookingModal = () => {
    if (!user) {
      showToast("Please login to book a property", "warning");
      return;
    }
    setShowBookingForm(true);
  };

  const getTodayString = () => new Date().toISOString().split("T")[0];
  const todayStr = getTodayString();

  const calcNights = (): number => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div style={{ padding: `${spacing["3xl"]} ${spacing["7xl"]}`, maxWidth: 1280, margin: "0 auto" }}>
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ padding: `${spacing["3xl"]} ${spacing["7xl"]}`, textAlign: "center" }}>
        <div style={{ maxWidth: 400, margin: "60px auto" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 style={{ color: colors.textPrimary, fontSize: 20, margin: "0 0 8px" }}>
            {error || "Property not found"}
          </h2>
          <p style={{ color: colors.textTertiary, fontSize: 14, margin: "0 0 20px" }}>
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate("properties")}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const images = property.images ?? [];
  const amenities = property.amenities ?? [];
  const landlord = property.landlord;
  const nights = calcNights();

  const availabilityVariant = property.availability === "available" ? "success" : property.availability === "booked" ? "warning" : "error";
  const availabilityLabel = property.availability.charAt(0).toUpperCase() + property.availability.slice(1);
  const statusLabel = property.status.charAt(0).toUpperCase() + property.status.slice(1);

  return (
    <div style={{ padding: `${spacing["3xl"]} ${spacing["7xl"]} 60px`, maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <Breadcrumb title={property.title} onNavigate={onNavigate} />

      {/* Title & Action Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: 0, lineHeight: 1.3 }}>
            {property.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: 15, color: colors.textTertiary }}>
              {property.location}, {property.city}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            aria-label={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.xl,
              border: `1.5px solid ${isFavourite ? colors.error : colors.border}`,
              background: isFavourite ? colors.errorBg : colors.bgPrimary,
              cursor: wishlistLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: transitions.fast,
              opacity: wishlistLoading ? 0.6 : 1,
            }}
            onMouseOver={(e) => { if (!wishlistLoading) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = colors.shadowMd; } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavourite ? colors.error : "none"} stroke={isFavourite ? colors.error : colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            onClick={handleShare}
            aria-label="Share this property"
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.xl,
              border: `1.5px solid ${colors.border}`,
              background: colors.bgPrimary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: transitions.fast,
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = colors.shadowMd; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
        {/* Main Content */}
        <div style={{ flex: "1 1 60%", minWidth: 300 }}>
          {/* Gallery */}
          <PropertyGallery images={images} title={property.title} />

          {/* Description */}
          <SectionCard style={{ marginTop: 28 }}>
            <SectionHeading>Description</SectionHeading>
            <p style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 1.8, margin: 0 }}>
              {property.description || "No description provided."}
            </p>
          </SectionCard>

          {/* Amenities */}
          {amenities.length > 0 && (
            <SectionCard style={{ marginTop: 24 }}>
              <SectionHeading>
                Amenities
                <Badge variant="primary" size="sm">{amenities.length}</Badge>
              </SectionHeading>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {amenities.map((amenity, i) => (
                  <Badge key={i} variant="default" size="md">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Reviews */}
          <SectionCard style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SectionHeading>Reviews</SectionHeading>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast("Reviews feature coming soon!", "info")}
                ariaLabel="Write a review"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Write a Review
              </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    padding: 20,
                    background: colors.bgSecondary,
                    borderRadius: borderRadius.xl,
                    border: `1px solid ${colors.borderLight}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${colors.primaryBg}, ${colors.primaryLight})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: colors.primary,
                          fontSize: 16,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
                          {review.userName}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          <StarRating rating={review.rating} size={14} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary, lineHeight: 1.7 }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Map Placeholder */}
          <SectionCard style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
            <div
              style={{
                height: 260,
                background: `linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>Property Location</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textTertiary }}>
                  {property.location}, {property.city}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Landlord Info */}
          {landlord && (
            <SectionCard style={{ marginTop: 24 }}>
              <SectionHeading>Landlord / Property Owner</SectionHeading>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {landlord.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                    {landlord.name || "Unknown"}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: colors.textTertiary }}>
                    Property Owner
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    {landlord.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textTertiary }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m2 7 10 7 10-7" />
                        </svg>
                        {landlord.email}
                      </div>
                    )}
                    {landlord.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textTertiary }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.5-6.5A19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {landlord.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sticky Booking Sidebar */}
        <div style={{ flex: "1 1 35%", minWidth: 320, alignSelf: "flex-start", position: "sticky", top: 24 }}>
          <SectionCard style={{ boxShadow: colors.shadowLg }}>
            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: colors.primary }}>
                NPR {property.price.toLocaleString()}
              </span>
              <span style={{ fontSize: 15, fontWeight: 400, color: colors.textTertiary }}>/month</span>
            </div>

            {/* Status Badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <Badge variant={statusLabel === "Available" ? "success" : "error"} size="sm">{statusLabel}</Badge>
              <Badge variant={availabilityVariant} size="sm">{availabilityLabel}</Badge>
              {property.category && (
                <Badge variant="primary" size="sm">{property.category.charAt(0).toUpperCase() + property.category.slice(1)}</Badge>
              )}
            </div>

            {/* Quick Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                padding: "16px 0",
                borderTop: `1px solid ${colors.borderLight}`,
                borderBottom: `1px solid ${colors.borderLight}`,
                marginBottom: 20,
              }}
            >
              {[
                { label: "Type", value: property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) },
                { label: "Bedrooms", value: `${property.bedrooms}` },
                { label: "Bathrooms", value: `${property.bathrooms}` },
                { label: "Area", value: `${property.area} sqft` },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {item.label}
                  </span>
                  <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div
              style={{
                background: colors.bgSecondary,
                borderRadius: borderRadius.xl,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary }}>
                <span>Monthly Rent</span>
                <span style={{ fontWeight: 600, color: colors.textPrimary }}>NPR {property.price.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
                <span>Security Deposit</span>
                <span style={{ fontWeight: 600, color: colors.textPrimary }}>NPR {(property.price * 0.5).toLocaleString()}</span>
              </div>
              {nights > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
                  <span>Duration</span>
                  <span style={{ fontWeight: 600, color: colors.textPrimary }}>{nights} nights</span>
                </div>
              )}
              <div
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  marginTop: 10,
                  paddingTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                <span>Total First Payment</span>
                <span>NPR {(property.price * 1.5).toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={openBookingModal}
                ariaLabel="Book this property"
                disabled={property.availability !== "available"}
              >
                {property.availability === "available" ? "Book Now" : "Currently Unavailable"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleToggleWishlist}
                loading={wishlistLoading}
                ariaLabel={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavourite ? colors.error : "none"} stroke={isFavourite ? colors.error : colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isFavourite ? "Saved" : "Save to Wishlist"}
              </Button>
            </div>

            {/* Booking Info */}
            <div style={{ marginTop: 20, padding: 16, background: colors.primaryLight, borderRadius: borderRadius.xl, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: colors.primary }}>Booking Information</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: colors.textTertiary, lineHeight: 1.5 }}>
                  Book with confidence. Free cancellation within 24 hours. Contact the owner for more details.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
              Similar Properties in {property.city}
            </h2>
            <button
              onClick={() => onNavigate("properties", { city: property.city })}
              style={{
                background: "none",
                border: "none",
                color: colors.primary,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {similarProperties.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={() => setShowBookingForm(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: colors.bgPrimary,
              borderRadius: borderRadius["3xl"],
              padding: 32,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
              animation: "fadeInUp 0.25s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: colors.textPrimary }}>
                  Book This Property
                </h3>
                <p style={{ fontSize: 14, color: colors.textTertiary, margin: "4px 0 0" }}>
                  {property.title} — NPR {property.price.toLocaleString()}/month
                </p>
              </div>
              <button
                onClick={() => setShowBookingForm(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: colors.textTertiary, padding: 4 }}
                aria-label="Close booking form"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.textTertiary, marginBottom: 6 }}>
                  Check In Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={todayStr}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: borderRadius.xl,
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                  onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.textTertiary, marginBottom: 6 }}>
                  Check Out Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: borderRadius.xl,
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                  onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.textTertiary, marginBottom: 6 }}>
                  Message (optional)
                </label>
                <textarea
                  value={bookingMsg}
                  onChange={(e) => setBookingMsg(e.target.value)}
                  rows={3}
                  placeholder="Any special requests or questions for the owner..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: borderRadius.xl,
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                  onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                />
              </div>
            </div>

            {/* Price Summary */}
            {startDate && endDate && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: colors.bgSecondary,
                  borderRadius: borderRadius.xl,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary }}>
                  <span>Monthly Rent</span>
                  <span style={{ fontWeight: 600, color: colors.textPrimary }}>NPR {property.price.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
                  <span>Security Deposit</span>
                  <span style={{ fontWeight: 600, color: colors.textPrimary }}>NPR {(property.price * 0.5).toLocaleString()}</span>
                </div>
                {nights > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
                    <span>Duration</span>
                    <span style={{ fontWeight: 600, color: colors.textPrimary }}>{nights} nights</span>
                  </div>
                )}
                <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: colors.primary }}>
                  <span>Total First Payment</span>
                  <span>NPR {(property.price * 1.5).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Button variant="secondary" size="md" fullWidth onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={handleBooking} loading={bookingLoading} disabled={!startDate || !endDate}>
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
