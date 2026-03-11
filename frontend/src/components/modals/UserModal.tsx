import Modal from "../Modal.tsx";
import { useAuth } from "../../context/authContext/AuthContext.tsx";
import { User } from 'lucide-react';
import { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/components/modals/UserModal.css';
import API_BASE_URL from "../../config/api.ts";

interface UserProfile {
  id: string;
  userName: string;
  profilePicture?: string;
  bio?: string | null;
  location?: string | null;
  rating: number;
  totalTrades: number;
  createdAt: Date;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;  
}

export default function UserModal({ isOpen, onClose, userId }: UserModalProps) {
  const { cookies } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
    }
  }, [isOpen, userId]);

  async function fetchUser() {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      setUser(response.data.user);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user?.userName || "User Profile"}
      buttons={[
        {
          label: 'Close',
          onClick: onClose,
          variant: 'secondary' as const
        }
      ]}
    >
      {loading ? (
        <p>Loading user profile...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : user ? (
        <div className='user-profile-view'>
          <div className='user-profile__header' style={{ marginBottom: '15px' }}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt='User Profile' />
            ) : (
              <User size={60} className="user-profile__picture" />
            )}
          </div>

          <div className='user-profile__info'>
            <p><strong>Username:</strong> {user.userName}</p>
            <p><strong>Location:</strong> {user.location || 'Not specified'}</p>
            <p><strong>Rating:</strong> ⭐ {user.rating.toFixed(1)}</p>
            <p><strong>Total Trades:</strong> {user.totalTrades}</p>
            {user.bio && (
              <div>
                <strong>Bio:</strong>
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}