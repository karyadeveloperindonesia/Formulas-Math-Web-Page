# Advanced Math Calculator API - Dokumentasi Lengkap

**Versi API:** 2.2  
**Framework:** FastAPI + Python  
**Base URL:** `http://localhost:8002`

---

## 📑 Daftar Isi
1. [Setup & Instalasi](#setup--instalasi)
2. [Autentikasi & CORS](#autentikasi--cors)
3. [Format Request & Response](#format-request--response)
4. [Algebra](#algebra)
5. [Solid of Revolution](#solid-of-revolution)
6. [Linear Algebra](#linear-algebra)
7. [Integral Calculator](#integral-calculator)
8. [Error Handling](#error-handling)
9. [Contoh Implementasi](#contoh-implementasi)

---

## Setup & Instalasi

### Prasyarat
- Python 3.8+
- pip package manager

### Instalasi Dependencies
```bash
# Masuk ke folder backups
cd backups

# Install semua dependencies
pip install -r requirements.txt

# Dependencies yang akan diinstall:
# - fastapi==0.104.1
# - uvicorn==0.24.0
# - pydantic==2.5.0
# - sympy==1.12
# - scipy==1.11.4
# - numpy==1.26.2
# - matplotlib==3.8.2
# - plotly==5.18.0
# - python-multipart==0.0.6
```

### Menjalankan Server
```bash
# Cara 1: Langsung dari main.py
python main.py

# Cara 2: Dengan uvicorn manual
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

**Output yang diharapkan:**
```
INFO:     Uvicorn running on http://0.0.0.0:8002 (Press CTRL+C to quit)
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
```

**Akses Interactive Docs:**
- Swagger UI: `http://localhost:8002/docs`
- ReDoc: `http://localhost:8002/redoc`

---

## Autentikasi & CORS

API ini **tidak memerlukan autentikasi**. CORS sudah dikonfigurasi untuk menerima request dari **semua origin**.

### Konfigurasi CORS
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Terima dari semua origin
    allow_credentials=True,
    allow_methods=["*"],           # GET, POST, PUT, DELETE, dll
    allow_headers=["*"],           # Semua headers
)
```

### Headers yang Direkomendasikan
```http
Content-Type: application/json
Accept: application/json
```

---

## Format Request & Response

### Request Format
Semua request menggunakan **JSON** dengan method **POST** (kecuali root endpoint).

**Template Request:**
```json
{
  "field1": "value1",
  "field2": 123.45,
  "field3": ["array", "values"]
}
```

### Response Format
Semua response mengembalikan JSON dengan struktur:

**Success Response:**
```json
{
  "success": true,
  "module": "module_name",
  "operation": "operation_name",
  "result": { ... },
  "additional_fields": { ... }
}
```

**Error Response:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## � Algebra

Menyelesaikan persamaan linear, kuadrat, dan polinomial.

### 1. Selesaikan Persamaan Linear

**Endpoint:** `POST /api/algebra/solve-linear`

**Bentuk:** $ ax + b = 0 $

**Solusi:** $ x = -\frac{b}{a} $

**Request Body:**
```json
{
  "a": 2,
  "b": -6
}
```

**Parameter:**
| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `a` | float | Yes | Koefisien x (tidak boleh 0) |
| `b` | float | Yes | Konstanta |

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "equation": "2x + -6 = 0",
  "a": 2.0,
  "b": -6.0,
  "solution": 3.0,
  "solution_fraction": "-6/2",
  "steps": [
    {
      "step": 1,
      "description": "Linear equation form",
      "expression": "2x + -6 = 0"
    },
    {
      "step": 2,
      "description": "Isolate x term",
      "expression": "2x = 6"
    },
    {
      "step": 3,
      "description": "Divide by coefficient",
      "expression": "x = 6/2"
    },
    {
      "step": 4,
      "description": "Final solution",
      "expression": "x = 3.0"
    }
  ],
  "verification": {
    "equation_result": 0.0,
    "is_correct": true
  }
}
```

**Contoh cURL:**
```bash
curl -X POST "http://localhost:8002/api/algebra/solve-linear" \
  -H "Content-Type: application/json" \
  -d '{"a": 2, "b": -6}'
```

---

### 2. Selesaikan Persamaan Kuadrat

**Endpoint:** `POST /api/algebra/solve-quadratic`

**Bentuk:** $ ax^2 + bx + c = 0 $

**Rumus:** $ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $

**Request Body:**
```json
{
  "a": 1,
  "b": -5,
  "c": 6
}
```

**Parameter:**
| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `a` | float | Yes | Koefisien $x^2$ (tidak boleh 0) |
| `b` | float | Yes | Koefisien x |
| `c` | float | Yes | Konstanta |

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "equation": "1x² + -5x + 6 = 0",
  "a": 1.0,
  "b": -5.0,
  "c": 6.0,
  "discriminant": 1.0,
  "discriminant_type": "positive",
  "roots": [3.0, 2.0],
  "steps": [
    {
      "step": 1,
      "description": "Quadratic equation form",
      "expression": "1x² + -5x + 6 = 0"
    },
    {
      "step": 2,
      "description": "Identify coefficients",
      "expression": "a = 1, b = -5, c = 6"
    },
    {
      "step": 3,
      "description": "Calculate discriminant (Δ = b² - 4ac)",
      "expression": "Δ = (-5)² - 4(1)(6) = 1"
    },
    {
      "step": 4,
      "description": "Discriminant > 0: Two distinct real roots",
      "expression": "Δ = 1 > 0"
    },
    {
      "step": 5,
      "description": "Apply quadratic formula",
      "expression": "x = (-b ± √Δ) / 2a = (5 ± √1) / 2"
    },
    {
      "step": 6,
      "description": "Calculate roots",
      "expression": "x₁ = 3.0, x₂ = 2.0"
    }
  ],
  "verification": [
    {
      "root": 3.0,
      "result": 0.0,
      "is_correct": true
    },
    {
      "root": 2.0,
      "result": 0.0,
      "is_correct": true
    }
  ]
}
```

**Discriminant Cases:**
- **Δ > 0:** Dua akar real yang berbeda
- **Δ = 0:** Satu akar real yang berulang
- **Δ < 0:** Akar kompleks (tidak ada akar real)

**Contoh cURL:**
```bash
curl -X POST "http://localhost:8002/api/algebra/solve-quadratic" \
  -H "Content-Type: application/json" \
  -d '{"a": 1, "b": -5, "c": 6}'
```

---

### 3. Faktorisasi Persamaan Kuadrat

**Endpoint:** `POST /api/algebra/factor-quadratic`

**Request Body:**
```json
{
  "a": 1,
  "b": -5,
  "c": 6
}
```

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "original": "1x² + -5x + 6",
  "original_latex": "x^{2} - 5 x + 6",
  "factored": "(x - 2)(x - 3)",
  "factored_latex": "(x - 2)(x - 3)",
  "is_factorable": true
}
```

---

### 4. Selesaikan Persamaan Polinomial

**Endpoint:** `POST /api/algebra/solve-polynomial`

**Request Body:**
```json
{
  "coefficients": [1, -6, 11, -6]
}
```

**Deskripsi:** Menyelesaikan $x^3 - 6x^2 + 11x - 6 = 0$

**Parameter:**
| Parameter | Type | Deskripsi |
|-----------|------|-----------|
| `coefficients` | array | Koefisien dari pangkat tertinggi ke terendah |

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "degree": 3,
  "polynomial": "x**3 - 6*x**2 + 11*x - 6",
  "polynomial_latex": "x^{3} - 6 x^{2} + 11 x - 6",
  "roots": [1.0, 2.0, 3.0],
  "num_roots": 3,
  "num_real_roots": 3
}
```

---

## �🔄 Solid of Revolution

Menghitung volume benda putar (rotating solid).

### 1. Hitung Volume Benda Putar

**Endpoint:** `POST /api/volume`

**Rumus:**
- **X-axis rotation:** $ V = \pi \int_a^b [f(x)]^2 \, dx $
- **Y-axis rotation:** $ V = 2\pi \int_a^b x \cdot f(x) \, dx $

**Request Body:**
```json
{
  "function": "x**2",
  "lower_bound": 0,
  "upper_bound": 2,
  "axis": "x-axis"
}
```

**Parameter:**
| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `function` | string | Yes | Fungsi dalam variabel x (e.g., "x**2", "sqrt(x)", "sin(x)") |
| `lower_bound` | float | Yes | Batas bawah integral |
| `upper_bound` | float | Yes | Batas atas integral (harus > lower_bound) |
| `axis` | string | No | "x-axis" atau "y-axis" (default: "x-axis") |

**Response:**
```json
{
  "success": true,
  "module": "solid_of_revolution",
  "volume_numerical": 4.1887902047863905,
  "volume_symbolic": "4*pi",
  "integral_expression": "π∫[0,2] (x**2)² dx",
  "function": "x**2",
  "bounds": {
    "lower": 0,
    "upper": 2
  },
  "axis": "x-axis",
  "plot_2d": "{plotly_json_data}",
  "plot_3d": "{plotly_json_data}"
}
```

**Contoh cURL:**
```bash
curl -X POST "http://localhost:8002/api/volume" \
  -H "Content-Type: application/json" \
  -d '{
    "function": "sqrt(x)",
    "lower_bound": 0,
    "upper_bound": 4,
    "axis": "x-axis"
  }'
```

**Contoh JavaScript:**
```javascript
const response = await fetch('http://localhost:8002/api/volume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    function: 'sqrt(x)',
    lower_bound: 0,
    upper_bound: 4,
    axis: 'x-axis'
  })
});
const data = await response.json();
console.log('Volume:', data.volume_numerical);
console.log('2D Plot:', data.plot_2d);
console.log('3D Plot:', data.plot_3d);
```

---

## 📊 Linear Algebra

Operasi matriks dan aljabar linear.

### 1. Hitung Determinan Matriks

**Endpoint:** `POST /api/linear-algebra/determinant`

**Request Body:**
```json
{
  "matrix": [[1, 2], [3, 4]]
}
```

**Response:**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "determinant",
  "determinant": -2.0,
  "symbolic_determinant": "-2",
  "matrix_size": [2, 2],
  "is_singular": false,
  "matrix_visualization": "data:image/png;base64,..."
}
```

---

### 2. Hitung Inverse Matriks

**Endpoint:** `POST /api/linear-algebra/inverse`

**Request Body:**
```json
{
  "matrix": [[1, 2], [3, 4]]
}
```

**Response:**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "inverse",
  "inverse": [[-2.0, 1.0], [1.5, -0.5]],
  "determinant": -2.0,
  "verification_passed": true,
  "condition_number": 5.370983768510908,
  "original_matrix_viz": "data:image/png;base64,...",
  "inverse_matrix_viz": "data:image/png;base64,..."
}
```

**Error Case (Singular Matrix):**
```json
{
  "detail": "Matrix is singular (determinant = 0), inverse does not exist"
}
```

---

### 3. Hitung Eigenvalues & Eigenvectors

**Endpoint:** `POST /api/linear-algebra/eigenvalues`

**Request Body:**
```json
{
  "matrix": [[4, 2], [1, 3]]
}
```

**Response:**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "eigenvalues",
  "eigen_pairs": [
    {
      "eigenvalue": {
        "real": 5.0,
        "imag": 0.0,
        "magnitude": 5.0
      },
      "eigenvector": [0.894, 0.447],
      "eigenvector_latex": "\\begin{pmatrix} 0.894 \\\\ 0.447 \\end{pmatrix}"
    },
    {
      "eigenvalue": {
        "real": 2.0,
        "imag": 0.0,
        "magnitude": 2.0
      },
      "eigenvector": [-0.447, 0.894],
      "eigenvector_latex": "\\begin{pmatrix} -0.447 \\\\ 0.894 \\end{pmatrix}"
    }
  ],
  "eigenvectors": [[0.894, -0.447], [0.447, 0.894]],
  "matrix_visualization": "data:image/png;base64,...",
  "eigenvectors_visualization": "data:image/png;base64,..."
}
```

---

### 4. Matrix Decomposition

**Endpoint:** `POST /api/linear-algebra/decomposition`

**Mendukung:** LU, QR, SVD, Cholesky

**Request Body:**
```json
{
  "matrix": [[4, 3], [6, 3]],
  "method": "lu"
}
```

**Response (LU Decomposition):**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "decomposition",
  "method": "lu",
  "L": [[1.0, 0.0], [1.5, 1.0]],
  "U": [[4.0, 3.0], [0.0, -1.5]],
  "permutation": [0, 1],
  "reconstruction_error": 0.0
}
```

**Parameter:**
| Parameter | Type | Nilai |
|-----------|------|-------|
| `method` | string | "lu", "qr", "svd", "cholesky" |

**SVD Special Response:**
```json
{
  "method": "svd",
  "U": "...",
  "singular_values": [12.4, 3.2, ...],
  "Vt": "...",
  "rank": 2,
  "svd_visualization": "data:image/png;base64,..."
}
```

---

### 5. Selesaikan Sistem Linear (Ax = b)

**Endpoint:** `POST /api/linear-algebra/solve`

**Menyelesaikan:** Sistem persamaan linear $ Ax = b $

**Request Body:**
```json
{
  "A": [[3, 2], [1, 2]],
  "b": [8, 4]
}
```

**Response:**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "solve_system",
  "input": {
    "A": [[3, 2], [1, 2]],
    "b": [8, 4]
  },
  "solution": [2.0, 1.0],
  "is_consistent": true,
  "rank_A": 2,
  "rank_augmented": 2,
  "verification": {
    "Ax": [8.0, 4.0],
    "residual": [0.0, 0.0]
  }
}
```

