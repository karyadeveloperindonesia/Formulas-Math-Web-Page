import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Header, Footer, Modal, BlockFormula, SearchBar } from '../components'
import { formulas, categories } from '../data/formulas'
import { getCategoryBySlug, getFormulasByCategory, slugify, unslugify } from '../utils/formulaUtils'
import './CategoryPageContainer.css'

export const CategoryPageContainer = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormula, setSelectedFormula] = useState(null)

  const categoryObj = getCategoryBySlug(categories, category)

  if (!categoryObj) {
    return (
      <div className="category-page">
        <Header />
        <div className="container">
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <h2>Kategori tidak ditemukan</h2>
            <p>Kategori "{unslugify(category)}" tidak ada.</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const categoryFormulas = getFormulasByCategory(formulas, categoryObj.title)

  const filteredFormulas = categoryFormulas.filter(formula =>
    formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFormulaClick = (formula) => {
    const formulaSlug = slugify(formula.title)
    navigate(`/${category}/${formulaSlug}`)
  }

  return (
    <div className="category-page">
      <Header />

      <div className="category-hero">
        <div className="container">
          <div className="category-hero-icon">{categoryObj.icon}</div>
          <h1>{categoryObj.title}</h1>
          <p>{categoryObj.description}</p>
        </div>
      </div>

      <section className="category-search">
        <div className="container">
          <SearchBar
            placeholder={`Cari rumus ${categoryObj.title.toLowerCase()}...`}
            onSearch={setSearchTerm}
          />
        </div>
      </section>

      <section className="category-formulas">
        <div className="container">
          <h2>{categoryFormulas.length} Rumus di kategori {categoryObj.title}</h2>

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
        </div>
      </section>

      <Footer />
    </div>
  )
}
