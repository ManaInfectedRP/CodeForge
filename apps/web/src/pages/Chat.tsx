import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
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

const roleBadge: Record<string, string | null> = {
  ADMIN: 'bg-red-900/60 text-red-300',
  INSTRUCTOR: 'bg-forge-900 text-forge-100',
  STUDENT: null,
};

function Avatar({ url, username }: { url: string | null; username: string }) {
  if (url) return <img src={url} alt={username} className="h-8 w-8 shrink-0 rounded-full object-cover" />;
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold uppercase text-slate-300">
      {username.slice(0, 2)}
    </span>
  );
}

export function Chat() {
  const { user } = useAuth();
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [draft, setDraft] = useState('');
  const [online, setOnline] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  function send() {
    const content = draft.trim();
    if (!content) return;
    setError(null);
    getChatSocket().emit('chat:send', { room, content }, (r: { ok: boolean; error?: string }) => {
      if (!r.ok) setError(r.error ?? 'Failed to send');
    });
    setDraft('');
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
                <p className="whitespace-pre-wrap break-words text-sm text-slate-300">{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {notice && <p className="mt-2 text-sm text-emerald-400">{notice}</p>}

      <div className="mt-3 flex gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          maxLength={1000}
          placeholder="Type a friendly message… (Ctrl+Enter to send)"
          className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="rounded-xl bg-forge-600 px-6 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </main>
  );
}
