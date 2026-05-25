import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Flyout from './Flyout';
import { useAppStore } from '../../store/useAppStore';

describe('Flyout', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedItems: [],
    });
  });

  it('does not render when no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container.innerHTML).toBe('');
  });

  it('renders when items are selected', () => {
    useAppStore.setState({
      selectedItems: [{ name: 'pikachu', description: 'Electric' }],
    });
    render(<Flyout />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('displays correct count for multiple items', () => {
    useAppStore.setState({
      selectedItems: [
        { name: 'pikachu', description: 'Electric' },
        { name: 'bulbasaur', description: 'Seed' },
        { name: 'charmander', description: 'Fire' },
      ],
    });
    render(<Flyout />);
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('renders "Unselect all" button', () => {
    useAppStore.setState({
      selectedItems: [{ name: 'pikachu', description: 'Electric' }],
    });
    render(<Flyout />);
    expect(screen.getByRole('button', { name: 'Unselect all' })).toBeInTheDocument();
  });

  it('renders "Download" button', () => {
    useAppStore.setState({
      selectedItems: [{ name: 'pikachu', description: 'Electric' }],
    });
    render(<Flyout />);
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

  it('clears selected items when "Unselect all" is clicked', async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      selectedItems: [
        { name: 'pikachu', description: 'Electric' },
        { name: 'bulbasaur', description: 'Seed' },
      ],
    });
    render(<Flyout />);
    await user.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(useAppStore.getState().selectedItems).toEqual([]);
  });

  it('has sticky positioning', () => {
    useAppStore.setState({
      selectedItems: [{ name: 'pikachu', description: 'Electric' }],
    });
    const { container } = render(<Flyout />);
    const flyout = container.querySelector('.flyout');
    expect(flyout).toBeInTheDocument();
  });
});
