import { PokemonItem } from '../../types';
import './Card.css';

interface CardProps {
  item: PokemonItem;
  onClick?: () => void;
}

function Card({ item, onClick }: CardProps) {
  return (
    <tr className="card-row" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <td className="card-name">{item.name}</td>
      <td className="card-description">{item.description}</td>
    </tr>
  );
}

export default Card;
