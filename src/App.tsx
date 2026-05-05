import { Component } from 'react';
import Search from './components/Search/Search';
import CardList from './components/CardList/CardList';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ErrorButton from './components/ErrorButton/ErrorButton';
import Loader from './components/Loader/Loader';
import { PokemonItem } from './types';
import { fetchPokemon } from './services/api';
import './App.css';

const STORAGE_KEY = 'pokemon-search-term';

interface AppState {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  lastSearchedTerm: string;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    const savedTerm = localStorage.getItem(STORAGE_KEY) ?? '';
    this.state = {
      items: [],
      loading: false,
      error: null,
      searchTerm: savedTerm,
      lastSearchedTerm: savedTerm,
    };
  }

  componentDidMount() {
    this.performSearch(this.state.searchTerm);
  }

  performSearch = (term: string) => {
    this.setState({ loading: true, error: null });
    fetchPokemon(term, 0)
      .then((result) => {
        this.setState({ items: result.items, loading: false });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        this.setState({ items: [], error: message, loading: false });
      });
  };

  handleSearch = (term: string) => {
    if (term === this.state.lastSearchedTerm) {
      return;
    }
    this.setState({ searchTerm: term, lastSearchedTerm: term });
    localStorage.setItem(STORAGE_KEY, term);
    this.performSearch(term);
  };

  renderContent() {
    const { items, loading, error } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return <CardList items={items} />;
  }

  render() {
    const { searchTerm } = this.state;
    return (
      <ErrorBoundary>
        <div className="app">
          <header className="app-header">
            <h1 className="app-title">Pokémon Search</h1>
          </header>
          <main className="app-main">
            <Search onSearch={this.handleSearch} initialTerm={searchTerm} />
            <section className="results-section">
              {this.renderContent()}
            </section>
            <footer className="app-footer">
              <ErrorButton />
            </footer>
          </main>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
