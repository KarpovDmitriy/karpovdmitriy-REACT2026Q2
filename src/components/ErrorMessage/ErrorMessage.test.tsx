import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the error message', () => {
    render(<ErrorMessage error={new Error('Something broke')} />);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('displays fallback message when error is null', () => {
    render(<ErrorMessage error={null} />);
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });

  it('displays custom fallback message', () => {
    render(<ErrorMessage error={null} fallbackMessage="Custom error" />);
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('formats network errors as user-friendly message', () => {
    render(<ErrorMessage error={new Error('Failed to fetch')} />);
    expect(screen.getByText(/Unable to connect/)).toBeInTheDocument();
  });

  it('formats server errors as user-friendly message', () => {
    render(<ErrorMessage error={new Error('Request failed with status 500')} />);
    expect(screen.getByText(/server encountered an error/)).toBeInTheDocument();
  });

  it('preserves 404 not found messages', () => {
    render(<ErrorMessage error={new Error('Pokemon "xyz" not found.')} />);
    expect(screen.getByText('Pokemon "xyz" not found.')).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<ErrorMessage error={new Error('Error')} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays warning icon', () => {
    render(<ErrorMessage error={new Error('Error')} />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
