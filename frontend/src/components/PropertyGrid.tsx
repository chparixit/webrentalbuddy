import type { Property } from "../types/property";
import { PropertyCard } from "./PropertyCard";
import { SkeletonLoader } from "./SkeletonLoader";
import { EmptyState } from "./EmptyState";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  onNavigate?: (page: string, params?: any) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  wishlistMap?: Record<string, string>; // propertyId -> wishlistItemId
  onWishlistToggle?: (propertyId: string, wishlisted: boolean, newWishlistItemId?: string) => void;
}

export const PropertyGrid = ({
  properties,
  loading,
  onNavigate,
  emptyTitle = "No properties found",
  emptyDescription = "Try adjusting your search or filter criteria",
  emptyAction,
  wishlistMap = {},
  onWishlistToggle,
}: PropertyGridProps) => {
  if (loading) {
    return <SkeletonLoader count={6} type="card" />;
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      />
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          wishlistItemId={wishlistMap[property._id]}
          onNavigate={onNavigate}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};