import { useRef } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import Loader from '../components/Loader/Loader';
import Pagination from '../components/Pagination/Pagination';
import ErrorButton from '../components/ErrorButton/ErrorButton';
import { useAppStore } from '../store/useAppStore';
import { usePokemonList } from '../hooks/usePokemonList';
import './MainPage.css';

const PAGE_SIZE = 10;

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get('page')) || 1;
  const hasDetails = location.pathname.startsWith('/details/');
  const { searchTerm, selectedItems, setSearchTerm, toggleItem } = useAppStore();
  const lastSearchedTerm = useRef(searchTerm);
  const { data, isLoading, error } = usePokemonList(searchTerm, currentPage);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = (term: string) => {
    if (term === lastSearchedTerm.current) return;
    lastSearchedTerm.current = term;
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };
  const handlePageChange = (page: number) => { setSearchParams({ page: String(page) }); };
  const handleItemClick = (name: string) => { navigate(`/details/${name}?page=${currentPage}`); };
  const handleMainClick = () => { if (hasDetails) navigate(`/?page=${currentPage}`); };

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      return <div className="error-message">{message}</div>;
    }
    return (
      <>
        <CardList items={items} onItemClick={handleItemClick} selectedItems={selectedItems} onToggleItem={toggleItem} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  };

  return (
    <div className={`main-page ${hasDetails ? 'main-page--split' : ''}`}>
      <div className="main-page-left" onClick={handleMainClick}>
        <Search onSearch={handleSearch} initialTerm={searchTerm} />
        <section className="results-section">{renderContent()}</section>
        <footer className="app-footer"><ErrorButton /></footer>
      </div>
      {hasDetails && (<aside className="main-page-right"><Outlet /></aside>)}
    </div>
  );
}

export default MainPage;
