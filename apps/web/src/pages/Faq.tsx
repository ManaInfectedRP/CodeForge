import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

const SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Kom igång',
    items: [
      {
        q: 'Är Kodstigen gratis?',
        a: 'Ja. Kodstigen är helt gratis, det finns ingen betald nivå, prenumeration eller dold kostnad för någon kurs, quiz eller utmaning.',
      },
      {
        q: 'Behöver jag kunna programmera innan jag börjar?',
        a: 'Nej. Alla kunskapsstigar börjar från grunden, och den gratis provkursen nedan kräver ingen tidigare erfarenhet alls.',
      },
      {
        q: 'Vilka språk och ämnen lär ni ut?',
        a: 'Python, JavaScript, TypeScript, C, C++, C#, Java, Kotlin, Go, Lua, SQL, HTML/CSS, React, Solidity, GDScript, samt DevOps-verktyg som Docker, Kubernetes, AWS, Azure och CI/CD. Nya stigar läggs till regelbundet.',
      },
      {
        q: 'Kan jag prova en lektion innan jag skapar ett konto?',
        a: '"Programming Basics: Your First Steps" är en gratis, publik kurs. Dess första lektion är öppen för alla, inget konto krävs.',
      },
      {
        q: 'Kan jag logga in med GitHub, eller behöver jag ett lösenord?',
        a: 'Båda funkar. Du kan registrera dig med e-post och lösenord, eller logga in med GitHub, och koppla eller koppla bort GitHub senare under Inställningar.',
      },
    ],
  },
  {
    title: 'Kurser och stigar',
    items: [
      {
        q: 'Vad är skillnaden mellan en "stig" och en "kurs"?',
        a: 'En stig är en inriktning mot ett språk eller en teknik, till exempel Python eller C#. Varje stig innehåller en eller flera kurser, till exempel en grundkurs, en fortsättningskurs och en praktisk projektkurs där du bygger ett spel.',
      },
      {
        q: 'Måste jag göra lektionerna i ordning?',
        a: 'Ja. Lektioner låses upp en i taget. Du behöver avsluta en lektion (och klara dess quiz, om den har ett) innan nästa öppnas.',
      },
      {
        q: 'Vad ingår egentligen i en lektion?',
        a: 'Skriftligt innehåll med körbara kodexempel direkt i webbläsaren för språk som stöds, ibland en video, ibland ett quiz, och för vissa avslutande lektioner ett projekt du skickar in för granskning av en instruktör.',
      },
      {
        q: 'Hur rättas quiz, och vad krävs för att klara det?',
        a: 'Quiz rättas på servern direkt när du skickar in dina svar, och de flesta kräver 70 procent rätt för att klara. Klarar du inte quizet kan du försöka igen direkt, så många gånger du vill.',
      },
      {
        q: 'Hur granskas projektinlämningar?',
        a: 'Du skickar in en länk till din kod, till exempel ett repo eller en gist, och en instruktör granskar den. Instruktören godkänner den eller ber om ändringar med feedback innan lektionen kan markeras som klar.',
      },
    ],
  },
  {
    title: 'Certifikat',
    items: [
      {
        q: 'Hur får jag ett certifikat?',
        a: 'Slutför varje lektion och klara varje quiz i en kurs, hämta sedan ditt certifikat från kurssidan.',
      },
      {
        q: 'Kan vem som helst verifiera att ett certifikat är äkta?',
        a: 'Ja. Varje certifikat har en publik verifieringssida som inte kräver något konto. Praktiskt för att dela med arbetsgivare eller kontrollera ett certifikat någon annan skickat dig.',
      },
    ],
  },
  {
    title: 'Kodutmaningar',
    items: [
      {
        q: 'Hur skiljer sig utmaningar från kurslektioner?',
        a: 'Utmaningar är fristående, mindre kodproblem som inte hör till någon specifik kurs. De rättas automatiskt så fort du skickar in en lösning.',
      },
      {
        q: 'Vilka språk kan jag lösa utmaningar i?',
        a: 'Python, JavaScript, TypeScript, Lua, C och HTML, beroende på utmaningen.',
      },
    ],
  },
  {
    title: 'Undervisa på Kodstigen',
    items: [
      {
        q: 'Hur blir jag instruktör?',
        a: 'Instruktörsbehörighet ges just nu av en administratör, det är inget du kan ansöka om själv. Är du intresserad av att undervisa, hör av dig via kontaktlänken nedan.',
      },
      {
        q: 'Kan jag undervisa en kurs tillsammans med någon annan?',
        a: 'Ja. Den som skapat en kurs kan bjuda in en annan befintlig instruktör som medskapare, som sedan kan hjälpa till att hantera lektioner och studenter på den kursen.',
      },
    ],
  },
  {
    title: 'Konto och teknik',
    items: [
      {
        q: 'Behöver jag installera något för att köra kod?',
        a: 'Nej. Kod i lektioner och utmaningar körs direkt i webbläsaren i en säker sandlåda, inget att ladda ner eller konfigurera.',
      },
      {
        q: 'Kan jag radera mitt konto?',
        a: 'Det finns ännu inget sätt att göra det själv. Mejla oss så hjälper vi dig.',
      },
      {
        q: 'Fungerar Kodstigen på mobilen?',
        a: 'Ja, sidan är responsiv och fungerar i alla moderna webbläsare, både på dator och mobil.',
      },
      {
        q: 'Hur rapporterar jag en bugg eller föreslår ett kursämne?',
        a: 'Skicka ett mejl via länken "Kontakta oss" i sidfoten. Alla meddelanden går direkt till personen som bygger Kodstigen.',
      },
    ],
  },
];

export function Faq() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'sv',
    mainEntity: SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageMeta
        title="Vanliga frågor | Kodstigen"
        description="Svar på vanliga frågor om att lära sig på Kodstigen: pris, hur kurser och quiz fungerar, certifikat, kodutmaningar och att bli instruktör."
        structuredData={structuredData}
      />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        ← Till startsidan
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Vanliga frågor</h1>
      <p className="mt-3 text-slate-400">
        Svar på de vanligaste frågorna om att lära sig, och undervisa, på Kodstigen. Hittar du inte det du letar
        efter?{' '}
        <a href="mailto:Sebbelarsson9601@gmail.com" className="text-forge-500 hover:text-forge-100 hover:underline">
          Hör av dig
        </a>
        .
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-forge-500">{section.title}</h2>
            <div className="mt-4 space-y-2">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-slate-800 bg-slate-900 px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-200 marker:content-none">
                    {item.q}
                    <span className="shrink-0 text-lg leading-none text-slate-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
