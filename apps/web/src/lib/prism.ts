import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-yaml';

export type PrismLang =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'sql'
  | 'bash'
  | 'json'
  | 'markdown'
  | 'markup'
  | 'css'
  | 'lua'
  | 'yaml';

const ALIASES: Record<string, PrismLang> = {
  python: 'python',
  py: 'python',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  csharp: 'csharp',
  'c#': 'csharp',
  cs: 'csharp',
  sql: 'sql',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  markdown: 'markdown',
  md: 'markdown',
  html: 'markup',
  htm: 'markup',
  xml: 'markup',
  css: 'css',
  lua: 'lua',
  yaml: 'yaml',
  yml: 'yaml',
};

export function resolvePrismLang(lang: string): PrismLang | null {
  return ALIASES[lang.toLowerCase()] ?? null;
}

export function highlight(code: string, lang: PrismLang): string {
  return Prism.highlight(code, Prism.languages[lang], lang);
}
