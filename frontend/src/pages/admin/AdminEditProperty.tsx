import { useEffect, useState } from "react";
import { getProperty, updateProperty } from "../../api/propertyApi";
import { PropertyForm } from "../../components/PropertyForm";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { showToast } from "../../components/Toast";
import type { Property } from "../../types/property";

interface AdminEditPropertyProps {
  propertyId: string;
  onBack: () => void;
}

export const AdminEditProperty = ({ propertyId, onBack }: AdminEditPropertyProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getProperty(propertyId);
        setProperty(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);

    try {
      await updateProperty(propertyId, formData);
      showToast("Property updated successfully", "success");
      onBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1080, margin: "0 auto" }}>
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
        ← Back to Property Management
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#111827" }}>
          Edit Property
        </h1>
        <p style={{ margin: 0, color: "#6B7280", fontSize: 15 }}>
          Update listing details, amenities, and media without duplicating the existing form flow.
        </p>
      </div>

      {loading && <LoadingSpinner text="Loading property..." />}

      {!loading && error && (
        <EmptyState title="Property unavailable" description={error} action={{ label: "Go Back", onClick: onBack }} />
      )}

      {!loading && !error && property && (
        <PropertyForm initialData={property} onSubmit={handleSubmit} onCancel={onBack} loading={saving} />
      )}
    </div>
  );
};
