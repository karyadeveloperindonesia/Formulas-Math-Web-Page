# Deployment Checklist - Error Pages & Routing Fix

## ✅ Selesai di Local

### 1. Build Production
```bash
npm run build
```
Output: `dist/` folder siap deploy

### 2. Files yang Diubah/Ditambah

**React Components (SPA Error Pages):**
- ✅ `src/components/ErrorPage.jsx` - Reusable error component
- ✅ `src/components/ErrorPage.css` - Modern styling
- ✅ `src/pages/NotFoundPage.jsx` - 404 page
- ✅ `src/pages/ServerErrorPage.jsx` - 500 page

**Static Error Pages (Nginx Fallback):**
- ✅ `public/404.html` - 404 static page
- ✅ `public/502.html` - 502 static page
- ✅ `public/503.html` - 503 static page

**Configuration:**
- ✅ `vite.config.js` - Updated dengan server config
- ✅ `src/App.jsx` - Added error page routes & catch-all route
- ✅ `src/main.jsx` - Cleaned up, uses CDN KaTeX
- ✅ `nginx-updated.conf` - Ready untuk production

**Documentation:**
- ✅ `ERROR_PAGES_GUIDE.md` - Complete error pages guide
- ✅ `ROUTING_FIX.md` - SPA routing fix documentation

---

## 🚀 Next Steps untuk Production

### Step 1: Upload Files ke Server
```bash
# Copy dist folder ke server
# Destination: /www/wwwroot/formula-api.mathlab.id/

# Pastikan folder struktur:
/www/wwwroot/formula-api.mathlab.id/
├── index.html
├── assets/
│   ├── [semua JS, CSS, fonts]
│   └── ...
└── 404.html, 502.html, 503.html (jika ada di public)
```

### Step 2: Update Nginx Configuration
Copy konfigurasi dari `nginx-updated.conf` ke:
```
/www/server/nginx/conf/nginx.conf
# atau file vhost specific Anda
```

**Key parts to copy:**
```nginx
# 1. Error page configuration
error_page 404 =200 /index.html;
error_page 502 /502.html;
error_page 503 /503.html;

# 2. Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# 3. Don't cache index.html
location = /index.html {
    expires -1;
    add_header Cache-Control "public, must-revalidate, proxy-revalidate";
}
```

### Step 3: Verify Nginx Configuration
```bash
sudo /www/server/nginx/sbin/nginx -t
```

Expected output:
```
nginx: the configuration file /www/server/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /www/server/nginx/conf/nginx.conf test passed
```

### Step 4: Restart Nginx
```bash
sudo /www/server/nginx/sbin/nginx -s reload
# atau
sudo systemctl restart nginx
```

### Step 5: Test URLs
Test di production:

✅ **Valid Routes** (harus berfungsi normal):
- `https://formula-api.mathlab.id/` → Landing page
- `https://formula-api.mathlab.id/integral` → Integral page
- `https://formula-api.mathlab.id/algebra` → Algebra page

✅ **404 Routes** (harus ke NotFoundPage):
- `https://formula-api.mathlab.id/random-page` → 404 error page
- `https://formula-api.mathlab.id/invalid-route` → 404 error page

✅ **Check Error Page Design**:
- Open DevTools → Check responsive design
- Verify animations work (bounce, float)
- Click buttons → Navigation works

---

## 🎨 Error Page Features

### Responsive Design ✓
- Desktop (1024px+) - Full design dengan animations
- Tablet (768px-1023px) - Adjusted sizing
- Mobile (< 768px) - Optimized layout

### Theme ✓
- **Color Scheme**: White, Black, Blue (#2563EB)
- **Font**: Inter, Segoe UI
- **Style**: Linear, modern, minimal

### Animations ✓
- 🎯 Slide up on load
- 🎯 Bounce emoji
- 🎯 Float decorative circles
- 🎯 Smooth button hover

### Interactive ✓
- Click "Kembali ke Beranda" → Home page
- Click "Kembali" → Previous page
- Click contact email link → Open mail

---

## 📋 Troubleshooting

### Jika masih 404 di production:

1. **Check folder structure**
```bash
ls -la /www/wwwroot/formula-api.mathlab.id/
# Harus ada: index.html, assets/, 404.html, 502.html, 503.html
```

2. **Check Nginx logs**
```bash
tail -f /www/wwwlogs/formula-api.mathlab.id.error.log
```

3. **Clear browser cache**
- Ctrl+Shift+Delete (Chrome/Firefox)
- Cmd+Shift+Delete (Safari)

4. **Test Nginx config**
```bash
sudo /www/server/nginx/sbin/nginx -t
# Should pass without error
```

### Jika font KaTeX masih tidak render:

1. **Check dist folder**
```bash
ls -la /www/wwwroot/formula-api.mathlab.id/assets/ | grep KaTeX
# Should have: KaTeX_*.woff2, KaTeX_*.woff, KaTeX_*.ttf
```

2. **Check CSS is loaded**
- Open DevTools → Network tab
- Check if katex-vendor CSS loaded (28KB)

3. **Hard refresh browser**
- Ctrl+F5 or Cmd+Shift+R

---

## ✨ Done!

Semua sudah siap:
- ✅ Error pages dengan design modern
- ✅ SPA routing fixed (client-side routing)
- ✅ KaTeX fonts bundled correctly
- ✅ Nginx configuration updated
- ✅ Static error pages sebagai fallback

Tinggal deploy ke server dan restart Nginx! 🚀
