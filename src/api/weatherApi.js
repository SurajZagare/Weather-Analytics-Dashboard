import axios from 'axios'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
if (!API_KEY) console.warn('VITE_OWM_API_KEY not set')

const CACHE_TTL_MS = 55_000 // keep below 60s for "real-time" requirement

function cacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null
    return parsed.data
  } catch (e) {
    return null
  }
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })) } catch (e) {}
}

export async function geocodeCity(query) {
  const key = cacheKey('geo', { q: query })
  const cached = readCache(key)
  if (cached) return cached
  if (!API_KEY) {
    const err = new Error('VITE_OWM_API_KEY not set')
    console.error('geocodeCity error', err)
    throw err
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  try {
    const res = await axios.get(url)
    writeCache(key, res.data)
    return res.data
  } catch (e) {
    // Normalize axios error to include status and message
    const status = e?.response?.status
    const msg = e?.response?.data?.message || e.message || 'unknown error'
    const err = new Error(`Geocode failed: ${status || 'no-status'} - ${msg}`)
    console.error('geocodeCity error', { original: e, status, msg })
    throw err
  }
}

export async function getWeatherByCoords(lat, lon, units = 'metric') {
  const key = cacheKey('onecall', { lat, lon, units })
  const cached = readCache(key)
  if (cached) return cached
  if (!API_KEY) {
    const err = new Error('VITE_OWM_API_KEY not set')
    console.error('getWeatherByCoords error', err)
    throw err
  }

  const url3 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely&appid=${API_KEY}`
  try {
    const res = await axios.get(url3)
    writeCache(key, res.data)
    return res.data
  } catch (e) {
    const status = e?.response?.status
    const msg = e?.response?.data?.message || e.message || 'unknown error'
    console.error('getWeatherByCoords 3.0 failed', { status, msg })
    // If 3.0 fails with 401/403 (account/plan issue), try legacy 2.5 endpoint as a fallback
    if (status === 401 || status === 403) {
      // Many free accounts can't access One Call 3.0. Try composing data from
      // the free endpoints (`/data/2.5/weather` and `/data/2.5/forecast`).
      try {
        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
        const [wRes, fRes] = await Promise.all([axios.get(urlWeather), axios.get(urlForecast)])

        // Normalize to a shape similar to One Call: { current, hourly, daily }
        const current = {
          dt: Math.floor(Date.now() / 1000),
          temp: wRes.data.main.temp,
          humidity: wRes.data.main.humidity,
          wind_speed: wRes.data.wind?.speed || 0,
          weather: wRes.data.weather || []
        }

        // Forecast API returns 3-hour slots in `list` with `dt` and `main.temp`.
        // Build hourly (approx) by mapping these entries.
        const hourly = (fRes.data.list || []).map(item => ({ dt: item.dt, temp: item.main.temp, weather: item.weather }))

        // Build a simple daily summary by grouping hourly items by day and taking the day's mean temp
        const daysMap = {}
        hourly.forEach(h => {
          const day = new Date(h.dt * 1000).toISOString().slice(0,10)
          if (!daysMap[day]) daysMap[day] = { temps: [], dt: h.dt }
          daysMap[day].temps.push(h.temp)
        })
        const daily = Object.keys(daysMap).map(k => {
          const rec = daysMap[k]
          const avg = rec.temps.reduce((a,b)=>a+b,0)/rec.temps.length
          return { dt: rec.dt, temp: { day: Math.round(avg) } }
        })

        const composed = { current, hourly, daily }
        writeCache(key, composed)
        console.warn('getWeatherByCoords: composed fallback from weather+forecast endpoints')
        return composed
      } catch (e2) {
        const s2 = e2?.response?.status
        const m2 = e2?.response?.data?.message || e2.message || 'unknown error'
        console.error('getWeatherByCoords fallback (weather+forecast) failed', { s2, m2, e2 })
        throw new Error(`Weather fetch failed: ${s2 || 'no-status'} - ${m2}`)
      }
    }
    throw new Error(`Weather fetch failed: ${status || 'no-status'} - ${msg}`)
  }
}

export function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}
