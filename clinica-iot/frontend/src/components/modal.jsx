import { useEffect } from 'react';

export default function Modal({ aberto, onFechar, titulo, children, largura = 'max-w-lg' }) {
  useEffect(() => {
    if (aberto) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onFechar}
      />
      {/* Dialog */}
      <div className={`relative w-full ${largura} bg-dark-800 border border-neon-dark rounded-2xl shadow-neon animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="font-display font-semibold text-white text-lg">{titulo}</h2>
          <button
            onClick={onFechar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-neon-green hover:bg-neon-dark/20 transition-all"
          >
            ✕
          </button>
        </div>
        {/* Conteúdo */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}