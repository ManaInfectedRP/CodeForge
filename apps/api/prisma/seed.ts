import {
  PrismaClient,
  QuestionType,
  Prisma,
  type AchievementMetric,
  type ChallengeDifficulty,
  type ChallengeLanguage,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const paths = [
  {
    slug: 'cpp',
    name: 'C++',
    icon: '🟦',
    difficulty: 5,
    estimatedHours: 65,
    projectCount: 18,
    description: 'Master systems programming, memory management, and high-performance applications with C++.',
  },
  {
    slug: 'python',
    name: 'Python',
    icon: '🐍',
    difficulty: 2,
    estimatedHours: 55,
    projectCount: 20,
    description: 'The friendliest way into programming, scripting, automation, data, and AI with Python.',
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    difficulty: 3,
    estimatedHours: 70,
    projectCount: 25,
    description: 'The language of the web. Build interactive sites and apps that run everywhere.',
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    icon: '🔵',
    difficulty: 3,
    estimatedHours: 40,
    projectCount: 14,
    description: 'JavaScript with superpowers, static types, safer refactors, and scalable codebases.',
  },
  {
    slug: 'nodejs',
    name: 'Node.js',
    icon: '🟩',
    difficulty: 4,
    estimatedHours: 45,
    projectCount: 16,
    description: 'Server-side JavaScript, REST APIs, real-time apps, and backend engineering with Node.js.',
  },
];

type SeedQuestion = {
  type: QuestionType;
  prompt: string;
  options: string[];
  answer: string;
};

type SeedLesson = {
  title: string;
  content: string;
  videoUrl?: string;
  quiz?: { title: string; passingScore: number; questions: SeedQuestion[] };
};

function lessonContent(title: string, body: string): string {
  return `# ${title}\n\n${body}`;
}

const nodeLessons: SeedLesson[] = [
  {
    title: 'Introduction to Node.js',
    content: lessonContent(
      'Introduction to Node.js',
      `Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets you run JavaScript outside the browser, on servers, in CLIs, and in build tools.\n\n## Why Node.js?\n\n- **Non-blocking I/O**, handles thousands of concurrent connections efficiently.\n- **One language everywhere**, share code and skills between frontend and backend.\n- **npm**, the largest package ecosystem in the world.\n\n## Your first program\n\n\`\`\`js\n// hello.js\nconsole.log('Hello from Node.js!');\n\`\`\`\n\nRun it with:\n\n\`\`\`bash\nnode hello.js\n\`\`\``
    ),
    quiz: {
      title: 'Node.js Basics',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What engine does Node.js use to execute JavaScript?',
          options: ['SpiderMonkey', 'V8', 'JavaScriptCore', 'Chakra'],
          answer: 'V8',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Node.js can only run JavaScript inside a web browser.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command to run a file called app.js with Node is: ____ app.js',
          options: [],
          answer: 'node',
        },
      ],
    },
  },
  {
    title: 'Variables and Data Types',
    content: lessonContent(
      'Variables and Data Types',
      `JavaScript in Node.js supports \`let\`, \`const\`, and (legacy) \`var\`.\n\n\`\`\`js\nconst name = 'CodeForge';   // cannot be reassigned\nlet xp = 0;                 // can be reassigned\nxp += 10;\n\nconsole.log(name, 'has', xp, 'XP');\nconsole.log('typeof name:', typeof name);\n\`\`\`\n\n## Core types\n\n| Type | Example |\n|------|---------|\n| string | \`'hello'\` |\n| number | \`42\`, \`3.14\` |\n| boolean | \`true\` |\n| object | \`{ id: 1 }\` |\n| array | \`[1, 2, 3]\` |\n| null / undefined | absence of value |\n\nPrefer \`const\` by default; use \`let\` only when you need to reassign.`
    ),
    quiz: {
      title: 'Variables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which keyword declares a variable that cannot be reassigned?',
          options: ['var', 'let', 'const', 'static'],
          answer: 'const',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the output of: console.log(typeof [1, 2, 3])',
          options: ['array', 'object', 'list', 'undefined'],
          answer: 'object',
        },
      ],
    },
  },
  {
    title: 'Functions and Modules',
    content: lessonContent(
      'Functions and Modules',
      `## Functions\n\n\`\`\`js\nfunction add(a, b) {\n  return a + b;\n}\n\nconst multiply = (a, b) => a * b;\n\nconsole.log('add(2, 3) =', add(2, 3));\nconsole.log('multiply(4, 5) =', multiply(4, 5));\n\`\`\`\n\n## ES Modules\n\nSplit code across files with \`import\`/\`export\` (module files need a real Node.js project, so this example is read-only):\n\n\`\`\`\n// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// app.js\nimport { add } from './math.js';\nconsole.log(add(2, 3)); // 5\n\`\`\`\n\nSet \`"type": "module"\` in package.json to use ES modules natively.`
    ),
    quiz: {
      title: 'Functions & Modules Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'To bring a named export into another file you use the ____ keyword.',
          options: [],
          answer: 'import',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Arrow functions are declared with the => syntax.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Building an Express Server',
    content: lessonContent(
      'Building an Express Server',
      `Express is the most popular web framework for Node.js.\n\n\`\`\`\nimport express from 'express';\n\nconst app = express();\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.listen(4000, () => console.log('Listening on :4000'));\n\`\`\`\n\n*Server code runs in Node.js, not in the browser playground, you'll run this for real in the final project.*\n\n## Key concepts\n\n- **Routes** map an HTTP method + path to a handler.\n- **Middleware** functions run in order before your handler (parsing, auth, logging).\n- **req / res**, the request and response objects.`
    ),
    quiz: {
      title: 'Express Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which middleware parses incoming JSON request bodies?',
          options: ['express.static()', 'express.json()', 'express.router()', 'express.parse()'],
          answer: 'express.json()',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What HTTP method is typically used to create a new resource?',
          options: ['GET', 'POST', 'DELETE', 'HEAD'],
          answer: 'POST',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Middleware functions execute after the final route handler sends its response.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'REST APIs and Authentication',
    content: lessonContent(
      'REST APIs and Authentication',
      `## REST conventions\n\n| Method | Path | Meaning |\n|--------|------|---------|\n| GET | /api/courses | list courses |\n| GET | /api/courses/:id | one course |\n| POST | /api/courses | create |\n| PUT | /api/courses/:id | update |\n| DELETE | /api/courses/:id | delete |\n\n## JWT authentication\n\n1. User logs in with credentials.\n2. Server verifies and signs a **JSON Web Token**.\n3. Client sends it back on every request: \`Authorization: Bearer <token>\`.\n4. Middleware verifies the signature and attaches the user to the request.\n\nNever store plain-text passwords, hash them with bcrypt.`
    ),
    quiz: {
      title: 'REST & Auth Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'JWTs are sent in the Authorization header using the ____ scheme.',
          options: [],
          answer: 'Bearer',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which library is commonly used to hash passwords in Node.js?',
          options: ['md5', 'bcrypt', 'base64', 'crypto-random'],
          answer: 'bcrypt',
        },
      ],
    },
  },
  {
    title: 'Final Project: URL Shortener',
    content: lessonContent(
      'Final Project: URL Shortener',
      `Time to put it all together. Build a URL shortener API with:\n\n## Requirements\n\n1. \`POST /api/links\`, accepts a long URL, returns a short code.\n2. \`GET /:code\`, redirects to the original URL.\n3. \`GET /api/links/:code/stats\`, visit count and creation date.\n4. Persist links in PostgreSQL.\n5. Validate URLs and handle unknown codes with a 404.\n\n## Stretch goals\n\n- Rate limiting\n- Custom short codes\n- Expiring links\n\nSubmit your repository link when you are done. Good luck! 🚀`
    ),
  },
];

