import StatusBadge from './StatusBadge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FaxinaCard({ faxina, actions }) {
  const dateStr = faxina.scheduled_date?.split('T')[0] || faxina.scheduled_date;

  const formattedDate = (() => {
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch { return dateStr; }
  })();

  return (
    <div className="card p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-display font-semibold text-gray-900 text-base">
            {formattedDate}
          </p>
          <p className="text-sm text-gray-500 font-body mt-0.5">
            {faxina.scheduled_time?.slice(0, 5)} · {faxina.duration_hours}h de serviço
          </p>
        </div>
        <StatusBadge status={faxina.status} />
      </div>

      <div className="space-y-2 text-sm font-body">
        {faxina.clt_name && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{faxina.clt_name}</span>
          </div>
        )}
        {faxina.user_name && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Cliente: {faxina.user_name}</span>
          </div>
        )}
        {faxina.street && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{faxina.street}, {faxina.number} — {faxina.neighborhood}</span>
          </div>
        )}
        {faxina.property_type && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="capitalize">{faxina.property_type}{faxina.square_meters ? ` · ${faxina.square_meters}m²` : ''}</span>
          </div>
        )}
      </div>

      {faxina.observations && (
        <p className="mt-3 text-xs text-gray-400 italic font-body border-t border-gray-50 pt-3">
          "{faxina.observations}"
        </p>
      )}

      {actions && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}