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
    <div className="calculator-section algebra-solver">
      <h2 className="section-title">Selesaikan Persamaan Algebra</h2>
      <p className="section-description">
        Alat penyelesaian interaktif untuk menyelesaikan persamaan linear dan kuadrat dengan langkah-langkah detail.
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
                <BlockFormula formula={`x = ${result.solution ? result.solution.toFixed(6) : 'N/A'}`} />
              </div>
              <div className="result-item">
                <p><strong>Verifikasi:</strong></p>
                {result.verification ? (
                  <p className="verification">
                    Hasil: {result.verification.equation_result?.toFixed(10)} 
                    {result.verification.is_correct ? ' ✓ Benar' : ' ✗ Salah'}
                  </p>
                ) : (
                  <p className="verification">-</p>
                )}
              </div>

              {/* Steps */}
              {result.steps && result.steps.length > 0 && (
                <div className="result-item">
                  <p><strong>Langkah-langkah:</strong></p>
                  <div className="steps-container">
                    {result.steps.map((step, idx) => (
                      <div key={idx} className="step">
                        <p className="step-number">Langkah {step.step}: {step.description}</p>
                        <BlockFormula formula={step.expression} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {equationType === 'quadratic' && (
            <>
              <div className="result-item">
                <p><strong>Diskriminan (D):</strong></p>
                <BlockFormula formula={`D = b^2 - 4ac = ${result.discriminant ? result.discriminant.toFixed(6) : 'N/A'}`} />
              </div>

              <div className="result-item">
                <p><strong>Jenis Akar:</strong></p>
                <p className="root-type">
                  {result.discriminant_type === 'positive' && '✓ Dua akar real yang berbeda'}
                  {result.discriminant_type === 'zero' && '✓ Satu akar real (berulang)'}
                  {result.discriminant_type === 'negative' && '✓ Dua akar kompleks (tidak ada akar real)'}
                </p>
              </div>

              <div className="result-item">
                <p><strong>Solusi:</strong></p>
                {result.roots && Array.isArray(result.roots) && (
                  <>
                    {result.roots.map((root, idx) => {
                      if (typeof root === 'object' && root.real !== undefined) {
                        // Complex number
                        return (
                          <p key={idx}>
                            x<sub>{idx + 1}</sub> = {root.real.toFixed(6)} + {root.imag.toFixed(6)}i
                          </p>
                        )
                      } else if (typeof root === 'number') {
                        // Real number
                        return (
                          <BlockFormula key={idx} formula={`x_${idx + 1} = ${root.toFixed(6)}`} />
                        )
                      }
                      return null
                    })}
                  </>
                )}
              </div>

              {/* Steps */}
              {result.steps && result.steps.length > 0 && (
                <div className="result-item">
                  <p><strong>Langkah-langkah:</strong></p>
                  <div className="steps-container">
                    {result.steps.map((step, idx) => (
                      <div key={idx} className="step">
                        <p className="step-number">Langkah {step.step}: {step.description}</p>
                        <BlockFormula formula={step.expression} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification */}
              {result.verification && Array.isArray(result.verification) && result.verification.length > 0 && (
                <div className="result-item">
                  <p><strong>Verifikasi:</strong></p>
                  {result.verification.map((verify, idx) => (
                    <p key={idx}>
                      x<sub>{idx + 1}</sub>: Sisa = {verify.result?.toFixed(10)} 
                      {verify.is_correct ? ' ✓' : ' ✗'}
                    </p>
                  ))}
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
