import { isValidElement, useMemo, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { CodePlayground, normalizeLang } from './CodePlayground';
import { HtmlPreview } from './HtmlPreview';
import { highlight, resolvePrismLang } from '../lib/prism';

/**
 * Fenced code blocks in a runnable language (python/js/ts/lua) become interactive
 * playgrounds, html blocks become a live sandboxed preview, everything else is a
 * static, syntax-highlighted block.
 */
function PreBlock({ children, sessionKey, ...props }: ComponentProps<'pre'> & { sessionKey?: string }) {
  const child = Array.isArray(children) ? children[0] : children;
  if (isValidElement(child)) {
    const el = child as ReactElement<{ className?: string; children?: ReactNode }>;
    const match = /language-(\w+)/.exec(el.props.className ?? '');
    const rawLang = match?.[1] ?? '';
    const code = String(el.props.children ?? '').replace(/\n$/, '');

    if (rawLang.toLowerCase() === 'html' || rawLang.toLowerCase() === 'htm') {
      return <HtmlPreview initialCode={code} />;
    }

    const runnable = normalizeLang(rawLang);
    if (runnable) return <CodePlayground language={runnable} initialCode={code} sessionKey={sessionKey} />;

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

export function LessonMarkdown({ children, sessionKey }: { children: string; sessionKey?: string }) {
  // Stable across re-renders unless sessionKey changes, so editing a code block doesn't get
  // wiped out by an unrelated parent re-render remounting every playground on the page.
  const components = useMemo(
    () => ({ pre: (props: ComponentProps<'pre'>) => <PreBlock {...props} sessionKey={sessionKey} /> }),
    [sessionKey]
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkAlert]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
