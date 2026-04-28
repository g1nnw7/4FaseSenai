import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../contexts/AuthContexts';
import api from '../api.js';
import StatusBadge from '../components/StatusBadge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UserDashboard() {
  const { user } = useAuth();
  const [faxinas, setFaxinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faxinas/my')
      .then(res => setFaxinas(res.data.faxinas || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = faxinas.filter(f => f.status === 'agendada' || f.status === 'em_andamento');
  const past = faxinas.filter(f => f.status === 'concluida' || f.status === 'cancelada');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-body mt-1">Bem-vindo(a) de volta ao RAPPA.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de faxinas', value: faxinas.length, color: 'bg-brand-900', text: 'text-white' },
            { label: 'Agendadas', value: upcoming.length, color: 'bg-blue-50', text: 'text-blue-900' },
            { label: 'Concluídas', value: past.filter(f => f.status === 'concluida').length, color: 'bg-green-50', text: 'text-green-900' },
            { label: 'Canceladas', value: past.filter(f => f.status === 'cancelada').length, color: 'bg-red-50', text: 'text-red-900' },
          ].map(stat => (
            <div key={stat.label} className={`card p-5 ${stat.color}`}>
              <p className={`font-display font-bold text-3xl ${stat.text}`}>{stat.value}</p>
              <p className={`text-sm font-body mt-1 ${stat.color === 'bg-brand-900' ? 'text-brand-200' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/agendar" className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-brand-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-gray-900">Agendar faxina</p>
              <p className="text-sm text-gray-500 font-body">Escolha data, horário e profissional</p>
            </div>
          </Link>
          <Link to="/minhas-faxinas" className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-brand-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-gray-900">Minhas faxinas</p>
              <p className="text-sm text-gray-500 font-body">Visualize e gerencie seus agendamentos</p>
            </div>
          </Link>
        </div>

        {/* Upcoming faxinas */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">Próximas faxinas</h2>
            <div className="space-y-3">
              {upcoming.slice(0, 3).map(faxina => {
                const dateStr = faxina.scheduled_date?.split('T')[0];
                let formattedDate = dateStr;
                try { formattedDate = format(parseISO(dateStr), "dd MMM", { locale: ptBR }); } catch {}
                return (
                  <div key={faxina.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-brand-900 text-sm leading-none">{formattedDate.split(' ')[0]}</span>
                        <span className="text-brand-400 text-xs capitalize">{formattedDate.split(' ')[1]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm font-display">{faxina.scheduled_time?.slice(0,5)} · {faxina.duration_hours}h</p>
                        <p className="text-xs text-gray-500 font-body">{faxina.clt_name || 'Profissional a definir'}</p>
                      </div>
                    </div>
                    <StatusBadge status={faxina.status} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && faxinas.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-gray-700 text-lg mb-2">Nenhuma faxina ainda</h3>
            <p className="text-gray-400 font-body text-sm mb-5">Que tal agendar sua primeira faxina?</p>
            <Link to="/agendar" className="btn-primary inline-flex">Agendar agora</Link>
          </div>
        )}
      </div>
    </div>
  );
}