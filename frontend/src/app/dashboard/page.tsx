"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image?: string;
  type: "sale" | "rent";
}

interface User {
  username: string;
  role: "buyer" | "seller" | "admin";
  totalProperties?: number;
  forSale?: number;
  forRent?: number;
}

// ─── Mock data (replace with real API calls) ──────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  { id: 1, title: "ss3", location: "Karachi",   price: 51200,  beds: 3, baths: 2, sqft: 2600, type: "sale" },
  { id: 2, title: "ss2", location: "Karachi",   price: 350000, beds: 4, baths: 2, sqft: 4400, type: "sale" },
  { id: 3, title: "ss",  location: "Karachi",   price: 350000, beds: 3, baths: 2, sqft: 2400, type: "rent" },
  { id: 4, title: "ss4", location: "Lahore",    price: 120000, beds: 4, baths: 3, sqft: 3200, type: "sale" },
  { id: 5, title: "ss5", location: "Lahore",    price: 85000,  beds: 3, baths: 2, sqft: 2100, type: "rent" },
  { id: 6, title: "ss6", location: "Islamabad", price: 210000, beds: 5, baths: 3, sqft: 4800, type: "sale" },
];

const MOCK_USER: User = {
  username: "tb1",
  role: "seller",
  totalProperties: 8,
  forSale: 7,
  forRent: 1,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  const [user]                      = useState<User>(MOCK_USER);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filterType, setFilterType] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchPanelRef              = useRef<HTMLDivElement>(null);

  // Search form state
  const [locEnabled,   setLocEnabled]   = useState(false);
  const [location,     setLocation]     = useState("");
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [minPrice,     setMinPrice]     = useState("");
  const [maxPrice,     setMaxPrice]     = useState("");
  const [sizeEnabled,  setSizeEnabled]  = useState(false);
  const [minSize,      setMinSize]      = useState("");
  const [maxSize,      setMaxSize]      = useState("");
  const [bedsEnabled,  setBedsEnabled]  = useState(false);
  const [beds,         setBeds]         = useState("");

  // Close search panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Filter on dropdown change
  useEffect(() => {
    setProperties(
      filterType === "all" ? MOCK_PROPERTIES : MOCK_PROPERTIES.filter((p) => p.type === filterType)
    );
  }, [filterType]);

  function applySearch() {
    let result = MOCK_PROPERTIES;
    if (filterType !== "all")        result = result.filter((p) => p.type === filterType);
    if (locEnabled && location)      result = result.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
    if (priceEnabled && minPrice)    result = result.filter((p) => p.price >= Number(minPrice));
    if (priceEnabled && maxPrice)    result = result.filter((p) => p.price <= Number(maxPrice));
    if (sizeEnabled  && minSize)     result = result.filter((p) => p.sqft  >= Number(minSize));
    if (sizeEnabled  && maxSize)     result = result.filter((p) => p.sqft  <= Number(maxSize));
    if (bedsEnabled  && beds)        result = result.filter((p) => p.beds  === Number(beds));
    setProperties(result);
    setSearchOpen(false);
  }

  function clearSearch() {
    setLocEnabled(false);   setLocation("");
    setPriceEnabled(false); setMinPrice(""); setMaxPrice("");
    setSizeEnabled(false);  setMinSize("");  setMaxSize("");
    setBedsEnabled(false);  setBeds("");
    setProperties(MOCK_PROPERTIES);
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  const isSeller = user.role === "seller" || user.role === "admin";

  return (
    <div className={styles.root}>

      {/* ══════════════════════════════════════════════════════ NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}>🏡</span>
          <div>
            <div className={styles.logoTitle}>Ashiana</div>
            <div className={styles.logoSub}>Your Dream Home Awaits</div>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navUser}>
            <span className={styles.navWelcome}>Welcome, {user.username}!</span>
            <span className={styles.navExplore}>Explore properties</span>
          </div>

          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* ── Search button + dropdown ── */}
          <div className={styles.searchWrap} ref={searchPanelRef}>
            <button
              className={`${styles.btnPrimary} ${styles.searchBtn}`}
              onClick={() => setSearchOpen((v) => !v)}
            >
              🔍 Search
            </button>

            {searchOpen && (
              <div className={styles.searchPanel}>
                <div className={styles.spTitle}>Advanced Search</div>
                <hr className={styles.spDivider} />

                {/* Location */}
                <div className={styles.spRow}>
                  <label className={styles.spCheckLabel}>
                    <input
                      type="checkbox"
                      className={styles.spCheckbox}
                      checked={locEnabled}
                      onChange={(e) => setLocEnabled(e.target.checked)}
                    />
                    <span className={styles.spLabel}>Location</span>
                  </label>
                  <input
                    type="text"
                    className={styles.spInput}
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!locEnabled}
                  />
                </div>

                {/* Price Range */}
                <div className={styles.spRow}>
                  <label className={styles.spCheckLabel}>
                    <input
                      type="checkbox"
                      className={styles.spCheckbox}
                      checked={priceEnabled}
                      onChange={(e) => setPriceEnabled(e.target.checked)}
                    />
                    <span className={styles.spLabel}>Price Range</span>
                  </label>
                  <div className={styles.spRangeWrap}>
                    <input
                      className={styles.spInput}
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      disabled={!priceEnabled}
                    />
                    <span className={styles.spDash}>—</span>
                    <input
                      className={styles.spInput}
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      disabled={!priceEnabled}
                    />
                  </div>
                </div>

                {/* Size */}
                <div className={styles.spRow}>
                  <label className={styles.spCheckLabel}>
                    <input
                      type="checkbox"
                      className={styles.spCheckbox}
                      checked={sizeEnabled}
                      onChange={(e) => setSizeEnabled(e.target.checked)}
                    />
                    <span className={styles.spLabel}>Size (sqft)</span>
                  </label>
                  <div className={styles.spRangeWrap}>
                    <input
                      className={styles.spInput}
                      placeholder="Min"
                      value={minSize}
                      onChange={(e) => setMinSize(e.target.value)}
                      disabled={!sizeEnabled}
                    />
                    <span className={styles.spDash}>—</span>
                    <input
                      className={styles.spInput}
                      placeholder="Max"
                      value={maxSize}
                      onChange={(e) => setMaxSize(e.target.value)}
                      disabled={!sizeEnabled}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div className={styles.spRow}>
                  <label className={styles.spCheckLabel}>
                    <input
                      type="checkbox"
                      className={styles.spCheckbox}
                      checked={bedsEnabled}
                      onChange={(e) => setBedsEnabled(e.target.checked)}
                    />
                    <span className={styles.spLabel}>Bedrooms</span>
                  </label>
                  <input
                    type="number"
                    className={styles.spInput}
                    placeholder="Number of bedrooms"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    disabled={!bedsEnabled}
                    min={1}
                  />
                </div>

                <hr className={styles.spDivider} />

                <div className={styles.spActions}>
                  <button className={`${styles.btnPrimary} ${styles.btnSm}`} onClick={applySearch}>
                    Apply Search
                  </button>
                  <button className={`${styles.btnPrimary} ${styles.btnSm}`} onClick={clearSearch}>
                    Clear
                  </button>
                  <button className={`${styles.btnPrimary} ${styles.btnSm}`} onClick={() => setSearchOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className={styles.btnDanger} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ BODY */}
      <div className={styles.body}>

        {/* ════════════════════════════════════════════════ SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarButtons}>
            {isSeller && (
              <button
                className={`${styles.sbBtn} ${styles.sbPrimary}`}
                onClick={() => router.push("/dashboard/add-property")}
              >
                <span className={styles.sbBtnIcon}>➕</span> Add Property
              </button>
            )}

            {isSeller && (
              <button
                className={`${styles.sbBtn} ${styles.sbGreen}`}
                onClick={() => router.push("/dashboard/inquiries")}
              >
                <span className={styles.sbBtnIcon}>📬</span> View Inquiries
              </button>
            )}

            <button
              className={`${styles.sbBtn} ${styles.sbPink}`}
              onClick={() => router.push("/dashboard/responses")}
            >
              <span className={styles.sbBtnIcon}>💬</span> My Responses
            </button>

            <button
              className={`${styles.sbBtn} ${styles.sbBlue}`}
              onClick={() => router.push("/dashboard/ratings")}
            >
              <span className={styles.sbBtnIcon}>⭐</span> Ratings
            </button>
          </div>

          {/* Quick Stats */}
          <div className={styles.statsBox}>
            <div className={styles.statsHeader}>
              <span>📊</span>
              <strong>Quick Stats</strong>
            </div>
            <hr className={styles.spDivider} />
            <div className={styles.statsRow}>Total Properties: <strong>{user.totalProperties}</strong></div>
            <div className={styles.statsRow}>For Sale: <strong>{user.forSale}</strong></div>
            <div className={styles.statsRow}>For Rent: <strong>{user.forRent}</strong></div>
          </div>

          <button
            className={`${styles.sbBtn} ${styles.sbOrange}`}
            onClick={() => router.push("/dashboard/profile")}
          >
            <span className={styles.sbBtnIcon}>👤</span> View Profile
          </button>
        </aside>

        {/* ════════════════════════════════════════════════ MAIN */}
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Available Properties</h1>
            <p className={styles.pageSub}>Browse through our curated collection of homes</p>
          </div>

          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardImg}>
                  {property.image ? (
                    <img src={property.image} alt={property.title} />
                  ) : (
                    <div className={styles.cardImgPlaceholder}>🏠</div>
                  )}
                  <span className={`${styles.cardBadge} ${property.type === "sale" ? styles.badgeSale : styles.badgeRent}`}>
                    {property.type === "sale" ? "For Sale" : "For Rent"}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardName}>{property.title}</span>
                  <div className={styles.cardLocation}>📍 {property.location}</div>
                  <div className={styles.cardPrice}>$ {property.price.toLocaleString()}</div>
                  <div className={styles.cardStats}>
                    <span>🛏 {property.beds} Beds</span>
                    <span>🚿 {property.baths} Baths</span>
                    <span>📐 {property.sqft} sqft</span>
                  </div>
                  <button
                    className={`${styles.btnPrimary} ${styles.cardBtn}`}
                    onClick={() => router.push(`/details?id=${property.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {properties.length === 0 && (
              <div className={styles.emptyState}>No properties found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
