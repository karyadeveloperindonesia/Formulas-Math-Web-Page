import './CategoryCard.css'

export const CategoryCard = ({ icon, title, description, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">{icon}</div>
      <h4 className="category-title">{title}</h4>
      <p className="category-description">{description}</p>
    </div>
  )
}
