import { Routes, Route } from 'react-router-dom';
import About from './components/Pages/About.tsx'
import Chat from './components/Pages/Chat.tsx'
import Community from './components/Pages/Community.tsx'
import Explore from './components/Pages/Explore.tsx'
import Home from './components/Pages/Home.tsx'
import Login from './components/Pages/Login.tsx'
import Register from './components/Pages/Register.tsx'
import Marketplace from './components/Pages/Marketplace.tsx'
import './App.css'

function App() {

  return (
    <>
      {/*Routes*/}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/market-place" element={<Marketplace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </>
  );
}

export default App;
