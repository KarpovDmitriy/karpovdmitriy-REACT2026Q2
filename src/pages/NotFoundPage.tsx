import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Page not found</p>
      <p className="not-found-subtext">
        The page you are looking for does not exist.
      </p>
      <Link to="/?page=1" className="not-found-link">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
