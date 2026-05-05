export interface PokemonItem {
  name: string;
  description: string;
}

export interface FetchResult {
  items: PokemonItem[];
  total: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}
