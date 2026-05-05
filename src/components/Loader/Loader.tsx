import { Component } from 'react';
import './Loader.css';

class Loader extends Component {
  render() {
    return (
      <div className="loader-container">
        <div className="loader-spinner" />
        <p className="loader-text">Loading...</p>
      </div>
    );
  }
}

export default Loader;