const pythonLessons: SeedLesson[] = [
  {
    title: 'Getting Started with Python',
    content: lessonContent(
      'Getting Started with Python',
      `Python is famous for its readable syntax and gentle learning curve.\n\n\`\`\`python\nprint("Hello, CodeForge!")\n\nname = "student"\nxp = 0\nxp += 10\nprint(f"{name} has {xp} XP")\n\`\`\`\n\nNo semicolons, no braces, indentation defines structure.`
    ),
    quiz: {
      title: 'Python Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How does Python define code blocks?',
          options: ['Curly braces', 'Indentation', 'Keywords begin/end', 'Parentheses'],
          answer: 'Indentation',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The built-in function to display output to the console is ____().',
          options: [],
          answer: 'print',
        },
      ],
    },
  },
  {
    title: 'Lists, Dicts, and Loops',
    content: lessonContent(
      'Lists, Dicts, and Loops',
      `\`\`\`python\nlanguages = ["python", "javascript", "cpp"]\nscores = {"python": 95, "javascript": 88}\n\nfor lang in languages:\n    print(lang.upper())\n\n# List comprehension\nlengths = [len(lang) for lang in languages]\nprint("lengths:", lengths)\nprint("python score:", scores["python"])\n\`\`\`\n\nLists are ordered and mutable; dicts map keys to values; comprehensions build lists in one expression.`
    ),
    quiz: {
      title: 'Collections Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does len(["a", "b", "c"]) return?',
          options: ['2', '3', '"abc"', 'an error'],
          answer: '3',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Python dictionaries map keys to values.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Functions and Error Handling',
    content: lessonContent(
      'Functions and Error Handling',
      `\`\`\`python\ndef divide(a: float, b: float) -> float:\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b\n\ntry:\n    print("10 / 2 =", divide(10, 2))\n    print("10 / 0 =", divide(10, 0))\nexcept ValueError as err:\n    print(f"Error: {err}")\n\`\`\`\n\nUse \`try/except\` to handle failures gracefully, and type hints to document intent.`
    ),
    quiz: {
      title: 'Functions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to define a function in Python is ____.',
          options: [],
          answer: 'def',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which block catches an exception raised inside try?',
          options: ['catch', 'rescue', 'except', 'finally'],
          answer: 'except',
        },
      ],
    },
  },
];

