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
    estimatedHours: 30,
    projectCount: 8,
    description: 'Package, ship, and run applications anywhere with containers, images, Dockerfiles, and Docker Compose.',
  },
  {
    slug: 'azure',
    name: 'Azure',
    icon: '☁️',
    difficulty: 3,
    estimatedHours: 35,
    projectCount: 8,
    description: 'Deploy, host, and scale real applications in the cloud with Microsoft Azure.',
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
