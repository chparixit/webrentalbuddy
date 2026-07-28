import { useState } from "react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const getImageUrl = (img: string) => {
  if (img.startsWith("http")) return img;
  return `http://192.168.1.66:5000${img}`;
};

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80",
        ];

  const currentImage = getImageUrl(displayImages[selectedIndex]);

  const goTo = (index: number) => {
    setSelectedIndex(index);
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  const goPrev = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Main Image */}
      <div
        style={{
          position: "relative",
          height: 450,
          background: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={currentImage}
          alt={`${title} - Image ${selectedIndex + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80";
          }}
        />

        {displayImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "white")}
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.9)")
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "white")}
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.9)")
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Image Counter */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                padding: "6px 14px",
                background: "rgba(0,0,0,0.6)",
                borderRadius: 8,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: 12,
            overflowX: "auto",
          }}
        >
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              style={{
                width: 80,
                height: 60,
                borderRadius: 10,
                overflow: "hidden",
                border:
                  index === selectedIndex
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                opacity: index === selectedIndex ? 1 : 0.6,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (index !== selectedIndex)
                  e.currentTarget.style.opacity = "0.8";
              }}
              onMouseOut={(e) => {
                if (index !== selectedIndex)
                  e.currentTarget.style.opacity = "0.6";
              }}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&auto=format&fit=crop&q=60";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};