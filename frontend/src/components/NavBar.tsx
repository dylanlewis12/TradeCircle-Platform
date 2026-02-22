//import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/components/Navbar.css'; 
import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const showNavbar = location.pathname !== "/" && location.pathname !== "/register";

    return(
    <nav className="navbar">
        <div className="navbar-left">
            <Link to="/home" className="logo"><img src='logo.svg' alt='logo'/></Link>
        </div>
        <div className="navbar-center">
            {/* Conditionally render Navbar */}
            {/*User is active to conditionally render navbar links*/}
            {showNavbar && (
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
                        <li><NavLink to="/market-place" className={({ isActive }) => (isActive ? "active" : "")}>Marketplace</NavLink></li>
                        <li><NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>Explore Skills</NavLink></li>
                        <li><NavLink to="/community" className={({ isActive }) => (isActive ? "active" : "")}>Community</NavLink></li>
                        <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About Us</NavLink></li>
                        <li><NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>Messages</NavLink></li>
                    </ul>    
                    {/*
                        NavBar icon divs
                    */}
                </nav>
            )}
        </div>
        <div className='navbar-right'>
            <ul>
                <li><Search size={10}/></li>
                <li><Bell size={10}/></li>
                <li><User size={10}/></li>
            </ul>
        </div>
    </nav>
    );
};

export default Navbar;