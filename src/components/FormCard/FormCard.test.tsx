import { render, screen } from '@testing-library/react';
import FormCard from './FormCard';

const mockSubmission = { id: '1', name: 'Jane', age: 30, email: 'j@e.com', gender: 'female', acceptTerms: true, password: 'x', confirmPassword: 'x', country: 'France', image: '', source: 'hook-form' as const, submittedAt: Date.now() };

describe('FormCard', () => {
  it('displays submission data', () => {
    render(<FormCard submission={mockSubmission} isNew={false} />);
    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/France/)).toBeInTheDocument();
  });

  it('shows source label', () => {
    render(<FormCard submission={mockSubmission} isNew={false} />);
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('applies new class when isNew', () => {
    const { container } = render(<FormCard submission={mockSubmission} isNew={true} />);
    expect(container.querySelector('.form-card--new')).toBeInTheDocument();
  });

  it('does not apply new class when not new', () => {
    const { container } = render(<FormCard submission={mockSubmission} isNew={false} />);
    expect(container.querySelector('.form-card--new')).not.toBeInTheDocument();
  });
});
