import React, { useState, useEffect } from 'react';

export default function RappaUI() {
  const [view, setView] = useState('auth'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [adminTab, setAdminTab] = useState('consultas'); 

  // Estados de Auth
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de Dados
  const [usuarios, setUsuarios] = useState([]);
  const [consultas, setConsultas] = useState([]);

  // ==========================================
  // PAGINAÇÃO
  // ==========================================
  const ITEMS_POR_PAGINA = 9;
  const [paginaAtualConsultas, setPaginaAtualConsultas] = useState(1);
  const [paginaAtualUsuarios, setPaginaAtualUsuarios] = useState(1);

  // Lógica para fatiar Consultas
  const indexOfLastConsulta = paginaAtualConsultas * ITEMS_POR_PAGINA;
  const indexOfFirstConsulta = indexOfLastConsulta - ITEMS_POR_PAGINA;
  const consultasPaginados = consultas.slice(indexOfFirstConsulta, indexOfLastConsulta);
  const totalPaginasConsultas = Math.ceil(consultas.length / ITEMS_POR_PAGINA);

  // Lógica para fatiar Usuários
  const indexOfLastUsuario = paginaAtualUsuarios * ITEMS_POR_PAGINA;
  const indexOfFirstUsuario = indexOfLastUsuario - ITEMS_POR_PAGINA;
  const usuariosPaginados = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);
  const totalPaginasUsuarios = Math.ceil(usuarios.length / ITEMS_POR_PAGINA);

  // ==========================================
  // ESTADOS DOS MODAIS (Formulários)
  // ==========================================
  const [modalConsultaOpen, setModalConsultaOpen] = useState(false);
  const [formConsulta, setFormConsulta] = useState({ id: null, nome: '', data_consulta: '', hora_consulta: '', status: 'Confirmada'});

  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [formUsuario, setFormUsuario] = useState({ id: null, nome: '', cpf: '', senha: '', role: 'USER' });

  // ==========================================
  // AUTH
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso(''); setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');
      
      localStorage.setItem('token', data.token);
      setCpf(''); setSenha('');
      
      if (data.usuario.role === 'ADMIN') setView('admin');
      else setView('user');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso(''); setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao registrar');
      
      setSucesso('Conta criada com sucesso! Faça login.');
      setAuthMode('login');
      setNome(''); setCpf(''); setSenha('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('auth'); 
    setUsuarios([]); 
    setConsultas([]);
    setPaginaAtualConsultas(1);
    setPaginaAtualUsuarios(1);
  };

  // ==========================================
  // CARREGAMENTO DE DADOS
  // ==========================================
  const carregarDados = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    if (adminTab === 'usuarios') {
      fetch('http://localhost:3000/usuarios', { headers })
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(err => console.error("Erro ao carregar usuários:", err));
    } else {
      fetch('http://localhost:3000/consultas', { headers })
        .then(res => res.json())
        .then(data => setConsultas(data))
        .catch(err => console.error("Erro ao carregar consultas:", err));
    }
  };

  useEffect(() => {
    if (view === 'admin') carregarDados();
  }, [view, adminTab]);

  // ==========================================
  // AÇÕES DE PRODUTOS
  // ==========================================
  const abrirModalConsulta = (consulta = null) => {
    if (consulta) setFormConsulta(consulta);
    else setFormConsulta({  id: null, nome: '', data_consulta: '', hora_consulta: '', status: 'Confirmada' });
    setModalConsultaOpen(true);
  };

  const salvarConsulta = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = formConsulta.id ? 'PUT' : 'POST';
    const url = formConsulta.id ? `http://localhost:3000/consultas/${formConsulta.id}` : 'http://localhost:3000/consultas';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formConsulta),
      });
      setModalConsultaOpen(false);
      carregarDados();
    } catch (error) {
      alert("Erro ao salvar consulta");
    }
  };

  const deletarConsulta = async (id) => {
    if(!window.confirm("Excluir este consulta?")) return;
    await fetch(`http://localhost:3000/consultas/${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    carregarDados();
  };

  // ==========================================
  // AÇÕES DE USUÁRIOS
  // ==========================================
  const abrirModalUsuario = (usuario) => {
    setFormUsuario({ ...usuario, senha: '' }); // Limpa a senha visualmente para não enviar lixo se não for alterar
    setModalUsuarioOpen(true);
  };

  const salvarUsuario = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${formUsuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formUsuario),
      });
      
      if (!response.ok) throw new Error("Falha na atualização");
      
      setModalUsuarioOpen(false);
      carregarDados();
    } catch (error) {
      alert("Erro ao salvar usuário. Verifique o console do back-end.");
      console.error(error);
    }
  };

  // ==========================================
  // ESTILOS
  // ==========================================
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Confirmado': return { bg: 'bg-emerald-500', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]', text: 'text-neutral-300' };
      case 'Pendente': return { bg: 'bg-amber-500', shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]', text: 'text-neutral-300' };
      case 'Cancelada': return { bg: 'bg-red-500', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]', text: 'text-red-400' };
      default: return { bg: 'bg-neutral-500', shadow: '', text: 'text-neutral-300' };
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-neutral-300 min-h-screen font-sans selection:bg-neutral-800 selection:text-white flex overflow-hidden antialiased">
      
      {/* ================= TELA DE LOGIN/REGISTER ================= */}
      {view === 'auth' && (
        <div className="flex w-full min-h-screen items-center justify-center p-4">
           <div className="w-full max-w-[400px] space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-neutral-100 font-semibold text-3xl tracking-tighter">RAPPA</h1>
              <p className="text-sm font-light text-neutral-400">Acesse a plataforma de gerenciamento.</p>
            </div>
            
            <form className="space-y-4" onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
              {erro && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">{erro}</div>}
              {sucesso && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg text-center">{sucesso}</div>}
              
              {authMode === 'register' && (
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome Completo" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 transition-all" />
              )}
              <input type="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required placeholder="Cpf" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 transition-all" />
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Senha" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 transition-all" />
              
              <button type="submit" disabled={loading} className="w-full bg-neutral-100 text-neutral-900 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-all mt-4 disabled:opacity-50">
                {loading ? 'Carregando...' : (authMode === 'login' ? 'Entrar' : 'Registrar')}
              </button>
            </form>
            <p className="text-center text-xs font-light text-neutral-500">
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setErro(''); setSucesso(''); }} className="text-neutral-300 font-medium hover:text-white">
                {authMode === 'login' ? 'Crie uma conta' : 'Voltar ao login'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ================= ADMIN PANEL ================= */}
      {view === 'admin' && (
        <>
          <aside className="w-64 border-r border-neutral-800/60 bg-[#0a0a0a] flex-col h-full hidden lg:flex shrink-0 z-20">
            <div className="h-14 flex items-center px-6 border-b border-neutral-800/60">
              <span className="text-lg font-semibold tracking-tighter text-neutral-100">RAPPA</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              <button onClick={() => { setAdminTab('consultas'); setPaginaAtualConsultas(1); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${adminTab === 'consultas' ? 'bg-neutral-800/60 text-neutral-100' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40'}`}>
                <iconify-icon icon="solar:box-linear" stroke-width="1.5" class="text-lg"></iconify-icon> Consultas
              </button>
              <button onClick={() => { setAdminTab('usuarios'); setPaginaAtualUsuarios(1); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${adminTab === 'usuarios' ? 'bg-neutral-800/60 text-neutral-100' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40'}`}>
                <iconify-icon icon="solar:users-group-rounded-linear" stroke-width="1.5" class="text-lg"></iconify-icon> Usuários
              </button>
            </nav>
            <div className="p-3 border-t border-neutral-800/60 mt-auto">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <iconify-icon icon="solar:logout-linear" stroke-width="1.5" class="text-lg"></iconify-icon> Sair
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col h-full relative min-w-0">
            <header className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-4 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
              <div className="text-sm text-neutral-500">Painel Admin</div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto space-y-6">
                
                {/* ================= ABA PRODUTOS ================= */}
                {adminTab === 'consultas' && (
                  <>
                    <div className="flex justify-between items-end gap-4 mb-6">
                      <div>
                        <h1 className="text-2xl font-semibold text-neutral-100">Consultas</h1>
                        <p className="text-sm text-neutral-500 mt-1">Gerencie seu catálogo de consultas</p>
                      </div>
                      <button onClick={() => abrirModalConsulta()} className="bg-neutral-100 text-neutral-900 hover:bg-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                        <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon> Adicionar
                      </button>
                    </div>

                    <div className="border border-neutral-800/60 rounded-lg bg-[#0c0c0c] flex flex-col overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-neutral-800/60 bg-neutral-900/40">
                            <th className="py-3 px-6 text-xs text-neutral-400 uppercase">Consulta</th>
                            <th className="py-3 px-4 text-xs text-neutral-400 uppercase">Status</th>
                            <th className="py-3 px-4 text-xs text-neutral-400 uppercase">Hora Consulta</th>
                            <th className="py-3 px-4 text-xs text-neutral-400 uppercase">Preço</th>
                            <th className="py-3 px-4 text-xs text-neutral-400 uppercase text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {consultasPaginados.map((prod) => {
                            const style = getStatusStyle(prod.status);
                            return (
                              <tr key={prod.id} className="hover:bg-neutral-800/30">
                                <td className="py-3.5 px-6">
                                  <div className="text-sm font-medium text-neutral-200">{prod.nome}</div>
                                  <div className="text-xs text-neutral-500">{prod.motivo} · {prod.data_consulta}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border border-neutral-700/80 bg-neutral-800/50 flex items-center gap-1 w-max ${style.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${style.bg}`}></span> {prod.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-sm text-neutral-400">{prod.hora_consulta} unid.</td>
                                <td className="py-3.5 px-4 text-sm text-neutral-300 font-medium">
                                  {Number(prod.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button onClick={() => abrirModalConsulta(prod)} className="p-1.5 text-neutral-400 hover:text-white mr-2"><iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon></button>
                                  <button onClick={() => deletarConsulta(prod.id)} className="p-1.5 text-neutral-400 hover:text-red-400"><iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon></button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* PAGINAÇÃO DE PRODUTOS */}
                    {totalPaginasConsultas > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        {Array.from({ length: totalPaginasConsultas }, (_, i) => i + 1).map(numero => (
                          <button
                            key={numero}
                            onClick={() => setPaginaAtualConsultas(numero)}
                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                              paginaAtualConsultas === numero 
                                ? 'bg-neutral-200 text-black' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                            }`}
                          >
                            {numero}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ================= ABA USUÁRIOS ================= */}
                {adminTab === 'usuarios' && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-semibold text-neutral-100">Usuários</h1>
                      <p className="text-sm text-neutral-500 mt-1">Gerencie os acessos ao sistema</p>
                    </div>
                    
                    <div className="border border-neutral-800/60 rounded-lg bg-[#0c0c0c] overflow-hidden">
                       <table className="w-full text-left">
                         <thead className="bg-neutral-900/40 border-b border-neutral-800/60">
                           <tr>
                             <th className="px-6 py-3 text-xs text-neutral-400 uppercase">Nome</th>
                             <th className="px-6 py-3 text-xs text-neutral-400 uppercase">Cpf</th>
                             <th className="px-6 py-3 text-xs text-neutral-400 uppercase">Cargo</th>
                             <th className="px-6 py-3 text-xs text-neutral-400 uppercase text-right">Ações</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-800/60 text-sm">
                           {usuariosPaginados.map(u => (
                             <tr key={u.id} className="hover:bg-neutral-800/30">
                               <td className="px-6 py-4 text-neutral-200">{u.nome}</td>
                               <td className="px-6 py-4 text-neutral-400">{u.cpf}</td>
                               <td className="px-6 py-4">
                                 {u.role === 'ADMIN' ? <span className="text-emerald-400 text-xs border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">Admin</span> : <span className="text-neutral-500 text-xs border border-neutral-700 bg-neutral-800/50 px-2 py-1 rounded">User</span>}
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button onClick={() => abrirModalUsuario(u)} className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 bg-neutral-800 rounded transition-colors text-xs flex items-center gap-1 ml-auto">
                                    <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon> Editar
                                  </button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>

                    {/* PAGINAÇÃO DE USUÁRIOS */}
                    {totalPaginasUsuarios > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        {Array.from({ length: totalPaginasUsuarios }, (_, i) => i + 1).map(numero => (
                          <button
                            key={numero}
                            onClick={() => setPaginaAtualUsuarios(numero)}
                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                              paginaAtualUsuarios === numero 
                                ? 'bg-neutral-200 text-black' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                            }`}
                          >
                            {numero}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      )}

      {/* ================= MODAL DE PRODUTO ================= */}
      {modalConsultaOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 w-full max-w-md rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">{formConsulta.id ? 'Editar Consulta' : 'Novo Consulta'}</h2>
            <form onSubmit={salvarConsulta} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Nome do Paciente</label>
                <input type="text" value={formConsulta.nome} onChange={e => setFormConsulta({...formConsulta, nome: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs text-neutral-500 mb-1 block">Motivo</label>
                  <input type="text" value={formConsulta.motivo} onChange={e => setFormConsulta({...formConsulta, motivo: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-neutral-500 mb-1 block">Data Consulta</label>
                  <input type="date" value={formConsulta.data_consulta} onChange={e => setFormConsulta({...formConsulta, data_consulta: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="text-xs text-neutral-500 mb-1 block">Status</label>
                  <select value={formConsulta.status} onChange={e => setFormConsulta({...formConsulta, status: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors">
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-xs text-neutral-500 mb-1 block">Hora Consulta</label>
                  <input type="time" value={formConsulta.hora_consulta} onChange={e => setFormConsulta({...formConsulta, hora_consulta: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
                </div>
                <div className="w-1/3">
                  <label className="text-xs text-neutral-500 mb-1 block">Preço (R$)</label>
                  <input type="number" step="0.01" value={formConsulta.preco} onChange={e => setFormConsulta({...formConsulta, preco: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-800">
                <button type="button" onClick={() => setModalConsultaOpen(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-neutral-100 text-black text-sm font-medium rounded hover:bg-white transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE USUÁRIO ================= */}
      {modalUsuarioOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 w-full max-w-md rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Editar Usuário</h2>
            <form onSubmit={salvarUsuario} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Nome Completo</label>
                <input type="text" value={formUsuario.nome} onChange={e => setFormUsuario({...formUsuario, nome: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Cpf de Acesso</label>
                <input type="cpf" value={formUsuario.cpf} onChange={e => setFormUsuario({...formUsuario, cpf: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors" required />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Nível de Acesso (Role)</label>
                <select value={formUsuario.role} onChange={e => setFormUsuario({...formUsuario, role: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors">
                  <option value="USER">Usuário Padrão (USER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Nova Senha</label>
                <input type="password" value={formUsuario.senha} onChange={e => setFormUsuario({...formUsuario, senha: e.target.value})} placeholder="Deixe em branco para não alterar" className="w-full bg-neutral-900 border border-neutral-800 rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-800">
                <button type="button" onClick={() => setModalUsuarioOpen(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium rounded hover:bg-emerald-400 transition-colors">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}