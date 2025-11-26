import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TempChart from '../widgets/charts/TempChart'
import { iconUrl } from '../api/weatherApi'

export default function CityView(){
  const { id } = useParams()
  const cities = useSelector(s => s.weather.cities)
  // try raw and decoded id
  const city = cities[id] || cities[decodeURIComponent(id || '')]
  if (!city) return (
    <div className="card">City data not found. <Link to="/">Go back</Link></div>
  )

  const hourly = (city.data.hourly || []).slice(0,24)
  const daily = (city.data.daily || []).slice(0,7)
  const cur = city.data.current || {}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src={iconUrl(cur.weather && cur.weather[0] && cur.weather[0].icon)} alt="icon" style={{width:56,height:56}} />
          <div>
            <h2 style={{margin:0}}>{city.meta.name}</h2>
            <div style={{color:'#475569',fontSize:13}}>{city.meta.state ? `${city.meta.state}, ` : ''}{city.meta.country}</div>
          </div>
        </div>

        <div style={{textAlign:'right'}}>
          <div style={{fontSize:28,fontWeight:700}}>{Math.round(cur.temp ?? 0)}°</div>
          <div style={{color:'#475569',fontSize:13}}>Feels like {Math.round(cur.feels_like ?? cur.temp ?? 0)}°</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h4 style={{margin:0}}>Quick Stats</h4>
          <Link to="/">Back to Dashboard</Link>
        </div>

        <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap'}}>
          <div style={{flex:'1 1 160px'}} className="card">
            <div style={{fontSize:12,color:'#475569'}}>Humidity</div>
            <div style={{fontWeight:700}}>{cur.humidity ?? '—'}%</div>
          </div>
          <div style={{flex:'1 1 160px'}} className="card">
            <div style={{fontSize:12,color:'#475569'}}>Wind</div>
            <div style={{fontWeight:700}}>{cur.wind_speed ?? '—'} m/s</div>
          </div>
          <div style={{flex:'1 1 160px'}} className="card">
            <div style={{fontSize:12,color:'#475569'}}>Pressure</div>
            <div style={{fontWeight:700}}>{cur.pressure ?? '—'} hPa</div>
          </div>
          <div style={{flex:'1 1 160px'}} className="card">
            <div style={{fontSize:12,color:'#475569'}}>UV Index</div>
            <div style={{fontWeight:700}}>{cur.uvi ?? '—'}</div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:12}}>
        <div className="card">
          <h4 style={{marginTop:0}}>Hourly (next 24h)</h4>
          <TempChart data={hourly} type="hourly" />
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <h4 style={{marginTop:0}}>7-day Forecast</h4>
            <TempChart data={daily} type="daily" />
          </div>

          <div className="card">
            <h4 style={{marginTop:0}}>Detailed Stats</h4>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div>Sunrise</div>
              <div>{city.data.current ? new Date(city.data.current.sunrise * 1000).toLocaleTimeString() : '—'}</div>
              <div>Sunset</div>
              <div>{city.data.current ? new Date(city.data.current.sunset * 1000).toLocaleTimeString() : '—'}</div>
              <div>Dew Point</div>
              <div>{city.data.current ? Math.round(city.data.current.dew_point) : '—'}</div>
              <div>Visibility</div>
              <div>{city.data.current ? (city.data.current.visibility ?? '—') : '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
