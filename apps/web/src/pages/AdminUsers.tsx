import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { AdminUserDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const adminTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

const roleStyles: Record<string, string> = {
  ADMIN: 'bg-red-900/60 text-red-300',
  INSTRUCTOR: 'bg-forge-900 text-forge-100',
  STUDENT: 'bg-slate-800 text-slate-400',
};

export function AdminUsers() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<AdminUserDto[]>('/admin/users', { params: search ? { search } : {} })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 250); // debounce typing in the search box
    return () => clearTimeout(timer);
  }, [load]);

  async function act(user: AdminUserDto, action: string, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setBusyId(user.id);
    setError(null);
    try {
      const { data } = await api.post<AdminUserDto>(`/admin/users/${user.id}/${action}`);
      setUsers((list) => list?.map((u) => (u.id === data.id ? data : u)) ?? null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const btn = 'rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40';

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex gap-2">
        <NavLink to="/admin" end className={adminTabClass}>
          Courses
        </NavLink>
        <NavLink to="/admin/challenges" className={adminTabClass}>
          Challenges
        </NavLink>
        <NavLink to="/admin/users" className={adminTabClass}>
          Users
        </NavLink>
      </nav>

      <h1 className="mt-6 text-3xl font-bold">User management</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username or email…"
        className="mt-6 w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
      />

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {users === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : users.length === 0 ? (
        <p className="mt-10 text-slate-400">No users match.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {users.map((u) => {
            const isSelf = u.id === me?.id;
            const isAdmin = u.role === 'ADMIN';
            return (
              <div key={u.id} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{u.username}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${roleStyles[u.role]}`}>
                        {u.role.toLowerCase()}
                      </span>
                      {u.bannedAt && (
                        <span className="rounded bg-red-900/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-300">
                          Banned
                        </span>
                      )}
                      {u.chatBlockedAt && (
                        <span className="rounded bg-amber-900/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                          Chat blocked
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {u.email} · ⚡ {u.xp} XP · 🔥 {u.streak} · joined {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {!isAdmin && !isSelf && (
                    <div className="flex flex-wrap gap-2">
                      {u.chatBlockedAt ? (
                        <button
                          onClick={() => act(u, 'chat-unblock')}
                          disabled={busyId === u.id}
                          className={`${btn} bg-emerald-700 text-white hover:bg-emerald-600`}
                        >
                          Unblock chat
                        </button>
                      ) : (
                        <button
                          onClick={() => act(u, 'chat-block')}
                          disabled={busyId === u.id}
                          className={`${btn} bg-amber-700 text-white hover:bg-amber-600`}
                        >
                          Block chat
                        </button>
                      )}
                      {u.bannedAt ? (
                        <button
                          onClick={() => act(u, 'unban')}
                          disabled={busyId === u.id}
                          className={`${btn} bg-emerald-700 text-white hover:bg-emerald-600`}
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            act(u, 'ban', `Ban ${u.username}? They will be logged out everywhere and unable to log in until unbanned.`)
                          }
                          disabled={busyId === u.id}
                          className={`${btn} bg-red-700 text-white hover:bg-red-600`}
                        >
                          Ban
                        </button>
                      )}
                      <button
                        onClick={() =>
                          act(u, 'reset-stats', `Reset ${u.username}'s stats? XP, streak, achievements, and challenge submissions will be wiped. Course progress and certificates are kept.`)
                        }
                        disabled={busyId === u.id}
                        className={`${btn} border border-slate-600 text-slate-300 hover:bg-slate-800`}
                      >
                        Reset stats
                      </button>
                      {u.role === 'STUDENT' ? (
                        <button
                          onClick={() =>
                            act(u, 'promote', `Promote ${u.username} to instructor? They will be able to create courses and challenges immediately.`)
                          }
                          disabled={busyId === u.id}
                          className={`${btn} bg-forge-600 text-white hover:bg-forge-500`}
                        >
                          Promote to instructor
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            act(u, 'demote', `Demote ${u.username} to student? Their courses stay published, but they lose access to the Teach tools immediately.`)
                          }
                          disabled={busyId === u.id}
                          className={`${btn} border border-forge-700 text-forge-100 hover:bg-forge-900/40`}
                        >
                          Demote to student
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
