import './SearchSuggestions.css'
import { BlockFormula } from './MathFormula'

export const SearchSuggestions = ({ results, isOpen, onSelect, searchTerm }) => {
  if (!isOpen || results.length === 0) return null

  return (
    <div className="search-suggestions">
      <div className="suggestions-header">
        <span className="results-count">
          {results.length} hasil untuk "{searchTerm}"
        </span>
      </div>
      
      <div className="suggestions-list">
        {results.map(result => (
          <div
            key={result.id}
            className="suggestion-item"
            onClick={() => onSelect(result)}
          >
            <div className="suggestion-content">
              <div className="suggestion-title">{result.title}</div>
              <div className="suggestion-meta">
                <span className="suggestion-category">{result.category}</span>
                <span className="suggestion-difficulty">{result.difficulty}</span>
              </div>
              <div className="suggestion-formula">
                <BlockFormula formula={result.formula} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
