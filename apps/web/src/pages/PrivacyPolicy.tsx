import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { useLanguage } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieConsentContext';

type Section = { heading: string; paragraphs: string[] };

const translations = {
  en: {
    metaTitle: 'Privacy Policy | Kodstigen',
    metaDescription:
      'How Kodstigen collects, uses, and protects your data, including cookies, Google Analytics, and your rights under GDPR.',
    back: '← Back home',
    heading: 'Privacy Policy',
    updated: 'Last updated: July 2026',
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
          'Account data: your username, email address, and either a password (stored as a one-way hash, never in plain text) or a linked GitHub account (id and username), plus anything you choose to add, like an avatar or bio.',
          'Learning activity: enrolled paths and courses, lesson and quiz progress, challenge and project submissions, certificates you’ve earned, and course reviews you write.',
          'Community activity: messages (and any images) you post in Kodstigen’s chat rooms, visible to other users in that room.',
          'Technical data: which pages get visited, collected as an anonymous per-page hit count with no personal identifiers attached, used only to see which parts of the site are actually used. This always runs, since it never identifies you, and is separate from Google Analytics below.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Kodstigen uses two kinds of cookies. The first is a strictly necessary, httpOnly session cookie that keeps you logged in, it’s set automatically when you sign in and can’t be disabled without also disabling login itself.',
          'The second is analytics cookies from Google Analytics (GA4), used to understand traffic and usage patterns. These are never set until you accept them in the cookie banner, if you decline (or haven’t chosen yet), no Google Analytics script loads and no analytics cookies are set. You can change your decision at any time.',
        ],
      },
      {
        heading: 'Third parties',
        paragraphs: [
          'Google Analytics (GA4): receives page views and basic usage data, but only after you’ve given cookie consent. Google’s own privacy policy governs how it processes that data.',
          'GitHub: if you choose to sign in with GitHub instead of a password, GitHub shares your account id and username with Kodstigen to authenticate you, no data flows to GitHub beyond the standard OAuth sign-in request.',
          'Kodstigen does not sell your data, and does not share it with anyone else for advertising or marketing purposes.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'Under GDPR (and similar laws elsewhere), you can request a copy of the data Kodstigen holds about you, ask for it to be corrected, or ask for your account and associated data to be deleted. Most profile details can be edited yourself from Settings, for anything else, including deletion, email Sebbelarsson9601@gmail.com and it’ll be handled directly, there’s no self-service delete option yet.',
          'You can withdraw analytics cookie consent at any time from the "Cookie settings" link in the footer of every page, or using the button below.',
        ],
      },
      {
        heading: 'How long we keep data',
        paragraphs: [
          'Account and learning data is kept for as long as your account exists, so your progress, certificates, and history stay intact. If you request deletion, your account and the personal data tied to it are removed rather than kept indefinitely.',
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
    metaTitle: 'Integritetspolicy | Kodstigen',
    metaDescription:
      'Hur Kodstigen samlar in, använder och skyddar din data, inklusive cookies, Google Analytics och dina rättigheter enligt GDPR.',
    back: '← Till startsidan',
    heading: 'Integritetspolicy',
    updated: 'Senast uppdaterad: juli 2026',
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
          'Kontodata: ditt användarnamn, din e-postadress, och antingen ett lösenord (lagrat som en enkelriktad hash, aldrig i klartext) eller ett kopplat GitHub-konto (id och användarnamn), samt sådant du själv väljer att lägga till, som en profilbild eller bio.',
          'Läraktivitet: stigar och kurser du är anmäld till, lektions- och quizframsteg, inskickade utmaningar och projekt, certifikat du tjänat, och kursrecensioner du skrivit.',
          'Community-aktivitet: meddelanden (och eventuella bilder) du postar i Kodstigens chattrum, synliga för andra användare i det rummet.',
          'Teknisk data: vilka sidor som besöks, insamlat som ett anonymt besöksantal per sida utan någon personlig identifierare, används enbart för att se vilka delar av sidan som faktiskt används. Detta körs alltid, eftersom det aldrig identifierar dig, och är skilt från Google Analytics nedan.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Kodstigen använder två typer av cookies. Den första är en strikt nödvändig, httpOnly sessionscookie som håller dig inloggad, den sätts automatiskt när du loggar in och kan inte stängas av utan att även inloggningen slutar fungera.',
          'Den andra är analys-cookies från Google Analytics (GA4), används för att förstå trafik och användningsmönster. Dessa sätts aldrig förrän du accepterar dem i cookie-bannern, om du avböjer (eller inte har valt än) laddas inget Google Analytics-skript och inga analys-cookies sätts. Du kan ändra ditt val när som helst.',
        ],
      },
      {
        heading: 'Tredje part',
        paragraphs: [
          'Google Analytics (GA4): tar emot sidvisningar och grundläggande användningsdata, men bara efter att du gett samtycke till cookies. Googles egen integritetspolicy styr hur den datan behandlas.',
          'GitHub: om du väljer att logga in med GitHub istället för ett lösenord delar GitHub ditt konto-id och användarnamn med Kodstigen för att autentisera dig, ingen data skickas till GitHub utöver den vanliga OAuth-inloggningsförfrågan.',
          'Kodstigen säljer aldrig din data, och delar den inte med någon annan för reklam eller marknadsföring.',
        ],
      },
      {
        heading: 'Dina rättigheter',
        paragraphs: [
          'Enligt GDPR (och liknande lagar på andra håll) kan du begära en kopia av den data Kodstigen har om dig, be om att den rättas, eller be om att ditt konto och tillhörande data raderas. De flesta profiluppgifter kan du redigera själv under Inställningar, för allt annat, inklusive radering, mejla Sebbelarsson9601@gmail.com så hanteras det direkt, det finns ännu inget sätt att göra det själv.',
          'Du kan när som helst dra tillbaka ditt samtycke till analys-cookies via länken "Cookie-inställningar" i sidfoten på varje sida, eller med knappen nedan.',
        ],
      },
      {
        heading: 'Hur länge vi sparar data',
        paragraphs: [
          'Konto- och läraktivitetsdata sparas så länge ditt konto finns kvar, så att dina framsteg, certifikat och historik hålls intakta. Om du begär radering tas ditt konto och den personliga datan kopplad till det bort istället för att sparas på obestämd tid.',
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

export function PrivacyPolicy() {
  const { language } = useLanguage();
  const t = translations[language];
  const { openSettings } = useCookieConsent();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageMeta title={t.metaTitle} description={t.metaDescription} />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
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
