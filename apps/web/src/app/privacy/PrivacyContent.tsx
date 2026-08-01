'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCookieConsent } from '@/context/CookieConsentContext';

type Section = { heading: string; paragraphs: string[] };

const translations = {
  en: {
    back: '← Back home',
    heading: 'Privacy Policy',
    updated: 'Last updated: August 2026',
    cookieButtonLabel: 'Change my cookie preference',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          'Kodstigen is a solo-built learning platform created and operated by Sebastian Larsson. For anything in this policy, or any request about your data, email Sebbelarsson9601@gmail.com, every message goes directly to the person building Kodstigen.',
        ],
      },
      {
        heading: 'What we collect',
        paragraphs: [
          'Almost nothing. Kodstigen is a static website with no accounts, no login, and no server-side database, so there is no profile, no progress record, and no submission history to hold about you.',
          'Code you write in a lesson playground or a coding challenge runs entirely inside your own browser and is never uploaded anywhere. Quiz answers are graded on your machine too.',
          'If, and only if, you accept analytics cookies, Google Analytics (GA4) collects standard usage data such as which pages are visited. Decline, and nothing is collected at all.',
        ],
      },
      {
        heading: 'Cookies and local storage',
        paragraphs: [
          'Kodstigen sets no cookies of its own. Two small preferences, your language choice and your cookie decision, are kept in your browser’s local storage on your device; they never leave it and are not readable by us.',
          'The only cookies that can be set are analytics cookies from Google Analytics (GA4). These are never set until you accept them in the cookie banner, if you decline (or haven’t chosen yet), no Google Analytics script loads and no analytics cookies are set. You can change your decision at any time.',
        ],
      },
      {
        heading: 'Third parties',
        paragraphs: [
          'Google Analytics (GA4): receives page views and basic usage data, but only after you’ve given cookie consent. Google’s own privacy policy governs how it processes that data.',
          'Some in-browser language runtimes (for example the Python interpreter used by the code playgrounds) are downloaded from a public CDN the first time you run code in that language, which means that CDN sees the request. No data about you is sent with it.',
          'Kodstigen does not sell your data, and does not share it with anyone else for advertising or marketing purposes.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'Under GDPR (and similar laws elsewhere), you can request a copy of the data an organisation holds about you, ask for it to be corrected, or ask for it to be deleted. Because Kodstigen stores nothing about you, there is nothing to export or erase, but if you believe otherwise, email Sebbelarsson9601@gmail.com and it will be looked into directly.',
          'You can withdraw analytics cookie consent at any time from the "Cookie settings" link in the footer of every page, or using the button below. Clearing your browser storage for this site also resets both stored preferences.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If what Kodstigen collects or how it’s used changes meaningfully, this page will be updated and the date at the top revised accordingly.',
        ],
      },
    ] as Section[],
  },
  sv: {
    back: '← Till startsidan',
    heading: 'Integritetspolicy',
    updated: 'Senast uppdaterad: augusti 2026',
    cookieButtonLabel: 'Ändra mina cookie-inställningar',
    sections: [
      {
        heading: 'Vilka vi är',
        paragraphs: [
          'Kodstigen är en inlärningsplattform byggd och driven av en person, Sebastian Larsson. För allt som rör den här policyn, eller en fråga om din data, mejla Sebbelarsson9601@gmail.com, alla meddelanden går direkt till personen som bygger Kodstigen.',
        ],
      },
      {
        heading: 'Vad vi samlar in',
        paragraphs: [
          'Nästan ingenting. Kodstigen är en statisk webbplats utan konton, utan inloggning och utan databas på servern, så det finns ingen profil, inga sparade framsteg och ingen inlämningshistorik om dig.',
          'Kod du skriver i en lektions kodruta eller i en kodutmaning körs helt och hållet i din egen webbläsare och laddas aldrig upp någonstans. Quiz rättas också på din dator.',
          'Om, och endast om, du accepterar analys-cookies samlar Google Analytics (GA4) in vanlig användningsdata, till exempel vilka sidor som besöks. Avböjer du samlas ingenting in alls.',
        ],
      },
      {
        heading: 'Cookies och lokal lagring',
        paragraphs: [
          'Kodstigen sätter inga egna cookies. Två små inställningar, ditt språkval och ditt cookie-beslut, sparas i webbläsarens lokala lagring på din enhet. De lämnar aldrig enheten och kan inte läsas av oss.',
          'De enda cookies som kan sättas är analys-cookies från Google Analytics (GA4). Dessa sätts aldrig förrän du accepterar dem i cookie-bannern, om du avböjer (eller inte har valt än) laddas inget Google Analytics-skript och inga analys-cookies sätts. Du kan ändra ditt val när som helst.',
        ],
      },
      {
        heading: 'Tredje part',
        paragraphs: [
          'Google Analytics (GA4): tar emot sidvisningar och grundläggande användningsdata, men bara efter att du gett samtycke till cookies. Googles egen integritetspolicy styr hur den datan behandlas.',
          'Vissa språkmotorer som körs i webbläsaren (till exempel Python-tolken i kodrutorna) laddas ned från ett publikt CDN första gången du kör kod i det språket, vilket innebär att det CDN:et ser förfrågan. Ingen data om dig skickas med.',
          'Kodstigen säljer aldrig din data, och delar den inte med någon annan för reklam eller marknadsföring.',
        ],
      },
      {
        heading: 'Dina rättigheter',
        paragraphs: [
          'Enligt GDPR (och liknande lagar på andra håll) kan du begära en kopia av den data en organisation har om dig, be om att den rättas, eller be om att den raderas. Eftersom Kodstigen inte lagrar något om dig finns det ingenting att exportera eller radera, men om du tror något annat, mejla Sebbelarsson9601@gmail.com så undersöks det direkt.',
          'Du kan när som helst dra tillbaka ditt samtycke till analys-cookies via länken "Cookie-inställningar" i sidfoten på varje sida, eller med knappen nedan. Att rensa webbläsarens lagring för den här sidan återställer också båda sparade inställningarna.',
        ],
      },
      {
        heading: 'Ändringar i den här policyn',
        paragraphs: [
          'Om vad Kodstigen samlar in eller hur det används ändras på ett betydande sätt uppdateras den här sidan, och datumet högst upp justeras därefter.',
        ],
      },
    ] as Section[],
  },
};

export function PrivacyContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { openSettings } = useCookieConsent();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-slate-400 hover:text-white">
        {t.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.heading}</h1>
      <p className="mt-2 text-sm text-slate-500">{t.updated}</p>

      <div className="mt-10 space-y-10">
        {t.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((p) => (
                <p key={p} className="text-slate-300">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={openSettings}
        className="mt-10 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white"
      >
        {t.cookieButtonLabel}
      </button>
    </main>
  );
}
