import { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BlockFormula } from '../components/MathFormula'
import AlgebraEquationSolver from '../components/AlgebraEquationSolver'
import MatrixOperations from '../components/MatrixOperations'
import '../styles/integral-detail-page.css'
import './algebra-detail-page.css'

/**
 * Halaman detail untuk Aljabar dengan berbagai calculator
 * Menampilkan equation solver, matrix operations, dll
 */
const AlgebraDetailPage = () => {
  const [activeTab, setActiveTab] = useState('equations')
  const [showFormulas, setShowFormulas] = useState(true)

  const tabs = [
    {
      id: 'equations',
      label: 'Selesaikan Persamaan',
      description: 'Persamaan Linear & Kuadrat',
      icon: '📐',
    },
    {
      id: 'matrix',
      label: 'Operasi Matriks',
      description: 'Determinan, Invers, & Lainnya',
      icon: '⊞',
    },
  ]

  return (
    <div className="algebra-detail-page">
      <Header />

      <div className="algebra-container">
        {/* Hero Section */}
        <section className="algebra-hero">
          <div className="hero-content">
            <h1>🧮 Kalkulator Aljabar</h1>
            <p>Alat pembelajaran interaktif untuk menyelesaikan persamaan dan operasi matriks dengan langkah-langkah terperinci</p>
          </div>
        </section>

        {/* Tab Navigation with better UX */}
        <div className="algebra-tabs-container">
          <nav className="algebra-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`algebra-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <div className="tab-info">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
                {activeTab === tab.id && <span className="tab-indicator"></span>}
              </button>
            ))}
          </nav>

          {/* Toggle Formula Reference */}
          <button 
            className={`toggle-formulas ${showFormulas ? 'active' : ''}`}
            onClick={() => setShowFormulas(!showFormulas)}
            title={showFormulas ? 'Sembunyikan rumus' : 'Tampilkan rumus'}
          >
            <span className="toggle-icon">📋</span>
            <span>{showFormulas ? 'Sembunyikan' : 'Tampilkan'} Rumus</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="algebra-content">
          {/* Equation Solver Tab */}
          {activeTab === 'equations' && (
            <div className="algebra-tab-content">
              {/* Formula Reference Card */}
              {showFormulas && (
                <section className="algebra-formula-reference">
                  <h2>📚 Referensi Rumus Persamaan</h2>
                  <div className="algebra-formulas-grid">
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Linear</div>
                      <h4>Persamaan Linear</h4>
                      <BlockFormula formula="ax + b = 0 \Rightarrow x = -\frac{b}{a}" />
                      <p className="formula-note">Solusi persamaan linear satu variabel</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Kuadrat</div>
                      <h4>Persamaan Kuadrat</h4>
                      <BlockFormula formula="ax^2 + bx + c = 0 \Rightarrow x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" />
                      <p className="formula-note">Rumus kuadrat untuk menyelesaikan persamaan kuadrat</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Analisa</div>
                      <h4>Diskriminan</h4>
                      <BlockFormula formula="D = b^2 - 4ac" />
                      <p className="formula-note">Menentukan jenis akar (real/kompleks)</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Vieta</div>
                      <h4>Jumlah & Hasil Kali Akar</h4>
                      <BlockFormula formula="x_1 + x_2 = -\frac{b}{a}, \quad x_1 \cdot x_2 = \frac{c}{a}" />
                      <p className="formula-note">Hubungan koefisien dengan akar (Vieta)</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Calculator Component */}
              <div className="algebra-calculator-wrapper">
                <div className="calculator-instructions">
                  <h3>💡 Cara Menggunakan</h3>
                  <ul>
                    <li>Masukkan koefisien persamaan (a, b, c)</li>
                    <li>Sistem akan menyelesaikan persamaan secara otomatis</li>
                    <li>Lihat penjelasan detail dan verifikasi hasil</li>
                  </ul>
                </div>
                <AlgebraEquationSolver />
              </div>
            </div>
          )}

          {/* Matrix Operations Tab */}
          {activeTab === 'matrix' && (
            <div className="algebra-tab-content">
              {/* Formula Reference Card */}
              {showFormulas && (
                <section className="algebra-formula-reference">
                  <h2>📚 Referensi Rumus Matriks</h2>
                  <div className="algebra-formulas-grid">
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Det</div>
                      <h4>Determinan 2×2</h4>
                      <BlockFormula formula="\det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc" />
                      <p className="formula-note">Hasil kali diagonal utama dikurangi diagonal sekunder</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Inv</div>
                      <h4>Invers Matriks 2×2</h4>
                      <BlockFormula formula="A^{-1} = \frac{1}{ad-bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />
                      <p className="formula-note">Hanya ada jika determinan ≠ 0</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Cramer</div>
                      <h4>Aturan Cramer</h4>
                      <BlockFormula formula="x = \frac{\det A_x}{\det A}, \quad y = \frac{\det A_y}{\det A}" />
                      <p className="formula-note">Menyelesaikan sistem persamaan linear</p>
                    </div>
                    <div className="algebra-formula-card">
                      <div className="formula-badge">Rank</div>
                      <h4>Rank Matriks</h4>
                      <BlockFormula formula="\text{rank}(A) \leq \min(m, n)" />
                      <p className="formula-note">Jumlah baris/kolom independen dalam matriks</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Calculator Component */}
              <div className="algebra-calculator-wrapper">
                <div className="calculator-instructions">
                  <h3>💡 Cara Menggunakan</h3>
                  <ul>
                    <li>Pilih jenis operasi matriks yang diinginkan</li>
                    <li>Masukkan nilai-nilai matriks dalam format yang ditunjukkan</li>
                    <li>Klik tombol hitung untuk melihat hasil</li>
                  </ul>
                </div>
                <MatrixOperations />
              </div>
            </div>
          )}
        </div>

        {/* Additional Formulas Section */}
        <section className="algebra-additional-formulas">
          <div className="section-header">
            <h2>📖 Referensi Rumus Tambahan</h2>
            <p className="section-subtitle">Kumpulan lengkap rumus-rumus aljabar yang sering digunakan</p>
          </div>

          <div className="algebra-sections-grid">
            {/* Identitas Aljabar */}
            <div className="algebra-formula-section">
              <div className="section-icon">🎯</div>
              <h3>Identitas Aljabar</h3>
              <div className="formulas-list">
                <div className="formula-row">
                  <strong>Kuadrat Binomial:</strong>
                  <BlockFormula formula="(a \pm b)^2 = a^2 \pm 2ab + b^2" inline />
                </div>
                <div className="formula-row">
                  <strong>Selisih Kuadrat:</strong>
                  <BlockFormula formula="a^2 - b^2 = (a+b)(a-b)" inline />
                </div>
                <div className="formula-row">
                  <strong>Kubus Binomial:</strong>
                  <BlockFormula formula="(a \pm b)^3 = a^3 \pm 3a^2b + 3ab^2 \pm b^3" inline />
                </div>
                <div className="formula-row">
                  <strong>Jumlah Kubus:</strong>
                  <BlockFormula formula="a^3 + b^3 = (a+b)(a^2 - ab + b^2)" inline />
                </div>
                <div className="formula-row">
                  <strong>Selisih Kubus:</strong>
                  <BlockFormula formula="a^3 - b^3 = (a-b)(a^2 + ab + b^2)" inline />
                </div>
              </div>
            </div>

            {/* Eksponen & Logaritma */}
            <div className="algebra-formula-section">
              <div className="section-icon">⚡</div>
              <h3>Eksponen & Logaritma</h3>
              <div className="formulas-list">
                <div className="formula-row">
                  <strong>Perkalian Eksponen:</strong>
                  <BlockFormula formula="a^m \cdot a^n = a^{m+n}" inline />
                </div>
                <div className="formula-row">
                  <strong>Pembagian Eksponen:</strong>
                  <BlockFormula formula="\frac{a^m}{a^n} = a^{m-n}" inline />
                </div>
                <div className="formula-row">
                  <strong>Pangkat Pangkat:</strong>
                  <BlockFormula formula="(a^m)^n = a^{mn}" inline />
                </div>
                <div className="formula-row">
                  <strong>Logaritma Dasar:</strong>
                  <BlockFormula formula="a^x = b \Leftrightarrow \log_a b = x" inline />
                </div>
                <div className="formula-row">
                  <strong>Sifat Logaritma:</strong>
                  <BlockFormula formula="\log_a(xy) = \log_a x + \log_a y" inline />
                </div>
              </div>
            </div>

            {/* Barisan & Deret */}
            <div className="algebra-formula-section">
              <div className="section-icon">📊</div>
              <h3>Barisan & Deret</h3>
              <div className="formulas-list">
                <div className="formula-row">
                  <strong>Barisan Aritmetika:</strong>
                  <BlockFormula formula="a_n = a_1 + (n-1)d" inline />
                </div>
                <div className="formula-row">
                  <strong>Jumlah Aritmetika:</strong>
                  <BlockFormula formula="S_n = \frac{n}{2}(a_1 + a_n)" inline />
                </div>
                <div className="formula-row">
                  <strong>Barisan Geometri:</strong>
                  <BlockFormula formula="a_n = a_1 \cdot r^{n-1}" inline />
                </div>
                <div className="formula-row">
                  <strong>Jumlah Geometri:</strong>
                  <BlockFormula formula="S_n = a_1 \cdot \frac{1-r^n}{1-r}, \quad r \neq 1" inline />
                </div>
                <div className="formula-row">
                  <strong>Deret Tak Hingga:</strong>
                  <BlockFormula formula="S_\infty = \frac{a_1}{1-r}, \quad |r| < 1" inline />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default AlgebraDetailPage
