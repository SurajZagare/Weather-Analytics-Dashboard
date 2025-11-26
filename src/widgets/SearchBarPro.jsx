import React, {useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCityByName } from '../features/weather/weatherSlice'
import { geocodeCity } from '../api/weatherApi'
import { FiSearch, FiLoader, FiX } from 'react-icons/fi'

export default function SearchBarPro(){
  const [q, setQ] = useState('')
  const [suggests, setSuggests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)
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
    setFocused(false)
    const name = item.name || ''
    dispatch(fetchCityByName({ name, units }))
  }

  function onClear(){
    setQ('')
    setSuggests([])
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div style={{position:'relative',width:'100%',maxWidth:600}}>
      <div
        style={{
          display:'flex',
          alignItems:'center',
          backgroundColor:'white',
          border: focused ? '2px solid #667eea' : '2px solid #e2e8f0',
          borderRadius:12,
          padding:'12px 16px',
          transition:'all 0.3s',
          boxShadow: focused ? '0 4px 20px rgba(102, 126, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
          position:'relative',
          zIndex:1
        }}
      >
        <FiSearch size={20} style={{color:'#667eea',marginRight:12,flexShrink:0}} />
        <input
          ref={inputRef}
          value={q}
          onChange={e=>onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search cities worldwide..."
          style={{
            flex:1,
            border:'none',
            outline:'none',
            fontSize:'1rem',
            fontFamily:'inherit',
            backgroundColor:'transparent'
          }}
        />
        {loading && (
          <FiLoader size={18} style={{color:'#667eea',marginLeft:12,animation:'spin 1s linear infinite',flexShrink:0}} />
        )}
        {q && !loading && (
          <button
            onClick={onClear}
            style={{
              marginLeft:8,
              padding:'4px 8px',
              border:'none',
              background:'transparent',
              cursor:'pointer',
              color:'#999',
              fontSize:'1.2rem',
              flexShrink:0,
              transition:'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#667eea'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginTop:8,
          padding:'12px',
          backgroundColor:'#fee2e2',
          color:'#dc2626',
          borderRadius:8,
          fontSize:'0.875rem',
          border:'1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {suggests.length > 0 && (
        <div
          style={{
            position:'absolute',
            top:'100%',
            left:0,
            right:0,
            backgroundColor:'white',
            border:'2px solid #e2e8f0',
            borderTop:'none',
            borderRadius:'0 0 12px 12px',
            boxShadow:'0 8px 16px rgba(0,0,0,0.15)',
            maxHeight:'400px',
            overflowY:'auto',
            zIndex:10
          }}
        >
          {suggests.map((s, idx) => (
            <div
              key={`${s.lat}-${s.lon}`}
              onClick={() => onSelect(s)}
              style={{
                padding:'12px 16px',
                borderBottom: idx < suggests.length - 1 ? '1px solid #f1f5f9' : 'none',
                cursor:'pointer',
                transition:'all 0.2s',
                backgroundColor:'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <div style={{fontWeight:600,color:'#1e293b',fontSize:'0.95rem'}}>
                {s.name}
              </div>
              <div style={{fontSize:'0.85rem',color:'#64748b',marginTop:2}}>
                {s.state ? `${s.state}, ` : ''}{s.country}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
