import './SearchBar.css'
import { useState } from 'react'

export const SearchBar = ({ placeholder = 'Cari rumus matematika...', onSearch, showSuggestions = false }) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <svg
        className="search-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
    </div>
  )
}
