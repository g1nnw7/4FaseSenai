import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // USER tentando acessar /admin
    return <Navigate to="/" replace />;
  }

  return children;
}