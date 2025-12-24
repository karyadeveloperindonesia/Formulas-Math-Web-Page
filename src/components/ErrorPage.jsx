import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ErrorPage.css'

const ErrorPage = ({ statusCode = 404, title, description, showHomeButton = true }) => {
  const navigate = useNavigate()

  // Default messages based on status code
  const errorMessages = {
    404: {
      title: 'Halaman Tidak Ditemukan',
      description: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
      emoji: '🔍'
    },
    500: {
      title: 'Kesalahan Server',
      description: 'Terjadi kesalahan pada server kami. Silakan coba lagi nanti.',
      emoji: '⚠️'
    },
    502: {
      title: 'Layanan Sedang Tidak Tersedia',
      description: 'Server kami sedang diperbarui. Mohon tunggu sebentar.',
      emoji: '🔧'
    },
    503: {
      title: 'Layanan Tidak Tersedia',
      description: 'Server sedang mengalami gangguan teknis. Coba lagi dalam beberapa menit.',
      emoji: '⏱️'
    }
  }

  const config = errorMessages[statusCode] || errorMessages[404]
  const displayTitle = title || config.title
  const displayDescription = description || config.description
  const displayEmoji = config.emoji

  return (
    <div className="error-page-wrapper">
      <div className="error-page-container">
        {/* Decorative elements */}
        <div className="error-decoration error-decoration-1"></div>
        <div className="error-decoration error-decoration-2"></div>

        {/* Content */}
        <div className="error-content">
          {/* Status Code & Emoji */}
          <div className="error-code-section">
            <span className="error-emoji">{displayEmoji}</span>
            <span className="error-code">{statusCode}</span>
          </div>

          {/* Title */}
          <h1 className="error-title">{displayTitle}</h1>

          {/* Description */}
          <p className="error-description">{displayDescription}</p>

          {/* Action Buttons */}
          <div className="error-actions">
            {showHomeButton && (
              <>
                <button
                  className="error-button error-button-primary"
                  onClick={() => navigate('/')}
                >
                  Kembali ke Beranda
                </button>
                <button
                  className="error-button error-button-secondary"
                  onClick={() => window.history.back()}
                >
                  Kembali
                </button>
              </>
            )}
          </div>

          {/* Help text */}
          <p className="error-help-text">
            Butuh bantuan? Hubungi kami di{' '}
            <a href="mailto:support@mathlab.id">support@mathlab.id</a>
          </p>
        </div>

        {/* Floating elements for design */}
        <div className="error-float-1"></div>
        <div className="error-float-2"></div>
        <div className="error-float-3"></div>
      </div>
    </div>
  )
}

export default ErrorPage
