import { useEffect, useState, useCallback, useRef } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import Loader from '../components/Loader/Loader';
import Pagination from '../components/Pagination/Pagination';
import ErrorButton from '../components/ErrorButton/ErrorButton';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchPokemon } from '../services/api';
import { PokemonItem } from '../types';
import './MainPage.css';

const PAGE_SIZE = 10;

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get('page')) || 1;
  const hasDetails = location.pathname.startsWith('/details/');

  const [savedTerm, setSavedTerm] = useLocalStorage('pokemon-search-term', '');
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSearchedTerm = useRef(savedTerm);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const performSearch = useCallback((term: string, page: number) => {
    setLoading(true);
    setError(null);
    fetchPokemon(term, page - 1)
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        setItems([]);
        setTotal(0);
        setError(message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    performSearch(savedTerm, currentPage);
  }, [currentPage, performSearch, savedTerm]);

  const handleSearch = (term: string) => {
    if (term === lastSearchedTerm.current) return;
    lastSearchedTerm.current = term;
    setSavedTerm(term);
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: String(page) };
    setSearchParams(params);
  };

  const handleItemClick = (name: string) => {
    navigate(`/details/${name}?page=${currentPage}`);
  };

  const handleMainClick = () => {
    if (hasDetails) {
      navigate(`/?page=${currentPage}`);
    }
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;
    return (
      <>
        <CardList items={items} onItemClick={handleItemClick} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className={`main-page ${hasDetails ? 'main-page--split' : ''}`}>
      <div className="main-page-left" onClick={handleMainClick}>
        <Search onSearch={handleSearch} initialTerm={savedTerm} />
        <section className="results-section">{renderContent()}</section>
        <footer className="app-footer">
          <ErrorButton />
        </footer>
      </div>
      {hasDetails && (
        <aside className="main-page-right">
          <Outlet />
        </aside>
      )}
    </div>
  );
}

export default MainPage;
