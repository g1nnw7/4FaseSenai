import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages - User
import UserDashboard from './pages/user/UserDashboard';
import AgendarFaxina from './pages/user/AgendarFaxina';
import MinhasFaxinas from './pages/user/MinhasFaxinas';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFaxinas from './pages/admin/AdminFaxinas';
import AdminCLTs from './pages/admin/AdminCLTs';
import AdminAdmins from './pages/admin/AdminAdmins';

// Pages - CLT
import CltDashboard from './pages/admin/CltDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={getRedirect(user)} replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={getRedirect(user)} replace />} />

      {/* User routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/agendar" element={
        <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
          <AgendarFaxina />
        </ProtectedRoute>
      } />
      <Route path="/minhas-faxinas" element={
        <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
          <MinhasFaxinas />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'CLT']}>
          {user?.role === 'CLT' ? <CltDashboard /> : <AdminDashboard />}
        </ProtectedRoute>
      } />
      <Route path="/admin/faxinas" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'CLT']}>
          {user?.role === 'CLT' ? <CltDashboard /> : <AdminFaxinas />}
        </ProtectedRoute>
      } />
      <Route path="/admin/clts" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminCLTs />
        </ProtectedRoute>
      } />
      <Route path="/admin/admins" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminAdmins />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={user ? getRedirect(user) : '/login'} replace />} />
    </Routes>
  );
}

function getRedirect(user) {
  if (user.role === 'CLT') return '/admin';
  if (user.role === 'ADMIN') return '/admin';
  return '/';
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}