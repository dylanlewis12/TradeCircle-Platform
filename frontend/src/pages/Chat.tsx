import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/pages/Chat.css';
import { useChat } from '../components/chat/store/useChat.tsx';
import { useAuth } from '../context/authContext/AuthContext';
import ConversationsSidebar from '../components/chat/ConversationsSidebar';
import ChatContainer from '../components/chat/ChatContainer';
import NoChatSelected from '../components/chat/NoChatSelected';

export default function Chat() {
  const { userId } = useParams();
  const { getUsers, getMessages, setSelectedUser, users, selectedUser, setAccessToken } = useChat();
  const { cookies } = useAuth();

  // Set access token from auth
  useEffect(() => {
    setAccessToken(cookies.accessToken);
  }, [cookies.accessToken, setAccessToken]);

  // Load conversations on mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Load messages when user changes
  useEffect(() => {
    if (userId) {
      const selectedUserData = users.find(u => u._id === userId);
      
      if (selectedUserData) {
        setSelectedUser(selectedUserData);
        getMessages(userId);
      }
    }
  }, [userId, users, setSelectedUser, getMessages]);

  return (
    <div className="chat-page">
      {/* Sidebar with conversations */}
      <ConversationsSidebar />

      {/* Main chat area */}
      <main className="chat-main">
        {userId && selectedUser ? (
          <ChatContainer />
        ) : (
          <NoChatSelected />
        )}
      </main>
    </div>
  );
}