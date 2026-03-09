import { useAuth } from "../../../context/authContext/AuthContext.tsx";
import { useState } from "react";
import axios from 'axios';
import Modal from '../../Modal.tsx';
import API_BASE_URL from "../../../config/api.ts";

export function EditUser() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({ userName: '', email: '' });
  const { user, cookies } = useAuth();

  const handleEditUser = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/${user?.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  return (
    <>
      <button onClick={() => setIsEditOpen(true)}>Edit Profile</button>
      
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
        buttons={[
          {
            label: 'Save',
            onClick: handleEditUser,
            variant: 'primary'
          },
          {
            label: 'Cancel',
            onClick: () => setIsEditOpen(false),
            variant: 'secondary'
          }
        ]}
      >
        <form>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}