import '../styles/components/MarketSkillCard.css'
import { User, Star } from 'lucide-react';

interface MarketSkill {
  skill: any;
  handleContact: () => void;
  handleView: () => void;
}

export default function MarketSkillCard({ skill, handleContact, handleView }: MarketSkill) {
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
          {skill.proficiencyLevel.charAt(0).toUpperCase() + skill.proficiencyLevel.slice(1)}
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
            {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
          </span>
        </div>
      </div>

      <div className='skill-card__buttons'>
        <button className='contact-button' onClick={handleContact}>
          Contact Seller
        </button>
        <button className='view-button' onClick={handleView}>
          View Profile
        </button>
      </div>
    </div>
  );
}