import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

const renderCard = (
  item = { name: 'pikachu', description: 'Electric mouse' },
  props: { isSelected?: boolean; onToggle?: () => void; onClick?: () => void } = {}
) => {
  return render(
    <table>
      <tbody>
        <Card item={item} {...props} />
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

  it('renders a checkbox', () => {
    renderCard();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox is unchecked by default', () => {
    renderCard();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when isSelected is true', () => {
    renderCard(undefined, { isSelected: true });
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderCard(undefined, { onToggle });
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onToggle = vi.fn();
    renderCard(undefined, { onClick, onToggle });
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies selected class when isSelected is true', () => {
    renderCard(undefined, { isSelected: true });
    const row = screen.getByText('pikachu').closest('tr');
    expect(row).toHaveClass('card-row--selected');
  });
});
