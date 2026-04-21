import { useNavigate } from 'react-router-dom';
import { useChat } from './store/useChat.tsx';
import { ArrowLeft } from 'lucide-react';
import '../../styles/components/chat/ChatHeader.css';
import Modal from '../Modal.tsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/authContext/AuthContext.tsx';
import API_BASE_URL from '../../config/api.ts';

interface ChatHeaderProps {
  skillName?: string;
}

interface TradeFormData {
  initiatorSkillId: string;
  receiverSkillId: string;
  timeframe: string;
  notes: string;
}

export default function ChatHeader({ skillName }: ChatHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, cookies } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TradeFormData>({
    initiatorSkillId: '',
    receiverSkillId: '',
    timeframe: 'flexible',
    notes: ''
  });
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [otherUserSkills, setOtherUserSkills] = useState<any[]>([]);

  const navigate = useNavigate();
  const { selectedUser } = useChat();

  if (!selectedUser) {
    return null;
  }

  const handleBack = () => {
    navigate('/messages');
  };

  // Load skills when modal opens
  const handleOpenModal = async () => {
    try {
      // Get current user's skills
      const userSkillsRes = await axios.get(
        `${API_BASE_URL}/api/skills/user/${user?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      // Get other user's skills
      const otherSkillsRes = await axios.get(
        `${API_BASE_URL}/api/skills/user/${selectedUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      setUserSkills(userSkillsRes.data.skills || []);
      console.log('Current users skills' + userSkillsRes.data.skills);
      console.log('Other users skills' + otherSkillsRes.data.skills);
      console.log(userSkills);
      setOtherUserSkills(otherSkillsRes.data.skills || []);
      setIsModalOpen(true);
      setError(null);
    } catch (err: any) {
      console.error('Error loading skills:', err);
      toast.error('Failed to load skills');
    }
  };

  async function handleCreateTrade() {
    try {
      if (!formData.initiatorSkillId || !formData.receiverSkillId) {
        setError('Please select both skills');
        return;
      }

      setIsLoading(true);

      const tradeData = {
        receiverId: selectedUser!._id,
        skillOfferingId: formData.initiatorSkillId, 
        skillExchange: formData.receiverSkillId, 
        transactionType: 'exchange',
        timeframe: formData.timeframe,
        notes: formData.notes,  
        hoursRequested: 0
      };

      console.log('Creating trade with:', tradeData);

      const response = await axios.post(
        `${API_BASE_URL}/api/trades`,
        tradeData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      console.log('Trade created:', response.data);
      toast.success('Trade proposal create sucessfully!');
      setIsModalOpen(false);

      setFormData({
        initiatorSkillId: '',
        receiverSkillId: '',
        timeframe: 'flexible',
        notes: ''
      });
    } catch (error: any) {
      console.error('Error creating trade:', error.response?.data || error.message);
      //setError(error.response?.data?.message || 'Failed to create trade.');
      toast.error('Failed to create trade. Try again!');
    } finally {
      setIsLoading(false);
    }
  }

  
  return (
      <header className="chat-header">
        <div className="chat-header__left">
          <button 
            className="chat-header__back-btn"
            onClick={handleBack}
            title="Back to conversations"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="chat-header__user">
            <div className="chat-header__avatar">
              {/* profilePicture upload needs to be fixed

              {selectedUser.profilePicture ? (
                <img 
                  src={selectedUser.profilePicture || 'logo.svg'} 
                  alt={selectedUser.userName}
                />
              ) : (
                <div className="chat-header__avatar-initial">
                  {selectedUser.userName.charAt(0).toUpperCase()}
                </div>
              )}
              */}
            </div>

            <div className="chat-header__info">
              <h2 className="chat-header__name">{selectedUser.userName}</h2>
              {skillName && (
                <p className="chat-header__skill">
                  Discussing: <strong>{skillName}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="chat-header__right">
          <button 
            className="chat-header__trade-btn"
            onClick={handleOpenModal}
            title="Create a trade proposal"
          >
            Create Trade
          </button>
        </div>

        {
        <Modal 
             isOpen={isModalOpen}
             onClose={()=> setIsModalOpen(false)}
             title="Create Trade Proposal"
             buttons={[
               {
                label: loading ? 'Creating a trade...' : 'Create Trade',
                onClick: handleCreateTrade,
                variant: 'primary' as const
               },
               {
                label: 'Cancel',
                onClick: () => setIsModalOpen(false),
                variant: 'secondary' as const 
               }
             ]}  
        >
          <br />
          <form onSubmit={(e) => { e.preventDefault(); handleCreateTrade() }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Your Skills */}
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="initiator-skill">Your Skill:</label>
              <select
                id="initiator-skill"
                value={formData.initiatorSkillId}
                onChange={(e) => setFormData({ ...formData, initiatorSkillId: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px', textTransform: 'capitalize' }}
              >
                <option value="">Select a skill you're offering</option>
                {userSkills.map(skill => (
                  <option key={skill._id} value={skill._id}>
                    {skill.name} ({skill.proficiencyLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Other User's Skills */}
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="receiver-skill">Skill You Want:</label>
              <select
                id="receiver-skill"
                value={formData.receiverSkillId}
                onChange={(e) => setFormData({ ...formData, receiverSkillId: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select the skill you want from {selectedUser.userName}</option>
                {otherUserSkills.map(skill => (
                  <option key={skill._id} value={skill._id}>
                    {skill.name} ({skill.proficiencyLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe */}
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="timeframe">Timeframe:</label>
              <select
                id="timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="asap">ASAP</option>
                <option value="1 week">1 Week</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="1 month">1 Month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="notes">Notes (optional):</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional details about the trade..."
                rows={4}
                style={{ width: '100%', padding: '8px', marginTop: '5px', fontFamily: 'inherit' }}
              />
            </div>
          </form>
        </Modal>
}
      </header>
  );
}