const jsLessons: SeedLesson[] = [
  {
    title: 'JavaScript in the Browser',
    content: lessonContent(
      'JavaScript in the Browser',
      `JavaScript brings web pages to life, reacting to clicks, fetching data, and updating the page.\n\n## Your first JavaScript\n\n\`\`\`js\nconst name = 'CodeForge';\nconsole.log('Hello, ' + name + '!');\n\nconst year = new Date().getFullYear();\nconsole.log('It is', year);\n\`\`\`\n\n## The DOM\n\nIn a real page, JavaScript reads and modifies the **DOM** (Document Object Model), the live tree of elements your code can change:\n\n\`\`\`\nconst button = document.querySelector('#greet');\nbutton.addEventListener('click', () => {\n  document.querySelector('#out').textContent = 'Hello!';\n});\n\`\`\`\n\n*DOM code needs a real web page, so that block is read-only here, every other example in this course is runnable. Try the first one!*`
    ),
    quiz: {
      title: 'DOM Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does DOM stand for?',
          options: ['Data Object Model', 'Document Object Model', 'Digital Ordinance Map', 'Document Order Method'],
          answer: 'Document Object Model',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To react to a click you call element.____("click", handler).',
          options: [],
          answer: 'addEventListener',
        },
      ],
    },
  },
  {
    title: 'Arrays and Higher-Order Functions',
    content: lessonContent(
      'Arrays and Higher-Order Functions',
      `\`\`\`js\nconst scores = [80, 92, 67, 100];\n\nconst passed = scores.filter(s => s >= 70);   // [80, 92, 100]\nconst doubled = scores.map(s => s * 2);\nconst total = scores.reduce((sum, s) => sum + s, 0);\n\nconsole.log('passed:', passed);\nconsole.log('doubled:', doubled);\nconsole.log('total:', total);\n\`\`\`\n\n\`map\`, \`filter\`, and \`reduce\` transform arrays without mutating them, the backbone of modern JavaScript.`
    ),
    quiz: {
      title: 'Array Methods Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which method returns a new array with only the elements that pass a test?',
          options: ['map', 'filter', 'reduce', 'forEach'],
          answer: 'filter',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Array.prototype.map mutates the original array.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Promises and fetch',
    content: lessonContent(
      'Promises and fetch',
      `A **Promise** represents a value that will exist later. \`async/await\` lets you write asynchronous code that reads like synchronous code.\n\n\`\`\`js\nfunction loadCourse(id) {\n  // simulate a slow network request\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id, title: 'Modern JavaScript' }), 500);\n  });\n}\n\nconsole.log('loading…');\nconst course = await loadCourse(42);\nconsole.log('loaded:', course.title);\n\`\`\`\n\nWith a real API you'd use \`fetch\` exactly the same way:\n\n\`\`\`\nconst res = await fetch('/api/courses');\nif (!res.ok) throw new Error('Request failed');\nconst courses = await res.json();\n\`\`\``
    ),
    quiz: {
      title: 'Async Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'Inside an async function you pause for a Promise with the ____ keyword.',
          options: [],
          answer: 'await',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does fetch() return?',
          options: ['A string', 'A Promise', 'A JSON object directly', 'An XMLHttpRequest'],
          answer: 'A Promise',
        },
      ],
    },
  },
];

