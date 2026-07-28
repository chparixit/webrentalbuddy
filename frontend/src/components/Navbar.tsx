import { useState } from "react";

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#2563EB" />
    <path d="M8 22V13l8-5 8 5v9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <rect x="13" y="16" width="6" height="6" rx="1" fill="white" />
  </svg>
);

interface NavbarProps {
  user: any;
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onLogout: () => void;
}

export const Navbar = ({
  user,
  currentPage,
  onNavigate,
  onLogout,
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", page: "home" },
    { label: "Properties", page: "properties" },
    ...(user
      ? [
          { label: "Wishlist", page: "wishlist" },
          { label: "Bookings", page: "bookings" },
          { label: "Dashboard", page: "dashboard" },
        ]
      : []),
    ...(user?.role === "admin"
      ? [{ label: "Admin Panel", page: "admin" }]
      : []),
  ];

  const isActive = (itemPage: string) =>
    currentPage === itemPage || currentPage.startsWith(itemPage + "-");

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        height: 64,
        background: "white",
        borderBottom: "1px solid #F3F4F6",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
          zIndex: 999,
          background: "#2563EB",
          color: "white",
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 8,
          textDecoration: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = "fixed";
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.overflow = "visible";
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.overflow = "hidden";
        }}
      >
        Skip to main content
      </a>

      <div
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        onClick={() => onNavigate("home")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onNavigate("home")}
        aria-label="Rental Buddy Home"
      >
        <LogoIcon />
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Rental Buddy</span>
      </div>

      {/* Desktop Nav */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 4,
          marginLeft: 40,
          alignItems: "center",
        }}
        className="desktop-nav"
        role="menubar"
      >
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            role="menuitem"
            aria-current={isActive(item.page) ? "page" : undefined}
            style={{
              padding: "8px 16px",
              background: isActive(item.page) ? "#EFF6FF" : "transparent",
              color: isActive(item.page) ? "#2563EB" : "#6B7280",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: isActive(item.page) ? 600 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isActive(item.page)) e.currentTarget.style.background = "#F9FAFB";
            }}
            onMouseOut={(e) => {
              if (!isActive(item.page)) e.currentTarget.style.background = "transparent";
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="desktop-nav">
        {user ? (
          <>
            <button
              onClick={() => onNavigate("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 12px 4px 4px",
                borderRadius: 10,
                background: "#F9FAFB",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#F3F4F6")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#F9FAFB")}
              aria-label="Go to profile"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage.startsWith("http") ? user.profileImage : `${import.meta.env.VITE_API_URL || ""}${user.profileImage}`}
                  alt={user.name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.style.cssText = "width:28px;height:28px;border-radius:50%;background:#2563EB;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:700;flex-shrink:0";
                      fallback.textContent = user.name?.charAt(0)?.toUpperCase() || "?";
                      parent.insertBefore(fallback, parent.firstChild);
                    }
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                {user.name}
              </span>
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: "8px 16px",
                background: "transparent",
                color: "#DC2626",
                border: "1px solid #FECACA",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#FEF2F2")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate("login")}
              style={{
                padding: "8px 20px",
                background: "transparent",
                color: "#2563EB",
                border: "1.5px solid #2563EB",
                borderRadius: 8,
                fontSize: 13,
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
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#2563EB";
              }}
            >
              Login
            </button>
            <button
              onClick={() => onNavigate("register")}
              style={{
                padding: "8px 20px",
                background: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1D4ED8")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#2563EB")}
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          marginLeft: "auto",
        }}
        className="mobile-menu-toggle"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "white",
            borderBottom: "1px solid #F3F4F6",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            padding: 16,
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="mobile-menu"
          role="menu"
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setMobileMenuOpen(false);
              }}
              role="menuitem"
              aria-current={isActive(item.page) ? "page" : undefined}
              style={{
                padding: "12px 16px",
                background: isActive(item.page) ? "#EFF6FF" : "transparent",
                color: isActive(item.page) ? "#2563EB" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: isActive(item.page) ? 600 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              style={{
                padding: "12px 16px",
                background: "#FEF2F2",
                color: "#DC2626",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                marginTop: 8,
              }}
            >
              Logout
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={() => {
                  onNavigate("login");
                  setMobileMenuOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  onNavigate("register");
                  setMobileMenuOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "white",
                  color: "#2563EB",
                  border: "1.5px solid #2563EB",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
