import '../styles/pages/Home.css'; 
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    //let cardStyle = {

    //}

    function handleStart() {
        navigate('/market-place');
    }
    return <>
        <div className="hero">
            <h1>Trade skills and build connections</h1>
        </div>
        <div className='home-section'>
            <h1>How It Works</h1>
            {/*
            <div className='home-cards' style={{cardStyle}}>
            
            </div>
            */}
            <button className='start-btn' onClick={handleStart}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Get Started <ArrowRight /></span>
            </button>
        </div>
    </>
}

/*
Step 1: Create Profile (icon: person)
Step 2: Offer Your Skills (icon: star)
Step 3: Start Trading (icon: handshake)
*/