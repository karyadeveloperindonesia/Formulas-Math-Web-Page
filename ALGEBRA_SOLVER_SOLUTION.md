# SOLUSI: Error API Algebra (404 Not Found)

## 📋 Masalah yang Ditemukan

**Error:** `API Error: 404 - {"detail":"Not Found"}`

**Penyebab:** Frontend mencoba memanggil endpoints algebra yang belum ada di backend:
- `POST /api/algebra/solve-linear` 
- `POST /api/algebra/solve-quadratic`

Endpoint-endpoint ini **tidak didefinisikan di `backups/main.py`**, hanya model-model untuk integral, linear algebra, dan solid of revolution saja.

---

## ✅ Solusi yang Diimplementasikan

### 1. Buat `algebra_service.py`
**File baru:** `backups/services/algebra_service.py`

Service ini menyediakan class `AlgebraService` dengan methods:
- `solve_linear(a, b)` - Menyelesaikan persamaan linear ax + b = 0
- `solve_quadratic(a, b, c)` - Menyelesaikan persamaan kuadrat ax² + bx + c = 0
- `factor_quadratic(a, b, c)` - Faktorisasi persamaan kuadrat
- `solve_polynomial(coefficients)` - Menyelesaikan persamaan polinomial

### 2. Tambahkan Models di `main.py`
```python
class LinearEquationRequest(BaseModel):
    a: float
    b: float

class QuadraticEquationRequest(BaseModel):
    a: float
    b: float
    c: float

class PolynomialEquationRequest(BaseModel):
    coefficients: List[float]
```

### 3. Tambahkan 4 Endpoints Baru di `main.py`

#### **1) POST /api/algebra/solve-linear**
Menyelesaikan persamaan linear: ax + b = 0

**Request:**
```json
{
  "a": 2,
  "b": -6
}
```

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "equation": "2x + -6 = 0",
  "solution": 3.0,
  "steps": [...],
  "verification": {
    "equation_result": 0.0,
    "is_correct": true
  }
}
```

---

#### **2) POST /api/algebra/solve-quadratic**
Menyelesaikan persamaan kuadrat: ax² + bx + c = 0

**Request:**
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
  "equation": "1x² + -5x + 6 = 0",
  "discriminant": 1.0,
  "discriminant_type": "positive",
  "roots": [3.0, 2.0],
  "steps": [...],
  "verification": [...]
}
```

---

#### **3) POST /api/algebra/factor-quadratic**
Faktorisasi persamaan kuadrat: ax² + bx + c

**Request:**
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
  "factored": "(x - 2)(x - 3)",
  "is_factorable": true
}
```

---

#### **4) POST /api/algebra/solve-polynomial**
Menyelesaikan persamaan polinomial dari koefisien

**Request:**
```json
{
  "coefficients": [1, -6, 11, -6]
}
```
*Menyelesaikan: x³ - 6x² + 11x - 6 = 0*

**Response:**
```json
{
  "success": true,
  "module": "algebra",
  "degree": 3,
  "roots": [1.0, 2.0, 3.0],
  "num_roots": 3,
  "num_real_roots": 3
}
```

---

## 🚀 Cara Menggunakan

### Menjalankan Backend API
```bash
cd backups
python main.py

# Atau dengan uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

### Test dengan cURL
```bash
# Solve Linear: 2x - 6 = 0
curl -X POST "http://localhost:8002/api/algebra/solve-linear" \
  -H "Content-Type: application/json" \
  -d '{"a": 2, "b": -6}'

# Solve Quadratic: x² - 5x + 6 = 0
curl -X POST "http://localhost:8002/api/algebra/solve-quadratic" \
  -H "Content-Type: application/json" \
  -d '{"a": 1, "b": -5, "c": 6}'
```

### Test di Frontend
Frontend sudah benar di `src/components/AlgebraEquationSolver.jsx`. Ketika API berjalan, coba klik "SELESAIKAN" pada tab Linear atau Quadratic.

---

## 🔧 File-file yang Diubah/Dibuat

### File Baru:
1. **`backups/services/algebra_service.py`** - Service untuk algebra operations

### File yang Dimodifikasi:
1. **`backups/main.py`** 
   - Tambah LinearEquationRequest model
   - Tambah QuadraticEquationRequest model
   - Tambah PolynomialEquationRequest model
   - Tambah 4 endpoints algebra baru
   - Update root response dengan algebra module

2. **`API_GUIDE.md`**
   - Tambah section Algebra di daftar isi
   - Dokumentasi lengkap 4 endpoints algebra
   - Contoh implementasi Python dan JavaScript

---

## 📊 Fitur yang Tersedia di AlgebraService

### solve_linear(a, b)
✅ Menyelesaikan ax + b = 0
✅ Menampilkan langkah-langkah penyelesaian
✅ Verifikasi hasil
✅ Menampilkan dalam bentuk pecahan jika perlu

### solve_quadratic(a, b, c)
✅ Menyelesaikan ax² + bx + c = 0
✅ Menghitung discriminant (Δ = b² - 4ac)
✅ Menampilkan jenis akar (real, double, complex)
✅ Langkah-langkah detail menggunakan quadratic formula
✅ Verifikasi masing-masing akar

### factor_quadratic(a, b, c)
✅ Faktorisasi menggunakan SymPy
✅ Menampilkan dalam bentuk LaTeX
✅ Mengecek apakah dapat difaktorisasi

### solve_polynomial(coefficients)
✅ Menyelesaikan polinomial derajat n
✅ Memisahkan akar real dan kompleks
✅ Menampilkan derajat dan jumlah akar

---

## 🎯 Testing Checklist

- [x] Service algebra_service.py dibuat
- [x] Models LinearEquationRequest, QuadraticEquationRequest dibuat
- [x] 4 endpoints algebra ditambahkan ke main.py
- [x] Root response diupdate dengan algebra module
- [x] API_GUIDE.md diupdate dengan dokumentasi
- [x] Contoh implementasi ditambahkan

---

## 📝 Catatan Penting

1. **Backend harus running** di port 8002 sebelum frontend bisa mengakses
2. **CORS sudah dikonfigurasi** untuk menerima request dari semua origin
3. **Error handling** sudah built-in di AlgebraService
4. **Validasi input** dilakukan melalui Pydantic models
5. **SymPy** digunakan untuk symbolic mathematics

---

## 🔗 Dokumentasi Lengkap

Lihat [API_GUIDE.md](../API_GUIDE.md) untuk:
- Dokumentasi detail semua endpoints
- Contoh request/response
- Implementasi dengan Python, JavaScript, React
- Troubleshooting guide

---

**Status:** ✅ SELESAI - Error 404 sudah diselesaikan!

Sekarang frontend dapat menjalankan algebra solver dengan baik. 🎉
