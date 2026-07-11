import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

const SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'Is Kodstigen free?',
        a: 'Yes. Kodstigen is completely free, there is no paid tier, subscription, or hidden cost to any course, quiz, or challenge.',
      },
      {
        q: 'Do I need any coding experience to start?',
        a: 'No. Every learning path starts from the absolute basics, and the free sample course below needs no prior experience at all.',
      },
      {
        q: 'What languages and topics do you teach?',
        a: 'Python, JavaScript, TypeScript, C, C++, C#, Java, Kotlin, Go, Lua, SQL, HTML/CSS, React, Solidity, GDScript, and DevOps tools like Docker, Kubernetes, AWS, Azure, and CI/CD, with new paths added regularly.',
      },
      {
        q: 'Can I try a lesson before creating an account?',
        a: 'Yes. "Programming Basics: Your First Steps" is a free public course, its first lesson is open to everyone, no account required.',
      },
      {
        q: 'Can I sign in with GitHub, or do I need a password?',
        a: 'Both are supported. You can register with an email and password, or sign in with GitHub, and link or unlink GitHub later from Settings.',
      },
    ],
  },
  {
    title: 'Courses & learning paths',
    items: [
      {
        q: 'What’s the difference between a "Path" and a "Course"?',
        a: 'A Path is a language or technology track, like Python or C#. Each Path contains one or more Courses, for example a Fundamentals course, an Intermediate course, and a hands-on "build a game" project course.',
      },
      {
        q: 'Do lessons have to be completed in order?',
        a: 'Yes. Lessons unlock one at a time, you need to finish a lesson (and pass its quiz, if it has one) before the next one opens.',
      },
      {
        q: 'What’s actually in a lesson?',
        a: 'Written content with runnable, in-browser code playgrounds for supported languages, sometimes a video, sometimes a quiz, and for some final lessons, a project you submit for instructor review.',
      },
      {
        q: 'How are quizzes graded, and what’s the passing score?',
        a: 'Quizzes are graded on the server as soon as you submit, most require 70% to pass. If you don’t pass, you can retry immediately and as many times as you like.',
      },
      {
        q: 'How do project submissions get reviewed?',
        a: 'You submit a link to your code (a repo or gist), and an instructor reviews it, either approving it or requesting changes with feedback before the lesson can be marked complete.',
      },
    ],
  },
  {
    title: 'Certificates',
    items: [
      {
        q: 'How do I earn a certificate?',
        a: 'Complete every lesson and pass every quiz in a course, then claim your certificate from the course page.',
      },
      {
        q: 'Can anyone verify that a certificate is real?',
        a: 'Yes. Every certificate has a public verification page that needs no account, useful for sharing with employers or checking a certificate someone else sent you.',
      },
    ],
  },
  {
    title: 'Coding challenges',
    items: [
      {
        q: 'How are challenges different from course lessons?',
        a: 'Challenges are standalone, bite-sized coding problems, not tied to a specific course, that are graded automatically the moment you submit a solution.',
      },
      {
        q: 'What languages can I solve challenges in?',
        a: 'Python, JavaScript, TypeScript, Lua, C, and HTML, depending on the challenge.',
      },
    ],
  },
  {
    title: 'Teaching on Kodstigen',
    items: [
      {
        q: 'How do I become an instructor?',
        a: 'Instructor access is currently granted by an admin rather than self-service, if you’re interested in teaching a course, reach out through the contact link below.',
      },
      {
        q: 'Can I co-teach a course with someone else?',
        a: 'Yes. A course’s creator can invite another existing instructor as a collaborator, who can then help manage lessons and students on that course.',
      },
    ],
  },
  {
    title: 'Account & technical',
    items: [
      {
        q: 'Do I need to install anything to run code?',
        a: 'No. Code in lessons and challenges runs directly in your browser in a sandboxed playground, nothing to download or configure.',
      },
      {
        q: 'Can I delete my account?',
        a: 'There isn’t a self-service delete option yet, email us and we’ll take care of it for you.',
      },
      {
        q: 'Does Kodstigen work on mobile?',
        a: 'Yes, the site is responsive and works in any modern browser, desktop or mobile.',
      },
      {
        q: 'How do I report a bug or request a course topic?',
        a: 'Send an email using the "Contact us" link in the footer, every message goes straight to the person building Kodstigen.',
      },
    ],
  },
];

export function Faq() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
        title="Frequently Asked Questions | Kodstigen"
        description="Answers to common questions about learning on Kodstigen: pricing, how courses and quizzes work, certificates, coding challenges, and becoming an instructor."
        structuredData={structuredData}
      />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        ← Back home
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h1>
      <p className="mt-3 text-slate-400">
        Answers to the most common questions about learning, and teaching, on Kodstigen. Can&rsquo;t find what
        you&rsquo;re looking for?{' '}
        <a href="mailto:Sebbelarsson9601@gmail.com" className="text-forge-500 hover:text-forge-100 hover:underline">
          Get in touch
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
