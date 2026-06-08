import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UncontrolledForm from './UncontrolledForm';
import { useFormStore } from '../../store/useFormStore';

beforeEach(() => { useFormStore.setState({ submissions: [], lastSubmissionId: null }); });

describe('UncontrolledForm', () => {
  it('renders all fields', () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText(/Terms/)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText(/Name is required/)).toBeInTheDocument();
  });

  it('shows error for lowercase name', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    await user.type(screen.getByLabelText('Name'), 'john');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText(/uppercase/)).toBeInTheDocument();
  });

  it('has connected labels', () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label.getAttribute('for')).toBeTruthy();
  });
});

describe('UncontrolledForm image validation', () => {
  it('shows error when no image is uploaded', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    
    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'j@e.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'male');
    await user.type(screen.getByLabelText('Password'), 'Abc123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Abc123!');
    await user.type(screen.getByLabelText('Country'), 'Germany');
    await user.click(screen.getByLabelText(/Terms/));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(await screen.findByText(/Image is required/)).toBeInTheDocument();
  });

  it('shows password strength indicator', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={vi.fn()} />);
    await user.type(screen.getByLabelText('Password'), 'Aa1!');
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });
});
