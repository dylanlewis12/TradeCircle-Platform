import { useAuth } from "../../context/authContext/AuthContext";
import { useState } from "react";
import axios from 'axios';
import Modal from "../Modal.tsx";
import '../../styles/components/modals/AddSkill.css';

interface AddSkillProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded?: (skill: any) => void;
}

export default function AddSkill({ isOpen, onClose, onSkillAdded }: AddSkillProps) {
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '',
    proficiencyLevel: '',
    description: '',
    listingType: 'offering' //make listing type offering automatically for user's added skills
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cookies } = useAuth();



  const handleAddSkill = async () => {
    // Validate form
    if (!formData.name || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:3000/api/skills',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      // Notify parent component of new skill
      if (onSkillAdded) {
        onSkillAdded(response.data.skill);
      }

      onClose();
      setFormData({ name: '', category: '', proficiencyLevel: '', description: '', listingType: 'offering'});
    } catch (err: any) {
      console.error('Error adding skill:', err);
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Skill"
      buttons={[
        {
          label: loading ? 'Adding...' : 'Add',
          onClick: handleAddSkill,
          variant: 'primary' as const
        },
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary' as const
        }
      ]}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleAddSkill(); }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div className='skill-name-container' style={{ marginBottom: '15px' }}>
          <label>Skill Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Web Development"
            required
          />
        </div>

        <div className='skill-category-container' style={{ marginBottom: '15px' }}>
          <label>Category:</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="linguistic">Linguistic</option>
            <option value="crafts">Crafts</option>
            <option value="services">Services</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
            <option value="medical">Medical</option>
            <option value="leadership">Leadership</option>
            <option value="business">Business</option>
            <option value="communication">Communication</option>
            <option value="trades">Trades</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className='skill-proficiency-container' style={{ marginBottom: '15px' }}>
          <label>Proficiency Level:</label>
          <select
            value={formData.proficiencyLevel}
            onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className='skill-description-container' style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your skill..."
            rows={4}
          />
        </div>
      </form>
    </Modal>
  );
}