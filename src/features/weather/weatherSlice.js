import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { geocodeCity, getWeatherByCoords } from '../../api/weatherApi'

// Helper to normalize coordinates to a consistent key format
function coordsKey(lat, lon) {
  return `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`
}

export const fetchCityByName = createAsyncThunk('weather/fetchCityByName', async ({ name, units }) => {
  const geos = await geocodeCity(name)
  if (!geos || geos.length === 0) throw new Error('City not found')
  const first = geos[0]
  const data = await getWeatherByCoords(first.lat, first.lon, units)
  // use stable key based on coords to avoid name collisions
  const meta = { name: first.name, country: first.country, state: first.state, lat: first.lat, lon: first.lon, units }
  return { meta, data }
})

export const fetchByCoords = createAsyncThunk('weather/fetchByCoords', async ({ lat, lon, units }) => {
  const data = await getWeatherByCoords(lat, lon, units)
  const meta = { lat, lon, units }
  return { meta, data }
})

const slice = createSlice({
  name: 'weather',
  initialState: {
    cities: {}, // key -> { meta, data, lastUpdated }
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityByName.pending, (s) => { s.status = 'loading' })
      .addCase(fetchCityByName.fulfilled, (s, a) => {
        s.status = 'idle'
        const key = coordsKey(a.payload.meta.lat, a.payload.meta.lon)
        s.cities[key] = { meta: a.payload.meta, data: a.payload.data, lastUpdated: Date.now() }
      })
      .addCase(fetchCityByName.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message })
      .addCase(fetchByCoords.fulfilled, (s, a) => {
        const key = coordsKey(a.payload.meta.lat, a.payload.meta.lon)
        s.cities[key] = { meta: a.payload.meta, data: a.payload.data, lastUpdated: Date.now() }
      })
  }
})

export default slice.reducer
