import { PokemonItem } from '../../types';
import './Card.css';

interface CardProps {
  item: PokemonItem;
  isSelected?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

function Card({ item, isSelected = false, onToggle, onClick }: CardProps) {
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <tr
      className={`card-row ${isSelected ? 'card-row--selected' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <td className="card-checkbox-cell">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          onClick={handleCheckboxChange}
          className="card-checkbox"
        />
      </td>
      <td className="card-name">{item.name}</td>
      <td className="card-description">{item.description}</td>
    </tr>
  );
}

export default Card;
