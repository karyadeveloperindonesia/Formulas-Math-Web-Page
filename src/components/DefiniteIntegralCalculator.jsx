import { useState } from 'react'
import { calculateDefiniteIntegral, calculateAreaUnderCurve, calculateAverageValue } from '../services/api'
import { BlockFormula } from './MathFormula'
import '../styles/calculators.css'

/**
 * Komponen untuk menghitung integral tentu
 */
const DefiniteIntegralCalculator = () => {
  const [function_, setFunction] = useState('x**2')
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(2)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tabActive, setTabActive] = useState('integral') // integral, area, average

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
      let response

      if (tabActive === 'integral') {
        response = await calculateDefiniteIntegral(function_, lowerBound, upperBound)
      } else if (tabActive === 'area') {
        response = await calculateAreaUnderCurve(function_, lowerBound, upperBound)
      } else if (tabActive === 'average') {
        response = await calculateAverageValue(function_, lowerBound, upperBound)
      }

      if (response.success) {
        setResult(response)
        setError(null)
      } else {
        setError('Gagal menghitung integral')
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
      <h2>Integral Tentu</h2>
      <p className="section-description">
        Hitung integral tentu ∫[a,b]f(x)dx dengan batas atas dan bawah yang ditentukan.
      </p>

      {/* Tabs untuk berbagai tipe kalkulasi */}
      <div className="calculator-tabs">
        <button
          className={`tab-button ${tabActive === 'integral' ? 'active' : ''}`}
          onClick={() => setTabActive('integral')}
        >
          Integral Tentu
        </button>
        <button
          className={`tab-button ${tabActive === 'area' ? 'active' : ''}`}
          onClick={() => setTabActive('area')}
        >
          Luas Kurva
        </button>
        <button
          className={`tab-button ${tabActive === 'average' ? 'active' : ''}`}
          onClick={() => setTabActive('average')}
        >
          Rata-rata Fungsi
        </button>
      </div>

      <div className="calculator-input-group">
        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="def-function">Fungsi:</label>
            <input
              id="def-function"
              type="text"
              value={function_}
              onChange={(e) => setFunction(e.target.value)}
              placeholder="Contoh: x**2, sin(x)"
              className="input-field"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="lower-bound">Batas Bawah (a):</label>
            <input
              id="lower-bound"
              type="number"
              value={lowerBound}
              onChange={(e) => setLowerBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
          <div className="input-field-group">
            <label htmlFor="upper-bound">Batas Atas (b):</label>
            <input
              id="upper-bound"
              type="number"
              value={upperBound}
              onChange={(e) => setUpperBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
        </div>

        <button onClick={handleCalculate} disabled={loading} className="btn btn-primary">
          {loading ? 'Menghitung...' : 'Hitung'}
        </button>
      </div>

      {/* Contoh fungsi */}
      <div className="examples">
        <p className="label-small">Contoh fungsi:</p>
        <div className="example-buttons">
          <button onClick={() => handleExampleClick('x**2')} className="btn-example">
            x²
          </button>
          <button onClick={() => handleExampleClick('sin(x)')} className="btn-example">
            sin(x)
          </button>
          <button onClick={() => handleExampleClick('sqrt(x)')} className="btn-example">
            √x
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
          <h3>Hasil Kalkulasi</h3>

          {tabActive === 'integral' && (
            <>
              <div className="result-item">
                <label>Fungsi:</label>
                <BlockFormula formula={result.original_latex} />
              </div>

              <div className="result-item highlight">
                <label>Hasil Integral Tentu:</label>
                <BlockFormula formula={result.full_expression_latex} />
              </div>

              <div className="result-info">
                <p>
                  <strong>Nilai Numerik:</strong> {result.numerical_value}
                </p>
                {result.symbolic_result && (
                  <p>
                    <strong>Bentuk Simbolik:</strong> {result.symbolic_result}
                  </p>
                )}
                {result.error_estimate && (
                  <p className="small">
                    <strong>Estimasi Error:</strong> {result.error_estimate.toExponential(2)}
                  </p>
                )}
              </div>

              {result.visualizations && (
                <div className="visualizations">
                  <h4>Visualisasi</h4>
                  {result.visualizations.function_plot && (
                    <div className="visualization-item">
                      <h5>Grafik Fungsi</h5>
                      <img src={result.visualizations.function_plot} alt="Function plot" />
                    </div>
                  )}
                  {result.visualizations.area_plot && (
                    <div className="visualization-item">
                      <h5>Area di Bawah Kurva</h5>
                      <img src={result.visualizations.area_plot} alt="Area plot" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tabActive === 'area' && (
            <>
              <div className="result-item">
                <label>Deskripsi:</label>
                <p>{result.description}</p>
              </div>

              <div className="result-item highlight">
                <label>Luas Area:</label>
                <div className="result-value">{result.area}</div>
              </div>

              {result.visualization && (
                <div className="visualizations">
                  <img src={result.visualization} alt="Area visualization" />
                </div>
              )}
            </>
          )}

          {tabActive === 'average' && (
            <>
              <div className="result-item">
                <label>Fungsi:</label>
                <BlockFormula formula={result.function} />
              </div>

              <div className="result-item highlight">
                <label>Nilai Rata-rata:</label>
                <BlockFormula formula={`f_{avg} = ${result.average_value}`} />
              </div>

              <div className="result-info">
                <p className="formula-text">
                  <strong>Rumus:</strong>
                </p>
                <BlockFormula formula={`f_{avg} = \\frac{1}{b-a} \\int_a^b f(x) dx`} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default DefiniteIntegralCalculator
