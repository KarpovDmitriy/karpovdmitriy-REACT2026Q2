import { useState } from 'react';
import './ErrorButton.css';

function ErrorButton() {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error('Test error triggered by ErrorButton.');
  }

  return (
    <button className="error-test-button" onClick={() => setThrowError(true)}>
      Throw Error
    </button>
  );
}

export default ErrorButton;
