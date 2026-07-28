import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { PropertyGrid } from "../../components/PropertyGrid";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { SearchBar } from "../../components/SearchBar";
import { showToast } from "../../components/Toast";
import { getWishlist, removeFromWishlist } from "../../api/wishlistApi";
import { colors, borderRadius, transitions } from "../../styles/designTokens";
import type { Property } from "../../types/property";
import type { WishlistItem } from "../../types/Booking";

interface WishlistPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const WishlistPage = ({ onNavigate }: WishlistPageProps) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Build wishlist lookup map: propertyId -> wishlistItemId
  const wishlistMap = useMemo(() => {
    const map: Record<string, string> = {};
    wishlist.forEach((item) => {
      const propId = typeof item.property === "string" ? item.property : item.property?._id;
      if (propId) map[propId] = item._id;
    });
    return map;
  }, [wishlist]);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const res = await getWishlist();
      setWishlist(res.data || []);
      const props = (res.data || [])
        .map((item: any) => item?.property || item)
        .filter(Boolean)
        .map((property: any) => ({
          ...property,
          _id: property?._id || property?.id,
          title: property?.title || property?.name || "Untitled property",
          location: property?.location || property?.city || "Location not available",
          city: property?.city || property?.location || "Kathmandu",
          price: property?.price || 0,
          propertyType: property?.propertyType || "apartment",
          bedrooms: property?.bedrooms || 1,
          bathrooms: property?.bathrooms || 1,
          area: property?.area || 0,
          amenities: property?.amenities || [],
          images: property?.images || [],
          category: property?.category || "rent",
          availability: property?.availability || "available",
          landlord: property?.landlord || { _id: "", name: "Owner", email: "", profileImage: "" },
          featured: Boolean(property?.featured),
          status: property?.status || "available",
          createdAt: property?.createdAt || new Date().toISOString(),
          updatedAt: property?.updatedAt || new Date().toISOString(),
        }));
      setProperties(props);
    } catch (err: any) {
      setError(err.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleClearWishlist = async () => {
    if (properties.length === 0) return;
    try {
      // Remove all items one by one
      const res = await getWishlist();
      for (const item of res.data || []) {
        if (item._id) {
          await removeFromWishlist(item._id);
        }
      }
      setProperties([]);
      showToast("Wishlist cleared", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to clear wishlist", "error");
    }
  };

  // Filter & search
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [properties, searchTerm, selectedCategory]);

  // Categories for filter
  const categories = useMemo(() => {
    const cats = new Set(properties.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [properties]);

  if (!user) {
    return (
      <div style={{ padding: "40px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 400, margin: "60px auto" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 style={{ color: colors.textPrimary, fontSize: 20, margin: "0 0 8px" }}>
            Please login to view your wishlist
          </h2>
          <p style={{ color: colors.textTertiary, fontSize: 14, margin: "0 0 20px" }}>
            Sign in to save and manage your favourite properties.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate("login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 80px 60px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: "0 0 8px" }}>
          My Wishlist
          {properties.length > 0 && (
            <span style={{ fontSize: 18, fontWeight: 500, color: colors.textTertiary, marginLeft: 10 }}>
              ({properties.length})
            </span>
          )}
        </h1>
        <p style={{ fontSize: 15, color: colors.textTertiary, margin: 0 }}>
          Your favourite properties saved for later
        </p>
      </div>

      {/* Search & Actions Bar */}
      {!loading && properties.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 250 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search your wishlist..."
            />
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div style={{ display: "flex", gap: 6 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: borderRadius.lg,
                    border: "none",
                    background: selectedCategory === cat ? colors.primary : colors.bgTertiary,
                    color: selectedCategory === cat ? "#fff" : colors.textTertiary,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: transitions.fast,
                  }}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}

          <Button
            variant="dangerOutline"
            size="sm"
            onClick={handleClearWishlist}
            disabled={properties.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear All
          </Button>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          style={{
            padding: 40,
            background: colors.errorBg,
            borderRadius: borderRadius["2xl"],
            border: `1px solid #FECACA`,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ color: colors.error, fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Failed to load wishlist</p>
          <p style={{ color: colors.textTertiary, fontSize: 13, margin: "0 0 16px" }}>{error}</p>
          <Button variant="danger" size="md" onClick={fetchWishlist}>Retry</Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p style={{ color: colors.textTertiary, fontSize: 14, marginTop: 12 }}>Loading wishlist...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <EmptyState
          title="Your wishlist is empty"
          description="Save properties you love by clicking the heart icon on any property card."
          action={{ label: "Browse Properties", onClick: () => onNavigate("properties") }}
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
        />
      )}

      {/* No search results */}
      {!loading && !error && properties.length > 0 && filteredProperties.length === 0 && (
        <EmptyState
          title="No matching properties"
          description="Try adjusting your search or filter criteria."
          action={{ label: "Clear Search", onClick: () => setSearchTerm("") }}
        />
      )}

      {/* Grid */}
      {!loading && filteredProperties.length > 0 && (
        <PropertyGrid
          properties={filteredProperties}
          loading={false}
          onNavigate={onNavigate}
          wishlistMap={wishlistMap}
        />
      )}
    </div>
  );
};