---

### 6. Operasi Matriks Dasar

**Endpoint:** `POST /api/linear-algebra/operations`

**Request Body:**
```json
{
  "operation": "add",
  "matrix_a": [[1, 2], [3, 4]],
  "matrix_b": [[5, 6], [7, 8]]
}
```

**Operasi yang Didukung:**
| Operasi | matrix_a | matrix_b | scalar | Deskripsi |
|---------|----------|----------|--------|-----------|
| `add` | Required | Required | - | A + B |
| `subtract` | Required | Required | - | A - B |
| `multiply` | Required | Required | - | A × B |
| `transpose` | Required | - | - | A^T |
| `scalar_multiply` | Required | - | Required | A × scalar |
| `power` | Required | - | Required | A^n |

**Response (Add):**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "add",
  "result": [[6, 8], [10, 12]]
}
```

---

### 7. Hitung Matrix Rank

**Endpoint:** `POST /api/linear-algebra/rank`

**Request Body:**
```json
{
  "matrix": [[1, 2, 3], [2, 4, 6]]
}
```

**Response:**
```json
{
  "success": true,
  "module": "linear_algebra",
  "operation": "rank",
  "rank": 1,
  "matrix_shape": [2, 3],
  "is_full_rank": false,
  "nullity": 2
}
```

---

## ∫ Integral Calculator

Menghitung integral (tentu dan tak tentu) dengan visualisasi.

### 1. Integral Tak Tentu (Indefinite Integral)

**Endpoint:** `POST /api/integral/indefinite`

**Menghitung:** $ \int f(x) \, dx $

**Request Body:**
```json
{
  "function": "x**2 + 2*x + 1"
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "type": "indefinite",
  "original_function": "x**2 + 2*x + 1",
  "original_latex": "x^{2} + 2 x + 1",
  "integral_result": "x**3/3 + x**2 + x",
  "integral_latex": "\\frac{x^{3}}{3} + x^{2} + x",
  "full_expression_latex": "\\int x^{2} + 2 x + 1 \\, dx = \\frac{x^{3}}{3} + x^{2} + x + C",
  "with_constant": "x**3/3 + x**2 + x + C"
}
```

---

### 2. Integral Tentu (Definite Integral)

**Endpoint:** `POST /api/integral/definite`

**Menghitung:** $ \int_a^b f(x) \, dx $

**Request Body:**
```json
{
  "function": "sin(x)",
  "lower_bound": 0,
  "upper_bound": 3.14159
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "type": "definite",
  "numerical_value": 2.0,
  "symbolic_value": "2",
  "function": "sin(x)",
  "bounds": {
    "lower": 0,
    "upper": 3.14159
  },
  "error_estimate": 2.22e-14,
  "visualizations": {
    "function_plot": "data:image/png;base64,...",
    "area_plot": "data:image/png;base64,..."
  }
}
```

---

### 3. Area Under Curve

**Endpoint:** `POST /api/integral/area`

**Request Body:**
```json
{
  "function": "x**2",
  "lower_bound": 0,
  "upper_bound": 3
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "area": 9.0,
  "function": "x**2",
  "bounds": {
    "lower": 0,
    "upper": 3
  },
  "visualization": "data:image/png;base64,..."
}
```

---

### 4. Average Value of Function

**Endpoint:** `POST /api/integral/average-value`

**Menghitung:** $ f_{avg} = \frac{1}{b-a} \int_a^b f(x) \, dx $

**Request Body:**
```json
{
  "function": "x**2",
  "lower_bound": 1,
  "upper_bound": 3
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "average_value": 4.666666666,
  "function": "x**2",
  "bounds": {
    "lower": 1,
    "upper": 3
  },
  "integral_value": 8.666666666
}
```

---

### 5. Arc Length

**Endpoint:** `POST /api/integral/arc-length`

**Menghitung:** $ L = \int_a^b \sqrt{1 + [f'(x)]^2} \, dx $

**Request Body:**
```json
{
  "function": "sqrt(x)",
  "lower_bound": 0,
  "upper_bound": 4
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "arc_length": 6.0634,
  "function": "sqrt(x)",
  "bounds": {
    "lower": 0,
    "upper": 4
  }
}
```

---

### 6. Surface Area of Revolution

**Endpoint:** `POST /api/integral/surface-area`

**Menghitung:** $ S = 2\pi \int_a^b f(x) \sqrt{1 + [f'(x)]^2} \, dx $

**Request Body:**
```json
{
  "function": "x**2",
  "lower_bound": 0,
  "upper_bound": 1,
  "axis": "x-axis"
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "surface_area": 3.8105,
  "function": "x**2",
  "bounds": {
    "lower": 0,
    "upper": 1
  },
  "axis": "x-axis"
}
```

---

### 7. Integration Steps

**Endpoint:** `POST /api/integral/steps`

**Menampilkan:** Langkah-langkah penyelesaian integral

**Request Body:**
```json
{
  "function": "x**3 + 2*x"
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "original_function": "x**3 + 2*x",
  "steps": [
    {
      "step": 1,
      "description": "Apply power rule to each term",
      "expression": "∫x³ dx = x⁴/4, ∫2x dx = x²"
    },
    {
      "step": 2,
      "description": "Combine results",
      "expression": "x⁴/4 + x² + C"
    }
  ],
  "final_result": "x**4/4 + x**2 + C"
}
```

---

### 8. Riemann Sum Visualization

**Endpoint:** `POST /api/integral/riemann`

**Visualisasi:** Approximasi menggunakan persegi panjang

**Request Body:**
```json
{
  "function": "sin(x)",
  "lower_bound": 0,
  "upper_bound": 3.14159
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "type": "riemann_sum",
  "visualization": "data:image/png;base64,...",
  "n_rectangles": 10
}
```

---

### 9. 3D Visualization

**Endpoint:** `POST /api/integral/visualize-3d`

**Request Body:**
```json
{
  "function": "x**2",
  "lower_bound": -2,
  "upper_bound": 2
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "visualization_3d": "{plotly_json_data}"
}
```

---

### 10. Antiderivative Visualization

**Endpoint:** `POST /api/integral/antiderivative-viz`

**Request Body:**
```json
{
  "function": "cos(x)",
  "lower_bound": -3.14159,
  "upper_bound": 3.14159
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "visualization": "data:image/png;base64,..."
}
```

---

### 11. Comparison of Integration Methods

**Endpoint:** `POST /api/integral/comparison`

**Membandingkan:** Berbagai metode integrasi numerik

**Request Body:**
```json
{
  "function": "exp(x)",
  "lower_bound": 0,
  "upper_bound": 1
}
```

**Response:**
```json
{
  "success": true,
  "module": "integral_calculator",
  "visualization": "data:image/png;base64,..."
}
```

---

### 12. Validate Function

**Endpoint:** `POST /api/integral/validate`

**Mengecek:** Apakah fungsi valid dan dapat diintegrasikan

**Request Body:**
```json
{
  "function": "x**2 + sin(x)"
}
```

**Response (Valid):**
```json
{
  "success": true,
  "module": "integral_calculator",
  "is_valid": true,
  "function": "x**2 + sin(x)",
  "message": "Function is valid and can be processed"
}
```

**Response (Invalid):**
```json
{
  "detail": "Invalid function expression: unknown symbol 'z'"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "detail": "Error message describing the issue"
}
```

### Tipe-tipe Error

#### 1. Validation Error (400)
```json
{
  "detail": "Upper bound must be greater than lower bound"
}
```

#### 2. Singular Matrix Error (400)
```json
{
  "detail": "Matrix is singular (determinant = 0), inverse does not exist"
}
```

#### 3. Invalid Function Error (400)
```json
{
  "detail": "Invalid function expression: undefined variable 'y'"
}
```

#### 4. Dimension Mismatch Error (400)
```json
{
  "detail": "Matrix dimensions incompatible for this operation"
}
```

---

## Contoh Implementasi

### Python dengan Requests Library

```python
import requests
import json

