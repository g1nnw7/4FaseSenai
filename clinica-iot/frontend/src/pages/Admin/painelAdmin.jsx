import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { atualizarStatusMedico } from '../../services/usuarioService';
import StatusBadge from '../../components/statusBadge';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'disponivel',   label: 'Disponível',   desc: 'Aceitando novos agendamentos',   color: 'border-neon-dark text-neon-green hover:bg-neon-dark/20' },
  { value: 'em_consulta',  label: 'Em Consulta',  desc: 'Ocupado no momento',             color: 'border-yellow-800 text-yellow-400 hover:bg-yellow-900/20' },
  { value: 'indisponivel', label: 'Indisponível', desc: 'Fora do horário de atendimento', color: 'border-red-800 text-red-400 hover:bg-red-900/20' },
];

export default function PainelAdmin() {
  const { usuario, carregarUsuario } = useAuth();
  const [atualizando, setAtualizando] = useState(false);

  async function mudarStatus(novoStatus) {
    if (novoStatus === usuario?.status) return;
    setAtualizando(true);
    try {
      await atualizarStatusMedico(novoStatus);
      // Re-fetch do usuário para atualizar o estado global
      await carregarUsuario?.();
      // fallback: reload parcial via toast
      toast.success(`Status atualizado para: ${novoStatus.replace('_', ' ')}`);
      // Força atualização da página para refletir no navbar
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar status');
    } finally {
      setAtualizando(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Painel Administrativo</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-white">
          Olá, <span className="text-neon-green">Dr. {usuario?.nome?.split(' ')[0]}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">{usuario?.especialidade}</p>
      </div>

      {/* Status atual */}
      <div className="card-neon mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-white text-lg">Seu Status</h2>
            <p className="text-gray-500 text-sm mt-0.5">Controle sua disponibilidade para os pacientes</p>
          </div>
          <StatusBadge status={usuario?.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => mudarStatus(opt.value)}
              disabled={atualizando}
              className={`relative p-4 rounded-xl border text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${opt.color} ${
                usuario?.status === opt.value
                  ? 'ring-2 ring-current ring-offset-1 ring-offset-dark-800'
                  : 'border-opacity-50 opacity-70 hover:opacity-100'
              }`}
            >
              {usuario?.status === opt.value && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current animate-pulse" />
              )}
              <p className="font-display font-semibold text-sm">{opt.label}</p>
              <p className="text-xs opacity-70 mt-0.5 font-body">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ações rápidas */}
      <h2 className="font-display text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
        Acesso rápido
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/minhas-consultas" className="card group hover:border-neon-dark transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neon-dark/20 border border-neon-dark flex items-center justify-center mb-4">
                <span className="text-neon-green text-lg">📋</span>
              </div>
              <h3 className="font-display font-semibold text-white mb-1">Minha Agenda</h3>
              <p className="text-sm text-gray-500">Visualize e edite suas consultas agendadas</p>
            </div>
            <span className="text-gray-600 group-hover:text-neon-green transition-colors text-xl">→</span>
          </div>
        </Link>

        <Link to="/admin/todas-consultas" className="card group hover:border-neon-dark transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-800 flex items-center justify-center mb-4">
                <span className="text-blue-400 text-lg">🏥</span>
              </div>
              <h3 className="font-display font-semibold text-white mb-1">Todas as Consultas</h3>
              <p className="text-sm text-gray-500">Visão geral de todos os agendamentos da clínica</p>
            </div>
            <span className="text-gray-600 group-hover:text-neon-green transition-colors text-xl">→</span>
          </div>
        </Link>

        <Link to="/consultas" className="card group hover:border-neon-dark transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-900/20 border border-purple-800 flex items-center justify-center mb-4">
                <span className="text-purple-400 text-lg">👤</span>
              </div>
              <h3 className="font-display font-semibold text-white mb-1">Área do Paciente</h3>
              <p className="text-sm text-gray-500">Acesse a área comum como paciente</p>
            </div>
            <span className="text-gray-600 group-hover:text-neon-green transition-colors text-xl">→</span>
          </div>
        </Link>

        <Link to="/agendar" className="card group hover:border-neon-dark transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-yellow-900/20 border border-yellow-800 flex items-center justify-center mb-4">
                <span className="text-yellow-400 text-lg">📅</span>
              </div>
              <h3 className="font-display font-semibold text-white mb-1">Agendar Consulta</h3>
              <p className="text-sm text-gray-500">Marque uma consulta com outro médico</p>
            </div>
            <span className="text-gray-600 group-hover:text-neon-green transition-colors text-xl">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}