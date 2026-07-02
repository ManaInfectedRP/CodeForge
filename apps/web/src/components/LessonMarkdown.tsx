import { isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { CodePlayground, normalizeLang } from './CodePlayground';

/**
 * Fenced code blocks in a runnable language (python/js/ts) become interactive
 * playgrounds; everything else renders as a normal static block.
 */
function PreBlock({ children, ...props }: ComponentProps<'pre'>) {
  const child = Array.isArray(children) ? children[0] : children;
  if (isValidElement(child)) {
    const el = child as ReactElement<{ className?: string; children?: ReactNode }>;
    const match = /language-(\w+)/.exec(el.props.className ?? '');
    const lang = match ? normalizeLang(match[1]) : null;
    if (lang) {
      const code = String(el.props.children ?? '').replace(/\n$/, '');
      return <CodePlayground language={lang} initialCode={code} />;
    }
  }
  return <pre {...props}>{children}</pre>;
}

export function LessonMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={{ pre: PreBlock }}>{children}</ReactMarkdown>;
}
