import { useState, useCallback } from "react";
import { getMediaUrl } from "../utils/media";
import { borderRadius } from "../styles/designTokens";

interface PropertyCarouselProps {
  images: string[];
  title: string;
  aspectRatio?: string;
}

export const PropertyCarousel = ({
  images,
  title,
  aspectRatio = "16/11",
}: PropertyCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const safeImages =
    images && images.length > 0 ? images : ["/placeholder-property.jpg"];

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrent((c) => (c === 0 ? safeImages.length - 1 : c - 1));
    },
    [safeImages.length]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrent((c) => (c === safeImages.length - 1 ? 0 : c + 1));
    },
    [safeImages.length]
  );

  return (
    <div
      style={{
        position: "relative",
        aspectRatio,
        borderRadius: borderRadius["2xl"],
        overflow: "hidden",
        background: colors.bgTertiary,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={getMediaUrl(safeImages[current])}
        alt={`${title} - Image ${current + 1}`}
        loading="lazy"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Navigation arrows */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: borderRadius.full,
              border: "none",
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease",
              zIndex: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: borderRadius.full,
              border: "none",
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease",
              zIndex: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {safeImages.length > 1 && safeImages.length <= 8 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 5,
            zIndex: 2,
          }}
        >
          {safeImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === current ? 18 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                background: i === current ? "white" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Image counter badge */}
      {safeImages.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            borderRadius: borderRadius.sm,
            padding: "3px 8px",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            zIndex: 2,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {current + 1}/{safeImages.length}
        </div>
      )}
    </div>
  );
};

const colors = {
  bgTertiary: "#F3F4F6",
};
