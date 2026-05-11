import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search', () => {
  const setup = (initialTerm = '') => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Search onSearch={onSearch} initialTerm={initialTerm} />);
    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    const button = screen.getByRole('button', { name: 'Search' });
    return { onSearch, user, input, button };
  };

  it('renders search input and button', () => {
    setup();
    expect(screen.getByPlaceholderText('Search Pokémon by name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays initialTerm in the input', () => {
    const { input } = setup('pikachu');
    expect(input).toHaveValue('pikachu');
  });

  it('shows empty input when initialTerm is empty', () => {
    const { input } = setup('');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const { user, input } = setup();
    await user.type(input, 'bulbasaur');
    expect(input).toHaveValue('bulbasaur');
  });

  it('calls onSearch with trimmed value when button is clicked', async () => {
    const { onSearch, user, input, button } = setup();
    await user.type(input, '  pikachu  ');
    await user.click(button);
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const { onSearch, user, input } = setup();
    await user.type(input, 'charmander');
    await user.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledWith('charmander');
  });

  it('calls onSearch with empty string when input is only whitespace', async () => {
    const { onSearch, user, input, button } = setup();
    await user.type(input, '   ');
    await user.click(button);
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('does not call onSearch on non-Enter key press', async () => {
    const { onSearch, user, input } = setup();
    await user.type(input, 'a');
    // 'a' was typed but only the type event happened, no search triggered
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with the current value, not the initial one', async () => {
    const { onSearch, user, input, button } = setup('pikachu');
    await user.clear(input);
    await user.type(input, 'mewtwo');
    await user.click(button);
    expect(onSearch).toHaveBeenCalledWith('mewtwo');
  });
});
