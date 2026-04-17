import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Login from './pages/login';
import Register from './pages/register';
import MinhasConsultas from './pages/minhasConsultas';
import AgendarConsulta from './pages/agendarConsulta';
import PainelAdmin from './pages/admin/painelAdmin';
import MinhasConsultasDoctor from './pages/admin/minhasConsultasDoctor';
import TodasConsultas from './pages/admin/todasConsultas';
import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import LoadingScreen from './components/loadingScreen';

export default function App() {
  const { carregando, autenticado, isDoctor } = useAuth();

  if (carregando) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-dark-950">
      {autenticado && <Navbar />}
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={autenticado ? <Navigate to={isDoctor ? '/admin' : '/consultas'} /> : <Login />} />
        <Route path="/register" element={autenticado ? <Navigate to="/consultas" /> : <Register />} />

        {/* USER + DOCTOR */}
        <Route element={<ProtectedRoute />}>
          <Route path="/consultas" element={<MinhasConsultas />} />
          <Route path="/agendar" element={<AgendarConsulta />} />
        </Route>

        {/* Apenas DOCTOR */}
        <Route element={<ProtectedRoute apenasDoctor />}>
          <Route path="/admin" element={<PainelAdmin />} />
          <Route path="/admin/minhas-consultas" element={<MinhasConsultasDoctor />} />
          <Route path="/admin/todas-consultas" element={<TodasConsultas />} />
        </Route>

        {/* Redirect raiz */}
        <Route path="/" element={
          autenticado
            ? <Navigate to={isDoctor ? '/admin' : '/consultas'} />
            : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}