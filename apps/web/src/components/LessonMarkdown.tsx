import { isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodePlayground, normalizeLang } from './CodePlayground';
import { highlight, resolvePrismLang } from '../lib/prism';

/**
 * Fenced code blocks in a runnable language (python/js/ts) become interactive
 * playgrounds; everything else is a static, syntax-highlighted block.
 */
function PreBlock({ children, ...props }: ComponentProps<'pre'>) {
  const child = Array.isArray(children) ? children[0] : children;
  if (isValidElement(child)) {
    const el = child as ReactElement<{ className?: string; children?: ReactNode }>;
    const match = /language-(\w+)/.exec(el.props.className ?? '');
    const rawLang = match?.[1] ?? '';
    const code = String(el.props.children ?? '').replace(/\n$/, '');

    const runnable = normalizeLang(rawLang);
    if (runnable) return <CodePlayground language={runnable} initialCode={code} />;

    const prismLang = resolvePrismLang(rawLang);
    if (prismLang) {
      return (
        <pre className={el.props.className}>
          <code
            className={el.props.className}
            dangerouslySetInnerHTML={{ __html: highlight(code, prismLang) }}
          />
        </pre>
      );
    }
  }
  return <pre {...props}>{children}</pre>;
}

export function LessonMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: PreBlock }}>
      {children}
    </ReactMarkdown>
  );
}
