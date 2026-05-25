import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import Loader from '../components/Loader/Loader';
import Pagination from '../components/Pagination/Pagination';
import ErrorButton from '../components/ErrorButton/ErrorButton';
import { useAppStore } from '../store/useAppStore';
import './MainPage.css';

const PAGE_SIZE = 10;

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get('page')) || 1;
  const hasDetails = location.pathname.startsWith('/details/');

  const { items, total, loading, error, searchTerm, setSearchTerm, fetchItems } =
    useAppStore();

  const lastSearchedTerm = useRef(searchTerm);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    fetchItems(searchTerm, currentPage);
  }, [currentPage, fetchItems, searchTerm]);

  const handleSearch = (term: string) => {
    if (term === lastSearchedTerm.current) return;
    lastSearchedTerm.current = term;
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
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
        <Search onSearch={handleSearch} initialTerm={searchTerm} />
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
