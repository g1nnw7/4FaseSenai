import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { agendarConsulta } from '../services/consultaServices';
import { getTodosMedicos } from '../services/usuarioService';
import StatusBadge from '../components/statusBadge';

const HORARIOS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({
    medico_id: '',
    data: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    horario: '',
    motivo: '',
    duracao_minutos: 30,
  });
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const { data } = await getTodosMedicos();
        setMedicos(data);
      } catch {
        toast.error('Erro ao carregar médicos');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const medicoSelecionado = medicos.find(m => m.id === Number(form.medico_id));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.medico_id || !form.data || !form.horario) {
      toast.error('Selecione médico, data e horário');
      return;
    }

    if (medicoSelecionado?.status !== 'disponivel') {
      toast.error('Este médico não está disponível para agendamentos');
      return;
    }

    const data_hora = `${form.data}T${form.horario}:00`;

    setSalvando(true);
    try {
      await agendarConsulta({
        medico_id: Number(form.medico_id),
        data_hora,
        motivo: form.motivo,
        duracao_minutos: Number(form.duracao_minutos),
      });
      toast.success('Consulta agendada com sucesso!');
      navigate('/consultas');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao agendar consulta');
    } finally {
      setSalvando(false);
    }
  }

  const hoje = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Agendar Consulta</h1>
        <p className="text-gray-500 text-sm mt-1">Escolha um médico disponível e um horário</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de médico */}
        <div>
          <label className="label">Médico</label>
          {carregando ? (
            <div className="input-field flex items-center gap-2 text-gray-500">
              <span className="w-4 h-4 border-2 border-gray-700 border-t-gray-500 rounded-full animate-spin" />
              Carregando médicos...
            </div>
          ) : (
            <select
              name="medico_id"
              value={form.medico_id}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Selecione um médico</option>
              {medicos.map(m => (
                <option
                  key={m.id}
                  value={m.id}
                  disabled={m.status !== 'disponivel'}
                >
                  Dr. {m.nome} — {m.especialidade} {m.status !== 'disponivel' ? `(${m.status.replace('_', ' ')})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Card do médico selecionado */}
        {medicoSelecionado && (
          <div className={`rounded-xl p-4 border flex items-center justify-between ${
            medicoSelecionado.status === 'disponivel'
              ? 'bg-neon-dark/10 border-neon-dark'
              : 'bg-red-900/10 border-red-900'
          }`}>
            <div>
              <p className="font-display font-medium text-white">Dr. {medicoSelecionado.nome}</p>
              <p className="text-sm text-gray-400">{medicoSelecionado.especialidade}</p>
            </div>
            <StatusBadge status={medicoSelecionado.status} />
          </div>
        )}

        {/* Data */}
        <div>
          <label className="label">Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            min={hoje}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Grade de horários */}
        <div>
          <label className="label">Horário</label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {HORARIOS.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, horario: h }))}
                className={`py-2 rounded-lg text-sm font-mono transition-all duration-150 border ${
                  form.horario === h
                    ? 'bg-neon-green text-dark-950 border-neon-green font-semibold shadow-neon-sm'
                    : 'bg-dark-700 text-gray-400 border-dark-600 hover:border-neon-dark hover:text-neon-green'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div>
          <label className="label">Duração</label>
          <select name="duracao_minutos" value={form.duracao_minutos} onChange={handleChange} className="input-field">
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>1 hora</option>
          </select>
        </div>

        {/* Motivo */}
        <div>
          <label className="label">Motivo <span className="text-gray-600 normal-case font-body">(opcional)</span></label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            placeholder="Descreva o motivo da consulta..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Resumo */}
        {form.medico_id && form.data && form.horario && (
          <div className="rounded-xl bg-dark-700 border border-dark-600 p-4 font-mono text-sm space-y-1">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">// Resumo do agendamento</p>
            <p><span className="text-gray-500">médico:</span> <span className="text-white">Dr. {medicoSelecionado?.nome}</span></p>
            <p><span className="text-gray-500">data:</span> <span className="text-neon-green">{form.data} às {form.horario}</span></p>
            <p><span className="text-gray-500">duração:</span> <span className="text-white">{form.duracao_minutos} min</span></p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/consultas')}
            className="btn-ghost flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || medicoSelecionado?.status !== 'disponivel'}
            className="btn-neon-solid flex-1"
          >
            {salvando ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-dark-950/40 border-t-dark-950 rounded-full animate-spin" />
                Agendando...
              </span>
            ) : 'Confirmar Agendamento'}
          </button>
        </div>
      </form>
    </div>
  );
}