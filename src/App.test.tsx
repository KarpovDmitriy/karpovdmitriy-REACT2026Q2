import { render, screen } from '@testing-library/react';
import App from './App';
import { useFormStore } from './store/useFormStore';

beforeEach(() => {
  const el = document.createElement('div'); el.id = 'modal-root'; document.body.appendChild(el);
  useFormStore.setState({ submissions: [], lastSubmissionId: null });
});
afterEach(() => { document.getElementById('modal-root')?.remove(); });

describe('App', () => {
  it('renders main page', () => {
    render(<App />);
    expect(screen.getByText('React Forms')).toBeInTheDocument();
  });
});
