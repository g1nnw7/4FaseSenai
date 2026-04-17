import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { getTodasConsultas } from '../../services/consultaServices';
import StatusBadge from '../../components/StatusBadge';

export default function TodasConsultas() {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroMedico, setFiltroMedico] = useState('todos');

  const carregar = useCallback(async () => {
    try {
      const { data } = await getTodasConsultas();
      setConsultas(data);
    } catch {
      toast.error('Erro ao carregar consultas');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // Médicos únicos para o filtro
  const medicos = [...new Map(consultas.map(c => [c.medico_id, c.medico_nome])).entries()];

  const filtradas = consultas.filter(c => {
    const matchBusca = !busca ||
      c.paciente_nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.medico_nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.motivo?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    const matchMedico = filtroMedico === 'todos' || String(c.medico_id) === filtroMedico;
    return matchBusca && matchStatus && matchMedico;
  });

  // Estatísticas rápidas
  const stats = {
    total: consultas.length,
    agendadas: consultas.filter(c => c.status === 'agendada').length,
    concluidas: consultas.filter(c => c.status === 'concluida').length,
    canceladas: consultas.filter(c => c.status === 'cancelada').length,
  };

  if (carregando) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-neon-dark border-t-neon-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-gray-500 bg-blue-900/20 border border-blue-800 px-2 py-0.5 rounded">
            SOMENTE LEITURA
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-white">Todas as Consultas</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da clínica — suas consultas podem ser editadas em "Minha Agenda"</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Agendadas', value: stats.agendadas, color: 'text-blue-400' },
          { label: 'Concluídas', value: stats.concluidas, color: 'text-neon-green' },
          { label: 'Canceladas', value: stats.canceladas, color: 'text-gray-500' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`font-display font-bold text-3xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por paciente, médico ou motivo..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="input-field flex-1"
        />
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="input-field sm:w-44"
        >
          <option value="todos">Todos status</option>
          <option value="agendada">Agendada</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <select
          value={filtroMedico}
          onChange={e => setFiltroMedico(e.target.value)}
          className="input-field sm:w-52"
        >
          <option value="todos">Todos médicos</option>
          {medicos.map(([id, nome]) => (
            <option key={id} value={String(id)}>Dr. {nome}</option>
          ))}
        </select>
      </div>

      {/* Contagem */}
      <p className="text-xs text-gray-500 font-mono mb-4">
        Mostrando {filtradas.length} de {consultas.length} consultas
      </p>

      {/* Tabela */}
      {filtradas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhuma consulta encontrada com os filtros aplicados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtradas.map(c => {
            const ehMinhaConsulta = c.medico_id === usuario?.id;
            return (
              <div
                key={c.id}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  ehMinhaConsulta
                    ? 'bg-neon-dark/5 border-neon-dark/50'
                    : 'bg-dark-800 border-dark-600'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Data compacta */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <p className="font-mono text-neon-green font-bold text-base leading-none">
                      {format(new Date(c.data_hora), 'dd')}
                    </p>
                    <p className="font-mono text-gray-600 text-xs uppercase">
                      {format(new Date(c.data_hora), 'MMM', { locale: ptBR })}
                    </p>
                    <p className="font-mono text-gray-500 text-xs mt-0.5">
                      {format(new Date(c.data_hora), 'HH:mm')}
                    </p>
                  </div>

                  {/* Divisor */}
                  <div className="hidden sm:block w-px h-10 bg-dark-600" />

                  {/* Info principal */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">Paciente</p>
                      <p className="text-sm text-white font-display font-medium truncate">{c.paciente_nome}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">Médico</p>
                      <p className={`text-sm font-display font-medium truncate ${ehMinhaConsulta ? 'text-neon-green' : 'text-gray-300'}`}>
                        Dr. {c.medico_nome} {ehMinhaConsulta && '(você)'}
                      </p>
                      <p className="text-xs text-gray-600">{c.medico_especialidade}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">Motivo</p>
                      <p className="text-sm text-gray-400 truncate">{c.motivo || '—'}</p>
                    </div>
                  </div>

                  {/* Status + duração */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono text-gray-600">{c.duracao_minutos}min</span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                {/* Observações */}
                {c.observacoes && (
                  <div className="mt-3 pt-3 border-t border-dark-600">
                    <p className="text-xs text-gray-500 truncate">
                      <span className="text-gray-600 uppercase font-mono tracking-wide mr-2">obs:</span>
                      {c.observacoes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}