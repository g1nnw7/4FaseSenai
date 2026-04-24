import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import FaxinaCard from '../../components/shared/FaxinaCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MinhasFaxinas() {
  const [faxinas, setFaxinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

  const fetchFaxinas = () => {
    setLoading(true);
    api.get('/faxinas/my')
      .then(res => setFaxinas(res.data.faxinas || []))
      .catch(() => toast.error('Erro ao carregar faxinas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaxinas(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta faxina?')) return;
    try {
      await api.patch(`/faxinas/${id}/cancel`);
      toast.success('Faxina cancelada.');
      fetchFaxinas();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao cancelar.');
    }
  };

  const canCancel = (faxina) => {
    if (faxina.status !== 'agendada') return false;
    const scheduled = new Date(`${faxina.scheduled_date?.split('T')[0]}T${faxina.scheduled_time}`);
    const diff = (scheduled - new Date()) / (1000 * 60 * 60);
    return diff > 24;
  };

  const filtered = filter === 'todas' ? faxinas : faxinas.filter(f => f.status === filter);

  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'agendada', label: 'Agendadas' },
    { key: 'em_andamento', label: 'Em andamento' },
    { key: 'concluida', label: 'Concluídas' },
    { key: 'cancelada', label: 'Canceladas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Minhas faxinas</h1>
            <p className="text-gray-500 font-body mt-1">{faxinas.length} agendamento(s) encontrado(s)</p>
          </div>
          <Link to="/agendar" className="btn-primary text-sm">+ Agendar</Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
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
            <Link to="/agendar" className="btn-primary inline-flex mt-4 text-sm">Agendar agora</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(faxina => (
              <FaxinaCard
                key={faxina.id}
                faxina={faxina}
                actions={
                  canCancel(faxina) ? (
                    <button
                      onClick={() => handleCancel(faxina.id)}
                      className="text-sm text-red-500 hover:text-red-700 font-body font-medium border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Cancelar faxina
                    </button>
                  ) : faxina.status === 'agendada' ? (
                    <span className="text-xs text-gray-400 font-body">Cancelamento disponível até 24h antes</span>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}