'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export const SearchBar = ({ searchQuery, onSearch }: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== searchQuery) {
        onSearch(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onSearch, searchQuery]);

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary/80">
        <Search className="h-5 w-5" />
      </div>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Buscar hamburguesas, papas, bebidas..."
        className="block w-full rounded-full border border-secondary/25 bg-primary/45 py-3 pl-11 pr-10 text-sm text-white placeholder:text-secondary/55 focus:border-secondary/55 focus:outline-none focus:ring-2 focus:ring-secondary/35"
      />

      {localValue && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-secondary/70 transition-colors hover:text-secondary"
          aria-label="Limpiar busqueda"
        >
          <span className="rounded-full border border-secondary/30 bg-secondary/10 p-1">
            <X className="h-4 w-4" />
          </span>
        </button>
      )}
    </div>
  );
};
