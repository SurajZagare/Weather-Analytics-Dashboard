import React from 'react'
import { FiStar, FiMenu } from 'react-icons/fi'
import SearchBar from '../widgets/SearchBar'
import { useSelector } from 'react-redux'

export default function NavBar(){
  const favs = useSelector(s => s.favorites.list || [])

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" aria-label="menu"><FiMenu size={18} /></button>
        <div className="logo">Weather<span className="logo-accent">Analytics</span></div>
      </div>

      <div className="navbar-center">
        <div className="global-search">
          <SearchBar />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" title="Favorites">
          <FiStar size={18} />
          {favs.length > 0 && <span className="fav-badge">{favs.length}</span>}
        </button>
      </div>
    </header>
  )
}
