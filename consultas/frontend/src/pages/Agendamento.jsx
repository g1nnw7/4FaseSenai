import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function Agendamento() {
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const navigate = useNavigate();

  const handleAgendar = async () => {
    if (!horarioSelecionado) return alert("Selecione um horário!");

    const token = localStorage.getItem('token');
    
    // Simulando que selecionou o dia 14 de Novembro com o horário clicado
    const dataAgendamento = new Date(`2023-11-14T${horarioSelecionado}:00`).toISOString();

    try {
      const res = await fetch('http://localhost:3000/api/consultas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Mandando o token para o Auth Middleware
        },
        body: JSON.stringify({ data: dataAgendamento, descricao: 'Consulta Clínica Geral' })
      });

      if (res.ok) {
        alert('Agendamento confirmado com sucesso!');
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.erro || 'Erro ao agendar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const horarios = ['09:45', '10:30', '11:15', '14:00', '14:45', '15:30'];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-16">
          <div className="text-xl tracking-tighter font-semibold">AGND</div>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-sm text-red-500 hover:text-red-700">Sair</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-24">
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-4">Agendar consulta</h1>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8">Selecione uma data e horário disponíveis.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <Icon icon="solar:clock-circle-linear" className="text-lg" />
                  <span>Duração: 45 minutos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-10">
              <h3 className="text-base font-medium text-neutral-900 mb-4">Horários disponíveis</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <button className="py-2 text-sm border border-neutral-200 rounded-md text-neutral-500 line-through cursor-not-allowed">09:00</button>
                {horarios.map(h => (
                  <button 
                    key={h}
                    onClick={() => setHorarioSelecionado(h)}
                    className={`py-2 text-sm border rounded-md font-medium transition-colors ${horarioSelecionado === h ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <button onClick={handleAgendar} className="w-full sm:w-auto px-8 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors">
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}