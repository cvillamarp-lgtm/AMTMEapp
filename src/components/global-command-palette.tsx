'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '@/hooks/use-global-search';

export function GlobalCommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, activeCategory, setActiveCategory, categories, clearSearch } =
    useGlobalSearch();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          clearSearch();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1)
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results.length > 0) {
            const selected = results[selectedIndex];
            if (selected) {
              router.push(selected.href);
              setIsOpen(false);
              clearSearch();
            }
          }
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, selectedIndex, router, clearSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        clearSearch();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, clearSearch]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24"
      onClick={() => {
        setIsOpen(false);
        clearSearch();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Buscador global"
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Input */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <MagnifyingGlass size={20} className="text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar episodios, contenido, métricas..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              aria-label="Búsqueda global"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                clearSearch();
              }}
              aria-label="Cerrar buscador"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        {results.length > 0 && (
          <div className="border-b border-border px-4 pt-3 pb-0 flex gap-2 overflow-x-auto">
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedIndex(0);
              }}
              className={cn(
                'whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                activeCategory === 'all'
                  ? 'border-amtme-lemon text-amtme-navy'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Todos
            </button>
            {categories.map((cat) => {
              const count = results.filter((r) => r.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIndex(0);
                  }}
                  className={cn(
                    'whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeCategory === cat
                      ? 'border-amtme-lemon text-amtme-navy'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-sm text-muted-foreground">No hay coincidencias.</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Intenta con términos diferentes o revisa el Documento maestro.
              </p>
            </div>
          ) : (
            <ul role="listbox" className="divide-y divide-border p-2">
              {results.map((result, idx) => (
                <li key={result.id} role="option" aria-selected={idx === selectedIndex}>
                  <button
                    onClick={() => {
                      router.push(result.href);
                      setIsOpen(false);
                      clearSearch();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg transition-colors',
                      idx === selectedIndex
                        ? 'bg-amtme-lemon/20 text-amtme-navy'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="ml-2 shrink-0 text-xs font-medium px-2 py-1 rounded bg-border text-muted-foreground">
                        {result.category}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>
              <kbd className="px-2 py-1 rounded bg-muted text-foreground font-medium">↵</kbd> Abrir
            </span>
            <span>
              <kbd className="px-2 py-1 rounded bg-muted text-foreground font-medium">Esc</kbd>{' '}
              Cerrar
            </span>
          </div>
          {results.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedIndex + 1} de {results.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
