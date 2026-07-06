import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight } from '../lib/prism';

export function HtmlPreview({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [preview, setPreview] = useState<string | null>(null);

  function reset() {
    setCode(initialCode);
    setPreview(null);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">HTML</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={code === initialCode && preview === null}
            className="rounded-md px-3 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setPreview(code)}
            className="rounded-md bg-emerald-600 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            ▶ Preview
          </button>
        </div>
      </div>

      <div className="max-h-[36rem] min-h-[4.5rem] overflow-auto bg-slate-950">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => highlight(c, 'markup')}
          padding={16}
          textareaClassName="focus:outline-none"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: '0.875rem',
            lineHeight: 1.625,
          }}
        />
      </div>

      {preview !== null && (
        <div className="border-t border-slate-800 bg-black/40 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Preview</p>
          <iframe
            title="HTML preview"
            srcDoc={preview}
            sandbox=""
            className="h-64 w-full rounded-lg border border-slate-800 bg-white"
          />
        </div>
      )}
    </div>
  );
}
