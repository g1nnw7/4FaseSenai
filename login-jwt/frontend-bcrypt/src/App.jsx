import React, { useState, useEffect } from 'react';

export default function RappaUI() {
  // Controle de Telas
  const [view, setView] = useState('auth'); 
  const [authMode, setAuthMode] = useState('login'); 

  // Dados do Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Feedback para o usuário
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Dados do Banco de Dados
  const [usuarios, setUsuarios] = useState([]);

  // ==========================================
  // 1. FUNÇÃO DE LOGIN REAL
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salva o Token no navegador
      localStorage.setItem('token', data.token);

      // Limpa os campos
      setEmail('');
      setSenha('');

      // Redireciona baseado na Role (ajuste conforme o retorno da sua API)
      if (data.usuario.role === 'ADMIN') {
        setView('admin');
      } else {
        setView('user');
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. FUNÇÃO DE REGISTRO REAL
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      // Se deu certo, joga pro login
      setAuthMode('login');
      setErro('Conta criada! Faça login.'); // Reaproveitando o state de erro para msg de sucesso provisória
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. BUSCAR USUÁRIOS NO BANCO (ADMIN)
  // ==========================================
  useEffect(() => {
    if (view === 'admin') {
      const fetchUsuarios = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3000/usuarios', {
            headers: {
              'Authorization': `Bearer ${token}` // Passando o JWT!
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUsuarios(data);
          } else {
            console.error("Sem permissão ou token inválido");
            setView('auth'); // Expulsa pro login se falhar
          }
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      };

      fetchUsuarios();
    }
  }, [view]); // Executa toda vez que a 'view' muda para 'admin'

  // ==========================================
  // 4. FUNÇÃO DE LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('auth');
    setUsuarios([]); // Limpa a lista da memória
  };

  return (
    <div className="bg-zinc-950 text-zinc-400 antialiased min-h-screen font-sans">
      
      {/* ================= AUTH CONTAINER ================= */}
      {view === 'auth' && (
        <div className="flex min-h-screen items-center justify-center p-4">
          
          {/* --- LOGIN --- */}
          {authMode === 'login' && (
            <div className="w-full max-w-[400px] space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h1 className="text-zinc-100 font-semibold text-3xl tracking-tighter">RAPPA</h1>
                <p className="text-sm font-light">Entre com suas credenciais para acessar a plataforma.</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleLogin}>
                {erro && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">{erro}</div>}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">E-MAIL</label>
                  <div className="relative flex items-center">
                    <iconify-icon icon="solar:user-linear" className="absolute left-3 text-zinc-500" style={{ fontSize: '1.25rem' }}></iconify-icon>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nome@exemplo.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">SENHA</label>
                  <div className="relative flex items-center">
                    <iconify-icon icon="solar:lock-password-linear" className="absolute left-3 text-zinc-500" style={{ fontSize: '1.25rem' }}></iconify-icon>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-all mt-2 disabled:opacity-50">
                  {loading ? 'Entrando...' : 'Entrar na Conta'}
                </button>
              </form>

              <p className="text-center text-xs font-light">
                Não possui conta?{' '}
                <button onClick={() => { setAuthMode('register'); setErro(''); }} className="text-zinc-100 font-medium hover:underline">
                  Crie uma agora
                </button>
              </p>
            </div>
          )}

          {/* --- REGISTER --- */}
          {authMode === 'register' && (
            <div className="w-full max-w-[400px] space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h1 className="text-zinc-100 font-semibold text-3xl tracking-tighter">RAPPA</h1>
                <p className="text-sm font-light">Crie sua conta para começar a gerenciar.</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleRegister}>
                {erro && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">{erro}</div>}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">NOME COMPLETO</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">E-MAIL</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nome@exemplo.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">SENHA</label>
                  <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-all mt-4 disabled:opacity-50">
                  {loading ? 'Registrando...' : 'Registrar Agora'}
                </button>
              </form>

              <p className="text-center text-xs font-light">
                Já tem conta?{' '}
                <button onClick={() => { setAuthMode('login'); setErro(''); }} className="text-zinc-100 font-medium hover:underline">
                  Voltar ao login
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= ADMIN PANEL ================= */}
      {view === 'admin' && (
        <div className="flex h-screen overflow-hidden animate-in fade-in duration-300">
          <aside className="w-64 border-r border-zinc-900 flex-col p-6 hidden md:flex">
            <div className="mb-10">
              <span className="text-zinc-100 font-semibold text-2xl tracking-tighter">RAPPA</span>
            </div>
            <nav className="flex-1 space-y-1">
              <a href="#" className="flex items-center space-x-3 text-zinc-100 bg-zinc-900/50 p-2 rounded-lg text-sm">
                <iconify-icon icon="solar:users-group-two-rounded-linear" style={{ fontSize: '1.25rem' }}></iconify-icon>
                <span className="font-medium">Usuários</span>
              </a>
            </nav>
            <div className="mt-auto pt-6 border-t border-zinc-900">
              <button onClick={handleLogout} className="w-full flex items-center space-x-3 text-zinc-500 hover:text-red-400 transition-colors text-sm group">
                <iconify-icon icon="solar:logout-linear" className="group-hover:translate-x-1 transition-transform" style={{ fontSize: '1.25rem' }}></iconify-icon>
                <span>Sair do sistema</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar">
            <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500">Páginas /</span>
                <span className="text-xs text-zinc-100 font-medium tracking-tight">Painel Administrativo</span>
              </div>
              <div className="flex items-center space-x-6">
                <button onClick={handleLogout} className="flex items-center space-x-1.5 text-zinc-500 hover:text-zinc-100 transition-colors group">
                  <span className="text-xs font-medium">Sair</span>
                  <iconify-icon icon="solar:logout-3-linear" className="group-hover:translate-x-0.5 transition-transform" style={{ fontSize: '1.1rem' }}></iconify-icon>
                </button>
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-100 font-semibold">AD</div>
              </div>
            </header>

            <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
              
              {/* Dinâmico: Contando quantos usuários vieram do banco */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Usuários</span>
                    <iconify-icon icon="solar:users-group-linear" className="text-zinc-400" style={{ fontSize: '1.2rem' }}></iconify-icon>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold text-zinc-100 tracking-tight">{usuarios.length}</span>
                  </div>
                </div>
              </div>

              {/* Tabela puxando dados reais do Backend */}
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
                  <h2 className="text-zinc-100 font-medium text-base tracking-tight">Usuários do Sistema</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase text-zinc-500 font-semibold bg-zinc-900/50">
                        <th className="px-6 py-3 tracking-wider">Nome</th>
                        <th className="px-6 py-3 tracking-wider">Email</th>
                        <th className="px-6 py-3 tracking-wider">Cargo</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-900">
                      {usuarios.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">Nenhum usuário encontrado ou carregando...</td>
                        </tr>
                      ) : (
                        usuarios.map((user) => (
                          <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors group">
                            <td className="px-6 py-4 text-zinc-200 font-medium">{user.nome}</td>
                            <td className="px-6 py-4 font-light">{user.email}</td>
                            <td className="px-6 py-4">
                              {user.role === 'ADMIN' ? (
                                <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-950 text-[10px] font-semibold rounded-full">ADMIN</span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-medium rounded-full uppercase tracking-wide">User</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ================= NON-ADMIN USER VIEW ================= */}
      {view === 'user' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-300">
          <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-4">
            <iconify-icon icon="solar:shield-check-linear" className="text-zinc-400 text-4xl"></iconify-icon>
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-zinc-100 font-semibold text-2xl tracking-tight">Olá, você está logado!</h1>
            <p className="text-sm font-light leading-relaxed">Sua conta foi verificada com sucesso. No momento, você não possui privilégios de <strong>ADMIN</strong> para acessar o painel de controle.</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all flex items-center space-x-2">
            <iconify-icon icon="solar:logout-linear"></iconify-icon>
            <span>Sair com segurança</span>
          </button>
        </div>
      )}
    </div>
  );
}