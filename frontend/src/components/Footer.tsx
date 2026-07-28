const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#2563EB" />
    <path d="M8 22V13l8-5 8 5v9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <rect x="13" y="16" width="6" height="6" rx="1" fill="white" />
  </svg>
);

export const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (link === "Browse Rentals") onNavigate("properties");
    else if (link === "About Us") onNavigate("about");
    else if (link === "Contact Support") onNavigate("contact");
  };

  return (
    <footer
      style={{
        background: "white",
        borderTop: "1px solid #F3F4F6",
        padding: "48px 80px 24px",
      }}
      role="contentinfo"
    >
      <div
        style={{
          display: "flex",
          gap: 64,
          marginBottom: 40,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "0 0 260px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <LogoIcon />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
              Rental Buddy
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Kathmandu's leading real estate marketplace, connecting modern
            professionals with their ideal living spaces across the valley.
          </p>
        </div>
        {[
          {
            title: "Platform",
            links: ["Browse Rentals", "Sell Property", "Verified Agents"],
          },
          {
            title: "Company",
            links: ["About Us", "Privacy Policy", "Terms of Use"],
          },
          {
            title: "Connect",
            links: ["Contact Support", "Help Center", "Instagram"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              {col.title}
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-label={col.title}>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) => handleLinkClick(e, link)}
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "#2563EB")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = "#6B7280")
                  }
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid #F3F4F6",
          paddingTop: 20,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
          &copy; {new Date().getFullYear()} Rental Buddy Kathmandu. Premium Real Estate Solutions.
        </p>
      </div>
    </footer>
  );
};
