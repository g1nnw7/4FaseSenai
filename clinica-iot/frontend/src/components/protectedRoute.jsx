import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ apenasDoctor = false }) {
  const { autenticado, isDoctor } = useAuth();

  if (!autenticado) return <Navigate to="/login" replace />;
  if (apenasDoctor && !isDoctor) return <Navigate to="/consultas" replace />;

  return <Outlet />;
}