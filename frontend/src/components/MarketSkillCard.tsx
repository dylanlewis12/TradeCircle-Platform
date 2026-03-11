import '../styles/components/MarketSkillCard.css'
import { User, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext/AuthContext';
import { useChat } from './chat/store/useChat';
import { useState } from 'react';
import UserModal from '../components/modals/UserModal.tsx';

import toast from 'react-hot-toast';

interface MarketSkill {
  skill: any;
  handleView: () => void;
  onViewProfile: (userId: string) => void;
}

export default function MarketSkillCard({ skill, handleView, onViewProfile}: MarketSkill) {
  const navigate = useNavigate();
  const { setSelectedUser, createOrGetConversation, getMessages, setAccessToken } = useChat();
  const { user, cookies } = useAuth();  

  // Handle contact seller - initiates trade conversation
  async function handleContactSeller() {
    try {
      //Set access token first
      if (cookies.accessToken) {
        setAccessToken(cookies.accessToken);
        console.log('Access token set in MarketSkillCard');
      } else {
        toast.error('Not authenticated. Please log in.');
        return;
      }

      // Don't allow user to message themselves
      if (user?.id === skill.userId._id) {
        toast.error("You can't message yourself");
        return;
      }

      // Create or get conversation with skill owner
      const conversationId = await createOrGetConversation(skill.userId._id);

      // Set the seller as selected user
      setSelectedUser({
        _id: skill.userId._id,
        userName: skill.userId.userName,
        profilePicture: skill.userId.profilePicture,
        email: skill.userId.email
      });

      // Load messages for this user
      await getMessages(skill.userId._id);

      // Navigate to chat
      navigate(`/messages/${skill.userId._id}`, { 
        state: { 
          conversationId, 
          skillId: skill._id,
          skillName: skill.name
        }
      });

      //toast.success('Chat opened');
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      //toast.error('Failed to open chat');
    }
  }

  return (
    <div className='marketplace__skill-card'>
      <div className='skill-card__header'>
        <User size={40} className='skill-card__avatar' />
        <div className='skill-card__user'>
          <p className='skill-card__userName'>{skill.userId.userName}</p>
          <div className='skill-card__rating'>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{skill.userId.rating || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className='skill-card__body'>
        <h3 className='skill-card__name'>{skill.name}</h3>

        <div className='skill-card__proficiency'>
          {skill.proficiencyLevel?.charAt(0).toUpperCase() + skill.proficiencyLevel?.slice(1)}
        </div>

        <div className='skill-card__meta'>
          <span className='skill-card__experience'>
            {skill.yearsOfExperience === 0 ? 'Less than 1 year' : 
             skill.yearsOfExperience === 1 ? '1-2 years' :
             skill.yearsOfExperience === 2 ? '2-5 years' :
             skill.yearsOfExperience === 5 ? '5-10 years' :
             '10+ years'}
          </span>
          <span className='skill-card__hours'>
            {skill.hoursAvailable} hrs/week
          </span>
        </div>

        <p className='skill-card__description'>{skill.description}</p>

        <div className='skill-card__category'>
          <span className="skill-card__category-badge">
            {skill.category?.charAt(0).toUpperCase() + skill.category?.slice(1)}
          </span>
        </div>
      </div>

      <div className='skill-card__buttons'>
        <button 
          className='contact-button' 
          onClick={handleContactSeller}
        >
          Contact Seller
        </button>
        <button 
          className='view-button' 
          onClick={() => onViewProfile(skill.userId._id)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}