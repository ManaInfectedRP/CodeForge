import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center py-24 text-slate-400">Loading…</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
