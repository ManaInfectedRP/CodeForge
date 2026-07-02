import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@codeforge/shared';
import { useAuth } from '../context/AuthContext';

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center py-24 text-slate-400">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return roles.includes(user.role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
