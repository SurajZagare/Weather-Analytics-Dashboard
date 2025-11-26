import React from 'react'
import { Link } from 'react-router-dom'
import { FiCloud, FiTrendingUp, FiMapPin, FiRefreshCw } from 'react-icons/fi'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 40px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiCloud size={32} style={{ color: '#667eea' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#333' }}>
            Weather Analytics
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '8px 16px',
              borderRadius: 6,
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f4ff'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            style={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '10px 20px',
              backgroundColor: '#667eea',
              borderRadius: 6,
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#764ba2'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#667eea'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 20px',
        }}
      >
        <FiCloud size={80} style={{ marginBottom: 20 }} />
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, margin: '20px 0', maxWidth: 600 }}>
          Weather Analytics Dashboard
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: 40, maxWidth: 500, opacity: 0.95 }}>
          Real-time weather data, forecasts, and detailed analytics for your favorite locations.
        </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              padding: '14px 32px',
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: 50, color: '#333' }}>
          Features
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 30,
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Feature 1 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiMapPin size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              Multiple Locations
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Search and add weather data for multiple cities around the world.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiTrendingUp size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              Detailed Charts
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Visualize hourly and daily weather trends with interactive charts.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiRefreshCw size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              Real-Time Updates
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Stay updated with automatic refreshes every 55 seconds.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiCloud size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              Save Favorites
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Save your favorite locations and access them instantly.
            </p>
          </div>

          {/* Feature 5 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiTrendingUp size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              7-Day Forecast
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Get accurate weather forecasts for the next week.
            </p>
          </div>

          {/* Feature 6 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <FiRefreshCw size={48} style={{ color: '#667eea', marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: '#333' }}>
              Unit Selection
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Switch between Celsius and Fahrenheit instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: 20 }}>
          Ready to explore weather like never before?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: 30 }}>
          Get instant access to real-time weather analytics and forecasts.
        </p>
        {/* <Link
          to="/dashboard"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            fontSize: '1.1rem',
            fontWeight: 600,
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          Launch Dashboard
        </Link> */}
      </div>
    </div>
  )
}
