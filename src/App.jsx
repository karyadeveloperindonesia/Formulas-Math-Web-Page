import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages'
import { CategoryPageContainer } from './pages/CategoryPageContainer'
import { FormulaDetailPageContainer } from './pages/FormulaDetailPageContainer'
import IntegralDetailPage from './pages/IntegralDetailPage'
import AlgebraDetailPage from './pages/AlgebraDetailPage'
import DebugVisualization from './pages/DebugVisualization'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/integral" element={<IntegralDetailPage />} />
        <Route path="/algebra" element={<AlgebraDetailPage />} />
        <Route path="/debug" element={<DebugVisualization />} />
        <Route path="/:category" element={<CategoryPageContainer />} />
        <Route path="/:category/:formula" element={<FormulaDetailPageContainer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
