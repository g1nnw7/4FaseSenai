import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuario = useCallback(async () => {
    const token = localStorage.getItem('rappa_token');
    if (!token) {
      setCarregando(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUsuario(data);
    } catch {
      localStorage.removeItem('rappa_token');
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
  }, [carregarUsuario]);

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    localStorage.setItem('rappa_token', data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function register(nome, email, senha) {
    const { data } = await api.post('/auth/register', { nome, email, senha });
    return data;
  }

  function logout() {
    localStorage.removeItem('rappa_token');
    setUsuario(null);
  }

  const isDoctor = usuario?.role === 'DOCTOR';
  const isUser = usuario?.role === 'USER';
  const autenticado = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, register, logout, isDoctor, isUser, autenticado, carregarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}