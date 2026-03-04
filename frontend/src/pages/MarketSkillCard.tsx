import '../styles/components/MarketSkillCard.css'
import { User, Star } from 'lucide-react'

interface MarketSkill {
    skill: any;
    handleContact: () => void;
    handleView: () => void;
}

export default function MarketSkillCard({ skill, handleContact, handleView }: MarketSkill) {
    return (
        <div className="marketplace__skill-grid">
            <div className='marketplace__skill-card'>
                <section className='skill-card__header'>
                    <User size={40} className='skill-card__profile' />
                    <p className='skill-card__username'>{skill.userId.userName}</p>
                    <div className='skill-card__rating'>
                        <Star size={14} fill="#fbbf24" color="#fbbf24"></Star>
                        <span>{skill.userId.rating || 'N/A'}</span>
                    </div>
                </section>
                <section className='skill-card__body'>
                    <h3 className='skill-card__name'>{skill.name}</h3>
                    <div className='skill-card__proficiency'>
                        {skill.proficiencyLevel.charAt(0).toUpperCase() + skill.proficiencyLevel.slice(1)}
                    </div>
                    <p className='skill-card_description'>{skill.description}</p>
                    <div className='skill-card_category'>
                        <span className="marketplace-card__category-badge">
                            {skill.category}
                      </span>
                    </div>
                </section>
                <section className='skill-card__buttons'>
                    <button className='contact-button' onClick={handleContact}>Contact Seller</button>
                    <button className='view-button' onClick={handleView}>View Profile</button>
                </section>
            </div>
        </div>
    );
}