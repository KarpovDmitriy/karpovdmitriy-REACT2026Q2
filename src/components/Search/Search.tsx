import { Component } from 'react';
import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
  initialTerm: string;
}

interface SearchState {
  inputValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.initialTerm,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.inputValue.trim();
    this.props.onSearch(trimmed);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    return (
      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search Pokémon by name..."
          value={this.state.inputValue}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <button className="search-button" onClick={this.handleSearch}>
          Search
        </button>
      </section>
    );
  }
}

export default Search;
