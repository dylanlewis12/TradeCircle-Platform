// This is a USER INTERACTION - use event handler, NOT useEffect
/*
const handleAddSkill = async (e: React.FormEvent) => {
    
  e.preventDefault();
  
  try {
    setLoading(true);
    setError(null);

    const response = await axios.post(
      'http://localhost:3000/api/skills',
      skillFormData,
      {
        headers: {
          'Authorization': `Bearer ${cookies.accessToken}`
        }
      }
    );

    // Add the new skill to the list
    setSkills(prev => [...prev, response.data.skill]);
    
    // Reset form
    setSkillFormData({
      name: '',
      category: '',
      proficiencyLevel: '',
      description: ''
    });

  } catch(err: any) {
    console.error('Error adding skill:', err);
    setError(err.response?.data?.message || 'Failed to add skill');
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleAddSkill}>
    <input 
      value={skillFormData.name}
      onChange={(e) => setSkillFormData({...skillFormData, name: e.target.value})}
    />
    <button type="submit">Add Skill</button>
  </form>
);
*/
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  handleAddSkill: () => void;
}

export default function AddSkill({ isOpen, onClose, handleAddSkill, children }: ModalProps) {
    if (!isOpen) { //check if button has been clicked
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on backdrop (not content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

    return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="modal__actions">
          <button 
            className="modal__button modal__button--primary"
            onClick={handleLogout}>
            Confirm
          </button>
          <button 
            className="modal__button modal__button--secondary" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}