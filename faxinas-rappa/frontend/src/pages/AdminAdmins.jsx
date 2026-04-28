import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContexts';
import api from '../api.js';
import toast from 'react-hot-toast';

export default function AdminAdmins() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    api.get('/users?role=ADMIN')
      .then(res => setAdmins(res.data.users || []))
      .catch(() => toast.error('Erro ao carregar administradores.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${editing.id}`, editForm);
      toast.success('Administrador atualizado!');
      setEditing(null);
      fetchAdmins();
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
      await api.post('/users/admins', newForm);
      toast.success('Administrador criado!');
      setCreating(false);
      setNewForm({ name: '', email: '', password: '', phone: '' });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar administrador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (id === currentUser.id) {
      toast.error('Você não pode remover a sua própria conta.');
      return;
    }
    if (!confirm(`Remover o administrador "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Administrador removido.');
      fetchAdmins();
    } catch {
      toast.error('Erro ao remover administrador.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Administradores</h1>
            <p className="text-gray-500 font-body mt-1">{admins.length} admin(s) cadastrado(s)</p>
          </div>
          <button onClick={() => setCreating(true)} className="btn-primary">
            + Novo administrador
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Administrador</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Cadastro</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map(admin => (
                  <tr key={admin.id} className={`hover:bg-gray-50 transition-colors ${admin.id === currentUser.id ? 'bg-brand-50/40' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-900 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-display font-semibold text-gray-900">
                            {admin.name}
                            {admin.id === currentUser.id && (
                              <span className="ml-2 text-xs text-brand-400 font-body">(você)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 font-body">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-body text-gray-600">{admin.phone || '—'}</td>
                    <td className="px-5 py-4 text-sm font-body text-gray-500">
                      {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status="ADMIN" /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditing(admin); setEditForm({ name: admin.name, email: admin.email, phone: admin.phone || '' }); }}
                          className="text-sm text-brand-900 hover:underline font-body font-medium"
                        >
                          Editar
                        </button>
                        {admin.id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(admin.id, admin.name)}
                            className="text-sm text-red-400 hover:text-red-600 hover:underline font-body"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 font-body">Nenhum administrador encontrado.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">Editar administrador</h3>
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
              <h3 className="font-display font-bold text-xl text-gray-900">Novo administrador</h3>
              <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Nome completo</label>
                <input className="input-field" placeholder="Nome do administrador" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">E-mail</label>
                <input type="email" className="input-field" placeholder="admin@rappa.com" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} required />
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
                  {saving ? 'Criando...' : 'Criar admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}