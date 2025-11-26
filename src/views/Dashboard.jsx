import React, {useEffect, useRef, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchByCoords, fetchCityByName } from '../features/weather/weatherSlice'
import SearchBarPro from '../widgets/SearchBarPro'
import CityCard from '../widgets/CityCard'

export default function Dashboard(){
  const dispatch = useDispatch()
  const cities = useSelector(s => s.weather.cities)
  const favorites = useSelector(s => s.favorites.list)
  const units = useSelector(s => s.settings.units)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // helper: determine if a city entry matches a favorite identifier
  function favMatches(fav, key, item) {
    if (!fav) return false
    const favStr = String(fav).trim()
    const key2 = String(key).trim()
    
    // direct key match (handles lat,lon format)
    if (favStr === key2) return true
    
    // try URL decoding both
    try {
      if (decodeURIComponent(favStr) === decodeURIComponent(key2)) return true
    } catch (e) {}
    
    // match by name (case-insensitive)
    const name = item?.meta?.name
    if (name && favStr.toLowerCase() === name.toLowerCase()) return true
    
    return false
  }

  useEffect(()=>{
    // when favorites change, fetch any favorites that aren't already loaded
    favorites.forEach(fav => {
      // fav is stored as lat,lon key; if it contains a comma fetch by coords
      if (fav && fav.includes(',')){
        const [lat, lon] = fav.split(',').map(x => parseFloat(x))
        // normalize key the same way as the Redux slice
        const normalizedKey = `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`
        // only fetch if not already in cities
        if (!cities[normalizedKey]) {
          dispatch(fetchByCoords({ lat, lon, units }))
        }
      } else if (fav) {
        // for name-based favorites, check if we already have it
        const alreadyLoaded = Object.values(cities).some(c => c.meta && c.meta.name === fav)
        if (!alreadyLoaded) {
          dispatch(fetchCityByName({ name: fav, units }))
        }
      }
    })
  }, [favorites, dispatch, units])

  const navigate = useNavigate()
  const refreshIntervalRef = useRef()

  // hook: realtime refresh
  useRealtimeRefresh(cities, dispatch, units)

  // when units change, immediately re-fetch current cities in the selected units
  useEffect(() => {
    Object.values(cities).forEach(item => {
      const meta = item.meta || {}
      if (meta.lat != null && meta.lon != null) {
        dispatch(fetchByCoords({ lat: meta.lat, lon: meta.lon, units }))
      }
    })
  }, [units, dispatch])

  return (
    <div>
      <div className="hero">
        <div className="hero-left">
          <div className="hero-title">Weather Analytics Dashboard</div>
          <div className="hero-sub">Overview of current conditions, forecasts, and trends for your saved locations.</div>
        </div>
        <div className="hero-stats">
          <div className="stat">Cities</div>
          <div className="stat">Favorites</div>
        </div>
      </div>

      {/* Centered Professional Search Bar */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,marginBottom:32,paddingX:20}}>
        <SearchBarPro />
        <button
          onClick={() => setShowFavoritesOnly(s => !s)}
          style={{
            padding:'10px 24px',
            fontSize:'0.95rem',
            fontWeight:600,
            border: showFavoritesOnly ? '2px solid #667eea' : '2px solid #e2e8f0',
            backgroundColor: showFavoritesOnly ? '#667eea' : 'white',
            color: showFavoritesOnly ? 'white' : '#333',
            borderRadius:8,
            cursor:'pointer',
            transition:'all 0.3s',
            boxShadow: showFavoritesOnly ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!showFavoritesOnly) {
              e.target.style.borderColor = '#667eea'
              e.target.style.color = '#667eea'
            }
          }}
          onMouseLeave={(e) => {
            if (!showFavoritesOnly) {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.color = '#333'
            }
          }}
          title="Toggle favorites view"
        >
          {showFavoritesOnly ? '★ Show All Cities' : `☆ Show Favorites (${favorites.length})`}
        </button>
      </div>

      <div className="grid">
        {Object.keys(cities).length === 0 && (
          <div className="card">No cities yet — use the search box to add a city.</div>
        )}
        {(() => {
          const favSet = new Set(favorites || [])
          const entries = Object.entries(cities).filter(([key, item]) => {
            if (!showFavoritesOnly) return true
            // show only if any favorite matches this entry
            return (favorites || []).some(fav => favMatches(fav, key, item))
          })

          if (entries.length === 0) {
            return (
              <div className="card">{showFavoritesOnly ? 'No favorites yet — add some from the cards.' : 'No cities yet — use the search box to add a city.'}</div>
            )
          }

          return entries.map(([key, item]) => (
            <div key={key} style={{position:'relative'}}>
              <CityCard id={key} city={item} units={units} />
              <div style={{position:'absolute',top:8,right:8}}>
                <button onClick={() => navigate(`/city/${encodeURIComponent(key)}`)} style={{padding:'6px 8px',borderRadius:6}}>Show</button>
              </div>
            </div>
          ))
        })()}
      </div>
    </div>
  )
}

// Periodically refresh visible cities every 55s to keep data near real-time
// (We use a ref to ensure only one interval is active.)
function useRealtimeRefresh(cities, dispatch, units) {
  const intervalRef = useRef(null)
  useEffect(() => {
    // clear previous
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      Object.values(cities).forEach(item => {
        const meta = item.meta || {}
        if (meta.lat != null && meta.lon != null) {
          dispatch(fetchByCoords({ lat: meta.lat, lon: meta.lon, units }))
        }
      })
    }, 55_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [cities, dispatch, units])
}

// Hook usage: call at bottom of file to wire it into the Dashboard component
