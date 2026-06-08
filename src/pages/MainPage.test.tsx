import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';
import { useFormStore } from '../store/useFormStore';

beforeEach(() => {
  const modalRoot = document.getElementById('modal-root') || (() => {
    const el = document.createElement('div');
    el.id = 'modal-root';
    document.body.appendChild(el);
    return el;
  })();
  void modalRoot;
  useFormStore.setState({ submissions: [], lastSubmissionId: null });
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

const renderPage = () => render(<BrowserRouter><MainPage /></BrowserRouter>);

describe('MainPage', () => {
  it('renders form buttons', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Uncontrolled Form' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React Hook Form' })).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Uncontrolled Form' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens hook form modal', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows empty state when no submissions', () => {
    renderPage();
    expect(screen.getByText(/No submissions yet/)).toBeInTheDocument();
  });

  it('displays submissions', () => {
    useFormStore.setState({
      submissions: [{ id: '1', name: 'Test', age: 20, email: 't@t.com', gender: 'male', acceptTerms: true, password: 'x', confirmPassword: 'x', country: 'Italy', image: '', source: 'uncontrolled', submittedAt: Date.now() }],
      lastSubmissionId: null,
    });
    renderPage();
    expect(screen.getByText(/Test/)).toBeInTheDocument();
  });
});

describe('MainPage modal interactions', () => {
  it('closes modal when close button clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Uncontrolled Form' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('highlights new submission', () => {
    useFormStore.setState({
      submissions: [{ id: 'new-1', name: 'New', age: 1, email: 'n@e.com', gender: 'male', acceptTerms: true, password: 'x', confirmPassword: 'x', country: 'Italy', image: '', source: 'uncontrolled', submittedAt: Date.now() }],
      lastSubmissionId: 'new-1',
    });
    renderPage();
    expect(document.querySelector('.form-card--new')).toBeInTheDocument();
  });
});
