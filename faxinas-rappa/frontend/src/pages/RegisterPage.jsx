import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-brand-900 font-display font-bold text-lg">R</span>
          </div>
          <span className="text-white font-display font-bold text-2xl tracking-tight">RAPPA</span>
        </div>
        <div>
          <h1 className="text-white font-display font-bold text-5xl leading-tight mb-6">
            Sua casa<br />merece o<br />melhor.
          </h1>
          <p className="text-brand-200 font-body text-lg">
            Crie sua conta e agende faxinas com profissionais de confiança.
          </p>
        </div>
        <div className="text-brand-300 font-body text-sm">
          Já tem mais de 500 clientes satisfeitos em Florianópolis.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-brand-900 text-xl">RAPPA</span>
          </div>

          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Criar conta</h2>
          <p className="text-gray-500 font-body mb-8">Preencha os dados para se cadastrar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Nome completo</label>
              <input type="text" className="input-field" placeholder="Seu nome" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">E-mail</label>
              <input type="email" className="input-field" placeholder="seu@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Telefone</label>
              <input type="tel" className="input-field" placeholder="(48) 99999-0000" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Senha</label>
                <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Confirmar</label>
                <input type="password" className="input-field" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required minLength={6} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 font-body">
            Já tem conta?{' '}
            <Link to="/login" className="text-brand-900 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}