import React, {useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCityByName } from '../features/weather/weatherSlice'
import { addFavorite } from '../features/favorites/favoritesSlice'
import { geocodeCity } from '../api/weatherApi'

export default function SearchBar(){
  const [q, setQ] = useState('')
  const [suggests, setSuggests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)
  const dispatch = useDispatch()
  const units = useSelector(s => s.settings.units)

  async function onChange(v){
    setQ(v)
    setError(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.length < 2) { setSuggests([]); return }
    // debounce requests by 300ms
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try{
        const s = await geocodeCity(v)
        setSuggests(s || [])
        setError(null)
      }catch(e){
        console.error('geocodeCity error', e)
        setSuggests([])
        setError(e.message || 'Search unavailable — check console')
      }finally{
        setLoading(false)
      }
    }, 300)
  }


  function onSelect(item){
    setQ('')
    setSuggests([])
    const name = item.name || ''
    // fetch by the chosen name (the slice will normalize to lat,lon key)
    dispatch(fetchCityByName({ name, units }))
  }

  return (
    <div style={{position:'relative'}}>
      <div className="search">
        <input value={q} onChange={e=>onChange(e.target.value)} placeholder="Search city..." />
        {loading && <div style={{marginLeft:8}}>Loading...</div>}
      </div>
      {error && <div style={{color:'red',fontSize:12,marginTop:6}}>{error}</div>}
      {suggests.length>0 && (
        <div style={{position:'absolute',background:'#fff',border:'1px solid #eee',width:320,zIndex:10}}>
          {suggests.map(s=> (
            <div key={`${s.lat}-${s.lon}`} style={{padding:8,cursor:'pointer'}} onClick={()=>onSelect(s)}>
              {s.name}{s.state?`, ${s.state}`:''} — {s.country}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
