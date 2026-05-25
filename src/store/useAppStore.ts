import { create } from 'zustand';
import { PokemonItem } from '../types';
import { fetchPokemon } from '../services/api';

const STORAGE_KEY = 'pokemon-search-term';

interface AppState {
  items: PokemonItem[];
  total: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;

  setSearchTerm: (term: string) => void;
  fetchItems: (term: string, page: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  searchTerm: localStorage.getItem(STORAGE_KEY) ?? '',

  setSearchTerm: (term: string) => {
    localStorage.setItem(STORAGE_KEY, term);
    set({ searchTerm: term });
  },

  fetchItems: (term: string, page: number) => {
    set({ loading: true, error: null });
    fetchPokemon(term, page - 1)
      .then((result) => {
        set({ items: result.items, total: result.total, loading: false });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        set({ items: [], total: 0, error: message, loading: false });
      });
  },
}));
