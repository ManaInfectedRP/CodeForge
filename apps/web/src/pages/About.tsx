import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { useLanguage } from '../context/LanguageContext';

export const translations = {
  en: {
    metaTitle: 'About | Kodstigen',
    metaDescription:
      'Kodstigen is a solo-built platform for learning programming step by step through interactive lessons, quizzes, and real projects, created by Sebastian Larsson.',
    back: '← Back home',
    role: 'Creator of Kodstigen',
    body: 'Kodstigen is a solo-built project, a place to learn programming step by step through interactive lessons, quizzes, and real projects. Thanks for stopping by, feel free to reach out through any of the links below.',
    linkedin: 'LinkedIn',
    portfolio: 'Portfolio',
    email: 'Email',
  },
  sv: {
    metaTitle: 'Om | Kodstigen',
    metaDescription:
      'Kodstigen är en plattform byggd av en person för att lära sig programmering steg för steg genom interaktiva lektioner, quiz och verkliga projekt, skapad av Sebastian Larsson.',
    back: '← Till startsidan',
    role: 'Skapare av Kodstigen',
    body: 'Kodstigen är ett soloprojekt, en plats att lära sig programmering steg för steg genom interaktiva lektioner, quiz och verkliga projekt. Tack för att du tittar in, hör gärna av dig via länkarna nedan.',
    linkedin: 'LinkedIn',
    portfolio: 'Portfolio',
    email: 'E-post',
  },
};

export function About() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <PageMeta title={t.metaTitle} description={t.metaDescription} />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        {t.back}
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <img src="/logo.png" alt="Kodstigen" className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <h1 className="text-3xl font-bold">Sebastian Larsson</h1>
          <p className="text-slate-400">{t.role}</p>
        </div>
      </div>

      <p className="mt-8 text-lg text-slate-300">{t.body}</p>

      <div className="mt-10 space-y-3">
        <a
          href="https://www.linkedin.com/in/sebastian-larsson-b45803246/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition-colors hover:border-slate-600"
        >
          <span className="font-medium">{t.linkedin}</span>
          <span className="text-slate-500">↗</span>
        </a>
        <a
          href="https://sebbe-portfolio.onrender.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition-colors hover:border-slate-600"
        >
          <span className="font-medium">{t.portfolio}</span>
          <span className="text-slate-500">↗</span>
        </a>
        <a
          href="mailto:Sebbelarsson9601@gmail.com"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition-colors hover:border-slate-600"
        >
          <span className="font-medium">{t.email}</span>
          <span className="text-slate-500">Sebbelarsson9601@gmail.com</span>
        </a>
      </div>
    </main>
  );
}
