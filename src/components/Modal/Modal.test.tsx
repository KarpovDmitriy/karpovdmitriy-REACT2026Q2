import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
  });

  it('renders portal content when open', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onClose when ESC is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Body</p></Modal>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Body</p></Modal>);
    const overlay = document.querySelector('.modal-overlay')!;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking modal content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Body</p></Modal>);
    await user.click(screen.getByText('Body'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has close button', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('has dialog role', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
