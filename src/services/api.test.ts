import { fetchPokemon } from './api';

const createJsonResponse = (data: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: () => Promise.resolve(data),
  }) as Response;

describe('fetchPokemon', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('search by name', () => {
    it('returns a single pokemon with description on success', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          createJsonResponse({ name: 'pikachu' })
        )
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              { flavor_text: 'Electric mouse.', language: { name: 'en' } },
            ],
          })
        );

      const result = await fetchPokemon('pikachu', 0);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('pikachu');
      expect(result.items[0].description).toBe('Electric mouse.');
      expect(result.total).toBe(1);
    });

    it('throws an error for 404 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        createJsonResponse(null, false, 404)
      );

      await expect(fetchPokemon('nonexistent', 0)).rejects.toThrow(
        'Pokemon "nonexistent" not found.'
      );
    });

    it('throws an error for non-404 failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        createJsonResponse(null, false, 500)
      );

      await expect(fetchPokemon('pikachu', 0)).rejects.toThrow(
        'Request failed with status 500.'
      );
    });

    it('returns fallback description when species endpoint fails', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(createJsonResponse({ name: 'pikachu' }))
        .mockResolvedValueOnce(createJsonResponse(null, false, 500));

      const result = await fetchPokemon('pikachu', 0);
      expect(result.items[0].description).toBe('No description available.');
    });

    it('returns fallback description when no English entry exists', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(createJsonResponse({ name: 'pikachu' }))
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              { flavor_text: 'Ratón eléctrico.', language: { name: 'es' } },
            ],
          })
        );

      const result = await fetchPokemon('pikachu', 0);
      expect(result.items[0].description).toBe('No description available.');
    });

    it('converts search term to lowercase', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(createJsonResponse({ name: 'pikachu' }))
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              { flavor_text: 'Electric.', language: { name: 'en' } },
            ],
          })
        );

      await fetchPokemon('PIKACHU', 0);
      expect(fetchSpy.mock.calls[0][0]).toContain('pikachu');
    });
  });

  describe('list all (empty search term)', () => {
    it('returns a list of pokemon with descriptions', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          createJsonResponse({
            count: 1302,
            results: [
              { name: 'bulbasaur', url: '' },
              { name: 'ivysaur', url: '' },
            ],
          })
        )
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              { flavor_text: 'A seed.', language: { name: 'en' } },
            ],
          })
        )
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              { flavor_text: 'A plant.', language: { name: 'en' } },
            ],
          })
        );

      const result = await fetchPokemon('', 0);

      expect(result.items).toHaveLength(2);
      expect(result.items[0].name).toBe('bulbasaur');
      expect(result.items[1].name).toBe('ivysaur');
      expect(result.total).toBe(1302);
    });

    it('passes correct offset based on page number', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        createJsonResponse({ count: 100, results: [] })
      );

      await fetchPokemon('', 3);
      expect(fetchSpy.mock.calls[0][0]).toContain('offset=30');
    });

    it('throws an error when the list endpoint fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        createJsonResponse(null, false, 503)
      );

      await expect(fetchPokemon('', 0)).rejects.toThrow(
        'Failed to fetch pokemon list (status 503).'
      );
    });
  });

  describe('cleanFlavorText', () => {
    it('cleans newlines and extra spaces from flavor text', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(createJsonResponse({ name: 'pikachu' }))
        .mockResolvedValueOnce(
          createJsonResponse({
            flavor_text_entries: [
              {
                flavor_text: 'It\fstores\nelectricity\rin   its  cheeks.',
                language: { name: 'en' },
              },
            ],
          })
        );

      const result = await fetchPokemon('pikachu', 0);
      expect(result.items[0].description).toBe(
        'It stores electricity in its cheeks.'
      );
    });
  });
});
