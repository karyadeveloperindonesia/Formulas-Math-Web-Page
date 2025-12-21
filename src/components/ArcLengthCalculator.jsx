import { useState } from 'react'
import { calculateArcLength } from '../services/api'
import { BlockFormula } from './MathFormula'
import '../styles/calculators.css'

/**
 * Komponen untuk menghitung arc length (panjang kurva)
 */
const ArcLengthCalculator = () => {
  const [function_, setFunction] = useState('sqrt(1-x**2)')
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCalculate = async () => {
    if (!function_.trim()) {
      setError('Function tidak boleh kosong')
      return
    }

    if (upperBound <= lowerBound) {
      setError('Upper bound harus lebih besar dari lower bound')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await calculateArcLength(function_, lowerBound, upperBound)

      if (response.success) {
        setResult(response)
        setError(null)
      } else {
        setError('Gagal menghitung arc length')
      }
    } catch (err) {
      setError('Error: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example) => {
    setFunction(example)
  }

  return (
    <div className="calculator-section">
      <h2>Panjang Kurva (Arc Length)</h2>
      <p className="section-description">
        Hitung panjang kurva y=f(x) antara dua titik. Formula: L = ∫√(1 + (f'(x))²)dx
      </p>

      <div className="calculator-input-group">
        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="arc-function">Fungsi:</label>
            <input
              id="arc-function"
              type="text"
              value={function_}
              onChange={(e) => setFunction(e.target.value)}
              placeholder="Contoh: sqrt(1-x**2), x**2"
              className="input-field"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="arc-lower">Batas Bawah (a):</label>
            <input
              id="arc-lower"
              type="number"
              value={lowerBound}
              onChange={(e) => setLowerBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
          <div className="input-field-group">
            <label htmlFor="arc-upper">Batas Atas (b):</label>
            <input
              id="arc-upper"
              type="number"
              value={upperBound}
              onChange={(e) => setUpperBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
        </div>

        <button onClick={handleCalculate} disabled={loading} className="btn btn-primary">
          {loading ? 'Menghitung...' : 'Hitung Arc Length'}
        </button>
      </div>

      {/* Contoh fungsi */}
      <div className="examples">
        <p className="label-small">Contoh fungsi:</p>
        <div className="example-buttons">
          <button onClick={() => handleExampleClick('sqrt(1-x**2)')} className="btn-example">
            √(1-x²)
          </button>
          <button onClick={() => handleExampleClick('x**2')} className="btn-example">
            x²
          </button>
          <button onClick={() => handleExampleClick('sin(x)')} className="btn-example">
            sin(x)
          </button>
          <button onClick={() => handleExampleClick('exp(x)')} className="btn-example">
            eˣ
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Result */}
      {result && (
        <div className="result-section">
          <h3>Hasil Kalkulasi Arc Length</h3>

          <div className="result-item">
            <label>Fungsi:</label>
            <BlockFormula formula={`f(x) = ${result.function}`} />
          </div>

          <div className="result-item">
            <label>Turunan Fungsi:</label>
            <BlockFormula formula={`f'(x) = ${result.derivative}`} />
          </div>

          <div className="result-item highlight">
            <label>Panjang Kurva (Arc Length):</label>
            <div className="result-value">{result.arc_length}</div>
          </div>

          <div className="result-info">
            <p>
              <strong>Batas Integrasi:</strong> <BlockFormula formula={`x \\in [${result.bounds.lower}, ${result.bounds.upper}]`} inline />
            </p>
            <p>
              <strong>Satuan:</strong> Unit satuan (sama dengan satuan pada sumbu x dan y)
            </p>
            <p>
              <strong>Rumus Umum Arc Length:</strong>
            </p>
            <BlockFormula formula={`L = \\int_{a}^{b} \\sqrt{1 + \\left(f'(x)\\right)^2} \\, dx`} />
          </div>

          <div className="result-info">
            <h4>Interpretasi Hasil</h4>
            <p>
              Panjang kurva sebesar <strong>{result.arc_length}</strong> unit mewakili jarak sepanjang kurva dari titik <BlockFormula formula={`\\left(${result.bounds.lower}, f(${result.bounds.lower})\\right)`} inline /> ke <BlockFormula formula={`\\left(${result.bounds.upper}, f(${result.bounds.upper})\\right)`} inline />.
            </p>
            <p>
              Arc length selalu lebih besar atau sama dengan jarak horizontal <BlockFormula formula={`\\Delta x = ${result.bounds.upper} - ${result.bounds.lower}`} inline />.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArcLengthCalculator
