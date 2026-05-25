import { useAppStore } from './useAppStore';
import * as api from '../services/api';

vi.mock('../services/api');
const mockedFetchPokemon = vi.mocked(api.fetchPokemon);

const STORAGE_KEY = 'pokemon-search-term';

describe('useAppStore', () => {
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
  });

  it('has correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.searchTerm).toBe('');
  });

  it('setSearchTerm updates state and localStorage', () => {
    useAppStore.getState().setSearchTerm('pikachu');
    expect(useAppStore.getState().searchTerm).toBe('pikachu');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pikachu');
  });

  it('fetchItems sets loading to true and then updates items', async () => {
    mockedFetchPokemon.mockResolvedValue({
      items: [{ name: 'bulbasaur', description: 'A seed' }],
      total: 1,
    });

    useAppStore.getState().fetchItems('', 1);
    expect(useAppStore.getState().loading).toBe(true);

    await vi.waitFor(() => {
      expect(useAppStore.getState().loading).toBe(false);
    });

    expect(useAppStore.getState().items).toHaveLength(1);
    expect(useAppStore.getState().items[0].name).toBe('bulbasaur');
    expect(useAppStore.getState().total).toBe(1);
  });

  it('fetchItems sets error on failure', async () => {
    mockedFetchPokemon.mockRejectedValue(new Error('Network error'));

    useAppStore.getState().fetchItems('', 1);

    await vi.waitFor(() => {
      expect(useAppStore.getState().loading).toBe(false);
    });

    expect(useAppStore.getState().error).toBe('Network error');
    expect(useAppStore.getState().items).toEqual([]);
    expect(useAppStore.getState().total).toBe(0);
  });

  it('fetchItems handles non-Error rejections', async () => {
    mockedFetchPokemon.mockRejectedValue('string error');

    useAppStore.getState().fetchItems('', 1);

    await vi.waitFor(() => {
      expect(useAppStore.getState().loading).toBe(false);
    });

    expect(useAppStore.getState().error).toBe('An unknown error occurred.');
  });

  it('fetchItems passes correct page offset', async () => {
    mockedFetchPokemon.mockResolvedValue({ items: [], total: 0 });

    useAppStore.getState().fetchItems('test', 3);

    await vi.waitFor(() => {
      expect(useAppStore.getState().loading).toBe(false);
    });

    expect(mockedFetchPokemon).toHaveBeenCalledWith('test', 2);
  });
});
