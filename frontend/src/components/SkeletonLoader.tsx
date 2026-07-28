interface SkeletonLoaderProps {
  count?: number;
  type?: "card" | "text" | "detail";
}

const SkeletonCard = () => (
  <div
    style={{
      background: "white",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}
  >
    <div
      style={{
        height: 200,
        background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div style={{ padding: 20 }}>
      <div
        style={{
          height: 20,
          width: "70%",
          borderRadius: 8,
          marginBottom: 12,
          background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div
        style={{
          height: 16,
          width: "50%",
          borderRadius: 8,
          marginBottom: 8,
          background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div
        style={{
          height: 16,
          width: "40%",
          borderRadius: 8,
          background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  </div>
);

const SkeletonText = () => (
  <div style={{ padding: 20 }}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          height: 14,
          width: `${70 + i * 5}%`,
          borderRadius: 6,
          marginBottom: 10,
          background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    ))}
  </div>
);

const SkeletonDetail = () => (
  <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div
      style={{
        height: 400,
        background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div style={{ padding: 32, display: "flex", gap: 40 }}>
      <div style={{ flex: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: 18,
              width: `${60 + i * 6}%`,
              borderRadius: 8,
              marginBottom: 14,
              background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 40,
              width: "100%",
              borderRadius: 10,
              marginBottom: 12,
              background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonLoader = ({ count = 6, type = "card" }: SkeletonLoaderProps) => {
  const items = type === "card"
    ? Array.from({ length: count })
    : type === "detail"
    ? [1]
    : [1];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          type === "card"
            ? "repeat(auto-fill, minmax(320px, 1fr))"
            : "1fr",
        gap: 24,
      }}
    >
      {items.map((_, i) =>
        type === "card" ? (
          <SkeletonCard key={i} />
        ) : type === "detail" ? (
          <SkeletonDetail key={i} />
        ) : (
          <SkeletonText key={i} />
        )
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};