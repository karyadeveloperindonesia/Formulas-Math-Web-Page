import { useState } from 'react'
import { solveQuadratic, solveLinear } from '../services/api'
import { BlockFormula, InlineFormula } from './MathFormula'
import '../styles/calculators.css'

/**
 * Komponen untuk menyelesaikan persamaan algebra (linear dan kuadrat)
 * UI diperbaiki untuk kemudahan penggunaan
 */
const AlgebraEquationSolver = () => {
  const [equationType, setEquationType] = useState('quadratic')
  
  // Linear state: ax + b = 0
  const [linearA, setLinearA] = useState(2)
  const [linearB, setLinearB] = useState(-6)
  
  // Quadratic state: ax² + bx + c = 0
  const [quadA, setQuadA] = useState(1)
  const [quadB, setQuadB] = useState(-5)
  const [quadC, setQuadC] = useState(6)
  
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSolveLinear = async () => {
    if (linearA === 0) {
      setError('Koefisien a tidak boleh 0')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await solveLinear(linearA, linearB)
      if (response.success) {
        setResult(response)
        setError(null)
      }
    } catch (err) {
      setError('Error: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSolveQuadratic = async () => {
    if (quadA === 0) {
      setError('Koefisien a tidak boleh 0 untuk persamaan kuadrat')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await solveQuadratic(quadA, quadB, quadC)
      if (response.success) {
        setResult(response)
        setError(null)
      }
    } catch (err) {
      setError('Error: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleLinear = (a, b) => {
    setLinearA(a)
    setLinearB(b)
  }

  const handleExampleQuadratic = (a, b, c) => {
    setQuadA(a)
    setQuadB(b)
    setQuadC(c)
  }

  return (
    <div className="calculator-section">
      <h2>Penyesal Persamaan Algebra</h2>
      <p className="section-description">
        Selesaikan persamaan linear atau kuadrat dengan langkah-langkah detail.
      </p>

      {/* Type Selector */}
      <div className="type-selector">
        <button
          className={`type-btn ${equationType === 'linear' ? 'active' : ''}`}
          onClick={() => setEquationType('linear')}
        >
          Linear (ax + b = 0)
        </button>
        <button
          className={`type-btn ${equationType === 'quadratic' ? 'active' : ''}`}
          onClick={() => setEquationType('quadratic')}
        >
          Kuadrat (ax² + bx + c = 0)
        </button>
      </div>

      {/* Linear Equation Input */}
      {equationType === 'linear' && (
        <div className="calculator-input-group">
          <h3>Persamaan: ax + b = 0</h3>
          
          <div className="input-row">
            <label>
              a (koefisien x):
              <input
                type="number"
                value={linearA}
                onChange={(e) => setLinearA(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan a"
                className="input-field"
              />
            </label>
          </div>

          <div className="input-row">
            <label>
              b (konstanta):
              <input
                type="number"
                value={linearB}
                onChange={(e) => setLinearB(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan b"
                className="input-field"
              />
            </label>
          </div>

          {/* Examples */}
          <div className="examples-group">
            <p>Contoh:</p>
            <button onClick={() => handleExampleLinear(2, -6)} className="example-btn">
              2x - 6 = 0
            </button>
            <button onClick={() => handleExampleLinear(3, 9)} className="example-btn">
              3x + 9 = 0
            </button>
            <button onClick={() => handleExampleLinear(-1, 5)} className="example-btn">
              -x + 5 = 0
            </button>
          </div>

          <button onClick={handleSolveLinear} className="calculate-btn" disabled={loading}>
            {loading ? 'Menghitung...' : 'Selesaikan'}
          </button>
        </div>
      )}

      {/* Quadratic Equation Input */}
      {equationType === 'quadratic' && (
        <div className="calculator-input-group">
          <h3>Persamaan: ax² + bx + c = 0</h3>
          
          <div className="input-row">
            <label>
              a (koefisien x²):
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan a"
                className="input-field"
              />
            </label>
          </div>

          <div className="input-row">
            <label>
              b (koefisien x):
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan b"
                className="input-field"
              />
            </label>
          </div>

          <div className="input-row">
            <label>
              c (konstanta):
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan c"
                className="input-field"
              />
            </label>
          </div>

          {/* Examples */}
          <div className="examples-group">
            <p>Contoh:</p>
            <button onClick={() => handleExampleQuadratic(1, -5, 6)} className="example-btn">
              x² - 5x + 6 = 0
            </button>
            <button onClick={() => handleExampleQuadratic(1, -2, 1)} className="example-btn">
              x² - 2x + 1 = 0
            </button>
            <button onClick={() => handleExampleQuadratic(1, 0, -4)} className="example-btn">
              x² - 4 = 0
            </button>
          </div>

          <button onClick={handleSolveQuadratic} className="calculate-btn" disabled={loading}>
            {loading ? 'Menghitung...' : 'Selesaikan'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-box">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="result-box">
          <h3>Hasil:</h3>
          <p className="equation-display">{result.equation}</p>

          {equationType === 'linear' && (
            <>
              <div className="result-item">
                <p><strong>Solusi:</strong></p>
                <BlockFormula formula={`x = ${result.solution.toFixed(6)}`} />
              </div>
              <div className="result-item">
                <p><strong>Verifikasi:</strong></p>
                <p className="verification">{result.verification}</p>
              </div>
            </>
          )}

          {equationType === 'quadratic' && (
            <>
              <div className="result-item">
                <p><strong>Diskriminan (D):</strong></p>
                <BlockFormula formula={`D = b^2 - 4ac = ${result.discriminant.toFixed(6)}`} />
              </div>

              <div className="result-item">
                <p><strong>Jenis Akar:</strong></p>
                <p className="root-type">{result.root_type}</p>
              </div>

              <div className="result-item">
                <p><strong>Solusi:</strong></p>
                {result.roots_complex ? (
                  <>
                    <p>Akar 1: {result.roots_complex[0]}</p>
                    <p>Akar 2: {result.roots_complex[1]}</p>
                  </>
                ) : (
                  <>
                    {result.roots.map((root, idx) => (
                      <BlockFormula key={idx} formula={`x_${idx + 1} = ${root.toFixed(6)}`} />
                    ))}
                  </>
                )}
              </div>

              {result.verification_formulas && (
                <div className="result-item">
                  <p><strong>Verifikasi dengan Rumus Vieta:</strong></p>
                  <p>{result.verification_formulas.sum}</p>
                  <p>{result.verification_formulas.product}</p>
                </div>
              )}

              {result.multiplicity && (
                <div className="result-item">
                  <p><strong>Multiplisitas:</strong> {result.multiplicity}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AlgebraEquationSolver
