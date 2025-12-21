import './Modal.css'

export const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </>
  )
}
