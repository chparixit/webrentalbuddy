interface AboutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AboutPage = ({ onNavigate }: AboutPageProps) => {
  return (
    <div style={{ padding: "40px 80px", maxWidth: 1180, margin: "0 auto" }}>
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%)",
          borderRadius: 28,
          padding: "48px 36px",
          color: "white",
          marginBottom: 28,
        }}
      >
        <p style={{ margin: "0 0 8px", opacity: 0.8 }}>About RentalBuddy Kathmandu Valley</p>
        <h1 style={{ margin: "0 0 16px", fontSize: 40, lineHeight: 1.1 }}>
          Helping tenants and landlords connect with confidence.
        </h1>
        <p style={{ margin: 0, maxWidth: 760, lineHeight: 1.8, opacity: 0.92 }}>
          RentalBuddy is a modern rental discovery platform built for Kathmandu, Lalitpur, and
          Bhaktapur. We focus on verified listings, better search, and a cleaner digital booking
          experience for university projects and real-world use alike.
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {[
          {
            title: "Our Mission",
            body: "Make renting in Kathmandu Valley simpler, safer, and more transparent for everyone involved.",
          },
          {
            title: "What We Verify",
            body: "Property details, landlord information, availability, and high-quality visual listing content.",
          },
          {
            title: "Why It Matters",
            body: "Students, working professionals, and families need a trustworthy rental platform that saves time.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 22, color: "#111827" }}>{item.title}</h2>
            <p style={{ margin: 0, color: "#4B5563", lineHeight: 1.7 }}>{item.body}</p>
          </div>
        ))}
      </div>

      <section
        style={{
          background: "white",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: 26, color: "#111827" }}>Why users choose us</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {[
            "Browse curated apartments, houses, studios, and penthouses across the valley.",
            "Save favourite properties and track bookings in one place.",
            "Support admin workflows for property, booking, and user management.",
          ].map((point) => (
            <div
              key={point}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: "#F8FAFC",
                color: "#374151",
              }}
            >
              {point}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => onNavigate("properties")}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              background: "#2563EB",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700,
            }}
          >
            Browse Properties
          </button>
          <button
            onClick={() => onNavigate("contact")}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};
