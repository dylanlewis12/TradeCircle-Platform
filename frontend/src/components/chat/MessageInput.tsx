import { useState } from 'react';
import { useChat } from './store/useChat.tsx';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import '../../styles/components/chat/MessageInput.css';

export default function MessageInput() {
  const [text, setText] = useState('');
  const { selectedUser, messages, sendMessage, createOrGetConversation } = useChat();
  const [image, setImage] = useState<string | undefined>();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    try {
      if (!selectedUser) {
        toast.error('No user selected');
        return;
      }

      // Get conversationId from first message or create one
      let conversationId = messages[0]?.conversationId;
      
      if (!conversationId) {
        // If no messages yet, create conversation first
        conversationId = await createOrGetConversation(selectedUser._id);
      }

      // Pass all 3 arguments including image
      await sendMessage(selectedUser._id, text, image);
      
      setText('');
      setImage(undefined);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <form className="message-input" onSubmit={handleSendMessage}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="message-input__field"
      />
      <button 
        type="submit" 
        className="message-input__send"
        disabled={!text.trim()}  
      >
        <Send size={20} />
      </button>
    </form>
  );
}