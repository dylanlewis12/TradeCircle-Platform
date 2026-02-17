//import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/components/Navbar.css'; 

const Navbar = () => {
    const location = useLocation();
    const showNavbar = location.pathname !== "/" && location.pathname !== "/register";

    return(
    <nav className="navbar">
        <div className="navbar-left">
            <Link to="/" className="logo">MyBrand</Link>
        </div>
        <div className="navbar-center">
            {/* Conditionally render Navbar */}
            {/*User is active to conditionally render navbar links*/}
            {showNavbar && (
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
                    </ul>    
                    {/*
                        NavBar icon divs
                    */}
                </nav>
            )};
        </div>
    </nav>
    );
};

export default Navbar;