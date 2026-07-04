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
  {
    slug: 'git',
    name: 'Git',
    icon: '🌿',
    difficulty: 2,
    estimatedHours: 20,
    projectCount: 5,
    description: 'Version control fundamentals, track changes, branch, merge, and collaborate with Git and GitHub.',
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
  {
    title: 'Control Flow and Loops',
    content: lessonContent(
      'Control Flow and Loops',
      `\`\`\`cpp\n#include <iostream>\n\nint main() {\n    int xp = 45;\n\n    if (xp >= 50) {\n        std::cout << "Level up!" << std::endl;\n    } else {\n        std::cout << "Keep going, " << (50 - xp) << " XP to go." << std::endl;\n    }\n\n    for (int i = 1; i <= 5; i++) {\n        std::cout << "Lesson " << i << std::endl;\n    }\n\n    int count = 0;\n    while (count < 3) {\n        std::cout << "count = " << count << std::endl;\n        count++;\n    }\n\n    return 0;\n}\n\`\`\`\n\n## The pieces\n\n- \`if\` / \`else\` branch on a boolean condition, always wrapped in parentheses.\n- \`for (init; condition; increment)\` is best when you know how many times to loop.\n- \`while (condition)\` loops as long as the condition stays true, useful when the number of iterations isn't known ahead of time.`
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
      `\`\`\`cpp\n#include <iostream>\n#include <string>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nvoid greet(const std::string& name) {\n    std::cout << "Hello, " << name << "!" << std::endl;\n}\n\nint main() {\n    std::cout << "add(2, 3) = " << add(2, 3) << std::endl;\n    greet("CodeForge");\n    return 0;\n}\n\`\`\`\n\n## Key ideas\n\n- A function's declared return type (\`int\`, \`void\`, ...) must match what it actually returns, \`void\` means "returns nothing".\n- Passing a parameter as \`const std::string&\` passes it **by reference** instead of copying it, faster for large objects like strings, and \`const\` promises the function won't modify it.\n- Functions must generally be declared (or defined) before they're used, that's why \`add\` and \`greet\` appear above \`main\`.`
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
      `\`\`\`cpp\n#include <iostream>\n#include <vector>\n\nint main() {\n    int scores[3] = {80, 92, 67};   // fixed-size array\n    std::cout << "first score: " << scores[0] << std::endl;\n\n    std::vector<int> xp = {10, 20, 30};   // resizable array\n    xp.push_back(40);\n\n    int total = 0;\n    for (int value : xp) {\n        total += value;\n    }\n    std::cout << "total xp: " << total << std::endl;\n    std::cout << "vector size: " << xp.size() << std::endl;\n\n    return 0;\n}\n\`\`\`\n\n## Arrays vs. vectors\n\n- A plain array (\`int scores[3]\`) has a **fixed size** decided at compile time, it can never grow or shrink.\n- \`std::vector<T>\`, part of the Standard Template Library (STL), is a **resizable** array, \`push_back\` adds an element, \`size()\` tells you how many there are.\n- The range-based \`for (int value : xp)\` loop visits every element without needing an index.`
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
  git: {
    title: 'Git & Version Control Fundamentals',
    description:
      'Learn to track changes, branch, merge, and collaborate on code using Git, the version control system behind virtually every modern software project.',
    lessons: gitLessons,
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
