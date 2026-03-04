import { useAuth } from '../context/authContext/AuthContext.js';
import axios from 'axios';
import {
  Cpu,
  Languages,
  Hammer,
  Wrench,
  BookOpen,
  Palette,
  Stethoscope,
  Users,
  Briefcase,
  MessageSquare,
  Zap,
  MoreHorizontal,
  type LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import '../styles/components/DashboardSkillCard.css';
import Modal from '../components/Modal.tsx';

interface Skill {
  _id: string;
  name: string;
  category: 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';
  proficiencyLevel: string;
  description: string;
  userId: string;
}

interface SkillCardProps {
  skills: Skill[];
  onSkillDeleted: (skillId: string) => void;
  onSkillEdited: (skill: Skill) => void;
}

type SkillCategory = 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';

const skillCategoryIcons: Record<SkillCategory, LucideIcon> = {
  technology: Cpu,
  linguistic: Languages,
  crafts: Hammer,
  services: Wrench,
  academic: BookOpen,
  creative: Palette,
  medical: Stethoscope,
  leadership: Users,
  business: Briefcase,
  communication: MessageSquare,
  trades: Zap,
  other: MoreHorizontal
};

type EditFormData = {
  name: string;
  category: SkillCategory;
  proficiencyLevel: string;
  description: string;
};

export default function SkillCard({ skills, onSkillEdited, onSkillDeleted }: SkillCardProps) {
  const { cookies } = useAuth();
  
  const [editFormData, setEditFormData] = useState<EditFormData>({
  name: '',
  category: 'other', // valid default in the SkillCategory union
  proficiencyLevel: '',
  description: ''
});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenEditModal = (skill: Skill) => {
    setSkillToEdit(skill);
    setEditFormData({
      name: skill.name,
      category: skill.category,
      proficiencyLevel: skill.proficiencyLevel,
      description: skill.description
    });
    setIsEditModalOpen(true);
  };

  async function handleDeleteSkill() {
    if(!skillToDelete) {
        return;
      }
    try {
      await axios.delete(
          `http://localhost:3000/api/skills/${skillToDelete}`,
          {
            headers: {
              'Authorization': `Bearer ${cookies.accessToken}`
            }
          }
      );

      onSkillDeleted(skillToDelete);
      setIsDeleteModalOpen(false)
      setSkillToDelete(null);
    } catch(error) {
      console.error('Error deleting skill:', error);
    }
  }

  async function handleEditSkill() {
    if(!skillToEdit?._id) return;

    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:3000/api/skills/${skillToEdit._id}`,
        editFormData,  // ✅ Include form data
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      // Update with full skill object
      onSkillEdited({
        ...skillToEdit,
        ...editFormData
      });
      setIsEditModalOpen(false);
      setSkillToEdit(null);
      setEditFormData({ name: '', category: 'other', proficiencyLevel: '', description: '' });
    } catch(error: any) {
      console.error('Error editing skill:', error);
      setError(error.response?.data?.message || 'Failed to update skill');
    } finally {
      setLoading(false);
    }
  }

  if (skills.length === 0) {
    console.log(skills);
    return (
      <div className='skills__empty' >
        <p>No skills found. Create your first skill!</p>
      </div>
      );
  }

  //Add functionality to control card sizes and manage description/name length
  return (
    <>
      <div className="skill-card__grid">
        {skills.map((skill) => {
          const IconComponent = skillCategoryIcons[skill.category as SkillCategory];
          
          return (
            <div key={skill._id} className="skill-card">
              <div className="skill-card__icon">
                {IconComponent ? <IconComponent size={48} /> : <MoreHorizontal size={48} />}
              </div>
              <div className="skill-card__name">{skill.name}</div>
              <div className="skill-card__level skill-card__level--expert">
                {skill.proficiencyLevel}
              </div>
              <div className="skill-card__info">{skill.description}</div>
              <div className="skill-card__actions">
                <button
                  onClick={() => {
                    handleOpenEditModal(skill);
                  }}
                  className="btn btn--primary"
                  >Edit</button>
                <button 
                  onClick={() => {
                    setSkillToDelete(skill._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="btn btn--secondary"
                >Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Skill'
        buttons={[
          {
            label: 'Confirm',
            onClick: handleDeleteSkill,
            variant: 'primary' as const
          },
          {
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            variant: 'secondary' as const
          }
        ]}
      
      >
        <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Skill'
        buttons={[
          {
            label: loading ? 'Saving...' : 'Save',
            onClick: handleEditSkill,
            variant: 'primary' as const
          },
          {
            label: 'Cancel',
            onClick: () => setIsEditModalOpen(false),
            variant: 'secondary' as const
          }
        ]}
      
      >
        <form onSubmit={(e) => { e.preventDefault(); handleEditSkill(); }}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div className='skill-name-container' style={{ marginBottom: '15px' }}>
            <label>Skill Name:</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              placeholder="e.g., Web Development"
              required
            />
          </div>

          <div className='skill-category-container' style={{ marginBottom: '15px' }}>
            <label>Category:</label>
            <select
              value={editFormData.category}
              onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as SkillCategory })}
              required
            >
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
              value={editFormData.proficiencyLevel}
              onChange={(e) => setEditFormData({ ...editFormData, proficiencyLevel: e.target.value })}
              required
            >
              <option value="">Select Proficiency Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className='skill-description-container' style={{ marginBottom: '15px' }}>
            <label>Description:</label>
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              placeholder="Brief description of the skill"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

