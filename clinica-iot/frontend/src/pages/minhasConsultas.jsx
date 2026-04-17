import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format, isPast, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { getMinhasConsultas, cancelarConsulta } from '../services/consultaServices';
import StatusBadge from '../components/statusBadge';
import Modal from '../components/Modal';

export default function MinhasConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(null); // id da consulta

  const carregar = useCallback(async () => {
    try {
      const { data } = await getMinhasConsultas();
      setConsultas(data);
    } catch {
      toast.error('Erro ao carregar consultas');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function podeCancelar(consulta) {
    if (consulta.status !== 'agendada') return false;
    const horas = differenceInHours(new Date(consulta.data_hora), new Date());
    return horas > 24;
  }

  async function confirmarCancelamento() {
    if (!modalConfirm) return;
    setCancelando(modalConfirm);
    try {
      await cancelarConsulta(modalConfirm);
      toast.success('Consulta cancelada com sucesso');
      setModalConfirm(null);
      carregar();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao cancelar consulta');
    } finally {
      setCancelando(null);
    }
  }

  const futuras = consultas.filter(c => c.status === 'agendada' && !isPast(new Date(c.data_hora)));
  const historico = consultas.filter(c => c.status !== 'agendada' || isPast(new Date(c.data_hora)));

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-neon-dark border-t-neon-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Minhas Consultas</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe seus agendamentos</p>
        </div>
        <Link to="/agendar" className="btn-neon-solid text-sm">
          + Nova Consulta
        </Link>
      </div>

      {/* Próximas consultas */}
      <section className="mb-10">
        <h2 className="font-display text-xs font-medium text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
          Próximas ({futuras.length})
        </h2>

        {futuras.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-500 mb-4">Nenhuma consulta agendada</p>
            <Link to="/agendar" className="btn-neon text-sm">Agendar agora</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {futuras.map(c => (
              <ConsultaCard
                key={c.id}
                consulta={c}
                podeCancelar={podeCancelar(c)}
                onCancelar={() => setModalConfirm(c.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Histórico */}
      {historico.length > 0 && (
        <section>
          <h2 className="font-display text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
            Histórico ({historico.length})
          </h2>
          <div className="space-y-3">
            {historico.map(c => (
              <ConsultaCard key={c.id} consulta={c} podeCancelar={false} historico />
            ))}
          </div>
        </section>
      )}

      {/* Modal de confirmação */}
      <Modal
        aberto={!!modalConfirm}
        onFechar={() => setModalConfirm(null)}
        titulo="Cancelar consulta"
      >
        <p className="text-gray-300 mb-6">
          Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setModalConfirm(null)} className="btn-ghost">
            Voltar
          </button>
          <button
            onClick={confirmarCancelamento}
            disabled={!!cancelando}
            className="btn-danger"
          >
            {cancelando ? 'Cancelando...' : 'Confirmar cancelamento'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function ConsultaCard({ consulta, podeCancelar, onCancelar, historico }) {
  const dataHora = new Date(consulta.data_hora);

  return (
    <div className={`card border transition-all duration-200 ${
      historico ? 'opacity-60 border-dark-600' : 'border-dark-600 hover:border-neon-dark'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* Data */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex flex-col items-center justify-center">
            <span className="font-mono text-neon-green text-lg font-bold leading-none">
              {format(dataHora, 'dd')}
            </span>
            <span className="font-mono text-gray-500 text-xs uppercase">
              {format(dataHora, 'MMM', { locale: ptBR })}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-display font-semibold text-white truncate">
                Dr. {consulta.medico_nome}
              </span>
              <StatusBadge status={consulta.status} />
            </div>
            <p className="text-sm text-gray-400">{consulta.medico_especialidade}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-mono">
              <span>{format(dataHora, "HH:mm 'h'")}</span>
              <span>•</span>
              <span>{consulta.duracao_minutos} min</span>
              {consulta.motivo && <><span>•</span><span className="truncate max-w-xs">{consulta.motivo}</span></>}
            </div>
          </div>
        </div>

        {podeCancelar && (
          <button onClick={onCancelar} className="btn-danger text-sm flex-shrink-0 self-start sm:self-center">
            Cancelar
          </button>
        )}
      </div>

      {/* Observações do médico */}
      {consulta.observacoes && (
        <div className="mt-4 pt-4 border-t border-dark-600">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-display mb-1">Observações do médico</p>
          <p className="text-sm text-gray-300">{consulta.observacoes}</p>
        </div>
      )}
    </div>
  );
}