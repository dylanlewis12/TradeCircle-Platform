import { useAuth } from '../context/authContext/AuthContext.js';
import axios from 'axios';
import {
  Cpu,
  Languages,
  Hammer,
  Wrench,
  BookOpen,
  Palette,
  Stethoscope,
  Users,
  Briefcase,
  MessageSquare,
  Zap,
  MoreHorizontal,
  type LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import '../styles/components/SkillCard.css';

interface Skill {
  _id: string;
  name: string;
  category: 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';
  proficiencyLevel: string;
  description: string;
  userId: string;
  listingType?: string;
  status?: string;
  createdAt?: Date;
}

type SkillCategory = 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';

const skillCategoryIcons: Record<SkillCategory, LucideIcon> = {
  technology: Cpu,
  linguistic: Languages,
  crafts: Hammer,
  services: Wrench,
  academic: BookOpen,
  creative: Palette,
  medical: Stethoscope,
  leadership: Users,
  business: Briefcase,
  communication: MessageSquare,
  trades: Zap,
  other: MoreHorizontal
};

export default function SkillCard() {
  const { user, cookies } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if user exists
    if (!user?.id) {
      return;
    }

    async function fetchUserSkills() {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/api/skills/user/${user!.id}`,
          {
            headers: {
              'Authorization': `Bearer ${cookies.accessToken}`
            }
          }
        );

        setSkills(response.data.skills);
      } catch(err: any) {
        console.error('Error fetching skills:', err);
        setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    }

    fetchUserSkills();
  }, [user?.id, cookies.accessToken]);

  if(loading) {
    return <div>Loading skills...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (skills.length === 0) {
    console.log(skills);
    return (
      <div className='skills__empty' >
        <p>No skills found. Create your first skill!</p>
      </div>
      );
  }

  //Add functionality to control card sizes and manage description/name length
  return (
    <>
      <div className="skill-card__grid">
        {skills.map((skill) => {
          const IconComponent = skillCategoryIcons[skill.category as SkillCategory];
          
          return (
            <div key={skill._id} className="skill-card">
              <div className="skill-card__icon">
                {IconComponent ? <IconComponent size={48} /> : <MoreHorizontal size={48} />}
              </div>
              <div className="skill-card__name">{skill.name}</div>
              <div className="skill-card__level skill-card__level--expert">
                {skill.proficiencyLevel}
              </div>
              <div className="skill-card__info">{skill.description}</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}