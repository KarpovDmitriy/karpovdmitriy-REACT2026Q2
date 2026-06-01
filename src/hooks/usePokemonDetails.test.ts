import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonDetails } from './usePokemonDetails';
import { TestQueryProvider } from '../test-utils/queryWrapper';
import * as api from '../services/api';

vi.mock('../services/api');
const mockedFetchDetails = vi.mocked(api.fetchPokemonDetails);

const mockDetail = {
  name: 'pikachu',
  description: 'Electric mouse',
  height: 4,
  weight: 60,
  types: ['electric'],
  sprite: 'https://example.com/pikachu.png',
};

describe('usePokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchDetails.mockResolvedValue(mockDetail);
  });

  it('returns loading state initially', () => {
    mockedFetchDetails.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonDetails('pikachu'), {
      wrapper: TestQueryProvider,
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns detail data after loading', async () => {
    const { result } = renderHook(() => usePokemonDetails('pikachu'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDetail);
  });

  it('calls fetchPokemonDetails with correct name', async () => {
    const { result } = renderHook(() => usePokemonDetails('bulbasaur'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedFetchDetails).toHaveBeenCalledWith('bulbasaur');
  });

  it('does not fetch when name is undefined', () => {
    const { result } = renderHook(() => usePokemonDetails(undefined), {
      wrapper: TestQueryProvider,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedFetchDetails).not.toHaveBeenCalled();
  });

  it('returns error when API fails', async () => {
    mockedFetchDetails.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => usePokemonDetails('unknown'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
