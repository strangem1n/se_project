import { useState, useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  initialSearchTerm = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  }, [items, searchTerm, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}
