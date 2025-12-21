# Deployment Guide - Formulas MathLab

## KaTeX Font Rendering Fix

Setelah update Vite config dan MathFormula component, KaTeX fonts sekarang sudah di-bundle dengan benar di `dist/assets/`.

### Changes Made:

1. **vite.config.js** - Added Vite configuration for proper asset bundling:
   - `publicDir: 'public'` - Ensures public folder is copied
   - `build.assetsDir: 'assets'` - All assets go to dist/assets/
   - `optimizeDeps: { include: ['katex', 'react-katex'] }` - Pre-bundles KaTeX dependencies

2. **src/components/MathFormula.jsx** - Removed local CSS import:
   - Removed: `import 'katex/dist/katex.min.css'`
   - Reason: CSS now loaded from CDN via index.html + local fonts bundled in dist/assets/
   - This prevents double-loading and ensures fonts work from bundled assets

3. **index.html** - Already has CDN fallback:
   - KaTeX CSS from CDN: `https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css`
   - This is a fallback in case bundled fonts have issues

### Deployment Steps:

1. **Build locally (already done)**:
   ```bash
   npm run build
   ```
   - Generates `dist/` folder with all assets including KaTeX fonts

2. **Deploy to VPS**:
   ```bash
   # Copy entire dist folder to VPS
   scp -r ./dist user@your-vps:/var/www/formulas_mathlab/
   
   # Or with rsync (faster for updates):
   rsync -av --delete ./dist/ user@your-vps:/var/www/formulas_mathlab/
   ```

3. **Web Server Configuration** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/formulas_mathlab;
       index index.html;
       
       # Cache busting for assets with hashes
       location ~ ^/assets/ {
           expires 365d;
           add_header Cache-Control "public, immutable";
       }
       
       # Serve fonts with proper cache headers
       location ~ \.(woff|woff2|ttf|eot)$ {
           expires 365d;
           add_header Cache-Control "public, immutable";
           add_header Access-Control-Allow-Origin "*";
       }
       
       # SPA routing - fallback to index.html for all non-file requests
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Apache Configuration** (if using Apache):
   ```apache
   <Directory /var/www/formulas_mathlab>
       # Enable mod_rewrite for SPA routing
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </Directory>
   
   # Cache headers for fonts
   <FilesMatch "\.(woff|woff2|ttf|eot)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
       Header set Access-Control-Allow-Origin "*"
   </FilesMatch>
   ```

### Verify Deployment:

After deploying to VPS, check:

1. **Fonts are loaded**:
   - Open browser DevTools → Network tab
   - Look for `KaTeX_*.woff2`, `KaTeX_*.woff`, `KaTeX_*.ttf` files
   - They should have status 200 and come from `/assets/KaTeX_*`

2. **CSS is loaded**:
   - Check `index-*.css` file loads correctly (status 200)
   - View Page Source → Search for `@font-face` to see font declarations

3. **Math formulas render**:
   - Navigate to pages with math (Algebra, Integral calculators)
   - Verify formulas display correctly with proper fonts
   - No broken characters or missing symbols

### Troubleshooting:

**Problem**: Math shows broken characters but CSS loads
- **Solution**: Verify fonts are in dist/assets/ and accessible from VPS
  ```bash
  ls -la /var/www/formulas_mathlab/assets/ | grep -i katex
  ```

**Problem**: 404 on font files
- **Solution**: Check web server MIME types for .woff2, .woff files
  ```bash
  # Add to nginx server block:
  types {
      font/woff2 woff2;
      font/woff woff;
      font/ttf ttf;
  }
  ```

**Problem**: Still getting CDN fallback errors
- **Solution**: Ensure CDN link in index.html is correct:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css" integrity="sha384-wcIxkf4k558AjM3Yz3BBFQhGwQvExZJrp5+3eby3q7F7EKWGuLvIlKf4q20KEVptG" crossorigin="anonymous">
  ```

### File Structure After Build:

```
dist/
├── assets/
│   ├── KaTeX_Main-Regular-*.woff2
│   ├── KaTeX_Main-Regular-*.woff
│   ├── KaTeX_Math-*.woff2
│   ├── KaTeX_Size1-*.woff2
│   ├── KaTeX_Size2-*.woff2
│   ├── KaTeX_Size3-*.woff2
│   ├── KaTeX_Size4-*.woff2
│   ├── KaTeX_AMS-*.woff2
│   ├── [other KaTeX fonts...]
│   ├── index-*.css
│   └── index-*.js
├── index.html
└── vite.svg
```

All font files are now properly bundled and will be served from `/assets/` on your VPS!

## Backend Deployment

Make sure your FastAPI backend is also running on VPS:

```bash
# SSH ke VPS
ssh user@your-vps

# Navigate ke project
cd /var/www/formulas_mathlab/backend

# Install dependencies
pip install -r requirements.txt

# Run backend (with gunicorn for production)
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

Update frontend API URL in `src/services/api.js` to point ke VPS backend:
```javascript
const API_BASE_URL = 'https://your-domain.com/api' // or your backend URL
```

---

**Status**: ✅ KaTeX fonts are now properly bundled and ready for production deployment!
