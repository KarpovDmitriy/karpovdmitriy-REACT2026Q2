import { Component } from 'react';
import { PokemonItem } from '../../types';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: PokemonItem[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { items } = this.props;

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
            <Card key={item.name} item={item} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default CardList;
