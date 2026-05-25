import { PokemonItem } from '../types';

export function generateCsv(items: PokemonItem[]): string {
  const header = 'Name,Description,Details URL';
  const rows = items.map((item) => {
    const name = escapeCsvField(item.name);
    const description = escapeCsvField(item.description);
    const url = `https://pokeapi.co/api/v2/pokemon/${item.name}`;
    return `${name},${description},${url}`;
  });
  return [header, ...rows].join('\n');
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadSelectedAsCsv(items: PokemonItem[]): void {
  const csv = generateCsv(items);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
