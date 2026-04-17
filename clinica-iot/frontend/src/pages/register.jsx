import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (form.senha !== form.confirmar) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (form.senha.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setCarregando(true);
    try {
      await register(form.nome, form.email, form.senha);
      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta');
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
          <p className="text-gray-500 text-sm mt-2 font-body">Crie sua conta de paciente</p>
        </div>

        <div className="card-neon">
          <h2 className="font-display font-semibold text-xl text-white mb-6">Criar conta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Nome completo</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="João da Silva"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Confirmar Senha</label>
              <input
                type="password"
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                placeholder="Repita a senha"
                className="input-field"
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
                  Criando conta...
                </span>
              ) : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-neon-green hover:text-neon-dim transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}