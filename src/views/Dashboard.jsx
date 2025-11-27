import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchByCoords, fetchCityByName } from "../features/weather/weatherSlice";
import SearchBarPro from "../widgets/SearchBarPro";
import CityCard from "../widgets/CityCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const cities = useSelector((s) => s.weather.cities);
  const favorites = useSelector((s) => s.favorites.list);
  const units = useSelector((s) => s.settings.units);

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const navigate = useNavigate();

  // Inject styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = PREMIUM_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ---------------- FAVORITES HANDLING ---------------- //
  function favMatches(fav, key, item) {
    if (!fav) return false;
    const f = fav.trim();
    const k = key.trim();

    if (f === k) return true;

    try {
      if (decodeURIComponent(f) === decodeURIComponent(k)) return true;
    } catch {}

    const name = item?.meta?.name?.trim().toLowerCase();
    return name && name === f.toLowerCase();
  }

  // Auto load missing favorites
  useEffect(() => {
    favorites.forEach((fav) => {
      if (!fav) return;

      if (fav.includes(",")) {
        const [lat, lon] = fav.split(",").map(Number);
        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;

        if (!cities[key]) {
          dispatch(fetchByCoords({ lat, lon, units }));
        }
      } else {
        const exists = Object.values(cities).some(
          (c) => c.meta?.name?.toLowerCase() === fav.toLowerCase()
        );

        if (!exists) {
          dispatch(fetchCityByName({ name: fav, units }));
        }
      }
    });
  }, [favorites, cities, units, dispatch]);

  // Re-fetch when units change
  useEffect(() => {
    Object.values(cities).forEach(({ meta }) => {
      if (meta?.lat && meta?.lon)
        dispatch(fetchByCoords({ lat: meta.lat, lon: meta.lon, units }));
    });
  }, [units, dispatch]);

  // Realtime updates
  usePremiumRealtimeRefresh(cities, dispatch, units);

  // ---------------- UI ---------------- //
  return (
    <div className="pg-container">
      {/* ---------------- HERO ---------------- */}
      <div className="pg-hero">
        <div className="pg-hero-content">
          <h1>Weather Analytics Dashboard</h1>
          <p>
            Track real-time weather, forecasts, and trends. Designed with a premium
            professional UI.
          </p>
        </div>

        <div className="pg-hero-stats">
          <div className="pg-stat-box">
            <strong>{Object.keys(cities).length}</strong>
            <span>Cities</span>
          </div>

          <div className="pg-stat-box">
            <strong>{favorites.length}</strong>
            <span>Favorites</span>
          </div>
        </div>

        <svg className="pg-orb" viewBox="0 0 500 500">
          <defs>
            <radialGradient id="pg-grad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#8da2ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#74d9ff" stopOpacity="0.35" />
            </radialGradient>
          </defs>
          <circle cx="250" cy="250" r="200" fill="url(#pg-grad)" />
        </svg>
      </div>

      {/* ---------------- Search + Favorites Button ---------------- */}
      <div className="pg-search-container">
        <SearchBarPro />

        <button
          className={`pg-fav-toggle ${showFavoritesOnly ? "active" : ""}`}
          onClick={() => setShowFavoritesOnly((x) => !x)}
        >
          {showFavoritesOnly
            ? "★ Show All Cities"
            : `☆ Show Favorites (${favorites.length})`}
        </button>
      </div>

      {/* ---------------- CITY GRID ---------------- */}
      <div className="pg-grid">
        {Object.keys(cities).length === 0 && (
          <div className="pg-empty">Search a city to begin.</div>
        )}

        {(() => {
          const filtered = Object.entries(cities).filter(([key, item]) =>
            showFavoritesOnly
              ? favorites.some((fav) => favMatches(fav, key, item))
              : true
          );

          if (filtered.length === 0)
            return (
              <div className="pg-empty">
                {showFavoritesOnly
                  ? "No favorites yet."
                  : "Use search to add cities."}
              </div>
            );

          return filtered.map(([key, item]) => (
            <div key={key} className="pg-card-wrapper">
              <CityCard id={key} city={item} units={units} />

              <button
                className="pg-open-btn"
                onClick={() => navigate(`/city/${encodeURIComponent(key)}`)}
              >
                View →
              </button>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

/* --------------------------------------------------------
   PREMIUM REALTIME REFRESH HOOK
-------------------------------------------------------- */
function usePremiumRealtimeRefresh(cities, dispatch, units) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) clearInterval(ref.current);

    ref.current = setInterval(() => {
      Object.values(cities).forEach(({ meta }) => {
        if (meta?.lat && meta?.lon) {
          dispatch(fetchByCoords({ lat: meta.lat, lon: meta.lon, units }));
        }
      });
    }, 55000);

    return () => clearInterval(ref.current);
  }, [cities, units, dispatch]);
}

/* --------------------------------------------------------
   PREMIUM GLASS UI STYLES (NO DARK MODE)
-------------------------------------------------------- */
const PREMIUM_STYLES = `
.pg-container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}

/* ---------------- HERO ---------------- */
.pg-hero {
  position: relative;
  padding: 60px 28px 90px;
  border-radius: 28px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(210,220,255,0.45);
  overflow: hidden;
  margin-bottom: 34px;
  animation: pgFade 0.75s ease-out;
}

.pg-hero-content h1 {
  font-size: 38px;
  font-weight: 800;
  color: #2a3b9e;
  margin: 0;
}
.pg-hero-content p {
  color: #60729c;
  margin-top: 10px;
  font-size: 16px;
}

.pg-orb {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 340px;
  height: 340px;
  animation: pgFloat 7s ease-in-out infinite;
  pointer-events: none;
  opacity: 0.85;
}

@keyframes pgFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(16px); }
  100% { transform: translateY(0px); }
}
@keyframes pgFade {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.pg-hero-stats {
  margin-top: 18px;
  display: flex;
  gap: 18px;
}
.pg-stat-box {
  background: white;
  border-radius: 16px;
  border: 1px solid #dfe6ff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  padding: 14px 26px;
  text-align: center;
}
.pg-stat-box strong {
  font-size: 26px;
  color: #2a3b9e;
}
.pg-stat-box span {
  display: block;
  color: #60729c;
  margin-top: 4px;
  font-size: 13px;
}

/* ---------------- SEARCH ---------------- */
.pg-search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.pg-fav-toggle {
  padding: 12px 26px;
  border-radius: 12px;
  border: 2px solid #d2d8f5;
  background: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: 0.25s;
}
.pg-fav-toggle:hover {
  border-color: #6b82ff;
  color: #6b82ff;
}
.pg-fav-toggle.active {
  background: #6b82ff;
  color: white;
  border-color: #6b82ff;
  box-shadow: 0 6px 18px rgba(107,130,255,0.35);
}

/* ---------------- GRID ---------------- */
.pg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 24px;
  animation: pgFade 0.7s ease-out;
}

.pg-empty {
  background: white;
  border-radius: 16px;
  padding: 22px;
  border: 1px solid #dfe6ff;
  text-align: center;
  font-weight: 600;
  color: #60729c;
}

.pg-card-wrapper {
  position: relative;
}

.pg-open-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #ccd7ff;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s;
}
.pg-open-btn:hover {
  background: #eef2ff;
  border-color: #6b82ff;
  color: #6b82ff;
}
`;
