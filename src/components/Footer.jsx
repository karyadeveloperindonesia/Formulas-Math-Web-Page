import './Footer.css'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>MathLab Formula</h4>
          <p>Platform belajar rumus matematika gratis untuk semua jenjang pendidikan.</p>
        </div>
        
        <div className="footer-section">
          <h5>Kategori</h5>
          <ul>
            <li><a href="#integral">Integral</a></li>
            <li><a href="#aljabar">Aljabar</a></li>
            <li><a href="#kalkulus">Kalkulus</a></li>
            <li><a href="#trigonometri">Trigonometri</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Perusahaan</h5>
          <ul>
            <li><a href="#tentang">Tentang Kami</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#karir">Karir</a></li>
            <li><a href="#kontak">Kontak</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Legal</h5>
          <ul>
            <li><a href="#privacy">Kebijakan Privasi</a></li>
            <li><a href="#terms">Syarat & Ketentuan</a></li>
            <li><a href="#license">Lisensi</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-divider"></div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 MathLab Formula. Semua hak dilindungi.</p>
        <div className="footer-socials">
          <a href="#twitter" className="social-link">Twitter</a>
          <a href="#github" className="social-link">GitHub</a>
          <a href="#linkedin" className="social-link">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
