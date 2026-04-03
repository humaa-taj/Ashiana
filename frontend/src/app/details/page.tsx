"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./details.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "buyer" | "seller" | "admin";
type ListingStatus = "available" | "sold" | "rented";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: "House" | "Apartment" | "Plot" | "Commercial";
  listingType: "For Sale" | "For Rent";
  status: ListingStatus;
  description: string;
  image?: string;
  ownerName: string;
  ownerRating: number;
  features: {
    parking: boolean;
    garden: boolean;
    pool: boolean;
    gym: boolean;
  };
  ownerId: number;
}

// ─── Mock data (replace with real API call using query param id) ──────────────
const MOCK_PROPERTY: Property = {
  id: 1,
  title: "ss3",
  location: "Karachi",
  price: 1200,
  beds: 3,
  baths: 2,
  sqft: 2400,
  type: "House",
  listingType: "For Sale",
  status: "available",
  description:
    "d3 — A beautifully designed modern home in the heart of Karachi. Spacious rooms, excellent ventilation, and a serene neighbourhood make this property a perfect choice for families looking for comfort and convenience.",
  ownerName: "seerat5",
  ownerRating: 4,
  features: {
    parking: false,
    garden: true,
    pool: false,
    gym: false,
  },
  ownerId: 42,
};

// ─── Mock current session (replace with real auth context / JWT decode) ────────
const CURRENT_USER = {
  id: 99,           // change to 42 to see owner view
  role: "buyer" as Role,
};

// ─── Role / ownership helpers ─────────────────────────────────────────────────
//
//  ✏️  Update Property  → owner only
//  🗑️  Delete Property  → owner OR admin
//  📞  Contact Owner    → non-owner, available listing only
//  💳  Proceed to Pay   → buyer only, available listing only
//  ✅  Mark as Sold     → owner only, available listing only
//
function useButtonVisibility(property: Property, user: typeof CURRENT_USER) {
  const isOwner    = user.id === property.ownerId;
  const isAdmin    = user.role === "admin";
  const isBuyer    = user.role === "buyer";
  const isAvailable = property.status === "available";

  return {
    showUpdate:   isOwner,
    showDelete:   isOwner || isAdmin,
    showContact:  !isOwner && isAvailable,
    showPayment:  isBuyer && isAvailable,
    showMarkSold: isOwner && isAvailable,
  };
}

