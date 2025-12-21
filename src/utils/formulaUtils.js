// Convert string to URL-friendly slug
export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Convert slug back to readable text
export const unslugify = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    return true
  }).catch(err => {
    console.error('Failed to copy:', err)
    return false
  })
}

export const shareFormula = (title, url) => {
  if (navigator.share) {
    navigator.share({
      title: `MathLab Formula - ${title}`,
      text: `Lihat formula ${title} di MathLab Formula`,
      url: url || window.location.href,
    }).catch(err => console.error('Share failed:', err))
  } else {
    // Fallback: copy link to clipboard
    copyToClipboard(url || window.location.href)
    alert('Link sudah disalin ke clipboard!')
  }
}

export const getFormulaById = (formulas, id) => {
  return formulas.find(f => f.id === id)
}

export const getFormulaBySlug = (formulas, slug) => {
  return formulas.find(f => slugify(f.title) === slug)
}

export const getFormulasByCategory = (formulas, category) => {
  return formulas.filter(f => f.category.toLowerCase() === category.toLowerCase())
}

export const getCategoryBySlug = (categories, slug) => {
  return categories.find(c => slugify(c.title) === slug)
}

export const searchFormulas = (formulas, searchTerm) => {
  const term = searchTerm.toLowerCase()
  return formulas.filter(f =>
    f.title.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term) ||
    f.formula.toLowerCase().includes(term)
  )
}
