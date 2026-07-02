import { useState } from 'react';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function VerifyEmailBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!user || user.emailVerified) return null;

  async function resend() {
    setStatus('sending');
    setError(null);
    try {
      await api.post('/auth/resend-verification');
      setStatus('sent');
    } catch (err) {
      setError(errorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="border-b border-amber-700/50 bg-amber-950/40 px-4 py-2.5 text-center text-sm text-amber-200 print:hidden">
      📧 Please verify your email address — check your inbox for the confirmation link.{' '}
      {status === 'sent' ? (
        <span className="font-semibold text-emerald-300">Verification email sent!</span>
      ) : (
        <button
          onClick={resend}
          disabled={status === 'sending'}
          className="font-semibold underline hover:text-white disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Resend email'}
        </button>
      )}
      {error && <span className="ml-2 text-red-300">{error}</span>}
    </div>
  );
}
