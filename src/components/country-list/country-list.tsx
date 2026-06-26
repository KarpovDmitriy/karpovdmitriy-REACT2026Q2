import { useMemo } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { useVirtualList } from '../../hooks/useVirtualList';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

// Rough estimate of a card's height (px). The virtualizer measures real heights
// once rendered; this value only seeds the very first paint and the scrollbar size.
const ESTIMATED_CARD_HEIGHT = 320;

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(query);
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    return filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
      const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
      return sortOrder === 'asc' ? popA - popB : popB - popA;
    });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  // Virtualization: only the cards currently in (or near) the viewport are
  // mounted. The list can hold hundreds of countries, each with its own table,
  // so rendering all of them produced thousands of DOM nodes and dominated every
  // commit. The hook returns the visible slice plus spacer heights that keep the
  // scrollbar correct.
  const { containerRef, virtualItems, totalHeight, measureElement } = useVirtualList({
    count: filteredCountries.length,
    estimateHeight: ESTIMATED_CARD_HEIGHT,
    overscan: 4,
  });

  return (
    <div ref={containerRef} className={styles.countryList}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const country = filteredCountries[virtualItem.index];
          return (
            <div
              key={country.id}
              data-index={virtualItem.index}
              ref={measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <CountryCard
                country={country}
                selectedYear={selectedYear}
                selectedColumns={selectedColumns}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
