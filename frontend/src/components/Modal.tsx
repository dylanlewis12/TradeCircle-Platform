import type { ReactNode } from "react";
import '../styles/components/Modal.css';

interface ModalButton {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  buttons?: ModalButton[];
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  buttons 
}: ModalProps) {
  
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on backdrop (not content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Default buttons if none provided
  const defaultButtons: ModalButton[] = [
    {
      label: 'Close',
      onClick: onClose,
      variant: 'secondary'
    }
  ];

  const buttonsToRender = buttons || defaultButtons;

  return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal__title">{title}</h2>}
        
        <div className="modal__body">
          {children}
        </div>

        <div className="modal__actions">
          {buttonsToRender.map((button, index) => (
            <button
              key={index}
              className={`modal__button modal__button--${button.variant}`}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}