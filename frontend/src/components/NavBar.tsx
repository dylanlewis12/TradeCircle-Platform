import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/components/Navbar.css'; 
import { LogOut, Bell, User } from 'lucide-react';
import logo from '../styles/images/logo.png';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext/AuthContext.js';
import UserModal from './UserModal.jsx';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal.jsx';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const showNavbar = location.pathname !== "/" && location.pathname !== "/register";

  //const { user } = useAuth();
  

  /*
  const handleAccountUpdate = (event: any) => {
    event.preventDefault();
  };
  */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const [isLogout, setIsLogout] = useState(false); //handles logout modal

  const handleOpenLogout = () => setIsLogout(true);
  const handleCloseLogout = () => setIsLogout(false);


  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); //Logout of application, resets token, and sets user to null
        navigate('/');
    }

  /*
  //Logout - revoke refresh token
``export const userLogout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        if(refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }

        res.clearCookie('refreshToken');

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}``
  */



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
          <li className="navbar__icon-item navbar__icon-item--bell">
            <Bell size={24} />
          </li>
          <li 
            className="navbar__icon-item navbar__icon-item--user" 
            onClick={(e) => { e.stopPropagation(); handleModalOpen(); }}
            >
            <User size={24} />
            </li>
          <li className="navbar__icon-item navbar__icon-item--logout"
            onClick={(e) => {e.stopPropagation(); handleOpenLogout(); }}
            >
            <LogOut size={24} />
          </li>
        </ul>
        {<UserModal isOpen={isModalOpen} onClose={handleModalClose}></UserModal>}
        {<LogoutModal isOpen={isLogout} handleLogout={handleLogout} onClose={handleCloseLogout}>Are you sure you want to logout?</LogoutModal>}
      </div>
    </nav>
  );
};

