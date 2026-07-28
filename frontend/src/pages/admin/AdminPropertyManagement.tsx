import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteProperty, getProperties } from "../../api/propertyApi";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { showToast } from "../../components/Toast";
import { getMediaUrl } from "../../utils/media";
import type { Property } from "../../types/property";

interface AdminPropertyManagementProps {
  onBack: () => void;
  onAddProperty: () => void;
  onEditProperty: (id: string) => void;
}

export const AdminPropertyManagement = ({
  onBack,
  onAddProperty,
  onEditProperty,
}: AdminPropertyManagementProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProperties({}, 1, 100);
      setProperties(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const filteredProperties = useMemo(
    () =>
      properties.filter((property) => {
        const matchesSearch =
          !search.trim() ||
          `${property.title} ${property.location} ${property.city}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || property.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [properties, search, statusFilter]
  );

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteProperty(deleteTarget._id);
      setProperties((current) => current.filter((item) => item._id !== deleteTarget._id));
      showToast("Property removed successfully", "success");
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete property", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1280, margin: "0 auto" }}>
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
        ← Back to Admin Panel
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#111827" }}>
            Property Management
          </h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 15 }}>
            Review, edit, and retire property listings while reusing the existing property APIs.
          </p>
        </div>

        <button
          onClick={onAddProperty}
          style={{
            padding: "12px 20px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Add Property
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or location..."
            style={{
              flex: 1,
              minWidth: 240,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              fontFamily: "inherit",
            }}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "white",
              fontFamily: "inherit",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {loading && <LoadingSpinner text="Loading properties..." />}

        {!loading && error && (
          <EmptyState title="Unable to load properties" description={error} action={{ label: "Retry", onClick: loadProperties }} />
        )}

        {!loading && !error && filteredProperties.length === 0 && (
          <EmptyState
            title="No properties match the current filters"
            description="Try another search or add a new property to get started."
            action={{ label: "Add Property", onClick: onAddProperty }}
          />
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <div style={{ display: "grid", gap: 18 }}>
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  gap: 18,
                  padding: 18,
                  borderRadius: 18,
                  border: "1px solid #E5E7EB",
                  background: "#F8FAFC",
                }}
              >
                <img
                  src={
                    getMediaUrl(property.images?.[0]) ||
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80"
                  }
                  alt={property.title}
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 14 }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 20, color: "#111827" }}>{property.title}</h3>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: property.featured ? "#EFF6FF" : "#F3F4F6",
                          color: property.featured ? "#2563EB" : "#6B7280",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {property.featured ? "Featured" : "Standard"}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 10px", color: "#6B7280", lineHeight: 1.6 }}>
                      {property.location}, {property.city} • {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                    </p>
                    <p style={{ margin: "0 0 12px", color: "#111827", fontWeight: 700 }}>
                      NPR {property.price.toLocaleString()} / month
                    </p>
                    <p style={{ margin: 0, color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>
                      {(property.description || "No description available.").slice(0, 140)}
                      {property.description.length > 140 ? "..." : ""}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 150 }}>
                    <button
                      onClick={() => onEditProperty(property._id)}
                      style={{
                        padding: "11px 16px",
                        borderRadius: 12,
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(property)}
                      style={{
                        padding: "11px 16px",
                        borderRadius: 12,
                        border: "1px solid #FECACA",
                        background: "#FEF2F2",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete property"
        message={`This will permanently remove "${deleteTarget?.title || "this listing"}" from the platform.`}
        confirmLabel="Delete Property"
        loading={deleteLoading}
      />
    </div>
  );
};
