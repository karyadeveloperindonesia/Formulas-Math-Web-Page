import './CategoryPage.css'
import { Header, SearchBar, FormulaCard, Footer, Modal, BlockFormula } from '../components'
import { formulas, categories } from '../data/formulas'
import { useState } from 'react'

export const CategoryPage = ({ categoryName }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormula, setSelectedFormula] = useState(null)

  const category = categories.find(c => c.title === categoryName)
  const categoryFormulas = formulas.filter(f => f.category === categoryName)

  const filteredFormulas = categoryFormulas.filter(formula =>
    formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!category) {
    return (
      <div className="category-page">
        <Header />
        <div className="container">
          <h2>Kategori tidak ditemukan</h2>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="category-page">
      <Header />

      <div className="category-hero">
        <div className="container">
          <div className="category-hero-icon">{category.icon}</div>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <section className="category-search">
        <div className="container">
          <SearchBar
            placeholder={`Cari rumus ${category.title.toLowerCase()}...`}
            onSearch={setSearchTerm}
          />
        </div>
      </section>

      <section className="category-formulas">
        <div className="container">
          <h2>{categoryFormulas.length} Rumus di kategori ini</h2>

          <div className="formulas-grid">
            {filteredFormulas.length > 0 ? (
              filteredFormulas.map(formula => (
                <FormulaCard
                  key={formula.id}
                  title={formula.title}
                  formula={formula.formula}
                  category={formula.category}
                  difficulty={formula.difficulty}
                  onClick={() => setSelectedFormula(formula)}
                />
              ))
            ) : (
              <div className="no-results">
                <p>Tidak ada rumus yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedFormula && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFormula(null)}
          title={selectedFormula.title}
        >
          <div className="formula-modal-content">
            <div className="modal-meta">
              <span className="badge">{selectedFormula.category}</span>
              <span
                className="badge difficulty"
                style={{
                  backgroundColor:
                    selectedFormula.difficulty === 'mudah'
                      ? '#10B981'
                      : selectedFormula.difficulty === 'sedang'
                      ? '#F59E0B'
                      : '#EF4444',
                }}
              >
                {selectedFormula.difficulty}
              </span>
            </div>

            <div className="modal-formula">
              <h4>Rumus</h4>
              <BlockFormula formula={selectedFormula.formula} />
            </div>

            <div className="modal-section">
              <h4>Deskripsi</h4>
              <p>{selectedFormula.description}</p>
            </div>

            <div className="modal-section">
              <h4>Penggunaan</h4>
              <p>{selectedFormula.usage}</p>
            </div>

            <div className="modal-actions">
              <button className="btn-modal-primary">📋 Salin Rumus</button>
              <button className="btn-modal-secondary">📤 Bagikan</button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  )
}
