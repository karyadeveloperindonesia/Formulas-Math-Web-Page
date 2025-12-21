import { InlineMath, BlockMath } from 'react-katex'
import './MathFormula.css'
// KaTeX CSS is loaded from CDN in index.html

export const MathFormula = ({ formula, inline = false, className = '' }) => {
  if (!formula) return null

  try {
    if (inline) {
      return (
        <span className={`math-formula inline ${className}`}>
          <InlineMath math={formula} />
        </span>
      )
    }
    return (
      <div className={`math-formula block ${className}`}>
        <BlockMath math={formula} />
      </div>
    )
  } catch (error) {
    // Fallback jika KaTeX gagal parse
    return <span className={`math-formula fallback ${className}`}>{formula}</span>
  }
}

// Convenience exports
export const InlineFormula = ({ formula, className = '' }) => (
  <MathFormula formula={formula} inline={true} className={className} />
)

export const BlockFormula = ({ formula, className = '' }) => (
  <MathFormula formula={formula} inline={false} className={className} />
)
