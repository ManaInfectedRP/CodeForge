import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { useLanguage, type Language } from '../context/LanguageContext';

type Section = { title: string; items: { q: string; a: string }[] };

export const SECTIONS: Record<Language, Section[]> = {
  en: [
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
    {
      title: 'Programming questions',
      items: [
        {
          q: 'How do I learn programming from scratch?',
          a: 'Start with the fundamentals, variables, loops, conditionals, and functions, using a beginner-friendly language like Python. Practice by building small projects rather than only reading, and use structured lessons (like Kodstigen’s free path) to keep you moving in the right order instead of jumping randomly between tutorials.',
        },
        {
          q: 'Which programming language should I start with, and how long does it take to learn?',
          a: 'Python is the most common starting point because its syntax is simple and readable, JavaScript is a strong choice if you want to build for the web right away, Java and C# are typically used for backend and enterprise work, and C++ sits closer to the hardware and is used for performance-critical software and games. Most people reach basic fluency in a few months of regular practice, real proficiency takes a year or more of building projects.',
        },
        {
          q: 'How do I fix errors like NullPointerException, SyntaxError, Segmentation Fault, or ModuleNotFoundError?',
          a: 'Read the error message and stack trace carefully, it almost always points to the exact line and reason. A NullPointerException means you’re using a variable that was never assigned a value, a SyntaxError means the code doesn’t parse (often a missing bracket or colon), a Segmentation Fault means your program accessed memory it shouldn’t have (common in C/C++), and a ModuleNotFoundError means a package isn’t installed or your import path is wrong.',
        },
        {
          q: 'How do I reverse a string, sort an array, or solve common coding interview problems?',
          a: 'These are classic data structures and algorithms exercises. Most languages have built-in methods for reversing and sorting, but interviewers usually want you to implement the logic yourself to show you understand the underlying approach. Practicing a broad set of problems on a site like LeetCode, and understanding the time and space complexity of each solution, is the best way to get comfortable with them.',
        },
        {
          q: 'How do APIs work?',
          a: 'An API lets one program request data or trigger actions in another, usually over HTTP. REST structures requests around URLs and standard HTTP methods (GET, POST, PUT, DELETE) and typically returns JSON, while GraphQL lets the client ask for exactly the fields it needs in a single request. Most APIs also require authentication, commonly an API key or a token like OAuth, sent with each request.',
        },
        {
          q: 'How do Git and GitHub work?',
          a: 'Git tracks changes to your code locally, you commit snapshots of your work and can branch off to try something without touching the main codebase. GitHub hosts those repositories online: `git push` sends your local commits there, and `git pull` fetches other people’s changes. Merge conflicts happen when two branches change the same lines, you resolve them by manually choosing which version (or a combination) to keep before completing the merge.',
        },
        {
          q: 'How do I build a website or web application?',
          a: 'HTML provides structure, CSS handles styling and layout, and JavaScript adds interactivity, that’s the foundation of every website. For anything beyond a simple page, a frontend framework like React helps you manage state and reusable components, and a backend (a server, API, and usually a database) handles data storage, authentication, and business logic.',
        },
        {
          q: 'How do I connect a database?',
          a: 'Choose a database, SQL databases like MySQL and PostgreSQL for structured, relational data, or MongoDB for flexible, document-based data, then connect to it from your backend using a driver or ORM library and a connection string with credentials. From there, you write queries (SQL) or use the driver’s methods (MongoDB) to read and write data.',
        },
        {
          q: 'How do I optimize my code for speed, memory, or performance?',
          a: 'Start by measuring where time is actually spent, don’t guess, use a profiler to find the real bottlenecks. Understanding Big O notation helps you spot algorithms that scale poorly, like nested loops over large data, and often the biggest wins come from picking a better data structure or algorithm rather than micro-optimizing individual lines.',
        },
        {
          q: 'How do I prepare for a software engineering interview?',
          a: 'Practice coding problems regularly (data structures and algorithms), study system design if you’re going for a mid-level or senior role, and prepare for behavioral questions using concrete examples from your own projects or work. Mock interviews, and explaining your thought process out loud while solving problems, both make a big difference.',
        },
      ],
    },
    {
      title: 'Programming careers & learning',
      items: [
        {
          q: 'Is coding hard to learn?',
          a: 'Coding is genuinely challenging at first, you’re learning a new way of thinking as well as new syntax, but it gets significantly easier once the basic patterns click. Most people find the first few weeks the hardest, and progress becomes much faster once you’ve built a handful of small projects.',
        },
        {
          q: 'Can I become a programmer without a computer science degree?',
          a: 'Yes, plenty of working developers are self-taught or came from bootcamps rather than a CS degree. Employers increasingly care more about a strong portfolio and the ability to solve real problems than about where you studied, though some larger companies still prefer or require a degree for certain roles.',
        },
        {
          q: 'Is a coding bootcamp worth it, or should I self-teach?',
          a: 'A bootcamp gives you structure, deadlines, and often job-placement support, which is valuable if you struggle to stay consistent on your own, but it’s a real time and money commitment. Self-teaching costs far less and can get you just as far if you’re disciplined about following a structured path rather than jumping randomly between tutorials.',
        },
        {
          q: 'What’s the difference between a script and a program?',
          a: 'A script is usually a short piece of code that automates a specific task and is run directly by an interpreter, while a program typically refers to a more complete, often compiled application with a broader scope. In practice the line is blurry, and the terms are often used interchangeably.',
        },
        {
          q: 'What’s the difference between front-end, back-end, and full-stack development?',
          a: 'Front-end development builds what users see and interact with in the browser (HTML, CSS, JavaScript, frameworks like React), back-end development handles the server, database, and business logic behind the scenes, and full-stack means working across both. Most real products need all three, whether that’s one full-stack developer or a team split across specialties.',
        },
        {
          q: 'How much do software developers earn?',
          a: 'It varies a lot by location, experience, and specialty, but software development is generally one of the higher-paying career paths, with salaries typically rising steadily as you move from junior to senior roles. Specializing in in-demand areas like backend systems, cloud infrastructure, or AI tends to pay a premium, though the fastest way to increase your pay is usually gaining real project experience.',
        },
      ],
    },
    {
      title: 'Common programming differences',
      items: [
        {
          q: 'What’s the difference between == and === in JavaScript?',
          a: '`==` compares two values after converting them to the same type if they differ (so `1 == "1"` is true), while `===` compares both value and type without converting anything (so `1 === "1"` is false). Using `===` is almost always the safer default, since it avoids surprising type-coercion bugs.',
        },
        {
          q: 'What’s the difference between a compiler and an interpreter?',
          a: 'A compiler translates your entire source code into machine code ahead of time, producing a standalone executable, while an interpreter reads and executes code line by line at runtime without a separate build step. Some languages, like Java, use both: compiling to an intermediate form that’s then interpreted (or further compiled) by a virtual machine.',
        },
        {
          q: 'What’s the difference between a library and a framework?',
          a: 'You call a library, your code stays in control and pulls in specific functions when needed, but a framework calls your code, it defines the overall structure and calls into your code at specific points ("inversion of control"). Libraries tend to be more flexible and easier to swap out, frameworks tend to be more opinionated and enforce a particular way of building things.',
        },
        {
          q: 'What’s the difference between SQL and NoSQL databases?',
          a: 'SQL databases (like MySQL and PostgreSQL) store data in structured tables with fixed schemas and relationships, and are queried with SQL, while NoSQL databases (like MongoDB) store more flexible, often document-based data without a rigid schema. SQL tends to be the better fit when your data is highly structured and relationships matter, NoSQL tends to fit better when your data is varied or changes shape often.',
        },
        {
          q: 'What’s the difference between synchronous and asynchronous code?',
          a: 'Synchronous code runs one step at a time, each operation blocks the next until it finishes, while asynchronous code lets slow operations (like network requests or file reads) run in the background so the rest of the program can keep going. Asynchronous code is essential for things like web servers and user interfaces, where you don’t want one slow request to freeze everything else.',
        },
        {
          q: 'What’s the difference between a bug and an exception?',
          a: 'A bug is any flaw in your code that causes it to behave incorrectly, it might crash, produce a wrong result, or just do something unintended. An exception is a specific, often handled, runtime event, like a file not being found or a network request failing, that your code can catch and respond to; an unhandled exception is a common cause of a bug, but not every bug involves an exception.',
        },
      ],
    },
    {
      title: 'Programming concepts explained',
      items: [
        {
          q: 'What is object-oriented programming?',
          a: 'Object-oriented programming (OOP) organizes code around "objects" that bundle data (properties) and behavior (methods) together, using concepts like classes, inheritance, and encapsulation to model real-world things and relationships. Languages like Java, C#, and Python all support it, and it’s especially useful for large, complex codebases where organizing related data and logic together keeps things manageable.',
        },
        {
          q: 'What is recursion, and when should I actually use it?',
          a: 'Recursion is when a function calls itself to solve a smaller version of the same problem, with a base case that stops it from calling itself forever. It’s a natural fit for problems that are inherently recursive, like traversing a tree, parsing nested structures, or certain sorting algorithms, but for simple repetition a plain loop is usually clearer and more efficient.',
        },
        {
          q: 'What is a memory leak, and how do I avoid one?',
          a: 'A memory leak happens when a program keeps memory allocated that it no longer needs, usually because something is still referencing it even though it’s not actually in use anymore, causing memory usage to grow over time. In languages with garbage collection (like JavaScript or Python) leaks are usually caused by lingering references, like forgotten event listeners or global variables, while in languages like C or C++ they’re often caused by forgetting to free memory you explicitly allocated.',
        },
        {
          q: 'What are async/await, promises, and callbacks in JavaScript?',
          a: 'A callback is a function passed into another function to run once some operation finishes, promises wrap an asynchronous operation and let you chain `.then()`/`.catch()` instead of nesting callbacks, and async/await is syntax built on top of promises that lets you write asynchronous code that reads like normal, synchronous code. They’re really three layers of the same idea, each one built to make asynchronous code easier to follow than the last.',
        },
        {
          q: 'What is dependency injection?',
          a: 'Dependency injection is a pattern where an object receives the other objects or services it depends on from the outside, rather than creating them itself. This makes code easier to test (you can swap in a fake dependency) and easier to change (you can swap a real implementation without rewriting the class that uses it).',
        },
        {
          q: 'What are design patterns, and which ones should I actually learn?',
          a: 'Design patterns are reusable, named solutions to common software design problems, a shared vocabulary developers use to describe how code is structured. Singleton, Factory, Observer, and Strategy are among the most commonly used and worth learning first, they show up constantly in real codebases and in interviews, though patterns are a tool, not a goal, don’t force one in where simpler code would do.',
        },
      ],
    },
    {
      title: 'Developer tools & workflow',
      items: [
        {
          q: 'What’s the best code editor or IDE for beginners?',
          a: 'Visual Studio Code is the most common starting point, it’s free, lightweight, and has extensions for almost every language, but a full IDE like PyCharm or IntelliJ can offer more built-in tooling for a specific language once you know what you’re working with. The best choice is whichever one doesn’t get in your way, most beginners are better off spending that decision time writing code instead.',
        },
        {
          q: 'How do I debug code effectively?',
          a: 'Start by reproducing the problem consistently, then narrow it down, use breakpoints and a debugger to step through the code line by line, or add targeted print/log statements if a debugger isn’t practical. Read error messages and stack traces carefully before guessing, they usually tell you exactly where and why something went wrong.',
        },
        {
          q: 'What is unit testing, and why does it matter?',
          a: 'A unit test checks that a small, isolated piece of code (usually a single function) behaves correctly for a given input, run automatically rather than by hand. Tests catch regressions when you change code later, document how a function is supposed to behave, and make it much safer to refactor without breaking something you didn’t notice.',
        },
        {
          q: 'How do I read and understand someone else’s code?',
          a: 'Start from an entry point (like `main`, a route handler, or wherever execution begins) and trace through what actually gets called, rather than trying to read every file top to bottom. Running the code, setting breakpoints, and checking tests (if they exist) to see expected behavior are usually faster than reading in isolation.',
        },
        {
          q: 'What do HTTP status codes like 200, 404, and 500 mean?',
          a: 'They tell you how a request went: codes in the 200s mean success (200 OK), 300s mean redirection, 400s mean the client made a mistake (404 Not Found, 401 Unauthorized), and 500s mean the server failed to handle a valid request (500 Internal Server Error). Recognizing these ranges quickly helps you tell whether a bug is on your end or the server’s.',
        },
        {
          q: 'What is Docker, and why do developers use it?',
          a: 'Docker packages an application together with everything it needs to run, code, dependencies, system libraries, into a "container" that behaves the same way on any machine. This solves the classic "it works on my machine" problem and makes it much easier to develop, test, and deploy software consistently across different environments.',
        },
        {
          q: 'What is CI/CD?',
          a: 'CI (continuous integration) automatically builds and tests your code every time you push a change, catching problems early instead of finding them later, and CD (continuous delivery/deployment) automatically ships that code to staging or production once it passes. Together they let teams ship changes frequently and with confidence instead of relying on big, risky manual releases.',
        },
        {
          q: 'How do I deploy a website or app to production?',
          a: 'At a minimum you need somewhere to host it (a server or a platform like Vercel, Netlify, or a cloud provider), a build step that produces the final code, and a way to push new versions live, often through CI/CD so deploys are automatic and repeatable. For anything beyond a static site, you’ll also need to think about environment variables, a database connection, and monitoring for when something breaks in production.',
        },
      ],
    },
    {
      title: 'AI for business & productivity',
      items: [
        {
          q: 'How can AI automate my business?',
          a: 'AI can take over repetitive, rule-based tasks, things like sorting emails, generating reports, answering common customer questions, or scheduling, freeing up time for work that actually needs a human. The best starting point is identifying one recurring task that eats up hours each week and automating just that, rather than trying to overhaul everything at once.',
        },
        {
          q: 'What repetitive tasks can AI handle?',
          a: 'Data entry, email replies and summarization, meeting notes, scheduling, basic customer support, invoice processing, and first-draft writing or coding are all commonly automated with AI today. Tasks that follow a predictable pattern, even a complex one, are usually good candidates.',
        },
        {
          q: 'Which AI tools save the most time?',
          a: 'It depends on the task: chat-based assistants for writing and research, automation platforms for connecting apps and triggering workflows, and specialized tools for scheduling, transcription, or coding. The time saved usually comes less from the specific tool and more from actually building it into your daily workflow.',
        },
        {
          q: 'How do I build AI workflows?',
          a: 'Start by mapping the steps of the task you want to automate, then connect them using either a no-code automation platform or, if you’re comfortable coding, an API and some custom logic. Test each step separately before chaining them together, and keep a human check on anything with real consequences, like sending an email or making a payment.',
        },
      ],
    },
    {
      title: 'AI content creation',
      items: [
        {
          q: 'Can AI write blog posts?',
          a: 'Yes, AI can draft a full blog post from an outline or topic, but the best results come from treating it as a first draft. Give it a clear structure, audience, and tone, then edit for accuracy, voice, and anything it got wrong or made up.',
        },
        {
          q: 'How do I generate YouTube scripts?',
          a: 'Give the AI your video’s topic, target length, and tone (educational, entertaining, and so on), and ask for a structure first, hook, main points, call to action, before generating the full script. Iterating in sections usually produces a better result than asking for the entire script at once.',
        },
        {
          q: 'Can AI create presentations?',
          a: 'Yes, AI can generate slide outlines, speaker notes, and even full slide decks in tools that support it, though you’ll usually still want to adjust the design and double-check any facts or numbers it includes. It’s most useful for getting past a blank page quickly.',
        },
        {
          q: 'How do I make viral social media content with AI?',
          a: 'AI can help generate ideas, hooks, and captions quickly, but "viral" isn’t something AI can guarantee, it comes down to timing, platform trends, and genuine audience interest. Use AI to produce more variations faster and test what resonates, rather than expecting any single AI-generated post to go viral on its own.',
        },
      ],
    },
    {
      title: 'AI image & video generation',
      items: [
        {
          q: 'What is the best AI image generator?',
          a: 'There isn’t a single "best" one, it depends on your goal. Some tools excel at photorealism, others at illustration or design work, and some are better integrated into existing creative software. It’s worth trying a couple of tools on the same prompt to see which style fits what you need.',
        },
        {
          q: 'How do I create realistic AI images?',
          a: 'Be specific about lighting, camera angle, lens type, and material details in your prompt, vague prompts produce generic results. Realistic output also depends heavily on the tool itself, newer models tend to handle lighting, hands, and text far better than older ones.',
        },
        {
          q: 'How do I make AI videos?',
          a: 'AI video tools generally take a text prompt, an image, or an existing clip as a starting point and generate short clips, which you then stitch together and edit like any other footage. Expect to iterate, consistency between clips (like a character’s appearance) is still one of the harder problems in AI video.',
        },
        {
          q: 'Which prompts produce the best results?',
          a: 'Specific, descriptive prompts beat short, vague ones, describe the subject, style, composition, and mood explicitly rather than relying on the tool to guess. Looking at example prompts from a tool’s own community or documentation is one of the fastest ways to learn what works.',
        },
      ],
    },
    {
      title: 'AI career & learning',
      items: [
        {
          q: 'Will AI replace programmers?',
          a: 'AI is changing how programmers work, automating boilerplate, generating first drafts of code, and speeding up debugging, but it still needs a developer to define the problem, judge correctness, and handle system design. Programmers who use AI as a tool are likely to be far more productive than those who don’t, rather than being replaced by it outright.',
        },
        {
          q: 'Which jobs are safest from AI?',
          a: 'Roles that depend on physical presence, complex human judgment, high-stakes accountability, or deep interpersonal trust, like skilled trades, healthcare, teaching, and leadership, tend to be harder to automate. Almost every job is being changed by AI to some degree, so the safer bet is learning to work alongside it rather than assuming any role is fully immune.',
        },
        {
          q: 'What AI skills should I learn in 2026?',
          a: 'Prompt engineering and knowing how to effectively use AI coding assistants are useful for almost any technical role, and understanding the basics of how large language models work helps you use them more effectively. If you want to build AI systems rather than just use them, learning Python along with the fundamentals of machine learning is the standard path in.',
        },
        {
          q: 'How do I start a career in AI?',
          a: 'Build a solid programming foundation first, Python is the standard, then learn the math and concepts behind machine learning: linear algebra, statistics, and how models are trained. From there, build real projects, contribute to open source, or take on data-related work to get hands-on experience, since most AI roles value demonstrated projects as much as formal credentials.',
        },
      ],
    },
    {
      title: 'AI privacy, ethics & safety',
      items: [
        {
          q: 'Is my data safe with AI?',
          a: 'It depends on the provider and what you share. Most reputable AI tools have privacy policies covering how your data is stored and whether it’s used for training, so it’s worth reading them before sharing anything sensitive. As a rule, avoid entering passwords, financial details, or other sensitive personal data into any AI chat.',
        },
        {
          q: 'Can AI detect plagiarism?',
          a: 'AI-assisted plagiarism checkers and AI-content detectors exist, but neither is fully reliable, plagiarism detectors can miss paraphrased text, and AI-content detectors regularly produce false positives on human writing. They’re useful as one signal among several, not as definitive proof on their own.',
        },
        {
          q: 'How accurate is AI?',
          a: 'It varies a lot by task. AI is generally strong at well-defined tasks like translation, summarization, or code generation, but accuracy drops on tasks requiring up-to-date facts, precise numbers, or niche knowledge. Always verify anything important, especially numbers, dates, citations, or claims you plan to rely on.',
        },
        {
          q: 'Why does AI hallucinate?',
          a: 'Language models generate text by predicting likely words based on patterns in their training data, they don’t have a built-in fact-checking step. When they don’t actually know an answer, they can still produce a fluent, confident-sounding one that’s wrong, which is why it’s important to verify anything factual an AI tells you, especially specific numbers, quotes, or citations.',
        },
        {
          q: 'Can AI be trusted for important decisions?',
          a: 'AI can support a decision, summarizing data, surfacing options, checking for errors, but it shouldn’t be the final word on anything with real financial, legal, medical, or safety consequences. Treat it as a second opinion or research assistant, and have a human make and take responsibility for high-stakes decisions.',
        },
      ],
    },
  ],
  sv: [
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
    {
      title: 'Programmeringsfrågor',
      items: [
        {
          q: 'Hur lär jag mig programmera från grunden?',
          a: 'Börja med grunderna, variabler, loopar, villkorssatser och funktioner, med ett nybörjarvänligt språk som Python. Öva genom att bygga små projekt istället för att bara läsa, och använd strukturerade lektioner (som Kodstigens gratis stig) för att hålla dig på rätt spår istället för att hoppa slumpmässigt mellan olika tutorials.',
        },
        {
          q: 'Vilket programmeringsspråk ska jag börja med, och hur lång tid tar det att lära sig?',
          a: 'Python är den vanligaste startpunkten eftersom syntaxen är enkel och lättläst, JavaScript är ett bra val om du vill bygga för webben direkt, Java och C# används oftast för backend och företagssystem, och C++ ligger närmare hårdvaran och används för prestandakritisk mjukvara och spel. De flesta når grundläggande färdighet efter några månaders regelbunden övning, men verklig skicklighet tar ett år eller mer av att bygga projekt.',
        },
        {
          q: 'Hur fixar jag fel som NullPointerException, SyntaxError, Segmentation Fault eller ModuleNotFoundError?',
          a: 'Läs felmeddelandet och stacktracet noga, det pekar nästan alltid ut exakt rad och orsak. En NullPointerException betyder att du använder en variabel som aldrig tilldelats ett värde, en SyntaxError betyder att koden inte går att tolka (ofta en saknad klammer eller kolon), en Segmentation Fault betyder att programmet försökt komma åt minne det inte får (vanligt i C/C++), och en ModuleNotFoundError betyder att ett paket inte är installerat eller att din importsökväg är fel.',
        },
        {
          q: 'Hur vänder jag en sträng, sorterar en array, eller löser vanliga intervjuproblem?',
          a: 'Det här är klassiska övningar inom datastrukturer och algoritmer. De flesta språk har inbyggda metoder för att vända och sortera, men på intervjuer vill man oftast att du implementerar logiken själv för att visa att du förstår tillvägagångssättet. Att öva på ett brett urval av problem på till exempel LeetCode, och förstå tids- och minneskomplexiteten för varje lösning, är det bästa sättet att bli bekväm med dem.',
        },
        {
          q: 'Hur fungerar API:er?',
          a: 'Ett API låter ett program hämta data eller utlösa åtgärder i ett annat, oftast via HTTP. REST strukturerar anrop kring URL:er och standardmetoder i HTTP (GET, POST, PUT, DELETE) och returnerar vanligtvis JSON, medan GraphQL låter klienten be om exakt de fält den behöver i ett enda anrop. De flesta API:er kräver också autentisering, vanligtvis en API-nyckel eller en token som OAuth, som skickas med varje anrop.',
        },
        {
          q: 'Hur fungerar Git och GitHub?',
          a: 'Git spårar ändringar i din kod lokalt, du committar ögonblicksbilder av ditt arbete och kan gå ut i en gren (branch) för att testa något utan att påverka huvudkoden. GitHub hostar dessa repon online: `git push` skickar dina lokala commits dit, och `git pull` hämtar andras ändringar. Sammanslagningskonflikter (merge conflicts) uppstår när två grenar ändrar samma rader, du löser dem genom att manuellt välja vilken version (eller en kombination) som ska behållas innan sammanslagningen slutförs.',
        },
        {
          q: 'Hur bygger jag en webbplats eller webbapplikation?',
          a: 'HTML ger struktur, CSS sköter styling och layout, och JavaScript lägger till interaktivitet, det är grunden i varje webbplats. För allt utöver en enkel sida hjälper ett frontend-ramverk som React dig att hantera tillstånd och återanvändbara komponenter, och en backend (en server, ett API och oftast en databas) sköter datalagring, autentisering och affärslogik.',
        },
        {
          q: 'Hur kopplar jag till en databas?',
          a: 'Välj en databas, SQL-databaser som MySQL och PostgreSQL för strukturerad, relationell data, eller MongoDB för flexibel, dokumentbaserad data, och koppla sedan till den från din backend med en drivrutin eller ORM-bibliotek och en anslutningssträng med inloggningsuppgifter. Därefter skriver du frågor (SQL) eller använder drivrutinens metoder (MongoDB) för att läsa och skriva data.',
        },
        {
          q: 'Hur optimerar jag min kod för hastighet, minne eller prestanda?',
          a: 'Börja med att mäta var tiden faktiskt går åt, gissa inte, använd ett profileringsverktyg för att hitta de verkliga flaskhalsarna. Att förstå Big O-notation hjälper dig att upptäcka algoritmer som skalar dåligt, som nästlade loopar över stora datamängder, och ofta kommer de största vinsterna från att välja en bättre datastruktur eller algoritm snarare än att mikrooptimera enskilda rader.',
        },
        {
          q: 'Hur förbereder jag mig för en intervju som mjukvaruutvecklare?',
          a: 'Öva regelbundet på kodproblem (datastrukturer och algoritmer), läs på om systemdesign om du siktar på en mer erfaren roll, och förbered dig för beteendefrågor med konkreta exempel från dina egna projekt eller arbete. Mockintervjuer, och att resonera högt medan du löser problem, gör båda stor skillnad.',
        },
      ],
    },
    {
      title: 'Programmeringskarriär och lärande',
      items: [
        {
          q: 'Är det svårt att lära sig programmera?',
          a: 'Programmering är verkligen utmanande i början, du lär dig ett nytt sätt att tänka utöver ny syntax, men det blir betydligt lättare när de grundläggande mönstren väl klickar. De flesta tycker de första veckorna är svårast, och du märker snabb progression efter att ha byggt några få små projekt.',
        },
        {
          q: 'Kan jag bli programmerare utan en datavetenskaplig examen?',
          a: 'Ja, många yrkesverksamma utvecklare är självlärda eller kommer från en bootcamp snarare än en universitetsexamen. Arbetsgivare bryr sig allt mer om en stark portfölj och förmågan att lösa riktiga problem än om var du studerat, även om vissa större bolag fortfarande föredrar eller kräver en examen för specifika roller.',
        },
        {
          q: 'Är en coding bootcamp värt det, eller ska jag lära mig själv?',
          a: 'En bootcamp ger dig struktur, deadlines och ofta hjälp att hitta jobb efteråt, vilket är värdefullt om du har svårt att hålla dig konsekvent på egen hand, men det är en verklig investering i tid och pengar. Att lära sig själv kostar betydligt mindre och kan ta dig lika långt om du är disciplinerad och följer en strukturerad väg istället för att hoppa slumpmässigt mellan olika tutorials.',
        },
        {
          q: 'Vad är skillnaden mellan ett skript och ett program?',
          a: 'Ett skript är oftast en kort kodsnutt som automatiserar en specifik uppgift och körs direkt av en interpretator, medan ett program vanligtvis syftar på en mer komplett, ofta kompilerad applikation med bredare omfattning. I praktiken är gränsen luddig, och orden används ofta om vartannat.',
        },
        {
          q: 'Vad är skillnaden mellan frontend-, backend- och fullstack-utveckling?',
          a: 'Frontend-utveckling bygger det användare ser och interagerar med i webbläsaren (HTML, CSS, JavaScript, ramverk som React), backend-utveckling sköter servern, databasen och affärslogiken bakom kulisserna, och fullstack innebär att jobba med båda delarna. De flesta riktiga produkter behöver alla tre, oavsett om det är en fullstack-utvecklare eller ett team uppdelat efter specialitet.',
        },
        {
          q: 'Hur mycket tjänar mjukvaruutvecklare?',
          a: 'Det varierar mycket beroende på plats, erfarenhet och specialitet, men mjukvaruutveckling är generellt en av de bättre betalda karriärvägarna, med löner som stiger stadigt när du går från junior till senior roller. Att specialisera sig inom eftertraktade områden som backend-system, molninfrastruktur eller AI ger ofta högre lön, men det snabbaste sättet att höja lönen är oftast att skaffa riktig projekterfarenhet.',
        },
      ],
    },
    {
      title: 'Vanliga skillnader inom programmering',
      items: [
        {
          q: 'Vad är skillnaden mellan == och === i JavaScript?',
          a: '`==` jämför två värden efter att ha konverterat dem till samma typ om de skiljer sig (så `1 == "1"` är sant), medan `===` jämför både värde och typ utan att konvertera något (så `1 === "1"` är falskt). Att använda `===` är nästan alltid det säkrare valet, eftersom det undviker överraskande buggar orsakade av typkonvertering.',
        },
        {
          q: 'Vad är skillnaden mellan en kompilator och en interpretator?',
          a: 'En kompilator översätter hela din källkod till maskinkod i förväg och producerar en fristående körbar fil, medan en interpretator läser och kör kod rad för rad vid körning utan ett separat byggsteg. Vissa språk, som Java, använder båda: kompilerar till en mellanform som sedan tolkas (eller kompileras vidare) av en virtuell maskin.',
        },
        {
          q: 'Vad är skillnaden mellan ett bibliotek och ett ramverk?',
          a: 'Du anropar ett bibliotek, din kod behåller kontrollen och hämtar in specifika funktioner vid behov, men ett ramverk anropar din kod, det definierar den övergripande strukturen och anropar din kod vid specifika punkter ("inversion of control"). Bibliotek brukar vara mer flexibla och lättare att byta ut, ramverk brukar vara mer styrande och tvinga fram ett visst sätt att bygga saker på.',
        },
        {
          q: 'Vad är skillnaden mellan SQL- och NoSQL-databaser?',
          a: 'SQL-databaser (som MySQL och PostgreSQL) lagrar data i strukturerade tabeller med fasta scheman och relationer, och frågas med SQL, medan NoSQL-databaser (som MongoDB) lagrar mer flexibel, ofta dokumentbaserad data utan ett strikt schema. SQL brukar passa bäst när din data är starkt strukturerad och relationer spelar roll, NoSQL brukar passa bättre när din data varierar eller ändrar form ofta.',
        },
        {
          q: 'Vad är skillnaden mellan synkron och asynkron kod?',
          a: 'Synkron kod körs ett steg i taget, varje operation blockerar nästa tills den är klar, medan asynkron kod låter långsamma operationer (som nätverksanrop eller filläsning) köras i bakgrunden så att resten av programmet kan fortsätta. Asynkron kod är avgörande för saker som webbservrar och användargränssnitt, där du inte vill att en långsam förfrågan ska frysa allt annat.',
        },
        {
          q: 'Vad är skillnaden mellan en bugg och ett undantag (exception)?',
          a: 'En bugg är vilken brist som helst i din kod som gör att den beter sig fel, den kan krascha, ge fel resultat eller bara göra något oavsiktligt. Ett undantag är en specifik, ofta hanterad, händelse vid körning, som en fil som inte hittas eller ett nätverksanrop som misslyckas, som din kod kan fånga och reagera på; ett ohanterat undantag är en vanlig orsak till en bugg, men alla buggar involverar inte ett undantag.',
        },
      ],
    },
    {
      title: 'Programmeringskoncept förklarade',
      items: [
        {
          q: 'Vad är objektorienterad programmering?',
          a: 'Objektorienterad programmering (OOP) organiserar kod kring "objekt" som paketerar data (egenskaper) och beteende (metoder) tillsammans, med hjälp av koncept som klasser, arv och inkapsling för att modellera verkliga saker och relationer. Språk som Java, C# och Python stödjer det, och det är särskilt användbart för stora, komplexa kodbaser där det håller relaterad data och logik hanterbar tillsammans.',
        },
        {
          q: 'Vad är rekursion, och när ska jag faktiskt använda den?',
          a: 'Rekursion är när en funktion anropar sig själv för att lösa en mindre version av samma problem, med ett basfall som stoppar den från att anropa sig själv för evigt. Det passar naturligt för problem som i grunden är rekursiva, som att traversera ett träd, tolka nästlade strukturer eller vissa sorteringsalgoritmer, men för enkel upprepning är en vanlig loop oftast tydligare och effektivare.',
        },
        {
          q: 'Vad är en minnesläcka, och hur undviker jag en?',
          a: 'En minnesläcka uppstår när ett program fortsätter hålla minne allokerat som det inte längre behöver, oftast för att något fortfarande refererar till det trots att det inte längre används, vilket gör att minnesanvändningen växer över tid. I språk med skräpsamling (som JavaScript eller Python) orsakas läckor oftast av kvarvarande referenser, som glömda event listeners eller globala variabler, medan de i språk som C eller C++ ofta orsakas av att glömma frigöra minne du själv allokerat.',
        },
        {
          q: 'Vad är async/await, promises och callbacks i JavaScript?',
          a: 'En callback är en funktion som skickas in i en annan funktion för att köras när en operation är klar, en promise omsluter en asynkron operation och låter dig kedja `.then()`/`.catch()` istället för att nästla callbacks, och async/await är syntax byggd ovanpå promises som låter dig skriva asynkron kod som läses som vanlig, synkron kod. De är egentligen tre lager av samma idé, var och en byggd för att göra asynkron kod lättare att följa än den förra.',
        },
        {
          q: 'Vad är dependency injection?',
          a: 'Dependency injection är ett mönster där ett objekt får de andra objekt eller tjänster det behöver utifrån, istället för att skapa dem själv. Det gör koden lättare att testa (du kan byta in ett fejkat beroende) och lättare att ändra (du kan byta ut en verklig implementation utan att skriva om klassen som använder den).',
        },
        {
          q: 'Vad är designmönster, och vilka bör jag faktiskt lära mig?',
          a: 'Designmönster är återanvändbara, namngivna lösningar på vanliga designproblem inom mjukvara, ett gemensamt språk utvecklare använder för att beskriva hur kod är strukturerad. Singleton, Factory, Observer och Strategy hör till de vanligaste och mest värda att lära sig först, de dyker ständigt upp i riktiga kodbaser och på intervjuer, men mönster är ett verktyg, inte ett mål, tvinga inte in ett där enklare kod hade räckt.',
        },
      ],
    },
    {
      title: 'Utvecklarverktyg och arbetsflöde',
      items: [
        {
          q: 'Vilken är den bästa kodredigeraren eller IDE:n för nybörjare?',
          a: 'Visual Studio Code är den vanligaste startpunkten, det är gratis, lättviktigt och har tillägg för nästan alla språk, men en fullständig IDE som PyCharm eller IntelliJ kan erbjuda mer inbyggd tooling för ett specifikt språk när du väl vet vad du jobbar med. Bästa valet är det som inte står i vägen, de flesta nybörjare gör bäst i att lägga den beslutstiden på att skriva kod istället.',
        },
        {
          q: 'Hur felsöker jag kod effektivt?',
          a: 'Börja med att återskapa problemet konsekvent, smalna sedan av det, använd brytpunkter (breakpoints) och en debugger för att stega igenom koden rad för rad, eller lägg till riktade utskrifter/loggar om en debugger inte är praktisk. Läs felmeddelanden och stacktraces noga innan du gissar, de berättar oftast exakt var och varför något gick fel.',
        },
        {
          q: 'Vad är enhetstester (unit testing), och varför spelar det roll?',
          a: 'Ett enhetstest kontrollerar att en liten, isolerad del av koden (oftast en enskild funktion) beter sig korrekt för en given indata, körs automatiskt istället för manuellt. Tester fångar regressioner när du ändrar kod senare, dokumenterar hur en funktion förväntas bete sig, och gör det mycket säkrare att refaktorisera utan att förstöra något du inte märkte.',
        },
        {
          q: 'Hur läser och förstår jag någon annans kod?',
          a: 'Börja från en startpunkt (som `main`, en route handler, eller var körningen börjar) och följ vad som faktiskt anropas, istället för att försöka läsa varje fil uppifrån och ner. Att köra koden, sätta brytpunkter och kolla tester (om de finns) för att se förväntat beteende är oftast snabbare än att bara läsa isolerat.',
        },
        {
          q: 'Vad betyder HTTP-statuskoder som 200, 404 och 500?',
          a: 'De berättar hur en förfrågan gick: koder i 200-serien betyder att den lyckades (200 OK), 300-serien betyder omdirigering, 400-serien betyder att klienten gjorde fel (404 Not Found, 401 Unauthorized), och 500-serien betyder att servern misslyckades med att hantera en giltig förfrågan (500 Internal Server Error). Att snabbt känna igen dessa intervall hjälper dig avgöra om en bugg finns hos dig eller hos servern.',
        },
        {
          q: 'Vad är Docker, och varför använder utvecklare det?',
          a: 'Docker paketerar en applikation tillsammans med allt den behöver för att köras, kod, beroenden, systembibliotek, i en "container" som beter sig likadant på vilken maskin som helst. Det löser det klassiska "det funkar på min dator"-problemet och gör det mycket lättare att utveckla, testa och driftsätta mjukvara konsekvent i olika miljöer.',
        },
        {
          q: 'Vad är CI/CD?',
          a: 'CI (continuous integration) bygger och testar din kod automatiskt varje gång du pushar en ändring, vilket fångar problem tidigt istället för senare, och CD (continuous delivery/deployment) skickar automatiskt den koden till staging eller produktion när den klarat testerna. Tillsammans låter de team släppa ändringar ofta och med tillförsikt istället för att förlita sig på stora, riskfyllda manuella releaser.',
        },
        {
          q: 'Hur driftsätter jag en webbplats eller app till produktion?',
          a: 'Som minimum behöver du någonstans att hosta den (en server eller en plattform som Vercel, Netlify eller en molnleverantör), ett byggsteg som producerar den slutgiltiga koden, och ett sätt att pusha nya versioner live, ofta genom CI/CD så att driftsättningar blir automatiska och repeterbara. För allt utöver en statisk sida behöver du också tänka på miljövariabler, en databasanslutning och övervakning för när något går sönder i produktion.',
        },
      ],
    },
    {
      title: 'AI för företag och produktivitet',
      items: [
        {
          q: 'Hur kan AI automatisera mitt företag?',
          a: 'AI kan ta över repetitiva, regelstyrda uppgifter, som att sortera mejl, skapa rapporter, svara på vanliga kundfrågor eller boka in möten, vilket frigör tid för arbete som faktiskt kräver en människa. Bästa startpunkten är att identifiera en återkommande uppgift som tar många timmar i veckan och automatisera just den, istället för att försöka göra om allt på en gång.',
        },
        {
          q: 'Vilka repetitiva uppgifter kan AI hantera?',
          a: 'Datainmatning, mejlsvar och sammanfattningar, mötesanteckningar, schemaläggning, grundläggande kundsupport, fakturahantering och första utkast av text eller kod är alla vanliga att automatisera med AI idag. Uppgifter som följer ett förutsägbart mönster, även ett komplext sådant, brukar vara goda kandidater.',
        },
        {
          q: 'Vilka AI-verktyg sparar mest tid?',
          a: 'Det beror på uppgiften: chattbaserade assistenter för text och research, automationsplattformar för att koppla ihop appar och trigga arbetsflöden, samt specialiserade verktyg för schemaläggning, transkribering eller kodning. Tidsvinsten kommer oftast mindre från själva verktyget och mer från att faktiskt bygga in det i din vardag.',
        },
        {
          q: 'Hur bygger jag AI-arbetsflöden?',
          a: 'Börja med att kartlägga stegen i uppgiften du vill automatisera, och koppla sedan ihop dem med antingen en no-code-plattform eller, om du är bekväm med att koda, ett API och egen logik. Testa varje steg separat innan du kedjar ihop dem, och behåll en mänsklig kontroll på allt med verkliga konsekvenser, som att skicka mejl eller göra en betalning.',
        },
      ],
    },
    {
      title: 'AI för innehållsskapande',
      items: [
        {
          q: 'Kan AI skriva blogginlägg?',
          a: 'Ja, AI kan skriva ett helt blogginlägg utifrån en disposition eller ett ämne, men bäst resultat får du om du behandlar det som ett första utkast. Ge tydlig struktur, målgrupp och ton, redigera sedan för korrekthet, röst och sådant den fått fel eller hittat på.',
        },
        {
          q: 'Hur genererar jag manus till YouTube-videor?',
          a: 'Ge AI:n videons ämne, önskad längd och ton (utbildande, underhållande, och så vidare), och be först om en struktur, hook, huvudpunkter, call to action, innan du genererar hela manuset. Att jobba i sektioner ger oftast bättre resultat än att be om hela manuset på en gång.',
        },
        {
          q: 'Kan AI skapa presentationer?',
          a: 'Ja, AI kan generera dispositioner för bilder, talarstöd och till och med hela presentationer i verktyg som stödjer det, men du vill oftast fortfarande justera designen och dubbelkolla fakta och siffror som tas med. Det är mest användbart för att snabbt komma förbi det tomma bladet.',
        },
        {
          q: 'Hur skapar jag viralt innehåll på sociala medier med AI?',
          a: 'AI kan snabbt hjälpa till med idéer, hooks och texter, men "viralt" är inget AI kan garantera, det handlar om timing, plattformstrender och genuint intresse hos publiken. Använd AI för att snabbare ta fram fler varianter och testa vad som fungerar, istället för att förvänta dig att ett enskilt AI-genererat inlägg ska bli viralt av sig själv.',
        },
      ],
    },
    {
      title: 'AI-genererade bilder och videor',
      items: [
        {
          q: 'Vilket är det bästa AI-bildverktyget?',
          a: 'Det finns inget enskilt "bästa" verktyg, det beror på vad du ska göra. Vissa verktyg är bäst på fotorealism, andra på illustration eller designarbete, och vissa är bättre integrerade i befintlig kreativ mjukvara. Det är värt att testa några verktyg med samma prompt för att se vilken stil som passar dina behov.',
        },
        {
          q: 'Hur skapar jag realistiska AI-bilder?',
          a: 'Var specifik kring belysning, kameravinkel, objektivtyp och materialdetaljer i din prompt, vaga prompter ger generiska resultat. Realistiskt resultat beror också mycket på själva verktyget, nyare modeller hanterar oftast belysning, händer och text betydligt bättre än äldre.',
        },
        {
          q: 'Hur skapar jag AI-videor?',
          a: 'AI-videoverktyg utgår oftast från en textprompt, en bild eller ett befintligt klipp och genererar korta klipp, som du sedan klipper ihop och redigerar som vilken annan film som helst. Räkna med att behöva iterera, konsekvens mellan klipp (som en karaktärs utseende) är fortfarande ett av de svårare problemen inom AI-video.',
        },
        {
          q: 'Vilka prompter ger bäst resultat?',
          a: 'Specifika, beskrivande prompter slår korta, vaga sådana, beskriv motiv, stil, komposition och stämning uttryckligen istället för att förlita dig på att verktyget gissar rätt. Att titta på exempelprompter från ett verktygs egen community eller dokumentation är ett av de snabbaste sätten att lära sig vad som funkar.',
        },
      ],
    },
    {
      title: 'AI-karriär och lärande',
      items: [
        {
          q: 'Kommer AI att ersätta programmerare?',
          a: 'AI förändrar hur programmerare jobbar, automatiserar standardkod, genererar första utkast av kod och snabbar upp felsökning, men det behövs fortfarande en utvecklare för att definiera problemet, bedöma korrekthet och sköta systemdesign. Programmerare som använder AI som ett verktyg kommer sannolikt bli betydligt mer produktiva än de som inte gör det, snarare än att bli utbytta helt.',
        },
        {
          q: 'Vilka jobb är säkrast från AI?',
          a: 'Roller som kräver fysisk närvaro, komplexa mänskliga bedömningar, högt ansvarstagande eller djupt mellanmänskligt förtroende, som hantverksyrken, sjukvård, undervisning och ledarskap, brukar vara svårare att automatisera. Nästan alla jobb förändras av AI i någon grad, så det säkraste är att lära sig arbeta tillsammans med AI snarare än att anta att någon roll är helt immun.',
        },
        {
          q: 'Vilka AI-kunskaper bör jag lära mig 2026?',
          a: 'Prompt engineering och att kunna använda AI-kodassistenter effektivt är användbart i nästan alla tekniska roller, och att förstå grunderna i hur stora språkmodeller fungerar hjälper dig använda dem bättre. Vill du bygga AI-system istället för att bara använda dem är Python tillsammans med grunderna i maskininlärning den vanliga vägen in.',
        },
        {
          q: 'Hur börjar jag en karriär inom AI?',
          a: 'Bygg en stabil grund i programmering först, Python är standarden, lär dig sedan matematiken och koncepten bakom maskininlärning: linjär algebra, statistik och hur modeller tränas. Bygg därefter riktiga projekt, bidra till öppen källkod, eller ta datarelaterade uppdrag för att få praktisk erfarenhet, eftersom de flesta AI-roller värdesätter visade projekt lika mycket som formella meriter.',
        },
      ],
    },
    {
      title: 'AI: integritet, etik och säkerhet',
      items: [
        {
          q: 'Är min data säker med AI?',
          a: 'Det beror på leverantören och vad du delar. De flesta seriösa AI-verktyg har integritetspolicyer som beskriver hur din data lagras och om den används för träning, så det är värt att läsa dem innan du delar något känsligt. Som regel bör du undvika att skriva lösenord, ekonomiska uppgifter eller annan känslig personlig information i en AI-chatt.',
        },
        {
          q: 'Kan AI upptäcka plagiat?',
          a: 'Både plagiatkontroller och AI-detektorer för genererat innehåll finns, men ingen av dem är helt tillförlitlig, plagiatkontroller kan missa omskriven text, och AI-detektorer ger regelbundet falska positiva resultat på mänskligt skriven text. De är användbara som en signal bland flera, inte som slutgiltigt bevis i sig själva.',
        },
        {
          q: 'Hur träffsäker är AI?',
          a: 'Det varierar mycket beroende på uppgift. AI är generellt starkt på väldefinierade uppgifter som översättning, sammanfattning eller kodgenerering, men träffsäkerheten sjunker för uppgifter som kräver aktuella fakta, exakta siffror eller nischad kunskap. Kontrollera alltid allt viktigt, särskilt siffror, datum, källor eller påståenden du tänker förlita dig på.',
        },
        {
          q: 'Varför hallucinerar AI?',
          a: 'Språkmodeller genererar text genom att förutsäga sannolika ord baserat på mönster i träningsdatan, de har inget inbyggt faktakontrollsteg. När de egentligen inte vet svaret kan de ändå producera ett flytande, självsäkert låtande svar som är fel, vilket är varför det är viktigt att verifiera allt faktabaserat en AI säger, särskilt specifika siffror, citat eller källor.',
        },
        {
          q: 'Kan man lita på AI för viktiga beslut?',
          a: 'AI kan stötta ett beslut, sammanfatta data, ta fram alternativ, kontrollera för fel, men bör inte vara det slutgiltiga ordet i något med verkliga ekonomiska, juridiska, medicinska eller säkerhetsmässiga konsekvenser. Se det som en second opinion eller research-assistent, och låt en människa fatta och ta ansvar för beslut med höga insatser.',
        },
      ],
    },
  ],
};

