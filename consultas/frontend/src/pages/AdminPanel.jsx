import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultas = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      try {
        const res = await fetch('http://localhost:3000/api/admin/consultas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 403) {
          alert('Acesso negado. Apenas administradores.');
          navigate('/agendar');
          return;
        }

        const data = await res.json();
        setConsultas(data);
      } catch (err) {
        console.error('Erro ao buscar consultas', err);
      }
    };

    fetchConsultas();
  }, [navigate]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Visão do Administrador</h2>
        </div>
        
        <div className="bg-white border border-neutral-200 rounded-xl flex flex-col md:flex-row overflow-hidden min-h-[700px] shadow-sm">
          
          <aside className="w-full md:w-64 border-r border-neutral-200 bg-white flex flex-col flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-neutral-100">
              <span className="text-lg tracking-tighter font-semibold">AGND</span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 tracking-wider">ADMIN</span>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-neutral-100 text-neutral-900 rounded-md text-sm font-medium">
                <Icon icon="solar:calendar-linear" className="text-lg" />
                Consultas
                <span className="ml-auto bg-neutral-900 text-white text-[10px] py-0.5 px-1.5 rounded-full">{consultas.length}</span>
              </a>
            </nav>
            <div className="p-4 border-t border-neutral-100 cursor-pointer" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
               <span className="text-red-500 text-sm font-medium">Sair</span>
            </div>
          </aside>

          <main className="flex-1 flex flex-col bg-neutral-50/30">
            <header className="h-16 flex items-center justify-between px-8 border-b border-neutral-100 bg-white">
              <h2 className="text-lg font-medium tracking-tight text-neutral-900">Visão Geral</h2>
            </header>

            <div className="p-8 flex-1 overflow-auto">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100">
                  <h3 className="text-base font-medium text-neutral-900">Próximos Atendimentos</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/50 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                        <th className="px-6 py-3 font-medium">Paciente</th>
                        <th className="px-6 py-3 font-medium">Data</th>
                        <th className="px-6 py-3 font-medium">Contato</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-neutral-100">
                      {consultas.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-4 text-center text-neutral-500">Nenhuma consulta agendada.</td></tr>
                      ) : (
                        consultas.map(c => (
                          <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-neutral-900">{c.usuario_nome}</div>
                              <div className="text-xs text-neutral-500">{c.descricao}</div>
                            </td>
                            <td className="px-6 py-4 text-neutral-600">
                              {new Date(c.data).toLocaleString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{c.usuario_email}</td>
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
      </div>
    </section>
  );
}