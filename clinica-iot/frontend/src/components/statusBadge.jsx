const statusConfig = {
  // médico
  disponivel:    { label: 'Disponível',    cls: 'status-disponivel' },
  em_consulta:   { label: 'Em Consulta',   cls: 'status-em_consulta' },
  indisponivel:  { label: 'Indisponível',  cls: 'status-indisponivel' },
  // consulta
  agendada:      { label: 'Agendada',      cls: 'status-agendada' },
  concluida:     { label: 'Concluída',     cls: 'status-concluida' },
  cancelada:     { label: 'Cancelada',     cls: 'status-cancelada' },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? { label: status, cls: 'status-badge bg-gray-800 text-gray-400 border border-gray-700' };
  return <span className={cfg.cls}><span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />{cfg.label}</span>;
}