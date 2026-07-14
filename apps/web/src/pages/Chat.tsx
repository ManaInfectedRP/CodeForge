import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent, type KeyboardEvent } from 'react';
import type { ChatMessageDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { getChatSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';

const ROOMS: { id: string; label: string }[] = [
  { id: 'general', label: '💬 General' },
  { id: 'help', label: '🆘 Help' },
  { id: 'random', label: '🎲 Random' },
  { id: 'showcase', label: '🚀 Show & Tell' },
];

const EMOJIS = [
  '😀', '😂', '😅', '😊', '😍', '😘', '😜', '🤔', '😎', '🙂', '😢', '😭', '😡', '🥳', '😴', '🤯',
  '🥶', '😱', '🫡', '🤝', '👍', '👎', '👏', '🙌', '🙏', '💪', '👀', '🔥', '✨', '🎉', '💯', '⭐',
  '✅', '❌', '❤️', '💔', '🚀', '🐛', '💻', '☕', '🍕', '🎮', '📚', '🤖', '🎯', '⚡', '🌟', '🏆',
];

// Same logos used on the landing page's language carousel (apps/web/public/langs/*.svg),
// reused here as custom :slug: emoji shortcodes.
const TECH_ICONS = [
  { slug: 'ai-coding', label: 'AI Coding' },
  { slug: 'aws', label: 'AWS' },
  { slug: 'azure', label: 'Azure' },
  { slug: 'c', label: 'C' },
  { slug: 'cicd', label: 'CI/CD' },
  { slug: 'cpp', label: 'C++' },
  { slug: 'csharp', label: 'C#' },
  { slug: 'css', label: 'CSS' },
  { slug: 'cybersecurity', label: 'Cybersecurity' },
  { slug: 'devops', label: 'DevOps' },
  { slug: 'docker', label: 'Docker' },
  { slug: 'gdscript', label: 'GDScript' },
  { slug: 'git', label: 'Git' },
  { slug: 'go', label: 'Go' },
  { slug: 'html', label: 'HTML' },
  { slug: 'java', label: 'Java' },
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'kotlin', label: 'Kotlin' },
  { slug: 'kubernetes', label: 'Kubernetes' },
  { slug: 'linux', label: 'Linux' },
  { slug: 'lua', label: 'Lua' },
  { slug: 'nodejs', label: 'Node.js' },
  { slug: 'observability', label: 'Observability' },
  { slug: 'python', label: 'Python' },
  { slug: 'react', label: 'React' },
  { slug: 'solidity', label: 'Solidity' },
  { slug: 'sql', label: 'SQL' },
  { slug: 'typescript', label: 'TypeScript' },
];
const TECH_ICON_SLUGS = new Set(TECH_ICONS.map((t) => t.slug));
const SHORTCODE_RE = /(:[a-z0-9-]+:)/g;

/** Renders message text, swapping any recognized :slug: shortcode for its inline tech-icon SVG. */
function renderMessageContent(content: string) {
  return content.split(SHORTCODE_RE).map((part, i) => {
    const slug = /^:([a-z0-9-]+):$/.exec(part)?.[1];
    if (slug && TECH_ICON_SLUGS.has(slug)) {
      return (
        <img
          key={i}
          src={`/langs/${slug}.svg`}
          alt={`:${slug}:`}
          title={`:${slug}:`}
          className="inline-block h-5 w-5 -translate-y-0.5 align-middle"
        />
      );
    }
    return part;
  });
}

const roleBadge: Record<string, string | null> = {
  ADMIN: 'bg-red-900/60 text-red-300',
  INSTRUCTOR: 'bg-forge-900 text-forge-100',
  STUDENT: null,
};

function EmojiPicker({ onPick, onClose }: { onPick: (token: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'emoji' | 'tech'>('emoji');

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 w-96 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl"
    >
      <div className="mb-1 flex gap-1">
        <button
          type="button"
          onClick={() => setTab('emoji')}
          className={`flex-1 rounded-lg py-1 text-xs font-medium ${tab === 'emoji' ? 'bg-forge-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          🙂 Emoji
        </button>
        <button
          type="button"
          onClick={() => setTab('tech')}
          className={`flex-1 rounded-lg py-1 text-xs font-medium ${tab === 'tech' ? 'bg-forge-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          💻 Tech
        </button>
      </div>

      {tab === 'emoji' ? (
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onPick(emoji)}
              className="rounded-lg p-1.5 text-xl hover:bg-slate-700"
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-1">
          {TECH_ICONS.map(({ slug, label }) => (
            <button
              key={slug}
              type="button"
              onClick={() => onPick(`:${slug}:`)}
              title={label}
              className="flex items-center justify-center rounded-lg p-2 hover:bg-slate-700"
            >
              <img src={`/langs/${slug}.svg`} alt={label} className="h-6 w-6" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Avatar({ url, username }: { url: string | null; username: string }) {
  if (url) return <img src={url} alt={username} className="h-8 w-8 shrink-0 rounded-full object-cover" />;
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold uppercase text-slate-300">
      {username.slice(0, 2)}
    </span>
  );
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function Chat() {
  const { user } = useAuth();
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [draft, setDraft] = useState('');
  const [online, setOnline] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!pendingImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingImage]);

  useEffect(() => {
    const socket = getChatSocket();

    setMessages([]);
    api.get<ChatMessageDto[]>(`/chat/${room}/messages`).then((res) => setMessages(res.data));
    socket.emit('chat:join', room);

    const onMessage = (msg: ChatMessageDto) => {
      if (msg.room === room) setMessages((m) => [...m, msg]);
    };
    const onPresence = (p: { room: string; online: number }) => {
      if (p.room === room) setOnline(p.online);
    };
    socket.on('chat:message', onMessage);
    socket.on('chat:presence', onPresence);
    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:presence', onPresence);
    };
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Only image files can be attached');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be smaller than 5MB');
      return;
    }
    setError(null);
    setPendingImage(file);
  }

  async function send() {
    const content = draft.trim();
    if (!content && !pendingImage) return;
    setError(null);

    let imageUrl: string | undefined;
    if (pendingImage) {
      setUploading(true);
      try {
        const form = new FormData();
        form.append('image', pendingImage);
        const res = await api.post<{ url: string }>('/chat/upload', form);
        imageUrl = res.data.url;
      } catch (err) {
        setError(errorMessage(err));
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    getChatSocket().emit('chat:send', { room, content, imageUrl }, (r: { ok: boolean; error?: string }) => {
      if (!r.ok) setError(r.error ?? 'Failed to send');
    });
    setDraft('');
    setPendingImage(null);
  }

  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? draft.length;
      const end = el.selectionEnd ?? draft.length;
      const next = draft.slice(0, start) + emoji + draft.slice(end);
      setDraft(next);
      requestAnimationFrame(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = start + emoji.length;
      });
    } else {
      setDraft((d) => d + emoji);
    }
    setShowEmojiPicker(false);
  }

  function onPaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
    if (!item) return;
    const file = item.getAsFile();
    if (!file) return;
    e.preventDefault();
    handleImageFile(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
    if (file) handleImageFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    if (!Array.from(e.dataTransfer.items).some((i) => i.kind === 'file')) return;
    e.preventDefault();
    setDragActive(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragActive(false);
  }

  async function blockUser(m: ChatMessageDto) {
    if (!confirm(`Block ${m.username} from posting in chat? They can still read. Unblock anytime from Admin → Users.`)) return;
    setError(null);
    setNotice(null);
    try {
      await api.post(`/admin/users/${m.userId}/chat-block`);
      setNotice(`${m.username} is now blocked from posting.`);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community chat</h1>
        <span className="text-sm text-emerald-400">● {online} online</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              room === r.id ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">No messages yet, say hi! 👋</p>
        )}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const grouped = prev?.userId === m.userId && Date.parse(m.createdAt) - Date.parse(prev.createdAt) < 5 * 60 * 1000;
          const badge = roleBadge[m.role];
          const canBlock = user?.role === 'ADMIN' && m.userId !== user.id && m.role !== 'ADMIN';
          return (
            <div key={m.id} className={`group flex gap-3 rounded-lg px-2 hover:bg-slate-800/40 ${grouped ? 'py-0.5' : 'pt-3 pb-0.5'}`}>
              <div className="w-8">{!grouped && <Avatar url={m.avatarUrl} username={m.username} />}</div>
              <div className="min-w-0 flex-1">
                {!grouped && (
                  <p className="flex items-baseline gap-2">
                    <span className={`text-sm font-semibold ${m.userId === user?.id ? 'text-forge-500' : 'text-slate-200'}`}>
                      {m.username}
                    </span>
                    {badge && (
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${badge}`}>
                        {m.role.toLowerCase()}
                      </span>
                    )}
                    <span className="text-xs text-slate-600">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {canBlock && (
                      <button
                        onClick={() => blockUser(m)}
                        title="Block this user from posting in chat"
                        className="invisible text-xs text-red-400/70 hover:text-red-300 group-hover:visible"
                      >
                        🚫 block
                      </button>
                    )}
                  </p>
                )}
                {m.content && (
                  <p className="whitespace-pre-wrap break-words text-sm text-slate-300">{renderMessageContent(m.content)}</p>
                )}
                {m.imageUrl && (
                  <a href={m.imageUrl} target="_blank" rel="noreferrer">
                    <img
                      src={m.imageUrl}
                      alt="Shared attachment"
                      className="mt-1.5 max-h-72 max-w-full rounded-lg border border-slate-800 object-contain"
                    />
                  </a>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {notice && <p className="mt-2 text-sm text-emerald-400">{notice}</p>}

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative mt-3 rounded-xl ${dragActive ? 'ring-2 ring-forge-500' : ''}`}
      >
        {dragActive && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-950/80 text-sm font-medium text-forge-300">
            Drop image to attach
          </div>
        )}

        {pendingImage && previewUrl && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-2">
            <img src={previewUrl} alt="Attachment preview" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-400">{pendingImage.name}</p>
              <p className="text-xs text-slate-600">Add a comment below, or send as-is</p>
            </div>
            <button
              onClick={() => setPendingImage(null)}
              className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative flex items-end">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="Add emoji"
              className="h-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-lg hover:bg-slate-800"
            >
              🙂
            </button>
            {showEmojiPicker && <EmojiPicker onPick={insertEmoji} onClose={() => setShowEmojiPicker(false)} />}
          </div>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            rows={2}
            maxLength={1000}
            placeholder={
              pendingImage
                ? 'Add a caption… (optional, Ctrl+Enter to send)'
                : 'Type a friendly message… (Ctrl+Enter to send, paste or drop an image to attach)'
            }
            className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
          />
          <button
            onClick={send}
            disabled={(!draft.trim() && !pendingImage) || uploading}
            className="rounded-xl bg-forge-600 px-6 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-40"
          >
            {uploading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}
