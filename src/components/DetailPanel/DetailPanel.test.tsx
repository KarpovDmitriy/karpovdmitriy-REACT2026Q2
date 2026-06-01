import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DetailPanel from './DetailPanel';
import * as api from '../../services/api';

vi.mock('../../services/api');
const mockedFetchDetails = vi.mocked(api.fetchPokemonDetails);

const mockDetail = {
  name: 'pikachu',
  description: 'Electric mouse Pokémon',
  height: 4,
  weight: 60,
  types: ['electric'],
  sprite: 'https://example.com/pikachu.png',
};

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });
}

const renderWithRouter = (name: string, page = '1') => {
  const client = createTestClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/details/${name}?page=${page}`]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/details/:name" element={<DetailPanel />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchDetails.mockResolvedValue(mockDetail);
  });

  it('shows loading indicator while fetching', () => {
    mockedFetchDetails.mockReturnValue(new Promise(() => {}));
    renderWithRouter('pikachu');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays pokemon details after loading', async () => {
    renderWithRouter('pikachu');
    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric mouse Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Height: 4')).toBeInTheDocument();
    expect(screen.getByText('Weight: 60')).toBeInTheDocument();
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
  });

  it('displays sprite image', async () => {
    renderWithRouter('pikachu');
    const img = await screen.findByAltText('pikachu');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });

  it('displays error message on failure', async () => {
    mockedFetchDetails.mockRejectedValue(new Error('Not found'));
    renderWithRouter('unknown');
    expect(await screen.findByText('Not found')).toBeInTheDocument();
  });

  it('renders close button', async () => {
    renderWithRouter('pikachu');
    await screen.findByText('pikachu');
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('navigates back to main page when close is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('pikachu', '3');
    await screen.findByText('pikachu');
    await user.click(screen.getByRole('button', { name: '✕' }));
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('calls fetchPokemonDetails with correct name', async () => {
    renderWithRouter('bulbasaur');
    await waitFor(() => {
      expect(mockedFetchDetails).toHaveBeenCalledWith('bulbasaur');
    });
  });
});
