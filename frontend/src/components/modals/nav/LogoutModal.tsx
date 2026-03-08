import Modal from '../../Modal.tsx';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      buttons={[
        {
          label: 'Confirm',
          onClick: onConfirm,
          variant: 'primary' as const
        },
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary' as const
        }
      ]}
    >
      <br />
      <p>Are you sure you want to logout?</p>
    </Modal>
  );
}