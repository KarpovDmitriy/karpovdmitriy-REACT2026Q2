import {
  FetchResult,
  PokemonDetail,
  PokemonItem,
  PokemonListResponse,
  PokemonSpeciesResponse,
} from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 10;

function cleanFlavorText(text: string): string {
  return text
    .replace(/[\f\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSpeciesDescription(name: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${name}`);
  if (!response.ok) {
    return 'No description available.';
  }
  const data: PokemonSpeciesResponse = await response.json();
  const entry = data.flavor_text_entries.find((e) => e.language.name === 'en');
  return entry
    ? cleanFlavorText(entry.flavor_text)
    : 'No description available.';
}

export async function fetchPokemon(
  searchTerm: string,
  page: number
): Promise<FetchResult> {
  if (searchTerm) {
    const response = await fetch(
      `${BASE_URL}/pokemon/${searchTerm.toLowerCase()}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokemon "${searchTerm}" not found.`);
      }
      throw new Error(`Request failed with status ${response.status}.`);
    }
    const data: { name: string } = await response.json();
    const description = await fetchSpeciesDescription(data.name);
    return {
      items: [{ name: data.name, description }],
      total: 1,
    };
  }

  const offset = page * PAGE_SIZE;
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch pokemon list (status ${response.status}).`
    );
  }
  const data: PokemonListResponse = await response.json();
  const items: PokemonItem[] = await Promise.all(
    data.results.map(async (p) => {
      const description = await fetchSpeciesDescription(p.name);
      return { name: p.name, description };
    })
  );
  return { items, total: data.count };
}

export async function fetchPokemonDetails(
  name: string
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch details for "${name}".`);
  }
  const data = await response.json();
  const description = await fetchSpeciesDescription(name);

  return {
    name: data.name,
    description,
    height: data.height,
    weight: data.weight,
    types: data.types.map(
      (t: { type: { name: string } }) => t.type.name
    ),
    sprite: data.sprites?.front_default ?? null,
  };
}
