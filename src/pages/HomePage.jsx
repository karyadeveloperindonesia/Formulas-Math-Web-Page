import './HomePage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, SearchBar, SearchSuggestions, CategoryCard, FormulaCard, Footer, Modal, BlockFormula } from '../components'
import { categories, formulas, stats } from '../data/formulas'
import { slugify, searchFormulas } from '../utils/formulaUtils'

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const navigate = useNavigate()

  const searchResults = searchTerm.trim() ? searchFormulas(formulas, searchTerm).slice(0, 8) : []

  const filteredFormulas = formulas.filter(formula => {
    const matchSearch =
      formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory ? formula.category === selectedCategory : true
    return matchSearch && matchCategory
  })

  const handleFormulaClick = (formula) => {
    const categorySlug = slugify(formula.category)
    const formulaSlug = slugify(formula.title)
    navigate(`/${categorySlug}/${formulaSlug}`)
    setShowSearchSuggestions(false)
  }

  const handleSearchInput = (value) => {
    setSearchTerm(value)
    setShowSearchSuggestions(value.trim().length > 0)
  }

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">MathLab.id</h1>
            <p className="hero-subtitle">
              Jelajahi rumus, pahami konsep matematika dengan mendalam
            </p>
          </div>
          <div className="hero-search">
            <div className="search-bar-wrapper">
              <SearchBar 
                onSearch={handleSearchInput}
                showSuggestions={true}
              />
              <SearchSuggestions
                results={searchResults}
                isOpen={showSearchSuggestions && searchResults.length > 0}
                onSelect={handleFormulaClick}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Rumus Matematika</h2>
          <p className="section-subtitle">
            Akses cepat ke rumus dan kalkulator matematika penting.
          </p>

          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                onClick={() => {
                  const categorySlug = slugify(category.title)
                  navigate(`/${categorySlug}`)
                }}
              />
            ))}
          </div>

          {/* Kalkulator Quick Access */}
          <div className="calculators-quickaccess">
            <h3>Alat Bantu Perhitungan</h3>
            <div className="calculator-buttons">
              <button 
                className="btn-calculator"
                onClick={() => navigate('/integral')}
              >
                <span className="calc-icon">∫</span>
                <span className="calc-label">Kalkulator Integral</span>
              </button>
              <button 
                className="btn-calculator"
                onClick={() => navigate('/algebra')}
              >
                <span className="calc-icon">x²</span>
                <span className="calc-label">Kalkulator Aljabar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results / Formulas Section */}
      <section className="formulas-section">
        <div className="container">
          <div className="formulas-header">
            <h2>Jelajahi Semua Rumus</h2>
            <p>Telusuri perpustakaan rumus lengkap kami</p>
          </div>

          {selectedCategory && (
            <div className="filter-badge">
              <span>Filter: {selectedCategory}</span>
              <button
                className="clear-filter"
                onClick={() => setSelectedCategory(null)}
              >
                ✕
              </button>
            </div>
          )}

          <div className="formulas-grid">
            {filteredFormulas.length > 0 ? (
              filteredFormulas.map(formula => (
                <div
                  key={formula.id}
                  className="formula-card-clickable"
                  onClick={() => handleFormulaClick(formula)}
                >
                  <div className="formula-header">
                    <span className="formula-category">{formula.category}</span>
                    <span
                      className="formula-difficulty"
                      style={{
                        backgroundColor:
                          formula.difficulty === 'mudah'
                            ? '#10B981'
                            : formula.difficulty === 'sedang'
                            ? '#F59E0B'
                            : '#EF4444',
                      }}
                    >
                      {formula.difficulty}
                    </span>
                  </div>
                  <h4 className="formula-title">{formula.title}</h4>
                  <div className="formula-box">
                    <BlockFormula formula={formula.formula} />
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Tidak ada rumus yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>

          <div className="load-more">
            <button className="btn-primary">Lihat Lebih Banyak Rumus</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
