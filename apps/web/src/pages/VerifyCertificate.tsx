import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CertificateVerificationDto } from '@codeforge/shared';
import { api } from '../lib/api';

export function VerifyCertificate() {
  const { code } = useParams<{ code: string }>();
  const [result, setResult] = useState<CertificateVerificationDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CertificateVerificationDto>(`/certificates/${code}`)
      .then((res) => setResult(res.data))
      .catch(() => setResult({ valid: false }))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <main className="p-24 text-center text-slate-400">Checking certificate…</main>;

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      {result?.valid ? (
        <>
          <p className="text-5xl">✅</p>
          <h1 className="mt-4 text-2xl font-bold text-emerald-400">Valid certificate</h1>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left text-sm">
            <p className="text-slate-400">
              Student: <span className="font-semibold text-white">{result.studentName}</span>
            </p>
            <p className="mt-2 text-slate-400">
              Course: <span className="font-semibold text-white">{result.courseTitle}</span>
            </p>
            <p className="mt-2 text-slate-400">
              Path: <span className="text-slate-200">{result.pathName}</span>
            </p>
            <p className="mt-2 text-slate-400">
              Issued:{' '}
              <span className="text-slate-200">
                {result.issuedAt && new Date(result.issuedAt).toLocaleDateString()}
              </span>
            </p>
            <p className="mt-2 font-mono text-xs text-slate-500">ID: {result.certificateId}</p>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            This certificate was issued by Kodstigen and its record matches our registry.
          </p>
        </>
      ) : (
        <>
          <p className="text-5xl">❌</p>
          <h1 className="mt-4 text-2xl font-bold text-red-400">Certificate not found</h1>
          <p className="mt-2 text-slate-400">
            No certificate matches this verification code. It may have been revoked or the code was
            mistyped.
          </p>
        </>
      )}
    </main>
  );
}
