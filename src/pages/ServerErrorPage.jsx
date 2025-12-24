import React from 'react'
import ErrorPage from '../components/ErrorPage'

const ServerErrorPage = () => {
  return (
    <ErrorPage
      statusCode={500}
      title="Kesalahan Server"
      description="Terjadi kesalahan yang tidak terduga di server kami. Tim kami sedang menangani masalah ini."
      showHomeButton={true}
    />
  )
}

export default ServerErrorPage
