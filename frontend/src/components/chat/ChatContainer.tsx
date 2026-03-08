import { useRef, useEffect } from 'react';
import { useChat } from './store/useChat.tsx';
import { useAuth } from '../../context/authContext/AuthContext.tsx';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton.tsx';
import { formatMessageTime } from '../../lib/utils.ts';
import '../../styles/components/chat/ChatContainer.css';

interface ChatContainerProps {
  skillId?: string;
  skillName?: string;
}

export default function ChatContainer({ skillName }: ChatContainerProps) {
  const {
    messages,
    isMessageLoading,
    selectedUser,
  } = useChat();
  
  const { user } = useAuth();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="chat__container-empty">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat__container" style={{backgroundColor: "#f0f8f4"}}>
      <ChatHeader skillName={skillName} />

      {isMessageLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="messages__area" >
          {messages.map(message => (
            <div
              key={message._id}
              className={`message ${message.senderId === user?.id ? 'message__sent' : 'message__received'}`}
              ref={messageEndRef}
            >
              <div className="message__content">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="message__image"
                  />
                )}
                {message.text && <p className="message__text">{message.text}</p>}
              </div>
              <span className="message__time">
                {formatMessageTime(message.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
        <div className='message-input__container'>
          <MessageInput />
        </div>
    </div>
  );
}