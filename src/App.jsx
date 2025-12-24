import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages'
import { CategoryPageContainer } from './pages/CategoryPageContainer'
import { FormulaDetailPageContainer } from './pages/FormulaDetailPageContainer'
import IntegralDetailPage from './pages/IntegralDetailPage'
import AlgebraDetailPage from './pages/AlgebraDetailPage'
import DebugVisualization from './pages/DebugVisualization'
import NotFoundPage from './pages/NotFoundPage'
import ServerErrorPage from './pages/ServerErrorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/integral" element={<IntegralDetailPage />} />
        <Route path="/algebra" element={<AlgebraDetailPage />} />
        <Route path="/debug" element={<DebugVisualization />} />
        <Route path="/error" element={<ServerErrorPage />} />
        {/* Specific category/formula routes - MUST COME AFTER specific paths */}
        <Route path="/:category" element={<CategoryPageContainer />} />
        <Route path="/:category/:formula" element={<FormulaDetailPageContainer />} />
        {/* Catch-all route for 404 - MUST BE LAST */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
