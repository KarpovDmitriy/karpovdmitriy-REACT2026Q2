import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the spinner element', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loader-spinner')).toBeInTheDocument();
  });

  it('renders the loader container', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loader-container')).toBeInTheDocument();
  });
});
