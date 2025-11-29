import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../state/AuthContext';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuthContext();
  if (isLoading) return <p className="text-center text-slate-500">Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