const tsLessons: SeedLesson[] = [
  {
    title: 'Why TypeScript?',
    content: lessonContent(
      'Why TypeScript?',
      `TypeScript adds static types on top of JavaScript. The compiler catches whole categories of bugs before your code ever runs.\n\n\`\`\`ts\nfunction greet(name: string): string {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet('CodeForge'));\n\n// greet(42) ❌ the compiler rejects this before the code ever runs:\n// "Argument of type 'number' is not assignable to parameter of type 'string'"\n\`\`\`\n\nEvery valid JavaScript program is already valid TypeScript, you can adopt it gradually.\n\n*Note: the playground runs TypeScript by stripping the types, full type checking happens in your editor and compiler.*`
    ),
    quiz: {
      title: 'TypeScript Intro Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'TRUE_FALSE',
          prompt: 'TypeScript types are checked at compile time, not at runtime.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'TypeScript files typically use the file extension .____',
          options: [],
          answer: 'ts',
        },
      ],
    },
  },
  {
    title: 'Interfaces and Types',
    content: lessonContent(
      'Interfaces and Types',
      `\`\`\`ts\ninterface Course {\n  id: string;\n  title: string;\n  lessons: number;\n  published?: boolean; // optional\n}\n\ntype Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'; // union type\n\nfunction describe(course: Course, role: Role): string {\n  return \`\${role} viewing "\${course.title}" (\${course.lessons} lessons)\`;\n}\n\nconsole.log(describe({ id: 'c1', title: 'TypeScript from JavaScript', lessons: 12 }, 'STUDENT'));\n\`\`\`\n\nInterfaces describe object shapes; union types restrict a value to a fixed set of options.`
    ),
    quiz: {
      title: 'Types Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does the ? in `published?: boolean` mean?",
          options: ['The property is nullable', 'The property is optional', 'The property is readonly', 'The property is private'],
          answer: 'The property is optional',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Which symbol combines types into a union?",
          options: ['&', '|', '+', '::'],
          answer: '|',
        },
      ],
    },
  },
];

const cppLessons: SeedLesson[] = [
  {
    title: 'Hello, C++',
    content: lessonContent(
      'Hello, C++',
      `C++ is a compiled, statically-typed language used for games, engines, embedded systems, and high-performance software.\n\n\`\`\`cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, CodeForge!" << std::endl;\n    return 0;\n}\n\`\`\`\n\nCompile and run:\n\n\`\`\`bash\ng++ hello.cpp -o hello\n./hello\n\`\`\``
    ),
    quiz: {
      title: 'C++ Intro Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which function is the entry point of every C++ program?',
          options: ['start()', 'main()', 'init()', 'run()'],
          answer: 'main()',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'C++ source code must be compiled before it can run.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Variables and Memory',
    content: lessonContent(
      'Variables and Memory',
      `\`\`\`cpp\nint xp = 100;          // stack variable\nint* ptr = &xp;        // pointer to xp\nint& ref = xp;         // reference to xp\n\nstd::cout << *ptr;     // dereference: prints 100\n\`\`\`\n\nC++ gives you direct control over memory. Pointers hold addresses; references are aliases. With great power comes great responsibility, dangling pointers and leaks are on you.`
    ),
    quiz: {
      title: 'Memory Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'The operator used to get the address of a variable is ____.',
          options: [],
          answer: '&',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does dereferencing a pointer (*ptr) give you?',
          options: ['The address it stores', 'The value at the address it stores', 'A copy of the pointer', 'A compile error'],
          answer: 'The value at the address it stores',
        },
      ],
    },
  },
];

