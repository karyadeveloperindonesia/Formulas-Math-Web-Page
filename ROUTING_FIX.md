# 404 Error Fix - Client-Side Routing Configuration

## Problem
Mengakses URL langsung seperti `https://formula.mathlab.id/integral` menghasilkan 404 error, tetapi mengklik dari landing page berfungsi dengan baik.

## Root Cause
Ini adalah masalah umum pada SPA (Single Page Application). Server mencari file fisik `/integral` yang tidak ada. Ketika diklik dari halaman, React Router menangani routing di sisi client-side, bukan server-side.

## Solution

### 1. Development (Vite Dev Server) ✓ DONE
File `vite.config.js` telah diperbarui dengan:
```javascript
server: {
  historyApiFallback: true
}
```

### 2. Production Deployment

Pilih salah satu konfigurasi di bawah tergantung server Anda:

#### **Option A: Nginx** (Most Common)
Gunakan `nginx.conf` yang telah dibuat. Konfigurasi kunci:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Ini memastikan semua route yang tidak ditemukan dialihkan ke `index.html`.

**Langkah implementasi:**
1. Copy `nginx.conf` ke konfigurasi Nginx server Anda
2. Restart Nginx: `sudo systemctl restart nginx`

#### **Option B: Apache** 
Gunakan `.htaccess` yang telah dibuat. Ensure mod_rewrite diaktifkan:
```bash
sudo a2enmod rewrite
```
Kemudian restart Apache:
```bash
sudo systemctl restart apache2
```

#### **Option C: Node.js Express Server**
Gunakan `server.js` yang telah dibuat:
```bash
npm install express
node server.js
```

### 3. Verifikasi
Setelah implementasi, test:
- ✓ Akses `https://formula.mathlab.id` (landing page)
- ✓ Akses `https://formula.mathlab.id/integral` langsung (harus bekerja sekarang)
- ✓ Akses `https://formula.mathlab.id/algebra` langsung (harus bekerja sekarang)

### 4. Build Production
```bash
npm run build
```
Output akan di folder `dist/`. Upload folder ini ke server Anda.

## Files Modified/Created
- ✓ `vite.config.js` - Updated dengan server configuration
- ✓ `nginx.conf` - Created untuk Nginx configuration
- ✓ `.htaccess` - Created untuk Apache configuration  
- ✓ `server.js` - Created untuk Express server option
- ✓ `ROUTING_FIX.md` - This documentation file
