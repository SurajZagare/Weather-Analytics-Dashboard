import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";
import { fetchByCoords } from "../features/weather/weatherSlice";
import dayjs from "dayjs";
import { iconUrl } from "../api/weatherApi";

/**
 * Professional CityCard
 * - Temp color theme
 * - 12-hour sparkline (SVG)
 * - Glass-like card (compatible with Tailwind v1; small inline blur/alpha)
 *
 * Expects: city.data.current, optional city.data.hourly (array of hourly objects with .temp and .dt)
 */

export default function CityCard({ id, city, units }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favs = useSelector((s) => s.favorites.list || []);
  const isFav = favs.includes(id);

  const cur = city?.data?.current || {};
  const hourly = city?.data?.hourly || [];

  // Build last 12 hours temps (most recent first -> reversed to left-to-right)
  const sparkData = useMemo(() => {
    if (Array.isArray(hourly) && hourly.length > 0) {
      // pick up to 12 most recent hours: hourly[0] is usually current hour in many APIs
      const slice = hourly.slice(0, 12);
      // ensure length 12 by padding with current temp if needed
      const vals = slice.map(h => (typeof h.temp === "number" ? h.temp : null)).filter(v => v != null);
      while (vals.length < 12) vals.push(Math.round(cur.temp ?? vals[vals.length - 1] ?? 0));
      return vals.reverse(); // reverse so oldest is left, newest is right
    }
    // fallback: repeat current temp 12 times
    const fallback = Array(12).fill(Math.round(cur.temp ?? 0));
    return fallback;
  }, [hourly, cur]);

  // Determine color theme based on temperature in Celsius
  const tempC = units === "metric" ? cur.temp : (cur.temp - 32) * (5/9); // if units are imperial convert approx
  const theme = useMemo(() => {
    // When tempC is undefined, default to warm
    if (tempC == null || Number.isNaN(tempC)) return {
      bg: "bg-white",
      accent: "text-orange-500",
      border: "border-gray-200"
    };
    if (tempC >= 30) {
      return { bg: "bg-white", accent: "text-red-500", border: "border-red-200" };
    } else if (tempC >= 15) {
      return { bg: "bg-white", accent: "text-yellow-500", border: "border-yellow-200" };
    } else {
      return { bg: "bg-white", accent: "text-blue-500", border: "border-blue-200" };
    }
  }, [tempC]);

  function toggleFav(e) {
    e.stopPropagation();
    isFav ? dispatch(removeFavorite(id)) : dispatch(addFavorite(id));
  }

  function goToDetails(e) {
    // If caller passed event (button inside card), stop propagation first
    if (e) e.stopPropagation();
    navigate(`/city/${encodeURIComponent(id)}`);
  }

  function onRefresh(e) {
    e?.stopPropagation();
    const lat = city?.meta?.lat;
    const lon = city?.meta?.lon;
    if (lat != null && lon != null) dispatch(fetchByCoords({ lat, lon, units }));
  }

  // Sparkline generation: returns path d and min/max for small tooltip scaling if needed
  const sparklinePath = useMemo(() => {
    const w = 120; // svg width
    const h = 36;  // svg height
    const padding = 4;
    const data = sparkData.slice(); // array of numbers length 12

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max === min ? 1 : (max - min);

    const stepX = (w - padding * 2) / (data.length - 1);
    const points = data.map((val, i) => {
      const x = padding + i * stepX;
      const y = padding + (1 - (val - min) / range) * (h - padding * 2);
      return { x, y, val };
    });

    // build path
    const d = points.map((p, i) => (i === 0 ? `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}` : `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)).join(" ");

    // build area path for subtle fill
    const areaD = d + ` L ${w - padding} ${h - padding} L ${padding} ${h - padding} Z`;

    return { d, areaD, w, h, min, max, points };
  }, [sparkData]);

  // Helper: small formatted lastUpdated
  const updatedAt = city?.lastUpdated ? dayjs(city.lastUpdated).format("HH:mm:ss") : "—";

  return (
    <div
      onClick={goToDetails}
      className={`relative cursor-pointer rounded-lg shadow-md transition duration-200 transform hover:-translate-y-1 ${theme.border}`}
      // glass-like inline style (backdrop-filter may not be available in older browsers; works well where supported)
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(255,255,255,0.6)",
        padding: 16,
        // small blur for glass effect; Tailwind v1 may lack backdrop-filter utilities so inline it
        WebkitBackdropFilter: "blur(6px)",
        backdropFilter: "blur(6px)"
      }}
      role="button"
      aria-label={`Open details for ${city?.meta?.name || id}`}
    >
      {/* top-left temperature pill */}
      {cur?.temp !== undefined && (
        <div className={`absolute top-3 left-3 inline-block px-3 py-1 rounded-full text-sm font-semibold ${theme.accent}`} style={{ background: "rgba(255,255,255,0.85)" }}>
          {Math.round(cur.temp)}°{units === "metric" ? "C" : "F"}
        </div>
      )}

      {/* top-right action buttons */}
      <div className="absolute top-3 right-3 flex items-center">
        <button
          onClick={toggleFav}
          className="text-sm focus:outline-none mr-2"
          title={isFav ? "Remove favorite" : "Add favorite"}
          aria-pressed={isFav}
        >
          <span className="font-semibold" style={{ color: isFav ? "#D97706" : "#374151" }}>
            {isFav ? "★" : "☆"}
          </span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onRefresh(); }}
          className="text-xs px-2 py-1 rounded"
          style={{ background: "#eef2ff", borderRadius: 6, border: "1px solid rgba(0,0,0,0.03)" }}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {/* Header row: city name + icon and current temp */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold text-gray-800">{city?.meta?.name || id}</div>
          <div className="text-xs text-gray-500">{city?.meta?.country || ""}</div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">
            {cur?.temp !== undefined ? Math.round(cur.temp) + "°" + (units === "metric" ? "C" : "F") : "—"}
          </div>
          {cur?.weather?.[0]?.icon && (
            <img src={iconUrl(cur.weather[0].icon)} alt="weather-icon" className="w-12 h-12 inline-block" />
          )}
        </div>
      </div>

      {/* Middle section: description + sparkline + KPIs */}
      <div className="mt-3">
        <div className="text-sm text-gray-700 capitalize">{cur?.weather?.[0]?.description || ""}</div>

        <div className="flex items-center justify-between mt-3">
          {/* Sparkline */}
          <div className="flex-shrink-0">
            <svg width={sparklinePath.w} height={sparklinePath.h} viewBox={`0 0 ${sparklinePath.w} ${sparklinePath.h}`} xmlns="http://www.w3.org/2000/svg" aria-hidden>
              {/* gentle area fill */}
              <path d={sparklinePath.areaD} fill="rgba(79,70,229,0.08)" />
              {/* outline */}
              <path d={sparklinePath.d} fill="none" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              {/* current point marker */}
              {sparklinePath.points.length > 0 && (
                <circle cx={sparklinePath.points[sparklinePath.points.length - 1].x} cy={sparklinePath.points[sparklinePath.points.length - 1].y} r="2.8" fill="#4F46E5" />
              )}
            </svg>
          </div>

          {/* KPIs */}
          <div className="text-sm text-gray-700" style={{ minWidth: 120 }}>
            <div>Humidity: <span className="font-semibold">{cur?.humidity ?? "—"}%</span></div>
            <div>Wind: <span className="font-semibold">{cur?.wind_speed ?? "—"} {units === "metric" ? "m/s" : "mph"}</span></div>
          </div>
        </div>

        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <div>Feels: <span className="font-semibold">{Math.round(cur?.feels_like ?? cur?.temp ?? 0)}°</span></div>
          <div>Pressure: <span className="font-semibold">{cur?.pressure ?? "—"} hPa</span></div>
        </div>

        {cur?.uvi !== undefined && (
          <div className="mt-2 text-xs text-gray-500">UV: <span className="font-semibold">{cur.uvi}</span></div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <button
            onClick={(e) => { e.stopPropagation(); goToDetails(e); }}
            className="text-xs px-3 py-1 rounded"
            style={{ background: "#eef2ff", borderRadius: 6 }}
          >
            Details
          </button>
        </div>

        <div>Updated: <span className="font-medium text-gray-700">{updatedAt}</span></div>
      </div>
    </div>
  );
}
