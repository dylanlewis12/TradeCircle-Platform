import { Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs.tsx';
import Chat from './pages/Chat.tsx';
import Community from './pages/Community.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Marketplace from './pages/Marketplace.tsx';
import './App.css';
import Navbar from './components/NavBar.tsx';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  // Define an array of routes where the navbar should be hidden
  const excludedRoutes = ['/', '/register'];

  return (
    <>
        {/* Conditionally render the Navbar */}
        {!excludedRoutes.includes(location.pathname) && <Navbar />}
        
        {/*Routes*/}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/community" element={<Community />} />
          <Route path="/market-place" element={<Marketplace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  );
}

export default App;
