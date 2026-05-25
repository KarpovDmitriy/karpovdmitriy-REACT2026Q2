import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './services/api';
import { useAppStore } from './store/useAppStore';

vi.mock('./services/api');
const mockedFetchPokemon = vi.mocked(api.fetchPokemon);

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

describe('App', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useAppStore.setState({
      items: [],
      total: 0,
      loading: false,
      error: null,
      searchTerm: '',
    });
    mockedFetchPokemon.mockResolvedValue(mockPokemonList);
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders the app header with title', async () => {
    render(<App />);
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('renders the search input and button', async () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search Pokémon by name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('renders the "Throw Error" button', async () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Throw Error' })).toBeInTheDocument();
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('calls fetchPokemon on mount with empty string by default', async () => {
    render(<App />);
    await waitFor(() => {
      expect(mockedFetchPokemon).toHaveBeenCalledWith('', 0);
    });
  });

  it('displays fetched pokemon data', async () => {
    render(<App />);
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

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolvePromise(mockPokemonList);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('displays an error message when API call fails', async () => {
    mockedFetchPokemon.mockRejectedValue(new Error('Network failure'));

    render(<App />);
    expect(await screen.findByText('Network failure')).toBeInTheDocument();
  });

  it('handles non-Error rejection gracefully', async () => {
    mockedFetchPokemon.mockRejectedValue('string error');

    render(<App />);
    expect(await screen.findByText('An unknown error occurred.')).toBeInTheDocument();
  });

  it('clears previous results when an error occurs', async () => {
    mockedFetchPokemon.mockRejectedValue(new Error('Fail'));

    render(<App />);
    await screen.findByText('Fail');

    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('performs search when user types and clicks Search', async () => {
    const user = userEvent.setup();
    mockedFetchPokemon.mockResolvedValueOnce(mockPokemonList);
    mockedFetchPokemon.mockResolvedValueOnce(mockSinglePokemon);

    render(<App />);
    await screen.findByText('bulbasaur');

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'pikachu');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    expect(mockedFetchPokemon).toHaveBeenCalledWith('pikachu', 0);
  });

  it('does not call API again if the same term is searched', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, 'pikachu');
    useAppStore.setState({ searchTerm: 'pikachu' });
    mockedFetchPokemon.mockResolvedValue(mockSinglePokemon);

    render(<App />);
    await screen.findByText('pikachu');
    expect(mockedFetchPokemon).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockedFetchPokemon).toHaveBeenCalledTimes(1);
  });

  it('reads saved search term from localStorage on mount', async () => {
    localStorage.setItem(STORAGE_KEY, 'mewtwo');
    useAppStore.setState({ searchTerm: 'mewtwo' });
    mockedFetchPokemon.mockResolvedValue(mockSinglePokemon);

    render(<App />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    expect(input).toHaveValue('mewtwo');
    await waitFor(() => {
      expect(mockedFetchPokemon).toHaveBeenCalledWith('mewtwo', 0);
    });
  });

  it('displays empty input when localStorage is empty', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    expect(input).toHaveValue('');
    await waitFor(() => expect(mockedFetchPokemon).toHaveBeenCalled());
  });

  it('saves search term to localStorage on search', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('bulbasaur');

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'eevee');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(localStorage.getItem(STORAGE_KEY)).toBe('eevee');
  });

  it('overwrites existing localStorage value on new search', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, 'old-term');
    useAppStore.setState({ searchTerm: 'old-term' });
    mockedFetchPokemon.mockResolvedValue(mockSinglePokemon);

    render(<App />);
    await screen.findByText('pikachu');

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.clear(input);
    await user.type(input, 'new-term');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(localStorage.getItem(STORAGE_KEY)).toBe('new-term');
  });

  it('shows error boundary fallback when ErrorButton is clicked', async () => {
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText('bulbasaur');

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error triggered by ErrorButton.')).toBeInTheDocument();
  });
});
