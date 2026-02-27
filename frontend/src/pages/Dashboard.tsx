import { useState } from 'react';
import '../styles/pages/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('skills');

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
  };

  function getUserRating() {

  }

  function getUserTrades() {

  }

  function getTotalSkills() {

  }

  function getTotalListings() {
    
  }

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
            <button className="create-btn">+ Create New Skill</button>

            <div className="skill-card">
              <div className="skill-card__icon">🗣️</div>
              <div className="skill-card__name">Spanish Tutoring</div>
              <div className="skill-card__level skill-card__level--expert">Expert</div>
              <div className="skill-card__info">5 offers received</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-card__icon">💻</div>
              <div className="skill-card__name">Web Development</div>
              <div className="skill-card__level skill-card__level--advanced">Advanced</div>
              <div className="skill-card__info">12 offers received</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-card__icon">🎨</div>
              <div className="skill-card__name">Graphic Design</div>
              <div className="skill-card__level skill-card__level--advanced">Advanced</div>
              <div className="skill-card__info">8 offers received</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-card__icon">📚</div>
              <div className="skill-card__name">English Writing</div>
              <div className="skill-card__level skill-card__level--intermediate">Intermediate</div>
              <div className="skill-card__info">3 offers received</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-card__icon">🏋️</div>
              <div className="skill-card__name">Fitness Coaching</div>
              <div className="skill-card__level skill-card__level--beginner">Beginner</div>
              <div className="skill-card__info">2 offers received</div>
              <div className="skill-card__actions">
                <button className="btn btn--primary">Edit</button>
                <button className="btn btn--secondary">Delete</button>
              </div>
            </div>
          </div>
        )}

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