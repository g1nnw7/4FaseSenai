import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, canAccessAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { to: '/', label: 'Início' },
    { to: '/agendar', label: 'Agendar' },
    { to: '/minhas-faxinas', label: 'Minhas Faxinas' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-brand-900 text-xl tracking-tight">RAPPA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user?.role !== 'CLT' && userLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'bg-brand-900 text-white'
                    : 'text-gray-600 hover:text-brand-900 hover:bg-brand-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {canAccessAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-brand-900 text-white'
                    : 'text-gray-600 hover:text-brand-900 hover:bg-brand-50'
                }`}
              >
                Painel Admin
              </Link>
            )}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 font-display">{user?.name}</p>
              <p className="text-xs text-gray-400 font-body">{roleLabel(user?.role)}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-900 flex items-center justify-center text-white font-display font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-body"
            >
              Sair
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {user?.role !== 'CLT' && userLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'bg-brand-900 text-white' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {canAccessAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600"
              >
                Painel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-500"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function roleLabel(role) {
  const labels = { ADMIN: 'Administrador', CLT: 'Funcionário', USER: 'Cliente' };
  return labels[role] || role;
}