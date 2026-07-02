import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../lib/api';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(username, email, password);
      navigate('/paths'); // onboarding: pick learning paths first
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-slate-400">Free forever. Pick your languages right after.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm text-slate-300">Username</label>
          <input
            id="username"
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-slate-300">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-slate-300">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-forge-600 py-3 font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          {busy ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-forge-500 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
