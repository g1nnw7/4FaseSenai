import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Bem-vindo(a), ${user.name}!`);
      if (user.role === 'CLT' || user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-brand-900 font-display font-bold text-lg">R</span>
          </div>
          <span className="text-white font-display font-bold text-2xl tracking-tight">RAPPA</span>
        </div>

        <div>
          <h1 className="text-white font-display font-bold text-5xl leading-tight mb-6">
            Limpeza<br />profissional<br />na sua porta.
          </h1>
          <p className="text-brand-200 font-body text-lg leading-relaxed">
            Agende sua faxina com facilidade e conte com profissionais verificados.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '500+', label: 'Clientes atendidos' },
            { num: '98%', label: 'Satisfação' },
            { num: '24h', label: 'Resposta rápida' },
          ].map(stat => (
            <div key={stat.label} className="bg-brand-800 rounded-2xl p-4">
              <p className="text-white font-display font-bold text-2xl">{stat.num}</p>
              <p className="text-brand-300 text-xs font-body mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-brand-900 text-xl">RAPPA</span>
          </div>

          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Entrar na conta</h2>
          <p className="text-gray-500 font-body mb-8">Acesse sua conta para gerenciar faxinas</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">E-mail</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Senha</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 font-body">
            Não tem conta?{' '}
            <Link to="/register" className="text-brand-900 font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}