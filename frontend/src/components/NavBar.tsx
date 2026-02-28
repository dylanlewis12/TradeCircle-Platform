import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/components/Navbar.css'; 
import { Search, Bell, User } from 'lucide-react';
import logo from '../styles/images/logo.png';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext/AuthContext.js';
import UserModal from './UserModal.jsx';


const Navbar = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/" && location.pathname !== "/register";
  
  const { user } = useAuth();
  

  const handleAccountUpdate = (event: any) => {
    event.preventDefault();
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  /*
  useEffect(() => {
    // Important: Wait for user to load
    if (!user?.id) return;

    const fetchTradeCount = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/trades/count',
          {
            headers: {
              Authorization: `Bearer ${cookies.accessToken}`
            }
          }
        );
        setTradeCount(response.data.totalTrades);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTradeCount();
  }, [user?.id, cookies.accessToken]); // Re-run if user changes
  */


  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/home" className="navbar__logo-link">
          <img src={logo} alt="TradeCircle logo" className="navbar__logo-image" />
        </Link>
      </div>

      <div className="navbar__menu">
        {showNavbar && (
          <ul className="navbar__links">
            <li className="navbar__item">
              <NavLink 
                to="/home" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                Home
              </NavLink>
            </li>
            <li className="navbar__item">
              <NavLink 
                to="/market-place" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                Marketplace
              </NavLink>
            </li>
            <li className="navbar__item">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="navbar__item">
              <NavLink 
                to="/community" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                Community
              </NavLink>
            </li>
            <li className="navbar__item">
              <NavLink 
                to="/about" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                About Us
              </NavLink>
            </li>
            <li className="navbar__item">
              <NavLink 
                to="/chat" 
                className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}
              >
                Messages
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      <div className="navbar__actions">
        <ul className="navbar__icon-list">
          <li className="navbar__icon-item navbar__icon-item--search">
            <Search size={24} />
          </li>
          <li className="navbar__icon-item navbar__icon-item--bell">
            <Bell size={24} />
          </li>
          <li 
            className="navbar__icon-item navbar__icon-item--user" 
            onClick={(e) => { e.stopPropagation(); handleOpen(); }}
            >
            <User size={24} />
            </li>
            <UserModal isOpen={isOpen} onClose={handleClose}></UserModal>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;