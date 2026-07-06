import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { refreshUser } = useAuth();
  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return; // StrictMode double-invoke guard, token is single-use
    requested.current = true;

    if (!token) {
      setError('Missing verification token, use the link from your email.');
      setState('error');
      return;
    }
    api
      .post('/auth/verify-email', { token })
      .then(async () => {
        await refreshUser().catch(() => {});
        setState('success');
      })
      .catch((err) => {
        setError(errorMessage(err));
        setState('error');
      });
  }, [token, refreshUser]);

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      {state === 'verifying' && <p className="text-slate-400">Verifying your email…</p>}
      {state === 'success' && (
        <>
          <p className="text-5xl">✅</p>
          <h1 className="mt-4 text-2xl font-bold">Email verified!</h1>
          <p className="mt-2 text-slate-400">Your account is fully set up.</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-xl bg-forge-600 px-8 py-3 font-semibold text-white hover:bg-forge-500"
          >
            Go to dashboard
          </Link>
        </>
      )}
      {state === 'error' && (
        <>
          <p className="text-5xl">❌</p>
          <h1 className="mt-4 text-2xl font-bold">Verification failed</h1>
          <p className="mt-2 text-red-400">{error}</p>
          <p className="mt-4 text-sm text-slate-500">
            Log in and use the "Resend email" button in the banner to get a fresh link.
          </p>
        </>
      )}
    </main>
  );
}
