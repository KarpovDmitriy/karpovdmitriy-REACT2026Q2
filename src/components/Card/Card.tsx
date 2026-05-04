import { Component } from 'react';
import { PokemonItem } from '../../types';
import './Card.css';

interface CardProps {
  item: PokemonItem;
}

class Card extends Component<CardProps> {
  render() {
    const { item } = this.props;
    return (
      <tr className="card-row">
        <td className="card-name">{item.name}</td>
        <td className="card-description">{item.description}</td>
      </tr>
    );
  }
}

export default Card;
