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
  selectedItems: PokemonItem[];

  setSearchTerm: (term: string) => void;
  fetchItems: (term: string, page: number) => void;
  toggleItem: (item: PokemonItem) => void;
  unselectAll: () => void;
  isSelected: (name: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  searchTerm: localStorage.getItem(STORAGE_KEY) ?? '',
  selectedItems: [],

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

  toggleItem: (item: PokemonItem) => {
    const { selectedItems } = get();
    const exists = selectedItems.some((s) => s.name === item.name);
    if (exists) {
      set({ selectedItems: selectedItems.filter((s) => s.name !== item.name) });
    } else {
      set({ selectedItems: [...selectedItems, item] });
    }
  },

  unselectAll: () => {
    set({ selectedItems: [] });
  },

  isSelected: (name: string) => {
    return get().selectedItems.some((s) => s.name === name);
  },
}));
