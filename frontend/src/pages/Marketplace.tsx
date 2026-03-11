import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/pages/Marketplace.css';
import axios from 'axios';
import { useAuth } from '../context/authContext/AuthContext.tsx';
import MarketSkillCard from '../components/MarketSkillCard.tsx';
import API_BASE_URL from '../config/api.ts';
import UserModal from '../components/modals/UserModal.tsx';
import toast from 'react-hot-toast';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiencyLevel: string;
  description: string;
  userId: {
    id: string;
    userName: string;
    profilePicture: string;
    rating: number;
  };
  createdAt: string;
}

export default function Marketplace() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user, cookies } = useAuth();
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 

  function handleCategoryChange(category: string) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  function handleProficiencyChange(proficiency: string) {
    setSelectedProficiencies(prev =>
      prev.includes(proficiency)
        ? prev.filter(p => p !== proficiency)
        : [...prev, proficiency]
    );
  };



  useEffect(() => {

    async function fetchSkills() {
      try {
        setLoading(true);
        //setError(null);

        const params = new URLSearchParams();
        
        //Add all selected categories
        if (selectedCategories.length > 0) {
          selectedCategories.forEach(category => {
            params.append('category', category);
          });
        }

        // Add all selected proficiencies
        if (selectedProficiencies.length > 0) {
          selectedProficiencies.forEach(proficiency => {
            params.append('proficiencyLevel', proficiency);
          });
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/skills/marketplace/${user!.id}?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${cookies.accessToken}`
            }
          }
        );

        let fetchedSkills = response.data.skills;

        // Filter by search query
        if (searchQuery) {
          fetchedSkills = fetchedSkills.filter((skill: Skill) =>
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Sort skills
        if (sortBy === 'newest') {
          fetchedSkills.sort((skill1: Skill, skill2: Skill) => {
            return new Date(skill2.createdAt).getTime() - new Date(skill1.createdAt).getTime();
          });
        } else if (sortBy === 'rating') {
          fetchedSkills.sort((skill1: Skill, skill2: Skill) => {
            return (skill2.userId.rating || 0) - (skill1.userId.rating || 0);
          });
        }

        setSkills(fetchedSkills);
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        toast.error('Failed to fetch skills');
        
        //setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [selectedCategories, selectedProficiencies, searchQuery, sortBy, user?.id, cookies.accessToken]);


  const cards = skills.map((skill: Skill) => {
    return (
      <MarketSkillCard 
        key={skill._id}
        skill={skill}
        onViewProfile={(userId) => setSelectedUserId(userId)}  
      />
    );
  });

  return (
    <div className="marketplace">
      {/* Hero Section */}
      <div className='marketplace__hero'>
        <h1 className='marketplace__title'>Skill Marketplace</h1>
        <p className='marketplace__subtitle'>Discover and trade skills with our community</p>
        <div className='marketplace__search'>
          <Search size={20} className='marketplace__search-icon' />
          <input
            type='text'
            placeholder='Search skills by name or description...'
            className='marketplace__search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className='marketplace__container'>
        {/* Sidebar - Filters */}
        <aside className='marketplace__sidebar'>
          <div className='filter-section'>
            <h3 className='filter-section__title'>
              <Filter size={18} /> Filters
            </h3>
          </div>
         
          {/* Category Filter - Checkboxes */}
          <div className='filter-section'>
            <h4 className='filter-section__group-title'>Category</h4>
            <div className='filter-options'>
              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.length === 0}
                  onChange={() => setSelectedCategories([])}
                />
                <span>All Categories</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('technology')}
                  onChange={() => handleCategoryChange('technology')}
                />
                <span>Technology</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('linguistic')}
                  onChange={() => handleCategoryChange('linguistic')}
                />
                <span>Lingustic</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('creative')}
                  onChange={() => handleCategoryChange('creative')}
                />
                <span>Arts & Design</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('business')}
                  onChange={() => handleCategoryChange('business')}
                />
                <span>Business</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('academic')}
                  onChange={() => handleCategoryChange('academic')}
                />
                <span>Academic</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('crafts')}
                  onChange={() => handleCategoryChange('crafts')}
                />
                <span>Crafts</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('services')}
                  onChange={() => handleCategoryChange('services')}
                />
                <span>Services</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('medical')}
                  onChange={() => handleCategoryChange('medical')}
                />
                <span>Health & Wellness</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('leadership')}
                  onChange={() => handleCategoryChange('leadership')}
                />
                <span>Leadership</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('communication')}
                  onChange={() => handleCategoryChange('communication')}
                />
                <span>Communication</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('trades')}
                  onChange={() => handleCategoryChange('trades')}
                />
                <span>Trades</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedCategories.includes('other')}
                  onChange={() => handleCategoryChange('other')}
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          {/* Proficiency Filter - Checkboxes */}
          <div className='filter-section'>
            <h4 className='filter-section__group-title'>Proficiency Level</h4>
            <div className='filter-options'>
              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedProficiencies.length === 0}
                  onChange={() => setSelectedProficiencies([])}
                />
                <span>All Levels</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedProficiencies.includes('Beginner')}
                  onChange={() => handleProficiencyChange('Beginner')}
                />
                <span>Beginner</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedProficiencies.includes('Intermediate')}
                  onChange={() => handleProficiencyChange('Intermediate')}
                />
                <span>Intermediate</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedProficiencies.includes('Advanced')}
                  onChange={() => handleProficiencyChange('Advanced')}
                />
                <span>Advanced</span>
              </label>

              <label className='filter-option'>
                <input 
                  type='checkbox'
                  checked={selectedProficiencies.includes('Expert')}
                  onChange={() => handleProficiencyChange('Expert')}
                />
                <span>Expert</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="marketplace__main">
          {/* Toolbar - Sort & Results */}
          <div className="marketplace__toolbar">
            <div className="marketplace__results">
              <p>{skills.length} skills found</p>
            </div>
            <div className="marketplace__sort">
              <label>Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="marketplace__selected-sort"
              >
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Skills Grid */}
          {loading ? (
            <div className='marketplace__loading'>Loading skills...</div>
          ) : skills.length > 0 ? (
            <div className='marketplace__skills-grid'>
              {cards}
                <UserModal
                  isOpen={!!selectedUserId}
                  onClose={() => setSelectedUserId(null)}
                  userId={selectedUserId || undefined}
                />
            </div>
          ) : (
            <div className="marketplace__empty">
              <p>No skills matching your criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
