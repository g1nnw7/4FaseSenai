const configs = {
  // Faxina status
  agendada:     { label: 'Agendada',      bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-500' },
  em_andamento: { label: 'Em Andamento',  bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-500' },
  concluida:    { label: 'Concluída',     bg: 'bg-green-50',  text: 'text-green-700', dot: 'bg-green-500' },
  cancelada:    { label: 'Cancelada',     bg: 'bg-red-50',    text: 'text-red-700',   dot: 'bg-red-500' },
  // CLT status
  disponivel:   { label: 'Disponível',    bg: 'bg-green-50',  text: 'text-green-700', dot: 'bg-green-500' },
  em_faxina:    { label: 'Em Faxina',     bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-500' },
  indisponivel: { label: 'Indisponível',  bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400' },
  // Roles
  ADMIN:        { label: 'Admin',         bg: 'bg-brand-50',  text: 'text-brand-900', dot: 'bg-brand-900' },
  CLT:          { label: 'Funcionário',   bg: 'bg-indigo-50', text: 'text-indigo-700',dot: 'bg-indigo-500' },
  USER:         { label: 'Cliente',       bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400' },
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`status-badge ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}