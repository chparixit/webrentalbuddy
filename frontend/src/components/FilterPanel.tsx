import { useMemo } from "react";
import type { PropertyFilters } from "../types/property";
import { FilterAccordion } from "./FilterAccordion";
import { colors, borderRadius, typography, transitions, spacing } from "../styles/designTokens";

interface FilterPanelProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: string) => void;
  onReset: () => void;
}

const CITIES = [
  { value: "", label: "All Cities" },
  { value: "Kathmandu", label: "Kathmandu" },
  { value: "Lalitpur", label: "Lalitpur" },
  { value: "Bhaktapur", label: "Bhaktapur" },
];

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "rent", label: "Rent" },
  { value: "sale", label: "Sale" },
  { value: "lease", label: "Lease" },
];

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
];

const AVAILABILITY_OPTIONS = [
  { value: "", label: "All" },
  { value: "available", label: "Available" },
  { value: "booked", label: "Booked" },
  { value: "unavailable", label: "Unavailable" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const BATHROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
];

const AMENITY_FILTERS: { key: keyof PropertyFilters; label: string }[] = [
  { key: "furnished", label: "Furnished" },
  { key: "parking", label: "Parking" },
  { key: "petFriendly", label: "Pet Friendly" },
  { key: "balcony", label: "Balcony" },
  { key: "security", label: "Security" },
  { key: "swimmingPool", label: "Swimming Pool" },
  { key: "gym", label: "Gym" },
  { key: "backupPower", label: "Backup Power" },
  { key: "elevator", label: "Elevator" },
  { key: "internet", label: "Internet" },
  { key: "airConditioning", label: "Air Conditioning" },
];

const Pill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: borderRadius.lg,
      border: `1.5px solid ${active ? colors.primary : colors.border}`,
      background: active ? colors.primaryBg : "white",
      color: active ? colors.primary : colors.textSecondary,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: transitions.fast,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </button>
);

const Toggle = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "8px 0",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "inherit",
    }}
  >
    <span style={{ fontSize: 13, color: colors.textSecondary }}>{label}</span>
    <div
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: active ? colors.primary : colors.border,
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: borderRadius.full,
          background: "white",
          position: "absolute",
          top: 2,
          left: active ? 18 : 2,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  </button>
);

