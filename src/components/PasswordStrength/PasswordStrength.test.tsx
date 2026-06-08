import { render, screen } from '@testing-library/react';
import PasswordStrength from './PasswordStrength';

describe('PasswordStrength', () => {
  it('renders nothing for empty password', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.innerHTML).toBe('');
  });

  it('shows checklist items', () => {
    render(<PasswordStrength password="Aa1!" />);
    expect(screen.getByText('1 uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('1 number')).toBeInTheDocument();
  });

  it('shows Strong label for strong password', () => {
    render(<PasswordStrength password="Aa1!" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });
});
