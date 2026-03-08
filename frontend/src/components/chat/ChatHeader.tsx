// src/components/chat/ChatHeader.tsx
import { useNavigate } from 'react-router-dom';
import { useChat } from './store/useChat.tsx';
//import { useAuth } from '../../context/authContext/AuthContext';
import { ArrowLeft } from 'lucide-react';
import '../../styles/components/chat/ChatHeader.css';

interface ChatHeaderProps {
  skillName?: string;
}

export default function ChatHeader({ skillName }: ChatHeaderProps) {
  const navigate = useNavigate();
  const { selectedUser } = useChat();

  if (!selectedUser) {
    return null;
  }

  const handleBack = () => {
    navigate('/messages');
  };

  const handleCreateTrade = () => {
    // This will open the trade proposal modal
    console.log('Create trade clicked');
    // TODO: Open TradeProposalModal
  };

  
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
            onClick={handleCreateTrade}
            title="Create a trade proposal"
          >
            Create Trade
          </button>
        </div>
      </header>
  );
}