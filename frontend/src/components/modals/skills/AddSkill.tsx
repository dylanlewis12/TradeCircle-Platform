import { useAuth } from "../../../context/authContext/AuthContext.tsx";
import { useState } from "react";
import axios from 'axios';
import Modal from "../../Modal.tsx";
import '../../../styles/components/modals/AddSkill.css';
import toast from "react-hot-toast";
import API_BASE_URL from "../../../config/api.ts";

interface Skill {
  _id: string;
  name: string;
  category: 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';
  proficiencyLevel: string;
  yearsOfExperience: number;
  status: string;
  hoursAvailable: number;
  description: string;
  userId: string;
}

interface AddSkillProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded?: (skill: any) => void;
  skills: Skill[]; 
}

export default function AddSkill({ isOpen, onClose, onSkillAdded, skills }: AddSkillProps) {
  const [formData, setFormData] = useState({ 
    name: '',
    category: 'other', // valid default in the SkillCategory union
    proficiencyLevel: '',
    yearsOfExperience: 0,
    status: 'active',
    hoursAvailable: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cookies } = useAuth();


  function validateExistingSkill() {  //Check if skill name already exists for current user
    const isValuePresent = skills.some(skill => skill['name'] === formData.name);
    return isValuePresent;
  }

  const handleAddSkill = async () => {
    // Validate form
    if (!formData.name || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

  
    if (validateExistingSkill()) {
      setError('You already have this skill. Enter another skill');
      toast.error('You already have this skill. Enter another skill');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_BASE_URL}/api/skills`,
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

      console.log(response.data)

      onClose();
      toast.success('Skill added successfully');
      setFormData({ name: '', category: 'other', proficiencyLevel: '', yearsOfExperience: 0, status: 'active', hoursAvailable: 0, description: '' });
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

        <div className='skill-experience-container' style={{ marginBottom: '15px' }}>
            <label>Years of Experience:</label>
            <select
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
              required
            >
              <option value="">Select experience level</option>
              <option value="0">Less than 1 year</option>
              <option value="1">1-2 years</option>
              <option value="2">2-5 years</option>
              <option value="5">5-10 years</option>
              <option value="10">10+ years</option>
            </select>
        </div>

        <div className='skill-status-container' style={{ marginBottom: '15px' }}>
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="">Select skill status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
        </div>

        <div className='skill-available-container' style={{ marginBottom: '15px' }}>
            <label>Hours Available:</label>
            <select
              value={formData.hoursAvailable}
              onChange={(e) => setFormData({ ...formData, hoursAvailable: parseInt(e.target.value) })}
              required
            >
              <option value="">Select availability</option>
              <option value="1">1 hour per week</option>
              <option value="2">2 hours per week</option>
              <option value="5">5 hours per week</option>
              <option value="10">10 hours per week</option>
              <option value="20">20 hours per week</option>
              <option value="40">40+ hours per week (Full-time)</option>
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