import { useState, type FormEvent } from 'react';
import type { UserDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { AvatarCropModal } from '../components/AvatarCropModal';

function Notice({ text, tone }: { text: string; tone: 'ok' | 'err' }) {
  return <p className={`text-sm ${tone === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{text}</p>;
}

export function Settings() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ text: string; tone: 'ok' | 'err' } | null>(null);
  const [avatarMsg, setAvatarMsg] = useState<{ text: string; tone: 'ok' | 'err' } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; tone: 'ok' | 'err' } | null>(null);
  const [busy, setBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  if (!user) return null;

  function pickAvatarFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setProfileMsg(null);
    try {
      await api.put<UserDto>('/me/profile', { username, bio: bio.trim() === '' ? null : bio });
      await refreshUser();
      setProfileMsg({ text: 'Profile saved.', tone: 'ok' });
    } catch (err) {
      setProfileMsg({ text: errorMessage(err), tone: 'err' });
    } finally {
      setBusy(false);
    }
  }

  async function uploadAvatar(blob: Blob) {
    setBusy(true);
    setAvatarMsg(null);
    try {
      const form = new FormData();
      form.append('avatar', blob, 'avatar.png');
      await api.post<UserDto>('/me/avatar', form);
      await refreshUser();
      setAvatarMsg({ text: 'Avatar updated.', tone: 'ok' });
    } catch (err) {
      setAvatarMsg({ text: errorMessage(err), tone: 'err' });
    } finally {
      setBusy(false);
    }
  }

  async function removeAvatar() {
    setBusy(true);
    setAvatarMsg(null);
    try {
      await api.delete('/me/avatar');
      await refreshUser();
      setAvatarMsg({ text: 'Avatar removed.', tone: 'ok' });
    } catch (err) {
      setAvatarMsg({ text: errorMessage(err), tone: 'err' });
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', tone: 'err' });
      return;
    }
    setBusy(true);
    try {
      await api.put('/me/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ text: 'Password changed.', tone: 'ok' });
    } catch (err) {
      setPasswordMsg({ text: errorMessage(err), tone: 'err' });
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none';

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Avatar</h2>
        <div className="mt-4 flex items-center gap-5">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Your avatar" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold uppercase text-slate-300">
              {user.username.slice(0, 2)}
            </span>
          )}
          <div className="space-y-2">
            <label className="inline-block cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              {user.avatarUrl ? 'Change avatar…' : 'Upload avatar…'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) pickAvatarFile(file);
                }}
              />
            </label>
            {user.avatarUrl && (
              <button
                onClick={removeAvatar}
                disabled={busy}
                className="block rounded-lg border border-red-800 px-4 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/40 disabled:opacity-50"
              >
                Remove
              </button>
            )}
            <p className="text-xs text-slate-500">jpeg / png / webp / gif, max 5 MB</p>
          </div>
        </div>
        {avatarMsg && <div className="mt-3"><Notice {...avatarMsg} /></div>}
      </section>

      <form onSubmit={saveProfile} className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Profile</h2>
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm text-slate-300">Username</label>
          <input
            id="username"
            required
            minLength={3}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">
            Shown in chat, on the leaderboard, and on your certificates.
          </p>
        </div>
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm text-slate-300">Bio</label>
          <textarea
            id="bio"
            rows={3}
            maxLength={500}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community a bit about yourself…"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Email</label>
          <input value={user.email} disabled className={`${inputClass} opacity-60`} />
        </div>
        {profileMsg && <Notice {...profileMsg} />}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Save profile
        </button>
      </form>

      <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Change password</h2>
        <div>
          <label htmlFor="current" className="mb-1.5 block text-sm text-slate-300">Current password</label>
          <input
            id="current"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new" className="mb-1.5 block text-sm text-slate-300">New password</label>
            <input
              id="new"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm text-slate-300">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        {passwordMsg && <Notice {...passwordMsg} />}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Change password
        </button>
      </form>

      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onConfirm={(blob) => {
            setCropSrc(null);
            void uploadAvatar(blob);
          }}
        />
      )}
    </main>
  );
}
