import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { PokemonItem } from '../../types';

const mockItems: PokemonItem[] = [
  { name: 'pikachu', description: 'Electric mouse' },
  { name: 'bulbasaur', description: 'Seed Pokémon' },
  { name: 'charmander', description: 'Fire lizard' },
];

describe('CardList', () => {
  it('renders "No results found." when items array is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('does not render a table when items array is empty', () => {
    const { container } = render(<CardList items={[]} />);
    expect(container.querySelector('table')).not.toBeInTheDocument();
  });

  it('renders the correct number of items', () => {
    render(<CardList items={mockItems} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('renders table headers "Name" and "Description"', () => {
    render(<CardList items={mockItems} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays all item names', () => {
    render(<CardList items={mockItems} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  it('displays all item descriptions', () => {
    render(<CardList items={mockItems} />);
    expect(screen.getByText('Electric mouse')).toBeInTheDocument();
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Fire lizard')).toBeInTheDocument();
  });

  it('renders a single item correctly', () => {
    render(<CardList items={[mockItems[0]]} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2); // header + 1 data row
  });
});
