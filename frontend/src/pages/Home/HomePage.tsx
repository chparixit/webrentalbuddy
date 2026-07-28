import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { PropertyCard } from "../../components/PropertyCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getFeaturedProperties } from "../../api/propertyApi";
import { getWishlist } from "../../api/wishlistApi";
import type { Property } from "../../types/property";
import type { WishlistItem } from "../../types/Booking";

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

const featuredProperties: Property[] = [
  {
    _id: "1",
    title: "Modern Apartment in Thamel",
    description: "",
    price: 45000,
    propertyType: "apartment" as const,
    category: "rent" as const,
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    location: "Thamel",
    city: "Kathmandu",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "2",
    title: "Spacious House in Pulchowk",
    description: "",
    price: 65000,
    propertyType: "house",
    category: "rent" as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    location: "Pulchowk",
    city: "Lalitpur",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "3",
    title: "Cozy Studio in Bhaktapur",
    description: "",
    price: 25000,
    propertyType: "studio",
    category: "rent" as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    location: "Durbar Square",
    city: "Bhaktapur",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "4",
    title: "Luxury Penthouse in Lazimpat",
    description: "",
    price: 120000,
    propertyType: "penthouse",
    category: "rent" as const,
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    location: "Lazimpat",
    city: "Kathmandu",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "5",
    title: "Family Home in Jawalakhel",
    description: "",
    price: 55000,
    propertyType: "house",
    category: "rent" as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    location: "Jawalakhel",
    city: "Lalitpur",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "6",
    title: "Modern Apartment in New Baneshwor",
    description: "",
    price: 35000,
    propertyType: "apartment",
    category: "rent" as const,
    bedrooms: 2,
    bathrooms: 1,
    area: 750,
    location: "New Baneshwor",
    city: "Kathmandu",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60"],
    landlord: { _id: "", name: "", email: "", phone: "" },
    status: "available",
    availability: "available" as const,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
];

const testimonials = [
  {
    name: "Sagar Thapa",
    role: "Tenant",
    text: "RentalBuddy made finding my apartment in Thamel incredibly easy. The platform is intuitive and the listings are verified.",
    rating: 5,
  },
  {
    name: "Anita Sharma",
    role: "Landlord",
    text: "Managing my properties has never been easier. RentalBuddy connects me with quality tenants quickly.",
    rating: 5,
  },
  {
    name: "Ramesh Adhikari",
    role: "Tenant",
    text: "Found the perfect family home in Bhaktapur through RentalBuddy. Highly recommended for anyone looking to rent in the valley.",
    rating: 5,
  },
];

const popularLocations = [
  { name: "Kathmandu", count: "150+ Properties", image: "https://images.unsplash.com/photo-1624535496890-743a4b9e0b4a?w=600&auto=format&fit=crop&q=60", color: "#2563EB" },
  { name: "Lalitpur", count: "80+ Properties", image: "https://images.unsplash.com/photo-1624535496890-743a4b9e0b4a?w=600&auto=format&fit=crop&q=60", color: "#7C3AED" },
  { name: "Bhaktapur", count: "40+ Properties", image: "https://images.unsplash.com/photo-1624535496890-743a4b9e0b4a?w=600&auto=format&fit=crop&q=60", color: "#059669" },
];

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>(featuredProperties);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);
  const statsAnimated = useRef(false);

  // Build wishlist lookup map: propertyId -> wishlistItemId
  const wishlistMap = useMemo(() => {
    const map: Record<string, string> = {};
    wishlist.forEach((item) => {
      const propId = typeof item.property === "string" ? item.property : item.property?._id;
      if (propId) map[propId] = item._id;
    });
    return map;
  }, [wishlist]);

  const animateNumber = useCallback((target: number, key: string, duration = 1500) => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(eased * target) }));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            animateNumber(500, "properties");
            animateNumber(200, "landlords");
            animateNumber(1000, "tenants");
            animateNumber(3, "cities");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [animateNumber]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getFeaturedProperties();
        if (res.data?.length > 0) {
          setProperties(res.data);
        }
      } catch {
        // Use default featured properties
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const fetchWishlistData = async () => {
      try {
        const res = await getWishlist();
        setWishlist(res.data || []);
      } catch {
        // Silent fail - wishlist is non-critical
      }
    };
    fetchWishlistData();
  }, [user]);

  const handleSearch = () => {
    onNavigate("properties", { search: searchQuery });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
        }
        .fade-in-up-delay-1 { animation-delay: 0.1s; }
        .fade-in-up-delay-2 { animation-delay: 0.2s; }
        .fade-in-up-delay-3 { animation-delay: 0.3s; }
        .fade-in-up-delay-4 { animation-delay: 0.4s; }
        .property-card-hover {
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease;
        }
        .property-card-hover:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .faq-answer.open {
          max-height: 300px;
          opacity: 1;
        }
      `}</style>

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          minHeight: 650,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 40%, #2563EB 80%, #3B82F6 100%)",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage: "radial-gradient(circle at 25% 25%, white 1%, transparent 1%), radial-gradient(circle at 75% 75%, white 1%, transparent 1%)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient overlay for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.3) 0%, transparent 60%)",
          }}
        />

        <div
          style={{
            position: "relative",
            textAlign: "center",
            padding: "80px 40px",
            maxWidth: 860,
            width: "100%",
          }}
        >
          <h1
            className="fade-in-up"
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 900,
              color: "white",
              margin: "0 0 20px",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Find Your Perfect Home in
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #93C5FD, #60A5FA, #93C5FD)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kathmandu Valley
            </span>
          </h1>
          <p
            className="fade-in-up fade-in-up-delay-1"
            style={{
              fontSize: "clamp(17px, 2vw, 22px)",
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 44px",
              lineHeight: 1.6,
              maxWidth: 620,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Discover premium rental properties across Kathmandu, Lalitpur, and Bhaktapur.
            Verified listings, trusted landlords, and modern homes waiting for you.
          </p>

          {/* Search Bar */}
          <div
            className="fade-in-up fade-in-up-delay-2"
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: 640,
              margin: "0 auto",
              background: "white",
              borderRadius: 20,
              padding: "8px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 18, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by location, property type..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "18px 14px",
                fontSize: 17,
                color: "#111827",
                background: "transparent",
                fontFamily: "inherit",
                minWidth: 0,
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "16px 36px",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "white",
                border: "none",
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                boxShadow: "0 4px 15px rgba(37,99,235,0.4)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #1D4ED8, #1E40AF)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #2563EB, #1D4ED8)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Search
            </button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="fade-in-up fade-in-up-delay-3"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 56,
              marginTop: 56,
              flexWrap: "wrap",
            }}
          >
            {[
              { key: "properties", value: 500, suffix: "+", label: "Properties" },
              { key: "landlords", value: 200, suffix: "+", label: "Landlords" },
              { key: "tenants", value: 1000, suffix: "+", label: "Happy Tenants" },
              { key: "cities", value: 3, suffix: "", label: "Cities" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "white",
                    marginBottom: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {(animatedStats[stat.key] ?? 0)}{stat.suffix}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="fade-in-up" style={{ padding: "80px 80px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Featured Properties
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
              Hand-picked selections for you
            </p>
          </div>
          <button
            onClick={() => onNavigate("properties")}
            style={{
              padding: "12px 28px",
              background: "white",
              color: "#2563EB",
              border: "1.5px solid #2563EB",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#2563EB";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#2563EB";
            }}
          >
            View All Properties →
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured properties..." />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {properties.slice(0, 6).map((property) => (
              <div key={property._id} className="property-card-hover">
                <PropertyCard
                  property={property}
                  wishlistItemId={wishlistMap[property._id]}
                  onNavigate={onNavigate}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Locations */}
      <div className="fade-in-up" style={{ padding: "80px 80px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Popular Locations
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
              Explore properties in Nepal's most sought-after cities
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {popularLocations.map((loc) => (
              <div
                key={loc.name}
                onClick={() => onNavigate("properties", { city: loc.name })}
                style={{
                  position: "relative",
                  height: 280,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${loc.color}44, ${loc.color}88)`,
                    zIndex: 1,
                  }}
                />
                <img
                  src={loc.image}
                  alt={loc.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 24,
                    zIndex: 2,
                    background: "linear-gradient(transparent 0%, rgba(0,0,0,0.6) 100%)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {loc.name}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {loc.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose RentalBuddy */}
      <div className="fade-in-up" style={{ padding: "80px 80px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            Why Choose RentalBuddy?
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
            The best way to find your perfect rental in Kathmandu Valley
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              title: "Verified Properties",
              desc: "Every listing is verified to ensure accuracy and quality. No fake listings, no wasted time.",
              svg: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
              color: "#059669",
              bg: "#ECFDF5",
            },
            {
              title: "Trusted Landlords",
              desc: "All landlords are screened and verified. Rent with confidence and peace of mind.",
              svg: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              ),
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              title: "Easy Booking",
              desc: "Book properties online with our streamlined process. No paperwork, no hassle.",
              svg: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <polyline points="9 16 11 18 15 14" />
                </svg>
              ),
              color: "#7C3AED",
              bg: "#F5F3FF",
            },
            {
              title: "24/7 Support",
              desc: "Our dedicated support team is always available to help you with any questions.",
              svg: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="9" y1="10" x2="15" y2="10" />
                </svg>
              ),
              color: "#D97706",
              bg: "#FFFBEB",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "36px 28px",
                background: "white",
                borderRadius: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                textAlign: "center",
                transition: "all 0.3s ease",
                borderTop: `3px solid ${feature.bg}`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderTopColor = feature.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderTopColor = feature.bg;
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: feature.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                {feature.svg}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 10px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="fade-in-up" style={{ padding: "80px 80px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              What Our Users Say
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
              Real stories from real people in Kathmandu Valley
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  padding: 32,
                  background: "white",
                  borderRadius: 20,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  position: "relative",
                  transition: "all 0.3s ease",
                  border: "1px solid #F3F4F6",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
              >
                {/* Quote icon */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 28,
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                  </svg>
                </div>
                {/* Star rating */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16, marginTop: 4 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={j < t.rating ? "#F59E0B" : "#E5E7EB"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                    </svg>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#4B5563",
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderTop: "1px solid #F3F4F6",
                    paddingTop: 20,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#2563EB",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="fade-in-up" style={{ padding: "80px 80px", maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
            Got questions? We've got answers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              q: "How do I list my property on RentalBuddy?",
              a: "Simply create an account as a landlord, go to your dashboard, and click 'Add Property'. Fill in the details, upload photos, and submit for verification. Your listing will go live within 24 hours.",
            },
            {
              q: "Are all listings verified?",
              a: "Yes. Every property listing goes through our verification process. We check property details, ownership documents, and conduct quality reviews to ensure all listings are genuine and accurate.",
            },
            {
              q: "Is there a fee to use RentalBuddy?",
              a: "Browsing properties is completely free for tenants. Landlords can list properties with a basic free plan, or upgrade to premium plans for enhanced visibility and analytics.",
            },
            {
              q: "How does the booking process work?",
              a: "Once you find a property you like, you can schedule a visit, communicate with the landlord through our platform, and submit a rental application. Our secure process makes it easy to finalize agreements online.",
            },
            {
              q: "Which cities does RentalBuddy cover?",
              a: "Currently, RentalBuddy operates across the Kathmandu Valley — covering Kathmandu, Lalitpur, and Bhaktapur. We're expanding to Pokhara and Chitwan soon.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: faqOpen === i ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
              }}
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111827", paddingRight: 16 }}>
                  {faq.q}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    flexShrink: 0,
                    transition: "transform 0.3s ease",
                    transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={faqOpen === i ? "faq-answer open" : "faq-answer"}
                style={{ padding: faqOpen === i ? "0 24px 20px" : "0 24px" }}
              >
                <p
                  style={{
                    fontSize: 15,
                    color: "#6B7280",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="fade-in-up"
        style={{
          padding: "80px 80px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 40%, #2563EB 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.25) 0%, transparent 60%)",
          }}
        />
        <div style={{ position: "relative" }}>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700,
            color: "white",
            margin: "0 0 16px",
          }}
        >
          Ready to Find Your Dream Home?
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 32px",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join thousands of happy tenants and landlords in Kathmandu Valley.
          Start your journey today.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {!user ? (
            <>
              <button
                onClick={() => onNavigate("register")}
                style={{
                  padding: "16px 40px",
                  background: "white",
                  color: "#2563EB",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                onMouseOut={(e) => (e.currentTarget.style.background = "white")}
              >
                Get Started Free
              </button>
              <button
                onClick={() => onNavigate("login")}
                style={{
                  padding: "16px 40px",
                  background: "transparent",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.5)",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "white")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
              >
                Sign In
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("properties")}
              style={{
                padding: "16px 40px",
                background: "white",
                color: "#2563EB",
                border: "none",
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#F3F4F6")}
              onMouseOut={(e) => (e.currentTarget.style.background = "white")}
            >
              Browse Properties
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};