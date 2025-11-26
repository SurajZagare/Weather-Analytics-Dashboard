import { createSlice } from '@reduxjs/toolkit'

const LS_KEY = 'waf:settings'
function load() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || { units: (import.meta.env.VITE_DEFAULT_UNITS || 'metric') } } catch(e){ return { units: 'metric' } }

}

const slice = createSlice({
  name: 'settings',
  initialState: load(),
  reducers: {
    setUnits(state, action) { state.units = action.payload; localStorage.setItem(LS_KEY, JSON.stringify(state)) }
  }
})

export const { setUnits } = slice.actions
export default slice.reducer
