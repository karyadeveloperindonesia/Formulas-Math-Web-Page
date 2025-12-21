import { useParams, useNavigate } from 'react-router-dom'
import { Header, Footer, BlockFormula } from '../components'
import { formulas, categories } from '../data/formulas'
import { getCategoryBySlug, getFormulaBySlug, getFormulasByCategory, slugify } from '../utils/formulaUtils'
import './FormulaDetailPageContainer.css'

export const FormulaDetailPageContainer = () => {
  const { category, formula } = useParams()
  const navigate = useNavigate()

  const categoryObj = getCategoryBySlug(categories, category)
  const formulaObj = getFormulaBySlug(formulas, formula)

  // Verify formula belongs to category
  if (
    !categoryObj ||
    !formulaObj ||
    formulaObj.category !== categoryObj.title
  ) {
    return (
      <div className="detail-page">
        <Header />
        <div className="container detail-container">
          <h2>Formula tidak ditemukan</h2>
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
        <Footer />
      </div>
    )
  }

  const relatedFormulas = getFormulasByCategory(formulas, categoryObj.title)
    .filter(f => f.id !== formulaObj.id)
    .slice(0, 3)

  const handleRelatedFormulaClick = (relFormula) => {
    const relSlug = slugify(relFormula.title)
    navigate(`/${category}/${relSlug}`)
  }

  return (
    <div className="detail-page">
      <Header />

      <div className="detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Beranda</a>
            <span>/</span>
            <a 
              href={`/${category}`}
              onClick={(e) => { e.preventDefault(); navigate(`/${category}`) }}
            >
              {categoryObj.title}
            </a>
            <span>/</span>
            <span>{formulaObj.title}</span>
          </div>
        </div>
      </div>

      <div className="container detail-container">
        <div className="detail-content">
          <div className="detail-header">
            <div className="detail-meta">
              <span className="category-badge">{formulaObj.category}</span>
              <span
                className="difficulty-badge"
                style={{
                  backgroundColor:
                    formulaObj.difficulty === 'mudah'
                      ? '#10B981'
                      : formulaObj.difficulty === 'sedang'
                      ? '#F59E0B'
                      : '#EF4444',
                }}
              >
                {formulaObj.difficulty}
              </span>
            </div>
            <h1>{formulaObj.title}</h1>
          </div>

          <div className="detail-formula">
            <h3>Rumus</h3>
            <BlockFormula formula={formulaObj.formula} />
          </div>

          <div className="detail-section">
            <h3>Deskripsi</h3>
            <p>{formulaObj.description}</p>
          </div>

          <div className="detail-section">
            <h3>Penggunaan</h3>
            <p>{formulaObj.usage}</p>
          </div>

          <div className="detail-actions">
            <button className="btn-primary">
              <span>📋</span> Salin Rumus
            </button>
            <button className="btn-secondary">
              <span>📤</span> Bagikan
            </button>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <h4>Tips</h4>
            <ul>
              <li>Pahami konsep dasar sebelum menggunakan rumus ini</li>
              <li>Praktik dengan berbagai soal untuk menguasainya</li>
              <li>Hubungkan dengan rumus-rumus terkait lainnya</li>
            </ul>
          </div>

          {relatedFormulas.length > 0 && (
            <div className="sidebar-card">
              <h4>Rumus Terkait</h4>
              <ul className="related-formulas">
                {relatedFormulas.map(f => (
                  <li key={f.id}>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleRelatedFormulaClick(f)
                      }}
                    >
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
