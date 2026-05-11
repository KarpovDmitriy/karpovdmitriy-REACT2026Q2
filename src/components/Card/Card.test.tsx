import { render, screen } from '@testing-library/react';
import Card from './Card';

const renderCard = (item = { name: 'pikachu', description: 'Electric mouse' }) => {
  return render(
    <table>
      <tbody>
        <Card item={item} />
      </tbody>
    </table>
  );
};

describe('Card', () => {
  it('displays item name', () => {
    renderCard();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('displays item description', () => {
    renderCard();
    expect(screen.getByText('Electric mouse')).toBeInTheDocument();
  });

  it('renders as a table row', () => {
    renderCard();
    const row = screen.getByText('pikachu').closest('tr');
    expect(row).toBeInTheDocument();
  });

  it('displays different item data correctly', () => {
    renderCard({ name: 'bulbasaur', description: 'A seed Pokémon' });
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('A seed Pokémon')).toBeInTheDocument();
  });

  it('handles empty description gracefully', () => {
    renderCard({ name: 'charmander', description: '' });
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });
});
