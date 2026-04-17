import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.senha) {
      toast.error('Preencha todos os campos');
      return;
    }
    setCarregando(true);
    try {
      const usuario = await login(form.email, form.senha);
      toast.success(`Bem-vindo, ${usuario.nome.split(' ')[0]}!`);
      navigate(usuario.role === 'DOCTOR' ? '/admin' : '/consultas', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-neon-green shadow-neon mb-4">
            <span className="font-display font-bold text-neon-green text-2xl">R</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-wider">
            RAPPA <span className="text-neon-green">CLINIC</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-body">Sua saúde em boas mãos</p>
        </div>

        {/* Card */}
        <div className="card-neon">
          <h2 className="font-display font-semibold text-xl text-white mb-6">Entrar na conta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-neon-solid w-full mt-2"
            >
              {carregando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark-950/40 border-t-dark-950 rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-neon-green hover:text-neon-dim transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}