BASE_URL = "http://localhost:8002"

# 1. Solve Linear Equation
def solve_linear():
    endpoint = f"{BASE_URL}/api/algebra/solve-linear"
    payload = {
        "a": 2,
        "b": -6
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Equation: {result['equation']}")
    print(f"Solution: {result['solution']}")
    print(f"Steps: {result['steps']}")
    return result

# 2. Solve Quadratic Equation
def solve_quadratic():
    endpoint = f"{BASE_URL}/api/algebra/solve-quadratic"
    payload = {
        "a": 1,
        "b": -5,
        "c": 6
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Equation: {result['equation']}")
    print(f"Discriminant: {result['discriminant']}")
    print(f"Roots: {result['roots']}")
    return result

# 3. Calculate Volume of Revolution
def calculate_volume():
    endpoint = f"{BASE_URL}/api/volume"
    payload = {
        "function": "sqrt(x)",
        "lower_bound": 0,
        "upper_bound": 4,
        "axis": "x-axis"
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Volume: {result['volume_numerical']}")
    print(f"Symbolic: {result['volume_symbolic']}")
    return result

# 4. Calculate Determinant
def calculate_determinant():
    endpoint = f"{BASE_URL}/api/linear-algebra/determinant"
    payload = {
        "matrix": [[1, 2], [3, 4]]
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Determinant: {result['determinant']}")
    print(f"Is Singular: {result['is_singular']}")
    return result

# 5. Calculate Indefinite Integral
def calculate_indefinite_integral():
    endpoint = f"{BASE_URL}/api/integral/indefinite"
    payload = {
        "function": "x**2 + 2*x + 1"
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Function: {result['original_function']}")
    print(f"Integral: {result['with_constant']}")
    return result

# 6. Calculate Definite Integral
def calculate_definite_integral():
    endpoint = f"{BASE_URL}/api/integral/definite"
    payload = {
        "function": "sin(x)",
        "lower_bound": 0,
        "upper_bound": 3.14159
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Integral Value: {result['numerical_value']}")
    print(f"Symbolic: {result['symbolic_value']}")
    return result

# Run examples
if __name__ == "__main__":
    print("=== Solve Linear ===")
    solve_linear()
    
    print("\n=== Solve Quadratic ===")
    solve_quadratic()
    
    print("\n=== Volume of Revolution ===")
    calculate_volume()
    
    print("\n=== Determinant ===")
    calculate_determinant()
    
    print("\n=== Indefinite Integral ===")
    calculate_indefinite_integral()
    
    print("\n=== Definite Integral ===")
    calculate_definite_integral()
```
        "lower_bound": 0,
        "upper_bound": 3.14159
    }
    
    response = requests.post(endpoint, json=payload)
    result = response.json()
    
    print(f"Integral Value: {result['numerical_value']}")
    print(f"Symbolic: {result['symbolic_value']}")
    return result

# Run examples
if __name__ == "__main__":
    print("=== Volume of Revolution ===")
    calculate_volume()
    
    print("\n=== Determinant ===")
    calculate_determinant()
    
    print("\n=== Indefinite Integral ===")
    calculate_indefinite_integral()
    
    print("\n=== Definite Integral ===")
    calculate_definite_integral()
```

### JavaScript/Fetch API

```javascript
const BASE_URL = "http://localhost:8002";

// 1. Solve Linear Equation
async function solveLinear() {
  const payload = {
    a: 2,
    b: -6
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/algebra/solve-linear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log('Equation:', data.equation);
    console.log('Solution:', data.solution);
    console.log('Steps:', data.steps);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Solve Quadratic Equation
async function solveQuadratic() {
  const payload = {
    a: 1,
    b: -5,
    c: 6
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/algebra/solve-quadratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log('Equation:', data.equation);
    console.log('Discriminant:', data.discriminant);
    console.log('Roots:', data.roots);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 3. Calculate Volume
async function calculateVolume() {
  const payload = {
    function: "sqrt(x)",
    lower_bound: 0,
    upper_bound: 4,
    axis: "x-axis"
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/volume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log('Volume:', data.volume_numerical);
    console.log('Symbolic:', data.volume_symbolic);
    
    // Render 2D plot
    const plot2d = JSON.parse(data.plot_2d);
    Plotly.newPlot('plot2d', plot2d.data, plot2d.layout);
    
    // Render 3D plot
    const plot3d = JSON.parse(data.plot_3d);
    Plotly.newPlot('plot3d', plot3d.data, plot3d.layout);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Calculate Indefinite Integral
async function calculateIndefiniteIntegral() {
  const payload = {
    function: "x**2 + 2*x + 1"
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/integral/indefinite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log('Original:', data.original_function);
    console.log('Result:', data.with_constant);
    console.log('LaTeX:', data.integral_latex);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 3. Solve Linear System
async function solveLinearSystem() {
  const payload = {
    A: [[3, 2], [1, 2]],
    b: [8, 4]
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/linear-algebra/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log('Solution:', data.solution);
    console.log('Verification Ax:', data.verification.Ax);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples
async function main() {
  console.log("=== Solve Linear ===");
  await solveLinear();
  
  console.log("\n=== Solve Quadratic ===");
  await solveQuadratic();
  
  console.log("\n=== Calculate Volume ===");
  await calculateVolume();
  
  console.log("\n=== Calculate Integral ===");
  await calculateIndefiniteIntegral();
  
  console.log("\n=== Solve System ===");
  await solveLinearSystem();
}

main();
```

### React Component Example

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const MathCalculator = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const BASE_URL = "http://localhost:8002";
  
  const calculateIntegral = async (func, a, b) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/integral/definite`, {
        function: func,
        lower_bound: a,
        upper_bound: b
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error calculating integral');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Math Calculator</h1>
      
      <button onClick={() => calculateIntegral('x**2', 0, 3)}>
        Calculate ∫x² dx from 0 to 3
      </button>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {result && (
        <div>
          <p>Result: {result.numerical_value}</p>
          <p>Function: {result.function}</p>
        </div>
      )}
    </div>
  );
};

export default MathCalculator;
```

---

## Tips & Tricks

### 1. Supported Math Functions
```
- Basic: +, -, *, /, ** (power)
- Trigonometric: sin, cos, tan, asin, acos, atan
- Exponential & Logarithmic: exp, log, log10, sqrt
- Constants: pi, e
- Example: "sin(x)**2 + cos(x)" or "sqrt(x) * exp(-x)"
```

### 2. Performance Tips
- Untuk integral kompleks, nilai numerik lebih cepat dari simbolik
- Matrix operations lebih efisien dengan numpy/scipy backend
- Visualisasi base64 bisa langsung ditampilkan di img tag

### 3. Debugging
```bash
# Check API status
curl http://localhost:8002/

# View API docs
# Buka: http://localhost:8002/docs
```

### 4. Batching Requests
```javascript
// Hitung multiple integrals sekaligus
const promises = [
  fetch('http://localhost:8002/api/integral/indefinite', {...}),
  fetch('http://localhost:8002/api/integral/indefinite', {...}),
  fetch('http://localhost:8002/api/integral/indefinite', {...})
];

const results = await Promise.all(promises);
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Connection refused | Server tidak berjalan | Jalankan `python main.py` |
| JSON decode error | Format request salah | Periksa JSON syntax |
| Invalid function | Variabel tidak dikenal | Gunakan hanya variable `x` |
| Matrix dimension error | Dimensi matriks tidak cocok | Pastikan matrix kompatibel |
| Singular matrix | det = 0 | Gunakan matrix yang non-singular |

---

## Contact & Support

- **API Version:** 2.2
- **Last Updated:** 2025-12-21
- **Framework:** FastAPI 0.104.1
- **Python Version:** 3.8+

---

**Selamat menggunakan Advanced Math Calculator API! 🚀**
