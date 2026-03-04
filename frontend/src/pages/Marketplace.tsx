import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import '../styles/pages/Marketplace.css';
import axios from 'axios';
import { useAuth } from '../context/authContext/AuthContext';

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
                    />
                </div>
            </div>
            
            <div className='marketplace__container'>
                <aside className='marketplace__sidebar'>
                    <div className='filter-section'>
                        <h3 className='filter-section__title'>
                            <Filter size={18} />      Filters
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
            </div>

            {/*Main Content*/}
            <main className="marketplace__main">
                
                <div className="marketplace__empty">
                    <p>No skills matching your criteria.</p>
                    <p>Try adjusting your filters or search terms. </p>
                </div>
            </main>
        </div>
    );
}