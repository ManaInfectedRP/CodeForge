import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { useLanguage } from '../context/LanguageContext';

type Section = { heading: string; paragraphs: string[] };

const translations = {
  en: {
    metaTitle: 'User Consent | Kodstigen',
    metaDescription: 'What you agree to by creating a Kodstigen account: account requirements, community conduct, your content, and how your data is used.',
    back: '← Back home',
    heading: 'User Consent',
    intro: 'This is what you’re agreeing to when you create a Kodstigen account, kept short and in plain language on purpose.',
    sections: [
      {
        heading: 'Account requirements',
        paragraphs: [
          'You must be at least 13 years old to create an account, and the email and username you register with should be genuinely yours, not shared or impersonating someone else.',
          'One account per person. Accounts are free, there’s no paid tier to worry about consenting to.',
        ],
      },
      {
        heading: 'Community conduct',
        paragraphs: [
          'Kodstigen’s chat rooms are a shared space with other students, messages (and any images) you post there are visible to everyone in that room.',
          'No harassment, spam, illegal content, or impersonating staff. Accounts that break this can be chat-blocked or banned, at the discretion of the person running Kodstigen.',
        ],
      },
      {
        heading: 'Your content',
        paragraphs: [
          'Project and challenge submissions you send in for review are visible to the instructor grading them. Course reviews you write are shown publicly on that course’s page.',
          'You keep ownership of anything you write or submit, creating an account doesn’t transfer any rights to it.',
        ],
      },
      {
        heading: 'Your data',
        paragraphs: [
          'By registering, you consent to Kodstigen storing your account details and learning activity (progress, quiz results, certificates) so the service can actually work, that data is never sold or shared for advertising.',
          'You can request a copy of your data, ask for corrections, or have your account deleted at any time, send that request through the "Contact us" link in the footer.',
        ],
      },
      {
        heading: 'Changes to this page',
        paragraphs: [
          'If what you’re agreeing to changes meaningfully, this page will be updated rather than changed silently.',
        ],
      },
    ] as Section[],
  },
  sv: {
    metaTitle: 'Användarsamtycke | Kodstigen',
    metaDescription: 'Vad du godkänner när du skapar ett Kodstigen-konto: kontokrav, uppförande i communityn, ditt innehåll och hur din data används.',
    back: '← Till startsidan',
    heading: 'Användarsamtycke',
    intro: 'Det här är vad du godkänner när du skapar ett Kodstigen-konto, medvetet kort och skrivet på vanlig svenska.',
    sections: [
      {
        heading: 'Kontokrav',
        paragraphs: [
          'Du måste vara minst 13 år för att skapa ett konto, och e-postadressen och användarnamnet du registrerar dig med ska vara dina egna, inte delade eller utge sig för att vara någon annan.',
          'Ett konto per person. Konton är gratis, det finns ingen betald nivå att behöva samtycka till.',
        ],
      },
      {
        heading: 'Uppförande i communityn',
        paragraphs: [
          'Kodstigens chattrum är ett delat utrymme med andra elever, meddelanden (och eventuella bilder) du postar där är synliga för alla i det rummet.',
          'Inga trakasserier, spam, olagligt innehåll eller utge sig för att vara personal. Konton som bryter mot detta kan chatt-blockeras eller stängas av, efter bedömning av personen som driver Kodstigen.',
        ],
      },
      {
        heading: 'Ditt innehåll',
        paragraphs: [
          'Projekt- och utmaningsinlämningar du skickar in för granskning är synliga för läraren som rättar dem. Kursrecensioner du skriver visas publikt på kursens sida.',
          'Du behåller äganderätten till allt du skriver eller skickar in, att skapa ett konto överför inga rättigheter till det.',
        ],
      },
      {
        heading: 'Din data',
        paragraphs: [
          'Genom att registrera dig samtycker du till att Kodstigen sparar dina kontouppgifter och läraktivitet (framsteg, quizresultat, certifikat) så att tjänsten faktiskt fungerar, den datan säljs eller delas aldrig för reklam.',
          'Du kan när som helst begära en kopia av din data, be om rättelser, eller få ditt konto raderat, skicka den förfrågan via länken "Kontakta oss" i sidfoten.',
        ],
      },
      {
        heading: 'Ändringar på den här sidan',
        paragraphs: [
          'Om det du godkänner ändras på ett betydande sätt uppdateras den här sidan istället för att ändras i tysthet.',
        ],
      },
    ] as Section[],
  },
};

export function Consent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <PageMeta title={t.metaTitle} description={t.metaDescription} />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        {t.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.heading}</h1>
      <p className="mt-3 text-slate-400">{t.intro}</p>

      <div className="mt-10 space-y-8">
        {t.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold">{section.heading}</h2>
            <div className="mt-2 space-y-2">
              {section.paragraphs.map((p) => (
                <p key={p} className="text-slate-300">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
