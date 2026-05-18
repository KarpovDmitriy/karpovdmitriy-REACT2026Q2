import { PokemonItem } from '../../types';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: PokemonItem[];
  onItemClick?: (name: string) => void;
}

function CardList({ items, onItemClick }: CardListProps) {
  if (items.length === 0) {
    return <p className="no-results">No results found.</p>;
  }

  return (
    <table className="card-list">
      <thead>
        <tr>
          <th className="card-list-header">Name</th>
          <th className="card-list-header">Description</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <Card
            key={item.name}
            item={item}
            onClick={onItemClick ? () => onItemClick(item.name) : undefined}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CardList;
