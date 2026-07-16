import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieConsentContext';

const translations = {
  en: {
    text: 'We use cookies to understand how Kodstigen is used (Google Analytics), so we can improve it. We only set analytics cookies if you say yes.',
    learnMore: 'Learn more',
    decline: 'Decline',
    accept: 'Accept',
  },
  sv: {
    text: 'Vi använder cookies för att förstå hur Kodstigen används (Google Analytics), så att vi kan förbättra sajten. Vi sätter bara analys-cookies om du säger ja.',
    learnMore: 'Läs mer',
    decline: 'Avböj',
    accept: 'Acceptera',
  },
};

/** Fixed bottom banner shown to every user until they explicitly accept or decline
 * analytics cookies, GDPR requires consent before anything like GA4 is allowed to run. */
export function CookieConsentBanner() {
  const { language } = useLanguage();
  const t = translations[language];
  const { bannerOpen, accept, decline } = useCookieConsent();

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-text"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900 px-4 py-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p id="cookie-consent-text" className="text-sm text-slate-300">
          {t.text}{' '}
          <Link to="/privacy" className="underline hover:text-white">
            {t.learnMore}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-forge-600 px-4 py-2 text-sm font-medium text-white hover:bg-forge-500"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
