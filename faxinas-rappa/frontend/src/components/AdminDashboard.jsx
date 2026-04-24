import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatusBadge from '../../components/shared/StatusBadge';
import api from '../../services/api';

export default function AdminDashboard() {
  const [faxinas, setFaxinas] = useState([]);
  const [clts, setClts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/faxinas'),
      api.get('/users?role=CLT'),
    ])
      .then(([fRes, cRes]) => {
        setFaxinas(fRes.data.faxinas || []);
        setClts(cRes.data.users || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: faxinas.length,
    agendadas: faxinas.filter(f => f.status === 'agendada').length,
    emAndamento: faxinas.filter(f => f.status === 'em_andamento').length,
    concluidas: faxinas.filter(f => f.status === 'concluida').length,
  };

  const recentFaxinas = faxinas.slice(0, 6);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 font-body mt-1">Visão geral do sistema RAPPA</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total faxinas', value: stats.total, bg: 'bg-brand-900', text: 'text-white', sub: 'text-brand-200' },
            { label: 'Agendadas', value: stats.agendadas, bg: 'bg-blue-50', text: 'text-blue-900', sub: 'text-blue-400' },
            { label: 'Em andamento', value: stats.emAndamento, bg: 'bg-amber-50', text: 'text-amber-900', sub: 'text-amber-400' },
            { label: 'Concluídas', value: stats.concluidas, bg: 'bg-green-50', text: 'text-green-900', sub: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className={`card p-5 ${s.bg}`}>
              <p className={`font-display font-bold text-4xl ${s.text}`}>{s.value}</p>
              <p className={`text-sm font-body mt-1 ${s.sub}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent faxinas */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">Faxinas recentes</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {recentFaxinas.map(f => (
                  <div key={f.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-display font-medium text-gray-800">
                        {f.user_name} → {f.clt_name || 'Sem profissional'}
                      </p>
                      <p className="text-xs text-gray-400 font-body">
                        {f.scheduled_date?.split('T')[0]} às {f.scheduled_time?.slice(0,5)}
                      </p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                ))}
                {recentFaxinas.length === 0 && (
                  <p className="text-center text-gray-400 font-body py-4">Nenhuma faxina encontrada.</p>
                )}
              </div>
            )}
          </div>

          {/* CLT status */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">Funcionários</h2>
            <div className="space-y-3">
              {clts.map(clt => (
                <div key={clt.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-900 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                    {clt.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-medium text-gray-800 truncate">{clt.name}</p>
                  </div>
                  <StatusBadge status={clt.clt_status || 'indisponivel'} />
                </div>
              ))}
              {clts.length === 0 && (
                <p className="text-sm text-gray-400 font-body text-center py-4">Nenhum funcionário cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}