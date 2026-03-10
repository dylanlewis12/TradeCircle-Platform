import { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '../../Modal.tsx';
import '../../../styles/components/modals/RatingModal.css';
import toast from 'react-hot-toast';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  userName: string;
}

export default function RatingModal({ isOpen, onClose, onSubmit, userName }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit(rating, review);
    setRating(0);
    setReview('');
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rate your trade with ${userName}`}
      buttons={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary' as const
        },
        {
          label: 'Submit Rating',
          onClick: handleSubmit,
          variant: 'primary' as const
        }
      ]}
    >
      <div className="rating-modal__body">
        <div className="rating-modal__stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="rating-modal__star"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              type="button"
            >
              <Star
                size={40}
                fill={star <= (hoverRating || rating) ? '#fbbf24' : 'none'}
                color={star <= (hoverRating || rating) ? '#fbbf24' : '#ccc'}
              />
            </button>
          ))}
        </div>

        <textarea
          className="rating-modal__review"
          placeholder="Leave a review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={500}
          rows={4}
        />

        <div className="rating-modal__char-count">
          {review.length}/500
        </div>
      </div>
    </Modal>
  );
}