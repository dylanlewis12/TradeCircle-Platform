import { useState } from 'react';
import '../styles/pages/Dashboard.css';
//import { useAuth } from '../context/authContext/AuthContext';
//import axios from 'axios';
import SkillCard from '../components/SkillCard';
import AddSkillModal from '../components/modals/skills/AddSkill.tsx';


interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiencyLevel: string;
  description: string;
  userId: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('skills');

  const[isAddSkillOpen, setIsAddSkillOpen] = useState(false); //Add skill modal state

  const handleAddSkillOpen = () => setIsAddSkillOpen(true);
  const handleAddSkillClose = () => setIsAddSkillOpen(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  function handleSkillAdded(newSkill: Skill) {
    // Add new skill to the list
    setSkills([...skills, newSkill]);
    handleAddSkillClose();
  };


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
          <div className="sidebar__title">📁 Filter by Category</div>
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
          <div className="sidebar__title">📊 Filter by Level</div>
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
          <div className="sidebar__title">✓ Filter by Status</div>
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

      {/* Main Content */}
      <div className="dashboard__content">
        {/* Header Section */}
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

        {/* Tabs */}
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

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="tab-content">
            <button className="create-btn" onClick={handleAddSkillOpen}>+ Create New Skill</button>
              <SkillCard />
          </div>
        )}
        <AddSkillModal 
          isOpen={isAddSkillOpen}
          onClose={handleAddSkillClose}
          onSkillAdded={handleSkillAdded}
        />


        {/* Listings Tab */}
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="empty-state">
              <div className="empty-state__icon">📜</div>
              <div className="empty-state__title">No Trade History Yet</div>
              <div className="empty-state__text">Complete your first trade to see your history here</div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
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