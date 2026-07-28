import { useState } from "react";
import { createProperty } from "../../api/propertyApi";
import { PropertyForm } from "../../components/PropertyForm";
import { showToast } from "../../components/Toast";

interface AdminAddPropertyProps {
  onBack: () => void;
}

export const AdminAddProperty = ({ onBack }: AdminAddPropertyProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      await createProperty(formData);
      showToast("Property created successfully", "success");
      onBack();
    } finally {
      setLoading(false);
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
          Add Property
        </h1>
        <p style={{ margin: 0, color: "#6B7280", fontSize: 15 }}>
          Publish a new rental listing for Kathmandu Valley using the shared property form.
        </p>
      </div>

      <PropertyForm initialData={null} onSubmit={handleSubmit} onCancel={onBack} loading={loading} />
    </div>
  );
};
