import { useState } from 'react'
import { calculateDeterminant, calculateInverse, solveMatrixOperation } from '../services/api'
import { BlockFormula } from './MathFormula'
import '../styles/calculators.css'

// Helper function to format matrix as LaTeX
const matrixToLaTeX = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length === 0) return ''
  
  const rows = matrix.map(row => {
    return row.map(val => {
      // Format numbers to 6 decimal places, remove trailing zeros
      const num = typeof val === 'number' ? val.toFixed(6) : val
      return parseFloat(num).toString()
    }).join(' & ')
  }).join(' \\\\ ')
  
  return `\\begin{pmatrix} ${rows} \\end{pmatrix}`
}

/**
 * Komponen untuk operasi matriks
 * UI yang ditingkatkan untuk kemudahan penggunaan
 */
const MatrixOperations = () => {
  const [operation, setOperation] = useState('determinant')
  const [matrixA, setMatrixA] = useState('[[1, 2], [3, 4]]')
  const [matrixB, setMatrixB] = useState('[[5, 6], [7, 8]]')
  const [scalarValue, setScalarValue] = useState(2)
  
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const operations = [
    { value: 'determinant', label: '🔢 Determinan', icon: 'det', desc: 'Hitung determinan matriks' },
    { value: 'inverse', label: '⤴️ Invers', icon: 'inv', desc: 'Hitung invers matriks' },
    { value: 'transpose', label: '↔️ Transpose', icon: 'T', desc: 'Transpose matriks' },
    { value: 'scalar_multiply', label: '✕ Skalar', icon: 'k·A', desc: 'Kalikan dengan skalar' },
    { value: 'add', label: '➕ Jumlah', icon: 'A+B', desc: 'A + B' },
    { value: 'subtract', label: '➖ Kurang', icon: 'A-B', desc: 'A - B' },
    { value: 'multiply', label: '✗ Kali', icon: 'A×B', desc: 'A × B' },
  ]

  const handleMatrixAChange = (e) => {
    setMatrixA(e.target.value)
  }

  const handleCalculate = async () => {
    if (!matrixA.trim()) {
      setError('Matriks A tidak boleh kosong')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let response
      
      if (operation === 'determinant') {
        response = await calculateDeterminant(JSON.parse(matrixA))
      } else if (operation === 'inverse') {
        response = await calculateInverse(JSON.parse(matrixA))
      } else if (operation === 'transpose') {
        response = await solveMatrixOperation('transpose', JSON.parse(matrixA))
      } else if (operation === 'scalar_multiply') {
        response = await solveMatrixOperation('scalar_multiply', JSON.parse(matrixA), null, scalarValue)
      } else if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
        if (!matrixB.trim()) {
          setError('Matriks B diperlukan untuk operasi ini')
          setLoading(false)
          return
        }
        response = await solveMatrixOperation(operation, JSON.parse(matrixA), JSON.parse(matrixB))
      }

      if (response.success) {
        setResult(response)
      } else {
        setError(response.error || 'Gagal melakukan operasi')
      }
    } catch (err) {
      setError('Error: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExample = (type) => {
    if (type === '2x2') {
      setMatrixA('[[1, 2], [3, 4]]')
    } else if (type === '3x3') {
      setMatrixA('[[1, 2, 3], [4, 5, 6], [7, 8, 9]]')
    } else if (type === 'singular') {
      setMatrixA('[[1, 2], [2, 4]]')
    }
  }

  return (
    <div className="calculator-section">
      <h2>⊞ Operasi Matriks</h2>
      <p className="section-description">
        Lakukan berbagai operasi matriks: determinan, invers, transpose, dan lainnya
      </p>

      {/* Operation Type Selector - Grid Layout */}
      <div className="operation-selector">
        <p className="selector-label">🎯 Pilih Operasi:</p>
        <div className="operations-grid">
          {operations.map(op => (
            <button
              key={op.value}
              className={`operation-btn ${operation === op.value ? 'active' : ''}`}
              onClick={() => setOperation(op.value)}
              title={op.desc}
            >
              <span className="op-label">{op.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="matrix-input-section">
        {/* Matrix A Input */}
        <div className="calculator-input-group">
          <h3>📊 Matriks A</h3>
          <label htmlFor="matrix-a">Format: <code>[[a,b],[c,d]]</code></label>
          <textarea
            id="matrix-a"
            value={matrixA}
            onChange={handleMatrixAChange}
            placeholder='Contoh: [[1, 2], [3, 4]]'
            className="textarea-field"
            rows="5"
          />

          {/* Quick Examples */}
          <div className="examples-group">
            <p className="examples-label">📝 Contoh:</p>
            <button onClick={() => handleExample('2x2')} className="example-btn">
              2×2
            </button>
            <button onClick={() => handleExample('3x3')} className="example-btn">
              3×3
            </button>
            <button onClick={() => handleExample('singular')} className="example-btn">
              Singular
            </button>
          </div>
        </div>

        {/* Matrix B Input - Conditional */}
        {(operation === 'add' || operation === 'subtract' || operation === 'multiply') && (
          <div className="calculator-input-group">
            <h3>📊 Matriks B</h3>
            <label htmlFor="matrix-b">Format: <code>[[a,b],[c,d]]</code></label>
            <textarea
              id="matrix-b"
              value={matrixB}
              onChange={(e) => setMatrixB(e.target.value)}
              placeholder='Contoh: [[5, 6], [7, 8]]'
              className="textarea-field"
              rows="5"
            />
          </div>
        )}

        {/* Scalar Input - Conditional */}
        {operation === 'scalar_multiply' && (
          <div className="calculator-input-group">
            <h3>⚡ Nilai Skalar</h3>
            <label htmlFor="scalar">k =</label>
            <input
              id="scalar"
              type="number"
              value={scalarValue}
              onChange={(e) => setScalarValue(parseFloat(e.target.value) || 0)}
              placeholder="2"
              className="input-field"
            />
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button onClick={handleCalculate} className="calculate-btn" disabled={loading}>
        {loading ? '⏳ Menghitung...' : '🚀 Hitung'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="error-box">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="result-box">
          <h3>✅ Hasil</h3>

          {operation === 'determinant' && (
            <>
              <div className="result-item">
                <p><strong>Ukuran:</strong> {result.matrix_size[0]}×{result.matrix_size[1]}</p>
              </div>
              <div className="result-item">
                <p><strong>Determinan:</strong></p>
                <BlockFormula formula={`\\det(A) = ${result.determinant.toFixed(6)}`} />
              </div>
              {result.latex_formula && (
                <div className="result-item">
                  <p><strong>Rumus:</strong></p>
                  <BlockFormula formula={result.latex_formula} />
                </div>
              )}
              <div className="result-item info-box">
                <p>{result.interpretation}</p>
              </div>
            </>
          )}

          {operation === 'inverse' && (
            <>
              <div className="result-item">
                <p><strong>Det(A):</strong> {result.determinant.toFixed(6)}</p>
              </div>
              <div className="result-item">
                <p><strong>Kondisi:</strong> {result.condition_number.toFixed(6)}</p>
              </div>
              <div className="result-item">
                <p><strong>A⁻¹ =</strong></p>
                <BlockFormula formula={matrixToLaTeX(result.inverse)} className="matrix-result" />
              </div>
              <div className="result-item info-box">
                <p>{result.verification_passed ? '✓ Verifikasi: Benar' : '✗ Verifikasi: Salah'}</p>
              </div>
            </>
          )}

          {operation === 'transpose' && (
            <div className="result-item">
              <p><strong>A<sup>T</sup> =</strong></p>
              <BlockFormula formula={matrixToLaTeX(result.result)} className="matrix-result" />
            </div>
          )}

          {operation === 'scalar_multiply' && (
            <>
              <div className="result-item">
                <p><strong>{scalarValue} × A =</strong></p>
              </div>
              <div className="result-item">
                <BlockFormula formula={matrixToLaTeX(result.result)} className="matrix-result" />
              </div>
            </>
          )}

          {(operation === 'add' || operation === 'subtract' || operation === 'multiply') && (
            <>
              <div className="result-item">
                <p>
                  <strong>
                    {operation === 'add' ? 'A + B =' : operation === 'subtract' ? 'A - B =' : 'A × B ='}
                  </strong>
                </p>
              </div>
              <div className="result-item">
                <BlockFormula formula={matrixToLaTeX(result.result)} className="matrix-result" />
              </div>
              <div className="result-item info-box">
                <p>Dimensi: {result.result_shape[0]}×{result.result_shape[1]}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MatrixOperations
