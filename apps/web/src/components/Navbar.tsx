import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
  }`;

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 text-lg font-bold">
          <img src="/logo.png" alt="CodeForge Academy" className="h-9 w-9 rounded-lg object-cover" />
          <span>
            CodeForge <span className="text-forge-500">Academy</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/courses" className={navLinkClass}>
                Courses
              </NavLink>
              <NavLink to="/paths" className={navLinkClass}>
                Paths
              </NavLink>
              {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                <NavLink to="/teach" className={navLinkClass}>
                  Teach
                </NavLink>
              )}
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass}>
                  Review
                </NavLink>
              )}
              <div className="ml-3 flex items-center gap-3 border-l border-slate-800 pl-4">
                <span className="text-sm text-amber-400" title="XP">
                  ⚡ {user.xp} XP
                </span>
                <span className="text-sm text-orange-400" title="Daily streak">
                  🔥 {user.streak}
                </span>
                <span className="hidden text-sm text-slate-300 sm:inline">{user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <Link
                to="/register"
                className="ml-2 rounded-lg bg-forge-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forge-500"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