const coursesByPath: Record<string, { title: string; description: string; lessons: SeedLesson[] }> = {
  nodejs: {
    title: 'Node.js Backend Fundamentals',
    description: 'From your first console.log to a deployed REST API with authentication, the complete Node.js foundation.',
    lessons: nodeLessons,
  },
  python: {
    title: 'Python for Absolute Beginners',
    description: 'Learn programming from zero with the most beginner-friendly language in the world.',
    lessons: pythonLessons,
  },
  javascript: {
    title: 'Modern JavaScript Essentials',
    description: 'DOM manipulation, array methods, and async programming, everything the modern web is built on.',
    lessons: jsLessons,
  },
  typescript: {
    title: 'TypeScript from JavaScript',
    description: 'Level up your JavaScript with static types, interfaces, and compiler-driven confidence.',
    lessons: tsLessons,
  },
  cpp: {
    title: 'C++ Foundations',
    description: 'Compiled programming, pointers, and memory, the bedrock of systems development.',
    lessons: cppLessons,
  },
};

type SeedTestCase = { input: unknown[]; expectedOutput: unknown; isHidden: boolean };

type SeedChallenge = {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<'python' | 'javascript' | 'typescript', string>>;
  testCases: SeedTestCase[];
};

const ALL_LANGS: ChallengeLanguage[] = ['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT'];

