import { Component } from 'react';
import './ErrorButton.css';

interface ErrorButtonState {
  throwError: boolean;
}

class ErrorButton extends Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);
    this.state = { throwError: false };
  }

  handleClick = () => {
    this.setState({ throwError: true });
  };

  render() {
    if (this.state.throwError) {
      throw new Error('Test error triggered by ErrorButton.');
    }

    return (
      <button className="error-test-button" onClick={this.handleClick}>
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;
