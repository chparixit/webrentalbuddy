import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../api/bookingApi";
import { getProperty } from "../../api/propertyApi";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { showToast } from "../../components/Toast";
import { getMediaUrl } from "../../utils/media";
import type { Property } from "../../types/property";

interface BookingPageProps {
  propertyId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const BookingPage = ({ propertyId, onNavigate }: BookingPageProps) => {
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getProperty(propertyId);
        setProperty(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load the selected property");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const months = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();

    return diff > 0 ? Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30))) : 0;
  }, [endDate, startDate]);

  const totalPrice = property ? property.price * months : 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      showToast("Please login to complete your booking", "warning");
      onNavigate("login");
      return;
    }

    if (!startDate || !endDate) {
      showToast("Please select both dates", "error");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      showToast("End date must be later than start date", "error");
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        property: propertyId,
        startDate,
        endDate,
        message,
      });
      showToast("Booking request sent successfully", "success");
      onNavigate("bookings");
    } catch (err: any) {
      showToast(err.message || "Failed to create booking", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing booking..." />;
  }

  if (error || !property) {
    return (
      <div style={{ padding: "40px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <EmptyState
          title="Booking unavailable"
          description={error || "The selected property could not be loaded."}
          action={{ label: "Browse Properties", onClick: () => onNavigate("properties") }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1180, margin: "0 auto" }}>
      <button
        onClick={() => onNavigate("property-details", { id: propertyId })}
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
        ← Back to Property Details
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <img
            src={
              getMediaUrl(property.images?.[0]) ||
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80"
            }
            alt={property.title}
            style={{ width: "100%", height: 320, objectFit: "cover" }}
          />
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <h1 style={{ margin: 0, fontSize: 30, color: "#111827" }}>{property.title}</h1>
              {property.featured && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#EFF6FF",
                    color: "#2563EB",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Featured
                </span>
              )}
            </div>
            <p style={{ margin: "0 0 16px", color: "#6B7280", fontSize: 15 }}>
              {property.location}, {property.city}
            </p>
            <p style={{ margin: "0 0 18px", color: "#374151", lineHeight: 1.7 }}>
              {property.description}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                `${property.bedrooms} Bedrooms`,
                `${property.bathrooms} Bathrooms`,
                `${property.area} sqft`,
                `${property.propertyType}`,
              ].map((detail) => (
                <span
                  key={detail}
                  style={{
                    padding: "8px 12px",
                    background: "#F3F4F6",
                    borderRadius: 12,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
            position: "sticky",
            top: 88,
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 24, color: "#111827" }}>Complete Booking</h2>
          <p style={{ margin: "0 0 20px", color: "#6B7280", lineHeight: 1.6 }}>
            Reserve this property by choosing your preferred stay duration and adding any notes for the landlord.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                Message to Landlord
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell the landlord a little about your move-in plan or special requests..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 16,
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#6B7280" }}>
              <span>Monthly rent</span>
              <strong style={{ color: "#111827" }}>NPR {property.price.toLocaleString()}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#6B7280" }}>
              <span>Estimated months</span>
              <strong style={{ color: "#111827" }}>{months || "-"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#111827" }}>
              <span>Estimated total</span>
              <span>NPR {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "14px 20px",
              borderRadius: 14,
              border: "none",
              background: submitting ? "#93C5FD" : "#2563EB",
              color: "white",
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {submitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
};
