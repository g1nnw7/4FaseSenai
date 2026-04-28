import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import FaxinaCard from '../components/FaxinaCard.jsx';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContexts';
import api from '../api.js';
import toast from 'react-hot-toast';

const CLT_STATUSES = [
  { value: 'disponivel', label: 'Disponível', desc: 'Pronto para receber faxinas' },
  { value: 'em_faxina', label: 'Em faxina', desc: 'Atualmente realizando serviço' },
  { value: 'indisponivel', label: 'Indisponível', desc: 'Não disponível no momento' },
];

const FAXINA_STATUS_OPTIONS = ['agendada', 'em_andamento', 'concluida', 'cancelada'];

export default function CltDashboard() {
  const { user, updateUser } = useAuth();
  const [faxinas, setFaxinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(user?.clt_status || 'disponivel');
  const [filter, setFilter] = useState('todas');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchFaxinas = () => {
    setLoading(true);
    api.get('/faxinas/clt/my')
      .then(res => setFaxinas(res.data.faxinas || []))
      .catch(() => toast.error('Erro ao carregar faxinas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaxinas(); }, []);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    setUpdatingStatus(true);
    try {
      await api.patch('/users/me/status', { status: newStatus });
      setCurrentStatus(newStatus);
      updateUser({ clt_status: newStatus });
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditOpen = (faxina) => {
    setEditing(faxina);
    setEditForm({
      status: faxina.status,
      observations: faxina.observations || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/faxinas/${editing.id}/clt`, editForm);
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

  const stats = {
    total: faxinas.length,
    agendadas: faxinas.filter(f => f.status === 'agendada').length,
    emAndamento: faxinas.filter(f => f.status === 'em_andamento').length,
    concluidas: faxinas.filter(f => f.status === 'concluida').length,
  };

  const statusColorMap = {
    disponivel: 'border-green-400 bg-green-50',
    em_faxina: 'border-amber-400 bg-amber-50',
    indisponivel: 'border-gray-300 bg-gray-50',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-body mt-1">Painel do funcionário</p>
        </div>

        {/* Status selector */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg text-gray-900">Seu status atual</h2>
              <p className="text-sm text-gray-400 font-body">Clientes só podem agendar com funcionários disponíveis</p>
            </div>
            <StatusBadge status={currentStatus} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CLT_STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => handleStatusChange(s.value)}
                disabled={updatingStatus}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  currentStatus === s.value
                    ? statusColorMap[s.value] + ' border-opacity-100'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <p className={`font-display font-semibold text-sm ${
                  currentStatus === s.value
                    ? s.value === 'disponivel' ? 'text-green-800'
                      : s.value === 'em_faxina' ? 'text-amber-800'
                      : 'text-gray-600'
                    : 'text-gray-700'
                }`}>
                  {s.label}
                </p>
                <p className="text-xs text-gray-400 font-body mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, bg: 'bg-brand-900', text: 'text-white', sub: 'text-brand-200' },
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

        {/* Faxinas list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-800">Minhas faxinas</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'agendada', label: 'Agendadas' },
              { key: 'em_andamento', label: 'Em andamento' },
              { key: 'concluida', label: 'Concluídas' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-brand-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-400 font-body">Nenhuma faxina encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(faxina => (
                <FaxinaCard
                  key={faxina.id}
                  faxina={faxina}
                  actions={
                    faxina.status !== 'concluida' && faxina.status !== 'cancelada' ? (
                      <button
                        onClick={() => handleEditOpen(faxina)}
                        className="text-sm text-brand-900 hover:text-brand-700 font-body font-medium border border-brand-200 hover:border-brand-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Atualizar status
                      </button>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">Atualizar faxina #{editing.id}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Status da faxina</label>
                <select className="input-field" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  {FAXINA_STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Observações</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Anotações sobre o serviço..."
                  value={editForm.observations}
                  onChange={e => setEditForm({ ...editForm, observations: e.target.value })}
                />
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