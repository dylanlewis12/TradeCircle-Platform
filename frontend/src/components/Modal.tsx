import { User } from 'lucide-react';
import '../styles/components/Modal.css';
import { useAuth } from '../context/authContext/AuthContext';

/*
interface ModalProps {
    isOpen: boolean,
    onClose: React.ReactNode,
    children: React.ReactNode,
};
*/

export default function Modal({ isOpen, onClose, children}: any) {
    const { user } = useAuth();

    if(!isOpen) {
        return null; //Hide modal if isOpen is false
    }

    //Optional: Prevent clicks inside the modal content from closing the modal via the backdrop handler
    const handleContentClick = (e: any) => {
        e.stopPropagation();
    };

    return (
    // Backdrop, handles closing the modal when clicked
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Modal content container */}
      <div
        onClick={handleContentClick}
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
          zIndex: 10,
        }}
      >
        {children} {/* Renders the user account form or other content inside */}
      </div>
    </div>
  );
};
