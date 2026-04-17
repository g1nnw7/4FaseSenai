import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { getMinhasConsultasDoctor, editarConsulta } from '../../services/consultaServices';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/modal';

const STATUS_CONSULTA = ['agendada', 'concluida', 'cancelada'];

export default function MinhasConsultasDoctor() {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);        // consulta sendo editada
  const [formEdit, setFormEdit] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const carregar = useCallback(async () => {
    try {
      const { data } = await getMinhasConsultasDoctor();
      setConsultas(data);
    } catch {
      toast.error('Erro ao carregar suas consultas');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function abrirEdicao(consulta) {
    setEditando(consulta);
    setFormEdit({
      status: consulta.status,
      observacoes: consulta.observacoes || '',
      data_hora: format(new Date(consulta.data_hora), "yyyy-MM-dd'T'HH:mm"),
      duracao_minutos: consulta.duracao_minutos,
    });
  }

  async function salvarEdicao() {
    setSalvando(true);
    try {
      await editarConsulta(editando.id, formEdit);
      toast.success('Consulta atualizada com sucesso!');
      setEditando(null);
      carregar();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar consulta');
    } finally {
      setSalvando(false);
    }
  }

  const consultasFiltradas = filtroStatus === 'todos'
    ? consultas
    : consultas.filter(c => c.status === filtroStatus);

  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-neon-dark border-t-neon-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Minha Agenda</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas consultas</p>
        </div>
        <span className="font-mono text-sm text-gray-500 bg-dark-800 border border-dark-600 px-3 py-1.5 rounded-lg">
          {consultas.length} consultas
        </span>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['todos', ...STATUS_CONSULTA].map(s => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-display transition-all duration-150 border ${
              filtroStatus === s
                ? 'bg-neon-green text-dark-950 border-neon-green font-semibold'
                : 'bg-transparent text-gray-400 border-dark-600 hover:border-gray-500'
            }`}
          >
            {s === 'todos' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista */}
      {consultasFiltradas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhuma consulta encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultasFiltradas.map(c => (
            <div key={c.id} className="card border border-dark-600 hover:border-neon-dark transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  {/* Data */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex flex-col items-center justify-center">
                    <span className="font-mono text-neon-green text-lg font-bold leading-none">
                      {format(new Date(c.data_hora), 'dd')}
                    </span>
                    <span className="font-mono text-gray-500 text-xs uppercase">
                      {format(new Date(c.data_hora), 'MMM', { locale: ptBR })}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-display font-semibold text-white">{c.paciente_nome}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {format(new Date(c.data_hora), "HH:mm 'h'")} • {c.duracao_minutos} min
                    </p>
                    {c.motivo && <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">{c.motivo}</p>}
                    {c.observacoes && (
                      <p className="text-xs text-neon-dim mt-1 truncate max-w-xs">📝 {c.observacoes}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => abrirEdicao(c)}
                  className="btn-neon text-sm flex-shrink-0 self-start sm:self-center"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edição */}
      <Modal
        aberto={!!editando}
        onFechar={() => setEditando(null)}
        titulo={`Editar consulta — ${editando?.paciente_nome}`}
      >
        {editando && (
          <div className="space-y-5">
            <div>
              <label className="label">Status</label>
              <select
                value={formEdit.status}
                onChange={e => setFormEdit(p => ({ ...p, status: e.target.value }))}
                className="input-field"
              >
                {STATUS_CONSULTA.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Data e Hora</label>
              <input
                type="datetime-local"
                value={formEdit.data_hora}
                onChange={e => setFormEdit(p => ({ ...p, data_hora: e.target.value }))}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Duração (minutos)</label>
              <select
                value={formEdit.duracao_minutos}
                onChange={e => setFormEdit(p => ({ ...p, duracao_minutos: Number(e.target.value) }))}
                className="input-field"
              >
                {[15, 30, 45, 60].map(d => (
                  <option key={d} value={d}>{d} minutos</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Observações</label>
              <textarea
                value={formEdit.observacoes}
                onChange={e => setFormEdit(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Notas clínicas, prescrições, recomendações..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditando(null)} className="btn-ghost flex-1">
                Cancelar
              </button>
              <button onClick={salvarEdicao} disabled={salvando} className="btn-neon-solid flex-1">
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}