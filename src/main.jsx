import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// KaTeX CSS - base styling
import 'katex/dist/katex.min.css'
// Override KaTeX font paths to use public/fonts directory
import './styles/katex-fonts.css'
import './index.css'
import './styles/mobile-responsive.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
