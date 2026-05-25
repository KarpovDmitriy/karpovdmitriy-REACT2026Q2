import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import MainPage from './pages/MainPage';
import DetailPanel from './components/DetailPanel/DetailPanel';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Flyout from './components/Flyout/Flyout';
import './App.css';

function AppLayout() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Pokémon Search</h1>
          <nav className="app-nav">
            <Link to="/?page=1" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route path="details/:name" element={<DetailPanel />} />
            </Route>
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Flyout />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
