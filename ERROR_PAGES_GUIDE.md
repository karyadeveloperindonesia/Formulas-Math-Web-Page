# Error Pages Documentation

## Overview
Semua error pages sudah diimplementasikan dengan design linear modern sesuai tema aplikasi (white, black, & blue accent).

## Error Pages yang Tersedia

### 1. **404 - Halaman Tidak Ditemukan**
- **Location**: `/src/pages/NotFoundPage.jsx`
- **Trigger**: Ketika user mengakses route yang tidak ada
- **Static Fallback**: `/public/404.html` (untuk saat SPA tidak bisa load)
- **Emoji**: 🔍

### 2. **500 - Kesalahan Server**
- **Location**: `/src/pages/ServerErrorPage.jsx`
- **Trigger**: Route `/error` atau custom error handling
- **Emoji**: ⚠️

### 3. **502 - Bad Gateway (Layanan Tidak Tersedia)**
- **Location**: `/public/502.html` (static HTML)
- **Trigger**: Configured di Nginx - saat upstream server down
- **Emoji**: 🔧

### 4. **503 - Service Unavailable**
- **Location**: `/public/503.html` (static HTML)
- **Trigger**: Configured di Nginx - saat server maintenance
- **Emoji**: ⏱️

## Components

### ErrorPage.jsx
Component reusable untuk semua error pages dengan props:
```jsx
<ErrorPage
  statusCode={404}           // Status code HTTP
  title="Custom Title"       // Custom judul
  description="Custom desc"  // Custom deskripsi
  showHomeButton={true}      // Tampilkan tombol action
/>
```

### ErrorPage.css
Styling dengan:
- ✅ Linear gradient (black to blue)
- ✅ Floating animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth transitions dan hover effects
- ✅ Bounce animation pada emoji

## Routing

Di `App.jsx` sudah ditambahkan catch-all route:

```jsx
{/* Catch-all route untuk 404 - HARUS DI AKHIR */}
<Route path="*" element={<NotFoundPage />} />
```

**PENTING**: Route ini harus selalu di akhir, sebelum closing `</Routes>`

## Nginx Configuration

Sudah dikonfigurasi di `nginx-updated.conf`:

```nginx
# SPA fallback untuk undefined routes
error_page 404 =200 /index.html;

# Server error fallbacks
error_page 502 /502.html;
error_page 503 /503.html;
```

## Design Features

### Theme
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Accent**: Blue (#2563EB)
- **Background Gradient**: White to light gray

### Animations
1. **Slide Up**: Content masuk dari bawah
2. **Bounce**: Emoji bounce terus-menerus
3. **Float**: Decorative circles bergerak lembut
4. **Scale & Shadow**: Tombol hover effect

### Responsive Breakpoints
- **Desktop**: Full design dengan floating elements
- **Tablet (768px)**: Adjust font size & padding
- **Mobile (480px)**: Optimized untuk layar kecil

## How It Works

### Development
1. User akses `/random-route` → NotFoundPage component render
2. User klik "Kembali ke Beranda" → navigate ke `/`
3. User klik "Kembali" → back() ke halaman sebelumnya

### Production
1. **Valid Routes** (/, /integral, /algebra, dll) → Render normally
2. **Invalid Routes** → Nginx serves `/index.html` dengan status 200
3. **React Router** → Matches `path="*"` dan render NotFoundPage
4. **Server Down (502/503)** → Nginx serves static HTML pages

## Testing Locally

Test error pages:
```bash
# Build
npm run build

# Preview build
npm run preview
```

Akses:
- `http://localhost:5000/some-random-route` → 404 page
- `http://localhost:5000/error` → 500 page

## Deployment

Pastikan sebelum deploy:

1. ✅ Build successful: `npm run build`
2. ✅ `dist/` folder berisi `index.html` dan semua assets
3. ✅ `public/` folder ter-copy dengan `502.html`, `503.html`, `404.html`
4. ✅ Nginx config sudah updated dengan error_page rules
5. ✅ Restart Nginx: `sudo /www/server/nginx/sbin/nginx -s reload`

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive pada semua ukuran layar

## Customization

Untuk customize error page:

**Option 1: Modify NotFoundPage.jsx**
```jsx
<ErrorPage
  statusCode={404}
  title="Halaman Tidak Ditemukan"
  description="Custom pesan Anda"
  showHomeButton={true}
/>
```

**Option 2: Edit ErrorPage.jsx component**
- Tambah custom logo
- Tambah FAQ section
- Ubah button styling
- Tambah animation custom

**Option 3: Edit Static HTML pages**
- Modify `/public/502.html` dan `/public/503.html`
- Ubah emoji, title, description
- Sesuaikan styling

## Notes

- Semua error pages sudah fully responsive
- Design konsisten dengan aplikasi
- Performance optimized (minimal animations, fast load)
- Accessibility friendly (good contrast, readable fonts)
