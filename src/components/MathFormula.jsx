import { useEffect, useRef } from 'react'
import katex from 'katex'
import './MathFormula.css'

// KaTeX render options - strict disabled to prevent warnings
const katexOptions = {
  throwOnError: false,
  strict: false,
  trust: true,
  output: 'html'
}

export const MathFormula = ({ formula, inline = false, className = '' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        katex.render(formula, containerRef.current, {
          ...katexOptions,
          displayMode: !inline
        })
      } catch (error) {
        // Fallback: show raw formula
        containerRef.current.textContent = formula
        containerRef.current.classList.add('math-error')
      }
    }
  }, [formula, inline])

  if (!formula) return null

  if (inline) {
    return <span ref={containerRef} className={`math-formula inline ${className}`} />
  }
  return <div ref={containerRef} className={`math-formula block ${className}`} />
}

// Convenience exports
export const InlineFormula = ({ formula, className = '' }) => (
  <MathFormula formula={formula} inline={true} className={className} />
)

export const BlockFormula = ({ formula, className = '' }) => (
  <MathFormula formula={formula} inline={false} className={className} />
)
