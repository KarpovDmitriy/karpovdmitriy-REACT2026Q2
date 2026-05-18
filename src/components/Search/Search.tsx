import { useState } from 'react';
import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
  initialTerm: string;
}

function Search({ onSearch, initialTerm }: SearchProps) {
  const [inputValue, setInputValue] = useState(initialTerm);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="search-section">
      <input
        type="text"
        className="search-input"
        placeholder="Search Pokémon by name..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </section>
  );
}

export default Search;
