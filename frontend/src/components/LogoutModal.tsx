import type { ReactNode } from "react";
import '../styles/components/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  handleLogout: () => void;
}

export default function LogoutModal({ isOpen, handleLogout, onClose, children }: ModalProps) {
  
  if (!isOpen) { //check if button has been clicked
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on backdrop (not content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="modal__actions">
          <button 
            className="modal__button modal__button--primary"
            onClick={handleLogout}>
            Confirm
          </button>
          <button 
            className="modal__button modal__button--secondary" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}