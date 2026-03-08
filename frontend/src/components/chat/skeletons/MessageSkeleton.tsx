import '../../../styles/components/chat/MessageSkeleton.css';

export default function MessageSkeleton() {
  return (
    <div className="message-skeleton-container">
      {/* Simulate 3 loading messages */}
      {[1, 2, 3].map(i => (
        <div key={i} className={`message-skeleton ${i % 2 === 0 ? 'message-skeleton--sent' : 'message-skeleton--received'}`}>
          <div className="message-skeleton__bubble"></div>
        </div>
      ))}
    </div>
  );
}