import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

export const Header = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFormulaMenuOpen, setIsFormulaMenuOpen] = useState(false)
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(false)
  const [language, setLanguage] = useState('ID')
  const formulaMenuRef = useRef(null)
  const examMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside handler untuk dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formulaMenuRef.current && !formulaMenuRef.current.contains(event.target)) {
        setIsFormulaMenuOpen(false)
      }
      if (examMenuRef.current && !examMenuRef.current.contains(event.target)) {
        setIsExamMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const mobileFormulaItems = [
    { name: 'Integral', symbol: '∫', path: '/integral' },
    { name: 'Aljabar', symbol: 'x²', path: '/algebra' },
    { name: 'Kalkulus', symbol: 'd/dx', path: '/calculus' },
    { name: 'Trigonometri', symbol: 'sin θ', path: '/trigonometry' },
  ]

  const mobileExamLevels = [
    { name: 'SD', path: '/' },
    { name: 'SMP', path: '/' },
    { name: 'SMA', path: '/' },
    { name: 'SMK', path: '/' },
  ]

  return (
    <nav
      className={`navbar transition-all duration-300 ${
        isScrolled ? 'navbar-scrolled' : ''
      }`}
    >
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">∑</div>
            <span className="navbar-logo-text">MathLab.id</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {/* Formula Dropdown */}
            <div className="navbar-dropdown" ref={formulaMenuRef}>
              <button
                onMouseEnter={() => {
                  setIsFormulaMenuOpen(true)
                  setIsExamMenuOpen(false)
                }}
                onClick={() => setIsFormulaMenuOpen(!isFormulaMenuOpen)}
                className="navbar-dropdown-button"
              >
                Formula
                <ChevronDown
                  size={16}
                  className={`dropdown-chevron ${
                    isFormulaMenuOpen ? 'chevron-open' : ''
                  }`}
                />
              </button>

              {isFormulaMenuOpen && (
                <div className="navbar-dropdown-menu">
                  <button
                    onClick={() => {
                      navigate('/integral')
                      setIsFormulaMenuOpen(false)
                    }}
                    className="dropdown-item"
                  >
                    <span className="item-icon">∫</span>
                    Integral
                  </button>
                  <button
                    onClick={() => {
                      navigate('/')
                      setIsFormulaMenuOpen(false)
                    }}
                    className="dropdown-item"
                  >
                    <span className="item-icon">x²</span>
                    Aljabar
                  </button>
                  <button
                    onClick={() => {
                      navigate('/')
                      setIsFormulaMenuOpen(false)
                    }}
                    className="dropdown-item"
                  >
                    <span className="item-icon">d/dx</span>
                    Kalkulus
                  </button>
                  <button
                    onClick={() => {
                      navigate('/')
                      setIsFormulaMenuOpen(false)
                    }}
                    className="dropdown-item"
                  >
                    <span className="item-icon">sin θ</span>
                    Trigonometri
                  </button>
                </div>
              )}
            </div>

            {/* Exam Dropdown */}
            <div className="navbar-dropdown" ref={examMenuRef}>
              <button
                onMouseEnter={() => {
                  setIsExamMenuOpen(true)
                  setIsFormulaMenuOpen(false)
                }}
                onClick={() => setIsExamMenuOpen(!isExamMenuOpen)}
                className="navbar-dropdown-button"
              >
                Ujian
                <ChevronDown
                  size={16}
                  className={`dropdown-chevron ${
                    isExamMenuOpen ? 'chevron-open' : ''
                  }`}
                />
              </button>

              {isExamMenuOpen && (
                <div className="navbar-dropdown-menu">
                  {mobileExamLevels.map((level) => (
                    <button
                      key={level.name}
                      onClick={() => {
                        navigate(level.path)
                        setIsExamMenuOpen(false)
                      }}
                      className="dropdown-item"
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="navbar-link"
            >
              Kontribusi
              <span className="underline-accent"></span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="navbar-link"
            >
              Unduh Aplikasi
              <span className="underline-accent"></span>
            </button>
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            <div className="language-toggle">
              <button
                className={`lang-btn ${language === 'ID' ? 'active' : ''}`}
                onClick={() => setLanguage('ID')}
              >
                ID
              </button>
              <button
                className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-mobile-button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-content">
              {/* Formula Section */}
              <div className="mobile-menu-section">
                <p className="mobile-section-title">Formula</p>
                <div className="mobile-grid">
                  {mobileFormulaItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path)
                        setIsMobileMenuOpen(false)
                      }}
                      className="mobile-grid-item"
                    >
                      <span className="grid-item-icon">{item.symbol}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    navigate('/integral')
                    setIsMobileMenuOpen(false)
                  }}
                  className="mobile-show-more"
                >
                  Lihat Semua Formula
                </button>
              </div>

              <div className="mobile-divider"></div>

              {/* Exam Section */}
              <div className="mobile-menu-section">
                <p className="mobile-section-title">Ujian</p>
                <div className="mobile-grid mobile-grid-5">
                  {mobileExamLevels.map((level) => (
                    <button
                      key={level.name}
                      onClick={() => {
                        navigate(level.path)
                        setIsMobileMenuOpen(false)
                      }}
                      className="mobile-grid-item"
                    >
                      <span className="grid-item-text">{level.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mobile-divider"></div>

              <button
                onClick={() => {
                  navigate('/')
                  setIsMobileMenuOpen(false)
                }}
                className="navbar-mobile-link"
              >
                Kontribusi
              </button>
              <button
                onClick={() => {
                  navigate('/')
                  setIsMobileMenuOpen(false)
                }}
                className="navbar-mobile-link"
              >
                Unduh Aplikasi
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
