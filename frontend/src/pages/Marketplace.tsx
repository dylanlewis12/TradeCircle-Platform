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