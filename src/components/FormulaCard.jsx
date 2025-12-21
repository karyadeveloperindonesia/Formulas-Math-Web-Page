import './FormulaCard.css'
import { BlockFormula } from './MathFormula'

export const FormulaCard = ({ title, formula, category, difficulty, onClick }) => {
  const difficultyColor = {
    mudah: '#10B981',
    sedang: '#F59E0B',
    sulit: '#EF4444',
  }

  return (
    <div className="formula-card" onClick={onClick}>
      <div className="formula-header">
        <span className="formula-category">{category}</span>
        <span
          className="formula-difficulty"
          style={{ backgroundColor: difficultyColor[difficulty] || '#999' }}
        >
          {difficulty}
        </span>
      </div>
      <h4 className="formula-title">{title}</h4>
      <div className="formula-box">
        <BlockFormula formula={formula} />
      </div>
    </div>
  )
}
