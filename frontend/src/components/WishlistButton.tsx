import { useState, useCallback } from "react";
import { addToWishlist, removeFromWishlist } from "../api/wishlistApi";
import { showToast } from "./Toast";
import { borderRadius } from "../styles/designTokens";

interface WishlistButtonProps {
  propertyId: string;
  initialWishlisted?: boolean;
  wishlistItemId?: string;
  onToggle?: (wishlisted: boolean, newWishlistItemId?: string) => void;
}

export const WishlistButton = ({
  propertyId,
  initialWishlisted = false,
  wishlistItemId,
  onToggle,
}: WishlistButtonProps) => {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setLoading(true);
      setAnimating(true);

      try {
        if (wishlisted) {
          const idToRemove = wishlistItemId || propertyId;
          await removeFromWishlist(idToRemove);
          setWishlisted(false);
          showToast("Removed from wishlist", "info");
          onToggle?.(false, undefined);
        } else {
          const res = await addToWishlist(propertyId);
          setWishlisted(true);
          showToast("Added to wishlist!", "success");
          onToggle?.(true, res.data?._id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update wishlist";
        // If property is already in wishlist, sync state instead of showing error
        if (message === "Property already in wishlist") {
          setWishlisted(true);
          showToast("Already in your wishlist", "info");
          onToggle?.(true, undefined);
        } else {
          showToast(message, "error");
        }
      } finally {
        setLoading(false);
        setTimeout(() => setAnimating(false), 300);
      }
    },
    [wishlisted, loading, propertyId, wishlistItemId, onToggle]
  );

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        border: "none",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        cursor: loading ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
        transition: "transform 0.2s ease",
        transform: animating ? "scale(1.2)" : "scale(1)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={wishlisted ? "#EF4444" : "none"}
        stroke={wishlisted ? "#EF4444" : "#374151"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};