// ─── Feature map ─────────────────────────────────────────────────────────────
const FEATURE_MAP: Record<string, { emoji: string; label: string }> = {
  parking: { emoji: "🅿️", label: "Parking" },
  garden:  { emoji: "🌳", label: "Garden"  },
  pool:    { emoji: "🏊", label: "Pool"    },
  gym:     { emoji: "💪", label: "Gym"     },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetailsPage() {
  const router   = useRouter();
  const property = MOCK_PROPERTY;     // ← swap: const id = searchParams.get("id"); fetch(`/properties/${id}`)
  const user     = CURRENT_USER;      // ← swap: useAuthUser()

  const vis = useButtonVisibility(property, user);

  const [status, setStatus]               = useState<ListingStatus>(property.status);
  const [showContactModal, setShowModal]  = useState(false);

  const activeFeatures = Object.entries(property.features).filter(([, v]) => v).map(([k]) => k);

  const statusLabel = status === "available" ? "Available" : status === "sold" ? "Sold" : "Rented";
  const statusColor =
    status === "available" ? "rgba(76,175,80,0.95)"
    : status === "sold"    ? "rgba(244,67,54,0.9)"
    :                        "rgba(255,152,0,0.9)";

  return (
    <div className={styles.root}>

      {/* ── Decorative circles ────────────────────────────────── */}
      <div className={`${styles.circle} ${styles.c1}`} />
      <div className={`${styles.circle} ${styles.c2}`} />
      <div className={`${styles.circle} ${styles.c3}`} />
      <div className={`${styles.circle} ${styles.c4}`} />

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">←</button>

        <div className={styles.topbarActions}>
          {/* ✏️ Update — owner only */}
          {vis.showUpdate && (
            <button
              className={styles.btnPrimary}
              onClick={() => router.push(`/details/edit?id=${property.id}`)}
            >
              ✏️ Update Property
            </button>
          )}

          {/* 🗑️ Delete — owner or admin */}
          {vis.showDelete && (
            <button
              className={styles.btnDanger}
              onClick={() => {
                if (confirm("Are you sure you want to delete this property?")) {
                  // TODO: call DELETE /properties/:id then router.push("/dashboard")
                  alert("Property deleted (stub)");
                }
              }}
            >
              🗑️ Delete Property
            </button>
          )}

          {/* ✅ Mark as Sold — owner only, available only */}
          {vis.showMarkSold && (
            <button
              className={styles.btnSold}
              onClick={() => {
                if (confirm("Mark this property as sold?")) {
                  setStatus("sold");
                  // TODO: call PATCH /properties/:id { status: "sold" }
                }
              }}
            >
              ✅ Mark as Sold
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────── */}
      <div className={styles.scrollArea}>
        <div className={styles.content}>

          {/* ══════ CARD 1 — Image + header ══════════════════════ */}
          <div className={styles.card}>
            <div className={styles.imgWrap}>
              {property.image ? (
                <img src={property.image} alt={property.title} className={styles.propImg} />
              ) : (
                <div className={styles.imgPlaceholder}>🏠</div>
              )}
              <span className={styles.statusBadge} style={{ background: statusColor }}>
                {statusLabel}
              </span>
            </div>

            <div className={styles.propHeader}>
              <h1 className={styles.propTitle}>{property.title}</h1>
              <div className={styles.propLocation}>
                <span>📍</span>
                <span>{property.location}</span>
              </div>

              <hr className={styles.divider} />

              <div className={styles.statsRow}>
                <div className={styles.stat}><span className={styles.statIcon}>🛏️</span><span className={styles.statLabel}>{property.beds} Bedrooms</span></div>
                <div className={styles.stat}><span className={styles.statIcon}>🚿</span><span className={styles.statLabel}>{property.baths} Bathrooms</span></div>
                <div className={styles.stat}><span className={styles.statIcon}>✏️</span><span className={styles.statLabel}>{property.sqft} sqft</span></div>
                <div className={styles.stat}><span className={styles.statIcon}>🏠</span><span className={styles.statLabel}>{property.type}</span></div>
                <div className={styles.stat}><span className={styles.statIcon}>🏷️</span><span className={styles.statLabel}>{property.listingType}</span></div>
                <div className={styles.stat}><span className={styles.statIcon}>💵</span><span className={styles.statLabel}>{property.price.toLocaleString()} $</span></div>
              </div>
            </div>
          </div>

          {/* ══════ CARD 2 — Description + Features ══════════════ */}
          <div className={`${styles.card} ${styles.detailCard}`}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 Description</h2>
              <p className={styles.description}>{property.description}</p>
            </section>

            <hr className={styles.divider} />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>✨ Additional Features</h2>
              {activeFeatures.length > 0 ? (
                <div className={styles.featuresRow}>
                  {activeFeatures.map((key) => (
                    <div key={key} className={styles.feature}>
                      <div className={styles.featureIcon}>{FEATURE_MAP[key].emoji}</div>
                      <span className={styles.featureLabel}>{FEATURE_MAP[key].label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noFeatures}>No additional features listed.</p>
              )}
            </section>
          </div>

          {/* ══════ CARD 3 — Contact (non-owner only) ════════════ */}
          {vis.showContact && (
            <div className={styles.contactCard}>
              <p className={styles.contactHeading}>💬 Interested in this property?</p>

              <div className={styles.contactOwnerRow}>
                <span className={styles.contactLabel}>Contact the owner:</span>
                <span className={styles.ownerName}>{property.ownerName}</span>
                {/* Star rating */}
                <span className={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < property.ownerRating ? styles.starFilled : styles.star}>★</span>
                  ))}
                </span>
              </div>

              <div className={styles.contactActions}>
                {/* 📞 Contact Owner */}
                <button className={styles.btnWhite} onClick={() => setShowModal(true)}>
                  📞 Contact Owner
                </button>

                {/* 💳 Payment — buyer only, available only */}
                {vis.showPayment && (
                  <button
                    className={styles.btnWhite}
                    onClick={() => router.push(`/details/payment?id=${property.id}`)}
                  >
                    💳 Proceed to Payment
                  </button>
                )}

                {/* Sold/Rented label when listing is no longer available */}
                {status !== "available" && (
                  <span className={styles.soldLabel}>{statusLabel.toUpperCase()}</span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Contact modal ─────────────────────────────────────── */}
      {showContactModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Contact Owner</h3>
            <p className={styles.modalSub}>Send an inquiry to <strong>{property.ownerName}</strong></p>
            <textarea className={styles.modalTextarea} placeholder="Write your message…" rows={4} />
            <div className={styles.modalActions}>
              <button
                className={styles.btnPrimary}
                onClick={() => { setShowModal(false); alert("Inquiry sent! (stub)"); }}
              >
                Send Inquiry
              </button>
              <button className={styles.modalCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
