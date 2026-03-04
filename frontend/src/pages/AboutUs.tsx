import { useNavigate } from 'react-router-dom';
import '../styles/pages/AboutUs.css';
import { ArrowRight } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

  function handleNavigate() {
    navigate('/dashboard');
  }

  return(
    <>
    <div className="about-us">
      <h1>About TradeCircle</h1>
      
      <section>
        <h2>How It Started</h2>
        <p>
          I got tired of watching talented people struggle to afford the services they needed. 
          I watched a friend need web design help but couldn't afford a designer. Meanwhile, I knew 
          a designer who needed language lessons. That's when it clicked—why can't they just trade?
        </p>
      </section>

      <section>
        <h2>The Problem I'm Solving</h2>
        <p>
          Most online marketplaces are built around one thing: money. But what if you're between jobs? 
          What if you're a student with zero budget but tons of skills? What if you just want to help 
          your community without worrying about cash?
        </p>
        <p>
          I created TradeCircle because I believe value doesn't always come with a price tag. 
          Your skills are worth something. Your time matters. Your expertise deserves recognition.
        </p>
      </section>

      <section>
        <h2>What I'm Building</h2>
        <p>
          A barter-based platform where you can trade what you know for what you need. 
          Want coding help? Offer guitar lessons. Need graphic design? Trade your cooking skills. 
          The possibilities are endless, and the only currency is mutual respect.
        </p>
        <p>
          I'm not just creating a marketplace—I'm building a community where skills flow freely, 
          connections are real, and everyone wins.
        </p>
      </section>

      <section>
        <h2>Why It Matters</h2>
        <p>
          Trading reduces waste, strengthens communities, and levels the playing field. 
          It's sustainable. It's fair. And honestly? It's way more fun than scrolling through 
          price listings.
        </p>
      </section>

      <section className="cta-section">
        <h2>Ready to Join?</h2>
        <p>
          Whether you're looking to trade your expertise or find the help you need, 
          TradeCircle makes it simple. Create a profile, list your skills, and start connecting 
          with people who value what you offer.
        </p>
        <button className='about-button' onClick={handleNavigate}>
            <span className='about-button-text'>
              Get Started
              <ArrowRight size={20} />
            </span>
          </button>
      </section>
    </div>
    </>
  );

}