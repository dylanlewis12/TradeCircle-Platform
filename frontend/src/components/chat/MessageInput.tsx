import { useState } from 'react';
import { useChat } from './store/useChat.tsx';
import { Send } from 'lucide-react';
import '../../styles/components/chat/MessageInput.css';

export default function MessageInput() {
  const [text, setText] = useState('');
  const { selectedUser, sendMessage } = useChat();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser._id, text);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /*
    Add grouping for message dates, Typing indicator
  */

  return (
        <form className="message-input" onSubmit={handleSendMessage}>
          <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="message-input__field"
          />
          <button type="submit" className="message-input__send">
              <Send size={20} />
          </button>
        </form>
  );
}