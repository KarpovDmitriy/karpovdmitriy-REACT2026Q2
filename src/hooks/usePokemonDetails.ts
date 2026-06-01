import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetails } from '../services/api';

export function usePokemonDetails(name: string | undefined) {
  return useQuery({
    queryKey: ['pokemon-detail', name],
    queryFn: () => fetchPokemonDetails(name!),
    enabled: !!name,
  });
}