const challenges: SeedChallenge[] = [
  {
    slug: 'sum-two-numbers',
    title: 'Sum Two Numbers',
    difficulty: 'EASY',
    languages: ALL_LANGS,
    prompt: 'Write `solve(a, b)` that returns the sum of two numbers.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(a, b):\n    pass\n',
      javascript: 'function solve(a, b) {\n  \n}\n',
      typescript: 'function solve(a: number, b: number): number {\n  \n}\n',
    },
    testCases: [
      { input: [2, 3], expectedOutput: 5, isHidden: false },
      { input: [-1, 1], expectedOutput: 0, isHidden: false },
      { input: [100, 250], expectedOutput: 350, isHidden: true },
    ],
  },
  {
    slug: 'reverse-a-string',
    title: 'Reverse a String',
    difficulty: 'EASY',
    languages: ALL_LANGS,
    prompt: 'Write `solve(s)` that returns the string `s` reversed.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(s):\n    pass\n',
      javascript: 'function solve(s) {\n  \n}\n',
      typescript: 'function solve(s: string): string {\n  \n}\n',
    },
    testCases: [
      { input: ['hello'], expectedOutput: 'olleh', isHidden: false },
      { input: ['a'], expectedOutput: 'a', isHidden: false },
      { input: ['CodeForge'], expectedOutput: 'egroFedoC', isHidden: true },
    ],
  },
  {
    slug: 'count-vowels',
    title: 'Count Vowels',
    difficulty: 'EASY',
    languages: ALL_LANGS,
    prompt: 'Write `solve(s)` that returns the number of vowels (a, e, i, o, u, case-insensitive) in `s`.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(s):\n    pass\n',
      javascript: 'function solve(s) {\n  \n}\n',
      typescript: 'function solve(s: string): number {\n  \n}\n',
    },
    testCases: [
      { input: ['hello'], expectedOutput: 2, isHidden: false },
      { input: ['sky'], expectedOutput: 0, isHidden: false },
      { input: ['Programming'], expectedOutput: 3, isHidden: true },
    ],
  },
  {
    slug: 'find-the-maximum',
    title: 'Find the Maximum',
    difficulty: 'EASY',
    languages: ALL_LANGS,
    prompt: 'Write `solve(nums)` that returns the largest number in the list `nums`.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(nums):\n    pass\n',
      javascript: 'function solve(nums) {\n  \n}\n',
      typescript: 'function solve(nums: number[]): number {\n  \n}\n',
    },
    testCases: [
      { input: [[1, 5, 3]], expectedOutput: 5, isHidden: false },
      { input: [[-2, -5, -1]], expectedOutput: -1, isHidden: false },
      { input: [[42]], expectedOutput: 42, isHidden: true },
    ],
  },
  {
    slug: 'fizzbuzz-list',
    title: 'FizzBuzz List',
    difficulty: 'MEDIUM',
    languages: ALL_LANGS,
    prompt:
      'Write `solve(n)` that returns a list of strings for the numbers 1 to `n` (inclusive): "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the number as a string.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(n):\n    pass\n',
      javascript: 'function solve(n) {\n  \n}\n',
      typescript: 'function solve(n: number): string[] {\n  \n}\n',
    },
    testCases: [
      { input: [5], expectedOutput: ['1', '2', 'Fizz', '4', 'Buzz'], isHidden: false },
      { input: [3], expectedOutput: ['1', '2', 'Fizz'], isHidden: false },
      {
        input: [15],
        expectedOutput: [
          '1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz',
        ],
        isHidden: true,
      },
    ],
  },
  {
    slug: 'is-palindrome',
    title: 'Is Palindrome',
    difficulty: 'MEDIUM',
    languages: ALL_LANGS,
    prompt: 'Write `solve(s)` that returns `true` if `s` reads the same forwards and backwards, `false` otherwise.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(s):\n    pass\n',
      javascript: 'function solve(s) {\n  \n}\n',
      typescript: 'function solve(s: string): boolean {\n  \n}\n',
    },
    testCases: [
      { input: ['level'], expectedOutput: true, isHidden: false },
      { input: ['hello'], expectedOutput: false, isHidden: false },
      { input: ['A'], expectedOutput: true, isHidden: true },
    ],
  },
  {
    slug: 'two-sum-indices',
    title: 'Two Sum Indices',
    difficulty: 'MEDIUM',
    languages: ALL_LANGS,
    prompt:
      'Write `solve(nums, target)` that returns the indices `[i, j]` (i < j) of the two numbers in `nums` that add up to `target`. Assume exactly one solution exists.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(nums, target):\n    pass\n',
      javascript: 'function solve(nums, target) {\n  \n}\n',
      typescript: 'function solve(nums: number[], target: number): number[] {\n  \n}\n',
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], isHidden: false },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2], isHidden: false },
      { input: [[1, 5, 3, 7], 10], expectedOutput: [2, 3], isHidden: true },
    ],
  },
  {
    slug: 'fibonacci-number',
    title: 'Fibonacci Number',
    difficulty: 'MEDIUM',
    languages: ALL_LANGS,
    prompt: 'Write `solve(n)` that returns the `n`th Fibonacci number (0-indexed: fib(0) = 0, fib(1) = 1).',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(n):\n    pass\n',
      javascript: 'function solve(n) {\n  \n}\n',
      typescript: 'function solve(n: number): number {\n  \n}\n',
    },
    testCases: [
      { input: [0], expectedOutput: 0, isHidden: false },
      { input: [1], expectedOutput: 1, isHidden: false },
      { input: [10], expectedOutput: 55, isHidden: true },
    ],
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'HARD',
    languages: ALL_LANGS,
    prompt: 'Write `solve(s1, s2)` that returns `true` if `s2` is an anagram of `s1` (same letters, same counts), `false` otherwise.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(s1, s2):\n    pass\n',
      javascript: 'function solve(s1, s2) {\n  \n}\n',
      typescript: 'function solve(s1: string, s2: string): boolean {\n  \n}\n',
    },
    testCases: [
      { input: ['listen', 'silent'], expectedOutput: true, isHidden: false },
      { input: ['rat', 'car'], expectedOutput: false, isHidden: false },
      { input: ['anagram', 'nagaram'], expectedOutput: true, isHidden: true },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'HARD',
    languages: ALL_LANGS,
    prompt: 'Write `solve(nums, target)` that returns the index of `target` in the sorted list `nums`, or `-1` if it is not present.',
    entryPoint: 'solve',
    starterCode: {
      python: 'def solve(nums, target):\n    pass\n',
      javascript: 'function solve(nums, target) {\n  \n}\n',
      typescript: 'function solve(nums: number[], target: number): number {\n  \n}\n',
    },
    testCases: [
      { input: [[1, 3, 5, 7, 9], 5], expectedOutput: 2, isHidden: false },
      { input: [[1, 3, 5, 7, 9], 4], expectedOutput: -1, isHidden: false },
      { input: [[2, 4, 6, 8, 10, 12], 12], expectedOutput: 5, isHidden: true },
    ],
  },
];

