import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LearningPathDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { PathCard } from '../components/PathCard';

export function ChoosePaths() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => {
      setPaths(res.data);
      setSelected(new Set(res.data.filter((p) => p.selected).map((p) => p.slug)));
    });
  }, []);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.put('/me/paths', { slugs: [...selected] });
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">What do you want to learn?</h1>
      <p className="mt-2 text-slate-400">Pick one or more learning paths, you can change these anytime.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <PathCard key={p.id} path={p} selected={selected.has(p.slug)} onToggle={() => toggle(p.slug)} />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={save}
          disabled={selected.size === 0 || busy}
          className="rounded-xl bg-forge-600 px-8 py-3 font-semibold text-white hover:bg-forge-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Saving…' : `Continue with ${selected.size} path${selected.size === 1 ? '' : 's'}`}
        </button>
        <span className="text-sm text-slate-500">{selected.size === 0 && 'Select at least one path'}</span>
      </div>
    </main>
  );
}
