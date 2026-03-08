import { useNavigate } from 'react-router-dom';
import { useChat } from './store/useChat.tsx';
import '../../styles/components/chat/ConversationsSidebar.css';

export default function ConversationsSidebar() {
  const navigate = useNavigate();
  const { users, isUsersLoading, selectedUser } = useChat();

  if (isUsersLoading) {
    return (
      <aside className="chat-sidebar">
        <div className='chat-header'>
          <h2 className='chat-header__title'>Your Conversations</h2>
        </div>
        <div className="conversations__loading">Loading conversations...</div>
      </aside>
    );
  }

  return (
    <aside className="chat-sidebar">
      <div className='chat-header'>
        <h2 className='chat-header__title'>Your Conversations</h2>
      </div>

      <ul className='conversations__list'>
        {users.length === 0 ? (
          <li className="conversations__empty">No conversations yet</li>
        ) : (
          users.map(user => (
            <li
              key={user._id}
              className={`conversations__item ${selectedUser?._id === user._id ? 'conversations__item--active' : ''}`}
              onClick={() => navigate(`/messages/${user._id}`)}
            >
              <div className="conversations__avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.userName} />
                ) : (
                  <div className="conversations__avatar-initial">
                    {user.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="conversations__info">
                <p className="conversations__name">{user.userName}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}