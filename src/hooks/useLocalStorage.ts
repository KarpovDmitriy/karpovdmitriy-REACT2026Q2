import { useState, useCallback } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState<string>(() => {
    const item = localStorage.getItem(key);
    return item ?? initialValue;
  });

  const setValue = useCallback(
    (value: string) => {
      setStoredValue(value);
      localStorage.setItem(key, value);
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
