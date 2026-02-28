import '../styles/components/Modal.css';

export default function Modal({ isOpen, onClose, children}: any) {
  if (!isOpen) {  //Only render if isOpen is true
    return null;
  }

  /*
  function handleChange() {

  }
  */

  return(
    <div className='modal-overlay'>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        {children}
        <button>Edit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
