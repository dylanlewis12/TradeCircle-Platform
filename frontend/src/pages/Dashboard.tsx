import { useEffect, useState } from 'react';
import '../styles/pages/Dashboard.css';
import SkillCard from '../components/DashboardSkillCard.tsx';
import AddSkillModal from '../components/modals/skills/AddSkill.tsx';
import { useAuth } from '../context/authContext/AuthContext.tsx';
import axios from 'axios';

interface Skill {
  _id: string;
  name: string;
  category: 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';
  proficiencyLevel: string;
  description: string;
  userId: string;
}


export default function Dashboard() {
  const { user ,cookies } = useAuth();
  const [activeTab, setActiveTab] = useState('skills');
  const [loading, setLoading] = useState(false);
  const[isAddSkillOpen, setIsAddSkillOpen] = useState(false); //Add skill modal state
  const [error, setError] = useState<string | null>(null);

  const handleAddSkillOpen = () => setIsAddSkillOpen(true);
  const handleAddSkillClose = () => setIsAddSkillOpen(false);
  const [skills, setSkills] = useState<Skill[]>([]);

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

  
  function handleSkillAdded(newSkill: Skill) {
    // Add new skill to the list
    setSkills([...skills, newSkill]);
    handleAddSkillClose();
  };

  function handleSkillDeleted(skillId: string) {
    setSkills(skills.filter(skill => skill._id !== skillId))
  };

  function handleSkillEdited(updatedSkill: Skill) {
      setSkills(skills.map(skill => 
        skill._id === updatedSkill._id ? updatedSkill : skill
      ));
  }

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
  };

  /*
  function getUserRating() {

  }

  function getUserTrades() {

  }

  function getTotalListings() {
    return <>
    </> 
  }
  */
  

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <div className="sidebar__section">
          <div className="sidebar__title"> Filter by Category</div>
          <div className="filter-group">
            <label className="filter-label">
              <input type="checkbox" defaultChecked /> Language
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Technology
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Arts & Design
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Business
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Health & Wellness
            </label>
          </div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__title"> Filter by Level</div>
          <div className="filter-group">
            <label className="filter-label">
              <input type="checkbox" /> Beginner
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Intermediate
            </label>
            <label className="filter-label">
              <input type="checkbox" defaultChecked /> Advanced
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Expert
            </label>
          </div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__title"> Filter by Status</div>
          <div className="filter-group">
            <label className="filter-label">
              <input type="checkbox" defaultChecked /> Active
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Inactive
            </label>
            <label className="filter-label">
              <input type="checkbox" /> Archived
            </label>
          </div>
        </div>
      </aside>

      <div className="dashboard__content">
        <div className="dashboard__header">
          <h1 className="dashboard__title">My Dashboard</h1>
          <div className="dashboard__stats">
            <div className="stat-card">
              <div className="stat-card__number">5</div>
              <div className="stat-card__label">Active Skills</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">12</div>
              <div className="stat-card__label">Completed Trades</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">8</div>
              <div className="stat-card__label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">4.8★</div>
              <div className="stat-card__label">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'skills' ? 'tab--active' : ''}`}
            onClick={() => handleTabSwitch('skills')}
          >
            Skills Management
          </button>
          <button 
            className={`tab ${activeTab === 'listings' ? 'tab--active' : ''}`}
            onClick={() => handleTabSwitch('listings')}
          >
            Listings & Seeking
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'tab--active' : ''}`}
            onClick={() => handleTabSwitch('history')}
          >
            Trade History
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'tab--active' : ''}`}
            onClick={() => handleTabSwitch('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'skills' && (
          <div className="tab-content">
            <button className="create-btn" onClick={handleAddSkillOpen}>+ Create New Skill</button>
            {loading && <p>Loading skills...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <SkillCard 
              skills={skills}
              onSkillDeleted={handleSkillDeleted}
              onSkillEdited={handleSkillEdited}
            />
          </div>
        )}
        <AddSkillModal 
          isOpen={isAddSkillOpen}
          onClose={handleAddSkillClose}
          onSkillAdded={handleSkillAdded}
        />


        {activeTab === 'listings' && (
          <div className="tab-content">
            <div className="empty-state">
              <div className="empty-state__icon">📋</div>
              <div className="empty-state__title">View Your Listings Here</div>
              <div className="empty-state__text">Create a skill to start offering or seeking trades</div>
              <button className="create-btn">+ Create New Listing</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="empty-state">
              <div className="empty-state__icon">📜</div>
              <div className="empty-state__title">No Trade History Yet</div>
              <div className="empty-state__text">Complete your first trade to see your history here</div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="empty-state">
              <div className="empty-state__icon">📊</div>
              <div className="empty-state__title">Analytics Coming Soon</div>
              <div className="empty-state__text">Track your trading performance and insights here</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}