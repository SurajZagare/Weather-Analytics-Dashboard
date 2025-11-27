import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCloud,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiTrendingUp,
  FiMapPin,
  FiArrowUpCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Landing() {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* PAGE CSS */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(to bottom, #eaf3ff, #f4f6ff, #ffffff);
        }

        /* ========== NAVBAR ========== */
        .nav {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 16px 40px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,200,255,0.4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-brand-title {
          font-size: 20px;
          font-weight: 700;
          color: #3554d1;
        }

        .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-links span {
          cursor: pointer;
          font-weight: 600;
          color: #485989;
          transition: 0.2s;
        }
        .nav-links span:hover {
          color: #6a4ffd;
        }

        .nav-btn {
          padding: 10px 22px;
          background: linear-gradient(90deg, #5e7cea, #7b5df6);
          color: white;
          border-radius: 8px;
          font-weight: 600;
        }

        .mobile-menu-icon {
          display: none;
          cursor: pointer;
        }

        /* MOBILE MENU */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 240px;
          height: 100%;
          background: white;
          box-shadow: -2px 0px 10px rgba(0,0,0,0.1);
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          z-index: 200;
        }

        .mobile-link {
          font-size: 16px;
          font-weight: 600;
          color: #3a4c7f;
          cursor: pointer;
        }

        @media(max-width: 860px) {
          .nav-links { display: none; }
          .mobile-menu-icon { display: block; }
        }

        /* ========== HERO ========== */
        .hero {
          margin-top: 120px;
          display: flex;
          padding: 40px;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .hero-left {
          max-width: 550px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
          color: #1f2d55;
        }

        .hero-sub {
          margin-top: 14px;
          font-size: 18px;
          color: #4f5d80;
        }

        .hero-buttons {
          margin-top: 26px;
          display: flex;
          gap: 16px;
        }

        .btn-main {
          padding: 14px 30px;
          background: white;
          border: 1px solid #ccd7ff;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        .btn-main:hover { transform: scale(1.03); }

        .btn-outline {
          padding: 14px 30px;
          border-radius: 12px;
          background: #eef2ff;
          font-weight: 600;
          color: #4b6ce0;
          cursor: pointer;
        }

        .card {
          width: 340px;
          padding: 24px;
          border-radius: 22px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(190,200,255,0.5);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
        }

        .mini-boxes {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .mini-box {
          padding: 10px;
          text-align: center;
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          font-size: 14px;
          color: #324066;
        }

        .hours {
          margin-top: 20px;
          display: flex;
          gap: 14px;
          overflow-x: auto;
        }

        .hour-card {
          min-width: 80px;
          background: rgba(255,255,255,0.7);
          padding: 10px;
          border-radius: 12px;
          text-align: center;
        }

        @media(max-width:960px) {
          .hero {
            flex-direction: column;
            text-align: center;
          }
          .card { width: 100%; max-width: 380px; }
        }

        /* ========== SECTIONS ========== */
        section {
          padding: 80px 40px;
          text-align: center;
        }

        .features-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 28px;
        }

        .feature-card {
          background: white;
          border-radius: 18px;
          padding: 25px;
          border: 1px solid #d5ddff;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        .contact-box {
          margin-top: 40px;
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .scroll-top {
          position: fixed;
          right: 25px;
          bottom: 30px;
          cursor: pointer;
        }
      `}</style>

      {/* ========== NAVBAR ========== */}
      <div className="nav">
        <div className="nav-brand">
          <FiCloud size={32} color="#4b6ce0" />
          <div>
            <div className="nav-brand-title">SkyWeather</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Weather Analytics</div>
          </div>
        </div>

        <div className="nav-links">
          <span onClick={scrollToTop}>Home</span>
          <span onClick={() => scrollTo(aboutRef)}>About</span>
          <span onClick={() => scrollTo(featuresRef)}>Features</span>
          <span onClick={() => scrollTo(contactRef)}>Contact</span>

          {/* ⭐ FIXED (a → Link) */}
          <Link to="/dashboard" className="nav-btn" style={{ display: "inline-block" }}>
            Dashboard
          </Link>
        </div>

        <div className="mobile-menu-icon" onClick={() => setMenuOpen(true)}>
          <FiMenu size={30} color="#3554d1" />
        </div>
      </div>

      {/* ========== MOBILE MENU ========== */}
      {menuOpen && (
        <div className="mobile-menu">
          <FiX size={30} onClick={() => setMenuOpen(false)} style={{ cursor: "pointer" }} />

          <div className="mobile-link" onClick={scrollToTop}>Home</div>
          <div className="mobile-link" onClick={() => scrollTo(aboutRef)}>About</div>
          <div className="mobile-link" onClick={() => scrollTo(featuresRef)}>Features</div>
          <div className="mobile-link" onClick={() => scrollTo(contactRef)}>Contact</div>

          {/* ⭐ FIXED */}
          <Link to="/dashboard" className="nav-btn" style={{ display: "inline-block" }}>
            Dashboard
          </Link>
        </div>
      )}

      {/* ========== HERO ========== */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-title">Understand Weather Like Never Before</div>
          <div className="hero-sub">Visual weather insights, live updates, and advanced analytics.</div>

          <div className="hero-buttons">
            {/* ⭐ FIXED */}
            <Link to="/dashboard" className="btn-main" style={{ display: "inline-block" }}>
              Explore Dashboard
            </Link>

            <button className="btn-outline" onClick={() => scrollTo(featuresRef)}>
              See Features
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-top">
            <div>
              <div style={{ fontSize: 14 }}>Pune, IN</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>29°C</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Cloudy • Feels 30°C</div>
            </div>
            <FiCloud size={45} color="#4b6ce0" />
          </div>

          <div className="mini-boxes">
            <div className="mini-box">Humidity: 56%</div>
            <div className="mini-box">Wind: 14 kph</div>
          </div>

          <div style={{ marginTop: 20, fontWeight: 600 }}>Next Hours</div>
          <div className="hours">
            {[6, 8, 10, 12, 14, 16].map((t, i) => (
              <div className="hour-card" key={i}>
                <div>{t}:00</div>
                <div style={{ fontWeight: 700 }}>{24 + (i % 3)}</div>
                <div>{i % 2 ? "☀️" : "🌤️"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== ABOUT SECTION ========== */}
      <section ref={aboutRef}>
        <h2 style={{ fontSize: 34, fontWeight: 700 }}>About SkyWeather</h2>
        <p style={{ maxWidth: 700, margin: "16px auto", fontSize: 16 }}>
          SkyWeather provides accurate forecasts, climate analytics,
          and city-wise real-time updates to help users stay informed.
        </p>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section ref={featuresRef}>
        <h2 style={{ fontSize: 34, fontWeight: 700 }}>Features</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <f.icon size={42} color="#4b6ce0" />
              <h3 style={{ marginTop: 14 }}>{f.title}</h3>
              <p style={{ fontSize: 14, marginTop: 6, color: "#4d5b8b" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section ref={contactRef}>
        <h2
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "white",
            padding: "20px",
            borderRadius: 16,
            background: "linear-gradient(90deg,#7b5df6,#4b6ce0)",
          }}
        >
          Contact Us
        </h2>

        <div className="contact-box">
          <div className="contact-item">
            <FiMail size={42} color="#4b6ce0" />
            <p>surajzagare225@gmail.com</p>
          </div>

          <div className="contact-item">
            <FiPhone size={42} color="#4b6ce0" />
            <p>+91 9325798775</p>
          </div>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      <div className="scroll-top" onClick={scrollToTop}>
        <FiArrowUpCircle size={50} color="#4b6ce0" />
      </div>
    </>
  );
}

const FEATURES = [
  { icon: FiMapPin, title: "Global Tracking", desc: "Monitor cities worldwide." },
  { icon: FiTrendingUp, title: "Interactive Charts", desc: "Visual climate & temperature analysis." },
  { icon: FiRefreshCw, title: "Live Updates", desc: "" },
  { icon: FiCloud, title: "Cloud Analysis", desc: "Track cloud movement in real-time." },
];
