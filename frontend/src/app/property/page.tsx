"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Styles from "./property.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyForm {
  name: string;
  type: string;
  location: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  listingType: "For Sale" | "For Rent" | "";
  description: string;
  features: {
    parking: boolean;
    garden: boolean;
    pool: boolean;
    gym: boolean;
  };
}

const EMPTY_FORM: PropertyForm = {
  name: "",
  type: "",
  location: "",
  price: "",
  size: "",
  bedrooms: 1,
  bathrooms: 1,
  status: "",
  listingType: "",
  description: "",
  features: { parking: false, garden: false, pool: false, gym: false },
};

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "House",
  "Studio",
  "Penthouse",
  "Townhouse",
  "Commercial",
  "Land",
];

const STATUS_OPTIONS = ["Available", "Sold", "Rented", "Under Offer"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?id=123  → edit mode   |   no id → add mode
  const propertyId = searchParams.get("id");
  const isEditMode = Boolean(propertyId);

  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── In edit mode, fetch existing property data ──────────────────────────────
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!res.ok) throw new Error("Failed to fetch property.");

        const data = await res.json();

        setForm({
          name: data.name ?? "",
          type: data.type ?? "",
          location: data.location ?? "",
          price: String(data.price ?? ""),
          size: String(data.size ?? ""),
          bedrooms: data.bedrooms ?? 1,
          bathrooms: data.bathrooms ?? 1,
          status: data.status ?? "",
          listingType: data.listingType ?? "",
          description: data.description ?? "",
          features: {
            parking: data.features?.parking ?? false,
            garden: data.features?.garden ?? false,
            pool: data.features?.pool ?? false,
            gym: data.features?.gym ?? false,
          },
        });
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Could not load property.",
        );
      } finally {
        setFetchingData(false);
      }
    };

    fetchProperty();
  }, [isEditMode, propertyId]);

  // ── Field helpers ───────────────────────────────────────────────────────────
  const set = (field: keyof PropertyForm, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleFeature = (key: keyof PropertyForm["features"]) =>
    setForm((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] },
    }));

  const handleSpinner = (field: "bedrooms" | "bathrooms", delta: number) =>
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !form.name ||
      !form.type ||
      !form.location ||
      !form.price ||
      !form.size
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.listingType) {
      setError("Please select a listing type (For Sale / For Rent).");
      return;
    }
    if (!form.status) {
      setError("Please select a status.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const body = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (key === "features") {
          body.append("features", JSON.stringify(val));
        } else {
          body.append(key, String(val));
        }
      });
      images.forEach((img) => body.append("images", img));

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/properties`;

      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed.");

      setSuccess(
        isEditMode
          ? "Property updated successfully!"
          : "Property added successfully!",
      );

      // Redirect after short delay so user sees the success message
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton while fetching in edit mode ────────────────────────────
  if (fetchingData) {
    return (
      <div className={Styles.root}>
        <div
          className={Styles.card}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          <p style={{ color: "#757575", fontSize: 16 }}>Loading property…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={Styles.root}>
      {/* Decorative circles */}
      <div className={`${Styles.circle} ${Styles.c1}`} />
      <div className={`${Styles.circle} ${Styles.c2}`} />
      <div className={`${Styles.circle} ${Styles.c3}`} />
      <div className={`${Styles.circle} ${Styles.c4}`} />

      {/* Back button */}
      <button
        className={Styles.backBtn}
        onClick={() => router.back()}
        aria-label="Go back"
      >
        ←
      </button>

      {/* Card */}
      <div className={Styles.cardWrap}>
        <div className={Styles.card}>
          {/* Header */}
          <div className={Styles.cardHeader}>
            <h1 className={Styles.cardTitle}>
              {isEditMode ? "✏️ Update Property" : "🏠 Add New Property"}
            </h1>
            <p className={Styles.cardSubtitle}>
              {isEditMode
                ? "Edit the details below to update your listing"
                : "Fill in the details to list your property"}
            </p>
          </div>

          <hr className={Styles.divider} />

          {/* Form */}
          <form className={Styles.form} onSubmit={handleSubmit} noValidate>
            {/* Property Name */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Property Name *</label>
              <input
                className={Styles.fieldInput}
                type="text"
                placeholder="e.g., Modern Villa, Luxury Apartment"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            {/* Property Type */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Property Type *</label>
              <select
                className={`${Styles.fieldInput} ${Styles.fieldSelect}`}
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select property type
                </option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Location *</label>
              <input
                className={Styles.fieldInput}
                type="text"
                placeholder="e.g., Downtown, City Center"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                required
              />
            </div>

            {/* Price + Size */}
            <div className={Styles.row}>
              <div className={`${Styles.fieldGroup} ${Styles.flex1}`}>
                <label className={Styles.fieldLabel}>Price *</label>
                <input
                  className={Styles.fieldInput}
                  type="number"
                  placeholder="e.g., 350000 or 1200"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  min={0}
                  required
                />
              </div>
              <div className={`${Styles.fieldGroup} ${Styles.flex1}`}>
                <label className={Styles.fieldLabel}>Size (sqft) *</label>
                <input
                  className={Styles.fieldInput}
                  type="number"
                  placeholder="e.g., 2400"
                  value={form.size}
                  onChange={(e) => set("size", e.target.value)}
                  min={0}
                  required
                />
              </div>
            </div>

            {/* Bedrooms + Bathrooms */}
            <div className={Styles.row}>
              <div className={`${Styles.fieldGroup} ${Styles.flex1}`}>
                <label className={Styles.fieldLabel}>Bedrooms *</label>
                <div className={Styles.spinner}>
                  <button
                    type="button"
                    className={Styles.spinBtn}
                    onClick={() => handleSpinner("bedrooms", -1)}
                  >
                    −
                  </button>
                  <span className={Styles.spinVal}>{form.bedrooms}</span>
                  <button
                    type="button"
                    className={Styles.spinBtn}
                    onClick={() => handleSpinner("bedrooms", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={`${Styles.fieldGroup} ${Styles.flex1}`}>
                <label className={Styles.fieldLabel}>Bathrooms *</label>
                <div className={Styles.spinner}>
                  <button
                    type="button"
                    className={Styles.spinBtn}
                    onClick={() => handleSpinner("bathrooms", -1)}
                  >
                    −
                  </button>
                  <span className={Styles.spinVal}>{form.bathrooms}</span>
                  <button
                    type="button"
                    className={Styles.spinBtn}
                    onClick={() => handleSpinner("bathrooms", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Status *</label>
              <select
                className={`${Styles.fieldInput} ${Styles.fieldSelect}`}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select availability status
                </option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Listing Type */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Listing Type *</label>
              <div className={Styles.radioRow}>
                {(["For Sale", "For Rent"] as const).map((lt) => (
                  <label key={lt} className={Styles.radioLabel}>
                    <input
                      type="radio"
                      name="listingType"
                      value={lt}
                      checked={form.listingType === lt}
                      onChange={() => set("listingType", lt)}
                    />
                    {lt}
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Description *</label>
              <textarea
                className={`${Styles.fieldInput} ${Styles.fieldTextarea}`}
                placeholder="Enter a detailed description of the property..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Additional Features */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Additional Features</label>
              <div className={Styles.checkboxRow}>
                {(
                  Object.keys(form.features) as Array<
                    keyof PropertyForm["features"]
                  >
                ).map((key) => (
                  <label key={key} className={Styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={form.features[key]}
                      onChange={() => toggleFeature(key)}
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className={Styles.fieldGroup}>
              <label className={Styles.fieldLabel}>Property Images</label>
              <button
                type="button"
                className={Styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                + Add Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {images.length > 0 && (
                <div className={Styles.imageList}>
                  {images.map((img, i) => (
                    <div key={i} className={Styles.imageItem}>
                      <span className={Styles.imageName}>📎 {img.name}</span>
                      <button
                        type="button"
                        className={Styles.imageRemove}
                        onClick={() => removeImage(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            {error && (
              <p className={`${Styles.msg} ${Styles.msgError}`}>{error}</p>
            )}
            {success && (
              <p className={`${Styles.msg} ${Styles.msgSuccess}`}>{success}</p>
            )}

            {/* Action buttons */}
            <div className={Styles.btnRow}>
              <button
                type="button"
                className={`${Styles.btn} ${Styles.btnCancel}`}
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${Styles.btn} ${Styles.btnSubmit}`}
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating…"
                    : "Adding…"
                  : isEditMode
                    ? "Update Property"
                    : "Add Property"}
              </button>
            </div>

            <p className={Styles.requiredNote}>* Required fields</p>
          </form>
        </div>
      </div>
    </div>
  );
}