const PriceRange = ({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <div style={{ flex: 1 }}>
      <label style={{ ...typography.small, color: colors.textMuted, display: "block", marginBottom: 4 }}>Min</label>
      <input
        type="number"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        placeholder="0"
        style={{
          width: "100%",
          padding: "8px 10px",
          border: `1.5px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          color: colors.textPrimary,
        }}
      />
    </div>
    <span style={{ marginTop: 16, color: colors.textMuted }}>–</span>
    <div style={{ flex: 1 }}>
      <label style={{ ...typography.small, color: colors.textMuted, display: "block", marginBottom: 4 }}>Max</label>
      <input
        type="number"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        placeholder="Any"
        style={{
          width: "100%",
          padding: "8px 10px",
          border: `1.5px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          color: colors.textPrimary,
        }}
      />
    </div>
  </div>
);

const AreaRange = ({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <div style={{ flex: 1 }}>
      <label style={{ ...typography.small, color: colors.textMuted, display: "block", marginBottom: 4 }}>Min (sqft)</label>
      <input
        type="number"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        placeholder="0"
        style={{
          width: "100%",
          padding: "8px 10px",
          border: `1.5px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          color: colors.textPrimary,
        }}
      />
    </div>
    <span style={{ marginTop: 16, color: colors.textMuted }}>–</span>
    <div style={{ flex: 1 }}>
      <label style={{ ...typography.small, color: colors.textMuted, display: "block", marginBottom: 4 }}>Max (sqft)</label>
      <input
        type="number"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        placeholder="Any"
        style={{
          width: "100%",
          padding: "8px 10px",
          border: `1.5px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          color: colors.textPrimary,
        }}
      />
    </div>
  </div>
);

export const FilterPanel = ({ filters, onFilterChange, onReset }: FilterPanelProps) => {
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.category) count++;
    if (filters.propertyType) count++;
    if (filters.availability) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.minArea) count++;
    if (filters.maxArea) count++;
    AMENITY_FILTERS.forEach((f) => {
      if (filters[f.key]) count++;
    });
    return count;
  }, [filters]);

  return (
    <aside
      style={{
        width: 320,
        minWidth: 320,
        background: "white",
        borderRadius: borderRadius["2xl"],
        border: `1px solid ${colors.border}`,
        padding: `${spacing["2xl"]}px ${spacing.xl}px`,
        position: "sticky",
        top: 90,
        maxHeight: "calc(100vh - 110px)",
        overflowY: "auto",
        boxShadow: colors.shadowSm,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <h3 style={{ ...typography.h4, margin: 0 }}>Filters</h3>
          {activeCount > 0 && (
            <span
              style={{
                background: colors.primary,
                color: "white",
                borderRadius: borderRadius.full,
                minWidth: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                padding: "0 6px",
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              ...typography.bodySm,
              color: colors.primary,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category toggle */}
      <FilterAccordion title="Category" defaultOpen>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <Pill
              key={c.value}
              label={c.label}
              active={filters.category === c.value}
              onClick={() => onFilterChange("category", c.value === filters.category ? "" : c.value)}
            />
          ))}
        </div>
      </FilterAccordion>

      {/* City */}
      <FilterAccordion title="Location" defaultOpen>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {CITIES.map((c) => (
            <button
              key={c.value}
              onClick={() => onFilterChange("city", c.value === filters.city ? "" : c.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: borderRadius.lg,
                border: "none",
                background: filters.city === c.value ? colors.primaryBg : "transparent",
                color: filters.city === c.value ? colors.primary : colors.textSecondary,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: filters.city === c.value ? 600 : 400,
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s",
              }}
            >
              {c.value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              )}
              {c.label}
            </button>
          ))}
        </div>
      </FilterAccordion>

      {/* Price */}
      <FilterAccordion title="Price Range" defaultOpen>
        <PriceRange
          min={filters.minPrice}
          max={filters.maxPrice}
          onMinChange={(v) => onFilterChange("minPrice", v)}
          onMaxChange={(v) => onFilterChange("maxPrice", v)}
        />
      </FilterAccordion>

      {/* Property Type */}
      <FilterAccordion title="Property Type" defaultOpen>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PROPERTY_TYPES.map((t) => (
            <Pill
              key={t.value}
              label={t.label}
              active={filters.propertyType === t.value}
              onClick={() => onFilterChange("propertyType", t.value === filters.propertyType ? "" : t.value)}
            />
          ))}
        </div>
      </FilterAccordion>

      {/* Bedrooms */}
      <FilterAccordion title="Bedrooms" defaultOpen>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BEDROOM_OPTIONS.map((b) => (
            <Pill
              key={b.value}
              label={b.label}
              active={filters.bedrooms === b.value}
              onClick={() => onFilterChange("bedrooms", b.value === filters.bedrooms ? "" : b.value)}
            />
          ))}
        </div>
      </FilterAccordion>

      {/* Bathrooms */}
      <FilterAccordion title="Bathrooms">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BATHROOM_OPTIONS.map((b) => (
            <Pill
              key={b.value}
              label={b.label}
              active={filters.bathrooms === b.value}
              onClick={() => onFilterChange("bathrooms", b.value === filters.bathrooms ? "" : b.value)}
            />
          ))}
        </div>
      </FilterAccordion>

      {/* Area */}
      <FilterAccordion title="Area (sqft)" defaultOpen={false}>
        <AreaRange
          min={filters.minArea}
          max={filters.maxArea}
          onMinChange={(v) => onFilterChange("minArea", v)}
          onMaxChange={(v) => onFilterChange("maxArea", v)}
        />
      </FilterAccordion>

      {/* Availability */}
      <FilterAccordion title="Availability" defaultOpen>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {AVAILABILITY_OPTIONS.map((a) => (
            <Pill
              key={a.value}
              label={a.label}
              active={filters.availability === a.value}
              onClick={() => onFilterChange("availability", a.value === filters.availability ? "" : a.value)}
            />
          ))}
        </div>
      </FilterAccordion>

      {/* Amenities */}
      <FilterAccordion title="Amenities" defaultOpen={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {AMENITY_FILTERS.map((f) => (
            <Toggle
              key={f.key}
              label={f.label}
              active={filters[f.key] === "true"}
              onClick={() => onFilterChange(f.key, filters[f.key] === "true" ? "" : "true")}
            />
          ))}
        </div>
      </FilterAccordion>
    </aside>
  );
};
