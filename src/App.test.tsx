import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import * as api from './services/api';
import { useAppStore } from './store/useAppStore';
import { ThemeProvider } from './context/ThemeContext';
import MainPage from './pages/MainPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Flyout from './components/Flyout/Flyout';
import DetailPanel from './components/DetailPanel/DetailPanel';

vi.mock('./services/api');
const mockedFetchPokemon = vi.mocked(api.fetchPokemon);
const mockedFetchDetails = vi.mocked(api.fetchPokemonDetails);

const STORAGE_KEY = 'pokemon-search-term';

const mockPokemonList = {
  items: [
    { name: 'bulbasaur', description: 'A seed Pokémon' },
    { name: 'charmander', description: 'A fire lizard' },
  ],
  total: 2,
};

const mockSinglePokemon = {
  items: [{ name: 'pikachu', description: 'Electric mouse' }],
  total: 1,
};

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });
}

function renderApp(initialRoute = '/?page=1') {
  const client = createTestClient();
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <ErrorBoundary>
            <div className="app">
              <header>
                <h1>Pokémon Search</h1>
                <nav>
                  <Link to="/?page=1">Home</Link>
                  <Link to="/about">About</Link>
                </nav>
              </header>
              <main>
                <Routes>
                  <Route path="/" element={<MainPage />}>
                    <Route path="details/:name" element={<DetailPanel />} />
                  </Route>
                </Routes>
              </main>
              <Flyout />
            </div>
          </ErrorBoundary>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('App', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useAppStore.setState({ searchTerm: '', selectedItems: [] });
    mockedFetchPokemon.mockResolvedValue(mockPokemonList);
    mockedFetchDetails.mockResolvedValue({
      name: 'pikachu',
      description: 'Electric',
      height: 4,
      weight: 60,
      types: ['electric'],
      sprite: null,
    });
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders the app header with title', async () => {
    renderApp();
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('renders the search input and button', async () => {
    renderApp();
    expect(screen.getByPlaceholderText('Search Pokémon by name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('calls fetchPokemon on mount with empty string by default', async () => {
    renderApp();
    await waitFor(() => {
      expect(mockedFetchPokemon).toHaveBeenCalledWith('', 0);
    });
  });

  it('displays fetched pokemon data', async () => {
    renderApp();
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  it('shows loading indicator while data is being fetched', async () => {
    let resolvePromise!: (value: typeof mockPokemonList) => void;
    mockedFetchPokemon.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderApp();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolvePromise(mockPokemonList);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('displays an error message when API call fails', async () => {
    mockedFetchPokemon.mockRejectedValue(new Error('Network failure'));
    renderApp();
    expect(await screen.findByText(/Unable to connect/)).toBeInTheDocument();
  });

  it('performs search when user types and clicks Search', async () => {
    const user = userEvent.setup();
    mockedFetchPokemon.mockResolvedValueOnce(mockPokemonList);
    mockedFetchPokemon.mockResolvedValueOnce(mockSinglePokemon);

    renderApp();
    await screen.findByText('bulbasaur');

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'pikachu');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    expect(mockedFetchPokemon).toHaveBeenCalledWith('pikachu', 0);
  });

  it('reads saved search term from localStorage on mount', async () => {
    localStorage.setItem(STORAGE_KEY, 'mewtwo');
    useAppStore.setState({ searchTerm: 'mewtwo' });
    mockedFetchPokemon.mockResolvedValue(mockSinglePokemon);

    renderApp();

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    expect(input).toHaveValue('mewtwo');
    await waitFor(() => {
      expect(mockedFetchPokemon).toHaveBeenCalledWith('mewtwo', 0);
    });
  });

  it('saves search term to localStorage on search', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('bulbasaur');

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'eevee');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(localStorage.getItem(STORAGE_KEY)).toBe('eevee');
  });

  it('shows error boundary fallback when ErrorButton is clicked', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('bulbasaur');

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
