import { create } from 'zustand';
import { PokemonItem } from '../types';

const STORAGE_KEY = 'pokemon-search-term';

interface AppState {
  searchTerm: string;
  selectedItems: PokemonItem[];

  setSearchTerm: (term: string) => void;
  toggleItem: (item: PokemonItem) => void;
  unselectAll: () => void;
  isSelected: (name: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  searchTerm: localStorage.getItem(STORAGE_KEY) ?? '',
  selectedItems: [],

  setSearchTerm: (term: string) => {
    localStorage.setItem(STORAGE_KEY, term);
    set({ searchTerm: term });
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
