import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TempChart from "../widgets/charts/TempChart";
import { iconUrl } from "../api/weatherApi";

export default function CityView() {
  const { id } = useParams();
  const cities = useSelector((s) => s.weather.cities);

  const city = cities[id] || cities[decodeURIComponent(id || "")];
  if (!city)
    return (
      <div className="city-card">
        City data not found. <Link to="/">Go back</Link>
      </div>
    );

  const hourly = (city.data.hourly || []).slice(0, 24);
  const daily = (city.data.daily || []).slice(0, 7);
  const cur = city.data.current || {};

  return (
    <>
      {/* ======= PAGE CSS (Professional UI) ======= */}
      <style>{`
        .city-container {
          padding: 20px;
          max-width: 1200px;
          margin: auto;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .icon-img {
          width: 60px;
          height: 60px;
        }

        .city-title {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
        }

        .city-sub {
          font-size: 14px;
          color: #475569;
          margin-top: 2px;
        }

        .temp-main {
          font-size: 32px;
          font-weight: 700;
          text-align: right;
        }

        .temp-sub {
          font-size: 13px;
          color: #475569;
          text-align: right;
        }

        .city-card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .stats-grid {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .stat-box {
          flex: 1 1 160px;
          background: #f8fafc;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 12px;
          color: #475569;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
        }

        .layout-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 16px;
        }

        @media(max-width: 1000px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .detail-label {
          font-size: 13px;
          color: #334155;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>

      <div className="city-container">
        {/* ------- Header Row ------- */}
        <div className="header-row">
          <div className="header-left">
            <img
              src={iconUrl(cur.weather && cur.weather[0] && cur.weather[0].icon)}
              alt="icon"
              className="icon-img"
            />

            <div>
              <h2 className="city-title">{city.meta.name}</h2>
              <div className="city-sub">
                {city.meta.state ? `${city.meta.state}, ` : ""}
                {city.meta.country}
              </div>
            </div>
          </div>

          <div>
            <div className="temp-main">{Math.round(cur.temp ?? 0)}°</div>
            <div className="temp-sub">
              Feels like {Math.round(cur.feels_like ?? cur.temp ?? 0)}°
            </div>
          </div>
        </div>

        {/* ------- Quick Stats ------- */}
        <div className="city-card" style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0 }}>Quick Stats</h4>
            <Link to="/">Back to Dashboard</Link>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">Humidity</div>
              <div className="stat-value">{cur.humidity ?? "—"}%</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Wind</div>
              <div className="stat-value">{cur.wind_speed ?? "—"} m/s</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Pressure</div>
              <div className="stat-value">{cur.pressure ?? "—"} hPa</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">UV Index</div>
              <div className="stat-value">{cur.uvi ?? "—"}</div>
            </div>
          </div>
        </div>

        {/* ------- Charts + Details Layout ------- */}
        <div className="layout-grid">
          {/* Hourly Chart */}
          <div className="city-card">
            <h4 style={{ marginTop: 0 }}>Hourly (next 24h)</h4>
            <TempChart data={hourly} type="hourly" />
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Daily Chart */}
            <div className="city-card">
              <h4 style={{ marginTop: 0 }}>7-day Forecast</h4>
              <TempChart data={daily} type="daily" />
            </div>

            {/* Detailed Stats */}
            <div className="city-card">
              <h4 style={{ marginTop: 0 }}>Detailed Stats</h4>

              <div className="detail-grid">
                <div className="detail-label">Sunrise</div>
                <div className="detail-value">
                  {cur.sunrise
                    ? new Date(cur.sunrise * 1000).toLocaleTimeString()
                    : "—"}
                </div>

                <div className="detail-label">Sunset</div>
                <div className="detail-value">
                  {cur.sunset
                    ? new Date(cur.sunset * 1000).toLocaleTimeString()
                    : "—"}
                </div>

                <div className="detail-label">Dew Point</div>
                <div className="detail-value">
                  {cur.dew_point ? Math.round(cur.dew_point) : "—"}
                </div>

                <div className="detail-label">Visibility</div>
                <div className="detail-value">
                  {cur.visibility ?? "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
