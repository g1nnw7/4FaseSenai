import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api.js';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['agendada', 'em_andamento', 'concluida', 'cancelada'];

export default function AdminFaxinas() {
  const [faxinas, setFaxinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchFaxinas = () => {
    setLoading(true);
    api.get('/faxinas')
      .then(res => setFaxinas(res.data.faxinas || []))
      .catch(() => toast.error('Erro ao carregar faxinas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaxinas(); }, []);

  const handleEditOpen = (faxina) => {
    setEditing(faxina);
    setEditForm({
      status: faxina.status,
      scheduled_date: faxina.scheduled_date?.split('T')[0],
      scheduled_time: faxina.scheduled_time?.slice(0, 5),
      duration_hours: faxina.duration_hours,
      observations: faxina.observations || '',
      price: faxina.price || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/faxinas/${editing.id}`, {
        status: editForm.status,
        scheduled_date: editForm.scheduled_date,
        scheduled_time: editForm.scheduled_time,
        duration_hours: editForm.duration_hours,
        observations: editForm.observations,
        price: editForm.price || null,
      });
      toast.success('Faxina atualizada!');
      setEditing(null);
      fetchFaxinas();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === 'todas' ? faxinas : faxinas.filter(f => f.status === filter);

  const tabs = [
    { key: 'todas', label: 'Todas', count: faxinas.length },
    { key: 'agendada', label: 'Agendadas', count: faxinas.filter(f => f.status === 'agendada').length },
    { key: 'em_andamento', label: 'Em andamento', count: faxinas.filter(f => f.status === 'em_andamento').length },
    { key: 'concluida', label: 'Concluídas', count: faxinas.filter(f => f.status === 'concluida').length },
    { key: 'cancelada', label: 'Canceladas', count: faxinas.filter(f => f.status === 'cancelada').length },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">Faxinas</h1>
          <p className="text-gray-500 font-body mt-1">Gerencie todos os agendamentos</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                filter === tab.key
                  ? 'bg-brand-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 font-body">Nenhuma faxina encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-body text-gray-400">#{f.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800 font-display">{f.user_name}</p>
                        <p className="text-xs text-gray-400 font-body">{f.user_phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800 font-display">{f.clt_name || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-body text-gray-700">{f.scheduled_date?.split('T')[0]}</p>
                        <p className="text-xs text-gray-400 font-body">{f.scheduled_time?.slice(0, 5)} · {f.duration_hours}h</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-body text-gray-600 capitalize">{f.property_type}</td>
                      <td className="px-5 py-4"><StatusBadge status={f.status} /></td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleEditOpen(f)}
                          className="text-sm text-brand-900 hover:text-brand-700 font-body font-medium hover:underline"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">Editar faxina #{editing.id}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Status</label>
                <select className="input-field" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Data</label>
                  <input type="date" className="input-field" value={editForm.scheduled_date} onChange={e => setEditForm({ ...editForm, scheduled_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Horário</label>
                  <input type="time" className="input-field" value={editForm.scheduled_time} onChange={e => setEditForm({ ...editForm, scheduled_time: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Duração (h)</label>
                  <input type="number" min={1} max={12} className="input-field" value={editForm.duration_hours} onChange={e => setEditForm({ ...editForm, duration_hours: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Valor (R$)</label>
                  <input type="number" step="0.01" className="input-field" placeholder="0,00" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Observações</label>
                <textarea className="input-field resize-none" rows={3} value={editForm.observations} onChange={e => setEditForm({ ...editForm, observations: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}