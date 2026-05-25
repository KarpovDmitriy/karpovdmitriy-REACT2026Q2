import { PokemonItem } from '../../types';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: PokemonItem[];
  onItemClick?: (name: string) => void;
  selectedItems?: PokemonItem[];
  onToggleItem?: (item: PokemonItem) => void;
}

function CardList({ items, onItemClick, selectedItems = [], onToggleItem }: CardListProps) {
  if (items.length === 0) {
    return <p className="no-results">No results found.</p>;
  }

  const isSelected = (name: string) =>
    selectedItems.some((s) => s.name === name);

  return (
    <table className="card-list">
      <thead>
        <tr>
          <th className="card-list-header card-list-header--checkbox"></th>
          <th className="card-list-header">Name</th>
          <th className="card-list-header">Description</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <Card
            key={item.name}
            item={item}
            isSelected={isSelected(item.name)}
            onToggle={onToggleItem ? () => onToggleItem(item) : undefined}
            onClick={onItemClick ? () => onItemClick(item.name) : undefined}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CardList;
