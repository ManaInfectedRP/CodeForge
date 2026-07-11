import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Dropdown, dropdownItemClass } from './Dropdown';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
  }`;

const translations = {
  en: { login: 'Log in', register: 'Start learning' },
  sv: { login: 'Logga in', register: 'Börja lära dig' },
};

export function Navbar() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-lg font-bold">
          <img src="/favicon.png" alt="Kodstigen" className="h-9 w-9 rounded-lg object-cover" />
          <span className="hidden sm:inline">Kodstigen</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              Courses
            </NavLink>
            <NavLink to="/challenges" className={navLinkClass}>
              💻 Challenges
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              💬 Chat
            </NavLink>

            <Dropdown trigger="More">
              <NavLink to="/leaderboard" className={dropdownItemClass}>
                🏆 Leaderboard
              </NavLink>
              <NavLink to="/achievements" className={dropdownItemClass}>
                🎖️ Achievements
              </NavLink>
            </Dropdown>

            {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
              <Dropdown trigger="Manage">
                <NavLink to="/teach" className={dropdownItemClass}>
                  ✍️ Teach
                </NavLink>
                <NavLink to="/teach/guide" className={dropdownItemClass}>
                  📖 Instructor guide
                </NavLink>
                {user.role === 'ADMIN' && (
                  <>
                    <NavLink to="/admin" className={dropdownItemClass}>
                      🛡️ Admin
                    </NavLink>
                    <NavLink to="/admin/blog" className={dropdownItemClass}>
                      📝 Manage Blog
                    </NavLink>
                  </>
                )}
              </Dropdown>
            )}

            <div className="ml-2 flex items-center gap-2 border-l border-slate-800 pl-3">
              <span className="hidden items-center gap-2.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm md:flex">
                <span className="text-amber-400" title="XP">
                  ⚡ {user.xp}
                </span>
                <span className="text-orange-400" title="Daily streak">
                  🔥 {user.streak}
                </span>
              </span>

              <Dropdown
                align="right"
                trigger={
                  <span className="flex items-center gap-2">
                    {user.avatarUrl && (
                      <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                    )}
                    <span className="max-w-36 truncate">{user.username}</span>
                  </span>
                }
              >
                <div className="border-b border-slate-800 px-4 py-2 text-xs text-slate-500 md:hidden">
                  <span className="text-amber-400">⚡ {user.xp} XP</span> · <span className="text-orange-400">🔥 {user.streak} streak</span>
                </div>
                <NavLink to="/settings" className={dropdownItemClass}>
                  ⚙️ Settings
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white"
                >
                  Log out
                </button>
              </Dropdown>
            </div>
          </div>
        ) : (
          <nav className="flex items-center gap-1">
            <NavLink to="/login" className={navLinkClass}>
              {t.login}
            </NavLink>
            <Link
              to="/register"
              className="ml-2 rounded-lg bg-forge-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forge-500"
            >
              {t.register}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
