import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Property, PropertyFilters, PaginationMeta } from "../../types/property";
import type { WishlistItem } from "../../types/Booking";
import { getProperties } from "../../api/propertyApi";
import { getWishlist } from "../../api/wishlistApi";
import { SearchBar } from "../../components/SearchBar";
import { FilterPanel } from "../../components/FilterPanel";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyPagination } from "../../components/PropertyPagination";
import { QuickViewModal } from "../../components/QuickViewModal";
import { colors, borderRadius, typography, transitions, spacing } from "../../styles/designTokens";

const INITIAL_FILTERS: PropertyFilters = {
  search: "",
  city: "",
  propertyType: "",
  category: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  minArea: "",
  maxArea: "",
  furnished: "",
  parking: "",
  petFriendly: "",
  balcony: "",
  security: "",
  swimmingPool: "",
  gym: "",
  backupPower: "",
  elevator: "",
  internet: "",
  airConditioning: "",
  sort: "",
};

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
  { value: "area_desc", label: "Largest Area" },
  { value: "bedrooms_desc", label: "Most Bedrooms" },
  { value: "title_asc", label: "Name: A → Z" },
];

const LIMIT = 12;

interface PropertyListingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const PropertyListingPage = ({ onNavigate }: PropertyListingPageProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [sortBy, setSortBy] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Build wishlist lookup
  const wishlistMap = useMemo(() => {
    const map: Record<string, string> = {};
    wishlist.forEach((item) => {
      const propId = typeof item.property === "string" ? item.property : item.property?._id;
      if (propId) map[propId] = item._id;
    });
    return map;
  }, [wishlist]);

  // Fetch properties
  const fetchProperties = useCallback(
    async (page: number, currentFilters: PropertyFilters) => {
      setLoading(true);
      setError(null);
      try {
        const filtersForApi: Partial<PropertyFilters> = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            (filtersForApi as Record<string, string>)[key] = value;
          }
        });
        const res = await getProperties(filtersForApi, page, LIMIT);
        setProperties(res.data || []);
        setMeta(res.meta || { page: 1, limit: LIMIT, total: 0, totalPages: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle wishlist toggle from PropertyCard
  const handleWishlistToggle = useCallback(
    (propertyId: string, wishlisted: boolean, newWishlistItemId?: string) => {
      setWishlist((prev) => {
        if (wishlisted) {
          // Add to wishlist state
          const newItem: WishlistItem = {
            _id: newWishlistItemId || `temp-${propertyId}`,
            property: { _id: propertyId } as any,
            user: "",
            createdAt: new Date().toISOString(),
          };
          return [...prev, newItem];
        } else {
          // Remove from wishlist state
          return prev.filter((item) => {
            const propId = typeof item.property === "string" ? item.property : item.property?._id;
            return propId !== propertyId;
          });
        }
      });
    },
    []
  );

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data || []);
    } catch {
      // Silent fail - wishlist is non-critical
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProperties(1, INITIAL_FILTERS);
    fetchWishlist();
  }, [fetchProperties, fetchWishlist]);

  // Debounced filter change
  const handleFilterChange = useCallback(
    (key: keyof PropertyFilters, value: string) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        return next;
      });

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilters((current) => {
          fetchProperties(1, { ...current, sort: sortBy });
          return current;
        });
      }, 400);
    },
    [fetchProperties, sortBy]
  );

  // Search debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => {
        const next = { ...prev, search: value };
        fetchProperties(1, { ...next, sort: sortBy });
        return next;
      });
    }, 400);
  }, [fetchProperties, sortBy]);

  // Sort change
  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      fetchProperties(1, { ...filters, sort: value });
    },
    [filters, fetchProperties]
  );

  // Page change
  const handlePageChange = useCallback(
    (page: number) => {
      fetchProperties(page, { ...filters, sort: sortBy });
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [filters, sortBy, fetchProperties]
  );

  // Reset filters
  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchInput("");
    setSortBy("");
    fetchProperties(1, INITIAL_FILTERS);
  }, [fetchProperties]);

  // Quick view keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && quickViewProperty) {
        setQuickViewProperty(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [quickViewProperty]);

  // Get active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    const add = (key: keyof PropertyFilters, label: string) => {
      chips.push({
        key,
        label,
        onRemove: () => handleFilterChange(key, ""),
      });
    };

    if (filters.search) add("search", `Search: "${filters.search}"`);
    if (filters.city) add("city", filters.city);
    if (filters.category) add("category", filters.category.charAt(0).toUpperCase() + filters.category.slice(1));
    if (filters.propertyType) add("propertyType", filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1));
    if (filters.availability) add("availability", filters.availability.charAt(0).toUpperCase() + filters.availability.slice(1));
    if (filters.minPrice) add("minPrice", `Min Rs. ${Number(filters.minPrice).toLocaleString()}`);
    if (filters.maxPrice) add("maxPrice", `Max Rs. ${Number(filters.maxPrice).toLocaleString()}`);
    if (filters.bedrooms) add("bedrooms", `${filters.bedrooms}+ Bedrooms`);
    if (filters.bathrooms) add("bathrooms", `${filters.bathrooms}+ Bathrooms`);
    if (filters.minArea) add("minArea", `Min ${filters.minArea} sqft`);
    if (filters.maxArea) add("maxArea", `Max ${filters.maxArea} sqft`);
    if (filters.furnished) add("furnished", "Furnished");
    if (filters.parking) add("parking", "Parking");
    if (filters.petFriendly) add("petFriendly", "Pet Friendly");
    if (filters.balcony) add("balcony", "Balcony");
    if (filters.security) add("security", "Security");
    if (filters.swimmingPool) add("swimmingPool", "Swimming Pool");
    if (filters.gym) add("gym", "Gym");
    if (filters.backupPower) add("backupPower", "Backup Power");
    if (filters.elevator) add("elevator", "Elevator");
    if (filters.internet) add("internet", "Internet");
    if (filters.airConditioning) add("airConditioning", "Air Conditioning");

    return chips;
  }, [filters, handleFilterChange]);

  const hasActiveFilters = activeChips.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bgPage,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        ref={contentRef}
        style={{
          background: "white",
          borderBottom: `1px solid ${colors.border}`,
          padding: `${spacing.xl}px 0`,
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: `0 ${spacing["3xl"]}px`,
          }}
        >
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ ...typography.h1, color: colors.textPrimary, margin: 0 }}>
                Find Your Perfect Property
              </h1>
              <p style={{ ...typography.bodySm, color: colors.textTertiary, margin: "4px 0 0" }}>
                {meta.total} properties available across Nepal
              </p>
            </div>
          </div>

          {/* Search + Sort bar */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <SearchBar
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by city, location, or property type..."
            />
            <div style={{ position: "relative", minWidth: 180 }}>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 36px 12px 14px",
                  border: `2px solid ${colors.border}`,
                  borderRadius: borderRadius.xl,
                  background: "white",
                  fontSize: 14,
                  fontFamily: "inherit",
                  color: colors.textPrimary,
                  cursor: "pointer",
                  appearance: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  height: 48,
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.textMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 16,
                alignItems: "center",
              }}
            >
              <span style={{ ...typography.small, color: colors.textMuted, marginRight: 4 }}>Active:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: borderRadius.lg,
                    background: colors.primaryBg,
                    color: colors.primary,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    aria-label={`Remove ${chip.label} filter`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: colors.primary,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={handleReset}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.error,
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  borderRadius: borderRadius.md,
                  transition: transitions.fast,
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content: sidebar + grid */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: `${spacing["2xl"]}px ${spacing["3xl"]}px`,
          display: "flex",
          gap: spacing["3xl"],
          alignItems: "flex-start",
        }}
      >
        {/* Filter sidebar */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Loading skeleton */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: spacing.xl,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: borderRadius["2xl"],
                    overflow: "hidden",
                    boxShadow: colors.shadowSm,
                  }}
                >
                  <div style={{ aspectRatio: "16/11", background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: spacing.lg }}>
                    <div style={{ height: 20, background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6, marginBottom: 10, width: "60%" }} />
                    <div style={{ height: 14, background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6, marginBottom: 8, width: "80%" }} />
                    <div style={{ height: 14, background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6, width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div
              style={{
                textAlign: "center",
                padding: "64px 32px",
                background: "white",
                borderRadius: borderRadius["2xl"],
                boxShadow: colors.shadowSm,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: borderRadius.full,
                  background: colors.errorBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 style={{ ...typography.h3, color: colors.textPrimary, marginBottom: 8 }}>
                Something went wrong
              </h3>
              <p style={{ ...typography.bodySm, color: colors.textTertiary, marginBottom: 24 }}>
                {error}
              </p>
              <button
                onClick={() => fetchProperties(meta.page, { ...filters, sort: sortBy })}
                style={{
                  padding: "10px 24px",
                  borderRadius: borderRadius.xl,
                  border: "none",
                  background: colors.primary,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: transitions.normal,
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && properties.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "64px 32px",
                background: "white",
                borderRadius: borderRadius["2xl"],
                boxShadow: colors.shadowSm,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: borderRadius.full,
                  background: colors.bgTertiary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 style={{ ...typography.h3, color: colors.textPrimary, marginBottom: 8 }}>
                No properties found
              </h3>
              <p style={{ ...typography.bodySm, color: colors.textTertiary, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
                We couldn't find any properties matching your current filters. Try adjusting your search criteria or clearing all filters.
              </p>
              <button
                onClick={handleReset}
                style={{
                  padding: "10px 24px",
                  borderRadius: borderRadius.xl,
                  border: `1.5px solid ${colors.border}`,
                  background: "white",
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: transitions.normal,
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Property grid */}
          {!loading && !error && properties.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: spacing.xl,
                }}
              >
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    wishlistItemId={wishlistMap[property._id]}
                    onNavigate={onNavigate}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>

              {/* Pagination */}
              <PropertyPagination meta={meta} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        property={quickViewProperty}
        onClose={() => setQuickViewProperty(null)}
      />

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
