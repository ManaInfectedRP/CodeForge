import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactModal } from '../components/ContactModal';
import { FaqOutline, slugifyFaqTitle } from '../components/FaqOutline';
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
          q: 'What is GRC?',
          a: 'GRC stands for Governance, Risk, and Compliance, the practices that keep an organization’s technology decisions aligned with its policies (governance), aware of and prepared for what could go wrong (risk), and provably meeting external laws, regulations, and standards like SOC 2 or GDPR (compliance). It matters to engineers because things like access reviews, audit logs, and change-management approvals usually exist to satisfy GRC requirements, not just as extra process for its own sake.',
        },
        {
          q: 'How do I deploy a website or app to production?',
          a: 'At a minimum you need somewhere to host it (a server or a platform like Vercel, Netlify, or a cloud provider), a build step that produces the final code, and a way to push new versions live, often through CI/CD so deploys are automatic and repeatable. For anything beyond a static site, you’ll also need to think about environment variables, a database connection, and monitoring for when something breaks in production.',
        },
      ],
    },
    {
      title: 'AI basics',
      items: [
        {
          q: 'What is AI?',
          a: 'AI, artificial intelligence, is an umbrella term for software that can perform tasks that normally require human intelligence, like recognizing patterns, understanding language, making decisions, or solving problems. Modern AI almost always relies on machine learning, where a system is trained on large amounts of data instead of being programmed with explicit rules for every scenario.',
        },
        {
          q: 'What is artificial intelligence?',
          a: 'Artificial intelligence is the full name behind the term usually shortened to AI, software that simulates aspects of human thinking like learning, reasoning, and problem-solving. The term spans everything from simple rule-based systems to today’s large language models, so what counts as "intelligent" has shifted a lot since the term was coined in the 1950s.',
        },
        {
          q: 'How does AI work?',
          a: 'Most modern AI systems work through machine learning: a model is fed large amounts of example data and adjusts its internal parameters until it can find patterns and make predictions on new, unseen data. Instead of someone writing rules for every possible case, the model learns the relationships itself by minimizing its errors during training.',
        },
        {
          q: 'What can AI be used for?',
          a: 'AI is used today for everything from text and image generation to fraud detection, product recommendations, medical imaging, coding assistance, and customer service. Broadly, AI works best on tasks with lots of data and clear patterns, from sorting emails to spotting anomalies in a large dataset.',
        },
        {
          q: 'What types of AI are there?',
          a: 'One common split is by capability: narrow AI is specialized in a single task, like voice assistants or spam filters, and is the only kind that actually exists today, while general AI (AGI), an AI matching human intelligence across every domain, is still theoretical. Another split is by technique: rule-based systems, classical machine learning, and deep learning with neural networks, with generative AI and LLMs belonging to the latter category.',
        },
        {
          q: 'How does AI learn?',
          a: 'Most AI models learn by analyzing large amounts of example data and adjusting their internal parameters to minimize errors, a process called training. There are three main approaches: supervised learning (data with correct answers attached), unsupervised learning (finding patterns with no answer key), and reinforcement learning (rewarding good decisions), and large language models often combine several of these across different training stages.',
        },
      ],
    },
    {
      title: 'Generative AI',
      items: [
        {
          q: 'What is Generative AI (Gen AI)?',
          a: 'Generative AI is AI that creates entirely new content, text, images, audio, video, or code, rather than just classifying or analyzing existing data. Tools like ChatGPT, Midjourney, and GitHub Copilot are all examples of generative AI.',
        },
        {
          q: 'What is ChatGPT?',
          a: 'ChatGPT is a chat assistant from OpenAI built on top of a large language model (GPT), able to hold conversations, answer questions, write text and code, and reason about a wide range of topics based on what you type into the chat. It was one of the first AI tools to put generative AI in front of the general public, in a simple chat interface, when it launched in late 2022.',
        },
        {
          q: 'How does Generative AI work?',
          a: 'Generative models are trained on enormous amounts of data and learn the probability of what typically comes next, the next word in a sentence, the next pixel in an image. When you give the model a prompt, it generates new content step by step based on the patterns it learned, rather than copying or looking up a ready-made answer.',
        },
        {
          q: 'What’s the difference between AI and Generative AI?',
          a: 'AI is the broader umbrella term for all software that simulates intelligent behavior, including things that classify, predict, or detect patterns without creating anything new, like spam filters or recommendation systems. Generative AI is a subset of AI specifically focused on creating new content, text, images, or code, rather than just analyzing what already exists.',
        },
        {
          q: 'What are the best AI tools?',
          a: 'It depends entirely on the task: ChatGPT and Claude are strong for text, reasoning, and coding, Midjourney and similar tools excel at images, and GitHub Copilot is built specifically to write code alongside you in the editor. Most people who use AI regularly end up with a combination of a few different tools rather than one single "best" tool for everything.',
        },
        {
          q: 'How do businesses use Generative AI?',
          a: 'Businesses use generative AI to speed up research and report writing, generate first drafts of marketing copy and code, summarize meetings and documents, and build customer service bots that respond in natural language instead of fixed menus. The most common approach is starting small with a clearly scoped use case, with a human checking the output, before scaling up to more autonomous workflows.',
        },
      ],
    },
    {
      title: 'LLMs',
      items: [
        {
          q: 'What is an LLM?',
          a: 'An LLM (Large Language Model) is an AI model trained on enormous amounts of text to understand and generate human language. GPT (which powers ChatGPT), Claude, and Gemini are all examples of LLMs.',
        },
        {
          q: 'How does an LLM work?',
          a: 'An LLM is built on a transformer architecture that learns statistical patterns in language by training on huge amounts of text, then predicts the most likely next word (or "token") given everything that came before, over and over until a full response is built. It doesn’t "understand" language the way a human does, but it has learned extremely detailed patterns for how words and concepts relate to each other.',
        },
        {
          q: 'What does LLM stand for?',
          a: 'LLM stands for Large Language Model, an AI model trained on enormous amounts of text so it can understand and generate language. "Large" refers both to the amount of training data and to the model’s size, often billions or even trillions of internal parameters.',
        },
        {
          q: 'What’s the difference between an LLM and AI?',
          a: 'AI is the broad umbrella term for all software that simulates intelligent behavior, while an LLM is a specific type of AI model specialized in understanding and generating text. So every LLM is AI, but far from all AI is an LLM, an image recognition system or a chess engine is also AI without being a language model.',
        },
        {
          q: 'What’s the difference between LLM and Gen AI?',
          a: 'An LLM is a specific type of model, trained on text, while generative AI is the broader term for any AI that creates new content, whether that’s text, images, audio, or video. So an LLM is always a form of generative AI, but generative AI also covers image and video models that aren’t LLMs.',
        },
        {
          q: 'Which LLM models exist?',
          a: 'Some of today’s best-known LLMs are OpenAI’s GPT series (which powers ChatGPT), Anthropic’s Claude, Google’s Gemini, Meta’s Llama, and Mistral’s models. They differ in size, cost, how open they are (some, like Llama and Mistral, can be downloaded and run yourself), and their particular strengths, like coding, reasoning, or long context windows.',
        },
        {
          q: 'What is RAG?',
          a: 'RAG (Retrieval-Augmented Generation) is a technique where a language model first retrieves relevant information from an external source, like a database or document collection, before generating its answer. That lets the model answer with current or company-specific information it was never trained on, instead of relying solely on what it memorized during training, which also reduces the risk of hallucinations.',
        },
        {
          q: 'What is fine-tuning?',
          a: 'Fine-tuning means taking an already-trained language model and training it further on a smaller, more specific dataset to adapt its behavior or knowledge to a particular use case. It’s used, for example, to get a model to respond in a certain tone, get better at a niche task, or follow a company’s specific format, without training an entirely new model from scratch.',
        },
        {
          q: 'What is prompt engineering?',
          a: 'Prompt engineering is the skill of phrasing instructions to an AI model in a way that produces more accurate, useful answers, by being clear about the goal, context, format, and any constraints. A good prompt can be the difference between a generic, half-useful answer and one you can use right away, especially for more complex or multi-step tasks.',
        },
      ],
    },
    {
      title: 'AI agents',
      items: [
        {
          q: 'What is an AI agent?',
          a: 'An AI agent is an AI system that can act more independently than a regular chatbot, it can plan multiple steps, use tools (like searching the web, running code, or calling an API), and make decisions to reach a goal, often without a human approving each individual step. Unlike a model that only responds to one question at a time, an agent can carry out an entire task from start to finish.',
        },
        {
          q: 'How do AI agents work?',
          a: 'An AI agent typically uses an LLM as its "brain," which breaks a goal down into smaller sub-steps, decides which tools each step needs, executes them, and then evaluates the result before moving on or adjusting its plan. This loop, plan, act, observe, repeat, continues until the goal is reached or the agent hits a limit it can’t resolve on its own.',
        },
        {
          q: 'What’s the difference between a chatbot and an AI agent?',
          a: 'A chatbot responds to one message at a time within a conversation, it reacts but rarely acts independently outside the chat. An AI agent can instead take a goal, plan multiple steps on its own, use tools like searching for information or running code, and drive a task to completion with minimal human involvement along the way.',
        },
        {
          q: 'What can an AI agent do?',
          a: 'An AI agent can, for example, research a topic across multiple sources, write and test code, book meetings by interacting with a calendar, fill out forms, monitor systems and flag anomalies, or handle multi-step customer service cases. The limit is usually set by which tools and access the agent has been given, rather than by the model itself.',
        },
        {
          q: 'How do you build an AI agent?',
          a: 'At its core you need an LLM, a clear definition of which tools the agent is allowed to use (search, code execution, API calls, and so on), and a loop that lets the model plan, act, and evaluate the result before moving forward. Most people today build with frameworks or SDKs designed for this, which make tool calling and memory easier, rather than writing the whole loop from scratch.',
        },
        {
          q: 'What does an AI agent cost?',
          a: 'The cost depends on how many AI calls the agent makes, how much context it sends each time, and which model is used, an agent that runs several steps and tool calls per task can quickly cost significantly more than a single chat message. On top of the model cost itself, there’s usually development time and any tools or services the agent needs to integrate with.',
        },
        {
          q: 'Are AI agents safe?',
          a: 'AI agents carry different risks than a regular chatbot, because they can actually take actions, like sending emails, changing files, or making purchases, not just offer suggestions. That makes it important to limit which tools and access an agent has, require human approval for actions with real consequences, and test the agent thoroughly before letting it act without oversight.',
        },
      ],
    },
    {
      title: 'Comparisons',
      items: [
        {
          q: 'What’s the difference between LLM and AI agent?',
          a: 'An LLM is the language model itself, it generates text based on a prompt but doesn’t act on its own. An AI agent uses one or more LLMs as its "brain" but builds on top of that with the ability to plan multiple steps, use tools, and drive a task toward a goal without a human steering every step.',
        },
        {
          q: 'What’s the difference between ChatGPT and Copilot?',
          a: 'ChatGPT is a general-purpose chat assistant for pretty much any topic, while GitHub Copilot is purpose-built for coding and lives directly in your editor, suggesting code line by line or function by function based on the context in your file. Both are built on similar underlying technology, but Copilot is optimized specifically for a developer’s workflow.',
        },
        {
          q: 'ChatGPT or Gemini?',
          a: 'Both are strong general-purpose AI assistants, ChatGPT often has an edge in pure text quality and a large ecosystem of plugins, while Gemini is deeply integrated into Google’s own products like Search, Gmail, and Docs, which can be a big plus if you already live in Google’s ecosystem. The choice usually comes down more to which ecosystem you’re already using than a clear quality gap.',
        },
        {
          q: 'Claude or ChatGPT?',
          a: 'Claude, from Anthropic, tends to get praised for longer, more nuanced responses and strong coding ability, while ChatGPT has the broadest ecosystem of plugins, voice mode, and integrations. Many people who work heavily with code or longer documents prefer Claude, while ChatGPT is often the default choice for a broad range of everyday tasks.',
        },
        {
          q: 'AI agent or chatbot?',
          a: 'A chatbot is plenty for straightforward questions and answers, like customer support or looking something up, where you’re steering every step of the conversation yourself. An AI agent is the right call when the task requires multiple steps, tool use, or something actually getting done on your behalf, like researching, booking, or writing and testing code, rather than just answering.',
        },
        {
          q: 'LLM or machine learning?',
          a: 'This isn’t really a choice between two alternatives, an LLM is a specific type of machine learning model, specialized in language. Classical machine learning covers a much broader toolbox, and often fits better for structured data and narrowly defined predictions, like predicting customer churn or detecting fraud, where an LLM would be unnecessarily heavy and expensive.',
        },
        {
          q: 'AI or automation?',
          a: 'Traditional automation (like RPA) follows fixed, pre-programmed rules and works best for repetitive tasks with clear, predictable steps. AI is the better fit when the task requires interpreting unstructured information, like text or images, or making decisions that can’t be captured in simple if-then rules, and many modern solutions actually combine both.',
        },
      ],
    },
    {
      title: 'The tech behind AI',
      items: [
        {
          q: 'What is machine learning?',
          a: 'Machine learning is a branch of AI where systems learn patterns from data instead of being programmed with explicit rules for every scenario. The model trains by seeing many examples and gradually adjusting its internal parameters to minimize its errors, and can then make predictions on new data it’s never seen before.',
        },
        {
          q: 'What is deep learning?',
          a: 'Deep learning is a type of machine learning that uses neural networks with many layers, "deep" networks, to learn increasingly abstract representations of data. It’s the technology behind most modern AI breakthroughs, from image recognition to large language models, since more layers let the network capture far more complex patterns than simpler machine learning models.',
        },
        {
          q: 'What are neural networks?',
          a: 'A neural network is an AI model loosely inspired by how neurons in the brain are connected, built from layers of "nodes" that each do a simple calculation and pass the result to the next layer. By adjusting the strength of the connections between nodes during training, the network learns to recognize patterns in its input, and stacking enough layers is what’s called deep learning.',
        },
        {
          q: 'What are embeddings?',
          a: 'Embeddings are a way of representing words, sentences, images, or other data as lists of numbers (vectors) that capture their meaning, things that are similar in meaning end up close together in that mathematical space. They’re used for things like search, recommendations, and RAG, where you need to quickly find content that’s semantically similar to a query, not just matching word for word.',
        },
        {
          q: 'What is a transformer model?',
          a: 'Transformer is the neural network architecture behind modern LLMs, introduced in 2017. Its key innovation is "attention," a mechanism that lets the model weigh how relevant every word in the input is to every other word, regardless of distance in the text, making it much better at capturing context in long passages than earlier architectures.',
        },
        {
          q: 'What is a token in AI?',
          a: 'A token is the smallest unit of text a language model processes, often a word, part of a word, or a punctuation mark, depending on how the text gets split up. Models read and generate text token by token, and the cost of using most AI APIs is also calculated per token, both for what you send in and what the model sends back.',
        },
        {
          q: 'What is multimodal AI?',
          a: 'Multimodal AI is a model that can understand and/or generate more than one type of data, like text, images, audio, and video, within the same system rather than needing a separate model for each type. That means you can, for example, show a model an image and ask a question about it in text, or ask it to generate an image from a text description, all within the same conversation.',
        },
      ],
    },
    {
      title: 'Practical AI questions',
      items: [
        {
          q: 'How do you write good prompts?',
          a: 'Be specific about the goal, the context, the desired format, and any constraints, instead of asking a vague question and hoping for the best. It also helps to give the model an example of what a good answer looks like, ask it to reason step by step for harder tasks, and iterate, a follow-up question that refines the answer is often faster than trying to get everything right in the first prompt.',
        },
        {
          q: 'How do you use ChatGPT effectively?',
          a: 'Give clear context about who the answer is for, its purpose, and its tone, ask for a first draft rather than a finished answer and refine it over a few rounds, and use features like custom instructions or file uploads when you need it to remember context or work with specific material. It’s also worth always double-checking facts, numbers, and quotes it gives you, rather than trusting a confident-sounding answer blindly.',
        },
        {
          q: 'Can AI write code?',
          a: 'Yes, modern AI models can write, explain, debug, and refactor code in most popular programming languages, and tools like GitHub Copilot or Claude Code build that ability directly into the editor. AI-written code still needs a human to review it, it can look correct while containing subtle bugs, security issues, or outdated patterns.',
        },
        {
          q: 'Can AI analyze documents?',
          a: 'Yes, modern AI models can read and summarize long documents, extract specific data points, compare multiple documents against each other, or answer questions about the content, often by having you upload the file directly into the chat. For large document collections or company-specific material, RAG is often used so the model can retrieve the right section instead of needing the entire dataset in every single query.',
        },
        {
          q: 'Can AI summarize meetings?',
          a: 'Yes, AI tools can transcribe a meeting in real time or from a recording and generate a summary with key points, decisions, and action items, often connected directly to video meeting tools like Zoom or Teams. It’s worth a quick skim of the summary against what was actually said, especially for nuanced discussions or when several people were talking over each other.',
        },
        {
          q: 'Can AI create images?',
          a: 'Yes, tools like Midjourney, DALL-E, and Stable Diffusion can generate images entirely from a text description, in styles ranging from photorealism to illustration and concept art. The more specific the prompt is about subject, style, composition, and lighting, the closer the result gets to what you actually had in mind.',
        },
        {
          q: 'Can AI replace humans?',
          a: 'AI can take over specific tasks, especially repetitive or pattern-based ones, but it rarely replaces an entire role outright, since most jobs require judgment, accountability, or human connection that AI still can’t reliably handle. The more likely outcome is that AI changes what tasks a role actually involves, rather than eliminating the role entirely, though some highly routine work will get automated away completely.',
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
        {
          q: 'How do you roll out AI in your organization?',
          a: 'Start with one small, clearly scoped use case where you can measure the impact, rather than trying to roll AI out everywhere at once. Involve the people who’ll actually use the tool in the evaluation, set clear guidelines for what data is allowed to be shared with AI services, and scale up gradually as you see what actually works for your organization.',
        },
        {
          q: 'How do you measure ROI on AI?',
          a: 'Base it on concrete metrics relevant to the use case, time saved per task, reduced error rate, faster customer response times, or increased output per employee, and weigh that against the cost of the tool, implementation, and any training. ROI on AI is often harder to measure than for traditional software since the gains can be diffuse (like "better decisions"), so it pays to define your metrics before you start, not after.',
        },
        {
          q: 'How does AI affect different industries?',
          a: 'The impact varies widely: software development and customer service already use AI broadly to automate routine tasks, healthcare uses it for imaging diagnostics and administrative support, legal and finance use it for document review and analysis, and media and marketing use it for content production. Generally, industries where the work is already data- and text-heavy are affected the most, while physical or heavily regulated work changes more slowly.',
        },
        {
          q: 'How do you build an AI strategy?',
          a: 'An AI strategy should start from your actual business goals rather than the technology itself, identify where AI can solve a real problem, prioritize by impact and feasibility, and include guidelines for data protection, accountability, and who owns the decisions AI is helping with. It’s also worth building in continuous evaluation from the start, since both the tools and what’s possible keep changing quickly.',
        },
        {
          q: 'How do businesses use AI?',
          a: 'Businesses use AI for everything from automating routine tasks and analyzing large datasets to powering customer service, detecting fraud, and supporting decisions in areas from inventory management to hiring, not just through generative chat tools but also through more traditional machine learning running in the background. Most large companies already use a mix of both, generative AI for text- and content-heavy tasks, and classical machine learning for more structured, data-heavy processes.',
        },
        {
          q: 'What does it cost to adopt AI?',
          a: 'Costs vary enormously depending on ambition: using ready-made AI tools (like ChatGPT Enterprise or Copilot) usually means a per-user monthly license fee, building your own AI features with APIs adds a cost per call plus development time, and training or fine-tuning your own models requires a significantly bigger investment in data, compute, and expertise. Most companies start with off-the-shelf tools or API-based solutions rather than training their own models from scratch, since that delivers most of the value at a fraction of the cost.',
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
        {
          q: 'What’s the difference between prompt engineering and autocomplete?',
          a: 'Autocomplete predicts the next few words or lines based on what you’ve already typed, it’s reactive and works with almost no input from you, like an AI coding assistant finishing a function you’ve started. Prompt engineering is you proactively writing a clear, detailed instruction, upfront, describing the goal, constraints, and context, to get a complete, specific result in one go, generating a whole function, class, or explanation from a description rather than a few keystrokes. In practice they’re complementary: a good prompt gets you further than a good prompt engineer, autocomplete keeps momentum going once you’re mid-task, and most AI coding workflows lean on both.',
        },
        {
          q: 'How will AI affect the future of work?',
          a: 'AI is likely to change what tasks most jobs involve rather than wipe out entire professions, the routine, pattern-based parts of a job get automated first, while tasks that require judgment, creativity, or human connection stick around longer. Like previous technological shifts, it will likely create new roles that don’t exist today, while also requiring many workers to continuously reskill and learn to work alongside AI tools to stay competitive.',
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
        {
          q: 'Can AI be biased?',
          a: 'Yes. AI models learn from large amounts of existing text and data, and they can pick up and repeat biases present in that data, whether cultural, gender, racial, or political. Reputable providers work to reduce this through curated training data and testing, but no model is fully neutral, so it’s worth treating AI output like any single source: cross-check anything sensitive or consequential rather than assuming it’s objective.',
        },
        {
          q: 'Is ChatGPT GDPR-compliant?',
          a: 'It depends on how it’s used, OpenAI offers agreements and settings (like turning off training on your data or using enterprise tiers with data processing agreements) that can make usage GDPR-compliant, but the standard consumer version isn’t automatically set up to handle sensitive personal data. Businesses that want to use ChatGPT with personal data should review data processing agreements, data retention settings, and exactly what data is being entered, rather than assuming it’s safe by default.',
        },
        {
          q: 'Is AI safe to use?',
          a: 'AI is fundamentally safe to use for most everyday tasks, but the risk grows with how sensitive the information you share is and how blindly you trust the answers. The biggest risks are sharing sensitive data with a service whose policy you haven’t read, and acting on incorrect information (a hallucination) without verifying it.',
        },
        {
          q: 'How do you protect company data in AI?',
          a: 'Use enterprise tiers or APIs with data processing agreements rather than free consumer versions, turn off settings that let the provider train on your data, and set clear guidelines for what kind of information employees are allowed to enter into AI tools. For especially sensitive data, self-hosted or private models are sometimes a requirement, rather than relying on a cloud service.',
        },
        {
          q: 'Who owns content that AI creates?',
          a: 'It varies by country and is still evolving legally, but in most AI providers’ terms of service (like OpenAI’s and Anthropic’s) the rights to generated content are assigned to the user, within the bounds of their terms. Whether content with no human involvement at all can be copyrighted at all, though, is still unclear in several jurisdictions, including the US.',
        },
        {
          q: 'What AI rules apply in the EU?',
          a: 'The EU’s AI Act is the central piece of regulation, it classifies AI systems by risk level and imposes the strictest requirements on "high-risk" systems, like those used in hiring, credit scoring, or law enforcement, while most chat assistants fall under lower-risk categories with lighter requirements. On top of the AI Act, GDPR of course still applies in full to any AI that processes personal data, regardless of risk classification.',
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
          q: 'Vad är GRC?',
          a: 'GRC står för Governance, Risk och Compliance (styrning, risk och regelefterlevnad), praxis som håller en organisations tekniska beslut i linje med sina policyer (styrning), medveten om och förberedd på vad som kan gå fel (risk), och bevisligen uppfyller externa lagar, regler och standarder som SOC 2 eller GDPR (regelefterlevnad). Det spelar roll för utvecklare eftersom saker som åtkomstgranskningar, granskningsloggar och godkännanden i ändringshanteringen oftast finns för att uppfylla GRC-krav, inte bara som extra process för sin egen skull.',
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
      title: 'Grundläggande AI',
      items: [
        {
          q: 'Vad är AI?',
          a: 'AI, artificiell intelligens, är ett samlingsnamn för mjukvara som kan utföra uppgifter som normalt kräver mänsklig intelligens, som att känna igen mönster, förstå språk, fatta beslut eller lösa problem. Modern AI bygger nästan alltid på maskininlärning, där ett system tränas på stora mängder data istället för att programmeras med explicita regler för varje scenario.',
        },
        {
          q: 'Vad är artificiell intelligens?',
          a: 'Artificiell intelligens är den fullständiga termen för det som oftast förkortas AI, mjukvara som simulerar delar av mänskligt tänkande som inlärning, resonemang och problemlösning. Begreppet spänner över allt från enkla regelbaserade system till dagens stora språkmodeller, så vad som räknas som "intelligent" har förändrats mycket sedan termen myntades på 1950-talet.',
        },
        {
          q: 'Hur fungerar AI?',
          a: 'De flesta moderna AI-system fungerar genom maskininlärning: en modell matas med stora mängder exempeldata och justerar sina interna parametrar tills den kan hitta mönster och göra förutsägelser på ny, osedd data. Istället för att någon skriver regler för varje tänkbart fall lär sig modellen själv sambanden genom att minimera sina fel under träningen.',
        },
        {
          q: 'Vad kan AI användas till?',
          a: 'AI används idag för allt från textgenerering och bildskapande till bedrägeriupptäckt, produktrekommendationer, medicinsk bilddiagnostik, kodningsassistans och kundtjänst. Generellt passar AI bäst för uppgifter med mycket data och tydliga mönster, från att sortera mejl till att upptäcka avvikelser i stora dataset.',
        },
        {
          q: 'Vilka typer av AI finns det?',
          a: 'En vanlig indelning är efter förmåga: smal AI (narrow AI) är specialiserad på en uppgift, som röstassistenter eller spamfilter, och är det enda som faktiskt finns idag, medan generell AI (AGI), en AI som matchar mänsklig intelligens inom alla områden, ännu bara är teoretisk. En annan indelning är efter teknik: regelbaserade system, klassisk maskininlärning, och djupinlärning med neurala nätverk, där generativ AI och LLM:er hör till den senare kategorin.',
        },
        {
          q: 'Hur lär sig AI?',
          a: 'De flesta AI-modeller lär sig genom att analysera stora mängder exempeldata och justera sina interna parametrar för att minimera fel, en process som kallas träning. Det finns tre huvudsakliga sätt: övervakad inlärning (data med rätta svar), oövervakad inlärning (mönster utan facit) och förstärkningsinlärning (belöning för bra beslut), och stora språkmodeller kombinerar ofta flera av dessa i olika träningssteg.',
        },
      ],
    },
    {
      title: 'Generativ AI',
      items: [
        {
          q: 'Vad är Generativ AI (Gen AI)?',
          a: 'Generativ AI är AI som skapar helt nytt innehåll, text, bilder, ljud, video eller kod, istället för att bara klassificera eller analysera befintlig data. Verktyg som ChatGPT, Midjourney och GitHub Copilot är alla exempel på generativ AI.',
        },
        {
          q: 'Vad är ChatGPT?',
          a: 'ChatGPT är en chattassistent från OpenAI byggd ovanpå en stor språkmodell (GPT), som kan föra konversationer, svara på frågor, skriva text och kod, och resonera kring en mängd ämnen utifrån vad du skriver i chatten. Det var ett av de första AI-verktygen som gjorde generativ AI tillgänglig för allmänheten, i ett enkelt chattgränssnitt, när det lanserades i slutet av 2022.',
        },
        {
          q: 'Hur fungerar Generativ AI?',
          a: 'Generativa modeller tränas på enorma mängder data och lär sig sannolikheten för vad som brukar komma härnäst, nästa ord i en mening, nästa pixel i en bild. När du sedan ger modellen en prompt genererar den nytt innehåll steg för steg baserat på de mönster den lärt sig, snarare än att kopiera eller slå upp ett färdigt svar.',
        },
        {
          q: 'Vad är skillnaden mellan AI och Generativ AI?',
          a: 'AI är det bredare paraplybegreppet för all mjukvara som simulerar intelligent beteende, inklusive sådant som klassificerar, förutsäger eller upptäcker mönster utan att skapa något nytt, som spamfilter eller rekommendationssystem. Generativ AI är en undergrupp av AI som specifikt handlar om att skapa nytt innehåll, text, bilder eller kod, snarare än att bara analysera det som redan finns.',
        },
        {
          q: 'Vilka är de bästa AI-verktygen?',
          a: 'Det beror helt på uppgiften: ChatGPT och Claude är starka på text, resonemang och kodning, Midjourney och liknande verktyg är starka på bilder, och GitHub Copilot är byggt specifikt för att skriva kod tillsammans med dig i editorn. De flesta som använder AI regelbundet landar i en kombination av några olika verktyg snarare än ett enda "bästa" verktyg för allt.',
        },
        {
          q: 'Hur använder företag Generativ AI?',
          a: 'Företag använder generativ AI för att snabba upp research och rapportskrivande, generera första utkast av marknadsföringstext och kod, sammanfatta möten och dokument, och bygga kundtjänstbotar som kan svara med naturligt språk istället för fasta menyer. Vanligast är att börja i liten skala med ett tydligt avgränsat användningsfall, med en människa som kollar resultatet, innan man skalar upp till mer autonoma flöden.',
        },
      ],
    },
    {
      title: 'LLM',
      items: [
        {
          q: 'Vad är en LLM?',
          a: 'En LLM (Large Language Model, stor språkmodell) är en AI-modell tränad på enorma mängder text för att förstå och generera mänskligt språk. GPT (som driver ChatGPT), Claude och Gemini är alla exempel på LLM:er.',
        },
        {
          q: 'Hur fungerar en LLM?',
          a: 'En LLM bygger på en transformer-arkitektur som lär sig statistiska mönster i språk genom att tränas på enorma textmängder, och förutsäger sedan det mest sannolika nästa ordet (eller "token") givet det som kommit innan, om och om igen tills ett helt svar byggts upp. Den "förstår" inte språk som en människa, utan har lärt sig extremt detaljerade mönster för hur ord och begrepp hänger ihop.',
        },
        {
          q: 'Vad står LLM för?',
          a: 'LLM står för Large Language Model, på svenska stor språkmodell, en AI-modell tränad på enorma mängder text för att kunna förstå och generera språk. "Large" syftar både på mängden träningsdata och på modellens storlek, ofta miljarder eller till och med biljoner interna parametrar.',
        },
        {
          q: 'Vad är skillnaden mellan en LLM och AI?',
          a: 'AI är det breda paraplybegreppet för all mjukvara som simulerar intelligent beteende, medan en LLM är en specifik typ av AI-modell specialiserad på att förstå och generera text. Alla LLM:er är alltså AI, men långt ifrån all AI är en LLM, till exempel är ett bildigenkänningssystem eller ett schackprogram också AI utan att vara en språkmodell.',
        },
        {
          q: 'Vad är skillnaden mellan LLM och Gen AI?',
          a: 'En LLM är en specifik typ av modell, tränad på text, medan generativ AI är det bredare begreppet för all AI som skapar nytt innehåll, oavsett om det är text, bilder, ljud eller video. En LLM är alltså alltid en form av generativ AI, men generativ AI omfattar även bild- och videomodeller som inte är LLM:er.',
        },
        {
          q: 'Vilka LLM-modeller finns?',
          a: 'Några av de mest kända LLM:erna idag är OpenAIs GPT-serie (som driver ChatGPT), Anthropics Claude, Googles Gemini, Metas Llama och Mistrals modeller. De skiljer sig åt i storlek, kostnad, hur öppna de är (vissa som Llama och Mistral kan laddas ner och köras själv), och vilka styrkor de har inom till exempel kodning, resonemang eller långa kontextfönster.',
        },
        {
          q: 'Vad är RAG?',
          a: 'RAG (Retrieval-Augmented Generation) är en teknik där en språkmodell först hämtar relevant information från en extern källa, som en databas eller dokumentsamling, innan den genererar sitt svar. Det gör att modellen kan svara med aktuell eller företagsspecifik information den aldrig tränats på, istället för att förlita sig enbart på det den memorerat under träningen, vilket också minskar risken för hallucinationer.',
        },
        {
          q: 'Vad är fine-tuning?',
          a: 'Fine-tuning innebär att man tar en redan färdigtränad språkmodell och tränar den vidare på en mindre, mer specifik datamängd för att anpassa dess beteende eller kunskap till ett särskilt användningsfall. Det används till exempel för att få en modell att svara i en viss ton, bli bättre på en nischad uppgift, eller följa ett företags specifika format, utan att behöva träna en helt ny modell från grunden.',
        },
        {
          q: 'Vad är prompt engineering?',
          a: 'Prompt engineering är konsten att formulera instruktioner till en AI-modell på ett sätt som ger mer exakta, användbara svar, genom att vara tydlig med mål, sammanhang, format och eventuella begränsningar. En bra prompt kan vara skillnaden mellan ett generiskt, halvbra svar och ett som direkt går att använda, särskilt för mer komplexa eller flerstegsuppgifter.',
        },
      ],
    },
    {
      title: 'AI-agenter',
      items: [
        {
          q: 'Vad är en AI-agent?',
          a: 'En AI-agent är ett AI-system som kan agera mer självständigt än en vanlig chattbot, den kan planera flera steg, använda verktyg (som att söka på webben, köra kod eller anropa ett API) och fatta beslut för att nå ett mål, ofta utan att en människa behöver godkänna varje enskilt steg. Till skillnad från en modell som bara svarar på en fråga i taget, kan en agent utföra en hel uppgift från början till slut.',
        },
        {
          q: 'Hur fungerar AI-agenter?',
          a: 'En AI-agent bygger vanligtvis på en LLM som "hjärna", som bryter ner ett mål i mindre delsteg, väljer vilka verktyg som behövs för varje steg, utför dem, och sedan utvärderar resultatet innan den går vidare eller justerar sin plan. Denna loop, planera, agera, observera, upprepa, fortsätter tills målet är uppnått eller agenten stöter på en gräns den inte kan lösa själv.',
        },
        {
          q: 'Vad är skillnaden mellan en chatbot och en AI-agent?',
          a: 'En chatbot svarar på ett meddelande i taget inom en konversation, den reagerar men agerar sällan självständigt utanför chatten. En AI-agent kan istället ta emot ett mål, planera flera steg själv, använda verktyg som att söka information eller köra kod, och driva en uppgift till slut med minimal mänsklig inblandning under tiden.',
        },
        {
          q: 'Vad kan en AI-agent göra?',
          a: 'En AI-agent kan till exempel researcha ett ämne över flera källor, skriva och testa kod, boka möten genom att interagera med en kalender, fylla i formulär, övervaka system och larma vid avvikelser, eller hantera flerstegs kundserviceärenden. Gränsen sätts oftast av vilka verktyg och vilken åtkomst agenten fått, snarare än av modellen i sig.',
        },
        {
          q: 'Hur bygger man en AI-agent?',
          a: 'I grunden behöver du en LLM, en tydlig definition av vilka verktyg agenten får använda (sök, kodkörning, API-anrop och så vidare), och en loop som låter modellen planera, agera och utvärdera resultatet innan den går vidare. De flesta bygger idag med ramverk eller SDK:er avsedda för det, som gör verktygsanrop och minne enklare, istället för att skriva hela loopen från grunden.',
        },
        {
          q: 'Vad kostar en AI-agent?',
          a: 'Kostnaden beror på hur många AI-anrop agenten gör, hur lång kontext den skickar varje gång, och vilken modell som används, en agent som kör flera steg och verktygsanrop per uppgift kan snabbt kosta betydligt mer än ett enkelt chattmeddelande. Utöver själva modellkostnaden tillkommer ofta utvecklingstid och eventuella verktyg eller tjänster agenten behöver integrera med.',
        },
        {
          q: 'Är AI-agenter säkra?',
          a: 'AI-agenter för med sig andra risker än en vanlig chattbot, eftersom de faktiskt kan utföra handlingar, som att skicka mejl, ändra filer eller göra köp, inte bara ge förslag. Det gör det viktigt att begränsa vilka verktyg och vilken åtkomst en agent har, kräva mänskligt godkännande för handlingar med verkliga konsekvenser, och testa agenten noga innan den får agera utan tillsyn.',
        },
      ],
    },
    {
      title: 'Jämförelser',
      items: [
        {
          q: 'Vad är skillnaden mellan LLM och AI-agent?',
          a: 'En LLM är själva språkmodellen, den genererar text baserat på en prompt men agerar inte på egen hand. En AI-agent använder en eller flera LLM:er som "hjärna" men bygger ovanpå med förmågan att planera flera steg, använda verktyg och driva en uppgift mot ett mål utan att en människa behöver styra varje steg.',
        },
        {
          q: 'Vad är skillnaden mellan ChatGPT och Copilot?',
          a: 'ChatGPT är en generell chattassistent för i princip vilket ämne som helst, medan GitHub Copilot är specialbyggt för kodning och lever direkt i din editor, där det föreslår kod rad för rad eller funktion för funktion utifrån sammanhanget i din fil. Båda bygger på liknande underliggande teknik, men Copilot är optimerat specifikt för utvecklarens arbetsflöde.',
        },
        {
          q: 'ChatGPT eller Gemini?',
          a: 'Båda är starka generella AI-assistenter, ChatGPT har ofta ett övertag i renodlad textkvalitet och ett stort ekosystem av tillägg, medan Gemini är djupt integrerat i Googles egna produkter som Sök, Gmail och Docs, vilket kan vara ett stort plus om du redan lever i Googles värld. Valet handlar oftast mer om vilket ekosystem du redan använder än om en tydlig kvalitetsskillnad.',
        },
        {
          q: 'Claude eller ChatGPT?',
          a: 'Claude, från Anthropic, brukar lyftas fram för längre, mer nyanserade svar och stark kodningsförmåga, medan ChatGPT har det bredaste ekosystemet av tillägg, röstläge och integrationer. Många som jobbar mycket med kod eller längre dokument föredrar Claude, medan ChatGPT ofta är förstahandsvalet för ett brett spektrum av vardagsuppgifter.',
        },
        {
          q: 'AI-agent eller chatbot?',
          a: 'En chatbot räcker gott för raka frågor och svar, som kundsupport eller att slå upp information, där du själv styr varje steg i konversationen. En AI-agent är rätt val när uppgiften kräver flera steg, verktygsanvändning eller att något faktiskt utförs åt dig, som att researcha, boka eller skriva och testa kod, snarare än att bara svara.',
        },
        {
          q: 'LLM eller maskininlärning?',
          a: 'Det här är egentligen inte ett val mellan två alternativ, en LLM är en specifik typ av maskininlärningsmodell, specialiserad på språk. Klassisk maskininlärning omfattar en mycket bredare verktygslåda, som ofta passar bättre för strukturerad data och tydligt avgränsade förutsägelser, till exempel att förutsäga kundbortfall eller upptäcka bedrägeri, där en LLM vore onödigt tungt och dyrt.',
        },
        {
          q: 'AI eller automation?',
          a: 'Traditionell automation (som RPA) följer fasta, förprogrammerade regler och passar bäst för repetitiva uppgifter med tydliga, förutsägbara steg. AI passar bättre när uppgiften kräver att tolka ostrukturerad information, som text eller bilder, eller fatta beslut som inte går att fånga i enkla om-då-regler, och många moderna lösningar kombinerar faktiskt båda.',
        },
      ],
    },
    {
      title: 'Teknik bakom AI',
      items: [
        {
          q: 'Vad är maskininlärning?',
          a: 'Maskininlärning är en gren av AI där system lär sig mönster från data istället för att programmeras med explicita regler för varje scenario. Modellen tränas genom att se många exempel och gradvis justera sina interna parametrar för att minimera sina fel, och kan sedan göra förutsägelser på ny data den aldrig sett förut.',
        },
        {
          q: 'Vad är deep learning?',
          a: 'Deep learning (djupinlärning) är en typ av maskininlärning som använder neurala nätverk med många lager, "djupa" nätverk, för att lära sig alltmer abstrakta representationer av data. Det är tekniken bakom de flesta moderna genombrotten inom AI, från bildigenkänning till stora språkmodeller, eftersom fler lager gör att nätverket kan fånga betydligt mer komplexa mönster än enklare maskininlärningsmodeller.',
        },
        {
          q: 'Vad är neurala nätverk?',
          a: 'Ett neuralt nätverk är en AI-modell löst inspirerad av hur hjärnans neuroner är kopplade, uppbyggt av lager av "noder" som var och en gör en enkel beräkning och skickar resultatet vidare till nästa lager. Genom att justera styrkan på kopplingarna mellan noderna under träning lär sig nätverket att känna igen mönster i indata, och stapla man tillräckligt många lager får man det som kallas deep learning.',
        },
        {
          q: 'Vad är embeddings?',
          a: 'Embeddings är ett sätt att representera ord, meningar, bilder eller annan data som listor av tal (vektorer) på ett sätt som fångar deras betydelse, sådant som liknar varandra i innebörd hamnar nära varandra i det matematiska rummet. De används bland annat för sökning, rekommendationer och RAG, där man snabbt behöver hitta innehåll som liknar en fråga rent semantiskt, inte bara ord för ord.',
        },
        {
          q: 'Vad är en transformer-modell?',
          a: 'Transformer är den neurala nätverksarkitektur som moderna LLM:er bygger på, introducerad 2017. Dess nyckelinnovation är "attention", en mekanism som låter modellen väga hur relevant varje ord i indatan är för varje annat ord, oavsett avstånd i texten, vilket gör den mycket bättre på att fånga sammanhang i långa texter än tidigare arkitekturer.',
        },
        {
          q: 'Vad är token i AI?',
          a: 'En token är den minsta textbit en språkmodell bearbetar, ofta ett ord, en del av ett ord, eller ett skiljetecken, beroende på hur texten delas upp. Modeller läser och genererar text token för token, och kostnaden för att använda de flesta AI-API:er beräknas också per token, både för det du skickar in och det modellen svarar med.',
        },
        {
          q: 'Vad är multimodal AI?',
          a: 'Multimodal AI är en modell som kan förstå och/eller generera fler än en typ av data, till exempel text, bilder, ljud och video, i samma system snarare än att kräva en separat modell för varje typ. Det gör att du till exempel kan visa en modell en bild och ställa en fråga om den i text, eller be den generera en bild utifrån en textbeskrivning, allt inom samma konversation.',
        },
      ],
    },
    {
      title: 'Praktiska frågor om AI',
      items: [
        {
          q: 'Hur skriver man bra prompts?',
          a: 'Var specifik om målet, sammanhanget, önskat format och eventuella begränsningar, istället för att ställa en vag fråga och hoppas på det bästa. Det hjälper också att ge modellen exempel på hur ett bra svar ser ut, be den resonera steg för steg för svårare uppgifter, och iterera, en uppföljande fråga som förfinar svaret är ofta snabbare än att försöka få allt rätt i den första prompten.',
        },
        {
          q: 'Hur använder man ChatGPT effektivt?',
          a: 'Ge tydlig kontext om vem svaret är till, i vilket syfte och i vilken ton, be om ett första utkast snarare än ett färdigt svar och förfina i flera omgångar, och använd funktioner som anpassade instruktioner eller uppladdade filer när du behöver att den kommer ihåg sammanhang eller jobbar med specifikt material. Det är också värt att alltid dubbelkolla fakta, siffror och citat den ger dig, snarare än att lita blint på ett självsäkert svar.',
        },
        {
          q: 'Kan AI skriva kod?',
          a: 'Ja, moderna AI-modeller kan skriva, förklara, felsöka och refaktorera kod i de flesta populära programmeringsspråk, och verktyg som GitHub Copilot eller Claude Code integrerar den förmågan direkt i editorn. AI-skriven kod behöver fortfarande granskas av en människa, den kan se korrekt ut men innehålla subtila fel, säkerhetsproblem eller föråldrade mönster.',
        },
        {
          q: 'Kan AI analysera dokument?',
          a: 'Ja, moderna AI-modeller kan läsa och sammanfatta långa dokument, dra ut specifika uppgifter, jämföra flera dokument mot varandra, eller svara på frågor om innehållet, ofta genom att du laddar upp filen direkt i chatten. För stora dokumentsamlingar eller företagsspecifikt material används ofta RAG för att modellen ska kunna hämta rätt avsnitt istället för att behöva hela mängden data i varje fråga.',
        },
        {
          q: 'Kan AI sammanfatta möten?',
          a: 'Ja, AI-verktyg kan transkribera ett möte i realtid eller från en inspelning och generera en sammanfattning med huvudpunkter, beslut och åtgärdspunkter, ofta kopplat direkt till videomötesverktyg som Zoom eller Teams. Det är värt att snabbt skumma igenom sammanfattningen mot vad som faktiskt sades, särskilt för nyanserade diskussioner eller om flera personer pratade i munnen på varandra.',
        },
        {
          q: 'Kan AI skapa bilder?',
          a: 'Ja, verktyg som Midjourney, DALL-E och Stable Diffusion kan generera bilder helt utifrån en textbeskrivning, i stilar som spänner från fotorealism till illustration och konceptkonst. Ju mer specifik prompten är om motiv, stil, komposition och belysning, desto närmare blir resultatet det du faktiskt hade i tanken.',
        },
        {
          q: 'Kan AI ersätta människor?',
          a: 'AI kan ta över specifika uppgifter, särskilt repetitiva eller mönsterbaserade sådana, men det ersätter sällan en hel roll rakt av, eftersom de flesta jobb kräver omdöme, ansvarstagande eller mänsklig kontakt som AI ännu inte klarar tillförlitligt. Den mer sannolika utvecklingen är att AI förändrar vilka uppgifter en roll faktiskt innebär, snarare än att helt eliminera rollen, även om vissa mycket rutinbaserade arbetsuppgifter kommer automatiseras bort helt.',
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
        {
          q: 'Hur inför man AI i verksamheten?',
          a: 'Börja med ett litet, tydligt avgränsat användningsfall där du kan mäta effekten, snarare än att försöka rulla ut AI överallt på en gång. Involvera de som faktiskt ska använda verktyget i utvärderingen, ha tydliga riktlinjer för vilken data som får delas med AI-tjänster, och skala upp stegvis i takt med att ni ser vad som faktiskt fungerar i er verksamhet.',
        },
        {
          q: 'Hur mäter man ROI på AI?',
          a: 'Utgå från konkreta mått som är relevanta för användningsfallet, tid sparad per uppgift, minskad felfrekvens, snabbare svarstider till kund, eller ökad output per anställd, och jämför mot kostnaden för verktyget, implementationen och eventuell utbildning. ROI på AI är ofta svårare att mäta än för traditionell mjukvara eftersom vinsterna kan vara diffusa (som "bättre beslut"), så det lönar sig att definiera måtten innan du börjar, inte i efterhand.',
        },
        {
          q: 'Hur påverkar AI olika branscher?',
          a: 'Effekten varierar stort: inom mjukvaruutveckling och kundservice används AI redan brett för att automatisera rutinuppgifter, inom hälso- och sjukvård för bilddiagnostik och administrativt stöd, inom juridik och finans för dokumentgranskning och analys, och inom media och marknadsföring för innehållsproduktion. Generellt påverkas branscher mest där arbetet redan är data- och textintensivt, medan fysiskt eller starkt reglerat arbete förändras långsammare.',
        },
        {
          q: 'Hur skapar man en AI-strategi?',
          a: 'En AI-strategi bör utgå från era faktiska affärsmål snarare än tekniken i sig, identifiera var AI kan lösa ett verkligt problem, prioritera efter effekt och genomförbarhet, och inkludera riktlinjer för dataskydd, ansvarsfördelning och vem som äger besluten AI:n hjälper till med. Det är också värt att bygga in kontinuerlig utvärdering från start, eftersom både verktygen och vad som är möjligt förändras snabbt.',
        },
        {
          q: 'Hur använder företag AI?',
          a: 'Företag använder AI för allt från att automatisera rutinuppgifter och analysera stora datamängder till att driva kundtjänst, upptäcka bedrägerier och stödja beslut inom allt från lagerhantering till rekrytering, inte bara genom generativa chattverktyg utan även genom mer traditionell maskininlärning i bakgrunden. De flesta stora företag använder redan en blandning av bägge, generativ AI för text- och innehållsnära uppgifter, och klassisk maskininlärning för mer strukturerade, datatunga processer.',
        },
        {
          q: 'Vad kostar det att införa AI?',
          a: 'Kostnaden varierar enormt beroende på ambition: att använda färdiga AI-verktyg (som ChatGPT Enterprise eller Copilot) kostar oftast en licensavgift per användare och månad, medan att bygga egna AI-lösningar med API:er tillkommer kostnad per anrop plus utvecklingstid, och att träna eller finjustera egna modeller kräver betydligt större investeringar i data, beräkningskraft och kompetens. De flesta företag börjar med färdiga verktyg eller API-baserade lösningar snarare än att bygga och träna egna modeller från grunden, eftersom det ger mycket av nyttan till en bråkdel av kostnaden.',
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
        {
          q: 'Vad är skillnaden mellan prompt engineering och autocomplete?',
          a: 'Autocomplete förutsäger nästa ord eller rad utifrån det du redan skrivit, det är reaktivt och kräver nästan ingen input från dig, som en AI-kodassistent som färdigställer en funktion du redan börjat på. Prompt engineering är att du proaktivt skriver en tydlig, detaljerad instruktion i förväg, som beskriver målet, begränsningarna och sammanhanget, för att få ett komplett, specifikt resultat direkt, en hel funktion, klass eller förklaring genereras utifrån en beskrivning istället för några tangenttryckningar. I praktiken kompletterar de varandra: en bra prompt tar dig längre än en bra promptskrivare, autocomplete håller farten uppe mitt i en uppgift, och de flesta AI-kodarbetsflöden använder båda.',
        },
        {
          q: 'Hur påverkar AI framtidens arbete?',
          a: 'AI kommer sannolikt att förändra vilka uppgifter de flesta jobb innehåller snarare än att utplåna hela yrken, rutinmässiga och mönsterbaserade delar av ett jobb automatiseras först, medan uppgifter som kräver omdöme, kreativitet eller mänsklig kontakt blir kvar längre. Precis som tidigare teknologiska skiften kommer det sannolikt skapa nya roller som inte finns idag, samtidigt som det kräver att många arbetstagare löpande lär om och lär sig arbeta tillsammans med AI-verktyg för att förbli konkurrenskraftiga.',
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
        {
          q: 'Kan AI vara partisk?',
          a: 'Ja. AI-modeller lär sig från stora mängder befintlig text och data, och de kan plocka upp och upprepa fördomar som finns i den datan, oavsett om det handlar om kulturella, köns-, ras- eller politiska skevheter. Seriösa leverantörer arbetar för att minska detta genom att granska träningsdata och testa modellerna, men ingen modell är helt neutral, så det är värt att behandla AI-svar som vilken enskild källa som helst: dubbelkolla allt känsligt eller viktigt istället för att anta att det är objektivt.',
        },
        {
          q: 'Är ChatGPT GDPR-säkert?',
          a: 'Det beror på hur det används, OpenAI erbjuder avtal och inställningar (som att stänga av träning på din data eller använda företagsversioner med databehandlingsavtal) som kan göra användningen GDPR-förenlig, men standardversionen för privatpersoner är inte automatiskt anpassad för att hantera känsliga personuppgifter. Företag som vill använda ChatGPT med personuppgifter bör se över databehandlingsavtal, datalagringsinställningar och vilken data som faktiskt matas in, snarare än att anta att det är säkert som standard.',
        },
        {
          q: 'Är AI säker att använda?',
          a: 'AI är i grunden säkert att använda för de flesta vardagliga uppgifter, men riskerna ökar med hur känslig informationen du delar är och hur mycket du litar blint på svaren. De största riskerna är att dela känslig data med en tjänst vars policy du inte läst, och att agera på felaktig information (en hallucination) utan att verifiera den.',
        },
        {
          q: 'Hur skyddar man företagsdata i AI?',
          a: 'Använd företagsversioner eller API:er med databehandlingsavtal snarare än gratisversioner riktade mot privatpersoner, stäng av inställningar som låter leverantören träna på er data, och sätt tydliga riktlinjer för vilken typ av information anställda får mata in i AI-verktyg. För särskilt känslig data är självhostade eller privata modeller ibland ett krav, snarare än att förlita sig på en molntjänst.',
        },
        {
          q: 'Vem äger innehåll som AI skapar?',
          a: 'Det varierar mellan länder och är fortfarande under juridisk utveckling, men i de flesta AI-leverantörers användarvillkor (som OpenAI och Anthropic) överlåts rättigheterna till det genererade innehållet till användaren, inom ramarna för deras användarvillkor. Frågan om innehåll som helt saknar mänsklig medverkan faktiskt kan upphovsrättsskyddas alls är dock fortfarande oklar i flera jurisdiktioner, inklusive USA.',
        },
        {
          q: 'Vilka AI-regler gäller i EU?',
          a: 'EU:s AI-förordning (AI Act) är den centrala regleringen, den klassificerar AI-system efter risknivå och ställer strängast krav på "högrisk"-system, som de som används inom rekrytering, kreditbedömning eller brottsbekämpning, medan de flesta chattassistenter faller under lägre riskkategorier med mindre stränga krav. Utöver AI Act gäller förstås även GDPR fullt ut för all AI som behandlar personuppgifter, oavsett riskklassificering.',
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
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageMeta title={t.metaTitle} description={t.metaDescription} structuredData={structuredData} />

      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        {t.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.heading}</h1>
      <p className="mt-3 text-slate-400">
        {t.intro}{' '}
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="text-forge-500 hover:text-forge-100 hover:underline"
        >
          {t.introLink}
        </button>
        .
      </p>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      <FaqOutline titles={sections.map((section) => section.title)} language={language} />

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title} id={slugifyFaqTitle(section.title)} className="scroll-mt-24">
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
