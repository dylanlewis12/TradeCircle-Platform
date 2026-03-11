import { useEffect, useState } from 'react';
import '../styles/pages/Dashboard.css';
import SkillCard from '../components/DashboardSkillCard.tsx';
import AddSkillModal from '../components/modals/skills/AddSkill.tsx';
import { useAuth } from '../context/authContext/AuthContext.tsx';
import axios from 'axios';
import API_BASE_URL from '../config/api.ts';
import TradeHistory from '../components/TradeHistory';

interface Skill {
  _id: string;
  name: string;
  category: 'technology' | 'linguistic' | 'crafts' | 'services' | 'academic' | 'creative' | 'medical' | 'leadership' | 'business' | 'communication' | 'trades' | 'other';
  proficiencyLevel: string;
  yearsOfExperience: number;
  status: string;
  hoursAvailable: number;
  description: string;
  userId: string;
}

export default function Dashboard() {
  const { user, cookies } = useAuth();
  const [activeTab, setActiveTab] = useState('skills');
  const [loading, setLoading] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [completedTradesCount, setCompletedTradesCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [skills, setSkills] = useState<Skill[]>([]);

  // ✅ Calculate active listings count
  const activeListingsCount = skills.filter(skill => skill.status === 'active').length;

  const handleAddSkillOpen = () => setIsAddSkillOpen(true);
  const handleAddSkillClose = () => setIsAddSkillOpen(false);

  // Handler for category checkboxes
  function handleCategoryChange(category: string) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

  // Handler for level checkboxes
  function handleLevelChange(level: string) {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  }

  // Handler for status checkboxes
  function handleStatusChange(status: string) {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }

  // Fetch user stats (rating and totalTrades)
  useEffect(() => {
    if (!user?.id || !cookies.accessToken) {
      return;
    }

    async function fetchUserStats() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/${user?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );


      setUserRating(response.data.user.rating || 0);
      setCompletedTradesCount(response.data.user.totalTrades || 0);
    } catch (err: any) {
      console.error('Error fetching user stats:', err.message);
    }
  }

  fetchUserStats();
}, [user?.id, cookies.accessToken]);

  // Fetch user skills based on filters
  useEffect(() => {
    if (!user?.id || !cookies.accessToken) {
      return;
    }

    async function fetchUserSkills() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Only add if selections exist
        if (selectedCategories.length > 0) {
          selectedCategories.forEach(category => {
            params.append('category', category);
          });
        }

        if (selectedLevels.length > 0) {
          selectedLevels.forEach(level => {
            params.append('proficiencyLevel', level);
          });
        }

        if (selectedStatuses.length > 0) {
          selectedStatuses.forEach(status => {
            params.append('status', status);
          });
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/skills/user/${user?.id}?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${cookies.accessToken}`
            }
          }
        );

        setSkills(response.data.skills);
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    }

    fetchUserSkills();
  }, [selectedCategories, selectedLevels, selectedStatuses, user?.id, cookies.accessToken]);

  function handleSkillAdded(newSkill: Skill) {
    setSkills([...skills, newSkill]);
    handleAddSkillClose();
  }

  function handleSkillDeleted(skillId: string) {
    setSkills(skills.filter(skill => skill._id !== skillId));
  }

  function handleSkillEdited(updatedSkill: Skill) {
    setSkills(skills.map(skill => 
      skill._id === updatedSkill._id ? updatedSkill : skill
    ));
  }

  function handleTabSwitch(tabName: string) {
    setActiveTab(tabName);
  }

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        {/* Category Filter - Checkboxes */}
        <div className="sidebar__section">
          <div className="sidebar__title">Category</div>
          <div className="filter-group">
            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.length === 0}
                onChange={() => setSelectedCategories([])}
              /> 
              All
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('linguistic')}
                onChange={() => handleCategoryChange('linguistic')}
              /> 
              Language
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('technology')}
                onChange={() => handleCategoryChange('technology')}
              /> 
              Technology
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('creative')}
                onChange={() => handleCategoryChange('creative')}
              /> 
              Arts & Design
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('business')}
                onChange={() => handleCategoryChange('business')}
              /> 
              Business
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('medical')}
                onChange={() => handleCategoryChange('medical')}
              /> 
              Health & Wellness
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('crafts')}
                onChange={() => handleCategoryChange('crafts')}
              /> 
              Crafts
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('services')}
                onChange={() => handleCategoryChange('services')}
              /> 
              Services
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('academic')}
                onChange={() => handleCategoryChange('academic')}
              /> 
              Academic
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('leadership')}
                onChange={() => handleCategoryChange('leadership')}
              /> 
              Leadership
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('communication')}
                onChange={() => handleCategoryChange('communication')}
              /> 
              Communication
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('trades')}
                onChange={() => handleCategoryChange('trades')}
              /> 
              Trades
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes('other')}
                onChange={() => handleCategoryChange('other')}
              /> 
              Other
            </label>
          </div>
        </div>

        {/* Level Filter - Checkboxes */}
        <div className="sidebar__section">
          <div className="sidebar__title">Proficiency Level</div>
          <div className="filter-group">
            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedLevels.length === 0}
                onChange={() => setSelectedLevels([])}
              /> 
              All
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedLevels.includes('beginner')}
                onChange={() => handleLevelChange('beginner')}
              /> 
              Beginner
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedLevels.includes('intermediate')}
                onChange={() => handleLevelChange('intermediate')}
              /> 
              Intermediate
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedLevels.includes('advanced')}
                onChange={() => handleLevelChange('advanced')}
              /> 
              Advanced
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedLevels.includes('expert')}
                onChange={() => handleLevelChange('expert')}
              /> 
              Expert
            </label>
          </div>
        </div>

        {/* Status Filter - Checkboxes */}
        <div className="sidebar__section">
          <div className="sidebar__title">Status</div>
          <div className="filter-group">
            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedStatuses.length === 0}
                onChange={() => setSelectedStatuses([])}
              /> 
              All
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedStatuses.includes('active')}
                onChange={() => handleStatusChange('active')}
              /> 
              Active
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedStatuses.includes('inactive')}
                onChange={() => handleStatusChange('inactive')}
              /> 
              Inactive
            </label>

            <label className="filter-label">
              <input 
                type="checkbox"
                checked={selectedStatuses.includes('archived')}
                onChange={() => handleStatusChange('archived')}
              /> 
              Archived
            </label>
          </div>
        </div>
      </aside>

      <div className="dashboard__content">
        <div className="dashboard__header">
          <h1 className="dashboard__title">My Dashboard</h1>
          <div className="dashboard__stats">
            <div className="stat-card">
              <div className="stat-card__number">{skills.length}</div>
              <div className="stat-card__label">Skills</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">{completedTradesCount}</div>
              <div className="stat-card__label">Completed Trades</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">{activeListingsCount}</div>
              <div className="stat-card__label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">{userRating.toFixed(1)}★</div>
              <div className="stat-card__label">Rating</div>
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
            <button className="create-btn" onClick={handleAddSkillOpen}>
              + Create New Skill
            </button>
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
          skills={skills}
        />

        {activeTab === 'history' && <TradeHistory />}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="empty-state">
              <div className="empty-state__title">No User Analytics Yet</div>
              <div className="empty-state__text">Track your trading performance and insights here</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}