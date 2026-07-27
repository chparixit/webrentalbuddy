import { useState } from "react";
import type { AuthUser } from "../api/authApi";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Room {
  id: number;
  title: string;
  location: string;
  price: number;
  beds: number;
  rating: number;
  reviews: number;
  wifi: boolean;
  tag: string;
  tagColor: string;
  image: string;
}

const rooms: Room[] = [
  { id: 1, title: "Cozy Studio in Thamel", location: "Thamel, Kathmandu", price: 8500, beds: 1, rating: 4.8, reviews: 24, wifi: true, tag: "Popular", tagColor: "#2563EB", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop&q=70" },
  { id: 2, title: "Modern 2BHK Flat", location: "Lazimpat, Kathmandu", price: 22000, beds: 2, rating: 4.6, reviews: 18, wifi: true, tag: "New", tagColor: "#059669", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=70" },
  { id: 3, title: "Bright Room near Boudha", location: "Boudha, Kathmandu", price: 6000, beds: 1, rating: 4.4, reviews: 11, wifi: true, tag: "Budget", tagColor: "#D97706", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&auto=format&fit=crop&q=70" },
  { id: 4, title: "Luxury Apartment Baluwatar", location: "Baluwatar, Kathmandu", price: 45000, beds: 3, rating: 4.9, reviews: 32, wifi: true, tag: "Premium", tagColor: "#7C3AED", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=70" },
  { id: 5, title: "Compact Room Maharajgunj", location: "Maharajgunj, Kathmandu", price: 7500, beds: 1, rating: 4.2, reviews: 9, wifi: false, tag: "Available", tagColor: "#0891B2", image: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&auto=format&fit=crop&q=70" },
  { id: 6, title: "Spacious Flat Patan", location: "Patan, Lalitpur", price: 18000, beds: 2, rating: 4.7, reviews: 21, wifi: true, tag: "Popular", tagColor: "#2563EB", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop&q=70" },
];

interface Stat {
  label: string;
  value: string;
  color: string;
}

const stats: Stat[] = [
  { label: "Rooms Available", value: "128", color: "#2563EB" },
  { label: "Active Booking", value: "1", color: "#059669" },
  { label: "Saved Rooms", value: "6", color: "#7C3AED" },
  { label: "Total Spent", value: "रू 30,500", color: "#D97706" },
];

// ─── Props Interface ──────────────────────────────────────────────────────────

interface DashboardProps {
  user: AuthUser;
  onGoProfileUpdate: () => void;
  onGoPasswordUpdate: () => void;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({
  user,
  onGoProfileUpdate,
  onGoPasswordUpdate
}: DashboardProps) {
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<number[]>([2, 6]);

  const toggleLike = (id: number) =>
    setLiked(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const filtered = rooms.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      background: "#F9FAFB",
      minHeight: "calc(100vh - 60px)",
      padding: "36px 80px 60px",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    }}>

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>
          Find your perfect room across Kathmandu
        </p>

        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <button onClick={onGoProfileUpdate}
            style={{ padding: "8px 12px", background: "#2563EB", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}
          >
            Edit Profile
          </button>

          <button onClick={onGoPasswordUpdate}
            style={{ padding: "8px 12px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "white",
            borderRadius: 14,
            padding: "18px 20px",
            border: "1px solid #F3F4F6"
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Browse Rooms</h2>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          padding: "0 12px",
          width: 280
        }}>
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ border: "none", outline: "none", flex: 1, padding: "10px 0", fontFamily: "inherit", fontSize: 13 }}
          />
        </div>
      </div>

      {/* Rooms */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(room => (
          <div key={room.id} style={{
            background: "white",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #F3F4F6"
          }}>

            <img src={room.image} alt={room.title} style={{ width: "100%", height: 170, objectFit: "cover" }} />

            <div style={{ padding: 14 }}>
              <h3 style={{ fontSize: 14, margin: "0 0 4px" }}>{room.title}</h3>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                <MapPinIcon /> {room.location}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontWeight: 700 }}>रू {room.price}</span>
                <span><StarIcon /> {room.rating}</span>
              </div>

              <button
                onClick={() => toggleLike(room.id)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 8,
                  background: liked.includes(room.id) ? "#EF4444" : "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {liked.includes(room.id) ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}