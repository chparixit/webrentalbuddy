import { useState } from "react";
import { showToast } from "../../components/Toast";

interface ContactPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ContactPage = ({ onNavigate }: ContactPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    showToast("Your message has been recorded for frontend review", "success");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1180, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section
          style={{
            background: "white",
            borderRadius: 24,
            padding: 28,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
          }}
        >
          <p style={{ margin: "0 0 8px", color: "#2563EB", fontWeight: 700 }}>Contact RentalBuddy</p>
          <h1 style={{ margin: "0 0 12px", fontSize: 34, color: "#111827" }}>
            Let’s help you rent smarter.
          </h1>
          <p style={{ margin: "0 0 20px", color: "#4B5563", lineHeight: 1.8 }}>
            Reach out for listing support, booking guidance, or help using the platform for your
            Kathmandu Valley rental search.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              "Support Hours: Sun - Fri, 9:00 AM to 6:00 PM",
              "Email: support@rentalbuddy.local",
              "Phone: +977-9800000000",
              "Office: New Baneshwor, Kathmandu",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#F8FAFC",
                  color: "#374151",
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate("properties")}
            style={{
              marginTop: 20,
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
        </section>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: 24,
            padding: 28,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
          }}
        >
          <h2 style={{ margin: "0 0 18px", fontSize: 24, color: "#111827" }}>Send a Message</h2>
          <div style={{ display: "grid", gap: 16 }}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontFamily: "inherit",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              required
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontFamily: "inherit",
              }}
            />
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              required
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontFamily: "inherit",
              }}
            />
            <textarea
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="How can we help?"
              required
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 18,
              padding: "14px 18px",
              borderRadius: 14,
              border: "none",
              background: "#2563EB",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700,
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
