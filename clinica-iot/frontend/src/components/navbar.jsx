import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { usuario, logout, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }) =>
    `font-display text-sm tracking-wide transition-all duration-200 px-3 py-1.5 rounded border ${
      isActive
        ? 'text-neon-green border-neon-dark bg-neon-dark/20'
        : 'text-gray-400 border-transparent hover:text-neon-green hover:border-neon-dark/50'
    }`;

  return (
    <nav className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-neon-green flex items-center justify-center shadow-neon-sm">
              <span className="text-neon-green font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-semibold text-white tracking-wider">
              RAPPA <span className="text-neon-green">CLINIC</span>
            </span>
          </div>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/consultas" className={linkClass}>Minhas Consultas</NavLink>
            <NavLink to="/agendar" className={linkClass}>Agendar</NavLink>
            {isDoctor && (
              <>
                <div className="w-px h-4 bg-dark-600 mx-1" />
                <NavLink to="/admin" className={linkClass}>Painel Admin</NavLink>
                <NavLink to="/admin/minhas-consultas" className={linkClass}>Minha Agenda</NavLink>
                <NavLink to="/admin/todas-consultas" className={linkClass}>Todas Consultas</NavLink>
              </>
            )}
          </div>

          {/* Usuário + logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
              <span className="text-sm text-gray-400 font-body">{usuario?.nome}</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isDoctor
                  ? 'text-neon-green border-neon-dark bg-neon-dark/20'
                  : 'text-blue-400 border-blue-900 bg-blue-900/20'
              }`}>
                {usuario?.role}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-sm py-1.5 px-3">
              Sair
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-neon-green transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-dark-700 py-4 space-y-2 animate-fade-in">
            <NavLink to="/consultas" className={linkClass} onClick={() => setMenuOpen(false)}>Minhas Consultas</NavLink>
            <NavLink to="/agendar" className={linkClass} onClick={() => setMenuOpen(false)}>Agendar</NavLink>
            {isDoctor && (
              <>
                <div className="border-t border-dark-700 pt-2 mt-2 space-y-2">
                  <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Painel Admin</NavLink>
                  <NavLink to="/admin/minhas-consultas" className={linkClass} onClick={() => setMenuOpen(false)}>Minha Agenda</NavLink>
                  <NavLink to="/admin/todas-consultas" className={linkClass} onClick={() => setMenuOpen(false)}>Todas Consultas</NavLink>
                </div>
              </>
            )}
            <div className="border-t border-dark-700 pt-2 mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">{usuario?.nome}</span>
              <button onClick={handleLogout} className="btn-ghost text-sm py-1 px-3">Sair</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}