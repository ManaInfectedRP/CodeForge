import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactModal } from './ContactModal';
import { useLanguage, type Language } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieConsentContext';

const translations = {
  en: {
    tagline: 'Kodstigen, a path forward in coding, by Sebastian Larsson.',
    dashboard: 'Dashboard',
    blog: 'Blog',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact us',
    privacy: 'Privacy Policy',
    cookieSettings: 'Cookie settings',
  },
  sv: {
    tagline: 'Kodstigen, en väg framåt inom kodning, av Sebastian Larsson.',
    dashboard: 'Översikt',
    blog: 'Blogg',
    about: 'Om',
    faq: 'Vanliga frågor',
    contact: 'Kontakta oss',
    privacy: 'Integritetspolicy',
    cookieSettings: 'Cookie-inställningar',
  },
};

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  function optionClass(lang: Language) {
    return lang === language ? 'font-semibold text-white' : 'text-slate-500 hover:text-white';
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Language">
      <button type="button" onClick={() => setLanguage('en')} className={optionClass('en')}>
        EN
      </button>
      <span className="text-slate-700">/</span>
      <button type="button" onClick={() => setLanguage('sv')} className={optionClass('sv')}>
        SV
      </button>
    </div>
  );
}

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const [contactOpen, setContactOpen] = useState(false);
  const { openSettings } = useCookieConsent();

  return (
    <footer className="border-t border-slate-800 py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <p>{t.tagline}</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/dashboard" className="hover:text-white">
            {t.dashboard}
          </Link>
          <Link to="/blog" className="hover:text-white">
            {t.blog}
          </Link>
          <Link to="/about" className="hover:text-white">
            {t.about}
          </Link>
          <Link to="/faq" className="hover:text-white">
            {t.faq}
          </Link>
          <Link to="/privacy" className="hover:text-white">
            {t.privacy}
          </Link>
          <button type="button" onClick={() => setContactOpen(true)} className="hover:text-white">
            {t.contact}
          </button>
          <button type="button" onClick={openSettings} className="hover:text-white">
            {t.cookieSettings}
          </button>
          <LanguageToggle />
        </nav>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </footer>
  );
}