const achievements: {
  key: string;
  name: string;
  description: string;
  icon: string;
  metric: AchievementMetric;
  threshold: number;
}[] = [
  { key: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson.', icon: '📘', metric: 'LESSONS_COMPLETED', threshold: 1 },
  { key: 'lessons_10', name: 'Halfway Hero', description: 'Complete 10 lessons.', icon: '📚', metric: 'LESSONS_COMPLETED', threshold: 10 },
  { key: 'first_quiz', name: 'Quiz Whiz', description: 'Pass your first quiz.', icon: '📝', metric: 'QUIZZES_PASSED', threshold: 1 },
  { key: 'quizzes_10', name: 'Quiz Master', description: 'Pass 10 quizzes.', icon: '🧠', metric: 'QUIZZES_PASSED', threshold: 10 },
  { key: 'first_challenge', name: 'Code Warrior', description: 'Solve your first coding challenge.', icon: '💻', metric: 'CHALLENGES_SOLVED', threshold: 1 },
  { key: 'challenges_5', name: 'Challenge Crusher', description: 'Solve 5 coding challenges.', icon: '🏆', metric: 'CHALLENGES_SOLVED', threshold: 5 },
  { key: 'challenges_10', name: 'Challenge Champion', description: 'Solve 10 coding challenges.', icon: '👑', metric: 'CHALLENGES_SOLVED', threshold: 10 },
  { key: 'xp_100', name: 'XP Rookie', description: 'Earn 100 XP.', icon: '⚡', metric: 'XP', threshold: 100 },
  { key: 'xp_500', name: 'XP Grinder', description: 'Earn 500 XP.', icon: '⚡', metric: 'XP', threshold: 500 },
  { key: 'xp_1000', name: 'XP Legend', description: 'Earn 1000 XP.', icon: '🌟', metric: 'XP', threshold: 1000 },
  { key: 'streak_3', name: 'On Fire', description: 'Reach a 3-day streak.', icon: '🔥', metric: 'STREAK', threshold: 3 },
  { key: 'streak_7', name: 'Unstoppable', description: 'Reach a 7-day streak.', icon: '🔥', metric: 'STREAK', threshold: 7 },
];

async function seedChallenges() {
  for (const [i, c] of challenges.entries()) {
    const existing = await prisma.challenge.findUnique({ where: { slug: c.slug } });
    if (existing) {
      await prisma.challenge.update({
        where: { slug: c.slug },
        data: {
          title: c.title,
          difficulty: c.difficulty,
          languages: c.languages,
          prompt: c.prompt,
          order: i,
          status: 'PUBLISHED',
          instructorId: null,
        },
      });
      continue;
    }
    await prisma.challenge.create({
      data: {
        slug: c.slug,
        title: c.title,
        difficulty: c.difficulty,
        languages: c.languages,
        prompt: c.prompt,
        entryPoint: c.entryPoint,
        starterCode: c.starterCode,
        order: i,
        status: 'PUBLISHED',
        instructorId: null,
        testCases: {
          create: c.testCases.map((tc, ti) => ({
            input: tc.input as Prisma.InputJsonValue,
            expectedOutput: tc.expectedOutput as Prisma.InputJsonValue,
            isHidden: tc.isHidden,
            order: ti,
          })),
        },
      },
    });
  }
  console.log(`  ✓ ${challenges.length} coding challenges`);
}

async function seedAchievements() {
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { key: a.key }, update: a, create: a });
  }
  console.log(`  ✓ ${achievements.length} achievements`);
}

