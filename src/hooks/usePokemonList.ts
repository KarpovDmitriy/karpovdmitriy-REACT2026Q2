import { useQuery } from '@tanstack/react-query';
import { fetchPokemon } from '../services/api';

export function usePokemonList(searchTerm: string, page: number) {
  return useQuery({
    queryKey: ['pokemon-list', searchTerm, page],
    queryFn: () => fetchPokemon(searchTerm, page - 1),
  });
}
