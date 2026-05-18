import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="about-title">About</h1>
      <p className="about-text">
        This application was created by <strong>Dmitriy Karpov</strong> as part of the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="about-link"
        >
          RS School React Course
        </a>
        .
      </p>
      <p className="about-text">
        It allows you to search and browse Pokémon using the PokéAPI.
      </p>
      <Link to="/?page=1" className="about-back">
        ← Back to Home
      </Link>
    </div>
  );
}

export default AboutPage;
