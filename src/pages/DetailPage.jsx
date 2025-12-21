import { useState } from 'react'
import './DetailPage.css'
import { Header, Footer, BlockFormula } from '../components'
import { formulas } from '../data/formulas'

export const DetailPage = ({ formulaId }) => {
  const formula = formulas.find(f => f.id === formulaId)

  if (!formula) {
    return (
      <div className="detail-page">
        <Header />
        <div className="container detail-container">
          <h2>Formula tidak ditemukan</h2>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedFormulas = formulas.filter(
    f => f.category === formula.category && f.id !== formula.id
  ).slice(0, 3)

  return (
    <div className="detail-page">
      <Header />

      <div className="detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Beranda</a>
            <span>/</span>
            <a href="/">{formula.category}</a>
            <span>/</span>
            <span>{formula.title}</span>
          </div>
        </div>
      </div>

      <div className="container detail-container">
        <div className="detail-content">
          <div className="detail-header">
            <div className="detail-meta">
              <span className="category-badge">{formula.category}</span>
              <span
                className="difficulty-badge"
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
            <h1>{formula.title}</h1>
          </div>

          <div className="detail-formula">
            <h3>Rumus</h3>
            <BlockFormula formula={formula.formula} />
          </div>

          <div className="detail-section">
            <h3>Deskripsi</h3>
            <p>{formula.description}</p>
          </div>

          <div className="detail-section">
            <h3>Penggunaan</h3>
            <p>{formula.usage}</p>
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

          <div className="sidebar-card">
            <h4>Rumus Terkait</h4>
            <ul className="related-formulas">
              {relatedFormulas.map(f => (
                <li key={f.id}>
                  <a href={`/formula/${f.id}`}>{f.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
