import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import CityView from './views/CityView'
import Landing from './views/Landing'
import { useSelector, useDispatch } from 'react-redux'
import { setUnits } from './features/settings/settingsSlice'

export default function App(){
  const units = useSelector(s => s.settings.units)
  const dispatch = useDispatch()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="app">
      {!isLanding && (
        <div className="header">
          <h2><Link to="/dashboard">Weather Analytics</Link></h2>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <label style={{fontSize:14}}>Units</label>
            <select value={units} onChange={(e)=>dispatch(setUnits(e.target.value))}>
              <option value="metric">Celsius</option>
              <option value="imperial">Fahrenheit</option>
            </select>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/city/:id" element={<CityView/>} />
      </Routes>
    </div>
  )
}
