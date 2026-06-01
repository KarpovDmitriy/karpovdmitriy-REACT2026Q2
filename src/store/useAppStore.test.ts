import { useAppStore } from './useAppStore';

const STORAGE_KEY = 'pokemon-search-term';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({ searchTerm: '', selectedItems: [] });
  });

  it('has correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.searchTerm).toBe('');
    expect(state.selectedItems).toEqual([]);
  });

  it('setSearchTerm updates state and localStorage', () => {
    useAppStore.getState().setSearchTerm('pikachu');
    expect(useAppStore.getState().searchTerm).toBe('pikachu');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pikachu');
  });

  describe('selected items', () => {
    const item1 = { name: 'pikachu', description: 'Electric' };
    const item2 = { name: 'bulbasaur', description: 'Seed' };

    it('toggleItem adds an item to selectedItems', () => {
      useAppStore.getState().toggleItem(item1);
      expect(useAppStore.getState().selectedItems).toEqual([item1]);
    });

    it('toggleItem removes an item if already selected', () => {
      useAppStore.setState({ selectedItems: [item1] });
      useAppStore.getState().toggleItem(item1);
      expect(useAppStore.getState().selectedItems).toEqual([]);
    });

    it('toggleItem handles multiple items', () => {
      useAppStore.getState().toggleItem(item1);
      useAppStore.getState().toggleItem(item2);
      expect(useAppStore.getState().selectedItems).toEqual([item1, item2]);
    });

    it('unselectAll clears all selected items', () => {
      useAppStore.setState({ selectedItems: [item1, item2] });
      useAppStore.getState().unselectAll();
      expect(useAppStore.getState().selectedItems).toEqual([]);
    });

    it('isSelected returns true for selected items', () => {
      useAppStore.setState({ selectedItems: [item1] });
      expect(useAppStore.getState().isSelected('pikachu')).toBe(true);
    });

    it('isSelected returns false for unselected items', () => {
      expect(useAppStore.getState().isSelected('pikachu')).toBe(false);
    });
  });
});
