import { NavLink } from "react-router-dom"

export default function NavBar() {
    
    const showNavbar =
    location.pathname !== "/" && location.pathname !== "/register";

    return 
    <div>
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
}