import { useEffect, useMemo, useRef, useState } from 'react';
import type { Language } from '../context/LanguageContext';

export function slugifyFaqTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

const translations = {
  en: { label: 'Contents', placeholder: 'Filter headings…', empty: 'No matching sections' },
  sv: { label: 'Innehåll', placeholder: 'Filtrera rubriker…', empty: 'Inga matchande avsnitt' },
};

export function FaqOutline({ titles, language }: { titles: string[]; language: Language }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery('');
  }, [open]);

  const filtered = useMemo(
    () => titles.filter((title) => title.toLowerCase().includes(query.toLowerCase())),
    [titles, query]
  );

  function goTo(title: string) {
    document.getElementById(slugifyFaqTitle(title))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  }

  return (
    <div ref={ref} className="fixed right-3 top-20 z-20 sm:right-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-sm font-medium shadow-lg shadow-black/30 backdrop-blur transition-colors ${
          open ? 'bg-slate-800 text-white' : 'bg-slate-900/95 text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`}
      >
        <span aria-hidden="true">☰</span>
        <span className="hidden sm:inline">{t.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/40">
          <div className="border-b border-slate-800 p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-forge-500 focus:outline-none"
            />
          </div>
          <div className="max-h-80 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-500">{t.empty}</p>
            ) : (
              filtered.map((title) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => goTo(title)}
                  className="block w-full truncate px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
                >
                  {title}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
