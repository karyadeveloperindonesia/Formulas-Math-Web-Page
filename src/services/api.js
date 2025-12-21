/**
 * API Service
 * Menangani semua permintaan ke backend Python API
 */

// Base URL untuk backend API
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://formula-api.mathlab.id'

/**
 * Generic fetch function dengan error handling
 */
const fetchFromAPI = async (endpoint, method = 'GET', body = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log(`📡 [${method}] ${url}`)
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
      console.log('📦 Request body:', body)
    }

    const response = await fetch(url, options)
    console.log(`📊 Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error Response:`, errorText)
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Response data received, size:', JSON.stringify(data).length, 'bytes')
    return data
  } catch (error) {
    console.error('❌ API Error:', error)
    throw error
  }
}

/**
 * ============ INTEGRAL CALCULATOR ENDPOINTS ============
 */

/**
 * Calculate indefinite integral ∫f(x)dx
 * @param {string} func - Function string (e.g., "x**2", "sin(x)")
 * @returns {Promise} Result dengan LaTeX expression
 */
export const calculateIndefiniteIntegral = async (func) => {
  return fetchFromAPI('/api/integral/indefinite', 'POST', {
    function: func,
  })
}

/**
 * Calculate definite integral ∫[a,b]f(x)dx dengan visualization
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit (a)
 * @param {number} upperBound - Upper limit (b)
 * @returns {Promise} Result dengan visualization plots
 */
export const calculateDefiniteIntegral = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/integral/definite', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
  })
}

/**
 * Calculate area under curve
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} Area value dengan visualization
 */
export const calculateAreaUnderCurve = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/integral/area', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
  })
}

/**
 * Calculate average value of function
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} Average value calculation
 */
export const calculateAverageValue = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/integral/average-value', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
  })
}

/**
 * Calculate arc length of curve
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} Arc length calculation
 */
export const calculateArcLength = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/integral/arc-length', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
  })
}

/**
 * Calculate surface area of revolution
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @param {string} axis - Axis of revolution ('x-axis' or 'y-axis')
 * @returns {Promise} Surface area calculation
 */
export const calculateSurfaceArea = async (func, lowerBound, upperBound, axis = 'x-axis') => {
  return fetchFromAPI('/api/integral/surface-area', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
    axis,
  })
}

/**
 * Get step-by-step integration explanation
 * @param {string} func - Function string
 * @returns {Promise} Steps untuk mengintegralkan fungsi
 */
export const getIntegrationSteps = async (func) => {
  return fetchFromAPI('/api/integral/steps', 'POST', {
    function: func,
  })
}

/**
 * Validate if function is integrable
 * @param {string} func - Function string
 * @returns {Promise} Validation result
 */
export const validateFunction = async (func) => {
  return fetchFromAPI('/api/integral/validate', 'POST', {
    function: func,
  })
}

/**
 * Get Riemann sum visualization
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @param {number} rectangles - Number of rectangles
 * @param {string} method - Method ('left', 'right', 'midpoint', 'trapezoid')
 * @returns {Promise} Riemann sum visualization
 */
export const getRiemannSum = async (func, lowerBound, upperBound, rectangles = 10, method = 'midpoint') => {
  return fetchFromAPI('/api/integral/riemann', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
    num_rectangles: rectangles,
    method,
  })
}

/**
 * Get 3D visualization of solid of revolution (Volume calculation)
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} 3D visualization (Plotly JSON) and volume value
 */
export const getVolumeVisualization = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/volume', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
    axis: 'x-axis'
  })
}

/**
 * Get 3D visualization of solid of revolution (Alias for getVolumeVisualization)
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} 3D visualization (Plotly JSON) and volume value
 */
export const get3DVisualization = async (func, lowerBound, upperBound) => {
  return getVolumeVisualization(func, lowerBound, upperBound)
}

/**
 * Get antiderivative visualization
 * @param {string} func - Function string
 * @param {number} lowerBound - Lower limit
 * @param {number} upperBound - Upper limit
 * @returns {Promise} Visualization showing function and antiderivative
 */
export const getAntiderivativeVisualization = async (func, lowerBound, upperBound) => {
  return fetchFromAPI('/api/integral/antiderivative-viz', 'POST', {
    function: func,
    lower_bound: lowerBound,
    upper_bound: upperBound,
  })
}

/**
 * ============ ALGEBRA EQUATION SOLVERS ============
 */

/**
 * Solve linear equation: ax + b = 0
 * @param {number} a - Coefficient of x
 * @param {number} b - Constant
 * @returns {Promise} Solution with verification
 */
export const solveLinear = async (a, b) => {
  return fetchFromAPI('/api/algebra/solve-linear', 'POST', {
    a,
    b,
  })
}

/**
 * Solve quadratic equation: ax² + bx + c = 0
 * @param {number} a - Coefficient of x²
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant
 * @returns {Promise} Roots with discriminant analysis
 */
export const solveQuadratic = async (a, b, c) => {
  return fetchFromAPI('/api/algebra/solve-quadratic', 'POST', {
    a,
    b,
    c,
  })
}

/**
 * Get algebra formula reference
 * @param {string} formulaType - Type of formula (e.g., 'quadratic_formula')
 * @returns {Promise} Formula with explanation
 */
export const getAlgebraReference = async (formulaType) => {
  return fetchFromAPI('/api/algebra/reference', 'POST', {
    formula_type: formulaType,
  })
}

/**
 * ============ LINEAR ALGEBRA OPERATIONS ============
 */

/**
 * Calculate matrix determinant
 * @param {Array} matrix - 2D array representing the matrix
 * @returns {Promise} Determinant value and properties
 */
export const calculateDeterminant = async (matrix) => {
  return fetchFromAPI('/api/linear-algebra/determinant', 'POST', {
    matrix,
  })
}

/**
 * Calculate matrix inverse
 * @param {Array} matrix - 2D array representing the matrix
 * @returns {Promise} Inverse matrix with verification
 */
export const calculateInverse = async (matrix) => {
  return fetchFromAPI('/api/linear-algebra/inverse', 'POST', {
    matrix,
  })
}

/**
 * Perform matrix operation (add, subtract, multiply, transpose, etc.)
 * @param {string} operation - Type of operation
 * @param {Array} matrixA - First matrix
 * @param {Array} matrixB - Second matrix (if needed)
 * @param {number} scalar - Scalar value (if needed)
 * @returns {Promise} Result of the operation
 */
export const solveMatrixOperation = async (operation, matrixA, matrixB = null, scalar = null) => {
  return fetchFromAPI('/api/linear-algebra/operations', 'POST', {
    operation,
    matrix_a: matrixA,
    matrix_b: matrixB,
    scalar,
  })
}

export default {
  calculateIndefiniteIntegral,
  calculateDefiniteIntegral,
  calculateAreaUnderCurve,
  calculateAverageValue,
  calculateArcLength,
  calculateSurfaceArea,
  getIntegrationSteps,
  validateFunction,
  getRiemannSum,
  getVolumeVisualization,
  get3DVisualization,
  getAntiderivativeVisualization,
  solveLinear,
  solveQuadratic,
  getAlgebraReference,
  calculateDeterminant,
  calculateInverse,
  solveMatrixOperation,
}
