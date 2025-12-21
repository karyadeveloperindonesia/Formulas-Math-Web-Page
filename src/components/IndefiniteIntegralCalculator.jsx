import { useState } from 'react'
import { calculateIndefiniteIntegral, getIntegrationSteps, validateFunction } from '../services/api'
import { BlockFormula } from './MathFormula'
import '../styles/calculators.css'

/**
 * Komponen untuk menghitung integral tak tentu
 */
const IndefiniteIntegralCalculator = () => {
  const [function_, setFunction] = useState('x**2')
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const handleCalculate = async () => {
    if (!function_.trim()) {
      setError('Function tidak boleh kosong')
      return
    }

    setLoading(true)
    setError(null)
    setValidationError(null)

    try {
      // Validate function first
      const validation = await validateFunction(function_)
      if (!validation.is_integrable) {
        setValidationError(validation.message)
        setResult(null)
        setLoading(false)
        return
      }

      // Calculate integral
      const integralResult = await calculateIndefiniteIntegral(function_)

      if (integralResult.success) {
        setResult(integralResult)
        setError(null)

        // Get steps
        try {
          const stepsResult = await getIntegrationSteps(function_)
          setSteps(stepsResult)
        } catch (e) {
          console.log('Could not fetch steps:', e)
        }
      }
    } catch (err) {
      setError('Error calculating integral: ' + err.message)
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
      <h2>Integral Tak Tentu</h2>
      <p className="section-description">
        Hitung integral tak tentu ∫f(x)dx. Masukkan fungsi dalam format Python.
      </p>

      <div className="calculator-input-group">
        <label htmlFor="function-input">Masukkan Fungsi:</label>
        <input
          id="function-input"
          type="text"
          value={function_}
          onChange={(e) => setFunction(e.target.value)}
          placeholder="Contoh: x**2, sin(x), exp(x), 1/x"
          className="input-field"
        />
        <button onClick={handleCalculate} disabled={loading} className="btn btn-primary">
          {loading ? 'Menghitung...' : 'Hitung Integral'}
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
          <button onClick={() => handleExampleClick('cos(x)')} className="btn-example">
            cos(x)
          </button>
          <button onClick={() => handleExampleClick('exp(x)')} className="btn-example">
            eˣ
          </button>
          <button onClick={() => handleExampleClick('1/x')} className="btn-example">
            1/x
          </button>
          <button onClick={() => handleExampleClick('sqrt(x)')} className="btn-example">
            √x
          </button>
        </div>
      </div>

      {/* Error messages */}
      {error && <div className="error-message">{error}</div>}
      {validationError && <div className="error-message">{validationError}</div>}

      {/* Result */}
      {result && (
        <div className="result-section">
          <h3>Hasil Kalkulasi</h3>

          {/* Fungsi asli */}
          <div className="result-item">
            <label>Fungsi Asli:</label>
            <BlockFormula formula={result.original_latex} />
          </div>

          {/* Integral hasil */}
          <div className="result-item highlight">
            <label>Hasil Integral:</label>
            <BlockFormula formula={result.integral_latex + ' + C'} />
          </div>

          {/* Ekspresi lengkap */}
          <div className="result-item">
            <label>Ekspresi Lengkap:</label>
            <BlockFormula formula={result.full_expression_latex} />
          </div>

          {/* Info tambahan */}
          <div className="result-info">
            <p>
              <strong>Catatan:</strong> Hasil integral adalah antiderivative (primitif) dari fungsi. C adalah
              konstanta integrasi.
            </p>
          </div>

          {/* Steps */}
          {steps && steps.steps && (
            <div className="steps-section">
              <h4>Langkah-langkah Integrasi</h4>
              <div className="steps-list">
                {steps.steps.map((step, idx) => (
                  <div key={idx} className="step-item">
                    <div className="step-number">Langkah {step.step}</div>
                    <h5>{step.title}</h5>
                    <p>{step.description}</p>
                    {step.formula && <BlockFormula formula={step.formula} />}
                    {step.latex && <BlockFormula formula={step.latex} />}
                    {step.result && <BlockFormula formula={step.result} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IndefiniteIntegralCalculator
