import { useState } from 'react'
import { FaCube } from 'react-icons/fa'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BlockFormula } from '../components/MathFormula'
import IndefiniteIntegralCalculator from '../components/IndefiniteIntegralCalculator'
import DefiniteIntegralCalculator from '../components/DefiniteIntegralCalculator'
import ArcLengthCalculator from '../components/ArcLengthCalculator'
import SolidOfRevolutionVisualization from '../components/SolidOfRevolutionVisualization'
import '../styles/integral-detail-page.css'

/**
 * Halaman detail untuk integral dengan berbagai calculator
 * Menampilkan integral tak tentu, integral tentu, arc length, dll
 */
const IntegralDetailPage = () => {
  const [activeTab, setActiveTab] = useState('indefinite')

  return (
    <div className="integral-detail-page">
      <Header />

      <div className="integral-container">
        {/* Hero Section */}
        <section className="integral-hero">
          <div className="hero-content">
            <h1>Kalkulator Integral</h1>
            <p>Hitung berbagai jenis integral dengan visualisasi dan penjelasan langkah demi langkah</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="integral-nav">
          <button
            className={`nav-item ${activeTab === 'indefinite' ? 'active' : ''}`}
            onClick={() => setActiveTab('indefinite')}
          >
            <span className="nav-label">Integral Tak Tentu</span>
            <span className="nav-icon">∫</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'definite' ? 'active' : ''}`}
            onClick={() => setActiveTab('definite')}
          >
            <span className="nav-label">Integral Tentu</span>
            <span className="nav-icon">∫ᵃᵇ</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'arc-length' ? 'active' : ''}`}
            onClick={() => setActiveTab('arc-length')}
          >
            <span className="nav-label">Arc Length</span>
            <span className="nav-icon">L</span>
          </button>
          <button
            className={`nav-item ${activeTab === '3d' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d')}
          >
            <span className="nav-label">3D Visualisasi</span>
            <span className="nav-icon"><FaCube /></span>
          </button>
        </nav>

        {/* Content Section */}
        <div className="integral-content">
          {activeTab === 'indefinite' && <IndefiniteIntegralCalculator />}
          {activeTab === 'definite' && <DefiniteIntegralCalculator />}
          {activeTab === 'arc-length' && <ArcLengthCalculator />}
          {activeTab === '3d' && <SolidOfRevolutionVisualization />}
        </div>

        {/* Educational Section */}
        <section className="educational-section">
          <h2>Panduan Penggunaan Kalkulator Integral</h2>

          <div className="guide-grid">
            <div className="guide-card">
              <h3>Integral Tak Tentu</h3>
              <p>
                Hitung antiderivative (primitif) dari sebuah fungsi. Hasil akan selalu menambahkan konstanta
                integrasi C.
              </p>
              <ul>
                <li>Gunakan format Python: x**2, sin(x), exp(x)</li>
                <li>Dapatkan langkah-langkah detail integrasi</li>
                <li>Hasil ditampilkan dalam bentuk LaTeX</li>
              </ul>
            </div>

            <div className="guide-card">
              <h3>Integral Tentu</h3>
              <p>
                Hitung nilai integral dengan batas atas dan bawah yang ditentukan. Hasilnya adalah nilai
                numerik tunggal.
              </p>
              <ul>
                <li>Masukkan batas integrasi (a dan b)</li>
                <li>Lihat visualisasi grafik dan area di bawah kurva</li>
                <li>Hitung luas area atau rata-rata fungsi</li>
              </ul>
            </div>

            <div className="guide-card">
              <h3>Arc Length (Panjang Kurva)</h3>
              <p>
                Hitung panjang kurva dari fungsi y=f(x) antara dua titik. Menggunakan formula: L = ∫√(1 +
                (f'(x))²)dx
              </p>
              <ul>
                <li>Tentukan fungsi dan batas integrasi</li>
                <li>Dapatkan panjang kurva yang tepat</li>
                <li>Visualisasi kurva dengan derivative-nya</li>
              </ul>
            </div>

            <div className="guide-card">
              <h3>3D Visualisasi - Solid of Revolution</h3>
              <p>
                Lihat visualisasi 3D interaktif dari solid yang terbentuk ketika kurva diputar mengelilingi 
                sumbu x. Sangat berguna untuk memahami volume integral.
              </p>
              <ul>
                <li>Visualisasi 3D interaktif dan dapat dirotasi</li>
                <li>Pahami konsep solid of revolution secara visual</li>
                <li>Zoom dan pan untuk melihat detail</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Formula Reference */}
        <section className="formula-reference">
          <h2>Referensi Rumus Integral Dasar</h2>

          <div className="formula-grid">
            <div className="formula-item">
              <h4>Power Rule</h4>
              <BlockFormula formula="\int x^n \, dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)" />
            </div>

            <div className="formula-item">
              <h4>Exponential</h4>
              <BlockFormula formula="\int e^x \, dx = e^x + C" />
            </div>

            <div className="formula-item">
              <h4>Logarithmic</h4>
              <BlockFormula formula="\int \frac{1}{x} \, dx = \ln|x| + C" />
            </div>

            <div className="formula-item">
              <h4>Sine</h4>
              <BlockFormula formula="\int \sin(x) \, dx = -\cos(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Cosine</h4>
              <BlockFormula formula="\int \cos(x) \, dx = \sin(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Tangent</h4>
              <BlockFormula formula="\int \tan(x) \, dx = -\ln|\cos(x)| + C" />
            </div>

            <div className="formula-item">
              <h4>Secant</h4>
              <BlockFormula formula="\int \sec(x) \, dx = \ln|\sec(x) + \tan(x)| + C" />
            </div>

            <div className="formula-item">
              <h4>Cosecant</h4>
              <BlockFormula formula="\int \csc(x) \, dx = -\ln|\csc(x) + \cot(x)| + C" />
            </div>

            <div className="formula-item">
              <h4>Cotangent</h4>
              <BlockFormula formula="\int \cot(x) \, dx = \ln|\sin(x)| + C" />
            </div>

            <div className="formula-item">
              <h4>Secant Squared</h4>
              <BlockFormula formula="\int \sec^2(x) \, dx = \tan(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Cosecant Squared</h4>
              <BlockFormula formula="\int \csc^2(x) \, dx = -\cot(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Inverse Sine</h4>
              <BlockFormula formula="\int \frac{1}{\sqrt{1-x^2}} \, dx = \arcsin(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Inverse Tangent</h4>
              <BlockFormula formula="\int \frac{1}{1+x^2} \, dx = \arctan(x) + C" />
            </div>

            <div className="formula-item">
              <h4>Rational Form 1</h4>
              <BlockFormula formula="\int \frac{1}{x^2+a^2} \, dx = \frac{1}{a}\arctan\left(\frac{x}{a}\right) + C" />
            </div>

            <div className="formula-item">
              <h4>Rational Form 2</h4>
              <BlockFormula formula="\int \frac{1}{\sqrt{a^2-x^2}} \, dx = \arcsin\left(\frac{x}{a}\right) + C" />
            </div>

            <div className="formula-item">
              <h4>Definite Integral</h4>
              <BlockFormula formula="\int_{a}^{b} f(x) \, dx = F(b) - F(a)" />
            </div>

            <div className="formula-item">
              <h4>Arc Length</h4>
              <BlockFormula formula="L = \int_{a}^{b} \sqrt{1 + (f'(x))^2} \, dx" />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default IntegralDetailPage
