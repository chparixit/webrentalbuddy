import { useState, useEffect } from "react";
import type { Property } from "../types/property";
import { ImageUpload } from "./ImageUpload";

interface PropertyFormProps {
  initialData?: Property | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const kathmanduLocations = [
  "Thamel", "Lazimpat", "Baluwatar", "Durbarmarg", "New Baneshwor",
  "Old Baneshwor", "Koteshwor", "Gaushala", "Chabahil", "Mitra Park",
  "Naxal", "Maharajgunj", "Budhanilkantha", "Gongabu", "Samakhusi",
  "Kalimati", "Kuleshwor", "Swayambhu", "Chhauni",
];

const lalitpurLocations = [
  "Pulchowk", "Jawalakhel", "Patan Durbar Square", "Kupondole",
  "Sanepa", "Kumaripati", "Lagankhel", "Imadol",
];

const bhaktapurLocations = [
  "Durbar Square", "Suryabinayak", "Changu Narayan", "Chyamasingh",
];

export const PropertyForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: PropertyFormProps) => {
  const isEdit = !!initialData;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"available" | "rented" | "maintenance">("available");
  const [featured, setFeatured] = useState(false);
  const [amenitiesStr, setAmenitiesStr] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(String(initialData.price || ""));
      setPropertyType(initialData.propertyType || "apartment");
      setBedrooms(String(initialData.bedrooms || "1"));
      setBathrooms(String(initialData.bathrooms || "1"));
      setArea(String(initialData.area || ""));
      setCity(initialData.city || "Kathmandu");
      setLocation(initialData.location || "");
      setStatus(initialData.status || "available");
      setFeatured(initialData.featured || false);
      setAmenitiesStr((initialData.amenities || []).join(", "));
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const getLocations = () => {
    if (city === "Kathmandu") return kathmanduLocations;
    if (city === "Lalitpur") return lalitpurLocations;
    if (city === "Bhaktapur") return bhaktapurLocations;
    return [];
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || Number(price) <= 0) newErrors.price = "Valid price is required";
    if (!area || Number(area) <= 0) newErrors.area = "Valid area is required";
    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("propertyType", propertyType);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("area", area);
    formData.append("city", city);
    formData.append("location", location);
    formData.append("status", status);
    formData.append("featured", String(featured));

    const amenities = amenitiesStr
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    amenities.forEach((a) => formData.append("amenities", a));

    newImages.forEach((img) => formData.append("images", img));

    if (isEdit) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      await onSubmit(formData);
      setSuccessMsg(isEdit ? "Property updated successfully!" : "Property created successfully!");
      if (!isEdit) {
        setTitle("");
        setDescription("");
        setPrice("");
        setPropertyType("apartment");
        setBedrooms("1");
        setBathrooms("1");
        setArea("");
        setCity("Kathmandu");
        setLocation("");
        setStatus("available");
        setFeatured(false);
        setAmenitiesStr("");
        setNewImages([]);
      }
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to save property" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px", color: "#111827" }}>
        {isEdit ? "Edit Property" : "Add New Property"}
      </h2>

      {successMsg && (
        <div
          style={{
            padding: "12px 16px",
            background: "#ECFDF5",
            borderRadius: 10,
            border: "1px solid #A7F3D0",
            color: "#059669",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {successMsg}
        </div>
      )}

      {errors.form && (
        <div
          style={{
            padding: "12px 16px",
            background: "#FEF2F2",
            borderRadius: 10,
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {errors.form}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {/* Title */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: `1.5px solid ${errors.title ? "#DC2626" : "#E5E7EB"}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
            }}
          />
          {errors.title && <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.title}</span>}
        </div>

        {/* Price */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Price (NPR) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: `1.5px solid ${errors.price ? "#DC2626" : "#E5E7EB"}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
            }}
          />
          {errors.price && <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.price}</span>}
        </div>

        {/* Property Type */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Bedrooms
          </label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Bathrooms
          </label>
          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Area (sqft) *
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: `1.5px solid ${errors.area ? "#DC2626" : "#E5E7EB"}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
            }}
          />
          {errors.area && <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.area}</span>}
        </div>

        {/* City */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            City
          </label>
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); setLocation(""); }}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Location *
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: `1.5px solid ${errors.location ? "#DC2626" : "#E5E7EB"}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            <option value="">Select location</option>
            {getLocations().map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.location}</span>}
        </div>

        {/* Status */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#111827",
              boxSizing: "border-box",
              background: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Featured */}
        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#374151" }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#2563EB" }}
            />
            <span style={{ fontWeight: 500 }}>Mark as Featured Property</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "11px 14px",
            border: `1.5px solid ${errors.description ? "#DC2626" : "#E5E7EB"}`,
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            color: "#111827",
            boxSizing: "border-box",
            background: "#FAFAFA",
            resize: "vertical",
          }}
        />
        {errors.description && <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.description}</span>}
      </div>

      {/* Amenities */}
      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Amenities (comma separated)
        </label>
        <input
          value={amenitiesStr}
          onChange={(e) => setAmenitiesStr(e.target.value)}
          placeholder="e.g. WiFi, Parking, AC, Gym"
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            color: "#111827",
            boxSizing: "border-box",
            background: "#FAFAFA",
          }}
        />
      </div>

      {/* Images */}
      <div style={{ marginTop: 20 }}>
        <ImageUpload
          label="Images"
          hint="Add clear interior and exterior photos to improve listing quality."
          files={newImages}
          existingUrls={existingImages}
          onFilesChange={setNewImages}
          onExistingUrlsChange={setExistingImages}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: "14px 24px",
            background: loading ? "#9CA3AF" : "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.background = "#1D4ED8")}
          onMouseOut={(e) => !loading && (e.currentTarget.style.background = "#2563EB")}
        >
          {loading ? "Saving..." : isEdit ? "Update Property" : "Add Property"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: "14px 24px",
            background: "white",
            color: "#374151",
            border: "1.5px solid #E5E7EB",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.background = "#F9FAFB")}
          onMouseOut={(e) => !loading && (e.currentTarget.style.background = "white")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
