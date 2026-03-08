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
    console.log('Setting access token:', cookies.accessToken?.substring(0, 20)); 
    setAccessToken(cookies.accessToken);
  }, [cookies.accessToken, setAccessToken]);

  // Load conversations on mount
  useEffect(() => {
    console.log('Loading users...');  
    getUsers();
  }, [getUsers]);

  // Load messages when user changes
  useEffect(() => {
    console.log('Checking userId:', userId, 'users array:', users); 
    if (userId) {
      const selectedUserData = users.find(u => u._id === userId);
      console.log('Found user data:', selectedUserData); 
      
      if (selectedUserData) {
        setSelectedUser(selectedUserData);
        getMessages(userId);
      } else {
        console.log('User not found in users array');  
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