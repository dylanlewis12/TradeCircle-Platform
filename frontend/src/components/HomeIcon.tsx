import '../styles/components/HomeIcon.css';

export default function HomeIcon({ step, icon, title, text }: any) {
  return (
    <div className="home-card">
      <h1 className="home-card__step">{step}</h1>
      <div className="home-card__icon">
        {icon}
      </div>
      <h2 className="home-card__title">{title}</h2>
      <p className="home-card__text">{text}</p>
    </div>
  );
}