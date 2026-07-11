import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onClose: () => void;
}

const translations = {
  en: {
    title: 'Get in touch',
    body: 'Questions, bug reports, or course ideas, every message goes straight to Sebastian, the person building Kodstigen.',
    email: 'Email',
    linkedin: 'LinkedIn',
    close: 'Close',
  },
  sv: {
    title: 'Hör av dig',
    body: 'Frågor, buggrapporter eller kursidéer, alla meddelanden går direkt till Sebastian, personen som bygger Kodstigen.',
    email: 'E-post',
    linkedin: 'LinkedIn',
    close: 'Stäng',
  },
};

/** A "contact us" popup, reachable from the footer on every page instead of a plain mailto
 * link, so getting in touch doesn't require navigating away to a dedicated page. */
export function ContactModal({ onClose }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="contact-modal-title" className="text-lg font-bold">
            {t.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="shrink-0 text-xl leading-none text-slate-500 hover:text-white"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-400">{t.body}</p>

        <div className="mt-5 space-y-3">
          <a
            href="mailto:Sebbelarsson9601@gmail.com"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 transition-colors hover:border-slate-600"
          >
            <span className="font-medium">{t.email}</span>
            <span className="text-slate-500">Sebbelarsson9601@gmail.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sebastian-larsson-b45803246/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 transition-colors hover:border-slate-600"
          >
            <span className="font-medium">{t.linkedin}</span>
            <span className="text-slate-500">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
