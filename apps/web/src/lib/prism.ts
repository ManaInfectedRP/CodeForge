import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';

export type PrismLang = 'python' | 'javascript' | 'typescript' | 'cpp' | 'c' | 'bash' | 'json' | 'markdown';

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
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  markdown: 'markdown',
  md: 'markdown',
};

export function resolvePrismLang(lang: string): PrismLang | null {
  return ALIASES[lang.toLowerCase()] ?? null;
}

export function highlight(code: string, lang: PrismLang): string {
  return Prism.highlight(code, Prism.languages[lang], lang);
}
