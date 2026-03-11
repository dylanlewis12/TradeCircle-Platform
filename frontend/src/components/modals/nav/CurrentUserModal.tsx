import Modal from "../../Modal.tsx";
import { useAuth } from "../../../context/authContext/AuthContext.tsx";
import { User } from 'lucide-react';
import { useState, useEffect } from "react";
import axios from "axios";
import '../../../styles/components/modals/CurrentUserModal.css';
import API_BASE_URL from "../../../config/api.ts";
import toast from 'react-hot-toast';  

interface User {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  rating?: number;
  totalTrades?: number;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
    const { user, cookies, setUser } = useAuth();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        bio: '',
        location: '',
        profilePicture: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Initialize form data when modal opens AND user is loaded
    useEffect(() => {
        if (isOpen && user) {
            console.log('User loaded:', user);
            setFormData({
                userName: user.userName || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user, isOpen]);

    async function handleEditUser() {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(
                `${API_BASE_URL}/api/users/${user?.id}`,
                {
                    profilePicture: formData.profilePicture,
                    userName: formData.userName,
                    bio: formData.bio,
                    location: formData.location
                },
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.accessToken}`
                    }
                }
            );

            console.log('✅ User updated:', response.data.user);

            const updatedUser: User = {
                id: response.data.user._id || response.data.user.id,  
                userName: response.data.user.userName,
                email: response.data.user.email,
                bio: response.data.user.bio,
                profilePicture: response.data.user.profilePicture,
                location: response.data.user.location,
                rating: response.data.user.rating,
                totalTrades: response.data.user.totalTrades
            };

            setUser(updatedUser);

            toast.success('Profile updated successfully!');
            onClose();

        } catch (error: any) {
            console.error('Error editing user:', error);
            console.error('Error response:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to update user');
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Edit Account"
                buttons={[
                    {
                        label: loading ? 'Saving...' : 'Save',
                        onClick: handleEditUser,
                        variant: 'primary' as const
                    },
                    {
                        label: 'Cancel',
                        onClick: onClose,
                        variant: 'secondary' as const
                    }
                ]}
            >
                {!user ?
                    (<p>Loading user data...</p>) :
                    (<form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }}>
                        {error && <p style={{ color: 'red', textAlign: 'right' }}>{error}</p>}

                        <div className='user-profile__parent' style={{ marginBottom: '15px' }}>
                            {formData.profilePicture ?
                                (<img src={formData.profilePicture} alt='User Profile Picture' />) :
                                (<User size={40} className="user-profile__picture" />)
                            }
                        </div>

                        <div className='user-modal-input__container'>
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                type="text"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div className='user-modal-input__container' style={{ marginBottom: '12px' }}>
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email"
                                disabled={true}
                                required
                            />
                        </div>

                        <div className='user-modal-text__container'>
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>

                        <div className='user-modal-input__container'>
                            <label htmlFor="location">Location:</label>
                            <input
                                id="location"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Enter your location"
                                required
                            />
                        </div>
                    </form>
                    )}
            </Modal>
        </>
    );
}