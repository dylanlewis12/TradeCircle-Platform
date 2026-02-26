import '../styles/components/HomeIcon.css';

export default function HomeIcon({step, icon, title, text}: any) {
    return(
        <>
            <div className="home-card">
                <div className="card-content">
                    <h1 className='card-step'>{step}</h1>
                    <div className="card-icon">
                        {icon}
                    </div>
                    <h2 className='card-title'>{title}</h2>
                    <h3 className='card-text'>{text}</h3>
                </div>
            </div>
        </>
    )
}