export const pageText = {
  en: {
    metaTitle: 'Frequently Asked Questions | Kodstigen',
    metaDescription:
      'Answers to common questions about learning on Kodstigen: pricing, how courses and quizzes work, certificates, coding challenges, and becoming an instructor.',
    back: '← Back home',
    heading: 'Frequently Asked Questions',
    intro: 'Answers to the most common questions about learning, and teaching, on Kodstigen. Can’t find what you’re looking for?',
    introLink: 'Get in touch',
  },
  sv: {
    metaTitle: 'Vanliga frågor | Kodstigen',
    metaDescription:
      'Svar på vanliga frågor om att lära sig på Kodstigen: pris, hur kurser och quiz fungerar, certifikat, kodutmaningar och att bli instruktör.',
    back: '← Till startsidan',
    heading: 'Vanliga frågor',
    intro: 'Svar på de vanligaste frågorna om att lära sig, och undervisa, på Kodstigen. Hittar du inte det du letar efter?',
    introLink: 'Hör av dig',
  },
};

export function buildFaqStructuredData(language: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: SECTIONS[language].flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  };
}

export function Faq() {
  const { language } = useLanguage();
  const sections = SECTIONS[language];
  const t = pageText[language];
  const structuredData = buildFaqStructuredData(language);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageMeta title={t.metaTitle} description={t.metaDescription} structuredData={structuredData} />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        {t.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.heading}</h1>
      <p className="mt-3 text-slate-400">
        {t.intro}{' '}
        <a href="mailto:Sebbelarsson9601@gmail.com" className="text-forge-500 hover:text-forge-100 hover:underline">
          {t.introLink}
        </a>
        .
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-forge-500">{section.title}</h2>
            <div className="mt-4 space-y-2">
              {section.items.map((item) => (
                <details key={item.q} className="group rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
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
