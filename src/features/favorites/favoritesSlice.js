import { createSlice } from '@reduxjs/toolkit'

const LS_KEY = 'waf:favorites'
function load() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch(e){return []} }

const slice = createSlice({
  name: 'favorites',
  initialState: { list: load() },
  reducers: {
    addFavorite(state, action) {
      const id = action.payload
      if (!state.list.includes(id)) state.list.push(id)
      localStorage.setItem(LS_KEY, JSON.stringify(state.list))
    },
    removeFavorite(state, action) {
      state.list = state.list.filter(x => x !== action.payload)
      localStorage.setItem(LS_KEY, JSON.stringify(state.list))
    }
  }
})

export const { addFavorite, removeFavorite } = slice.actions
export default slice.reducer
