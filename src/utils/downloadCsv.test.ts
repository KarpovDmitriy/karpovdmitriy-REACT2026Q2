import { generateCsv, downloadSelectedAsCsv } from './downloadCsv';
import { PokemonItem } from '../types';

describe('generateCsv', () => {
  it('generates CSV with header and rows', () => {
    const items: PokemonItem[] = [
      { name: 'pikachu', description: 'Electric mouse' },
      { name: 'bulbasaur', description: 'Seed Pokémon' },
    ];
    const csv = generateCsv(items);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Name,Description,Details URL');
    expect(lines[1]).toBe('pikachu,Electric mouse,https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(lines[2]).toBe('bulbasaur,Seed Pokémon,https://pokeapi.co/api/v2/pokemon/bulbasaur');
  });

  it('escapes fields containing commas', () => {
    const items: PokemonItem[] = [
      { name: 'pikachu', description: 'Electric, mouse' },
    ];
    const csv = generateCsv(items);
    const lines = csv.split('\n');
    expect(lines[1]).toContain('"Electric, mouse"');
  });

  it('escapes fields containing quotes', () => {
    const items: PokemonItem[] = [
      { name: 'pikachu', description: 'Called "the best"' },
    ];
    const csv = generateCsv(items);
    expect(csv).toContain('"Called ""the best"""');
  });

  it('generates correct CSV for empty array', () => {
    const csv = generateCsv([]);
    expect(csv).toBe('Name,Description,Details URL');
  });
});

describe('downloadSelectedAsCsv', () => {
  it('creates and clicks a download link with correct filename', () => {
    const mockClick = vi.fn();
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: mockClick,
      set setAttribute(_: string) {},
    } as unknown as HTMLAnchorElement);

    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    const items: PokemonItem[] = [
      { name: 'pikachu', description: 'Electric' },
      { name: 'bulbasaur', description: 'Seed' },
    ];

    downloadSelectedAsCsv(items);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test');

    mockCreateElement.mockRestore();
  });

  it('sets filename based on item count', () => {
    let capturedDownload = '';
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      set download(val: string) {
        capturedDownload = val;
      },
      get download() {
        return capturedDownload;
      },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement);

    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    globalThis.URL.revokeObjectURL = vi.fn();

    const items: PokemonItem[] = [
      { name: 'pikachu', description: 'Electric' },
      { name: 'bulbasaur', description: 'Seed' },
      { name: 'charmander', description: 'Fire' },
    ];

    downloadSelectedAsCsv(items);

    expect(capturedDownload).toBe('3_items.csv');

    mockCreateElement.mockRestore();
  });
});
