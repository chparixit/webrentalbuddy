import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import Dashboard from "./pages/dashboard";

type Page = "login" | "register" | "dashboard" | "profile-update" | "password-update" | "admin";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
  profileImage?: string;
  preferredBHK?: string;
  preferredLocation?: string;
};

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#2563EB" />
    <path d="M8 22V13l8-5 8 5v9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <rect x="13" y="16" width="6" height="6" rx="1" fill="white" />
  </svg>
);

const Navbar = ({
  user,
  onLogin,
  onRegister,
  onDashboard,
  onAdmin,
  onLogout,
}: {
  user: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onDashboard: () => void;
  onAdmin: () => void;
  onLogout: () => void;
}) => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      padding: "0 40px",
      height: 60,
      background: "white",
      borderBottom: "1px solid #F3F4F6",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 48 }}>
      <LogoIcon />
      <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Rental Buddy</span>
    </div>
    <div style={{ display: "flex", gap: 32, flex: 1 }}>
      {["Rent", "Buy", "Sell", "List Property"].map((item) => (
        <a
          key={item}
          href="#"
          style={{
            fontSize: 14,
            color: "#374151",
            textDecoration: "none",
            fontWeight: 500,
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#2563EB")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
        >
          {item}
        </a>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {user ? (
        <>
          <button
            onClick={onDashboard}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              color: "#2563EB",
              fontFamily: "inherit",
            }}
          >
            Dashboard
          </button>
          {user.role === "admin" && (
            <button
              onClick={onAdmin}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: "#7C3AED",
                fontFamily: "inherit",
              }}
            >
              Admin
            </button>
          )}
          <button
            onClick={onLogout}
            style={{
              background: "#EF4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#DC2626")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#EF4444")}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              color: "#2563EB",
              fontFamily: "inherit",
            }}
          >
            Login
          </button>
          <button
            onClick={onRegister}
            style={{
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1D4ED8")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2563EB")}
          >
            Register
          </button>
        </>
      )}
    </div>
  </nav>
);

const ProfileUpdatePage = ({ user, onBack }: { user: User; onBack: () => void }) => {
  const [name, setName] = useState(user.name || "");
  const [preferredBHK, setPreferredBHK] = useState(user.preferredBHK || "");
  const [preferredLocation, setPreferredLocation] = useState(user.preferredLocation || "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div style={{ padding: "40px", minHeight: "calc(100vh - 60px)", background: "#F9FAFB" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#2563EB",
          cursor: "pointer",
          fontSize: 14,
          marginBottom: 20,
          fontFamily: "inherit",
        }}
      >
        ← Back to Dashboard
      </button>
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              Name
            </label>
            <input
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              Preferred BHK
            </label>
            <input
              value={preferredBHK}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPreferredBHK(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              Preferred Location
            </label>
            <input
              value={preferredLocation}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPreferredLocation(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

const PasswordUpdatePage = ({ onBack }: { onBack: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div style={{ padding: "40px", minHeight: "calc(100vh - 60px)", background: "#F9FAFB" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#2563EB",
          cursor: "pointer",
          fontSize: 14,
          marginBottom: 20,
          fontFamily: "inherit",
        }}
      >
        ← Back to Dashboard
      </button>
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentPassword(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#6B7280" }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminUsers = ({ onBack }: { onBack: () => void }) => (
  <div style={{ padding: "40px", minHeight: "calc(100vh - 60px)", background: "#F9FAFB" }}>
    <button
      onClick={onBack}
      style={{
        background: "none",
        border: "none",
        color: "#2563EB",
        cursor: "pointer",
        fontSize: 14,
        marginBottom: 20,
        fontFamily: "inherit",
      }}
    >
      ← Back to Dashboard
    </button>
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Admin Users</h1>
      <p style={{ color: "#6B7280", lineHeight: 1.7 }}>
        Only admin users may access this section. Use the controls below to manage users and view administrative data.
      </p>
    </div>
  </div>
);

const Footer = () => (
  <footer style={{ background: "white", borderTop: "1px solid #F3F4F6", padding: "48px 80px 24px" }}>
    <div style={{ display: "flex", gap: 64, marginBottom: 40 }}>
      <div style={{ flex: "0 0 260px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <LogoIcon />
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Rental Buddy</span>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
          Kathmandu's leading real estate marketplace, connecting modern professionals with their ideal living spaces across the valley.
        </p>
      </div>
      {[
        { title: "Platform", links: ["Browse Rentals", "Sell Property", "Verified Agents"] },
        { title: "Company", links: ["About Us", "Privacy Policy", "Terms of Use"] },
        { title: "Connect", links: ["Contact Support", "Help Center", "Instagram"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>{col.title}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20, textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
        © 2024 Rental Buddy Kathmandu. Premium Real Estate Solutions.
      </p>
    </div>
  </footer>
);

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/whoami", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data.user ?? null);

      if (data.user) {
        setPage("dashboard");
      } else {
        setPage("login");
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLoginSuccess = async () => {
    await loadUser();
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          background: "#F9FAFB",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        minHeight: "100vh",
        background: "#F9FAFB",
      }}
    >
      <Navbar
        user={user}
        onLogin={() => setPage("login")}
        onRegister={() => setPage("register")}
        onDashboard={() => setPage("dashboard")}
        onAdmin={() => setPage("admin")}
        onLogout={handleLogout}
      />

     {page === "login" && (
  <LoginPage
    onGoRegister={() => setPage("register")}
    onLoginSuccess={(userData: any) => {
      console.log("LOGIN RESPONSE:", userData);

      setUser(userData.user); // 👈 FIXED (important)
      setPage("dashboard");
    }}
  />
)}

      {page === "register" && !user && <RegisterPage onGoLogin={() => setPage("login")} />}

      {page === "dashboard" && user && (
        <Dashboard
          user={user}
          onGoProfileUpdate={() => setPage("profile-update")}
          onGoPasswordUpdate={() => setPage("password-update")}
        />
      )}

      {page === "profile-update" && user && (
        <ProfileUpdatePage user={user} onBack={() => setPage("dashboard")} />
      )}

      {page === "profile-update" && !user && (
        <div style={{ padding: 40, textAlign: "center" }}>Please login to update your profile.</div>
      )}

      {page === "password-update" && user && (
        <PasswordUpdatePage onBack={() => setPage("dashboard")} />
      )}

      {page === "password-update" && !user && (
        <div style={{ padding: 40, textAlign: "center" }}>Please login to change your password.</div>
      )}

      {page === "admin" && (
        user?.role === "admin" ? (
          <AdminUsers onBack={() => setPage("dashboard")} />
        ) : (
          <div style={{ padding: 40, textAlign: "center" }}>Access denied. Admin only.</div>
        )
      )}

      <Footer />
    </div>
  );
}