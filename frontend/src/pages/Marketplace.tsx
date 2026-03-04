import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/pages/Marketplace.css';
import axios from 'axios';
import { useAuth } from '../context/authContext/AuthContext.tsx';
import MarketSkillCard from '../components/MarketSkillCard.tsx';

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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProficiency, setSelectedProficiency] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const { cookies } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {

        async function fetchSkills() {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                
                if(selectedCategory !== 'all') {    
                    params.append('category', selectedCategory)
                }

                if(selectedProficiency !== 'all') {
                    params.append('proficiency', selectedProficiency);
                }

                const response = await axios.get(
                `http://localhost:3000/api/skills?${params.toString()}`,
                {
                    headers: {
                    'Authorization': `Bearer ${cookies.accessToken}`
                    }
                }
                );

                let fetchedSkills = response.data.skills;

                if (searchQuery) { //filter by name or description
                    fetchedSkills = fetchedSkills.filter((skill: Skill) =>
                        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        skill.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                if(sortBy === 'newest') {   //sort by newest
                    fetchedSkills.sort((skill1: Skill, skill2: Skill) => {
                        new Date(skill2.createdAt).getTime() - new Date(skill1.createdAt).getTime()
                    });
                } else if(sortBy === 'rating') {    //sort by rating
                    fetchedSkills.sort((skill1: Skill, skill2: Skill) => {
                        (skill2.userId.rating || 0) - (skill1.userId.rating || 0)
                    });
                }

                setSkills(fetchedSkills);
            } catch(err: any) {
                console.error('Error fetching skills:', err);
                setError('Failed to fetch skills');
            } finally {
                setLoading(false);
            }
            }

            fetchSkills();
        }, [selectedCategory, selectedProficiency, searchQuery, sortBy, cookies.accessToken]); //rerender if the following change in the dependency array

        function handleContact() {
            console.log('Open contact');
        }

        function handleView() {
            console.log('View profile');
        }

        const cards = skills.map((skill: Skill) => {
            return (
                <MarketSkillCard 
                    skill={skill} 
                    handleContact={handleContact} 
                    handleView={handleView} 
                />
            );
        });



    return( 
        <div className="marketplace">
            {/**/}
            <div className='marketplace__hero'>
                <h1 className='marketplace__title'>Skill Marketplace</h1>
                <p className='marketplace__subtitle'>Discover and trade skills with our community</p>
                <div className='marketplace__search'>
                    {/*Add value for input and onChange*/}
                    <Search size={20} className='marketplace__search-icon'/>
                    <input
                        type='text'
                        placeholder='Discover and trade skills with our community'
                        className='marketplace__search-input'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className='marketplace__container'>
                <aside className='marketplace__sidebar'>
                    <div className='filter-section'>
                        <h3 className='filter-section__title'>
                            <Filter size={18} /> Filters
                        </h3>
                    </div>
                   
                    <div className='filter-section'>
                        <h4 className='filter-section__group-title'>Category</h4>
                        <div className='filter-options'>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='all'
                                    checked={selectedCategory === 'all'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>All Categories</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='technology'
                                    checked={selectedCategory === 'technology'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>Technology</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='linguistic'
                                    checked={selectedCategory === 'linguistic'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>Linguistic</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='creative'
                                    checked={selectedCategory === 'creative'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>Creative</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='business'
                                    checked={selectedCategory === 'business'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>Business</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='category'
                                    value='academic'
                                    checked={selectedCategory === 'academic'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <span>Academic</span>
                            </label>
                        </div>
                    </div>

                    <div className='filter-section'>
                        <h4 className='filter-section__group-title'>Proficiency</h4>
                        <div className='filter-options'>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='proficiency'
                                    value='all'
                                    checked={selectedProficiency === 'all'}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                />
                                <span>All Categories</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='proficiency'
                                    value='beginner'
                                    checked={selectedProficiency === 'beginner'}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                />
                                <span>Beginner</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='proficiency'
                                    value='intermediate'
                                    checked={selectedProficiency === 'intermediate'}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                />
                                <span>Intermediate</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='proficiency'
                                    value='advanced'
                                    checked={selectedProficiency === 'advanced'}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                />
                                <span>Advanced</span>
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type='radio'
                                    name='proficiency'
                                    value='expert'
                                    checked={selectedProficiency === 'expert'}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                />
                                <span>Expert</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/*Main Content*/}
                <main className="marketplace__main">
                    {/* Sort Section */}
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

                    {/*Skills grid*/}
                    {loading ? (
                        <div className='marketplace__loading'>Loading skills...</div>
                    ): skills.length > 0 ? 
                    (<div className='marketplace__skills-grid'>
                        {cards}
                    </div>) : 
                        (<div className="marketplace__empty">
                            <p>No skills matching your criteria.</p>
                            <p>Try adjusting your filters or search terms. </p>
                        </div>)
                    }
                </main>

        </div>
    </div>
    );
}