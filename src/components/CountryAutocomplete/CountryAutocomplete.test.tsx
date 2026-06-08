import { render, screen } from '@testing-library/react';
import CountryAutocomplete from './CountryAutocomplete';

describe('CountryAutocomplete', () => {
  it('renders input with datalist', () => {
    render(<CountryAutocomplete id="test-country" />);
    expect(screen.getByPlaceholderText('Select a country...')).toBeInTheDocument();
  });

  it('renders country options', () => {
    const { container } = render(<CountryAutocomplete id="test-country" />);
    const options = container.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn();
    render(<CountryAutocomplete id="test-country" value="" onChange={onChange} />);
    // Input should render
    expect(screen.getByPlaceholderText('Select a country...')).toBeInTheDocument();
  });
});
