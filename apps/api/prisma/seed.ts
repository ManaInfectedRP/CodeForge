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
      `React is a JavaScript library for building user interfaces out of small, reusable **components**. Instead of manually updating the page, you describe what the UI should look like for a given state, and React handles the updates.\n\n## Your first component\n\nA component is just a JavaScript function that returns **JSX**, an HTML-like syntax that compiles down to regular JavaScript.\n\n\`\`\`\nfunction Welcome() {\n  return <h1>Hello, CodeForge!</h1>;\n}\n\`\`\`\n\n*JSX needs a React app (and a build step) to render, so it's read-only here, every example in this course uses this style, you'll run real components in the final project.*\n\n## Embedding JavaScript in JSX\n\nCurly braces \`{ }\` let you drop any JavaScript expression into your markup:\n\n\`\`\`\nfunction Greeting() {\n  const name = 'Ada';\n  return <h1>Hello, {name}!</h1>;\n}\n\`\`\`\n\n## One rule to remember\n\nA component must return a **single root element**. To return multiple sibling elements without adding an extra \`<div>\`, wrap them in a Fragment: \`<>...</>\`.`
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
      `C# (pronounced "C sharp") is a statically-typed, object-oriented language built by Microsoft for the .NET platform. It's used for everything from web APIs (ASP.NET) to desktop apps to game development (Unity).\n\n\`\`\`csharp\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, CodeForge!");\n    }\n}\n\`\`\`\n\n## The pieces\n\n- \`using System;\` imports the namespace that contains \`Console\` and other common types.\n- Every C# program needs an entry point method called \`Main\`, that's where execution starts.\n- \`Console.WriteLine(...)\` prints a line of text to the terminal.\n\nCompile and run a C# project with the .NET CLI:\n\n\`\`\`bash\ndotnet run\n\`\`\``
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
