import '../styles/pages/Home.css'; 
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { User, Search, Handshake, BookOpen } from 'lucide-react';
import HomeIcon from '../components/HomeIcon';

export default function Home() {
  const navigate = useNavigate();

  const steps = [
    {
      step: "Step 1",
      icon: <User size={48} color="#169928" />,
      title: "Create Your Profile",
      text: "Add your expertise and what you want to learn"
    },
    {
      step: "Step 2",
      icon: <Search size={48} color="#169928" />,
      title: "Browse Skills",
      text: "Explore thousands of skills offered by our community"
    },
    {
      step: "Step 3",
      icon: <Handshake size={48} color="#169928" />,
      title: "Propose a Trade",
      text: "Connect with someone and start your exchange"
    },
    {
      step: "Step 4",
      icon: <BookOpen size={48} color="#169928" />,
      title: "Learn & Teach",
      text: "Grow together while sharing knowledge"
    },
  ];

  const homeCards = steps.map((step) => (
    <HomeIcon 
      key={step.step} 
      step={step.step} 
      icon={step.icon} 
      title={step.title} 
      text={step.text} 
    /> 
  ));

  function handleStart() {
    navigate('/market-place');
  }

  return (
    <>
      <section className="home-hero">
        <h1 className="home-hero__title">Trade skills and build connections</h1>
      </section>
      
      <section className="home-section">
        <h2 className="home-section__title">How It Works</h2>
        
        <div className="home-section__cards">
          {homeCards}
        </div>

        <button 
          className="home-section__button" 
          onClick={handleStart}
          aria-label="Get started with TradeCircle"
        >
          <span className="home-section__button-text">
            Get Started 
            <ArrowRight size={20} />
          </span>
        </button>
      </section>
    </>
  );
}