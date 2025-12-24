import React from 'react'
import ErrorPage from '../components/ErrorPage'

const NotFoundPage = () => {
  return (
    <ErrorPage
      statusCode={404}
      title="Halaman Tidak Ditemukan"
      description="Maaf, halaman yang Anda cari tidak ada. Coba gunakan menu navigasi atau kembali ke beranda."
      showHomeButton={true}
    />
  )
}

export default NotFoundPage
