import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HookForm from './HookForm';
import { useFormStore } from '../../store/useFormStore';

beforeEach(() => { useFormStore.setState({ submissions: [], lastSubmissionId: null }); });

describe('HookForm', () => {
  it('renders all fields', () => {
    render(<HookForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText(/Terms/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Image/)).toBeInTheDocument();
  });

  it('submit button is initially disabled', () => {
    render(<HookForm onSuccess={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('shows name validation error live', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    await user.type(screen.getByLabelText('Name'), 'j');
    await user.tab();
    await waitFor(() => { expect(screen.getByText(/uppercase/)).toBeInTheDocument(); });
  });

  it('shows email validation error live', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    await user.type(screen.getByLabelText('Email'), 'nope');
    await user.tab();
    await waitFor(() => { expect(screen.getByText(/valid email/)).toBeInTheDocument(); });
  });

  it('shows password strength', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    await user.type(screen.getByLabelText('Password'), 'Aa1!');
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('has connected labels', () => {
    render(<HookForm onSuccess={vi.fn()} />);
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label.getAttribute('for')).toBeTruthy();
  });

  it('accepts valid image file upload', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    const fileInput = screen.getByLabelText(/Profile Image/) as HTMLInputElement;
    const file = new File(['pixel'], 'photo.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('clears country error on valid input', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Germany');
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByText(/valid country/)).not.toBeInTheDocument();
    });
  });
});

describe('HookForm extra coverage', () => {
  it('handles large file upload', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={vi.fn()} />);
    const fileInput = screen.getByLabelText(/Profile Image/) as HTMLInputElement;
    const big = new Uint8Array(3 * 1024 * 1024);
    const file = new File([big], 'huge.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    await waitFor(() => {
      const errors = document.querySelectorAll('.form-error');
      const hasError = Array.from(errors).some(el => el.textContent?.includes('2MB'));
      expect(hasError).toBe(true);
    });
  });

  it('gender select defaults to empty', () => {
    render(<HookForm onSuccess={vi.fn()} />);
    const select = screen.getByLabelText('Gender') as HTMLSelectElement;
    expect(select.value).toBe('');
  });
});
