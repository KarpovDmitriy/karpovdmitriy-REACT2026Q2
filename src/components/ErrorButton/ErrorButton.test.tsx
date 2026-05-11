import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorButton from './ErrorButton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

describe('ErrorButton', () => {
  it('renders the "Throw Error" button', () => {
    render(<ErrorButton />);
    expect(screen.getByRole('button', { name: 'Throw Error' })).toBeInTheDocument();
  });

  it('throws an error when clicked (caught by ErrorBoundary)', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error triggered by ErrorButton.')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
