import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api.js';
import toast from 'react-hot-toast';

export default function AdminCLTs() {
  const [clts, setClts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const fetchClts = () => {
    setLoading(true);
    api.get('/users?role=CLT')
      .then(res => setClts(res.data.users || []))
      .catch(() => toast.error('Erro ao carregar funcionários.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClts(); }, []);

  const handleEditOpen = (clt) => {
    setEditing(clt);
    setEditForm({ name: clt.name, email: clt.email, phone: clt.phone || '' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${editing.id}`, editForm);
      toast.success('Funcionário atualizado!');
      setEditing(null);
      fetchClts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users/clts', newForm);
      toast.success('Funcionário criado!');
      setCreating(false);
      setNewForm({ name: '', email: '', password: '', phone: '' });
      fetchClts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar funcionário.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remover o funcionário "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Funcionário removido.');
      fetchClts();
    } catch {
      toast.error('Erro ao remover funcionário.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Funcionários</h1>
            <p className="text-gray-500 font-body mt-1">{clts.length} funcionário(s) cadastrado(s)</p>
          </div>
          <button onClick={() => setCreating(true)} className="btn-primary">
            + Novo funcionário
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
          </div>
        ) : clts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-400 font-body mb-4">Nenhum funcionário cadastrado.</p>
            <button onClick={() => setCreating(true)} className="btn-primary">Adicionar funcionário</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clts.map(clt => (
              <div key={clt.id} className="card p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-900 rounded-xl flex items-center justify-center text-white font-display font-bold flex-shrink-0">
                    {clt.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-gray-900 truncate">{clt.name}</p>
                    <p className="text-sm text-gray-400 font-body truncate">{clt.email}</p>
                    {clt.phone && <p className="text-xs text-gray-400 font-body">{clt.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={clt.clt_status || 'indisponivel'} />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditOpen(clt)}
                      className="text-sm text-brand-900 hover:underline font-body font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(clt.id, clt.name)}
                      className="text-sm text-red-400 hover:text-red-600 hover:underline font-body"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">Editar funcionário</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Nome</label>
                <input className="input-field" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">E-mail</label>
                <input type="email" className="input-field" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Telefone</label>
                <input className="input-field" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
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

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setCreating(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">Novo funcionário CLT</h3>
              <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Nome completo</label>
                <input className="input-field" placeholder="Nome do funcionário" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">E-mail</label>
                <input type="email" className="input-field" placeholder="funcionario@email.com" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Telefone</label>
                <input className="input-field" placeholder="(48) 99999-0000" value={newForm.phone} onChange={e => setNewForm({ ...newForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Senha inicial</label>
                <input type="password" className="input-field" placeholder="mínimo 6 caracteres" value={newForm.password} onChange={e => setNewForm({ ...newForm, password: e.target.value })} required minLength={6} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCreating(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Criando...' : 'Criar funcionário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}