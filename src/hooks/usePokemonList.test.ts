import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonList } from './usePokemonList';
import { TestQueryProvider } from '../test-utils/queryWrapper';
import * as api from '../services/api';

vi.mock('../services/api');
const mockedFetchPokemon = vi.mocked(api.fetchPokemon);

const mockResult = {
  items: [
    { name: 'bulbasaur', description: 'A seed' },
    { name: 'ivysaur', description: 'A plant' },
  ],
  total: 100,
};

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchPokemon.mockResolvedValue(mockResult);
  });

  it('returns loading state initially', () => {
    mockedFetchPokemon.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonList('', 1), {
      wrapper: TestQueryProvider,
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns data after loading', async () => {
    const { result } = renderHook(() => usePokemonList('', 1), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResult);
  });

  it('calls fetchPokemon with correct parameters', async () => {
    const { result } = renderHook(() => usePokemonList('pikachu', 3), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedFetchPokemon).toHaveBeenCalledWith('pikachu', 2);
  });

  it('returns error when API fails', async () => {
    mockedFetchPokemon.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => usePokemonList('', 1), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('uses different query keys for different params', async () => {
    const { result: result1 } = renderHook(() => usePokemonList('', 1), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    const { result: result2 } = renderHook(() => usePokemonList('', 2), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false);
    });

    expect(mockedFetchPokemon).toHaveBeenCalledTimes(2);
  });
});
