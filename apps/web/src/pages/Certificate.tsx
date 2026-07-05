import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import type { CertificateDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

export function Certificate() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<CertificateDto | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<CertificateDto>(`/me/certificates/${id}`)
      .then(async (res) => {
        setCert(res.data);
        const verifyUrl = `${window.location.origin}/verify/${res.data.verificationCode}`;
        setQr(await QRCode.toDataURL(verifyUrl, { margin: 1, width: 160 }));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  if (error) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!cert) return <main className="p-12 text-center text-slate-400">Loading certificate…</main>;

  const issued = new Date(cert.issuedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white">
          ← Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500"
        >
          🖨 Print / save as PDF
        </button>
      </div>

      <div className="certificate-sheet mt-6 rounded-2xl border-4 border-double border-amber-500/60 bg-slate-900 p-10 text-center">
        <img src="/logo.png" alt="Kodstigen" className="mx-auto h-20 w-20 rounded-2xl" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Certificate of Completion
        </p>
        <p className="mt-8 text-sm text-slate-400">This certifies that</p>
        <p className="mt-2 text-4xl font-bold">{cert.studentName}</p>
        <p className="mt-6 text-sm text-slate-400">has successfully completed the course</p>
        <p className="mt-2 text-2xl font-semibold text-forge-100">{cert.courseTitle}</p>
        <p className="mt-1 text-sm text-slate-500">{cert.pathName} learning path</p>

        <div className="mt-10 flex items-end justify-between gap-6 text-left">
          <div className="text-sm">
            <p className="text-slate-400">
              Completed on <span className="text-slate-200">{issued}</span>
            </p>
            <p className="mt-1 text-slate-400">
              Instructor: <span className="text-slate-200">{cert.instructorName}</span>
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">Certificate ID: {cert.id}</p>
            <p className="font-mono text-xs text-slate-500">Verification code: {cert.verificationCode}</p>
          </div>
          {qr && (
            <div className="shrink-0 text-center">
              <img src={qr} alt="Verification QR code" className="h-28 w-28 rounded-lg bg-white p-1.5" />
              <p className="mt-1.5 text-[10px] text-slate-500">Scan to verify</p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500 print:hidden">
        Anyone can verify this certificate at {window.location.origin}/verify/{cert.verificationCode}
      </p>
    </main>
  );
}