async function main() {
  console.log('Seeding CodeForge Academy...');

  const [instructorPass, adminPass, studentPass] = await Promise.all([
    bcrypt.hash('instructor123', 10),
    bcrypt.hash('admin123', 10),
    bcrypt.hash('student123', 10),
  ]);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@codeforge.dev' },
    update: { emailVerified: true },
    create: {
      username: 'ada_instructor',
      email: 'instructor@codeforge.dev',
      passwordHash: instructorPass,
      role: 'INSTRUCTOR',
      bio: 'Senior engineer teaching backend development.',
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@codeforge.dev' },
    update: { emailVerified: true },
    create: {
      username: 'admin',
      email: 'admin@codeforge.dev',
      passwordHash: adminPass,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@codeforge.dev' },
    update: { emailVerified: true },
    create: {
      username: 'demo_student',
      email: 'student@codeforge.dev',
      passwordHash: studentPass,
      role: 'STUDENT',
      emailVerified: true,
    },
  });

  for (const p of paths) {
    const path = await prisma.learningPath.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });

    const courseSeed = coursesByPath[p.slug];
    const existing = await prisma.course.findFirst({ where: { pathId: path.id, title: courseSeed.title } });
    if (existing) {
      // refresh lesson text in place so content updates reach existing installs
      // without touching quizzes, enrollments, or student progress
      const current = await prisma.lesson.findMany({ where: { courseId: existing.id } });
      const byOrder = new Map(current.map((l) => [l.order, l]));
      for (const [i, lesson] of courseSeed.lessons.entries()) {
        const match = byOrder.get(i + 1);
        if (match) {
          await prisma.lesson.update({
            where: { id: match.id },
            data: { title: lesson.title, content: lesson.content },
          });
        }
      }
      console.log(`  ✓ ${courseSeed.title} (content refreshed)`);
      continue;
    }

    await prisma.course.create({
      data: {
        title: courseSeed.title,
        description: courseSeed.description,
        status: 'PUBLISHED',
        pathId: path.id,
        instructorId: instructor.id,
        lessons: {
          create: courseSeed.lessons.map((lesson, i) => ({
            title: lesson.title,
            order: i + 1,
            content: lesson.content,
            videoUrl: lesson.videoUrl ?? null,
            quiz: lesson.quiz
              ? {
                  create: {
                    title: lesson.quiz.title,
                    passingScore: lesson.quiz.passingScore,
                    questions: {
                      create: lesson.quiz.questions.map((q, qi) => ({
                        type: q.type,
                        prompt: q.prompt,
                        options: q.options,
                        answer: q.answer,
                        order: qi + 1,
                      })),
                    },
                  },
                }
              : undefined,
          })),
        },
      },
    });
    console.log(`  ✓ ${courseSeed.title} (${courseSeed.lessons.length} lessons)`);
  }

  await seedChallenges();
  await seedAchievements();

  const chatCount = await prisma.chatMessage.count();
  if (chatCount === 0) {
    const [admin, student] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: 'admin@codeforge.dev' } }),
      prisma.user.findUniqueOrThrow({ where: { email: 'student@codeforge.dev' } }),
    ]);
    await prisma.chatMessage.createMany({
      data: [
        { room: 'general', userId: admin.id, content: 'Welcome to the CodeForge community chat! 👋 Be kind, help each other, and keep it friendly.' },
        { room: 'general', userId: instructor.id, content: 'Hi everyone! I teach the backend courses here — ask me anything about Node.js or Express.' },
        { room: 'general', userId: student.id, content: 'Just passed my first Python quiz 🐍🔥' },
        { room: 'help', userId: instructor.id, content: 'Stuck on a lesson or challenge? Post it here with the error message and someone will help.' },
        { room: 'showcase', userId: admin.id, content: 'Finished a course project? Share a link or screenshot here — we love seeing what you build! 🚀' },
      ],
    });
    console.log('  ✓ starter chat messages');
  }

  console.log('Seed complete.');
  console.log('Demo accounts: student@codeforge.dev / student123, instructor@codeforge.dev / instructor123, admin@codeforge.dev / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
