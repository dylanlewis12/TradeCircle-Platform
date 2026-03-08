import '../../styles/components/chat/NoChatSelected.css';

export default function NoChatSelected() {
  return (
    <div className="no-chat-selected">
      <div className="no-chat-selected__content">
        <h2>No Chat Selected</h2>
        <p>Select a conversation from the sidebar to start messaging</p>
        <p>or</p>
        <p>Browse the Marketplace and click "Contact Seller" to start a new conversation</p>
      </div>
    </div>
  );
}